const path = require('path')
const express = require('express')
const hbs = require('hbs') //for partials
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sumit Mandal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Sumit Mandal'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        content: 'This is the help page',
        name: 'Sumit Mandal'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        res.send({
            error: 'You must provide an address!'
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if(error){
                res.send({error})
            } else {
                forecast(latitude, longitude, (error, forecastData) => {
                    if(error){
                        res.send ({error})
                    } else {
                        res.send({
                            location,
                            forecast: forecastData,
                            address: req.query.address
                        })
                    }
                })
            }
        })
    }
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'                        
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Page 404',
        errormsg: 'Help article not found!',
        name: 'Sumit Mandal'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: 'Page 404',
        errormsg: 'Page not found',
        name: 'Sumit Mandal'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})