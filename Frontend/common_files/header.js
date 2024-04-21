async function getHeader(optionsPrePath = "", prePath = "../") {
    const res = await fetch(prePath+"components/header.html");
    const header = await res.text();
    document.querySelector('nav').innerHTML = header;
    setOptions(optionsPrePath, prePath);
}

async function setOptions(optionsPrePath, prePath) {
    const res = await fetch(prePath+"courses.json");
    const data = await res.json();

    if(prePath === "") document.querySelector('nav a img').src = "images/logo.png";

    const options = document.querySelector('.options');
    let content = "";

    data.forEach(course => {
        let name = course.name;
        // make the first character bigger
        name = name.charAt(0).toUpperCase() + name.slice(1);

        content += `<a href="${course.url ? course.url : `${optionsPrePath}outer.html?lang=${course.name}`}" lang="${course.name}">${course.title ?course.title : name}</a>`
    })
    options.innerHTML = content;
}

function setHamburgerListeners() {
    document.getElementById('hamburger').addEventListener("click", event => {

        if (document.getElementById('hamburger').classList.contains('activebtn')) {
            document.getElementById('hamburger').classList.remove('activebtn');
            document.querySelector('aside').style.display = "none";
        }
        else {
            document.getElementById('hamburger').classList.add('activebtn');
            document.querySelector('aside').style.display = "block";
        }
    });
}