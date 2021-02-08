// DB and Models
require('./db/mongoose')
const ObjectId=require('mongodb').ObjectID
const Student=require('./models/student')
const Teacher=require('./models/teacher')
const Notes=require('./models/notes')
const path=require('path')
const hbs=require('hbs')
const cookieParser=require('cookie-parser')
const publicDir=path.join(__dirname,'../public')

// Routers
const studentRouter=require('./routers/student')
const teacherRouter=require('./routers/teacher')
const notesRouter=require('./routers/notes')

// Express stuffs
const express=require('express')
const app=express()


// setting view
app.set('view_engine','hbs')
// app.set('views',path.join(__dirname,'../templates'))

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))           // so that form data get binds to req.body  VIIPPPPPP
app.use(express.static(publicDir))
app.use(notesRouter)
app.use(studentRouter)
app.use(teacherRouter)
// console.log(path.join(__dirname,'./templates'))

app.get('/manageNotes/home',(req,res)=>{
    res.render('notesHome.hbs')
})

app.get('/signup/student/page',(req,res)=>{
    res.render('signupStudent.hbs')
})

app.get('/login/student/page',(req,res)=>{
    res.render('loginStudent.hbs')
})
app.get('/signup/teacher/page',(req,res)=>{
    res.render('signupTeacher.hbs')
})

app.get('/login/teacher/page',(req,res)=>{
    res.render('loginTeacher.hbs')
})

app.get('/errorPage',(req,res)=>{
    res.render('errorPage.hbs')
})

app.get('/*',(req,res)=>{
    res.render('errorPage.hbs')
})

app.listen(3000,()=>                        ///////// PORT SETUP FOR PRODUCTION
    console.log('Server is running')
)