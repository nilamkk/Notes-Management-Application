// DB stuff
const Student=require('../models/student')

// Express Stuff
const express=require('express')
const router = new express.Router()


// Middelwares
const  auth =require('../middleware/auth')


// student home page
router.get('/student/home',(req,res)=>{
    res.render('student_home.hbs')
})

//  Student signup  -----verifiedd
router.post('/students/signup', async (req, res) => {
    
    // console.log(req.body)
    const student = new Student(req.body)

    try {
        await student.save()
        const token = await student.generateAuthToken()     
        res
            .status(201)
            .cookie("auth_token",token)
            .redirect('/student/home')           /// httponly .............
        
    } catch (e) {
        const errorElements=Object.keys(e.errors)
        const oneEl=errorElements[0]

        res.status(400).render('signupStudent.hbs',{
            error:`${oneEl} is invalid`
        })
    }
})          ////////here i am

// login----------verified
router.post('/students/login', async (req, res) => {
    try {
        const student = await Student.findByCredentials(req.body.email, req.body.password)
        const token = await student.generateAuthToken()
        // console.log("Successfully logged in")
        res
            .status(200)
            .cookie("auth_token",token)
            .redirect('/studentNotes')
    } catch (e) {
        res.status(400).render("loginStudent.hbs",{
            error:"Invalid Password or Email."
        })
    }
})


// logout       --verified                                                                          left to do
router.get('/students/logout', auth, async (req, res) => {                                         
    try {
        req.student.tokens = req.student.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.student.save()
        // console.log("DONE")
        res.redirect('/manageNotes/home')//////////////"Pragma", "no-cache"//"Cache-Control","no-cache, no-store, must-revalidate"
    } catch (e) {
        res.status(500).send()
    }
})

//get account-------verified                                                                        
router.get('/students/me', auth, async (req, res) => {
    res.send(req.student)
})

// update                                                                                                   letf
router.patch('/students/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']                                    /////////////---------------------
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.student[update] = req.body[update])
        await req.student.save()
        res.send(req.student)
    } catch (e) {
        res.status(400).send(e)
    }
})


// delete account       -------------verified                                                           left
router.delete('/students/me', auth, async (req, res) => {
    try {
        await req.student.remove()
        res.send(req.student)
    } catch (e) {
        res.status(500).send()
    }
})



module.exports= router