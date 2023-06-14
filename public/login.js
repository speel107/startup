function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("username", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "profile.html";
}

// Add people to localstorage
// Define an array of objects
var oldSlugs = [
  {
    name: "Fred",
    creator: "mike",
    connections: 20,
    image: "./images/doomslug-md.png"
  },
  {
    name: "Billy-Bob",
    creator: "Nate",
    connections: 17,
    image: "./images/doomslug-md.png"
  },
  {
    name: "Boomslug",
    creator: "Jorgen",
    connections: 8,
    image: "./images/doomslug-md.png"
  },
  {
    name: "Fine",
    creator: "Rig",
    connections: 13,
    image: "./images/doomslug-md.png"
  },
  {
    name: "Doomslug",
    creator: "spensa",
    connections: 10,
    image: "./images/doomslug-md.png"
  }
];

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