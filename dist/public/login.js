async function getUserProfile(username) {
    console.log("entering getUserProfile");
    let profile = null;
    try {
        const response = await fetch(`/api/user?username=${username}`, {
            method: 'GET'});
        profile = await response.json();
        console.log(profile.friends);
        console.log(JSON.stringify(profile.friends));

        localStorage.setItem("slugname", profile.slugname);
        localStorage.setItem("slugfill", profile.fill);
        localStorage.setItem("slugoutline", profile.outline);
        localStorage.setItem("friends", JSON.stringify(profile.friends));
        return profile;
    } catch {
        console.log("error retrieving profile");
        return null;
    }
}

async function saveSlugsToLocalStorage() {
  let slugs = [];
  try {
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

(async () => {
  const username = localStorage.getItem('username');
  if (username) {
    document.querySelector('#playerName').textContent = username;
    setDisplay('loginControls', 'none');
    setDisplay('playControls', 'block');
  } else {
    setDisplay('loginControls', 'block');
    setDisplay('playControls', 'none');
  }
})();

async function loginUser() {
  loginOrCreate(`/api/auth/login`);
}

async function createUser() {
  loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
  const username = document.querySelector('#name')?.value;
  const password = document.querySelector('#password')?.value;
  const response = await fetch(endpoint, {
    method: 'post',
    body: JSON.stringify({ username: username, password: password }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (response.ok) {
    localStorage.setItem('username', username);
    let profile = await getUserProfile(username);
    let set = await saveSlugsToLocalStorage();
    window.location.href = 'profile.html';
  } else {
    const body = await response.json();
    const modalEl = document.querySelector('#msgModal');
    modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
    const msgModal = new bootstrap.Modal(modalEl, {});
    msgModal.show();
  }
}

function play() {
  window.location.href = 'profile.html';
}

function logout() {
  localStorage.removeItem('username');
  localStorage.removeItem('slugname');
  localStorage.removeItem('fill');
  localStorage.removeItem('outline');
  localStorage.removeItem('friends');
  localStorage.removeItem('slugs');
  fetch(`/api/auth/logout`, {
    method: 'delete',
  }).then(() => (window.location.href = '/'));
}

async function getUser(email) {
  // See if we have a user with the given email.
  const response = await fetch(`/api/user/${username}`);
  if (response.status === 200) {
    return response.json();
  }

  return null;
}

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}

displayQuote();
