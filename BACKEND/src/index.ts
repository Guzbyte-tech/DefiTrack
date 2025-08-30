import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? "https://yourfrontend.com"
    : "*", // allow all during dev
};

app.use(cors(corsOptions));

connectDB();
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("API is running");
});

// Route files


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});