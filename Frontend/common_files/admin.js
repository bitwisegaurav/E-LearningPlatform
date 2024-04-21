const nodataBox = document.getElementById('nodata');
const containerBox = document.querySelector('.container');
const title = containerBox.querySelector('.upper .title');
const middleBox = containerBox.querySelector('.middle');
const bottomBox = containerBox.querySelector('#bottom');
const addbtn = document.querySelector('.lower .top .btns #addbtn');
const moduleCount = {
    "javascript": 62,
    "css": 16,
    "html": 14,
    "discrete mathematics": 9,
    "e commerce": 5,
    "java": 26,
    "mysql": 21,
    "computer networks": 13,
    "php": 12,
    "pl/sql": 10,
    "java programs": 445
}

function setDataBox(data) {
    const content = data.map(item => {
        return `<div class="dataBox">
            <div class="data">${item.data}</div>
            <div class="label">${item.label}</div>
        </div>`
    }).join('');

    return content;
}

function getTextFromHtml(content) {
    const html = document.createElement('html');
    html.innerHTML = content;
    return html.textContent || html.innerText || "";
}

// async get header values
async function setHeader() {
    fetch('../components/header.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('nav').innerHTML = data;
        const languagesBox = document.querySelector('nav ul li .languages');
        if (languagesBox) {
            languagesBox.parentElement.removeChild(languagesBox);
        }
        setTheme();
        setListenersTheme();
    });
}

// database calls for getting data
async function getUsers() {
    const api = "/user/get-all-users";

    const data = await apiCall(api, "GET", null);

    // const data = {
    //     userCount: 10,
    //     users: [
    //         {
    //             avatar: "http://res.cloudinary.com/dujd69tub/image/upload/v1709444868/sf25kufqpcrur6ccxgqn.jpg",
    //             name: "Gaurav Mishra",
    //             username: "bitwisegaurav",
    //         }
    //     ]
    // };

    return data;
}

async function getCourses() {
    const api = "/course/get-all-courses";

    const data = await apiCall(api, "GET", null);

    // const data = [
    //     {
    //         image: "http://res.cloudinary.com/dujd69tub/image/upload/v1710719793/wlzoofbw5e8wl1mbdrjt.png",
    //         title: "JavaScript",
    //         modulesCount: "12",
    //     },
    // ];

    return data;
}

async function getArticles() {
    const api = '/article/get-articles';

    const data = await apiCall(api, "GET", null);

    // const data = [
    //     {
    //         _id: "6230dgd09fg7w0e9rui34j",
    //         imageURL: "http://res.cloudinary.com/dujd69tub/image/upload/v1710719793/wlzoofbw5e8wl1mbdrjt.png",
    //         title: "Installing Linux on an iMac",
    //         body: "Many people may like the look and feel of Linux over other Desktop Operating Systems (OS). For this reason someone may want to install Linux on a Mac.",
    //         owner: {
    //             avatar: "http://res.cloudinary.com/dujd69tub/image/upload/v1709444868/sf25kufqpcrur6ccxgqn.jpg",
    //             name: "Gaurav Mishra",
    //             username: "bitwisegaurav",
    //         }
    //     },
    // ];

    return data;
}

// setting data in the document
async function setUsersData() {
    title.textContent = 'User Data';

    const data = await getUsers();

    const userCount = data.users.length || 0;

    middleBox.innerHTML = setDataBox([{ data: userCount, label: 'Total Users' }]);

    const users = data.users;

    const content = users.map(user => {
        return `<a href="profile.html?username=${user.username}" class="user">
        <div class="image">
            <img src="${user.avatar}" alt="${user.username} image">
        </div>
        <div class="details">
            <p class="username">${user.username}</p>
            <p class="name">${user.name}</p>
        </div>
    </a>`
    }).join('');

    bottomBox.innerHTML = content;

    // remove other classes from bottomBox
    bottomBox.className = '';
    bottomBox.classList.add('users');
}

