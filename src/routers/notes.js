// DB stuff
const Notes=require('../models/notes')
const Teacher=require('../models/teacher')
// Express Stuff
const express= require('express')
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
// delete notes for teachers    ---- verified                                                                       
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
router.get('/teacherNotes',auth,async (req,res)=>{

    if(req.query.subject){
        req.query.subject=req.query.subject.split("-").join(" ")
    }

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
        await req.teacher.populate({
            path:'teacherNotesCount',
            match:queryForNotes
        }).execPopulate()
        const totalNumberOfNotes=req.teacher.teacherNotesCount
        const totalNumberOfPages=Math.ceil(totalNumberOfNotes/10)
        const reqRangeDemo=[parseInt(req.query.range.split('to')[0]), parseInt(req.query.range.split('to')[1]) ]
        const reqRange=[]
        for(let i=reqRangeDemo[0];i<=reqRangeDemo[1];i++){
            reqRange.push(i)
            if(i>=totalNumberOfPages)
                break;
        }

        await req.teacher.populate({      
                path: 'teacherNotes',
                select:'name subject semester uploaded_by createdAt updatedAt',
                match:queryForNotes,
                options: {
                    limit:10,  
                    skip:(parseInt(req.query.skip)-1)*10,
                    sort:{
                        createdAt:-1    // to extract information by sorting
                    }
                }
            }).execPopulate()
        if(!req.teacher.teacherNotes){
            return res.status(404).send()
        }

        const query={}
        if(req.query.semester){
            query.semester=req.query.semester
        }
        if(req.query.branch){
            query.branch=req.query.branch
        }

        const allSubjects=await Notes.find(query,'subject') 

        
        const notesToSend=[]       
        const filterSubjects=[]      

        allSubjects.forEach((item)=>{
            if(!filterSubjects.includes(item.subject)){
                filterSubjects.push(item.subject.split(" ").join("-"))//////s
            }
        })

        for(let i=0;i<req.teacher.teacherNotes.length;i++){
            let oneNote=req.teacher.teacherNotes[i]
            notesToSend.push({
                name:oneNote.name,
                semester:oneNote.semester,
                subject:oneNote.subject,
                time:moment(oneNote.createdAt).format('DD:MM:YYYY'),    
                teacherName:req.teacher.name,
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
        res.render('teacherNotes.hbs',{
            notes:notesToSend,
            isEmpty:(notesToSend.length===0)?true:false,
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
    }catch(err){
        console.log('EEEEEEERRRRRRRRROOOOOOOOOOORRRRRRR')
        console.log(error)
        res.status(500).send()
    }
})
router.get('/studentNotes', auth, async (req, res) => {             
    if(req.query.subject){
        req.query.subject=req.query.subject.split("-").join(" ")
    }
    
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
        await req.student.populate({
            path:'studentNotesCount',
            match:queryForNotes
        }).execPopulate()
        const totalNumberOfNotes=req.student.studentNotesCount
        const totalNumberOfPages=Math.ceil(totalNumberOfNotes/10)
        const reqRangeDemo=[parseInt(req.query.range.split('to')[0]), parseInt(req.query.range.split('to')[1]) ]
        const reqRange=[]
        for(let i=reqRangeDemo[0];i<=reqRangeDemo[1];i++){
            reqRange.push(i)
            if(i>=totalNumberOfPages)
                break;
        }

        await req.student.populate({      
                path: 'studentNotes',
                select:'name subject semester uploaded_by createdAt updatedAt',
                match:queryForNotes,
                options: {
                    limit:10,  
                    skip:(parseInt(req.query.skip)-1)*10,
                    sort:{
                        createdAt:-1    // to extract information by sorting
                    }
                }
            }).execPopulate()
        if(!req.student.studentNotes){
            return res.status(404).send()
        }

        const query={}
        if(req.query.semester){
            query.semester=req.query.semester
        }
        if(req.query.branch){
            query.branch=req.query.branch
        }

        const allSubjects=await Notes.find(query,'subject') 

        
        const notesToSend=[]       
        const filterSubjects=[]      

        allSubjects.forEach((item)=>{
            if(!filterSubjects.includes(item.subject)){
                filterSubjects.push(item.subject.split(" ").join("-"))//////
            }
        })

        for(let i=0;i<req.student.studentNotes.length;i++){
            let oneNote=req.student.studentNotes[i]
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
        res.render('studentNotes.hbs',{
            notes:notesToSend,
            isEmpty:(notesToSend.length===0)?true:false,
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
    }catch(err){
        console.log('EEEEEEERRRRRRRRROOOOOOOOOOORRRRRRR')
        console.log(error)
        res.status(500).send()
    }
})
// new get all notes logic
router.get('/allNotesPage',auth,async (req,res)=>{

    if(req.query.subject){
        req.query.subject=req.query.subject.split("-").join(" ")
    }

    const queryForNotes={}
    for( let i in req.query){
        if(["criteria","mode","skip","range"].includes(i)){ 
            continue
        }
        queryForNotes[i]=req.query[i]
    }
    if(!req.query.skip){
        req.query.skip="1"
    }
    if(!req.query.range){
        req.query.range="1to5"
    }

    try{
        const totalNumberOfNotes=await Notes.countDocuments(queryForNotes)
        const totalNumberOfPages=Math.ceil(totalNumberOfNotes/10)        // set limit here limit=3 now
        const reqRangeDemo=[parseInt(req.query.range.split('to')[0]), parseInt(req.query.range.split('to')[1]) ]
        const reqRange= []
        for(let i=reqRangeDemo[0];i<=reqRangeDemo[1];i++){
            reqRange.push(i)
            if(i>=totalNumberOfPages)
                break;
        } 
        // const notes=await Notes.find(queryForNotes,'_id name subject semester uploaded_by createdAt updatedAt')
        const notes=await Notes.find(queryForNotes,
                                ['_id', 'name', 'subject', 'semester', 'uploaded_by', 'createdAt', 'updatedAt'],
                                {   skip:(parseInt(req.query.skip)-1)*10,   /////------------current             // set limit here limit=3 now
                                    limit:10,                                                                     // set limit here limit=3 now
                                    sort:{
                                        createdAt:-1    // to extract information by sorting
                                    }
                                })
        if(!notes){
            return res.status(404).send()
        }
        const query={}
        if(req.query.semester){
            query.semester=req.query.semester
        }
        if(req.query.branch){
            query.branch=req.query.branch
        }

        const allSubjects=await Notes.find(query,'subject') 
        
        const notesToSend=[]       
        const filterSubjects=[]      

        allSubjects.forEach((item)=>{
            if(!filterSubjects.includes(item.subject)){
                filterSubjects.push(item.subject.split(" ").join("-"))//////
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

        res.render('allNotesPage.hbs',{
            notes:notesToSend,
            isEmpty:(notesToSend.length===0)?true:false,////////////////////////
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
        res.status(500).send(e)
    }
})
router.get('/addNotes', (req,res)=>{
    res.render('addNotes.hbs',{
        isTeacher:true
    })
})

module.exports= router

