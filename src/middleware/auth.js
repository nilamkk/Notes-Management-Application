const jwt = require('jsonwebtoken')
const Student = require('../models/student')
const Teacher = require('../models/teacher')

const auth = async (req, res, next) => {
    try {
        // const token = req.header('Authorization').replace('Bearer ', '')            //// handle this
        const token=req.cookies.auth_token
        const decoded = jwt.verify(token, "SHRADHAisLOVE")  //process.env.JWT_SECRET                   
        const student = await Student.findOne({ _id: decoded._id, 'tokens.token': token })
        const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token })
        // console.log("A1")
        if ((!student) && (!teacher)) {
            throw new Error()
        }
        // console.log("A2")
        if(student){
            req.token = token
            req.student = student
        }else{
            req.token = token
            req.teacher = teacher
        }
        // console.log("A3")
        next()
    } catch (e) {
        res.status(400).render('notesHome.hbs')
    }
}



module.exports = auth