require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ image });
    } catch (err) {
        console.log('error:', err);
    }
});


app.get('/rovers', async (req, res) => {
	try {
		let curiosity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        let opportunity = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=100&api_key=${process.env.API_KEY}`)
			.then(res => res.json());
		let spirit = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=100&api_key=${process.env.API_KEY}`)
			.then(res => res.json());

		res.send({
			images: {
				curiosity: curiosity.photos.slice(0, 1),
				opportunity: opportunity.photos.slice(0, 1),
				spirit: spirit.photos.slice(0, 1)
			}
		})
	} catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))