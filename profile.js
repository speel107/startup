class Profile {
    constructor() {
        // do some cool stuff

        // set player username at the top of the screen
        const playerNameEl = document.querySelector('.player-name');
        playerNameEl.textContent = this.getPlayerName();
    }

    getPlayerName() {
        return localStorage.getItem('username') ?? 'Mystery player';
    }
}

const profile = new Profile();