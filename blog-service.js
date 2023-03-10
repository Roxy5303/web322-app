const fs = require("fs");
const { resolve } = require("path");

let posts = [];
let categories = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        posts = JSON.parse(data);

        fs.readFile("./data/categories.json", "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            categories = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    posts.length > 0 ? resolve(posts) : reject("no results returned");
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    let filteredPosts = posts.filter((post) => post.published);
    filteredPosts.length > 0
      ? resolve(filteredPosts)
      : reject("no results returned");
  });
};

module.exports.addPost = (post) => {
  return new Promise((resolve, reject) => {
    if (typeof post.published === undefined) {
      post.published = false;
    } else {
      post.published = true;
    }
    post.id = posts.length + 1;
    post.push(post);
    resolve(Post);
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    var temp = [];
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].category === category) {
        temp.push(posts[i]);
      }
    }
    if (temp) {
      resolve(temp);
    } else {
      reject("No results returned");
    }
  });
};

module.exports.getPostsByMinDate = (minDate) => {
  return new Promise((resolve, reject) => {
    var temp = [];
    for (var i = 0; i < posts.length; i++) {
      if (new Date(posts[i].postDate) >= new Date(minDate)) {
        temp.push(posts[i]);
      }
    }
    if (temp) {
      resolve(temp);
    } else {
      reject("No results returned");
    }
  });
};

module.exports.getPostsbyId = (id) => {
  return new Promise((resolve, reject) => {
    var temp;
    if (posts.id === id) {
      resolve(posts);
    } else {
      reject("No results returned");
    }
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    categories.length > 0 ? resolve(categories) : reject("no results returned");
  });
};
