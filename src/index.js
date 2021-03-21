// required modules
const express=require('express')
const app=express()
const ObjectId=require('mongodb').ObjectID
const path=require('path')
const hbs=require('hbs')
const cookieParser=require('cookie-parser')

// DB and Models
require('./db/mongoose')
const Student=require('./models/student')
const Teacher=require('./models/teacher')
const Notes=require('./models/notes')

// Paths
const publicDir=path.join(__dirname,'../public')
const partialPath=path.join(__dirname,'../views/partials')
const port=process.env.PORT

// Routers
const studentRouter=require('./routers/student')
const teacherRouter=require('./routers/teacher')
const notesRouter=require('./routers/notes')

// setting view
app.set('view_engine','hbs')
hbs.registerPartials(partialPath)
// app.set('views',path.join(__dirname,'../templates'))

// Middlewares
app.use(express.json())
app.use(cookieParser())                                 
app.use(express.urlencoded({extended:false}))           // so that form data get binds to req.body  VIIPPPPPP for post req ie with data
app.use(express.static(publicDir))

app.use(studentRouter)
app.use(notesRouter)
app.use(teacherRouter)



app.get('/',(req,res)=>{        //////////////------------manageNotes/home
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
app.get('/*',(req,res)=>{
    res.render('errorPage.hbs')
})


app.listen(port,()=>                        
    console.log('Server is running on '+port)
)