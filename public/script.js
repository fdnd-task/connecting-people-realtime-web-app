
// TEST 1 HOW MANY ACTIVE PLAYERS
const socket = io();

socket.on('active-players-count', (count) => {
    const countElement = document.getElementById('active-players-count');
    countElement.textContent = count;
});


// WELCOME PAGE TIME COUNTDOWN
// Set the countdown time in seconds
var countdownTime = 5;
// Get the countdown element
var countdownElement = document.getElementById('countdown');
// Update the countdown every second
var countdownInterval = setInterval(updateCountdown, 1000);

function updateCountdown() {
    // Display the countdown
    countdownElement.innerHTML = countdownTime + 's';

    // Decrease the countdown time
    countdownTime--;

    // Stop the countdown when it reaches 0
    if (countdownTime < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = 'Lets go';

        // Navigate to the trivia page
        window.location.href = '/trivia';
    }
}



// START - TRIVIA QUIZ ---------------------------------------------------------------
const quizData = [
    {
        question: "Vraag 1: Wat is de wetenschappelijke naam van de zonnebloem?",
        a: "A) Helianthus annuus",
        b: "B) Rosa canina",
        c: "C) Lavandula angustifolia",
        d: "D) Aloe vera",
        correct: "a"
    },
    {
        question: "Vraag 2: Welke plant wordt vaak gebruikt als symbool van vrede?",
        a: "A) Lelie",
        b: "B) Roos",
        c: "C) Zonnebloem",
        d: "D) Olijftak",
        correct: "b"
    },
    {
        question: "Vraag 3: Welk type plant verliest zijn bladeren in de herfst en komt in de lente weer tot leven?",
        a: "A) Loofboom",
        b: "B) Naaldboom",
        c: "C) Cactus",
        d: "D) Vetplant",
        correct: "a"
    },
    {
        question: "Vraag 4: Welke van de volgende planten wordt geassocieerd met het geluksbrengende klavertjevier?",
        a: "A) Klaproos",
        b: "B) Madeliefje",
        c: "C) Klaver",
        d: "D) Paardenbloem",
        correct: "c"
    },
    {
        question: "Vraag 5: Welke van de volgende planten is een vleesetende plant?",
        a: "A) Cactus",
        b: "B) Orchidee",
        c: "C) Zonnebloem",
        d: "D) Venusvliegval",
        correct: "d"
    },
    {
        question: "Vraag 6: Welke van de volgende planten wordt vaak gebruikt om thee van te maken?",
        a: "A) Kamille",
        b: "B) Lavendel",
        c: "C) Pepermunt",
        d: "D) Rozemarijn",
        correct: "c"
    },
    {
        question: "Vraag 7: Welke plant wordt vaak gebruikt als natuurlijke luchtverfrisser vanwege zijn geurige bladeren?",
        a: "A) Lavendel",
        b: "B) Eucalyptus",
        c: "C) Basilicum",
        d: "D) Geranium",
        correct: "b"
    },
    {
        question: "Vraag 8: Welke plant heeft de grootste bladeren ter wereld?",
        a: "A) Reuzenwaterlelie",
        b: "B) Bananenplant",
        c: "C) Varen",
        d: "D) Agave",
        correct: "a"
    },
    {
        question: "Vraag 9: Welke plant wordt vaak gebruikt om de smaak van gerechten te verbeteren en staat bekend om zijn sterke geur?",
        a: "A) Munt",
        b: "B) Dragon",
        c: "C) Salie",
        d: "D) Rozemarijn",
        correct: "d"
    },
    {
        question: "Vraag 10: Welke plant wordt vaak geassocieerd met geluk en wordt traditioneel cadeau gegeven bij speciale gelegenheden?",
        a: "A) Orchidee",
        b: "B) Bamboe",
        c: "C) Vijgenboom",
        d: "D) Klaproos",
        correct: "b"
    },
];

const quiz = document.getElementById("quiz");
const answerElements = document.querySelectorAll(".answer");
const questionElement = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitButton = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

const deselectAnswers = () => {
    answerElements.forEach((answer) => (answer.checked = false));
};

const getSelected = () => {
    let answer;
    answerElements.forEach((answerElement) => {
        if (answerElement.checked) answer = answerElement.id;
    });
    return answer;
};

const loadQuiz = () => {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionElement.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
};

loadQuiz();

submitButton.addEventListener("click", () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentQuiz].correct) score++;
        currentQuiz++;
        if (currentQuiz < quizData.length) loadQuiz();
        else {
            quiz.innerHTML = `
              <h2>Je hebt ${score}/${quizData.length} vragen correct beantwoord!</h2>
              <button onclick="history.go(0)">Speel Opnieuw</button>
          `;
        }
    }

});

// EINDE - TRIVIA QUIZ ---------------------------------------------------------------





//  LIVE CHATROOM---------------------------------------------------------------------
let ioServer = io()
let messages = document.querySelector('section ul')
let input = document.getElementById('chat-input')

console.log(ioServer)

// Luister naar het submit event
document.getElementById('lower-chat-bar').addEventListener('submit', (event) => {
  event.preventDefault()

  // Als er überhaupt iets getypt is
  if (input.value) {
    // Stuur het bericht naar de server
    ioServer.emit('message', input.value)

    // Leeg het form field
    input.value = ''
  }
})

// Luister naar berichten van de server
ioServer.on('message', (message) => {
  addMessage(message.uid, message.message)
})

/**
 * Impure function that appends a new li item holding the passed message to the
 * global messages object and then scrolls the list to the last message.
 * @param {*} message the message to append
 */
function addMessage(uid, message) {
// er is een uid voor het bericht en de ioServer.id is voor de gebruiker.
  console.log(uid, ioServer.id)
  let messageClass = ''

  if(uid){
    // Alle kinderen van de variabele messages krijgen een li eraan toegevoegd
    const messageConst = messages.appendChild(Object.assign(document.createElement('li'), {textContent: message }))
    
    // als de message id overeenkomt met de ioServer id dan is het bericht van de gebruiker zelf
    // Er wordt een class met de uitlijning aan het variabele messageConst toegevoegd
    if (uid == ioServer.id) {
      messageConst.classList.add('eigen-bericht')
    }
    messages.scrollTop = messages.scrollHeight
  }
}