var mongoose = require('mongoose');

// スキーマ定義
var ScheduleSchema = new mongoose.Schema({
  id: Number,
  title: String,
  date: Date
});

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
// Create
module.exports.scheduleRegist = function (message){
  let schedule = new Schedule({
    title: message.text,
    // date: Date.now
  });
  if(schedule.title === '登録') {
    console.log('保存しない');
    console.log(schedule.title)
  } else if(schedule.title === '確認') {
    console.log('保存しない');
    console.log(schedule.title);
  } else if (schedule.title === '削除') {
    console.log('保存しない');
  } else {
    schedule.save(err => {
    console.log(schedule.title + 'を登録しました');
    // console.log(schedule.title.created);
    if (err) console.error(err)
    // console.log('saved');
  return schedule;
    });
  }
}

// Read
module.exports.scheduleConfirm = function (){
  
  Schedule.find()
  .then((doc)=>{
      console.log(doc);
  }).catch((err)=>{
      console.log(err);
  });
}

// delete
module.exports.scheduleDelete = function (){
  Schedule.remove({})
  .then((doc)=>{
    console.log(doc);
  }).catch((err)=>{
    console.log(err);
  });
}

// User.remove({ name: 'KrdLab' }, function(err) {
//   // ...
// });
