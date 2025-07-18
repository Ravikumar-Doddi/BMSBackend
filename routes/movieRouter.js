const router = require("express").Router();
const {
  getAllMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getSingleMovie,
} = require("../controllers/movieControllers");
const MovieModel = require("../models/movieModel");

router.post("/add-movie", addMovie);

router.get("/get-all-movie", getAllMovies);

router.put("/update-movie", updateMovie);

router.delete("/delete-movie", deleteMovie);

router.get("/get/:id", getSingleMovie);

module.exports = router;
