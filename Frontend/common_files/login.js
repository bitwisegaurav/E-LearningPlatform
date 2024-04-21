const signupForm = document.querySelector('#signupForm');
const loginForm = document.querySelector('#loginForm');
const signupbtn = document.querySelector('#signupbtn');
const loginbtn = document.querySelector("#loginbtn");
const section = document.querySelector("#outerBox");
const signuperrorbox = document.querySelector('#signup-error');
const loginerrorbox = document.querySelector('#login-error');
const server = "http://127.0.0.1:8000";
const signupApi = "api/v1/user/register-user";
const loginApi = "api/v1/user/login";

signupbtn.addEventListener('click', () => {
    section.style.left = "0px";
    section.style.right = "";
});
loginbtn.addEventListener("click", function() {
    section.style.right = "0px";
    section.style.left = "";
});

function setUserData(user) {
  const userData = {
    _id: user._id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    isAdmin: user.isAdmin,
  }

  localStorage.setItem('user', JSON.stringify(userData));
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const form = new FormData(signupForm);
  const {username, name, email, password, avatar, coverImage} = Object.fromEntries(form);

  // Validate form
  if(
    [username, name, email, password].some(field => !field || field === "")
  ) {
    signuperrorbox.innerHTML = "All fields are required";
    return;
  }

  if(!avatar || !coverImage) {
    signuperrorbox.innerHTML = "Profile picture and cover image are required";
    return;
  }

  // Send request to server
  fetch(`${server}/${signupApi}`, {
    method: 'POST',
    body: form,
    credentials: "include"
  })
  .then(response => {
    console.log(response);
    if(response.ok) {
      return response.json();
    } else {
      signuperrorbox.innerHTML = data.message;
    }
  })
  .then(data => data.data)
  .then(data => data._doc)
  .then(user => {
      console.log(user);
      const username = user?.username;
      setUserData(user);

      // Redirect to profile page
      window.location.href = `./profile.html?username=${username}`;
  })
  .catch(error => {
    signuperrorbox.innerHTML = error.message;
  });
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(loginForm);
    const {username, password} = Object.fromEntries(formData);

    if(!username || !password) {
      loginerrorbox.textContent = 'All fields are required';
      return;
    }

    // Send login request to server
    fetch(`http://127.0.0.1:8000/api/v1/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        }),
        credentials: "include"
    })
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(data => data.data)
    .then(data => data.data)
    .then(data => data.responseUser)
    .then(user => {
        const username = user.username;
        setUserData(user);
        // console.log('Login successful:', user);
        loginerrorbox.innerHTML = "";
        
        // Redirect to profile page using relative path
        window.location.href = `./profile.html?username=${username}`;
    })
    .catch((err) => {
        console.error('Login failed:', err);
        loginerrorbox.textContent = 'Error: ' + err.message;
    });
});