async function setCoursesData() {
    title.textContent = 'Course Data';

    const data = await getCourses();

    const totalModulesCount = Object.values(moduleCount).slice(0,-1).reduce((total, num) => total + num)

    middleBox.innerHTML = setDataBox([
        {
            data: data.length || 0, 
            label: 'Total Courses'
        },
        {
            data: data.modulesCount || totalModulesCount, 
            label: 'Total Modules'
        },
        {
            data: data.assignments || 0, 
            label: 'Total Assignments'
        },
    ]);

    const courses = data;

    const content = courses.map(course => {
        const modules = moduleCount[course.title.toLowerCase()] || 0;
        let name = course.title.toLowerCase();
        let url = null;
        if(courseUrls[name]) {
            if(courseUrls[name].url) {
                url = courseUrls[name].url;
            } else {
                name = courseUrls[name].name;
            }
        }

        return `<div class="course" _id="${course._id}">
        <a href="${url ? url : `../languages/outer.html?lang=${name}`}">
            <div class="icon">
                <img src="${course.image}" alt="${course.title} icon">
            </div>
            <p class="title">${course.title}</p>
            <p class="modules">No. of chapters ${modules}</p>
        </a>
        <div class="btns">
            <button type="button" class="editbtn">Edit</button>
            <button type="button" class="removebtn">Remove</button>
        </div>
    </div>`
    }).join('');

    bottomBox.innerHTML = content;

    // remove other classes from bottomBox
    bottomBox.className = '';
    bottomBox.classList.add('courses');

    const courseBoxes = document.querySelectorAll('.course');

    courseBoxes.forEach(courseBox => {
        const editbtn = courseBox.querySelector('.editbtn');
        const removebtn = courseBox.querySelector('.removebtn');
        const id = courseBox.getAttribute("_id");

        editbtn.addEventListener("click", () => {
            window.location.href = `editCourse.html?id=${id}`;
        })
        
        removebtn.addEventListener("click", async () => {
            const api = `/course/delete-course/${id}`;

            try {
                await apiCall(api, "DELETE", null);
                courseBox.parentElement.removeChild(courseBox);
            } catch (error) {
                console.log(error);
            }
        })
    })
}

async function setArticlesData() {
    title.textContent = 'Article Data';

    const data = await getArticles();

    middleBox.innerHTML = setDataBox([
        {
            data: data.length || 0, 
            label: 'Total Articles'
        },
    ]);

    const articles = data;

    const content = articles.map(article => {
        return `<div class="article" _id="${article._id}">
            <a href="article.html?id=${article._id}">
                <div class="image">
                    <img src="${article.imageURL}" alt="${article.title} image">
                </div>
                <div class="details">
                    <h3 class="title">${article.title}</h3>
                    <p class="description">${getTextFromHtml(article.body)}</p>
                    <div class="user">
                        <div class="image">
                            <img src="${article.owner.avatar}" alt="${article.owner.username} avatar">
                        </div>
                        <p class="username">${article.owner.username}</p>
                    </div>
                </div>
            </a>
            <div class="btns">
                <button type="button" class="edit">&#x270E;</button>
                <button type="button" class="remove">&Cross;</button>
            </div>
        </div>`
    }).join('');

    bottomBox.innerHTML = content;

    // remove other classes from bottomBox
    bottomBox.className = '';
    bottomBox.classList.add('articles');

    const articleBoxes = document.querySelectorAll('.article');

    articleBoxes.forEach(articleBox => {
        const editbtn = articleBox.querySelector('.edit');
        const removebtn = articleBox.querySelector('.remove');
        const id = articleBox.getAttribute('_id');

        editbtn.addEventListener('click', async () => {
            window.location.href = `editArticle.html?id=${id}`;
        });

        removebtn.addEventListener('click', async () => {
            const api = `/article/delete-article/${id}`;
            
            try {
                await apiCall(api, "DELETE", null);
                articleBox.parentElement.removeChild(articleBox);
            } catch (error) {
                console.log(error);
            }
        })
    })
}

function setListeners() {
    const links = document.querySelectorAll('aside ul li a');

    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            localStorage.setItem('nav', link.id.toLowerCase());

            document.querySelector('.active').classList.remove('active');
            link.classList.add('active');

            if (link.classList.contains('notAvailable')) {
                nodataBox.style.display = 'flex';
                containerBox.style.display = 'none';
            }
            else {
                nodataBox.style.display = 'none';
                containerBox.style.display = 'flex';

                if (link.id.toLowerCase() === "users") {
                    setUsersData();
                    addbtn.style.display = 'none';
                } else if (link.id.toLowerCase() === "courses") {
                    setCoursesData()
                    addbtn.style.display = 'block';
                    addbtn.href = 'createCourse.html';
                } else if (link.id.toLowerCase() === "articles") {
                    setArticlesData()
                    addbtn.style.display = 'none';
                }
            }
        })
    })

}

function opentab() {
    const nav = localStorage.getItem('nav');
    const link = document.querySelector(`aside ul li a#${nav ? nav : 'users'}`);
    link.click();
}

window.addEventListener("DOMContentLoaded", async () => {
    setHeader();
    setListeners()
    opentab();
})