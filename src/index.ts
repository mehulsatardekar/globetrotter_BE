import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Make sure to add cors policy before deploy
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

//@ts-ignore
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
