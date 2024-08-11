const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(208).json({ message: 'Invalid credentials' });
  }
  if (isValid(username)) {
    users[username] = password;
    return res.status(200).json({ users, message: `Registered ${username} successfully` });
  }
  return res.status(300).json({ message: `User ${username} already exists` });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  if (books) {
    return res.status(200).json(books, null, 4);
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  if (books[ISBN]) {
    return res.status(200).json(books[ISBN]);
  }
  return res.status(404).json({ message: "Not Found" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author.split('-').join(' ');
  let booksByAuthor = [];
  for (let ISBN in books) {
    if (books[ISBN].author.toLowerCase() === author.toLowerCase() && !booksByAuthor.includes(books[ISBN])) {
      booksByAuthor.push(books[ISBN]);
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }
  return res.status(404).json({ author, message: "Not Found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title.split('-').join(' ');
  let booksBytitle = [];
  for (let ISBN in books) {
    if (books[ISBN].title.toLowerCase() === title.toLowerCase() && !booksBytitle.includes(books[ISBN])) {
      booksBytitle.push(books[ISBN]);
    }
  }
  if (booksBytitle.length > 0) {
    return res.status(200).json(booksBytitle);
  }
  return res.status(404).json({ title, message: "Not Found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let ISBN = req.params.isbn;
  if (books[ISBN]) {
    return res.status(200).json(books[ISBN].reviews);
  }
  return res.status(404).json({ message: "Not Found" });
});

module.exports.general = public_users;
