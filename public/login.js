async function getUserProfile(username) {
    console.log("entering getUserProfile");
    let profile = null;
    try {
        // Get the latest high scores from the service
        const response = await fetch(`/api/user?username=${username}`, {
            method: 'GET'});
        profile = await response.json();
        console.log(profile.friends);
        console.log(JSON.stringify(profile.friends));

        // Save the scores in case we go offline in the future
        localStorage.setItem("slugname", profile.slugname);
        localStorage.setItem("slugfill", profile.fill);
        localStorage.setItem("slugoutline", profile.outline);
        localStorage.setItem("friends", JSON.stringify(profile.friends));
        return profile;
    } catch {
        // If there was an error then just use the last saved scores
        console.log("error retrieving profile");
        return null;
    }
}

async function login(event) {
    event.preventDefault();
    var loginForm = document.getElementById("login-form");
  
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("username", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    localStorage.setItem("type", "user");
    
    let username = nameEl.value;
    
    let profile = await getUserProfile(username);
    console.log(profile);

    window.location.href = "profile.html";
}

function clearUser() {
  localStorage.setItem("username", "");
  localStorage.setItem("password", "");
  localStorage.setItem("slugname", "");
  localStorage.setItem("slugfill", "");
  localStorage.setItem("slugoutline", "");
}

async function saveSlugsToLocalStorage() {

  let slugs = [];
  try {
    // Get the latest high scores from the service
    const response = await fetch('/api/users');
    slugs = await response.json();

    // Save the scores in case we go offline in the future
    localStorage.setItem('slugs', JSON.stringify(slugs));
  } catch {
    // If there was an error then just use the last saved scores
    const slugText = localStorage.getItem('slugs');
    if (slugText) {
      slugs = JSON.parse(slugText);
    }
  }
}

function displayQuote(data) {
  fetch('https://api.quotable.io/random')
    .then((response) => response.json())
    .then((data) => {
      const containerEl = document.querySelector('#quote');

      const quoteEl = document.createElement('p');
      quoteEl.classList.add('quote');
      const authorEl = document.createElement('p');
      authorEl.classList.add('author');

      quoteEl.textContent = data.content;
      authorEl.textContent = data.author;

      containerEl.appendChild(quoteEl);
      containerEl.appendChild(authorEl);
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
    const el = document.getElementById('login-form');
    if (el) {
      el.addEventListener('submit', login);
    }
});

clearUser();
displayQuote();
saveSlugsToLocalStorage();
let friends = [];
localStorage.setItem("friends", JSON.stringify(friends));
