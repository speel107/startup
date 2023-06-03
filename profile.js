const colorFilters = [
    "brightness(0) saturate(100%) invert(92%) sepia(23%) saturate(7148%) hue-rotate(147deg) brightness(93%) contrast(108%)",
    "brightness(0) saturate(100%) invert(80%) sepia(18%) saturate(1715%) hue-rotate(73deg) brightness(98%) contrast(95%)"
];
let currentFill = 0;
let currentOutline = 0;

class Profile {
    constructor() {
        // set player username at the top of the screen 
        this.setPlayerName();
        // do 
    }

    setPlayerName() {
        const playerNameEl = document.querySelector('.player-name');
        playerNameEl.textContent = localStorage.getItem('username') ?? 'Mystery player';
    }
}

// const profile = new Profile();

class Workshop {
    constructor() {
        // declare/retreive profile
        let profile = new Profile();
        // fill page with current profile data
        // set listeners for all the buttons that adjust the profile when clicked
    }

    // probably some functions for the actual listener events
}

function changeName() {
    const nameEl = document.querySelector("#slug");
    localStorage.setItem("slugName", nameEl.value);

    const slugNameEl = document.querySelector('.slug-name');
    slugNameEl.textContent = nameEl.value;
}

let workshop = new Workshop();
