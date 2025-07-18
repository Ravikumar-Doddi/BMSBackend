const authMiddleware = require("../middleware/authMiddleware");
const bookingModel = require("../models/bookingModel");
const showModel = require("../models/showModel");
const Stripe = require("stripe");
const EmailHelper = require("../utils/emailHelper");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = require("express").Router();

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      source: token.id,
      email: token.email,
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Token has been assigned to movie !",
    });
    const transactionId = paymentIntent.id;
    res.send({ message: "Payment successful", success: true, transactionId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/book-show", authMiddleware, async (req, res) => {
  try {
    const newBooking = await bookingModel(req.body);
    await newBooking.save();
    const show = await showModel.findById(req.body.showId).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, req.body.seats];
    show.bookedSeats = updatedBookedSeats;
    await show.save();
    const populatedBooking = await bookingModel
      .findById(newBooking._id)
      .populate("user")
      .populate("show")
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "movies",
        },
      })
      .populate({
        path: "show",
        populate: {
          path: "theatre",
          model: "theatres",
        },
      });

    res.send({
      success: true,
      message: "Show Booked Successfully",
      data: populatedBooking,
    });

    // await EmailHelper(
    //   "ticketTemplate.html",
    //   populatedBooking.user.email,
    //   {
    //     name: populatedBooking.user.name,
    //     movie: populatedBooking.show.movie.movieName,
    //     theatre: populatedBooking.show.theatre.name,
    //     date: populatedBooking.show.date,
    //     time: populatedBooking.show.time,
    //     seats: populatedBooking.seats,
    //     amount:
    //       populatedBooking.seats.length * populatedBooking.show.ticketPrice,
    //     transactionId: populatedBooking.transactionId,
    //   },
    //   "Booking Confirmation"
    // );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/all-booking-by-user", authMiddleware, async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ user: req.body.id })
      .populate("show")
      .populate("user");
    // .populate({
    //   path: "shows",
    //   populate: {
    //     path: "movie",
    //     model: "movies",
    //   },
    // })
    // .populate({
    //   path: "shows",
    //   populate: {
    //     path: "theatre",
    //     model: "theatres",
    //   },
    // });
    res.send({
      success: true,
      message: "All Bookings by User have been fetched",
      data: bookings,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
