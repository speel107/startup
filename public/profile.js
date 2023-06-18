const colorFilters = [
    "brightness(0) saturate(100%) invert(89%) sepia(3%) saturate(104%) hue-rotate(152deg) brightness(110%) contrast(98%)",
    "brightness(0) saturate(100%) invert(92%) sepia(23%) saturate(7148%) hue-rotate(147deg) brightness(93%) contrast(108%)",
    "brightness(0) saturate(100%) invert(80%) sepia(18%) saturate(1715%) hue-rotate(73deg) brightness(98%) contrast(95%)",
    "brightness(0) saturate(100%) invert(13%) sepia(74%) saturate(4268%) hue-rotate(246deg) brightness(87%) contrast(105%)",
    "brightness(0) saturate(100%) invert(18%) sepia(70%) saturate(5398%) hue-rotate(278deg) brightness(82%) contrast(99%)",
    "brightness(0) saturate(100%) invert(56%) sepia(43%) saturate(5314%) hue-rotate(280deg) brightness(99%) contrast(96%)",
    "brightness(0) saturate(100%) invert(57%) sepia(90%) saturate(3407%) hue-rotate(325deg) brightness(103%) contrast(92%)",
    "brightness(0) saturate(100%) invert(72%) sepia(51%) saturate(4823%) hue-rotate(352deg) brightness(103%) contrast(96%)",
    "brightness(0) saturate(100%) invert(89%) sepia(81%) saturate(623%) hue-rotate(343deg) brightness(103%) contrast(94%)",
];
let currentFill = 0;
let currentOutline = 0;

class Profile {
    username;
    slugname;
    currentFill;
    currentOutline;

    constructor() {
        // set player username at the top of the screen 
        this.setPlayerName();
        this.currentFill = 0;
        this.currentOutline = 0;

        // store player data
        this.username = localStorage.getItem('username');
        this.slugname = localStorage.getItem('slugname');
        this.currentFill = localStorage.getItem('fill');
        this.currentOutline = localStorage.getItem('outline');
    }

    setPlayerName() {
        const playerNameEl = document.querySelector('.player-name');
        playerNameEl.textContent = localStorage.getItem('username') ?? 'Mystery player';
    }

    setSlugName(newVal) {
        this.slugname = newVal;
        localStorage.setItem("slugname", newVal);
    }

    setOutline(newVal) {
        // set new outline color
        this.currentOutline = newVal;
        localStorage.setItem("slugoutline", newVal);
    }

    setFill(newVal) {
        // set new fill color
        this.currentFill = newVal;
        localStorage.setItem("slugfill", newVal);
        localStorage.setItem("slugfill", newVal);
    }

    async saveSlug() {
        let newFriends = JSON.parse(localStorage.getItem("friends")) || [];
        const newUser = {username: this.username, slugname: this.slugname, 
            fill: this.currentFill, outline: this.currentOutline, friends: newFriends, type: "user"};
    
        try {
          const response = await fetch('/api/update', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(newUser),
          });
          
          // Store what the service gave us as the slugs
          const slugs = await response.json();
          localStorage.setItem('slugs', JSON.stringify(slugs));
        } catch {
          // If there was an error then just track slugs locally
          this.updateSlugsLocal(newUser);
        }
    }

    updateSlugsLocal(newSlug) {
        let slugs = [];
        const slugsText = localStorage.getItem('slugs');
        if (slugsText) {
          slugs = JSON.parse(slugsText);
        }
    
        let found = false;
        for (var [i, prevSlug] of slugs.entries()) {
            if (newSlug.username === prevSlug.username) {
              prevSlug = {...prevSlug, ...newSlug};
              found = true;
            }
        }
    
        if (!found) {
            slugs.push(newSlug);
        }
    
        localStorage.setItem('slugs', JSON.stringify(slugs));
    }
}

class Workshop {
    profile;
    currFillIndex;
    currOutlineIndex;

    constructor() {
        // declare/retreive profile
        this.profile = new Profile();
        this.currFillIndex = this.findCurrFill();
        this.profile.setFill(colorFilters[this.currFillIndex]);

        this.currOutlineIndex = this.findCurrOutline();
        this.profile.setOutline(colorFilters[this.currOutlineIndex]);
    }

    findCurrFill() {
        let fill = localStorage.getItem("slugfill") ?? "0";
        let index = colorFilters.indexOf(fill);
        if(index === -1) {
            return 0;
        }
        else {
            return index;
        }
    }

    findCurrOutline() {
        let outline = localStorage.getItem("slugoutline") ?? "0";
        let index = colorFilters.indexOf(outline);
        if(index === -1) {
            return 0;
        }
        else {
            return index;
        }
    }

    // some functions for the actual listener events
    incrementFill() {
        // move fill val forward
        if(this.currFillIndex < (colorFilters.length - 1)) {
            this.currFillIndex++;
        }
        else {
            this.currFillIndex = 0;
        }
        document.getElementById("inside").style.filter = colorFilters[this.currFillIndex];
        this.profile.setFill(colorFilters[this.currFillIndex]);
    }

    decrementFill() {
        // move fill val back
        if(this.currFillIndex > 0) {
            this.currFillIndex--;
        }
        else {
            this.currFillIndex = (colorFilters.length - 1);
        }
        document.getElementById("inside").style.filter = colorFilters[this.currFillIndex];
        this.profile.setFill(colorFilters[this.currFillIndex]);
    }

    incrementOutline() {
        // move outline val forward
        if(this.currOutlineIndex < (colorFilters.length - 1)) {
            this.currOutlineIndex++;
        }
        else {
            this.currOutlineIndex = 0;
        }
        document.getElementById("outline").style.filter = colorFilters[this.currOutlineIndex];
        this.profile.setOutline(colorFilters[this.currOutlineIndex]);
    }

    decrementOutline() {
        // move outline val back
        if(this.currOutlineIndex > 0) {
            this.currOutlineIndex--;
        }
        else {
            this.currOutlineIndex = (colorFilters.length - 1);
        }
        document.getElementById("outline").style.filter = colorFilters[this.currOutlineIndex];
        this.profile.setOutline(colorFilters[this.currOutlineIndex]);
    }

    changeName(newVal) {
        this.profile.setSlugName(newVal);
    }

    async leavePage() {
        this.profile.saveSlug();
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const slugNameEl = document.querySelector('.slug-name');
    slugNameEl.textContent = localStorage.getItem('slugname') ?? 'Mystery slug';
    document.getElementById("outline").style.filter = localStorage.getItem('slugoutline');
    document.getElementById("inside").style.filter = localStorage.getItem('slugfill');
});

function changeName() {
    const nameEl = document.querySelector("#slug");
    localStorage.setItem("slugname", nameEl.value);

    const slugNameEl = document.querySelector('.slug-name');
    slugNameEl.textContent = localStorage.getItem('slugname') ?? 'Mystery slug';
    workshop.changeName(nameEl.value);
}

let workshop = new Workshop();
