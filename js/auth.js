const $email = document.querySelector(".email");
const $password = document.querySelector(".password");
const $submit = document.querySelector(".submit");
const BASE = "https://todo-itacademy.herokuapp.com/api";

function getLogin(url) {
  fetch(`${url}/login`, {
    method: "POST",
    body: JSON.stringify({
      email: $email.value,
      password: $password.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      if (res.status < 400) {
        return res;
      }
    })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("refreshToken", res.refreshToken);
      if (res.user.isActivated === true) {
        window.open("./index.html", "_self");
        localStorage.setItem("isActivated", res.user.isActivated);
      }
    })
    .finally(() => {
      $submit.disabled = false;
    });
}

$submit.addEventListener("click", (e) => {
  e.preventDefault();

  if ($email.value.length === 0 || $password.value.length === 0) {
    setTimeout(() => window.location.reload(), 1000);
    if ($email.value.length === 0) {
      $email.classList.add("active");
      $email.setAttribute("placeholder", "Fill the Area!");
    }
    if ($password.value.length === 0) {
      $password.classList.add("active");
      $password.setAttribute("placeholder", "Fill the Area!");
    }
  } else {
    getLogin(BASE);
    $submit.disabled = true;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const isActivated = localStorage.getItem("isActivated");

  if (isActivated) {
    window.open("./index.html", "_self");
  }
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken === "undefined") {
    localStorage.clear();
  }
});
