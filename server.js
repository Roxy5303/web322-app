/*********************************************************************************
 *  WEB322 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Rahi Kiransinh Raolji
 *  Student ID: 160169215
 *  Date: 6 February 2023
 *
 *  Cyclic Web App URL: https://super-slippers-seal.cyclic.app/about#
 *
 *  GitHub Repository URL: https://github.com/Roxy5303/web322-app
 *
 ********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const path = require("path");

const blogData = require("./blog-service");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  // setup a 'route' to listen on the default url path
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogData
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts", (req, res) => {
  blogData
    .getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  blogData
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// GET /posts/add route
app.get("/posts/add", (req, res) => {
  const addPostPath = path.join(__dirname, "views", "addPost.html");
  res.sendFile(addPostPath);
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

blogData
  .initialize()
  .then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
