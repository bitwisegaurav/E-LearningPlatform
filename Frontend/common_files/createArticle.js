const errorbox = document.querySelector('#errorbox');

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

async function createArticle(data) {
    const api = 'http://127.0.0.1:8000/api/v1/article/create-article';

    // Send request to server
    fetch(api, {
      method: 'POST',
      body: data,
      credentials: "include"
    })
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        errorbox.innerHTML = data.message;
      }
    })
    .then(data => {
        if(data) {
            errorbox.innerHTML = "Article created successfully";
            errorbox.classList.add('success');

            setTimeout(function() {
                errorbox.classList.remove('success');
                errorbox.innerHTML = "";
                window.location.href = `./articles.html`;
            }, 2000)
        }
    })
    .catch(error => {
      errorbox.innerHTML = error.message;
    });
}

function setListeners() {
    const createArticleform = document.querySelector('form');
    createArticleform.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = new FormData(createArticleform);
        const {title, body, image} = Object.fromEntries(form);
    
        // Validate form
        if(
        [title, body].some(field => !field || field === "")
        ) {
            errorbox.innerHTML = "All fields are required";
            return;
        }
    
        if(!image) {
            errorbox.innerHTML = "Profile picture and cover image are required";
            return;
        }

        await createArticle(form);
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = await checkUserLoggedIn();

    if(!isLoggedIn) {
        window.location.href = "./login.html"
    }

    setHeader();
    setListeners();
})