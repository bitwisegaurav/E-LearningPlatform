const maincontentBox = document.querySelector('.maincontent');
const topBox = maincontentBox.querySelector('section > .top');
const aTags = topBox.querySelectorAll('a');
const chatbtn = document.querySelector('#chatbtn');
const followbtn = document.querySelector('#followbtn');
const server = "http://127.0.0.1:8000/api/v1";
const bottomBox = document.querySelector('.bottom');
const userDetails = {
    isBothSame: false,
    isAdmin: false,
};

function extractTextFromHtml(htmlString) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    return tempElement.textContent || tempElement.innerText || "";
}

async function fetchHeader() {
    fetch("../components/header.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector('nav').innerHTML = data;
    })
    .then(() => {
        document.querySelector('nav ul li .languages').style.display = "none";
        setListenersTheme();
    })
    .catch(err => console.log(err.message));
}

async function getData(username) {
    let api = "/user/get-user";

    // get username from localstorage
    // if(!username) {
    //     username = JSON.parse(localStorage.getItem('user'));
    // }

    if(username && username.trim() !== "") api += "/" + username;

    // console.log(server + api);
    
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    }
    try {
        const data = await fetch(server + api, options)
        .then(res => res.json())
        .then(data => data.data)
        // .then(data => data?.user);
        // console.log(data);
        userDetails.isBothSame = data?.isBothSame || false;
        let accessinguser = localStorage.getItem('user');
        accessinguser = JSON.parse(accessinguser);
        userDetails.isAdmin = accessinguser?.isAdmin || false;
        return data;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

async function followUser({data, username}) {
    let api = "/follower/follow";

    if(data.isFollowedByAccessingUser) api = "/follower/unfollow";

    if(!username) return;

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ username })
    }

    try {
        await fetch(server + api, options)
        .then(res => res.json())
        // .then(data => data.data);
        // console.log(data);
        window.location.reload();
    } catch (error) {
        console.log(error.message);
        window.location.href = "./login.html";
    }
}

async function removeCourse(courseId) {
    const api = '/course/remove-course-from-user';

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({courseId}),
        credentials: "include"
    }

    try {
        const response = await fetch(server + api, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

function chat() {
    alert("Chat feature is not available right now. \nBut you can use the chat feature in the upcoming version. \nStay tuned!");
}

function setListeners(data) {
    aTags.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const activeBox = topBox.querySelector('.active');
            activeBox.classList.remove('active');
            a.classList.add('active');
            setContentBox(a.id, data?.user);
        })
    })

    chatbtn.addEventListener('click', chat);
    followbtn.addEventListener('click', () => followUser({data, username: data?.user?.username}));

    const notAvailableBtns = document.querySelectorAll('.notAvailable');
    notAvailableBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            alert('This feature is not available yet. \nBut we are working on it. \nStay tuned for updates.');
        });
    });
}

function setContentBox(id, data) {
    switch(id) {
        case "courses":
            setCourses(data?.courses);
            break;
        case "articles":
            setArticles(data?.articles);
            break;
        case "questions":
            setSolvedQuestion(data?.solvedQuestions);
            break;
        default:
            setNoData("No data found");
            break;
    }
}

function setData(data){
    const user = data?.user;
    if(!user) return;

    document.querySelector('.coverImage img').src = user.coverImage;
    document.querySelector('.profile-pic img').src = user.avatar;
    document.querySelector('.profile-username p').innerHTML = user.username;

    const profileDetails = document.querySelector('.profile-details');

    profileDetails.querySelector('#name').innerHTML = user.name;
    profileDetails.querySelector('#articleCount').innerHTML = user.articles.length;
    profileDetails.querySelector('#followers').innerHTML = user.followers;
    profileDetails.querySelector('#following').innerHTML = user.following;

    const buttons = document.querySelector('.btns');

    if(data.isBothSame) {
        // remove buttons from html
        const followbtn = buttons.querySelector('#followbtn');
        const chatbtn = buttons.querySelector('#chatbtn');

        buttons.removeChild(followbtn)
        buttons.removeChild(chatbtn)
    } else {
        if(data.isFollowedByAccessingUser) buttons.querySelector('#followbtn').innerHTML = "Unfollow";
        else if(data.isFollowingAccessingUser) buttons.querySelector('#followbtn').innerHTML = "Follow Back";
        else buttons.querySelector('#followbtn').innerHTML = "Follow";
    }
    
    if(userDetails.isAdmin) document.querySelector('#adminroutes').style.display = "block";
}

