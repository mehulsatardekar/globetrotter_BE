import { Request, Response, RequestHandler } from "express";
import { supabase } from "../config/supabase";

export class UserController {
  checkUsername: RequestHandler = async (req, res) => {
    try {
      const { username } = req.query;
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .single();

      res.json({
        available: !data,
        userId: data?.id,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check username" });
    }
  };

  registerUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      console.log("Registering user with data:", req.body);
      const { username } = req.body;

      if (!username) {
        res.status(400).json({ error: "Username is required" });
        return;
      }

      // First check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id, username")
        .eq("username", username)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // Not found error
        console.error("Error checking existing user:", checkError);
        throw checkError;
      }

      if (existingUser) {
        // If user exists, return their data instead of error
        console.log(
          "User already exists, returning existing user:",
          existingUser
        );
        res.status(200).json(existingUser);
        return;
      }

      // Create new user if they don't exist
      const { data, error: insertError } = await supabase
        .from("users")
        .insert([{ username }])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        throw insertError;
      }

      console.log("User created successfully:", data);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error in registerUser:", error);
      res.status(500).json({
        error: "Failed to register user",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  getLeaderboard: RequestHandler = async (req, res, next) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("username, highest_score, games_played")
        .order("highest_score", { ascending: false })
        .limit(10);

      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getUserStats: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  createUser: RequestHandler = async (req, res) => {
    try {
      const { username } = req.body;

      const { data, error } = await supabase
        .from("users")
        .insert([{ username }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  };
}
