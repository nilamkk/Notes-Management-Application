// // essentials
// const AllNotesButton=document.querySelector('.get-all-notes')
// const AllNotesList=document.querySelector('.all-notes-list')
// const myProfile=document.querySelector('.links-to-surf-profile')//
// const myLogout=document.querySelector('.links-to-surf-logout')//get-my-notes-again
// const myNotesEl=document.querySelector('.get-my-notes-again')//get-my-notes-again


// // setting cookies with axios
// axios.defaults.withCredentials = true;

// // Only notes I downloaded get and render
// // getMyNotes()

// // My profile
// myProfile.addEventListener('click',()=>{
//     axios.get('http://localhost:3000/students/me').then((response)=>{
//         console.log(response)
//         AllNotesList.innerHTML=''
//         // branch email name section schno semester
//         const BranchEl=createEle('span')
//         const EmailEl=createEle('span')
//         const NameEl=createEle('span')
//         const SecEl=createEle('span')
//         const SchNoEl=createEle('span')
//         const SemEl=createEle('span')
//         const divEl1=createEle('div')

//         NameEl.textContent=response.data.name
//         BranchEl.textContent=response.data.branch
//         EmailEl.textContent=response.data.email
//         SecEl.textContent=response.data.section
//         SchNoEl.textContent=response.data.scholar_no
//         SemEl.textContent=response.data.semester
        

//         // divEl1.appendChild(NameEl)
//         // divEl1.appendChild(EmailEl)
//         // divEl1.appendChild(BranchEl)
//         // divEl1.appendChild(SchNoEl)
//         // divEl1.appendChild(SemEl)
//         // divEl1.appendChild(SecEl)

//         const levelEl1=createEle('label')
//         levelEl1.textContent="Name"
        
//         const levelEl2=createEle('label')
//         levelEl2.textContent="Email"        

//         const levelEl3=createEle('label')
//         levelEl3.textContent="Scholar ID"
        
//         const levelEl4=createEle('label')
//         levelEl4.textContent="Semester"

//         const levelEl5=createEle('label')
//         levelEl5.textContent="Section"
    
//         const levelEl6=createEle('label')
//         levelEl6.textContent="Branch"

//         const divEl2=createEle('div')
//         divEl2.classList.add('profile-box-inner')
//         divEl2.appendChild(levelEl1)
//         divEl2.appendChild(NameEl)

//         const divEl3=createEle('div')
//         divEl3.classList.add('profile-box-inner')
//         divEl3.appendChild(levelEl2)
//         divEl3.appendChild(EmailEl)


//         const divEl4=createEle('div')
//         divEl4.classList.add('profile-box-inner')
//         divEl4.appendChild(levelEl3)
//         divEl4.appendChild(SchNoEl)

//         const divEl5=createEle('div')
//         divEl5.classList.add('profile-box-inner')
//         divEl5.appendChild(levelEl4)
//         divEl5.appendChild(SemEl)

//         const divEl6=createEle('div')
//         divEl6.classList.add('profile-box-inner')
//         divEl6.appendChild(levelEl5)
//         divEl6.appendChild(SecEl)
        
//         const divEl7=createEle('div')
//         divEl7.classList.add('profile-box-inner')
//         divEl7.appendChild(levelEl6)
//         divEl7.appendChild(BranchEl)

//         divEl1.classList.add('profile-box')
//         divEl1.appendChild(divEl2)
//         divEl1.appendChild(divEl3)
//         divEl1.appendChild(divEl4)
//         divEl1.appendChild(divEl5)
//         divEl1.appendChild(divEl6)
//         divEl1.appendChild(divEl7)


//         AllNotesList.appendChild(divEl1)


//     }).catch((err)=>{
//         location.assign(`/errorPage`)
//     })


// })

// // myNotesEl.addEventListener('click',()=>{
// //     getMyNotes()
// // })

