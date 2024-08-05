// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const router = require("./routes/routes.js");

const app = express();
const PORT = process.env.PORT || 4000;
app.set("view engine", "ejs");

// database connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Database connection error:", error);
});
db.once("open", () => {
  console.log("Connected to the database");
});

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "My Sceret Key",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//set the template engine
app.set("view engine ", "ejs");

//route prefix
app.use("", router);

app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
