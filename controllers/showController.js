const showModel = require("../models/showModel");

const addShow = async (req, res) => {
  console.log("hello", req.body);
  try {
    const newShow = new showModel(req.body);
    await newShow.save();
    res.send({
      success: true,
      message: "Show added successfully",
      data: newShow,
    });
  } catch (error) {
    console.error("Error adding show:", error);
    res.send({
      success: false,
      message: "Error adding show",
      error: error.message,
    });
  }
};

const deleteShow = async (req, res) => {
  try {
    const { id } = req.body;
    await showModel.findByIdAndDelete(id);
    res.send({
      success: true,
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting show:", error);
    res.send({
      success: false,
      message: "Error deleting show",
      error: error.message,
    });
  }
};
const updateShow = async (req, res) => {
  try {
    const { id } = req.body;
    const show = await showModel.findById(id);

    Object.keys(req.body).forEach((key) => {
      if (key !== "id") show[key] = req.body[key];
    });
    await show.save();
    res.send({
      message: "Show updated successfully",
      success: true,
      data: show,
    });
  } catch (error) {
    console.error("Error updating show:", error);
    res.send({
      message: "Error updating show",
      success: false,
      error: error.message,
    });
  }
};
const getAllShowsByTheatre = async (req, res) => {
  try {
    const { theatreId } = req.body;
    const shows = await showModel
      .find({ theatre: theatreId })
      .populate("movie");
    res.send({
      success: true,
      data: shows,
    });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.send({
      success: false,
      message: "Error fetching shows",
      error: error.message,
    });
  }
};
const getShowById = async (req, res) => {
  try {
    const show = await showModel
      .findById(req.body.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      message: "Show has been fetched",
      data: show,
    });
  } catch (error) {
    console.error("Error fetching show:", error);
    res.send({
      success: false,
      message: "Error fetching show",
      error: error.message,
    });
  }
};
const getTheatreByMovie = async (req, res) => {
  try {
    const { movie, date } = req.body;
    const shows = await showModel
      .find({ movie: movie, date: date })
      .populate("theatre");
    const uniqueTheatres = [];
    shows.forEach((show) => {
      let isTheatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );
      if (!isTheatre) {
        let showsOfThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id === show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsOfThisTheatre,
        });
      }
    });

    res.send({
      success: true,
      data: uniqueTheatres,
    });
  } catch (error) {
    console.error("Error fetching theatres by movie:", error);
    res.send({
      success: false,
      message: "Error fetching theatres by movie",
      error: error.message,
    });
  }
};
module.exports = {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getShowById,
  getTheatreByMovie,
};
