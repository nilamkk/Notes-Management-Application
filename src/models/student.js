//require('../db/mongoose')
const mongoose=require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const studentSchema=new mongoose.Schema({           ///// Sanitization left
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    scholar_no:{
        type:Number,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(value.toString().length !=7 ){
                throw new Error('Invalid Scholar No')
            }
            const noStr=value.toString()[0]+value.toString()[1]
            if(noStr!="17" && noStr!="18" && noStr!="19" && noStr!="20"){
                throw new Error('Invalid Scholar No')
            }
            
        }
    },
    branch:{                
        type:String,
        required:true,
        trim:true,
        validate(value){
            const validVal=["CSE","Computer Science and Engineering","ECE","Electronics and Communication Engineering","EIE","Electronics and Instrumentation Engineering",
                "ME","Mechanical Engineering","EE","Electrical Engineering","CE","Civil Engineering"]
            
            const exist=validVal.findIndex((val)=>{
                return val.toLowerCase()===value.toLowerCase()
            })
            if(exist===-1){
                throw new Error('Invalid Branch!')
            }
        }
    },
    section:{               
        type:String,
        required:true,
        maxlength:1,
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
    tokens:[{
        token:{
            type:String
        }
    }]

})

studentSchema.virtual('studentNotes', {
    ref: 'Notes',
    localField: '_id',
    foreignField: 'downloaded_by.student'
})
studentSchema.virtual('studentNotesCount', {
    ref: 'Notes',
    localField: '_id',
    foreignField: 'downloaded_by.student',
    count:true
})

studentSchema.methods.generateAuthToken = async function () {
    const student = this
    const token = jwt.sign({ _id: student._id.toString() }, "SHRADHAisLOVE")   // process.env.JWT_SECRET

    student.tokens = student.tokens.concat({ token })
    await student.save()

    return token
}

studentSchema.methods.toJSON = function () {
    const student = this
    const studentObject = student.toObject()

    delete studentObject.password
    delete studentObject.tokens
    //delete studentObject.avatar

    return studentObject
}

studentSchema.statics.findByCredentials = async (email, password) => {
    const student = await Student.findOne({ email })

    if (!student) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, student.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return student
}

studentSchema.pre('save', async function (next) {
    const student = this

    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8)
    }

    next()
})




const Student=mongoose.model('Student',studentSchema)

module.exports=Student

// const me=new Student(
//     {
//         name:"Kuldip",
//         email:"kuldip@gmail.com",
//         password:"999999999999",
//         scholar_no:1815128,
//         branch: "CSE",
//         section:"B",
//         semester:5
    

// })
// me.save().then((e)=>{
//     console.log('SAVED student')
// }).catch((err)=>{

// })



