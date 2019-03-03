const express = require("express");
const cors=require('cors');
const Vote=require('../config-poll/vote')

require('../config-poll/db');
const router = express.Router();

const Pusher=require('pusher');

var pusher = new Pusher({
    appId: '717245',
    key: '23c2ed96b04945a65169',
    secret: '93e34ed954930de36407',
    cluster: 'ap2',
    encrypted: true
  });

  router.get('/',(req,res)=>{
    res.render("poll");
}) 

router.get('/poll',(req,res)=>{
    Vote.find().then(votes=>res.json({success:true,votes:votes}))
}) 

router.post('/poll',(req,res)=>{
    const newVote={
      os:req.body.os,
      points:1
    }
  
    new Vote(newVote).save().then(vote=>{
      pusher.trigger('os-poll', 'os-vote', {
        points:parseInt(vote.points),
        os:vote.os
      });
  
      return res.render('/')
    })
  
  
      
  })
 


router.use(cors())





module.exports = router;