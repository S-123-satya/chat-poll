// decode the logged in user
const url = `http://localhost:3000`;
const token = localStorage.getItem("accessToken");
function parseJwt(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

// loggedin user
const user = parseJwt(token);
console.log(user);

let counter = 0;

const socket = io({
  ackTimeout: 10000,
  retries: 3,
  auth: {
    serverOffset: 0,
  },
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (input.value) {
    const obj = {
      message: input.value,
      sender: user._id,
    };
    const clientOffset = `${socket.id}-${counter++}`;
    const response = await axios.post(`${url}/chat`, obj);
    console.log(response);
    if (response.data.statusCode == 201) {
      //shoul send the obj because it contains more things and for more info we should send response data because it contains all the information like createdAt and updatedAt
      displayChat("You", response.data.data.message);
      socket.emit(
        "chat message",
        { data: response.data.data, sender: user.username },
        clientOffset
      );
    } else {
      alert("someting went wrong");
    }
    input.value = "";
  }
});

socket.on("chat message", (msg, serverOffset) => {
  console.log(msg);
  displayChat(msg.sender, msg.data.message);
  socket.auth.serverOffset = serverOffset;
});

function displayChat(sender, msg) {
  const item = document.createElement("li");
  item.textContent = `${sender} : ${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

const createPollBtn = document.getElementById("createPollBtn");
const pollModal = document.getElementById("pollModal");
const closeBtn = document.querySelector(".close");
const addOptionBtn = document.getElementById("addOptionBtn");
const pollForm = document.getElementById("pollForm");
const optionsContainer = document.getElementById("options");

createPollBtn.addEventListener("click", () => {
  pollModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  pollModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == pollModal) {
    pollModal.style.display = "none";
  }
});

addOptionBtn.addEventListener("click", () => {
  if (optionsContainer.lastElementChild.lastElementChild.value) {
    const optionNum = optionsContainer.childElementCount + 1;
    const div = document.createElement("div");
    const label = document.createElement("label");
    label.htmlFor = `option${optionNum}`;
    label.textContent = `Option ${optionNum}:`;
    const input = document.createElement("input");
    input.type = "text";
    input.id = `option${optionNum}`;
    input.name = "option";
    div.appendChild(label);
    div.appendChild(input);
    optionsContainer.appendChild(div);
  }
});

pollForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const multiSelect = document.getElementById("multiSelect");
  const questionInput = document.getElementById("question");

  console.log(multiSelect.checked);
  const n = optionsContainer.children.length;
  const optionsList = [];
  for (let i = 0; i < n; i++) {
    optionsList.push(optionsContainer.children[i].children[1].value);
  }
  const obj = {
    question: questionInput.value,
    options: optionsList,
    isMultipleSelect: multiSelect.checked,
  };
  console.log("Poll Data:", obj);
  // Here you can send the pollData to your backend for further processing
  pollModal.style.display = "none";
});
