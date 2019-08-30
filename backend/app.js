const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotnev = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors");
dotnev.config();

//db
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true })
//   .then(() => {});

// mongoose.connection.on("error", err => {
//   console.log("DB Connection Error:", err.message);
// });

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 30, // Retry up to 30 times
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true
};

const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  mongoose
    .connect(process.env.MONGO_URI, options)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch(err => {
      console.log(err.message);
      console.log("MongoDB connection unsuccessful, retry after 5 seconds.");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

//routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
//api docs
app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//middleware
app.use(morgan("dev"));
app.use(expressValidator());
// parse application/x-www-form-urlencoded && parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//routes
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("App is running on port:", port);
});
