const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@db.htx4l.mongodb.net/pms?authSource=admin&replicaSet=atlas-winoqm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', { useNewUrlParser: true});

var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
 
var userModel = mongoose.model('users', userSchema);
module.exports = userModel;