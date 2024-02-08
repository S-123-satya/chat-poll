console.log(io);
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
