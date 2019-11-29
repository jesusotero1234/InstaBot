
const readLocalStorage = (userBot) => {
    const textJSON = localStorage.getItem('newUser')

    try {
        return textJSON ? JSON.parse(textJSON) : []
    }
    catch (e) {
        return []
    }

}

//Save todos LocalSotrage
const saveLocalStoragetodos = (userBot) => {

   
    let JSONtodo = JSON.stringify(userBot)
    return localStorage.setItem('newUser', JSONtodo)

}
//Save todos localStorage
const saveTodos = (userBot) => {
    localStorage.setItem('newUser', JSON.stringify(userBot))
}
//Elements 
const $usernameBot = document.querySelector('#bot-username')
const $userpassBot = document.querySelector('#bot-password')
const $searchUsername = document.querySelector('#search-username')
const $submit = document.querySelector('#submit')


const userBot = {
    username: '',
    password: '',
    searchUser: ''
}
//Read the User preferences

$submit.addEventListener('click', (e) => {
       const  prueba = userBot
})
    
$usernameBot.addEventListener('input', (e) => {
    e.preventDefault()
    console.log(e)
    userBot.username= e.target.value 
    saveLocalStoragetodos(userBot)
})

$userpassBot.addEventListener('input', (e) => {
    e.preventDefault()
    userBot.password=e.target.value 
    saveLocalStoragetodos(userBot)

})

$searchUsername.addEventListener('input', (e) => {
    e.preventDefault()
    userBot.searchUser= e.target.value 
    console.log(userBot)
  saveLocalStoragetodos(userBot)
  readLocalStorage()
})

