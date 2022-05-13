const mongoose = require('mongoose');


const publicSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            require:true
        },
        description:{
            type:String,
            require:true
        },
        userId:{
            type:String,
            require:true
        },
        displayName:{
            type:String,
            require:true
        },
        email:{
            type:String,
            require:true
        }

    }
)

const publics = new mongoose.model('publics',publicSchema)


module.exports = publics