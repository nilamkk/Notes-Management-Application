// DB stuff
const Notes=require('../models/notes')

// Express Stuff
const express=require('express')
const router = new express.Router()
const multer = require('multer')
const  auth =require('../middleware/auth')



// Download one particular notes            ----- aitu jjjjuuuuiiiiii
router.get('/notes/:id',auth,  async (req, res) => {
    const _id = req.params.id

    try {
        // console.log(0)
        const notes = await Notes.findOne( {_id})       
        // console.log(1)
        if (!notes) {
            return res.status(404).send()
        }
        // student.tokens = student.tokens.concat({ token })
        if(req.student){
            const index=notes.downloaded_by.findIndex((student)=>{                          ////////////////debuging
                return student.student.str===req.student._id.str
            })
            if(index===-1){
                // console.log('inside -1')
                notes.downloaded_by=notes.downloaded_by.concat({student:req.student._id})
            }
        }else{
            notes.downloaded_by=notes.downloaded_by.concat({student:req.teacher._id})
        }
        // console.log(2)
        await notes.save()
        const toSend=notes.mainFile
        // // console.log(3)
        res.set('Content-Type',"application/pdf")                                   ///////---------cant handle ppt and docx
        // // console.log(4)
        res.send(toSend)
    } catch (e) {
        res.status(500).send()
    }
})

// By students and teachers
// get notes with limit and sorting------DONE
router.get('/noteswantedTeacher', auth, async (req, res) => {             
    console.log(0)
    const sort = {}
    sort['createdAt']=-1
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }


    try {
        console.log(1)
        await req.teacher.populate({      
            path: 'teacherNotes',
            select:'name subject semester uploaded_by createdAt updatedAt',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        console.log(2)
        res.send(req.teacher.teacherNotes)    
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/noteswantedStudent', auth, async (req, res) => {             
    const sort = {}
    sort['createdAt']=-1
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.student.populate({       
            path: "studentNotes",
            select:'name subject semester uploaded_by createdAt updatedAt',               ////// dont know why including downloaded by
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.student.studentNotes)    
    } catch (e) {
        res.status(500).send(e)
    }
})





// get all notes-------- verified
router.get('/notesall', auth, async (req, res) => {                                                   ////  -----   to add Filtering
    try {
        
        const notes = await Notes.find({},'_id name subject semester uploaded_by createdAt updatedAt')
    
        
        if (!notes) {
            return res.status(404).send()
        }
        // req.query    sortBy-Date  Filterby- subject, semester

        // console.log(3)
        res.send(notes)
    } catch (e) {
        res.status(500).send()
    }
})


// delete notes for teachers    ---- verified                                                                       left to do
router.delete('/notes/:id', auth, async (req, res) => {
    try {
        const notes = await Notes.findOneAndDelete({ _id: req.params.id, uploaded_by: req.teacher._id })

        if (!notes) {
            res.status(404).send()
        }

        res.send("Deleted Successfully")
    } catch (e) {
        res.status(500).send()
    }
})

// multer
const upload = multer({
    limits: {
        fileSize: 500000000    // 500 MB  
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|ppt|docx)$/)) {
            return cb(new Error('Please upload a pdf/ppt/docx'))
        }

        cb(undefined, true)
    }
})

// Create notes for teacher only    --------verified
router.post('/notes/text', auth, async (req, res) => {
    
    const notes = new Notes({
        ...req.body,
        uploaded_by: req.teacher._id
    })

    try {
        await notes.save()
        res.status(201).send(notes)
    } catch (e) {
        res.status(400).send(e)
    }
})


// file add ---------verified
router.post('/notes/:id', auth,upload.single('newNotes'), async (req, res) => {
    try{
        const _id=req.params.id
        const notes= await Notes.findById(_id)
        notes.mainFile=req.file.buffer
        await notes.save()
        res.status(201).send("File saved")
    }catch(e){
        throw new Error(e)
    }
})




// upload notes
// show latest 10 notes, show all notes
// downloaded my notes 
// get teachers uploaded notes
// get students uploaded notes   
// for teacher-- delete notes, create notes ----done


module.exports= router
