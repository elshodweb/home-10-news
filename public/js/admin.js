let form = document.querySelector("#form");
let input = document.querySelector(".title");
let textarea = document.querySelector(".textarea");
let fileInput = document.querySelector(".img");
let formData = new FormData();

fileInput.addEventListener("change", (e) => {
  formData.append("image", fileInput.files[0]);
});

let modal = document.querySelector(".modal");
function notificate(str, className) {
  modal.innerHTML = str;
  modal.classList.add("active", className);
  setTimeout(() => {
    modal.innerHTML = "";
    modal.classList.remove("active", className);
  }, 3000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formData.append("title", input.value);
  formData.append("body", textarea.value);
  submit(formData);
  input.value = "";
  textarea.value = "";
  fileInput.files = null;
  for (const key of formData) {
    formData.delete(key[0]);
  }
});

async function submit(formData) {
  fetch("/news", {
    method: "POST",
    body: formData,
  })
    .then(function ({ status }) {
      if (status != 400) {
        notificate("post added", "blue");
      } else {
        notificate("Invalid POST", "red");
      }
    })
    .catch(function (res) {
      notificate("Invalid POST", "red");
    });
}
