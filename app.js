/*jshint esversion: 9 */

const container = document.querySelector(".container");
const addButton = document.createElement("button");
addButton.textContent = "Add task";
addButton.id = "addButton";

async function displayTasks() {
  container.innerHTML = "";

  let res = await fetch("https://todobckend.herokuapp.com/");
  let data = await res.json();
  data.forEach((e) => displayTask(e._id, e.title));

  document.body.appendChild(addButton);
  addButton.addEventListener("click", addTask);
}

function displayTask(taskId, taskValue) {
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
    id: taskId,
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
      if (e.target.id == "") {
        createTask(e);
        addTask();
        addButton.remove();
      } else if (e.target.value != "") {
        updateTask(e);
        addTask();
        addButton.remove();
      }
    }
  });
  taskTextInput.addEventListener("blur", (e) => {
    if (e.target.id == "") {
      createTask(e);
      document.body.appendChild(addButton);
      addButton.addEventListener("click", addTask);
    } else if (e.target.value == "") {
      taskContainer.remove();
      document.body.appendChild(addButton);
      addButton.addEventListener("click", addTask);
    } else {
      updateTask(e);
      document.body.appendChild(addButton);
      addButton.addEventListener("click", addTask);
    }
  });
}

function updateTask(e) {
  fetch(`https://todobckend.herokuapp.com/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: e.target.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());

  // localStorage.setItem(e.target.id, JSON.stringify(e.target.value));
}

function createTask(e) {
  fetch("https://todobckend.herokuapp.com/", {
    method: "POST",
    body: JSON.stringify({
      title: e.target.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => (e.target.id = data.id));
}

function removeTask(e) {
  fetch(
    `https://todobckend.herokuapp.com/${e.target.previousElementSibling.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    }
  );
  e.target.parentElement.remove();
  document.body.appendChild(addButton);
  addButton.addEventListener("click", addTask);
}

async function addTask() {
  let res = await fetch("https://todobckend.herokuapp.com/");
  let data = await res.json();
  displayTask("", "");
}
// Main program:

displayTasks();
document.addEventListener("visibilitychange", displayTasks);
