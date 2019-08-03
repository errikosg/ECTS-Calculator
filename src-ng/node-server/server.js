const http = require('http');
const fs = require('fs');
const url = require('url');
const express = require('express');   //using express!!
const mysql = require('mysql');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const events = require('events');

const app = express();
const port = 3000;
const alg = "aes-128-cbc"
const pass = "thisisa_password"
var emitter = new events.EventEmitter();
emitter.setMaxListeners(0)

//read myinfo.txt
var array = fs.readFileSync('./myinfo.txt').toString().split("\n");

//pool
var pool = mysql.createPool({
    connectionLimit : 100, //important
    host: array[0],
    user: array[1],
    password: array[2],
    database: array[3],
    debug    :  false
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//server - REST API

/*---------------------- user related -----------------------------------------*/

// GET ALL USERS
app.get("/users", function(req,res){-
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection to database"});
          return;
        }
        connection.query("SELECT * FROM user",function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});

// GET A SPECIFIC USER
app.get("/users/:uid", function(req,res){-
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection to database"});
          return;
        }
        let query = "SELECT * FROM user WHERE id=?"
        connection.query(query, [req.params.uid], function(err,rows){
            connection.release();
            if(!err)
                res.json(rows);
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});

// LOGIN
app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = encrypt_pass(req.body.password)

    //check if user exists
    pool.getConnection(function(err,connection){
        if (err)
            return res.json({"code" : 100, "status" : "Error in connection to database"});

        let query = "SELECT * FROM user WHERE email=? AND password=?"
        connection.query(query, [email, password], function(err,rows){
            connection.release();
            if(!err) {
                if(rows.length > 0)
                    res.json(rows[0]);
                else
                    res.json(rows);
            }
        });
        connection.on('error', function(err) {
              return res.json({"code" : 100, "status" : "Error in connection to database"});
        });
    });
});

// SIGNUP - check if email exists
app.post('/signup', (req, res) => {
    var email = req.body.email;

    //check if user exists
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        let query = "SELECT * FROM user WHERE email=?"
        connection.query(query, [email], function(err,rows){
            connection.release();
            if(!err) {
                if(rows.length > 0)
                    res.json(rows[0]);
                else
                    res.json(rows);
            }
        });
        connection.on('error', function(err) {
              return res.json({"code" : 100, "status" : "Error in connection to database"});
        });
    });
});

// CREATE NEW USER
app.post('/users', (req, res) => {
    //check if user exists
    pool.getConnection(function(err,connection){
        if (err)
            return res.json({"code" : 100, "status" : "Error in connection to database"});
        let query = "SELECT * FROM user ORDER BY id DESC LIMIT 1;"
        connection.query(query, function(err,rows){
            if(!err) {
                //set users id to last id + 1 (increment id)
                var newid;
                if(rows.length > 0)
                    newid = rows[0].id + 1;
                else
                    newid = req.body.id;

                let query2 = "INSERT INTO user (id,email,password,ects,mo,course_count) values (?,?,?,?,?,?)"
                connection.query(query2, [newid, req.body.email, encrypt_pass(req.body.password), req.body.ects, req.body.mo, req.body.course_count], function(err,rows){
                    if(!err) {
                        if(rows.length > 0)
                            return res.json(rows[0]);
                        else{
                            //set all grades to 0
                            let query3 = "SELECT COUNT(id) AS count FROM course";
                            connection.query(query3, function(err,rows){
                                if(!err){
                                    let query4 = "INSERT INTO user_has_course (user_id,course_id,grade) VALUES (?,?,?)";
                                    for(var i=0; i<rows[0].count; i++){
                                        connection.query(query4, [newid,i,0],function(err,rows){
                                        })
                                    }
                                }
                            });
                            res.json(rows);
                        }
                    }
                    connection.release();
                });
                connection.on('error', function(err) {
                      return res.json({"code" : 100, "status" : "Error in connection to database"});
                });
            }
        })
    });
});

/*---------------------- course related --------------------------------------*/
// GET ALL OBLIGATORY COURSES
app.get('/courses/obligatory/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM obligatory)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM obligatory);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL GENERAL COURSES
app.get('/courses/general/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM general_edu)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM general_edu);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL LAB COURSES
app.get('/courses/labs/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM labs)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM labs);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL ELECTIVE COURSES
app.get('/courses/elective/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM elective)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM elective);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL BYCHOICE COURSES
app.get('/courses/bychoice/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM bychoice_ob)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM bychoice_ob);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL OTHER COURSES
app.get('/courses/other/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        //connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM other)", function(err,rows){
        var user_id = req.params.uid
        connection.query("SELECT c.id,c.name,c.ects,u.grade FROM course AS c JOIN user_has_course AS u ON c.id=u.course_id WHERE u.user_id=? AND c.id IN (SELECT course_id FROM other);", [user_id], function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});
// GET ALL USER courses
app.get('/courses/user_courses/:uid', (req, res) => {
    pool.getConnection(function(err,connection){
        if (err)
          return res.json({"code" : 100, "status" : "Error in connection to database"});
        connection.query("SELECT * FROM course WHERE id IN (SELECT * FROM mycourses)", function(err,rows){
            connection.release();
            if(!err) {
                return res.json(rows);
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection to database"});
              return;
        });
    });
});

/*-------------------------------grade related------------------------------*/
app.put('/grades/:uid', (req, res) => {
    //check if user exists
    pool.getConnection(function(err,connection){
        if (err)
            return res.json({"code" : 100, "status" : "Error in connection to database"});

        var user_id = req.params.uid
        var course_id = req.body.course_id
        var grade = req.body.grade
        let query = "UPDATE user_has_course SET grade=? WHERE user_id=? AND course_id=?"
        connection.query(query, [grade,user_id,course_id], function(err,rows){
            connection.release();
            if(!err) {
                if(rows.length > 0)
                    res.json(rows[0]);
                else
                    res.json(rows);
            }
        });

        connection.on('error', function(err) {
              return res.json({"code" : 100, "status" : "Error in connection to database"});
        });
    });
});


//listen
app.listen(port, () =>
  console.log(`Server listening on port ${port}!`),
);

//funcs
//use crypto for password - with createCipher for practice
function encrypt_pass(data){
    var key = crypto.createCipher(alg, pass);
    var up = key.update(data,'utf8','hex')
    up += key.final('hex')
    return up
}

function decrypt_pass(data){
    var key = crypto.createDecipher(alg, pass);
    var up = key.update(data,'hex','utf8')
    up += key.final('utf8');
    return up
}
