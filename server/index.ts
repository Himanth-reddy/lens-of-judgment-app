import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.ts";
import movieRoutes from "./routes/movies.ts";
import reviewRoutes from "./routes/reviews.ts";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
