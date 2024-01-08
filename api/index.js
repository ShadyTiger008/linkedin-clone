const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 8001;

app.get('/', (req, res) => {
    res.send('Welcome to the Google Cloud Platform!')
})

app.listen(port, () => {
    console.log("Server listening on port " + port);
})