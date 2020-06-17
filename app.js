require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies.json');
const cors = require('cors');
const helmet = require('helmet')


const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
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
    let results = movies;

    if(genre){
        results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }

    if(country){
        results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }

    if(avg_vote){
        results = results.filter(movie => movie.avg_vote >= avg_vote)
    }


    res.send(results)
})

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})