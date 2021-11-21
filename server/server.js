const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const cors  = require('cors');

const app = express();

const saltRounds = 10;

var sess;

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
    //key: 'userId', //name of the cookie
    secret: 'koketjosethobjasethobjakoketjo', //
    resave: true,
    saveUninitialized: true
}))

const db = mysql.createConnection({
    user: 'gallery',
    host: 'localhost',
    password: 'gallery',
    database: 'gallery'
});

cloudinary.config({
    cloud_name: 'koketjosethobja',
    api_key: '941348775951192',
    api_secret: 'y5CEoBG-UQFwqqHYXSBqF0qxiC0',
    secure: true
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

// app.get('/login', (req, res) => {   
//     if(req.session.user){
//         res.send({loggedIn: true, user: req.session.user})
//     } else {
//         res.send({loggedIn: false})
//     }
// })

app.post('/login', (req, res) => {
    const email= req.body.email;
    const password= req.body.password;
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], (err, result) => {
        if(err) {
            res.send({err: err})
        }
        if(result.length > 0) {                             
            bcrypt.compare(password, result[0].password, (error, response) => {
                if(response){                      
                    app.set('id', result[0].id); 
                    req.session.user = result[0].email;                    
                    console.log(req.session.user)
                    console.log(response)
                    res.send(result)
                } else {
                    res.send({message: 'Wrong username or password'})
                }
            })            
        } else{
            res.send({message: "User doesn't exist"})
        }         
    })  
})

app.get('/logout', (req, res) => {    
    if(req.session){
        req.session.destroy();
        res.json({result: 'successfully logged out.'})        
    } else {
        res.json({message: 'user not logged in'})
    }
    // if(req.session.user){
    //     delete req.session.user;
    //     req.session.cookie.expires = 0;
    //     res.json({result: 'successfully logged out.'})        
    // } else {
    //     res.json({message: 'user not logged in'})
    // }
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
            //console.log(err)
        }else{
            res.send({message: 'Successfully uploaded'})
        }    
    })
})

app.get('/images', (req, res) => {
    const log_user = app.get('id');
    db.query('SELECT * FROM photo WHERE user_id = ?', [log_user], (err, result) => {
        if(err){
            console.log(err)        
        } else {                        
            res.send(result)  
            console.log(result)            
            //console.log(app.get('id'))
        }
    })     
})

app.put('/update', (req, res) => {
    const newPublicId = req.body.newPublicId
    const publicId = req.body.publicId
    cloudinary.uploader.rename(publicId, newPublicId, (error, result) => {
        if(error) {
            console.log(error)
        } else {
            console.log(result)
            db.query('UPDATE photo SET publicId = ? WHERE publicId = ?', [newPublicId, publicId], (err, new_result) => {
                if(err){
                    console.log(err)
                }else {
                    res.send(new_result)
                    console.log(new_result)
                }
            })
        }
    })
})

app.delete('/delete/:publicId', (req, res) => {
    const publicId = req.params.publicId;
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if(error) {
            console.log(error)
            console.log('COULD NOT DELETE FROM CLOUDINARY')
        } else {
            console.log(result);
            db.query('DELETE FROM photo WHERE publicId = ?', [publicId], (err, data) => {
                if(err) {
                    console.log(err)
                    console.log('COULD NOT DELETE FROM DB')
                } else{
                    console.log(data)
                }
            })
        }
    });
})

app.get('/download/:publicId', (req, res) => {
    const publicId = req.params.publicId;
    
})

app.listen(5000, () => {
    console.log('running server');
})

