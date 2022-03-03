// Your code here...

const friendsPath = "friends/";
const friendsFile = "friends.json";

const menu = document.querySelector(".pure-menu");
const content = document.querySelector(".content");

let currentPage = "Home";

menu.addEventListener("click", event => {
  event.preventDefault();
  const { parentNode: destination } = event.target;
  goTo(destination);
});

function goTo(dest) {
  setActiveLink(dest);
  if (isHomePage(dest)) {
    loadPage("Home");
  } else if (isFriendsPage(dest)) {
    loadPage("Friends");
  }
}

function setActiveLink(dest) {
  clearActiveLink();
  dest.classList.add("pure-menu-selected");
}

function loadPage(dest) {
  // If we aren't already at our destination, load the page
  if (currentPage !== dest) {
    clearContent();

    if (dest === "Friends") {
      let list = buildFriendList();
      populateFriendList(list);
    }

    setCurrentPage(dest);
  }
}

function buildFriendList() {
  const listContainer = document.createElement("div");
  listContainer.classList.add("pure-menu", "custom-restricted-width");

  const heading = document.createElement("span");
  heading.classList.add("pure-menu-heading");
  heading.innerText = "Friends";

  const friendList = document.createElement("ul");
  friendList.classList.add("pure-menu-list");

  listContainer.appendChild(heading);
  listContainer.appendChild(friendList);

  content.appendChild(listContainer);
  return friendList;
}

function populateFriendList(list) {
  fetch(friendsPath + friendsFile)
    .then(response => response.json())
    .then(friends => buildFriendLinks(list, friends)); //buildFriendList(friends));
}

function buildFriendLinks(list, friends) {
  for (const friend of friends) {
    // Create List element
    let elt = document.createElement("li");
    elt.classList.add("pure-menu-item");

    // Create Anchor element, attach it to <li> item.
    let anchor = buildFriendAnchor(friend);
    elt.appendChild(anchor);

    // Add our <li> elt to the list.
    list.appendChild(elt);
  }
}

function buildFriendAnchor(friend) {
  // Create our anchor element
  let anchor = document.createElement("a");

  // Populate the information
  anchor.href = "#";
  anchor.classList.add("pure-menu-link");
  anchor.setAttribute("data-id", friend.id);
  anchor.innerText = `${friend.firstName} ${friend.lastName}`;

  // Add the click event
  anchor.addEventListener("click", loadFriend);

  return anchor;
}

function loadFriend(event) {
  event.preventDefault();
  // Clear the page so we can build our profile page.
  clearContent();

  // Figure out which friend we should load.
  let id = event.target.getAttribute("data-id");

  //Fetch the friend from the appropriate json file.
  fetch(friendsPath + `${id}.json`)
    .then(response => response.json())
    .then(friend => buildProfilePage(friend));
}

function buildProfilePage(friend) {
  const { firstName, lastName, avatar, email, bio, hometown } = friend;
  setCurrentPage(`${firstName} ${lastName}'s Profile`);

  content.innerHTML = `
            <div class="friend">
                <div class="identity">
                    <img src="img/${avatar}" class="photo" />
                    <h2 class="name">${firstName} ${lastName}</h2>
                    <ul>
                        <li><span class="label">email:</span> ${email}</li>
                        <li><span class="label">hometown:</span> ${hometown}</li>
                    </ul>
                </div>
                <p class="bio">
                 ${bio}
                </p>
            </div>
        `;
}

function setCurrentPage(dest) {
  let title = document.querySelector("title");
  title.innerHTML = dest;
  currentPage = dest;
  // console.log(dest);
}

function clearActiveLink() {
  const links = menu.children[1];
  for (const item of links.children) {
    if (item.classList.contains("pure-menu-selected"))
      item.classList.remove("pure-menu-selected");
  }
}

function isHomePage(dest) {
  return (
    dest.classList.contains("home") ||
    dest.children[0].classList.contains("pure-menu-heading")
  );
}

function isFriendsPage(dest) {
  return dest.classList.contains("friends");
}

function clearContent() {
  content.innerHTML = "";
}