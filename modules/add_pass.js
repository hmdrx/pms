const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@db.htx4l.mongodb.net/pms?authSource=admin&replicaSet=atlas-winoqm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', { useNewUrlParser: true});

var conn = mongoose.Collection;
var passSchema = new mongoose.Schema({
    ps_cat: {
        type: String,
        required: true,
        
    },
    pro_name: {
        type: String,
        required: false
        
    },
    ps_details: {
        type: String,
        required: false
        
    },
   
    date:{
        type:Date,
        default:Date.now
    }
});

var passwordModule = mongoose.model('password_details', passSchema);
module.exports = passwordModule;