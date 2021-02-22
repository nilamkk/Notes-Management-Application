// DB stuff
const Notes=require('../models/notes')
const Teacher=require('../models/teacher')
// Express Stuff
const express=require('express')
const router = new express.Router()
const multer = require('multer')
const moment=require('moment')
const mimeType=require('mime-types')
const  auth =require('../middleware/auth')

// Download one particular notes            
router.get('/notes/:id',auth,  async (req, res) => {
    const _id = req.params.id
    try {
        const notes = await Notes.findOne( {_id})       
        if (!notes) {
            return res.status(404).send()
        }
        if(req.student){
            const index=notes.downloaded_by.findIndex((student)=>{                          ////////////////debuging
                return student.student.str===req.student._id.str
            })
            if(index===-1){
                notes.downloaded_by=notes.downloaded_by.concat({student:req.student._id})
            }
        }
        await notes.save()
        const toSend=notes.mainFile
        res.setHeader('Content-Disposition', 'attachment; filename=' + notes.fileName);
        res.setHeader('Content-Type',mimeType.contentType(notes.fileName))   

        res.send(toSend)
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
        res.send('DONE')
    } catch (e) {
        res.status(500).send()
    }
})

// By students and teachers
// get notes with limit and sorting------DONE
router.get('/teacherNotes', auth, async (req, res) => {             

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

        const notesToSend=[]        // notesToSend-> array of object {}
        // better you populate later

        req.teacher.teacherNotes.forEach( async (oneNote)=>{
            // const teacher=await Teacher.findById({_id:oneNote.uploaded_by},'name')
            notesToSend.push({
                name:oneNote.name,
                semester:oneNote.semester,
                subject:oneNote.subject,
                time:moment(oneNote.createdAt).format('DD:MM:YYYY'),    
                teacherName:req.teacher.name,
                notesId:oneNote._id
            })
        })

        res.render('teacherNotes.hbs',{
            notes:notesToSend,
            isTeacher:true
        })
        // res.send(req.teacher.teacherNotes)    
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/studentNotes', auth, async (req, res) => {             
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
        // send students home page
        const notesToSend=[]        // notesToSend-> array of object {}
        // better you populate later

        req.student.studentNotes.forEach( async (oneNote)=>{
            const teacher=await Teacher.findById({_id:oneNote.uploaded_by},'name')
            notesToSend.push({
                name:oneNote.name,
                semester:oneNote.semester,
                subject:oneNote.subject,
                time:moment(oneNote.createdAt).format('DD:MM:YYYY'),    
                teacherName:teacher.name,
                notesId:oneNote._id
            })
        })

        res.render('studentNotes.hbs',{
            notes:notesToSend,
            isTeacher:false
        })
    } catch (e) {
        res.status(500).send(e)
    }
})
// new get all notes logic
router.get('/allNotesPage',auth,async (req,res)=>{

    const queryForNotes={}
    for( let i in req.query){
        if(["criteria","mode","skip","range"].includes(i)){ /////////////////////////////////////////------------------
            continue
        }
        queryForNotes[i]=req.query[i]
    }
    if(!req.query.skip){        //////////--------
        req.query.skip="1"
    }
    if(!req.query.range){
        req.query.range="1to5"
    }

    try{
        /////------------current
        const totalNumberOfNotes=await Notes.countDocuments(queryForNotes)
        // console.log(totalNumberOfNotes)
        const totalNumberOfPages=Math.ceil(totalNumberOfNotes/3)        // set limit here limit=3 now
        const reqRangeDemo=[parseInt(req.query.range.split('to')[0]), parseInt(req.query.range.split('to')[1]) ]
        const reqRange= []
        for(let i=reqRangeDemo[0];i<=reqRangeDemo[1];i++){
            reqRange.push(i)
            // console.log(i)
            if(i>=totalNumberOfPages)
                break;
        } 
        // req.query.skip
        // Math.ceil()
        /////------------current

        // const notes=await Notes.find(queryForNotes,'_id name subject semester uploaded_by createdAt updatedAt')
        const notes=await Notes.find(queryForNotes,
                                ['_id', 'name', 'subject', 'semester', 'uploaded_by', 'createdAt', 'updatedAt'],
                                {   skip:(parseInt(req.query.skip)-1)*3,   /////------------current             // set limit here limit=3 now
                                    limit:3,                                                                     // set limit here limit=3 now
                                    sort:{
                                        createdAt:-1    // to extract information by sorting
                                    }
                                })

        const query={}
        if(req.query.semester){
            query.semester=req.query.semester
        }
        if(req.query.branch){
            query.branch=req.query.branch
        }

        const allSubjects=await Notes.find(query,'subject') 

        if(!notes){
            return res.status(404).send()
        }
        const notesToSend=[]       
        const filterSubjects=[]      

        allSubjects.forEach((item)=>{
            if(!filterSubjects.includes(item.subject)){
                filterSubjects.push(item.subject)
            }
        })

        for(let i=0;i<notes.length;i++){
            let oneNote=notes[i]
            const teacher=await Teacher.findById({_id:oneNote.uploaded_by},'name')
            notesToSend.push({
                name:oneNote.name,
                semester:oneNote.semester,
                subject:oneNote.subject,
                time:moment(oneNote.createdAt).format('DD:MM:YYYY'),    
                teacherName:teacher.name,
                notesId:oneNote._id
            })
        }

        if(!req.query.subject){
            queryForNotes.subject="All"
        }
        if(!req.query.semester){
            queryForNotes.semester="All"
        }
        if(!req.query.branch){
            queryForNotes.branch="All"
        }
        // time name
        let criteria=""
        let mode="" 
        if(!req.query.criteria || req.query.criteria=='time'){
            criteria="time"
        }else {
            criteria="name"
        }

        let sortFun=()=>{}

        if(!req.query.mode || req.query.mode==='-1'){
            //-1
            mode="-1"
            // console.log("-1")
            sortFun=(a,b)=>{
                if(a[criteria] < b[criteria])
                    return 1    // change
                return -1   // no change
            }
        }else{
            //1
            mode="1"
            // console.log("1")
            sortFun=(a,b)=>{
                if(a[criteria] > b[criteria])
                    return 1    // change
                return -1   // no change
            }
        }
        // to sort a page
        notesToSend.sort(sortFun)

        // notesToSend.forEach((ee)=>{
        //     console.log(ee.name," " ,ee.time)
        // })
        
        res.render('allNotesPage.hbs',{
            notes:notesToSend,
            isTeacher:(req.student===undefined),
            currentFilter:queryForNotes,
            filterSubjects:filterSubjects,
            sortBy:{
                criteria:criteria,
                mode:mode
            },
            reqRange:reqRange,
            activatePage:req.query.skip // page no
        })
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})

// multer
const upload = multer({
    limits: {
        fileSize: 500000000    // 500 MB  
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|ppt|docx|doc|pptx|txt|xlsx|jpg|png)$/)) {
            return cb(new Error('Please upload a pdf/ppt/docx/pptx/txt/xlsx/jpg/png'))
        }
        req.fileName =file.originalname
        cb(undefined, true)
    }
})
router.post('/addNotes',auth,upload.single('newNotes'),async (req,res)=>{
     
    const notes = new Notes({
        ...req.body,
        fileName:req.fileName,
        uploaded_by: req.teacher._id,
        downloaded_by:[],
        mainFile:req.file.buffer
    })

    try {
        await notes.save()
        res.render('addNotes.hbs',{
            isTeacher:true,
            error:'Some error occured!',
            message:'Notes added successfully'
        })
    } catch (e) {
        res.status(400).send(e)
    }

})
router.get('/addNotes', (req,res)=>{
    res.render('addNotes.hbs',{
        isTeacher:true
    })
})

module.exports= router
