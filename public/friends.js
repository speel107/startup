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
            if(friends.includes(slug.username)) {
                // Create the card element
                let card = document.createElement("div");
                card.className = "card";
                card.id = slug.username;
                card.style = "width: 15rem;";

                // Create the card image
                var imgContainer = document.createElement("div");
                imgContainer.classList.add("img-container-small");

                var insideImage = document.createElement("img");
                insideImage.classList.add("slug-profile");
                insideImage.id = "inside";
                insideImage.alt = "my inside slug";
                insideImage.src = "./images/slug-inside-white.png";
                insideImage.style.objectFit = "contain";
                insideImage.style.filter = slug.fill;
                imgContainer.appendChild(insideImage);

                var outlineImage = document.createElement("img");
                outlineImage.classList.add("slug-profile");
                outlineImage.id = "outline";
                outlineImage.alt = "my outline slug";
                outlineImage.src = "./images/slug-outline-white.png";
                outlineImage.style.objectFit = "contain";
                outlineImage.style.filter = slug.outline;
                imgContainer.appendChild(outlineImage);

                card.appendChild(imgContainer);


                // Create the card body
                let cardBody = document.createElement("div");
                cardBody.className = "card-body";

                // Create the card title
                let title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = slug.slugname;
                cardBody.appendChild(title);

                // Create the creator paragraph
                let creator = document.createElement("p");
                creator.className = "card-text";
                creator.textContent = "Creator: " + slug.username;
                cardBody.appendChild(creator);

                // Create the connections paragraph
                let connections = document.createElement("p");
                connections.className = "card-text";
                connections.textContent = "Connections: " + slug.friends.length;
                cardBody.appendChild(connections);

                // Create the remove friend button
                let removeBtn = document.createElement("a");
                removeBtn.href = "#";
                removeBtn.className = "btn btn-info";
                removeBtn.textContent = "Remove Friend";
                removeBtn.onclick = function() {
                    let friends = JSON.parse(localStorage.getItem("friends")) || [];
                    var index = friends.indexOf(slug.username);
                    if (index !== -1) {
                        friends.splice(index, 1);
                    }
                    localStorage.setItem("friends", JSON.stringify(friends));
                    let card = document.getElementById(slug.username);
                    if (card) {
                        card.remove();
                    }
                }
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