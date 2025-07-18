const { get } = require("mongoose");
const theatreModel = require("../models/theatreModel");

const addTheatre = async (req, res) => {
  try {
    const theatreModel = require("../models/theatreModel");
    const newTheatre = new theatreModel(req.body);
    await newTheatre.save();
    res.send({
      message: "Theatre added successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error adding theatre:", error);
    res.send({
      success: false,
      message: "Error adding theatre",
    });
  }
};

const updateTheatre = async (req, res) => {
  try {
    const { id } = req.body;
    const theater = await theatreModel.findById(id);

    Object.keys(req.body).forEach((key) => {
      if (key !== "id") theater[key] = req.body[key];
    });
    await theater.save();
    res.send({
      message: "Theatre updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating theatre:", error);
    res.send({
      message: "Error updating theatre",
      success: false,
      error: error.message,
    });
  }
};

const deleteTheatre = async (req, res) => {
  try {
    const { id } = req?.body;

    await theatreModel.findByIdAndDelete(id);
    res.send({
      message: "Theatre deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting theatre:", error);
    res.send({
      message: "Error deleting theatre",
      success: false,
      error: error.message,
    });
  }
};

const getAllTheatres = async (req, res) => {
  try {
    const theatres = await theatreModel.find().populate("owner");
    res.send({
      success: true,
      data: theatres,
    });
  } catch (error) {
    console.error("Error fetching theatres:", error);
    res.send({
      success: false,
      message: "Error fetching theatres",
    });
  }
};
const theaterByOwner = async (req, res) => {
  try {
    const ownerId = req.body.ownerId; // Assuming ownerId is passed as a query parameter
    const theatres = await theatreModel.find({ owner: ownerId });
    res.send({
      success: true,
      data: theatres,
    });
  } catch (error) {
    console.error("Error fetching theatres by owner:", error);
    res.send({
      success: false,
      message: "Error fetching theatres by owner",
    });
  }
};
module.exports = {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  theaterByOwner,
};
