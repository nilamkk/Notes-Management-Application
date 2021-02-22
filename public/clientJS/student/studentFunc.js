
// // getting my notes

// const getMyNotes =async ()=>{
//     try{
//         const data=await axios.get('http://localhost:3000/noteswantedStudent')
//         await getMyNotesRender(data.data) 
//     }catch(error){
//         location.assign(`/errorPage`)
//     }
// }

// const getAllNotes=async()=>{
//     const data=await axios.get('http://localhost:3000/notesall')
//     return data
// }

// const createEle=(ele)=>{
//     return document.createElement(ele)
// }

// const getMyNotesRender=(data)=>{
//     AllNotesList.innerHTML=''
//     const toRenderItems=data
//     if(toRenderItems.length==0){
//         const nameElN=document.createElement('p')
//         nameElN.textContent="No Notes Found"
//         nameElN.classList.add('para-not-found')
//         AllNotesList.appendChild(nameElN)
//         return
//     }
//     //----
//     const nameEl=document.createElement('span')
//     const semesterEl=document.createElement('span')
//     const subjectEl=document.createElement('span')
//     const upldAtEl=document.createElement('span')
//     const teacherEl=document.createElement('span')
//     const divEl=document.createElement('div')
//     // const downloadEl=document.createElement('button')

//     nameEl.textContent="Name"
//     semesterEl.textContent="Semester"
//     subjectEl.textContent="Subject"
//     upldAtEl.textContent="Updated At"
//     teacherEl.textContent="Uploaded by"
//     // downloadEl.textContent='download'
//     // downloadEl.setAttribute('background-color','black')

//     divEl.classList.add('notes-card')
//     divEl.classList.add('background-color')

//     divEl.appendChild(nameEl)
//     divEl.appendChild(semesterEl)
//     divEl.appendChild(subjectEl)
//     divEl.appendChild(upldAtEl)
//     divEl.appendChild(teacherEl)
//     // divEl.appendChild(downloadEl)

//     AllNotesList.appendChild(divEl)

    

//     toRenderItems.forEach(element => {
//         // name, sem, sub,time, teacher, download 
//         axios.get(`http://localhost:3000/findTeacher/${element.uploaded_by}`).then((res)=>{
                
//             console.log(res)

//             const nameEl=document.createElement('span')
//             const semesterEl=document.createElement('span')
//             const subjectEl=document.createElement('span')
//             const upldAtEl=document.createElement('span')
//             const teacherEl=document.createElement('span')
//             const downloadEl=document.createElement('button')
//             const divEl=document.createElement('div')

//             nameEl.textContent=element.name
//             semesterEl.textContent=element.semester
//             subjectEl.textContent=element.subject
//             upldAtEl.textContent=moment(element.createdAt).format('DD:MM:YYYY')   ///element.createdAt  
//             teacherEl.textContent=res.data       ////
//             downloadEl.textContent='download'

//             divEl.classList.add('notes-card')

//             downloadEl.addEventListener('click',()=>{
//                 axios.get(`http://localhost:3000/notes/${element._id}`).then((response)=>{/////////////////////////
//                     console.log(response)
//                 }).catch((err)=>{
//                     console.log(err)
//                 })
//             })
    
//             divEl.appendChild(nameEl)
//             divEl.appendChild(semesterEl)
//             divEl.appendChild(subjectEl)
//             divEl.appendChild(upldAtEl)
//             divEl.appendChild(teacherEl)
//             divEl.appendChild(downloadEl)
    
//             AllNotesList.appendChild(divEl)
//         }).catch((e)=>{
//             location.assign(`/errorPage`)
//         })

//     })
// }



