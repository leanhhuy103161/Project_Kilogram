// Config env
require('dotenv').config()

const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const mongoClient = require("mongoose");

// setup connect mongodb by mongoose
mongoClient
  .connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

const app = express();

const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const likeRoute = require("./routes/like");
const userRoute = require("./routes/user");

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Routes
app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server is listening on port: ${port}`));


