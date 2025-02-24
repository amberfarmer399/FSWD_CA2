require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  genre: { type: String, required: true },
  releaseYear: { type: Number },
  availableCopies: { type: Number, required: true }
});

const Movie = mongoose.model("Movie", movieSchema);

// Routes

// 1. Create a new movie (POST)
app.post("/movies", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get all movies or a specific movie by ID (GET)
app.get("/movies/:id?", async (req, res) => {
  try {
    if (req.params.id) {
      const movie = await Movie.findById(req.params.id);
      if (!movie) return res.status(404).json({ message: "Movie not found" });
      res.json(movie);
    } else {
      const movies = await Movie.find();
      res.json(movies);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update a movie (PUT)
app.put("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Delete a movie (DELETE)
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
