const server = "http://127.0.0.1:8000/api/v1";

async function apiCall(api, method = "GET", data) {
    if(!api) return null;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        ...(data && {body: JSON.stringify(data)}),
        credentials: "include"
    }

    try {
        const response = await fetch(server + api, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

async function getUserDataToCheck() {
    const api = "/user/get-user";

    try {
        const user = await apiCall(api);
        
        return user;
    } catch (error) {
        console.log(error);
    }
}

async function checkUserLoggedIn() {
    let user = localStorage.getItem("user");
    
    if(!user) {
        return null;
    }

    user = await getUserDataToCheck();

    if(!user) {
        return null;
    }

    return user; 
}

async function checkUserAdmin() {
    const data = await checkUserLoggedIn();
    const user = data?.user;

    if(!user || !user.isAdmin) {
        return false;
    }
    
    return true;
}