const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]))
    
 });
  

 
// Get book details based on author

public_users.get('/author/:author', function (req, res) {
    const requestAuthor = req.params.author;
    const matchingBooks = [];
  
    for (const isbn in books) {
      const book = books[isbn];
      if (book.author === requestAuthor) {
        matchingBooks.push(book);
      }
    }
    if (!matchingBooks.length) {
        res.send({error: 'No books found with that author.'});
      } else {
        res.send(matchingBooks);
      }
  
   
  });
   


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const requestTitle = req.params.title;
    const matchingBooks = [];
  
    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === requestTitle) {
        matchingBooks.push(book);
      }
    }
  
    if (!matchingBooks.length) {
      res.send({error: 'No books found with that title.'});
    } else {
      res.send(matchingBooks);
    }
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const requestIsbn = req.params.isbn;
    const book = books[requestIsbn];
  
    if (book) {
      res.send(book.reviews);
    } else {
      res.send({error: 'Book not found.'});
    }
  });

module.exports.general = public_users;
