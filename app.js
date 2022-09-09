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
    // send variable title and name to HTML
    title: "ExpressJS web server",
    name: "Syam",
  });
});

app.get("/contact", (req, res) => {
  cont = [
    {
      name: "Syam",
      email: "syam@email.com",
    },
    {
      name: "Adit",
      email: "adit@email.com",
    },
    {
      name: "Gilby",
      email: "gilby@email.com",
    },
  ];
  res.render("contact", {
    title: "Contact - ExpressJS web server",
    cont,
  });
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
