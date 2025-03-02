import { Request, Response, RequestHandler } from "express";
import { supabase } from "../config/supabase";

export class DestinationController {
  getRandomDestination: RequestHandler = async (req, res) => {
    try {
      const { data } = await supabase
        .from("destinations")
        .select("*")
        .limit(1)
        .order("RANDOM()");

      if (!data) {
        res.status(404).json({ error: "No destinations found" });
        return;
      }

      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  };

  getDestination: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  };
}
