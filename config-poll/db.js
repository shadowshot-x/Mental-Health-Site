const mongoose=require('mongoose');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://user108:ujjwal26@ds341825.mlab.com:41825/mental-poll')
    .then(()=>console.log('MongoDb connected'))
    .catch(err=>console.log(err));