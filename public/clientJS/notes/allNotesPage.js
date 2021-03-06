const filterSubject=document.querySelector('#filter-list-subject')
const filterBranch=document.querySelector('#filter-list-branch')
const filterSemester=document.querySelector('#filter-list-semester')
const findNotesButton= document.querySelector('#find-notes-button')
const filterSubjectSpan=document.querySelector("#selected-subject")
const filterBranchSpan=document.querySelector("#selected-branch")
const filterSemesterSpan=document.querySelector("#selected-semester")
const uploadedOnSpan=document.querySelector("#uploaded-on-span")
const sortByScript= document.querySelector("#sort-by-script")
const nameSpan=document.querySelector("#name-span")
const pageNumberContainer=document.querySelector(".page-numbers-container")
const currentPageStatus=document.querySelector("#current-page")

let activatePage=sortByScript.childNodes[0].textContent.split('_')[2].trim()
currentPageStatus.textContent=`Current page:${activatePage}`


nameSpan.addEventListener('click',()=>{
    let criteria=sortByScript.childNodes[0].textContent.split('_')
    let mode="1"
    let query=createQueryString()
    if(criteria[0].trim()==="name"){
        mode=(criteria[1].trim()==="1"?"-1":"1")
    }
    if(query.length==0){
        query+=`?`
    }else{
        query+=`&`
    }
    
    query+=`range=${findCurrentRange()}&`
    query+=`skip=${activatePage}&`

    query+=`criteria=name&`
    query+=`mode=${mode}`
    location.search=query
})
uploadedOnSpan.addEventListener('click',()=>{
    // by default decreasing
    // by clicking increasing
    let criteria=sortByScript.childNodes[0].textContent.split('_')
    let mode="-1"
    // imp comment
    // console.log(sortByScript.childNodes[0].textContent  )
    // console.log(criteria[0])

    let query=createQueryString()

    if(criteria[0].trim()==="time"){
        mode=(criteria[1].trim()==="1"?"-1":"1")
    }

    if(query.length==0){
        query+=`?`
    }else{
        query+=`&`
    }

    query+=`range=${findCurrentRange()}&`
    query+=`skip=${activatePage}&`

    query+=`criteria=time&`
    query+=`mode=${mode}`

    location.search=query
})
findNotesButton.addEventListener('click',()=>{
    const queryString=createQueryString()

    location.search=queryString
})
const createQueryString=()=>{

    let queryString=`?`

    if(filterSubject.value){
        if(filterSubject.value!=="All"){
            let subjectName=filterSubject.value
            queryString+=`subject=${subjectName}&`
        }
    }else if(filterSubjectSpan.textContent){
        if(filterSubjectSpan.textContent!=="All"){
            let subjectName=filterSubject.value
            queryString+=`subject=${subjectName}&`  
        }
    }
    if(filterBranch.value){
        if(filterBranch.value!=="All")
            queryString+=`branch=${filterBranch.value}&`
    }else if(filterBranchSpan.textContent){
        if(filterBranchSpan.textContent!=="All"){
            queryString+=`branch=${filterBranchSpan.textContent}&`  
        }
    }

    if(filterSemester.value){
        if(filterSemester.value!=="All")
            queryString+=`semester=${filterSemester.value}&`
    }else if(filterSemesterSpan.textContent){
        if(filterSemesterSpan.textContent!=="All"){
            queryString+=`semester=${filterSemesterSpan.textContent}&`  
        }
    }

    if(queryString.length<=1){
        return ""
    }
    
    return queryString.slice(0,queryString.length-1)
}

const findCurrentRange=()=>{
    const rangeStart=parseInt(pageNumberContainer.childNodes[1].textContent)
    return [rangeStart,rangeStart+4].join("to")
}
// findCurrentRange()
const changePageFun=(e)=>{
    let query=createQueryString()
    if(query.length==0){
        query+=`?`
    }else{
        query+=`&`
    }
    // range skip
    query+=`range=${findCurrentRange()}&`
    query+=`skip=${activatePage}`

    const reqPage=e.textContent
    query=query.replace(`skip=${activatePage}`,`skip=${reqPage}`)
    // console.log(reqPage)
    // console.log(query)
    location.search=query
}




