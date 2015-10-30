var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!log
  console.log('db connected... ');
});

var UserSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

module.exports.User = mongoose.model('Users', UserSchema);
