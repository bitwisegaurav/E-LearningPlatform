const searchbar = document.getElementById("searchbar");
const mainBox = document.querySelector("main");
const resultsBox = mainBox.querySelector(".search-results");
const submitbtn = document.getElementById("submitbtn");
let usersdata = [];

async function getUsers() {
    const api = "/user/get-all-users";
    const users = await apiCall(api);

    /*
          data -> [
              {
                  image,
                  usename,
                  name,
                  isFollowedByAccessingUser
              }
          ]
      */
    // const users = [
    //     {
    //         _id: "1",
    //         image: "https://randomuser.me/api/portraits/men/1.jpg",
    //         username: "JohnDoe",
    //         name: "John Doe",
    //         isFollowedByAccessingUser: false,
    //     },
    //     {
    //         _id: "2",
    //         image: "https://randomuser.me/api/portraits/men/2.jpg",
    //         username: "JaneSmith",
    //         name: "Jane Smith",
    //         isFollowedByAccessingUser: true,
    //     },
    //     {
    //         _id: "3",
    //         image: "https://randomuser.me/api/portraits/men/3.jpg",
    //         username: "MikeJohnson",
    //         name: "Mike Johnson",
    //         isFollowedByAccessingUser: false,
    //     },
    //     {
    //         _id: "4",
    //         image: "https://randomuser.me/api/portraits/men/4.jpg",
    //         username: "EmmaJones",
    //         name: "Emma Jones",
    //         isFollowedByAccessingUser: true,
    //     },
    //     {
    //         _id: "5",
    //         image: "https://randomuser.me/api/portraits/men/5.jpg",
    //         username: "OliverBrown",
    //         name: "Oliver Brown",
    //         isFollowedByAccessingUser: false,
    //     },
    //     {
    //         _id: "6",
    //         image: "https://randomuser.me/api/portraits/men/6.jpg",
    //         username: "SophiaTaylor",
    //         name: "Sophia Taylor",
    //         isFollowedByAccessingUser: true,
    //     },
    //     {
    //         _id: "7",
    //         image: "https://randomuser.me/api/portraits/men/7.jpg",
    //         username: "LiamMiller",
    //         name: "Liam Miller",
    //         isFollowedByAccessingUser: false,
    //     },
    //     {
    //         _id: "8",
    //         image: "https://randomuser.me/api/portraits/men/8.jpg",
    //         username: "AvaDavis",
    //         name: "Ava Davis",
    //         isFollowedByAccessingUser: true,
    //     },
    //     {
    //         _id: "9",
    //         image: "https://randomuser.me/api/portraits/men/9.jpg",
    //         username: "NoahWilson",
    //         name: "Noah Wilson",
    //         isFollowedByAccessingUser: false,
    //     },
    //     {
    //         _id: "10",
    //         image: "https://randomuser.me/api/portraits/men/10.jpg",
    //         username: "IsabellaThomas",
    //         name: "Isabella Thomas",
    //         isFollowedByAccessingUser: true,
    //     },
    // ];

    return users.users;
}

async function toggleFollow(userId, follow = true) {
    const api = `/follower/` + (follow ? "follow" : "unfollow");

    const response = await apiCall(api, "POST", {userId});

    if(!response) {
        return null;
    }

    return response;
}

function checkResultsBox() {
    // console.log(resultsBox.childElementCount);

    // check if resultsBox have any childrens
    // if (resultsBox.childElementCount <= 0) {
    //     mainBox.style.display = "none";
    // } else {
    //     mainBox.style.display = "flex";
    // }

    if(usersdata) {
        mainBox.style.display = "flex";
    }
}

async function setData(users) {
    const content = users.map((user) => {
        return `<div _id="${user._id}" class="user">
            <a href="profile.html?username=${user.username}">
            <img src="${user.avatar}" alt="${user.username} image">
            <p class="username">${user.username}</p>
            </a>
            <button type="button">${user.isFollowedByAccessingUser ? "Unfollow" : "Follow" }</button>
        </div>`;
    }).join("");

    resultsBox.innerHTML = content;
    checkResultsBox();
}

async function putData() {
    const users = await getUsers();
    usersdata = users;
    setData(users);
}

function searchUsers(input) {
    input = input.trim();
    const users = usersdata;

    const searchedUsers = users.filter(user => user.username.trim().toLowerCase().includes(input.toLowerCase()));
    // console.log(users);
    // console.log(searchedUsers);
    setData(searchedUsers);
}

function setListeners() {
    searchbar.addEventListener("input", (e) => {
        searchUsers(e.target.value);
    });

    submitbtn.addEventListener("click", (e) => {
        e.preventDefault();
        searchUsers(searchbar.value);
    });

    const users = resultsBox.querySelectorAll(".user");

    users.forEach(user => {
        const btn = user.querySelector("button");

        btn.addEventListener("click", async () => {
            const id = user.getAttribute("_id");
            const tofollow = btn.textContent.toLowerCase() === "follow";
            const response = await toggleFollow(id, tofollow);

            if(response) {
                btn.textContent = tofollow ? "Unfollow" : "Follow";
            }
        });
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    await putData();
    // checkResultsBox();
    setListeners();
});