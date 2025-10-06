const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
 name : {type : String, required : true},
 done :{type: Boolean, default: false},
 
 checklists:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Checklists',
    required: true
 }
 
});

module.exports = mongoose.model('Task', taskSchema)