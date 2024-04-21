const form = document.querySelector("form");
const errorBox = document.getElementById("error");
const imageBox = form.querySelector(".imageBox");
let courseDetail = {};

async function getcourse(id) {
    const api = `/course/get-courseById/${id}`;
    const course = await apiCall(api);

    // const course = {
    //     title: "Title",
    //     description: "<h1>description</h1>"
    // }

    if(course) {
        courseDetail = course;
    }

    return course;
}

function getId() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    return id || null;
}

function setData() {
    form.querySelector("#title").value = courseDetail.title;
    form.querySelector("#description").value = courseDetail.description;
    form.querySelector(".imageBox .box img").src = courseDetail.image
}

async function changeImage(formdata, id) {
    const api = `/course/update-course-image/${id}`;

    if(!formdata || Object.entries(formdata).length <= 0) {
        throw new Error("No image provided");
    }

    const options = {
        method: "PATCH",
        body: formdata,
        credentials: "include"
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1" + api, options)

        if(!response.ok) {
            console.log(response);
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
        const {title, description} = Object.fromEntries(formData.entries());

        if(!title.trim() && !description.trim()) {
            errorBox.innerHTML = "Please provide atleast one field";
            return;
        }

        const img = imageBox.querySelector(".box img").src;
        const imageInputBox = imageBox.querySelector("#image");

        if(title === courseDetail.title && description === courseDetail.description && (img === courseDetail.imageURL || imageInputBox.files.length <= 0)) {
            errorBox.innerHTML = "No changes made";
            return;
        }

        errorBox.innerHTML = "";

        const data = {
            ...(title !== courseDetail.title && {title}),
            ...(description !== courseDetail.description && {description})
        }

        // console.log(data);

        if(img !== courseDetail.imageURL || imageInputBox.files.length > 0) {
            const image = imageBox.querySelector("#image").files[0];
            const formData = new FormData();
            formData.append("image", image);
            try {
                var isChanged = await changeImage(formData, id);
            } catch (error) {
                errorBox.innerHTML = error?.message || error;
            }
        }
        // console.log(data);

        // if data is empty object then return
        if(Object.keys(data).length === 0 && data.constructor === Object) {

            if(isChanged) {
                window.location.href = "./courses.html";
            }

            return;
        }

        const api = `/course/update-course/${id}`;

        try {
            const response = await apiCall(api, "PATCH", data);
    
            if (response) {
                window.location.href = "./courses.html";
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
}

window.addEventListener("DOMContentLoaded", async () => {
    setHeader();
    const id = getId();

    if(!id) window.location.href = "./courses.html"

    const course = await getcourse(id);

    if(course) setData();
   
    // if(!id) {
    //     window.location.href = "./login.html";
    // }

    setListeners(id);
})