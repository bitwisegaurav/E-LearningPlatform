const userdetailsform = document.getElementById("userdetails");
const userpasswordform = document.getElementById("userpassword");
const avatarBox = document.querySelector(".change-avatar .image");
const coverImageBox = document.querySelector(".change-coverimage .image");
const imageFormContainer = document.querySelector(".imageFormContainer");
const imageForm = document.getElementById("imageForm");
const editimages = document.querySelectorAll(".editimage");
const deletebtn = document.querySelector('#deletebtn');
let userdetails = {};

async function getUserData() {
    const api = "/user/get-user";
    const user = await apiCall(api);

    // const user = {
    //     _id: "1",
    //     username: "JohnDoe",
    //     name: "John Doe",
    //     email: "johndoe@gmail.com",
    //     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    //     // coverImage: "https://randomuser.me/api/portraits/men/1.jpg",
    //     coverImage: "http://res.cloudinary.com/dujd69tub/image/upload/v1709444869/oy1gqqnuidkbr9v1tmh1.jpg",
    // }

    if(user) { userdetails = {...user.user}; }
    // if(user) { userdetails = {...user}; }

    return user.user;
}

function setUserData(user) {
    if(!user) { return; }

    userdetailsform.querySelector("#username").value = user.username;
    userdetailsform.querySelector("#name").value = user.name;
    userdetailsform.querySelector("#email").value = user.email;
    avatarBox.querySelector("img").src = user.avatar;
    avatarBox.querySelector("img").setAttribute('alt', user.username + " avatar");
    coverImageBox.querySelector("img").src = user.coverImage;
    coverImageBox.querySelector("img").setAttribute('alt', user.username + " cover image");
}

function setListeners() {
    userdetailsform.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(userdetailsform);
        const {username, name, email} = Object.fromEntries(formData.entries());

        if(!username.trim() || !name.trim() || !email.trim()) {
            alert("Please provide all the fields");
            return;
        }

        if(username === userdetails.username && name === userdetails.name && email === userdetails.email) {
            alert("No changes made");
            return;
        }

        const data = {
            ...(username !== userdetails.username && {username}),
            ...(name !== userdetails.name && {name}),
            ...(email !== userdetails.email && {email})
        }

        const api = `/user/update-user`;

        try {
            await apiCall(api, "PATCH", data);
            alert("User details updated successfully");
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            return;
        }
    })

    userdetailsform.querySelector("#resetbtn").addEventListener("click", () => {
        setUserData(userdetails);
    });

    userpasswordform.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(userpasswordform);
        const {password, newPassword, confirmPassword} = Object.fromEntries(formData.entries());

        if(!password.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            alert("Please provide all the fields");
            return;
        }

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const data = {
            password,
            newPassword
        }

        const api = `/user/update-password`;

        try {
            await apiCall(api, "PATCH", data);
            userpasswordform.reset();
            alert("Password updated successfully");
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            return;
        }
    })

    imageForm.querySelector('#image').addEventListener('change', async (e) => {
        const file = e.target.files[0];

        const imageBox = imageForm.querySelector('img');
        imageBox.style.display = "block";
        imageBox.src = URL.createObjectURL(file);
    })

    imageFormContainer.addEventListener("click", (e) => {
        if(e.target.classList.contains("close")) {
            imageForm.reset();
            imageForm.querySelector('img').src = "";
            imageForm.querySelector('img').style.display = "none";
            imageFormContainer.style.display = "none";
        }
    })

    editimages.forEach(editimage => {
        editimage.addEventListener("click", (e) => {
            const id = e.target.id;
            imageForm.querySelector('#image')
            imageForm.querySelector('#image').setAttribute('name', id);
            imageForm.className = id;
            imageForm.querySelector('.file-upload').style.aspectRatio = (id === "avatar" ? "1/1" : "16/9");
            // imageBox.style.display = "none";
            imageFormContainer.style.display = "flex";
        })
    })

    imageForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(imageForm);
        const type = imageForm.className;
        const file = formData.get(type);

        if(!file) {
            alert("Please select an image");
            return;
        }

        const api = `/user/update-` + (type === "avatar" ? "avatar-image" : "cover-image");

        try {
            const options = {
                method: "PATCH",
                body: formData,
                credentials: "include"
            }

            const response = await fetch("http://127.0.0.1:8000/api/v1" + api, options);
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message);
            }

            alert("Image updated successfully");
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
            return;
        }
    })

    deletebtn.addEventListener("click", async () => {
        const confirmTask = confirm("Are you sure you want to delete your codevengers account");

        if(!confirmTask) return;

        const api = "/user/delete-account";

        try {
            await apiCall(api, "DELETE", null);
            window.location.href = "../index.html";
        } catch (error) {
            console.log(error);
        }
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    const user = await getUserData();

    if(!user) window.location.href = "./login.html"

    setUserData(user);
    setListeners();
})