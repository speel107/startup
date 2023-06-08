function login() {
    const nameEl = document.querySelector("#name");
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("username", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "profile.html";
}

// Add people to localstorage
// Define an array of objects
var slugs = [
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

function saveSlugsToLocalStorage() {
  localStorage.setItem("slugs", JSON.stringify(slugs));
}

saveSlugsToLocalStorage();
let friends = [];
localStorage.setItem("friends", JSON.stringify(friends));