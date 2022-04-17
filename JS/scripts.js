const loginInput = document.querySelector(".loginInput");
const userLogin = { name: "" };
const invalidUserName = document.querySelector(".messageInvalidName");
const loginPage = document.querySelector(".loginPage");
const mainPage = document.querySelector(".mainPage");

const urlStatusAPI = "https://mock-api.driven.com.br/api/v6/uol/status";
const urlPaticipantsAPI =
  "https://mock-api.driven.com.br/api/v6/uol/participants";
const urlMessagesAPI = "https://mock-api.driven.com.br/api/v6/uol/messages";

let responseMessages = [];
function login() {
  let inputName = loginInput.value;

  userLogin.name = inputName;
  if (inputName.length <= 3 || !isNaN(inputName) || inputName.length >= 20) {
    invalidUserName.classList.remove("hidden");

    setTimeout(function () {
      window.location.reload(true);
    }, 3000);
    userLogin.name = inputName;
  } else {
    serverContatctUserLogin(userLogin);
  }
}
//realiza o login do usuário
function serverContatctUserLogin(element) {
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    element
  );
  promisse.then(chatOn);
  promisse.catch(error);
}

//TRATAMENTO DE ERRO
function error(error) {
  if (error.response.status === 400) {
    invalidUserName.classList.remove("hidden");
    //fazer um popup de aviso que está com o user ja online
    //com botao de reiniciar a página para informar o usuário.
    setTimeout(function () {
      window.location.reload(true);
    }, 3000);
  }
}
//inicia o chat e mantém ele atualizado
function chatOn() {
  loginPage.classList.add("hidden");
  mainPage.classList.remove("hidden");

  serverContactGet();
  setInterval(serverContactGet, 1000);
  setInterval(verificaOnline, 4000);
}
//verifica se está online
function verificaOnline() {
  const promisse = axios.post(urlStatusAPI, userLogin);

  promisse.then(console.log("Verificado que está online"));
}
/*
function activeButton() {
  const sendButton = document.querySelector(".buttonSendMessage");
  let input = document.querySelector(".writeHereInput").value;
  console.log(input);
  if (input !== null) {
    sendButton.removeAttribute("disabled", "disabled");
  }
  if (input === null) {
    sendButton.setAttribute("disabled", "disabled");
  }
}
*
/*
=== Forma da mensagem === Response


from: "jessé"
text: "whip"
time: "05:40:39"
to: "Todos"
type: "message"

function mensagemLogin() {
}
*/

//pega as mensagens da api
function serverContactGet() {
  const promisse = axios.get(urlMessagesAPI);
  promisse.then(loadMessages);
  promisse.catch(error);
}

//carrega as mensagens dentro da array responseMessages
function loadMessages(response) {
  responseMessages = response.data;
  renderMessages(responseMessages);
}

//renderiza as mensagens no chat
function renderMessages() {
  const ul = document.querySelector("ul");

  ul.innerHTML = "";
  for (let i = 0; i < responseMessages.length; i++) {
    if (responseMessages[i].type === "status") {
      ul.innerHTML += `<li class='messageStatus mensagem'><span class='timeMessage'> (${responseMessages[i].time})&nbsp </span><span class='contentMessage'><strong> ${responseMessages[i].from}</strong>&nbsppara<strong>&nbsp${responseMessages[i].to}</strong>: ${responseMessages[i].text}</span></li>`;
    }
    if (
      responseMessages[i].type === "private_message" &&
      responseMessages[i].to === userLogin.name
    ) {
      ul.innerHTML += `<li class='messageReserved mensagem'><span class='timeMessage'> (${responseMessages[i].time})&nbsp </span><span class='contentMessage'><strong> ${responseMessages[i].from}</strong>&nbsppara<strong>&nbsp${responseMessages[i].to}</strong>: ${responseMessages[i].text}</span></li>`;
    }
    if (responseMessages[i].type === "message") {
      ul.innerHTML += `<li class='messageToAll mensagem'><span class='timeMessage'> (${responseMessages[i].time})&nbsp </span><span class='contentMessage'><strong> ${responseMessages[i].from}</strong>&nbsppara<strong>&nbsp${responseMessages[i].to}</strong>: ${responseMessages[i].text}</span></li>`;
    }
  }
  const mensagem = document.querySelector("ul").lastChild;
  mensagem.scrollIntoView(true);
}

function sendMessage() {
  const messageBody = {
    from: userLogin.name,
    to: "Todos",
    text: document.querySelector(".writeHereInput").value,
    type: "message", // ou "private_message" para o bônus
  };

  const promisse = axios.post(urlMessagesAPI, messageBody);

  promisse.then(cleanAndReset);
  promisse.catch(errorSendMessage);
}

function errorSendMessage() {
  console.log("enviou um valor vazio");
}

function cleanAndReset() {
  document.querySelector(".writeHereInput").value = "";
  serverContactGet();
}
