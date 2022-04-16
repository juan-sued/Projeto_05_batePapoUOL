const loginInput = document.querySelector(".loginInput");
const userLogin = { name: "" };
const invalidUserName = document.querySelector(".messageInvalidName");
const loginPage = document.querySelector(".loginPage");
const mainPage = document.querySelector(".mainPage");

const urlStatusAPI = "https://mock-api.driven.com.br/api/v6/uol/status";

const urlPaticipantsAPI =
  "https://mock-api.driven.com.br/api/v6/uol/participants";

const urlMessagesAPI = "https://mock-api.driven.com.br/api/v6/uol/messages";

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
    serverContact(userLogin);
  }
}

function serverContact(element) {
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
  }
}

function chatOn() {
  loginPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  console.log(userLogin.name);
  setInterval(verificaOnline, 4000);
  mensagemLogin();
  newMensagem();
}
function verificaOnline() {
  const promisse = axios.post(urlStatusAPI, userLogin);
  promisse.then(console.log("Verificado que está online"));
}

function mensagemLogin() {
  const ul = document.querySelector("ul");
  ul.innerHTML += `<li class='messageStatus'><strong>${userLogin.name} &nbsp</strong> entrou na sala...</li>`;
}
function newMensagem() {
  const promisse = axios.get(urlMessagesAPI);
  console.log(promisse);
}
