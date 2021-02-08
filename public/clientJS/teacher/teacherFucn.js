
//const AllNotesList=document.querySelector('.all-notes-list')

const getMyNotes =async ()=>{
    const data=await axios.get('http://localhost:3000/noteswantedTeacher')
    return data.data
}


const createNotesAddText=()=>{
    // name
    const nameEl1=document.createElement('label')
    const nameEl2=document.createElement('input')
    nameEl2.setAttribute('type','text')
    nameEl2.setAttribute('name','name')
    nameEl2.required=true
    nameEl1.textContent="Name "
    nameEl1.appendChild(nameEl2)
    // subject
    const subjectEl1=document.createElement('label')
    const subjectEl2=document.createElement('input')
    subjectEl2.setAttribute('type','text')
    subjectEl2.setAttribute('name','subject')
    subjectEl2.required=true
    subjectEl1.textContent="Subject "            //////
    subjectEl1.appendChild(subjectEl2)
    // semester
    const semesterEl1=document.createElement('label')
    const semesterEl2=document.createElement('input')
    semesterEl2.setAttribute('type','text')            
    semesterEl2.setAttribute('name','semester')
    semesterEl2.required=true
    semesterEl1.textContent="Semester "
    semesterEl1.appendChild(semesterEl2)    
    //REND EL
    const rendEl=document.querySelector('.add-new-notes-rend')
    AllNotesList.innerHTML=''
    rendEl.innerHTML=''
    // button
    const buttonEl=document.createElement('button')
    buttonEl.textContent='Next'

    rendEl.appendChild(nameEl1)
    rendEl.appendChild(subjectEl1)
    rendEl.appendChild(semesterEl1)
    rendEl.appendChild(buttonEl)

    // submit name subject semester
    buttonEl.addEventListener('click',()=>{
        // grab the required things
        const name=nameEl2.value
        const subject=subjectEl2.value
        const semester=semesterEl2.value
        if(name===''|| subject==='' || semester==='')
            return;
        // send request to save note
        axios.post('http://localhost:3000/notes/text',{
            name,
            subject,
            semester
        }).then((response)=>{
            // console.log(response.data) ._id
            // bring file submit
            const rendEl1=document.querySelector('.add-new-notes-rend')
            rendEl1.innerHTML=''
            const uploadEl=document.createElement('input')
            uploadEl.setAttribute('type','file')
            uploadEl.required=true
            const buttonEl1=document.createElement('button')
            buttonEl1.textContent='Submit'

            

            rendEl.appendChild(uploadEl)
            rendEl.appendChild(buttonEl1)

            buttonEl1.addEventListener('click',()=>{
                // send req to /notes/:id
                const fileD=uploadEl.files
                console.log(fileD===undefined)
                console.log(fileD)
                console.log('above')
                if(fileD){
                    const formD=new FormData()
                    formD.append('newNotes',fileD[0])
                    const contenttype={
                        header:{
                            'content-type':'multipart/form-data'
                        }
                    }
                    axios.post('/notes/'+response.data._id,formD,contenttype)
                    .then((response)=>{
                        console.log(response)  
                        rendEl1.innerHTML=''
                        const msg=document.createElement('p')
                        msg.textContent="You successfully created the notes!"
                        rendEl1.appendChild(msg)

                    }).catch((error)=>{
                        console.log(error)
                    })
                }
                        
            })
        }).catch((err)=>{
            console.log(err)
        })


    })
}


const createEle=(ele)=>{
    return document.createElement(ele)
}
// newly added
const renderMyNotes=(data)=>{
    
    AllNotesList.innerHTML=''
    notesAdd1.innerHTML=''
    notesAdd2.innerHTML=''
    const toRenderItems=data
    if(toRenderItems.length===0){
        const nameElN=document.createElement('p')
        nameElN.textContent="No Notes Found"
        nameElN.classList.add('para-not-found')
        AllNotesList.appendChild(nameElN)
        return
    }
    //----
    const nameEl=document.createElement('span')
    const semesterEl=document.createElement('span')
    const subjectEl=document.createElement('span')
    const upldAtEl=document.createElement('span')
    const teacherEl=document.createElement('span')
    const divEl=document.createElement('div')
    // const downloadEl=document.createElement('button')

    nameEl.textContent="Name"
    semesterEl.textContent="Semester"
    subjectEl.textContent="Subject"
    upldAtEl.textContent="Updated At"
    teacherEl.textContent="Uploaded by"
    
    // downloadEl.textContent='download'
    // downloadEl.setAttribute('background-color','black')

    divEl.classList.add('notes-card')
    divEl.classList.add('background-color')

    divEl.appendChild(nameEl)
    divEl.appendChild(semesterEl)
    divEl.appendChild(subjectEl)
    divEl.appendChild(upldAtEl)
    divEl.appendChild(teacherEl)
    // divEl.appendChild(downloadEl)

    AllNotesList.appendChild(divEl)

    

    toRenderItems.forEach(element => {
        // name, sem, sub,time, teacher, download 
        axios.get(`http://localhost:3000/findTeacher/${element.uploaded_by}`).then((res)=>{
                
            console.log(res)

            const nameEl=document.createElement('span')
            const semesterEl=document.createElement('span')
            const subjectEl=document.createElement('span')
            const upldAtEl=document.createElement('span')
            const teacherEl=document.createElement('span')
            const downloadEl=document.createElement('button')
            const deleteEl=document.createElement('button') //1
            const divEl=document.createElement('div')

            nameEl.textContent=element.name
            semesterEl.textContent=element.semester
            subjectEl.textContent=element.subject
            upldAtEl.textContent=moment(element.createdAt).format('DD:MM:YYYY')   ///element.createdAt  
            teacherEl.textContent=res.data       ////
            downloadEl.textContent='download'
            deleteEl.textContent='delete'//2

            divEl.classList.add('notes-card')
            // add delete listener
            deleteEl.addEventListener('click',()=>{

                let result = confirm("This item will be deleted. Continue ?");
                if (!result) {
                    return;
                }
                axios.delete(`http://localhost:3000/notes/${element._id}`).then((response)=>{
                    //
                    getMyNotes().then((data)=>{
                        // render the array of data
                        renderMyNotes(data)    
                    }).catch((err)=>{
                        console.log('error')
                    })    
                }).catch((e)=>{
                    console.log(e)
                })
            })

            downloadEl.addEventListener('click',()=>{

                axios.get(`http://localhost:3000/notes/${element._id}`).then((response)=>{/////////////////////////
                    console.log(response)
                }).catch((err)=>{
                    console.log(err)
                })
            })
    
            divEl.appendChild(nameEl)
            divEl.appendChild(semesterEl)
            divEl.appendChild(subjectEl)
            divEl.appendChild(upldAtEl)
            divEl.appendChild(teacherEl)
            divEl.appendChild(downloadEl)
            divEl.appendChild(deleteEl)
            
    
            AllNotesList.appendChild(divEl)
        }).catch((e)=>{
            location.assign(`/errorPage`)
        })

    })
}

