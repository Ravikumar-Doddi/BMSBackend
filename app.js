const express = require("express");

const connectToDatabase = require("./config/configDb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const PORT = 8080;
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRouter");
const theatreRoutes = require("./routes/theatreRoutes");
const showRoutes = require("./routes/showRouter");
const bookingRoutes = require("./routes/bookingRouter");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.", // send a custom message on rate limit exceeded
});
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       imgSrc: ["'self'", "https://www.google-analytics.com"],
//       scriptSrc: ["'self'", "'unsafe-inline'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       connectSrc: ["'self'", "https://www.google-analytics.com"],
//     },
//   })
// );

app.use("/api/", apiLimiter);
app.use("/api/user", userRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/theatre", theatreRoutes);
app.use("/api/show", showRoutes);
app.use("/api/booking", bookingRoutes);
connectToDatabase(process.env.DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Listening to the port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
