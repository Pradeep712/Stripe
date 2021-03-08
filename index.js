const express = require('express') 
const bodyParser = require('body-parser')
const path = require('path')
const http = require('http')
const app = express()

//for getting value from .env file
const dotenv = require('dotenv');
dotenv.config();
var public_Key  = process.env.PUBLIC_KEY
var secret_Key = process.env.SECRET_KEY
//For Payment
const stripe = require('stripe')(secret_Key)
const port = process.env.PORT || 3000

//Implements bodyParser Middleware for processing Customer info like stripeEmail
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())    

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs')

//get Stripe paymentDetails
app.get('/', (req, res) => {
    res.render('Home', {
        key: public_Key 
    })
})

//For retriving customer details doing payment
app.post('/payment', (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Pradeep',
        address: {
            line1: '2 Kannanendhal',
            postal_code: '625 007',
            city: 'Madurai',
            state: 'Tamil Nadu',
            country: 'India',
        }
    })
        .then((customer) => { // Customer payment amount receive in Stripe account
            return stripe.charges.create({
                amount: 10000,
                description: 'Web development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => { //After Payment, Charges 
            res.send("Payment Success")
        })
        .catch((err) => { // Error during Payment
            res.send(err)
        });
})
//For Listening on Port
app.listen(port, (err) => {
    if (err)    throw err;
    console.log(`App is running in port ${port}`)
})
