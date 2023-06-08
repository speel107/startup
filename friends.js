class FriendsList {
    constructor() {
        this.setSlugName();
        this.setPlayerName();

        this.renderCards();
    }

    setSlugName() {
        const slugNameEl = document.querySelector('.slug-name-header');
        slugNameEl.textContent = localStorage.getItem('slugname') ?? 'Mystery slug';
    }

    setPlayerName() {
        const playerNameEl = document.querySelector('.player-name');
        playerNameEl.textContent = localStorage.getItem('username') ?? 'Mystery player';
    }

    renderCards() {
        // Retrieve the array of objects from local storage
        let slugs = JSON.parse(localStorage.getItem("slugs")) || [];
        let friends = JSON.parse(localStorage.getItem("friends")) || [];
        let cardContainer = document.getElementById("card-container"); 

        // Iterate over the friends array and create a card for each object
        for (let i = 0; i < slugs.length; i++) {
            let slug = slugs[i];
            if(friends.includes(slugs.creator)) {
                // Create the card element
                let card = document.createElement("div");
                card.className = "card";
                card.style = "width: 15rem;";

                // Create the card image
                let image = document.createElement("img");
                image.className = "card-img-top";
                image.alt = "my slug";
                image.src = slug.image;
                card.appendChild(image);

                // Create the card body
                let cardBody = document.createElement("div");
                cardBody.className = "card-body";

                // Create the card title
                let title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = slug.name;
                cardBody.appendChild(title);

                // Create the creator paragraph
                let creator = document.createElement("p");
                creator.className = "card-text";
                creator.textContent = "Creator: " + slug.creator;
                cardBody.appendChild(creator);

                // Create the connections paragraph
                let connections = document.createElement("p");
                connections.className = "card-text";
                connections.textContent = "Connections: " + slug.connections;
                cardBody.appendChild(connections);

                // Create the remove friend button
                let removeBtn = document.createElement("a");
                removeBtn.href = "#";
                removeBtn.className = "btn btn-info";
                removeBtn.textContent = "Remove Friend";
                cardBody.appendChild(removeBtn);

                // Append the card body to the card
                card.appendChild(cardBody);

                // Append the card to the card container
                cardContainer.appendChild(card);
            }
        }
    }
}

let friends = new FriendsList();