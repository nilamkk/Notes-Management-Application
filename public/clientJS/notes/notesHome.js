document.querySelector('.choice-form-1').addEventListener('submit',(e)=>{
    console.log(11)
    e.preventDefault()

    const user=e.target.elements.user.value
    console.log(user)
    location.assign(`/signup/${user}/page`)
})