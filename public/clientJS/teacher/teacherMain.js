axios.defaults.withCredentials = true;

//essentials
const myProfile=document.querySelector('.links-to-surf-profile')
const AllNotesList=document.querySelector('.all-notes-list')
const myLogout=document.querySelector('.links-to-surf-logout')
const AllNotesButton=document.querySelector('.get-all-notes')
const addNewNotes=document.querySelector('.add-new-notes-button')
const notesAdd1=document.querySelector('.add-new-notes-rend')
const notesAdd2=document.querySelector('.load-notes')
const myNotesEl=document.querySelector('.get-my-notes-again')


addNewNotes.addEventListener('click',()=>{
    createNotesAddText()
})


// Only notes I created
getMyNotes().then((data)=>{
    // render the array of data
    renderMyNotes(data)    
}).catch((err)=>{
    location.assign(`/errorPage`)
})

// All notes handler
AllNotesButton.addEventListener('click',()=>{
    // renderAllNotes
    renderAllNotes()
})

// profile
myProfile.addEventListener('click',()=>{
    axios.get('http://localhost:3000/teachers/me').then((response)=>{
        console.log(response)
        AllNotesList.innerHTML=''
        // branch email name section schno semester
        const BranchEl=createEle('span')
        const EmailEl=createEle('span')
        const NameEl=createEle('span')
        // const SecEl=createEle('span')
        // const SchNoEl=createEle('span')
        // const SemEl=createEle('span')
        const divEl1=createEle('div')

        NameEl.textContent=response.data.name
        BranchEl.textContent=response.data.department
        EmailEl.textContent=response.data.email
        // SecEl.textContent=response.data.section
        // SchNoEl.textContent=response.data.scholar_no
        // SemEl.textContent=response.data.semester
        

        // divEl1.appendChild(NameEl)
        // divEl1.appendChild(EmailEl)
        // divEl1.appendChild(BranchEl)
        // divEl1.appendChild(SchNoEl)
        // divEl1.appendChild(SemEl)
        // divEl1.appendChild(SecEl)

        const levelEl1=createEle('label')
        levelEl1.textContent="Name :"
        
        const levelEl2=createEle('label')
        levelEl2.textContent="Email :"        

        // const levelEl3=createEle('label')
        // levelEl3.textContent="Scholar ID"
        
        // const levelEl4=createEle('label')
        // levelEl4.textContent="Semester"

        // const levelEl5=createEle('label')
        // levelEl5.textContent="Section"
    
        const levelEl6=createEle('label')
        levelEl6.textContent="Dept :"

        const divEl2=createEle('div')
        divEl2.classList.add('profile-box-inner')
        divEl2.appendChild(levelEl1)
        divEl2.appendChild(NameEl)

        const divEl3=createEle('div')
        divEl3.classList.add('profile-box-inner')
        divEl3.appendChild(levelEl2)
        divEl3.appendChild(EmailEl)


        // const divEl4=createEle('div')
        // divEl4.classList.add('profile-box-inner')
        // divEl4.appendChild(levelEl3)
        // divEl4.appendChild(SchNoEl)

        // const divEl5=createEle('div')
        // divEl5.classList.add('profile-box-inner')
        // divEl5.appendChild(levelEl4)
        // divEl5.appendChild(SemEl)

        // const divEl6=createEle('div')
        // divEl6.classList.add('profile-box-inner')
        // divEl6.appendChild(levelEl5)
        // divEl6.appendChild(SecEl)
        
        const divEl7=createEle('div')
        divEl7.classList.add('profile-box-inner')
        divEl7.appendChild(levelEl6)
        divEl7.appendChild(BranchEl)

        divEl1.classList.add('profile-box')
        divEl1.appendChild(divEl2)
        divEl1.appendChild(divEl3)
        // divEl1.appendChild(divEl4)
        // divEl1.appendChild(divEl5)
        // divEl1.appendChild(divEl6)
        divEl1.appendChild(divEl7)


        AllNotesList.appendChild(divEl1)


    }).catch((err)=>{
        location.assign(`/errorPage`)
    })


})


// log out
myLogout.addEventListener('click',()=>{
    axios.post('http://localhost:3000/teachers/logout',{}).then(()=>{
        location.assign(`/manageNotes/home`)
    }).catch((err)=>{
        location.assign(`/errorPage`)
    })

})


myNotesEl.addEventListener('click',()=>{
    getMyNotes().then((data)=>{
        // render the array of data
        renderMyNotes(data)    
    }).catch((err)=>{
        location.assign(`/errorPage`)
    })
    
    
})