const renderAllNotes=()=>{
    axios.get('http://localhost:3000/notesall').then((response)=>{
        // data.data===array of obj of notes--> 
        // elements req--> name,semester,subject,uploadedAt,uploadedBy,Download
        AllNotesList.innerHTML=''
        notesAdd1.innerHTML=''
        notesAdd2.innerHTML=''
        const toRenderItems=response.data
        if(toRenderItems.length==0){
            const nameElN=document.createElement('p')
            nameElN.textContent="No Notes Found"
            nameElN.classList.add('para-not-found')
            AllNotesList.appendChild(nameElN)
            return
        }
        //---- labels
        const nameEl=document.createElement('span')
        const semesterEl=document.createElement('span')
        const subjectEl=document.createElement('span')
        const upldAtEl=document.createElement('span')
        const teacherEl=document.createElement('span')
        const divEl=document.createElement('div')
        // const downloadEl=document.createElement('button')

        nameEl.textContent="Name"
        semesterEl.textContent="Semester"
        subjectEl.textContent="Subject"
        upldAtEl.textContent="Updated At"
        teacherEl.textContent="Uploaded by"
        // downloadEl.textContent='download'
        // downloadEl.setAttribute('background-color','black')

        divEl.classList.add('notes-card')
        divEl.classList.add('background-color')

        divEl.appendChild(nameEl)
        divEl.appendChild(semesterEl)
        divEl.appendChild(subjectEl)
        divEl.appendChild(upldAtEl)
        divEl.appendChild(teacherEl)
        // divEl.appendChild(downloadEl)

        AllNotesList.appendChild(divEl)
        //----
        
        toRenderItems.forEach(element => {
            
            axios.get(`http://localhost:3000/findTeacher/${element.uploaded_by}`).then((res)=>{
                
                console.log(res)

                const nameEl=document.createElement('span')
                const semesterEl=document.createElement('span')
                const subjectEl=document.createElement('span')
                const upldAtEl=document.createElement('span')
                const teacherEl=document.createElement('span')
                const downloadEl=document.createElement('button')
                const deleteEl=document.createElement('button') //1
                const divEl=document.createElement('div')

                nameEl.textContent=element.name
                semesterEl.textContent=element.semester
                subjectEl.textContent=element.subject
                upldAtEl.textContent=moment(element.createdAt).format('DD:MM:YYYY')   ///element.createdAt  
                teacherEl.textContent=res.data       ////
                downloadEl.textContent='download'
                deleteEl.textContent='delete'//2
                // deleteEl.setAttribute('background-color','blue')
                // downloadEl.setAttribute('background-color','red')

                divEl.classList.add('notes-card')
                // add delete listener
                deleteEl.addEventListener('click',()=>{
                    
                    let result = confirm("This item will be deleted. Continue ?");
                    if (!result) {
                        return;
                    }

                    axios.delete(`http://localhost:3000/notes/${element._id}`).then((response)=>{
                        renderAllNotes()
                    }).catch((e)=>{
                        console.log(e)
                    })
                })

                downloadEl.addEventListener('click',()=>{
                    axios.get(`http://localhost:3000/notes/${element._id}`).then((response)=>{/////////////////////////
                        console.log(response)
                    }).catch((err)=>{
                        console.log(err)
                    })
                })
        
                divEl.appendChild(nameEl)
                divEl.appendChild(semesterEl)
                divEl.appendChild(subjectEl)
                divEl.appendChild(upldAtEl)
                divEl.appendChild(teacherEl)
                divEl.appendChild(downloadEl)//3
                divEl.appendChild(deleteEl)

                AllNotesList.appendChild(divEl)
            }).catch((e)=>{
                location.assign(`/errorPage`)
            })

        })

    }).catch((err)=>{
        location.assign(`/errorPage`)
    })
    


}




