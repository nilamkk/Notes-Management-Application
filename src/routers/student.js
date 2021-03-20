// DB stuff
const Student=require('../models/student')

// Express Stuff
const express=require('express')
const router = new express.Router()

// Middelwares
const  auth =require('../middleware/auth')

//  Student signup  -----verifiedd
router.post('/students/signup', async (req, res) => {
    
    req.body.name=req.body.name.charAt(0).toUpperCase()+req.body.name.slice(1)
    const student = new Student(req.body)

    try {
        await student.save()
        const token = await student.generateAuthToken()     
        res
            .status(201)
            .cookie("auth_token",token)
            .redirect('/studentNotes')           /// httponly .............
        
    } catch (e) {
        const errorElements=Object.keys(e.errors)
        const oneEl=errorElements[0]

        res.status(400).render('signupStudent.hbs',{
            error:`${oneEl} is invalid`
        })
    }
})
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
        res.redirect('/manageNotes/home')
    } catch (e) {
        res.status(500).send()
    }
})

//get account-------verified                                                                        
router.get('/students/me', auth, async (req, res) => {
    // res.send(req.student)

    const studentInfo={
        name:req.student.name,
        section:req.student.section,
        branch:req.student.branch,
        semester:req.student.semester,
        email:req.student.email,
        scholar_no:req.student.scholar_no
    }
    res.render('profileStudent.hbs',studentInfo)
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