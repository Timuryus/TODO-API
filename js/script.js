const $title = document.querySelector(".title");
const $content = document.querySelector(".content");
const $date = document.querySelector(".date");
const $submit = document.querySelector(".btn");
const $container = document.querySelector(".row2");
const $loader = document.querySelector(".loader");
const $signOut = document.querySelector(".signOut");

const BASE = "https://todo-itacademy.herokuapp.com/api";
const accessToken = localStorage.getItem("accessToken");

const requests = {
  get: (url, accessToken) => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      if (res.status === 401) {
        getRefresh();
      }

      return res.json();
    });
  },
  post: (url, accessToken, body) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  },
};

window.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.open("./auth.html", "_self");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  getTodos();
});

function getTodos() {
  requests.get(`${BASE}/todos`, accessToken).then((r) => {
    const todos = r.todos;
    const result = todos
      .reverse()
      .map((todo) => cardTemplate(todo))
      .join("");

    $container.innerHTML = result;
  });
}

function getSingleTodo(id) {
  return requests.get(`${BASE}/todos/${id}`, accessToken);
}

function createTodo(title, content, date) {
  $submit.disable = true;
  requests
    .post(`${BASE}/todos/create`, accessToken, { title, content, date })
    .then(() => {
      getTodos();
    })
    .finally(() => ($submit.disable = false));
}

function cardTemplate({ title, content, date, id, completed, edited }) {
  return `
       <div class = "boxCard">
          <div class = "cards">
                <div class ="card-header">
                    <h3>${title}</h3>
                    ${
                      completed
                        ? `<img src = "https://png.monster/wp-content/uploads/2021/06/png.monster-9-450x450.png">`
                        : ""
                    }
                </div>
                <div class = "card-body">
                    <p>${content}</p>
                    <span class ="time">
                        ${date}
                        ${
                          edited.state
                            ? `<span class = "small">edited.${edited.date}</span>`
                            : ""
                        }
                    </span>
                </div>
                <div class = "card-footer">
                    <div>
                      <button onclick = "deleteTodo('${id}')">Delete</button>
                      <button onclick = "completeTodo('${id}')">Completed</button>
                      <button onclick = "editTodo('${id}')">Edit</button>
                    </div>
                </div>
           </div>
       </div>
    `;
}

function completeTodo(id) {
  requests.get(`${BASE}/todos/${id}/completed`).then(getTodos);
}

function deleteTodo(id) {
  fetch(`${BASE}/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(getTodos);
}

function editTodo(id) {
  getSingleTodo().then((res) => {
    const askTitle = prompt("New title", res.title);
    const askContent = prompt("New content", res.content);

    fetch(`${BASE}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        title: askTitle || res.title,
        content: askContent || res.content,
      },
    }).then(getTodos);
  });
}

$submit.addEventListener("click", (e) => {
  e.preventDefault();

  $submit.disable = true;

  createTodo($title.value, $content.value, $date.value);

  document.getElementById("inp").value = "";
  document.getElementById("inp2").value = "";
  document.getElementById("inp3").value = "";
});

$signOut.addEventListener("click", (e) => {
  e.preventDefault();

  const refreshToken = localStorage.getItem("refreshToken");

  $signOut.disabled = true;

  requests
    .post(`${BASE}/logout`, "", { refreshToken })
    .then(() => {
      localStorage.clear();
      window.open("./auth.html", "_self");
    })
    .finally(() => {
      $signOut.disable = false;
    });
});

function getRefresh() {
  requests.post(`${BASE}/refresh`, accessToken, { refreshToken });
}

window.addEventListener("load", () => {
  const isActivated = localStorage.getItem("isActivated");

  if (isActivated === true) {
    window.open("./index.html", "_self");
  }
});

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken === true) {
    window.open("./auth.html", "_self");
  }
});
