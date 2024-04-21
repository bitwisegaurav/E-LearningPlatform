async function getData() {
    // get language from url by creating url instance
    const url = new URL(window.location.href);
    const language = url.searchParams.get("lang");
    
    if(!language) {
        // redirect page to coming soon page
        window.location.href = "../comingsoon.html";
        // console.log("No language found in url");
    }

    // get data from json file
    const data = await fetch(`../languagesData/${language}.json`).then(res => res.json()).catch(err => {
        console.log(err);
        // redirect page to coming soon page
        window.location.href = "../comingsoon.html";
    });

    return data;
}

function setData(data) {
    document.querySelector('#LanguageName').innerHTML = data.name;

    const aside = document.querySelector('#sidebar');
    let content = "";

    data.chapters.forEach((chapter, index) => {
        content += `<li class="topic${index === data.default ? " activetop" : ""}">
            <a href="../${data.folder}/${chapter.file ? chapter.file : "../comming-inner"}.html" target="sidesec">${chapter.name}</a>
        </li>`;
    })

    aside.innerHTML = content;

    document.querySelector('iframe').src = `../${data.folder}/${data.chapters[data.default].file}.html`;

    document.title = data.name + " - Codevengers";
}

window.addEventListener("DOMContentLoaded", async () => {
    await getHeader();

    setTheme();
    setListenersTheme();
    setHamburgerListeners();

    // setTimeout(setListenersTheme, 2000);

    const data = await getData();

    setData(data);

    const topics = document.querySelectorAll('.topic');

    for (let i = 0; i < topics.length; i++) {
        topics[i].addEventListener('click', () => {
            for (let j = 0; j < topics.length; j++) {
                topics[j].classList.remove('activetop');
            }
            topics[i].classList.add('activetop');
        });
    }
})