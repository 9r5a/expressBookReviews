const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userWithSameName = users.filter((user) => {
        return user.username === username
    });

    if(userWithSameName.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if(validUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
      return res.status(404).json({"message": "Error: User not found"});
  }
  else if(authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
          data: password
      }, "access", {expiresIn: 60 * 60});
      req.session.authorization = {
          accessToken,
          username
      };

      return res.status(200).json({"message": "User successfully logged in"});
  }
  else {
      return res.status(208).json({"message": "Invalid logging in. Please check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add the review to the book
    books[isbn].reviews.push(review);

    // Return success message
    return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
