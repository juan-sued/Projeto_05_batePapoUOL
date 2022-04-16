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
  console.log("clicou");

  let inputName = loginInput.value;

  userLogin.name = inputName;
  if (inputName.length <= 3 || !isNaN(inputName) || inputName.length >= 20) {
    invalidUserName.classList.remove("hidden");
    console.log("era pra aparecer a mensagem");
    setTimeout(function () {
      window.location.reload(true);
    }, 3000);
    userLogin.name = inputName;
  } else {
    serverContactPost(userLogin);
  }
}

function serverContactPost(element) {
  console.log(userLogin.name);
  const promisse = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    element
  );
  promisse.then(chatOn);
  promisse.catch(error);
}

function error(error) {
  if (error.response.status === 400) {
    invalidUserName.classList.remove("hidden");
    //fazer um popup de aviso que está com o user ja online
    //com botao de reiniciar a página para informar o usuário.
    setTimeout(function () {
      window.location.reload(true);
    }, 3000);
  } else {
    console.log("(dentro da function erro)erro numero" + error.response.stats);
  }
}

function chatOn() {
  loginPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  console.log(chatOn);

  serverContactGet();

  setInterval(verificaOnline, 4000);
}

function verificaOnline() {
  const promisse = axios.post(urlStatusAPI, userLogin);
  promisse.then(console.log("Verificado que está online"));
}

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

function serverContactGet() {
  const promisse = axios.get(urlMessagesAPI);
  console.log(promisse);
  promisse.then(loadMessages);
  promisse.catch(error);
}
function loadMessages(response) {
  responseMessages = response.data;
  console.log(responseMessages);
  renderMessages(responseMessages);
}

function renderMessages(response) {
  const ul = document.querySelector("ul");
  for (let i = 0; i < responseMessages.length; i++) {
    ul.innerHTML += `<li class='messageToAll'><span class='timeMessage'> (${responseMessages[i].time})&nbsp </span><span class='contentMessage'><strong> ${responseMessages[i].from}</strong>&nbsppara<strong>&nbsp${responseMessages[i].to}</strong>: ${responseMessages[i].text}</span></li>`;
  }
}
