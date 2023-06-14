function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("username", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    
    let username = nameEl.value;
    let retrievedSlug = null;

    let slugs = [];
    const slugsText = localStorage.getItem('slugs');
    if (slugsText) {
        slugs = JSON.parse(slugsText);
    }
    
    let found = false;
    for (var [i, prevSlug] of slugs.entries()) {
        if (username === prevSlug.username) {
          retrievedSlug = prevSlug;
          found = true;
        }
    }
    
    if (found) {
      localStorage.setItem("username", retrievedSlug.username);
      localStorage.setItem("password", retrievedSlug.password);
      localStorage.setItem("slugname", retrievedSlug.slugname);
      localStorage.setItem("slugfill", retrievedSlug.fill);
      localStorage.setItem("slugoutline", retrievedSlug.outline);
      localStorage.setItem("friends", retrievedSlug.friends);
    }

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
  // localStorage.setItem("slugs", JSON.stringify(slugs));
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

    clearUser();
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

displayQuote();
saveSlugsToLocalStorage();
let friends = [];
localStorage.setItem("friends", JSON.stringify(friends));