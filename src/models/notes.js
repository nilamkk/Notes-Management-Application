// properties of notes:
// name, description=subject+semester, uploaded time, uploaded by

const mongoose=require('mongoose')
const noteSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    fileName:{
        type:String,
        required:true,
        trim:true
    },
    subject:{
        type:String,
        required:true,
        trim:true
    },
    semester:{
        type:Number,
        required:true,
        trim:true,
        validate(value){
            if( value>8 || value<1 ){
                throw new Error('Invalid Semester!')
            }  
        }
    },
    branch:{
        type:String,
        required:true,
        trim:true
    },
    uploaded_by:{
        type: mongoose.Schema.Types.ObjectID,
        required:true,
        ref:'Teacher'
    },
    downloaded_by:[{
        student:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Notes'
        }
    }],
    mainFile:{
        type:Buffer
    }

},{
    timestamps:true                             
})

const notes= mongoose.model('Notes',noteSchema)

module.exports=notes
