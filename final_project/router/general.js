const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in, please provide Username and Password"});
    }

    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books,null,4));
});

// Get the book list using promises DON´T FORGET npm install axios

function getBooks() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }
  public_users.get('/', function(req, res) {
    getBooks()
      .then((books) => {
        return res.send(JSON.stringify(books, null, 4));
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]))
    
 });
  
//Async implementation
function getBook(isbn) {
    return new Promise((resolve, reject) => {
      resolve(books[isbn]);
    });
  }
  public_users.get('/isbn/:isbn', async function(req, res) {
    const isbn = req.params.isbn;
    const book = await getBook(isbn);
    return res.send(JSON.stringify(book));
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

// Aysnc implementation on author
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];
      for (const isbn in books) {
        const book = books[isbn];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      }
      resolve(matchingBooks);
    });
  }
  public_users.get('/author/:author', async function(req, res) {
    const author = req.params.author;
    const matchingBooks = await getBooksByAuthor(author);
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
  
// Async implementation on title 

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      const matchingBooks = [];
      for (const isbn in books) {
        const book = books[isbn];
        if (book.title === title) {
          matchingBooks.push(book);
        }
      }
      resolve(matchingBooks);
    });
  }
  public_users.get('/title/:title', function(req, res) {
    const title = req.params.title;
    getBooksByTitle(title)
      .then((matchingBooks) => {
        if (!matchingBooks.length) {
          res.send({error: 'No books found with that title.'});
        } else {
          res.send(matchingBooks);
        }
      });
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
