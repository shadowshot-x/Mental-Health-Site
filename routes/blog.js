const express = require("express");


const router = express.Router();


const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://user108:ujjwal26@ds343895.mlab.com:43895/mental-blog', (err, client) => {
  // ... start the server
  if (err) return console.log(err)
  db = client.db('mental-blog')
  console.log('the blog db connected')
})

router.get('/', function (req, res) {
    // do something here
    db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        res.render('blog-home', {quotes: result})
      })
  })
router.get('/list', function (req, res) {
    // do something here
    // db.collection('quotes').find().toArray((err, result) => {
    //     if (err) return console.log(err)
    //     // renders index.ejs
    //     res.render('blog-list', {quotes: result})
    //   })
        db.collection('quotes').find().toArray((err,result)=>{
        if(err) return console.log(err);

        res.render('blog-list',{quotes: result})
    })
  })


router.post('/quotes', (req, res) => {
    console.log(req.body);
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/blog/list')
      })
  })  

// Display the dashboard page
// router.get("/", (req, res) => {
//   res.render("dashboard");
// });


module.exports = router;