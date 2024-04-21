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

window.addEventListener('DOMContentLoaded', () => {
    const topics = document.querySelectorAll('.topic');

    for (let i = 0; i < topics.length; i++) {
        topics[i].addEventListener('click', () => {
            for (let j = 0; j < topics.length; j++) {
                topics[j].classList.remove('activetop');
            }
            topics[i].classList.add('activetop');
        });
    }
});