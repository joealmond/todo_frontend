/*jshint esversion: 6 */

const container = document.querySelector(".container");
const addButton = document.createElement("button");
addButton.textContent = "Add task";
addButton.id = "addButton";

function displayTasks() {
  container.innerHTML = "";
  Object.keys(localStorage)
    .sort((a, b) => a - b)
    .forEach((e) => {
      displayTask(e, window.localStorage.getItem(e).slice(1, -1));
    });

  document.body.appendChild(addButton);
  addButton.addEventListener("click", createNewTask);
}

function displayTask(taskKey, taskValue) {
  addButton.remove();
  const taskContainer = document.createElement("div");
  container.appendChild(taskContainer);
  const taskTextLabel = document.createElement("label");
  taskTextLabel.setAttribute("name", "task");
  taskTextLabel.textContent = " *  ";
  taskContainer.appendChild(taskTextLabel);
  const taskTextInput = document.createElement("input");
  const textInputAtrributes = {
    type: "text",
    id: taskKey,
    name: "task",
    required: "true",
    minlength: "4",
    maxlength: "20",
    size: "22",
    value: taskValue,
    placeholder: "enter task name",
  };

  Object.keys(textInputAtrributes).forEach((e) => {
    taskTextInput.setAttribute(e, textInputAtrributes[e]);
  });
  taskContainer.appendChild(taskTextInput);
  if (taskTextInput.value == "") {
    taskTextInput.focus();
  }

  const taskRemoveBtn = document.createElement("button");
  taskRemoveBtn.textContent = "Done";
  const removeBtnAtrributes = {
    id: "taskRemoveBtn",
    name: "task",
  };
  Object.keys(removeBtnAtrributes).forEach((e) => {
    taskRemoveBtn.setAttribute(e, removeBtnAtrributes[e]);
  });

  taskContainer.appendChild(taskRemoveBtn);

  taskRemoveBtn.addEventListener("click", removeTask);

  taskTextInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      if (e.target.value != "") {
        updateTask(e);
        createNewTask();
        addButton.remove();
      }
    }
  });
  taskTextInput.addEventListener("blur", (e) => {
    if (e.target.value == "") {
      taskContainer.remove();
      document.body.appendChild(addButton);
      addButton.addEventListener("click", createNewTask);
    } else {
      updateTask(e);
      document.body.appendChild(addButton);
      addButton.addEventListener("click", createNewTask);
    }
  });
}

function updateTask(e) {
  localStorage.setItem(e.target.id, JSON.stringify(e.target.value));
}
function removeTask(e) {
  window.localStorage.removeItem(e.target.previousElementSibling.id);
  e.target.parentElement.remove();
  document.body.appendChild(addButton);
  addButton.addEventListener("click", createNewTask);
}
function createNewTask() {
  displayTask(
    (parseInt(
      Object.keys(localStorage)
        .sort((a, b) => a - b)
        .reverse()[0]
    ) || 0) + 1,
    ""
  );
}
// Main program:

displayTasks();
document.addEventListener("visibilitychange", displayTasks);
