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
  console.log(input.value);
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

function addOption() {
  const optionsContainer = document.getElementById("optionsContainer");
  const optionCount = optionsContainer.children.length + 1;

  if (optionCount <= 12) {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    const label = document.createElement("label");
    label.setAttribute("for", `option${optionCount}`);
    label.textContent = `Option ${optionCount}:`;

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", `option${optionCount}`);
    input.setAttribute("name", `option${optionCount}`);

    optionDiv.appendChild(label);
    optionDiv.appendChild(input);

    optionsContainer.appendChild(optionDiv);
  } else {
    alert("Maximum 12 options allowed!");
  }
}
console.log(`hi`);
/**
   * 
  <div>
<h2>Poll Creator</h2>
<form id="pollForm">
  <label for="question">Question:</label><br>
  <input type="text" id="question" name="question"><br><br>
  <div id="optionsContainer">
    <div class="option">
      <label for="option1">Option 1:</label>
      <input type="text" id="option1" name="option1">
    </div>
  </div>
  <button type="button" onclick="addOption()">Add Option</button><br><br>
  <input type="submit" value="Create Poll">
</form>
</div>
   */
