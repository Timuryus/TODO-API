const $email = document.querySelector(".email");
const $password = document.querySelector(".password");
const $submit = document.querySelector(".submit");
const BASE = "https://todo-itacademy.herokuapp.com/api";

function getRegister(url) {
  fetch(`${url}/registration`, {
    method: "POST",
    body: JSON.stringify({
      email: $email.value,
      password: $password.value,
    }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((r) => {
      localStorage.setItem("accessToken", r.accessToken);
      localStorage.setItem("refreshToken", r.refreshToken);
      localStorage.setItem("isActivated", r.user.isActivated);
      localStorage.setItem("userId", r.user.id);
      window.open("./auth.html", "_self");
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
    getRegister(BASE);
    $submit.disabled = true;
  }
});

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    window.open("./auth.html", "_self");
  }
  if (accessToken === undefined) {
    window.open("./auth.html", "_self");
  }
});
