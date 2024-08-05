const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

// Function to generate a new employee ID
async function generateEmployeeId() {
  try {
    const count = await User.countDocuments().exec();
    return count + 1;
  } catch (error) {
    throw new Error("Error generating employee ID");
  }
}

// Route to render the home page with user data
router.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().exec();
    // Render the index view with the users data
    res.render("index", { title: "Home Page", users });
  } catch (error) {
    // Handle error and send a response
    res.status(500).send("Error fetching users");
  }
});

// Route to render the add user form
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

// Route to handle form submission for adding a new user
router.post(
  "/add",
  // Validate and sanitize inputs
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("age").isInt({ min: 0 }).withMessage("Age must be a positive integer"),
  body("department").notEmpty().withMessage("Department is required"),
  body("status").notEmpty().withMessage("Status is required"),
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const employeeId = await generateEmployeeId(); // Generate the new employee ID

      // Create a new user instance
      const user = new User({
        employeeId, // Assign the generated employee ID
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        department: req.body.department,
        status: req.body.status,
      });

      // Save the user and wait for completion
      await user.save();

      // Set a success message in the session
      req.session.message = {
        type: "success",
        message: "User Added Successfully",
      };

      // Redirect to the home page
      res.redirect("/");
    } catch (err) {
      // Respond with an error message
      res.json({ message: err.message, type: "Danger" });
    }
  }
);

module.exports = router;
