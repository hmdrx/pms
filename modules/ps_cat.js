const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@db.htx4l.mongodb.net/pms?authSource=admin&replicaSet=atlas-winoqm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', { useNewUrlParser: true});

var conn = mongoose.Collection;
var psCatSchema = new mongoose.Schema({
    ps_cat: {
        type: String,
        required: true,
        
    },
   
    date:{
        type:Date,
        default:Date.now
    }
});

var ps_catModel = mongoose.model('ps_cat', psCatSchema);
module.exports = ps_catModel;   