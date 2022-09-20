var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://vidut:1234abcd@cluster0.fwtncgp.mongodb.net/?retryWrites=true&w=majority");
let jwt = require('jsonwebtoken');

var enquiry = require('./models/enquiry.js');
var user = require('./models/user');

app.use(bodyParser.json({ limit: "32mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }))
app.use(cors())


function checkUserGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'ohajfhakbdfks', { expiresIn: '1d' }, (err, token) => {
        if (err) {
            res.send(400).json({
                status: false,
                errorMessage: err,
            });
        } else {
            res.send({
                message: 'Login Successfully',
                token: token,
                status: true
            });
        }
    })
}

app.post('/enquiry', (req, res) => {
    console.log(req.body);
    try {
        let Enquiry = new enquiry({
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            message: req.body.message
        })
        Enquiry.save((err, data) => {
            if (err) {
                res.send('Failed')

            } else {
                res.send('Success')

            }
        })
    } catch (err) {

    }
})
app.post('/login', (req, res) => {
    try {
        // console.log(req.body);
        if (req.body && req.body.username && req.body.password) {
            user.find({ username: req.body.username }, (err, data) => {
                console.log(data);
                if (data.length > 0) {
                    if (data[0].password == req.body.password) {
                        checkUserGenerateToken(data[0], req, res);
                    } else {
                        res.status(400).json({ errorMessage: 'Username or password is incorrect', status: 'false' });
                    }
                } else {
                    res.status(400).json({ errorMessage: 'Username or password is incorrect', status: 'false' });
                }
            })
        }

    } catch (err) {

    }
})

app.post('/register', (req, res) => {
    try {
        if (req.body && req.body.username && req.body.password) {
            user.find({ username: req.body.username }, (err, data) => {
                console.log(data);
                if (data.length > 0) {
                    res.status(400).json({ errorMessage: 'Username already exist', status: false });
                } else {
                    let User = new user({ username: req.body.username, password: req.body.password });
                    User.save((err, data) => {
                        if (err) {
                            res.status(400).json({ errorMessage: err, status: false });
                        } else {
                            res.status(200).json({ title: "Registered Successfully", status: true });
                        }
                    })
                }
            });
        }
    } catch (err) {

    }
})

//app.get('/', (req, res) => { res.send('Hello World') });


const PORT = process.env.PORT || 2000;
app.listen(PORT, err => {
    if (err) throw err;
    console.log('Server running at port ' + PORT);
})
