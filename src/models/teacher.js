//require('../db/mongoose')
const mongoose=require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const teacherSchema=new mongoose.Schema({
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
    department:{                
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
    tokens:[{
        token:{
            type:String
        }
    }]

})

teacherSchema.virtual('teacherNotes', {
    ref: 'Notes',
    localField: '_id',
    foreignField: 'uploaded_by'
})

teacherSchema.methods.generateAuthToken = async function () {
    const teacher = this
    // console.log("GAT-line 55")
    const token = jwt.sign({ _id: teacher._id.toString() }, "SHRADHAisLOVE")    //process.env.JWT_SECRET
    // console.log("GAT-line 57")
    teacher.tokens = teacher.tokens.concat({ token })
    // console.log("GAT-line 59")
    await teacher.save()
    // console.log("GAT-line 61")
    return token
}

teacherSchema.methods.toJSON = function () {
    const teacher = this
    const teacherObject = teacher.toObject()

    delete teacherObject.password
    delete teacherObject.tokens
    //delete studentObject.avatar

    return teacherObject
}

teacherSchema.statics.findByCredentials = async (email, password) => {
    const teacher = await Teacher.findOne({ email })
    // console.log("fc-1")
    if (!teacher) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, teacher.password)
    // console.log("fc-2")
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return teacher
}

teacherSchema.pre('save', async function (next) {
    const teacher = this

    if (teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8)
    }

    next()
})





const Teacher=mongoose.model('Teacher',teacherSchema)

module.exports=Teacher

// const tea=new Teacher(
//     {
//         name:"CAT",
//         email:"cat@gmail.com",
//         password:"999999999999",
//         department:"CSE"
// })
// tea.save().then((e)=>{
//     console.log('SAVED teacher')
// }).catch((err)=>{

// })



