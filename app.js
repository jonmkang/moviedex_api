require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');
const cors = require('cors');
const helmet = require('helmet')


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());


app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    console.log('validate bearer token middleware')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

app.get('/movie', (req, res) => {
    const { genre="", country="", avg_vote=""} = req.query;
    const movieList = movies;
    let results = [];

    if(genre){
        results = movieList.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if(country){
        results = movieList.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }

    if(avg_vote){
        results = movieList.filter(movie => movie.avg_vote >= avg_vote)
    }


    res.send(results)
})

app.listen(8000, () => {
    console.log(`Server listening at http://localhost:8000`)
})