// // log out
// // myLogout.addEventListener('click',()=>{
// //     axios.post('http://localhost:3000/students/logout',{}).then((response)=>{
// //         location.assign(`/manageNotes/home`)
// //     }).catch((err)=>{
// //         location.assign(`/errorPage`)
// //     })

// // })

// // All notes handler
// // AllNotesButton.addEventListener('click',()=>{
// //     axios.get('http://localhost:3000/notesall').then((response)=>{
// //         // data.data===array of obj of notes--> 
// //         // elements req--> name,semester,subject,uploadedAt,uploadedBy,Download
// //         AllNotesList.innerHTML=''
// //         const toRenderItems=response.data
// //         if(toRenderItems.length==0){
// //             const nameElN=document.createElement('p')
// //             nameElN.textContent="No Notes Found"
// //             nameElN.classList.add('para-not-found')
// //             AllNotesList.appendChild(nameElN)
// //             return
// //         }
// //         //----
// //         const nameEl=document.createElement('span')
// //         const semesterEl=document.createElement('span')
// //         const subjectEl=document.createElement('span')
// //         const upldAtEl=document.createElement('span')
// //         const teacherEl=document.createElement('span')
// //         const divEl=document.createElement('div')
// //         // const downloadEl=document.createElement('button')

// //         nameEl.textContent="Name"
// //         semesterEl.textContent="Semester"
// //         subjectEl.textContent="Subject"
// //         upldAtEl.textContent="Updated At"
// //         teacherEl.textContent="Uploaded by"
// //         // downloadEl.textContent='download'
// //         // downloadEl.setAttribute('background-color','black')

// //         divEl.classList.add('notes-card')
// //         divEl.classList.add('background-color')

// //         divEl.appendChild(nameEl)
// //         divEl.appendChild(semesterEl)
// //         divEl.appendChild(subjectEl)
// //         divEl.appendChild(upldAtEl)
// //         divEl.appendChild(teacherEl)
// //         // divEl.appendChild(downloadEl)

// //         AllNotesList.appendChild(divEl)
// //         //----
        
// //         toRenderItems.forEach(element => {
            
// //             axios.get(`http://localhost:3000/findTeacher/${element.uploaded_by}`).then((res)=>{
                
// //                 console.log(res)

// //                 const nameEl=document.createElement('span')
// //                 const semesterEl=document.createElement('span')
// //                 const subjectEl=document.createElement('span')
// //                 const upldAtEl=document.createElement('span')
// //                 const teacherEl=document.createElement('span')
// //                 const downloadEl=document.createElement('button')
// //                 const divEl=document.createElement('div')

// //                 nameEl.textContent=element.name
// //                 semesterEl.textContent=element.semester
// //                 subjectEl.textContent=element.subject
// //                 upldAtEl.textContent=moment(element.createdAt).format('DD:MM:YYYY')   ///element.createdAt  
// //                 teacherEl.textContent=res.data       ////
// //                 downloadEl.textContent='download'

// //                 divEl.classList.add('notes-card')

// //                 downloadEl.addEventListener('click',()=>{
// //                     axios.get(`http://localhost:3000/notes/${element._id}`).then((response)=>{/////////////////////////
// //                         console.log(response)
// //                     }).catch((err)=>{
// //                         console.log(err)
// //                     })
// //                 })
        
// //                 divEl.appendChild(nameEl)
// //                 divEl.appendChild(semesterEl)
// //                 divEl.appendChild(subjectEl)
// //                 divEl.appendChild(upldAtEl)
// //                 divEl.appendChild(teacherEl)
// //                 divEl.appendChild(downloadEl)
        
// //                 AllNotesList.appendChild(divEl)
// //             }).catch((e)=>{
// //                 location.assign(`/errorPage`)
// //             })

// //         })

// //     }).catch((err)=>{
// //         location.assign(`/errorPage`)
// //         console.log(err)
// //     })
    
// // })






