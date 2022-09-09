const express = require("express");
const expressLayouts = require('express-ejs-layouts');

// ---------------------------------------------------------------------------

const app = express();
const port = 3000;

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// route
app.get("/", (req, res) => {
  res.render("index", {
    // send variable title and name to HTML
    title: "ExpressJS web server",
    page: "home",
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
    page: "contact",
    cont,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About - ExpressJS web server",
    page: "about",
  });
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
