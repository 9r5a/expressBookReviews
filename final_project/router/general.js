const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ error: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/', async function (req, res) {
    try {
        const booksData = await (async () => books)();

        res.status(200).send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to fetch books');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await (async () => books[isbn])();

        if (book) {
            res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to fetch book by ISBN');
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try{
    const author = req.params.author;
    const booksByAuthor = await (async () => {
        const result = [];
        for (let isbn in books) {
            if (books[isbn].author === author) {
                result.push(books[isbn]);
            }
        }
        return result;
    })();

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).json({ message: "No books found by this author" });
    
    } }
    catch (error) {
        console.log('Error ocurred', error)
        res.status(500).send('Failed to fetch book by author')
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();

        // Simulating an async operation to get books by title
        const booksByTitle = await (async () => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === title) {
                    result.push(books[isbn]);
                }
            }
            return result;
        })();

        if (booksByTitle.length > 0) {
            res.status(200).send(JSON.stringify(booksByTitle, null, 4));
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to fetch books by title');
    }
});
//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        if (books[isbn].reviews) {
            res.send(JSON.stringify(books[isbn].reviews, null, 4));
        } else {
            res.status(404).json({ message: "No reviews found for this book" });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }


});

module.exports.general = public_users;
