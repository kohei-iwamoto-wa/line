var mongoose = require('mongoose');

// スキーマ定義
var ScheduleSchema = new mongoose.Schema({
  id: Number,
  title: String
},{ versionKey: '_somethingElse' });

var Schedule = mongoose.model('schedule', ScheduleSchema);

// mongodbに接続
mongoose.connect('mongodb://localhost:27017/schedule', { useNewUrlParser: true },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  }
);

module.exports.scheduleRegist = function (message){
    let schedule = new Schedule({
      title: message.text,
      body: ''
    });
    schedule.save(err => {
    console.log(schedule);
      if (err) console.error(err)
      console.log('saved')
    mongoose.disconnect();
  }); 
}

// Read
module.exports.scheduleConfirm = function (message){
  Schedule.findOne(message)
  .then((doc)=>{
      console.log(doc);
  }).catch((err)=>{
      console.log(err);
  });
}

// delete



//update