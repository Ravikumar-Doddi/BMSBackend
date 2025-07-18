const {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getShowById,
  getTheatreByMovie,
} = require("../controllers/showController");

const router = require("express").Router();
router.post("/add-show", addShow);
router.post("/get-all-shows-by-theatre", getAllShowsByTheatre);
router.put("/update-show", updateShow);
router.delete("/delete-show", deleteShow);
router.post("/get-all-theaters-by-movie", getTheatreByMovie);
router.post("/get-show-by-id", getShowById);

module.exports = router;
