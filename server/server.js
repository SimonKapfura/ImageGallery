const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const cors  = require('cors');
const ejs = require('ejs');
const path = require('path');
const localstorage = require('node-localstorage');
const store = require('store2');
const router = express.Router();
const jwt = require('jsonwebtoken')

const app = express();

var users;

const saltRounds = 10;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://api.cloudinary.com/v1_1/koketjosethobja/image/upload'],
    method: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    key: 'userId', //name of the cookie
    secret: 'koketjosethobjasethobjakoketjo', //
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24}
}))

const db = mysql.createConnection({
    user: 'gallery',
    host: 'localhost',
    password: 'gallery',
    database: 'gallery'
});

app.post('/register', (req, res) => {
    const inputData = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }
    var sql = 'INSERT INTO users (email, password) VALUES (?,?)';

    bcrypt.hash(inputData.password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err)
        }
        db.query(sql, [inputData.email, hash], (err, result) => {
            if(err){
                console.log(err)
            }
            if(result){
                res.send({passed: 'Registration successful'})
            } else {
                res.send({message: 'Registration unsuccessful'})
            }            
        })
    })    
})

app.get('/login', (req, res) => {   
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
})

app.post('/login', (req, res) => {
    const email= req.body.email;
    const password= req.body.password;
    const sql = 'SELECT * FROM users WHERE email = ?';
    if(req.session.user){
        res.json({message: 'User already logged in.'})
    }
    else {
        db.query(sql, [email], (err, result) => {
            if(err) {
                res.send({err: err})
            }
            if(result.length > 0) {                
                //console.log('results: ', result);
                //var string = JSON.stringify(result);
                //console.log('string: ', string);
                //var json = JSON.parse(string);
                //console.log('json: ', json);
                //console.log('id: ', json[0].id);
                //console.log('user: ', json[0].email);
                //console.log(req.session.user)
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if(response){
                        req.session.user = result[0].id;
                        app.set('id', result[0].id);
                        console.log(req.session.user)
                        res.send(result)
                    } else {
                        res.send({message: 'Wrong username or password'})
                    }
                })            
            } else{
                res.send({message: "User doesn't exist"})
            }         
        })
    }    
})

app.get('/logout', (req, res) => {
    if(req.session.user){
        delete req.session.user;
        req.session.cookie.expires = 0;
        res.json({result: 'successfully logged out.'})        
    } else {
        res.json({message: 'user not logged in'})
    }
})

app.post('/upload', (req, res) => {
    const data = {
        publicId: req.body.publicId,
        fileName: req.body.fileName,
        uploadDate: req.body.uploadDate,
        secureUrl: req.body.secureUrl,
        size_in_mb: req.body.size_in_mb,                
        format: req.body.format,                                
        height: req.body.height,
        width: req.body.width,
        user_id: req.body.user_id
    }
    var sql = 'INSERT INTO photo SET ?'
    db.query(sql, data, (err, result) => {
        if(err){
            res.send({error: 'Upload unsuccessful'})
            console.log(err)
        }else{
            res.send({message: 'Successfully uploaded'})
        }    
    })
})

app.get('/images', (req, res) => {
    const log_user = app.get('id');
    db.query('SELECT secureUrl FROM photo WHERE user_id = ?', log_user, (err, result) => {
        if(err){
            console.log(err)
        } else {                        
            res.send(result)
            //console.log(app.get('id'))
        }
    })     
})

app.put('/update', (req, res) => {
    
})

// app.delete()

app.listen(5000, () => {
    console.log('running server');
})

