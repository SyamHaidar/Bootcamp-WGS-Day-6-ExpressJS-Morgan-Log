const express = require("express");
const path = require("path");
const router = express.Router();

// ---------------------------------------------------------------------------

const app = express();
const port = 3000;

// EJS
app.set("view engine", "ejs");

// route
app.get("/", (req, res) => {
  res.render("index", {
    // send variable name to HTML
    name: "Syam",
  });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// route with parameter
app.get("/product/:id", (req, res) => {
  res.send(
    `<h3>Prodcut id: ${req.params.id} </br> Category: ${req.query.category}</h3>`
  );
});

app.use("/", (req, res) => {
  res.status(404);
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
