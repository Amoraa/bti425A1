/*********************************************************************************
* BTI425 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: ____Tatiana Kashcheeva__________________ Student ID: _____148366206_________ Date: __22.01.2023______________
* Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 
// Setup
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();

//add module moviesDB
const MoviesDB = require("./modules/moviesDB.js")
const db = new MoviesDB()

const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());



app.get('/', (req, res) => {
    res.send({message: "API Listening"})
});

//Add new movie
app.post('/api/movies', (req, res) => {
    var movie = db.addNewMovie(req.body)
    movie.then((data)=>
    {
        res.status(201).json(data);
    })
    .catch(()=>
    {
        res.status(500).send({message: "Cannot add movie"})
    })
    
});

//Show all movies
app.get('/api/movies', (req, res) => {
    db.getAllMovies(req.query.page,req.query.perPage,req.query.title)
    .then((data)=>
    {
        res.status(200).json(data);
    })
    .catch(()=>
    {
        res.status(204).send({message: "Querry failed"})
    })
});

//Show movie with specific id
app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then((data)=>
    {
        if (data==null)
        {
            res.status(404).send({message: "No movie with this id"})
        }
        else{
            res.status(200).json(data);
        }
        
    })
    .catch((err)=>
    {
        res.status(500).send({message: err})
    })
});

//update movie
app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body,req.params.id).then((data)=>
    {
        if (data.modifiedCount>0)
        {
             res.status(200).send({message: `Movie ${req.params.id} was updated`})
        }
       else{
        res.status(404).send({message: "No movie with this id"})
       }
        
        
       
    })
    .catch((err)=>
    {
        res.status(500).send({message: err})
    })
});

//delete movie
app.delete('/api/movies/:id', (req, res) => {
   
    db.deleteMovieById(req.params.id).then((data)=>
    {
        if (data.deletedCount>0)
        {
            res.status(200).send({message: `Movie ${req.params.id} was deleted`})
        }
        else
        {
            res.status(404).send({message: "No movie with this id"})
        }
        
    })
    .catch(()=>
    {
        res.status(500).send({message: "An error occured"})
    })
});


// Resource not found (this should be at the end)
app.use((req, res) => {
    res.status(404).send('Resource not found');
});

// Tell the app to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
   });
   