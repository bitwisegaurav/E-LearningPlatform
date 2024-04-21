const form = document.querySelector("form");
const errorBox = document.getElementById("error");
const imageBox = form.querySelector(".imageBox");
let articleDetail = {};

async function getArticle(id) {
    const api = `/article/get-articleById/${id}`;
    const article = await apiCall(api);

    // const article = {
    //     title: "Title",
    //     body: "<h1>Body</h1>"
    // }

    if(article) {
        articleDetail = {...article};
    }

    return article;
}

function getId() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    return id || null;
}

function setData() {
    form.querySelector("#title").value = articleDetail.title;
    form.querySelector("#body").value = articleDetail.body;
    form.querySelector(".imageBox .box img").src = articleDetail.imageURL
    form.querySelector("#textEditorbtn").href = `./textEditor.html?content=${articleDetail.body}`;
}

async function changeImage(formdata, id) {
    const api = `/article/update-article-image/${id}`;

    const options = {
        method: "PATCH",
        body: formdata,
        credentials: "include"
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1" + api, options)

        if(!response.ok) {
            throw new Error("Something went wrong");
        }

        return true;
    } catch (error) {
        errorBox.innerHTML = error;
        return false;
    }

}

function setListeners(id) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const {title, body} = Object.fromEntries(formData.entries());

        if(!title.trim() && !body.trim()) {
            errorBox.innerHTML = "Please provide atleast one field";
            return;
        }

        const img = imageBox.querySelector(".box img").src;

        if(title === articleDetail.title && body === articleDetail.body && img === articleDetail.imageURL) {
            errorBox.innerHTML = "No changes made";
            return;
        }

        errorBox.innerHTML = "";

        const data = {
            ...(title !== articleDetail.title && {title}),
            ...(body !== articleDetail.body && {body})
        }

        if(img !== articleDetail.imageURL) {
            const image = imageBox.querySelector("#image").files[0];
            const formData = new FormData();
            formData.append("image", image);
            var isChanged = await changeImage(formData, id);
        }
        // console.log(data);

        // if data is empty object then return
        if(Object.keys(data).length === 0 && data.constructor === Object) {

            if(isChanged) {
                window.location.href = "./articles.html";
            }

            return;
        }

        const api = `/article/update-article/${id}`;

        try {
            const response = await apiCall(api, "PATCH", data);
    
            if (response) {
                window.location.href = "./articles.html";
            }
        } catch (error) {
            errorBox.innerHTML = error;
        }
    });

    imageBox.querySelector('#image').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        
        const image = imageBox.querySelector('img');
        image.src = URL.createObjectURL(file);
    })

    form.querySelector("#textEditorbtn").addEventListener("click", (e) => {
        e.preventDefault();
        const content = articleDetail.body;
        let editorContent = localStorage.getItem("editorContent") || "{}";
        editorContent = JSON.parse(editorContent);
        editorContent[id] = content;
        localStorage.setItem("editorContent", JSON.stringify(editorContent));
        
        // open page in new tab
        window.open(`textEditor.html?id=${id}`, "_blank");
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    setHeader();
    const id = getId();

    if(!id) window.location.href = "./articles.html"

    const article = await getArticle(id);

    if(!article) window.location.href = "./login.html"

    if(article) setData();
   
    // if(!id) {
    //     window.location.href = "./login.html";
    // }

    setListeners(id);
})