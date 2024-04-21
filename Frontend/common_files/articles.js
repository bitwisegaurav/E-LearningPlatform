const searchbar = document.querySelector('#searchbar');
const searchbtn = document.querySelector('#searchbtn');

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

function getTextFromHtml(content) {
    const div = document.createElement('div');
    div.innerHTML = content;

    return div.textContent || div.innerText || "";
}

function setNoData(message = "No data found") {
    document.querySelector('.innercontainer section').innerHTML = `
    <div class="content">
        <div class="center">
            <p>${message}</p>
        </div>
    </div>`;
}

async function getArticles() {
    const api = "/article/get-articles";

    const data = await apiCall(api, "GET", null);

    if (!data) { return null; }

    return data;
}

function setData(data) {
    if(!data) {
        setNoData("No Articles found");
        return;
    }

    const articles = data;
    if(!articles || articles.length < 1) {
        setNoData("No Articles found");
        return;
    }

    const content = articles.map(article => {
        const owner = article.owner;
        const link = `article.html?id=` + article._id;
        const body = getTextFromHtml(article.body);
        return `
        <div class="article" _id="${article._id}">
            <a href="${link}">
                <div class="image">
                    <img src="${article.imageURL}" alt="${article.title} image">
                </div>
                <div class="details">
                    <h3 class="title">${article.title}</h3>
                    <p class="description">${body}</p>
                    <div class="user">
                        <div class="image">
                            <img src="${owner.avatar}" alt="${owner.username} avatar">
                        </div>
                        <p class="username">${owner.username}</p>
                    </div>
                </div>
            </a>
            <div class="btns">
                <button type="button">&Cross;</button>
            </div>
        </div>
        `
    }).join("");

    if(!document.querySelector('.articles')) {
        document.querySelector('.innercontainer section').innerHTML = `
        <div class="articles"></div>`;
    }

    document.querySelector('.articles').innerHTML = content;
}

function search (articles) {
    const input = searchbar.value.trim().toLowerCase();
    
    const newArticles = articles.filter(article => {
        return article.title.toLowerCase().includes(input) || article.owner.username.toLowerCase().includes(input);
    } )

    setData(newArticles);
}

function setListeners(data) {
    const articles = document.querySelectorAll('.article');

    articles.forEach(article => {
        const btn = article.querySelector('.btns button');

        btn.addEventListener('click', async () => {
            const id = article.getAttribute('_id');

            // console.log(id);

            const api = `/article/delete-article/${id}`;

            try {
                await apiCall(api, 'DELETE', null);

                article.parentElement.removeChild(article);
            } catch (error) {
                console.log("Error deleting article. Error: ", error);
            }
        })
    })

    const notAvailables = document.querySelectorAll('.notAvailable');

    notAvailables.forEach(notAvailable => {
        notAvailable.addEventListener('click', (e) => {
            e.preventDefault();
            alert("This feature is not available yet");
        })
    })

    searchbtn.addEventListener('click', async () => {
        search(data);
    })

    searchbar.addEventListener('keyup', async (e) => {
        if(e.key === "Enter") {
            search(data);
        }
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    setHeader();

    const articles = await getArticles();

    if(!articles) window.location.href = "./login.html"

    // let sampledata = [
    //     {
    //         _id: "1",
    //         title: "Understanding Linux filesystems: ext4 and beyond",
    //         body: `The majority of modern Linux distributions default to the ext4 filesystem, just as previous Linux distributions defaulted to ext3, ext2, and—if you go back far enough—ext.
    //         If you're new to Linux—or to filesystems—you might wonder what ext4 brings to the table that ext3 didn't. You might also wonder whether ext4 is still in active development at all, given the flurries of news coverage of alternate filesystems such as btrfs, xfs, and zfs.
    //         Linux is known for its robustness, scalability, and reliability. It supports a wide range of hardware architectures and has a vast collection of software packages available through package managers. Additionally, Linux has a strong community of developers and users who contribute to its development and provide support.
    //         <br>
    //         With Linux, you have the freedom to choose from different distributions, such as Ubuntu, Fedora, and CentOS, each tailored to specific needs and preferences. These distributions come with various desktop environments, such as GNOME, KDE, and XFCE, allowing users to customize their desktop experience.
    //         Linux is also widely used in the cloud computing industry, with many cloud providers offering Linux-based virtual machines and containers. It is highly regarded for its performance, security, and cost-effectiveness in cloud environments.`,
    //         imageURL: "http://res.cloudinary.com/dujd69tub/image/upload/v1712076172/vylujtys5dr2ujsw3cbe.webp",
    //         owner: {
    //             username: "bitwisegaurav",
    //             avatar: "http://res.cloudinary.com/dujd69tub/image/upload/v1709444868/sf25kufqpcrur6ccxgqn.jpg"
    //         }
    //     },
    //     {
    //         _id: "2",
    //         title: "Understanding Linux filesystems: ext4 and beyond",
    //         body: `The majority of modern Linux distributions default to the ext4 filesystem, just as previous Linux distributions defaulted to ext3, ext2, and—if you go back far enough—ext.
    //         If you're new to Linux—or to filesystems—you might wonder what ext4 brings to the table that ext3 didn't. You might also wonder whether ext4 is still in active development at all, given the flurries of news coverage of alternate filesystems such as btrfs, xfs, and zfs.
    //         Linux is known for its robustness, scalability, and reliability. It supports a wide range of hardware architectures and has a vast collection of software packages available through package managers. Additionally, Linux has a strong community of developers and users who contribute to its development and provide support.
    //         <br>
    //         With Linux, you have the freedom to choose from different distributions, such as Ubuntu, Fedora, and CentOS, each tailored to specific needs and preferences. These distributions come with various desktop environments, such as GNOME, KDE, and XFCE, allowing users to customize their desktop experience.
    //         Linux is also widely used in the cloud computing industry, with many cloud providers offering Linux-based virtual machines and containers. It is highly regarded for its performance, security, and cost-effectiveness in cloud environments.`,
    //         imageURL: "http://res.cloudinary.com/dujd69tub/image/upload/v1712076172/vylujtys5dr2ujsw3cbe.webp",
    //         owner: {
    //             username: "admin",
    //             avatar: "http://res.cloudinary.com/dujd69tub/image/upload/v1709444868/sf25kufqpcrur6ccxgqn.jpg"
    //         }
    //     },
    // ]

    setData(articles);
    setListeners(articles);
})