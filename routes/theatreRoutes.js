const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  theaterByOwner,
} = require("../controllers/theatreControllers");

const router = require("express").Router();

router.post("/add-theatre", addTheatre);
router.put("/update-theatre", updateTheatre);
router.delete("/delete-theatre", deleteTheatre);
router.get("/get-all-theatre", getAllTheatres);
router.post("/get-theatre-by-owner", theaterByOwner);
module.exports = router;
