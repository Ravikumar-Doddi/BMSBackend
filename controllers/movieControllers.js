const movieModel = require("../models/movieModel");

const getAllMovies = async (req, res) => {
  try {
    const movies = await movieModel.find();
    res.send({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.log("Error fetching movies:", error);
    res.send({
      success: false,
      message: "Error fetching movies",
    });
  }
};

const addMovie = async (req, res) => {
  try {
    const newMovie = await movieModel(req.body);
    await newMovie.save();
    res.send({
      message: "Movie added successfully",
      success: true,
      data: newMovie,
    });
  } catch (error) {
    console.log("Error adding movie:", error);
    res.send({
      success: false,
      message: "Error adding movie",
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.body;
    const movie = await movieModel.findById(id);

    Object.keys(req.body).forEach((key) => {
      if (key !== "id") movie[key] = req.body[key];
    });
    await movie.save();
    res.send({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    console.log("Error updating movie:", error);
    res.send({
      success: false,
      message: "Error updating movie",
    });
  }
};
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.body;
    await movieModel.findByIdAndDelete(id);
    res.send({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Error deleting movie",
    });
  }
};
const getSingleMovie = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.id);
    if (!movie) {
      return res.send({
        success: false,
        message: "Movie not found",
      });
    }
    res.send({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.send({
      success: false,
      message: "Error fetching movie",
      error: error.message,
    });
  }
};
module.exports = {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getSingleMovie,
};
