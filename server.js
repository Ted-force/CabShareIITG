const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.set('views',path.join(__dirname,'./public/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})


var resultArray = [];

app.post('/add', (req,res) => {
    let temptime = req.body.time.split(':');
    const time2 = Number(temptime[0]) + 1 + ":" + Number(temptime[1]);
    const time3 = time2.toString();
    const time4 = Number(temptime[0]) - 1 + ":" + Number(temptime[1]);
    const time5 = time4.toString();  

    


    if(req.body.genderCheck == 'SameGender') {
        db.serialize(() => {
            db.all('SELECT name FROM cabShare WHERE name=? AND phone=?',[req.body.name,req.body.phone],(err,rows) => {
              if(rows.length == 0) {
                db.serialize(() => {
                    db.run('INSERT INTO cabShare VALUES(?,?,?,?,?,?,?,?,?)',[req.body.name, req.body.gender, req.body.hostel, req.body.date, req.body.size, req.body.time, req.body.from, req.body.to, req.body.phone],(err) => {
                        if(err) {
                            return console.log(err.message);
                        }
                        console.log("Your entry is saved");
                    }).all(`SELECT name,phone,GroupSize,time,hostel FROM cabShare WHERE date=? AND time BETWEEN "${time5}" AND "${time3}" AND start=? AND destination=? AND gender=? AND phone!=?`,[req.body.date,  req.body.from, req.body.to, req.body.gender, req.body.phone],(err,rows) => {
                        if(err) {
                            return console.log(err.message)
                        }
                        
                        rows.forEach( row => {
                           resultArray.push(row);
                        })

                        // here was OG
                        resultArray.push(req.body.name,req.body.phone)
                            res.redirect('/result')
                            AutoDelete();
            
                    })       
                    
                })
              } else if(err) {
                  console.log(err.message);
              } else {
                 db.all(`SELECT name,phone,GroupSize,time,hostel FROM cabShare WHERE date=? AND time BETWEEN "${time5}" AND "${time3}" AND start=? AND destination=? AND gender=? AND phone!=?`,[req.body.date, req.body.from, req.body.to, req.body.gender, req.body.phone],(err,rows) => {
                    if(err) {
                        return console.log(err.message)
                    }
                    
                    rows.forEach( row => {
                       resultArray.push(row);
                    })

                    // here was OG
                    resultArray.push(req.body.name,req.body.phone)
                    res.redirect('/result')
                    AutoDelete();
        
                 })       
              }
            })
        })
    } else {
        db.serialize(() => {
            db.all('SELECT name FROM cabShare WHERE name=? AND phone=?',[req.body.name,req.body.phone],(err,rows) => {
              if(rows.length == 0) {
                db.serialize(() => {
                    db.run('INSERT INTO cabShare VALUES(?,?,?,?,?,?,?,?,?)',[req.body.name, req.body.gender, req.body.hostel, req.body.date, req.body.size, req.body.time, req.body.from, req.body.to, req.body.phone],(err) => {
                        if(err) {
                            return console.log(err.message);
                        }
                        console.log("Your entry is saved");
                    }).all(`SELECT name,phone,GroupSize,time,hostel FROM cabShare WHERE date=? AND time BETWEEN "${time5}" AND "${time3}" AND start=? AND destination=? AND phone!=?`,[req.body.date,  req.body.from, req.body.to, req.body.phone],(err,rows) => {
                        if(err) {
                            return console.log(err.message)
                        }
                        
                        rows.forEach( row => {
                           resultArray.push(row);
                        })                      

                        // here was OG
                        resultArray.push(req.body.name,req.body.phone)
                        res.redirect('/result')
                        AutoDelete();
                        
            
                    })       
                    
                })
              } else if(err) {
                  console.log(err.message);
              } else {
                 db.all(`SELECT name,phone,GroupSize,time,hostel FROM cabShare WHERE date=? AND time BETWEEN "${time5}" AND "${time3}" AND start=? AND destination=? AND phone!=?`,[req.body.date, req.body.from, req.body.to, req.body.phone],(err,rows) => {
                    if(err) {
                        return console.log(err.message)
                    }
                    console.log(rows)
                    rows.forEach( row => {
                       resultArray.push(row);
                    })                    
                    // here was OG
                    resultArray.push(req.body.name,req.body.phone)
                    res.redirect('/result')
                    AutoDelete();
                 })       
              }
            })
        })
    } 
    
    
})



app.get('/result',(req,res) => {
    res.render('result',{ results: resultArray} )
    resultArray = [];
})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

var db = new sqlite3.Database('./CabTime.db',(err) => {
    if(err) {
        console.log(err.message);
    } else {
        console.log('DB connected or created succesfully')
    }
})



function CreateTable() {
    db.run('CREATE TABLE IF NOT EXISTS cabShare (name TEXT,gender TEXT, hostel TEXT, date DATE,GroupSize TEXT, time TIME, start TEXT, destination TEXT, phone VARCHAR(10))',(err) => {
        if(err) {
            console.log(err.message)
        } else {
            console.log('table created succesfully')
        }
    });
}

function AutoDelete() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

     today = yyyy + '-' + mm + '-' + dd;
    //  db.run(`DROP TABLE cabShare`)
     db.run(`DELETE FROM cabShare WHERE date < '${today}'`);
}


AutoDelete();
CreateTable();
