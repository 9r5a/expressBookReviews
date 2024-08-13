const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  //Write your code here
  return res.status(200).json(books);
});

public_users.get('/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/isbn/:isbn/async', async (req, res) => {
  const isbn = req.params.isbn;
  
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];

  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

public_users.get('/author/:author/async', async (req, res) => {
  const author = req.params.author;
  
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    const booksByAuthor = response.data;
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "Books by this author not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by author', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

public_users.get('/title/:title/async', async (req, res) => {
  const title = req.params.title;
  
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    const booksByTitle = response.data;
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "Books with this title not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by title', error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
