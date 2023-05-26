function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("username", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "profile.html";
  }
