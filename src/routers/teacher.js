// DB stuff
const Teacher=require('../models/teacher')

// Express Stuff
const express=require('express')
const router = new express.Router()

// Middelwares
const auth =require('../middleware/auth')
const { count } = require('../models/teacher')

// // teacher home
// router.get('/teacher/home',(req,res)=>{
// login    
router.post('/teachers/login', async (req, res) => {
    try {
        const teacher = await Teacher.findByCredentials(req.body.email, req.body.password)
        // console.log("r-1")
        const token = await teacher.generateAuthToken()
        // console.log("r-2")          
        res
            .status(201)
            .cookie("auth_token",token)
            .redirect('/teacherNotes')
    } catch (e) {
        res.status(400).render('loginTeacher.hbs',{
            error:"Invalid Password or Email."
        })
    }
})

// send teacher by id
router.get('/findTeacher/:id',async(req,res)=>{
    const _id=req.params.id
    try{
        const teacher=await Teacher.findById({_id})
        res.send(teacher.name)
    }catch(err){
        res.status(400).send(err)
    }
    
})

//  Teacher signup  
router.post('/teachers/signup', async (req, res) => {
    console.log("DONE")
    try {
        req.body.name=req.body.name.charAt(0).toUpperCase()+req.body.name.slice(1)
        console.log(req.body.name)
        console.log(1)
        const teacher = new Teacher(req.body)
        console.log(teacher)
        await teacher.save()
        console.log(2)
        const token = await teacher.generateAuthToken()
        // console.log(token)
        console.log(3)
        res
            .status(201)
            .cookie("auth_token",token)
            .redirect('/teacherNotes')
    } catch (e) {                                   // e.errors.email.message
        // const errorElements=Object.keys(e.errors)
        // const oneEl=errorElements[0]
        
        // res.status(400).render('signupTeacher.hbs',{
        //     error:`${oneEl} is invalid`
        // })
        res.send("ERROR")
    }
})

// logout      
router.get('/teachers/logout', auth , async (req, res) => {
    try {
        req.teacher.tokens = req.teacher.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.teacher.save()
        res.redirect('/manageNotes/home')
    } catch (e) {
        res.status(500).send()
    }
})

//get account       
router.get('/teachers/me', auth, async (req, res) => {
    
    const teacherInfo={
        name:req.teacher.name,
        department:req.teacher.department,
        email:req.teacher.email,
        isTeacher:true
    }
    
    res.render('profileTeacher.hbs',teacherInfo)
})

// update 
router.patch('/teachers/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']                                        /////////////---------------------
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.teacher[update] = req.body[update])
        await req.teacher.save()
        res.send(req.teacher)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete account           -------verified
router.delete('/teachers/me', auth, async (req, res) => {
    try {
        await req.teacher.remove()
        res.send(req.teacher)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports= router