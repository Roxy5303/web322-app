/*********************************************************************************
 *  WEB322 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Rahi Kiransinh Raolji
 *  Student ID: 160169215
 *  Date: 21 February 2023
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

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dmmpv7xxz",
  api_key: "955468951464545",
  api_secret: "3knlJgcttwmEGEUE7-rwat6u1aA",
  secure: true,
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

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

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }
    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    blogData.addPostPath(req.body).then(() => {
      res.redirect("/posts");
    });
  }
  res.redirect("/posts");
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