function setCourses(courses){
    if(!courses || courses.length < 1) {
        setNoData("No Courses added");
        return;
    }

    let content = '';

    courses.forEach(course => {
        let name = course.title.toLowerCase();
        let url = null;
        if(courseUrls[name]) {
            if(courseUrls[name].url) {
                url = courseUrls[name].url;
            } else {
                name = courseUrls[name].name;
            }
        }

        content += `
        <div class="course" _id="${course._id}">
            <a href="${url ? url : `../languages/outer.html?lang=${name}`}">
                <div class="icon">
                    <img src="${course.image}" alt="${course.title} icon">
                </div>
                <p class="title">${course.title}</p>
            </a>
            <button type="button">Remove</button>
        </div>`;
    })

    bottomBox.innerHTML = `<div class="courses">${content}</div>`;

    const buttons = document.querySelectorAll(".courses .course button")

    buttons.forEach(button => {
        if(userDetails.isAdmin || userDetails.isBothSame) {
            button.addEventListener("click", async () => {
                const courseId = button.parentElement.getAttribute("_id");
                
                const data = await removeCourse(courseId);
                
                if (!data) { return; }
                
                const parent = button.parentElement;
                parent.parentElement.removeChild(parent);
                console.log(parent);
            })
        } else {
            button.parentElement.removeChild(button);
        }
    })
}

function setArticles(articles){
    if(!articles || articles.length < 1) {
        setNoData("No articles added");
        return;
    }

    let content = '';

    articles.forEach(article => {
        const para = extractTextFromHtml(article.body);
        content += `
        <div class="article" _id="${article._id}">
            <a href="#">
                <div class="image">
                    <img src="${article.imageURL}" alt="${article.title} image">
                </div>
                <div class="details">
                    <h3 class="title">${article.title}</h3>
                    <p class="description">${para}</p>
                </div>
            </a>
            <div class="btns">
                <button type="button" class="edit">&#x270E;</button>
                <button type="button" class="remove">&Cross;</button>
            </div>
        </div>`;
    })

    bottomBox.innerHTML = `<div class="articles">${content}</div>`;

    const articleBoxes = document.querySelectorAll(".articles .article");
    articleBoxes.forEach(articleBox => {
        const editBtn = articleBox.querySelector(".edit");
        const removeBtn = articleBox.querySelector(".remove");
        const id = articleBox.getAttribute("_id");

        if(userDetails.isAdmin || userDetails.isBothSame) {    
            editBtn.addEventListener("click", () => {
                window.location.href = `./editArticle.html?id=${id}`;
            });
        
            removeBtn.addEventListener("click", async () => {
                const api = `/article/delete-article/${id}`;

                try {
                    await apiCall(api, 'DELETE', null);
                    articleBox.parentElement.removeChild(articleBox);
                } catch (error) {
                    console.log(error.message);
                }
            });
        } else {
            editBtn.parentElement.removeChild(editBtn);
            removeBtn.parentElement.removeChild(removeBtn);
        }
    })
}

function setSolvedQuestion(questions) {
    if(!questions || questions.length < 1) {
        setNoData("No Solved Questions found");
        return;
    }
}

function setNoData(message = "No data found") {
    bottomBox.innerHTML = `
    <div class="content">
        <div class="center">
            <p>${message}</p>
        </div>
    </div>`;
}

window.addEventListener("DOMContentLoaded", async () => {
    const url = new URL(window.location.href);
    const username = url.searchParams.get('username');

    fetchHeader();
    setTheme();

    const data = await getData(username);
    // const data = {
    //     user: {
    //         _id: "60f3b3b3b3b3b3b3b3b3b3",
    //         username: "testuser",
    //         name: "Test User",
    //         avatar: "https://www.w3schools.com/howto/img_avatar.png",
    //         coverImage: "https://www.w3schools.com/howto/img_avatar.png",
    //         articles: [
    //             {
    //                 _id: "60f3b3b3b3b3b3b3b3b3b3",
    //                 title: "Python",
    //                 imageURL: "https://www.python.org/static/img/python-logo.png",
    //                 body: "<p>Python is a programming language that lets you work quickly and integrate systems more effectively.</p>",
    //                 owner: {
    //                     username: "testuser",
    //                     avatar: "https://www.w3schools.com/howto/img_avatar.png"
    //                 }
    //             },
    //             {
    //                 _id: "60f3b3b3b3b3b3b3b3b3b3",
    //                 title: "JavaScript",
    //                 imageURL: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    //                 body: "<p>JavaScript is a programming language that enables you to interact with web pages.</p>",
    //                 owner: {
    //                     username: "testuser",
    //                     avatar: "https://www.w3schools.com/howto/img_avatar.png"
    //                 }
    //             }
    //         ],
    //         followers: 0,
    //         following: 0,
    //         courses: [
    //             {
    //                 _id: "60f3b3b3b3b3b3b3b3b3b3",
    //                 title: "Python",
    //                 image: "https://www.python.org/static/img/python-logo.png"
    //             },
    //             {
    //                 _id: "60f3b3b3b3b3b3b3b3b3b3",
    //                 title: "JavaScript",
    //                 image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
    //             }
    //         ],
    //         solvedQuestions: []
    //     },
    // }
    // const data = null;


    if(!data) {
        window.location.href = "./login.html";
    }
    // console.log(data);
    setData(data);
    setListeners(data);
    setContentBox("courses", data?.user)
})