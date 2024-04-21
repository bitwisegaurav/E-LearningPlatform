const frame = document.querySelector('#frame');
const title = document.querySelector('#title');
let themeBtn;
let theme = localStorage.getItem("theme");
const path = new URLSearchParams(window.location.search);
const roadmapData = {
    webdevelopment : {
        name : "Web Development",
        markdown: "webdev",
        class: "roadmap img-center",
        image: ['webdev.jpeg'],
    },
    appdevelopment : {
        name : "App Development",
        markdown: "appdev",
        class: "roadmap img-center",
        image: [],
    },
    softwaredevelopment : {
        name : "Software Development",
        markdown: "softdev",
        class: "roadmap img-center",
        image: [],
    },
    frontend : {
        name : "Frontend Development",
        markdown: "frontend",
        class: "roadmap img-center",
        image: [],
    },
    backend : {
        name : "Backend Development",
        markdown: "backend",
        class: "roadmap img-center",
        image: [],
    },
    html : {
        name : "HTML",
        markdown: "html",
        class: "roadmap img-center",
        image: [],
    },
    css : {
        name : "CSS",
        markdown: "css",
        class: "roadmap img-center",
        image: [],
    },
    javascript : {
        name : "JavaScript",
        markdown: "javascript",
        class: "roadmap img-center",
        image: [],
    },
    nodejs : {
        name : "Node Js",
        markdown: "nodejs",
        class: "roadmap img-center",
        image: [],
    },
    mongodb : {
        name : "Mongo DB",
        markdown: "mongodb",
        class: "roadmap img-center",
        image: [],
    },
    react : {
        name : "React",
        markdown: "reactjs",
        class: "roadmap img-center",
        image: [],
    },
    nextjs : {
        name : "Next JS",
        markdown: "nextjs",
        class: "roadmap img-center",
        image: [],
    },
    angular : {
        name : "Angular",
        markdown: "angular",
        class: "roadmap img-center",
        image: [],
    },
    vue : {
        name : "Vue Js",
        markdown: "vue",
        class: "roadmap img-center",
        image: [],
    },
    php : {
        name : "Php",
        markdown: "php",
        class: "roadmap img-center",
        image: [],
    },
    cpp : {
        name : "C++",
        markdown: "cpp",
        class: "roadmap img-center",
        image: [],
    },
    java : {
        name : "Java",
        markdown: "java",
        class: "roadmap img-center",
        image: [],
    },
    plsql : {
        name : "PL/SQL",
        markdown: "plsql",
        class: "roadmap img-center",
        image: [],
    },
    mysql : {
        name : "MySQL",
        markdown: "mysql",
        class: "roadmap img-center",
        image: [],
    },
}

function loadData(){
    const roadmap = path.get('roadmap');
    if(roadmap){
        const data = roadmapData[roadmap];
        if(data){
            title.innerHTML = data.name + " Roadmap";
            let images = '';
            data.image.forEach(image => {
                images += `<div class="${data.class}"><img src="../examples/roadmaps/${image}" alt="${data.name}"></div>`;
            });
            const imagesBox = document.createElement('div');
            imagesBox.innerHTML = images;
            title.insertAdjacentElement("afterend", imagesBox);
            getData(data.markdown);
        }
    }
}

function loadHeader(){
    fetch("../components/header.html").then(res => {
        return res.text();
    }).then(res => {
        const navbar = document.createElement("nav");
        navbar.innerHTML = res;
        document.querySelector("#main").insertAdjacentElement("beforebegin", navbar);
        themeBtn = document.querySelector('#theme');
        themeBtn.addEventListener("click", toggleTheme);
        loadTheme()
        loadData();
    }).catch (err => {
        console.log(err);
    })
}

function loadTheme(){
    theme = localStorage.getItem("theme");
    if (!theme) {
    theme = "dark";
    localStorage.setItem("theme", theme);
    document.body.classList.remove("light");
    }
    if (theme === "light") document.body.classList.remove("dark");
    document.body.classList.add(theme);
    themeBtn.innerHTML = theme === "light" ? "🌙" : "☀️";
}

window.addEventListener("load", () => {
        loadHeader();
});

function getData(markdown){
    fetch(`${markdown}.md`).then(res => {
        if(res.ok) return res.text();
    }).then(res => {
        const data = res;
        if(data) frame.innerHTML = marked(data);
        else window.location.replace("../comingsoon.html");
        // console.log(data);
    }).catch(err => {
        console.log(err);
    })
}

function toggleTheme() {
if (!theme) {
    theme = "dark";
    document.body.classList.remove("light");
} else {
    if (theme === "light") {
    theme = "dark";
    document.body.classList.remove("light");
    } else {
    theme = "light";
    document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    document.body.classList.add(theme);
    themeBtn.innerHTML = theme === "light" ? "🌙" : "☀️";
}
}