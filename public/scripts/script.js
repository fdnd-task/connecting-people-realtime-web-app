// Variables

let socket = io()
let messages = document.querySelector('#message-container')
let loadingMessages = document.querySelector('#loading-messages')
let messageInput = document.querySelector('#message-input')
let messageForm = document.querySelector('form')
let name = localStorage.getItem('name') || prompt('What is your name?')
let date = new Date().toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' })
let feedback =  document.querySelector('#feedback');

// Eventlisteners and Function Decleration

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  feedback.innerHTML = ''
  let message = messageInput.value
  loadingMessages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle-loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${name} ${date}</h2>
        <p>${message}</p>
        <p class="loading-margin"><img class="loading-image" src="assets/icons/clock.svg" /> Sending...</p>
      </div>
    </li>
  `
  )
  setTimeout(() => {
    loadingMessages.innerHTML = ''
    messages.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <span class="circle">${name.charAt(0)}</span>
        <div class="message">
          <h2>${name} ${date}</h2>
          <p>${message}</p>
        </div>
      </li>
    `
    )
  }, 2000)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
  messages.scrollTo(0, messages.scrollHeight)
})

localStorage.setItem('name', name)

renderWelcomeMessage()

messageInput.addEventListener('keypress', function(){
  socket.emit('typing', name)
})

// Socket.io Functions

socket.emit('new-user', name)

socket.on('user-connected', (name) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has joined the chat!</li>`
  )
})

socket.on('chat-message', (data) => {
  feedback.innerHTML = ''
  loadingMessages.insertAdjacentHTML(
    'beforeend',
    `
    <li class="loading-message">
      <span class="circle-loading">${name.charAt(0)}</span>
      <div class="message">
        <h2>${name} ${date}</h2>
        <p>${message}</p>
        <p class="loading-margin"><img src="assets/icons/clock.svg" /> Sending...</p>
      </div>
    </li>
  `
  )
  setTimeout(() => {
    loadingMessages.innerHTML = ''
    messages.insertAdjacentHTML(
      'beforeend',
      `
      <li>
        <span class="circle">${name.charAt(0)}</span>
        <div class="message">
          <h2>${name} ${date}</h2>
          <p>${message}</p>
        </div>
      </li>
    `
    )
  }, 2000)
  messages.scrollTo(0, messages.scrollHeight)
})

socket.on('user-disconnected', (data) => {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li>${name} has left the chat!</li>`
  )
})

socket.on('typing', data => {
  feedback.innerHTML = `<p><em> ${data} is typing...</em></p>`
  setTimeout(() => {
    feedback.innerHTML = ''
  }, 5000)
})

// Functions

function renderWelcomeMessage() {
  messages.insertAdjacentHTML(
    `beforeend`,
    `<li class="welcome-message">Welcome ${name}, have a great time talking to everybody!</li>`
  )
}