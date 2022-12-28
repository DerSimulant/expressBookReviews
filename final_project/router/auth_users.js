const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 *60});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review

//regd_users.put("/auth/review/:isbn", (req, res) => {
  //  if (req.body.isbn){
   //     books[req.body.isbn] = {
   //         "reviews":req.body.review,
            
            
     //       }
   // }
  //  res.send("A review has been added!");
//});

// Define a route for adding a new book review

  // Define a route for updating an existing book review
  regd_users.put("/reviews/:isbn", (req, res) => {
    const bookIsbn = req.params.isbn;
  const reviewText = req.body.reviewText;
 

  // Find the book in the books object
  let book = books[bookIsbn];

  // If the book does not exist, return an error
  if (!book) {
    return res.status(404).send("Book not found");
  }

   else {
    // Update the review text for the current user
    book.reviews = reviewText;
  }

  // Send a response to the client indicating success
  return res.status(200).send("Book review added or modified successfully");
});

// Define a route for deleting a book review
regd_users.delete("/reviews/:isbn", (req, res) => {
    // Retrieve the book ISBN and username from the request body and query
    const bookIsbn = req.params.isbn;
    
  
    // Find the book in the books object
    let book = books[bookIsbn];
  
    // If the book does not exist, return an error
    if (!book) {
      return res.status(404).send("Book not found");
    }
  
    // Find the review for the current user
    let review = book.reviews;
  
    // If the review does not exist, return an error
    if (!review) {
      return res.status(404).send("Review not found");
    }
  
    // Delete the review for the current user
    delete book.reviews;
  
    // Send a response to the client indicating success
    return res.status(200).send("Book review deleted successfully");
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
