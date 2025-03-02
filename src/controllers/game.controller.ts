import { Request, Response, RequestHandler } from "express";
import { supabase } from "../config/supabase";
import crypto from "crypto";

export class GameController {
  private async getTotalDestinations() {
    const { count } = await supabase
      .from("destinations")
      .select("*", { count: 'exact', head: true });
    return count || 0;
  }
  
  startGame: RequestHandler = async (req, res) => {
    try {
    
      const { userId } = req.body;


      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      // Verify user exists
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const shareCode = crypto.randomBytes(4).toString("hex");
      const totalQuestions = await this.getTotalDestinations();

      const { data, error } = await supabase
        .from("game_sessions")
        .insert([
          {
            user_id: userId,
            share_code: shareCode,
            total_questions: totalQuestions,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error("Error in startGame:", error);
      res.status(500).json({ error: "Failed to start game" });
    }
  };

  submitAnswer: RequestHandler = async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { destinationId, answer, timeTaken } = req.body;

      // Get correct answer
      const { data: destination, error: destError } = await supabase
        .from("destinations")
        .select("city, country")
        .eq("id", destinationId)
        .single();

      if (destError) throw destError;

      const isCorrect =
        `${destination.city}, ${destination.country}` === answer;

      // Record the answer
      const { data: round, error: roundError } = await supabase
        .from("game_rounds")
        .insert([
          {
            session_id: sessionId,
            destination_id: destinationId,
            user_answer: answer,
            is_correct: isCorrect,
            time_taken: timeTaken,
          },
        ])
        .select()
        .single();

      if (roundError) throw roundError;

      // Get updated rounds count and correct answers
      const { data: rounds, error: roundsError } = await supabase
        .from("game_rounds")
        .select("is_correct")
        .eq("session_id", sessionId);

      if (roundsError) throw roundsError;

      const correctAnswers = rounds?.filter((r) => r.is_correct).length || 0;

      // Update session with new stats
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({
          score: isCorrect ? (correctAnswers || 0) * 20 : undefined,
          correct_answers: correctAnswers,
        })
        .eq("id", sessionId);

      if (updateError) throw updateError;

      res.json({
        isCorrect,
        round,
        stats: {
          correct_answers: correctAnswers,
          total_attempts: rounds?.length || 0,
        },
      });
    } catch (error) {
      console.error("Error in submitAnswer:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  };

  endGame: RequestHandler = async (req, res) => {
    try {
      const { sessionId } = req.params;

      // Get session details
      const { data: session, error: sessionError } = await supabase
        .from("game_sessions")
        .select("*, users(*)")
        .eq("id", sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Update user stats using raw SQL expressions
      const { error: updateError } = await supabase.rpc("update_user_stats", {
        user_id: session.user_id,
        game_score: session.score,
      });

      if (updateError) throw updateError;

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to end game" });
    }
  };

  getSharedGame: RequestHandler = async (req, res) => {
    try {
      const { shareCode } = req.params;
      const { data, error } = await supabase
        .from("game_sessions")
        .select(
          `
          *,
          user:users!game_sessions_user_id_fkey (
            id,
            username
          ),
          rounds:game_rounds (
            is_correct,
            time_taken
          )
        `
        )
        .eq("share_code", shareCode)
        .single();

      console.log("Shared game data:", data);

      if (error) throw error;

      if (!data) {
        res.status(404).json({ error: "Shared game not found" });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("Error in getSharedGame:", error);
      res.status(500).json({ error: "Failed to fetch shared game" });
    }
  };

  getGame: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;

      // Get current game session with more detailed data
      const { data: session, error: sessionError } = await supabase
        .from("game_sessions")
        .select(
          `
          *,
          user:users!game_sessions_user_id_fkey (
            id,
            username
          ),
          rounds:game_rounds!game_rounds_session_id_fkey ( 
            id,
            is_correct,
            destination_id,
            user_answer,
            time_taken
          )
        `
        )
        .eq("id", id)
        .single();

      if (sessionError) throw sessionError;
      if (!session) {
        res.status(404).json({ error: "Game session not found" });
        return;
      }

      // Debug logs
      console.log("Session data:", {
        id: session.id,
        rounds: session.rounds?.length,
        roundsData: session.rounds,
      });

      const rounds = session.rounds || [];
      const totalAttempts = rounds.length;
      const correctAnswers = rounds.filter(
        (r: { is_correct: boolean }) => r.is_correct
      ).length;

      const totalDestinations = await this.getTotalDestinations();

      // Check if game is complete
      if (totalAttempts >= totalDestinations) {
        const gameState = {
          ...session,
          is_completed: true,
          correct_answers: correctAnswers,
          total_questions: totalDestinations,
          rounds,
        };
        res.json(gameState);
        return;
      }

      // Get current round info
      const { data: currentDestination, error: destError } = await supabase
        .from("destinations")
        .select("*")
        .not(
          "id",
          "in",
          `(${
            rounds
              .map((r: { destination_id: string }) => r.destination_id)
              .join(",") || ""
          })`
        )
        .limit(1)
        .order("id", { ascending: false })
        .single();

      if (destError || !currentDestination) {
        // No more questions available, send summary
        const gameState = {
          ...session,
          is_completed: true,
          correct_answers: correctAnswers,
          total_questions: totalDestinations,
          rounds,
        };
        res.status(404).json({
          error: "No more questions available",
          gameState,
        });
        return;
      }

      // Continue with normal game state
      const gameState = {
        ...session,
        is_completed: false,
        correct_answers: correctAnswers,
        total_questions: totalDestinations,
        rounds,
        current_round: {
          id: crypto.randomUUID(),
          destination: {
            id: currentDestination.id,
            city: currentDestination.city,
            country: currentDestination.country,
            clues: currentDestination.clues || [],
            fun_fact: currentDestination.fun_facts || [],
            trivia: currentDestination.trivia || [],
            options: currentDestination.options || [],
          },
        },
      };

      res.json(gameState);
    } catch (error) {
      console.error("Error in getGame:", error);
      res.status(500).json({ error: "Failed to fetch game session" });
    }
  };
}
