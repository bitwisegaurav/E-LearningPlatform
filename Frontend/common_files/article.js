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

function getId() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    return id || null;
}

async function getArticle(id) {
    if(!id) return null;

    const api = `/article/get-articleById/${id}`;

    const data = await apiCall(api, "GET", null);

    if (!data) { return null; }

    return data;
}

function setData(data) {
    const { title, body, imageURL, owner } = data;

    const titleBox = document.querySelector('.title');
    const contentBox = document.querySelector('.content');
    const imageBox = document.querySelector('.image img');
    const ownerBox = document.querySelector('.owner');
    const ownersImageBox = ownerBox.querySelector('.owners-image img');

    titleBox.innerHTML = title;
    contentBox.innerHTML = body;
    imageBox.src = imageURL;
    imageBox.setAttribute('alt', title + "image");
    ownerBox.href = `./profile.html?username=${owner.username}`;
    ownersImageBox.src = owner.avatar;
    ownersImageBox.setAttribute('alt', owner.username + "image");
    ownerBox.querySelector('.username').innerHTML = owner.username;
    ownerBox.querySelector('.name').innerHTML = owner.name;
}

window.addEventListener("DOMContentLoaded", async () => {
    // setData()
    setHeader();
    const id = getId();
    // console.log(id);

    // const data = {
    //     title: "Understanding Linux filesystems: ext4 and beyond",
    //     body: `The majority of modern Linux distributions default to the ext4 filesystem, just as previous Linux distributions defaulted to ext3, ext2, and—if you go back far enough—ext.
    //     If you're new to Linux—or to filesystems—you might wonder what ext4 brings to the table that ext3 didn't. You might also wonder whether ext4 is still in active development at all, given the flurries of news coverage of alternate filesystems such as btrfs, xfs, and zfs.
    //     Linux is known for its robustness, scalability, and reliability. It supports a wide range of hardware architectures and has a vast collection of software packages available through package managers. Additionally, Linux has a strong community of developers and users who contribute to its development and provide support.
    //     <br>
    //     With Linux, you have the freedom to choose from different distributions, such as Ubuntu, Fedora, and CentOS, each tailored to specific needs and preferences. These distributions come with various desktop environments, such as GNOME, KDE, and XFCE, allowing users to customize their desktop experience.
    //     Linux is also widely used in the cloud computing industry, with many cloud providers offering Linux-based virtual machines and containers. It is highly regarded for its performance, security, and cost-effectiveness in cloud environments.`,
    //     imageURL: "https://opensource.com/sites/default/files/lead-images/rh_003499_01_linux11x_cc.png",
    // }

    const data = await getArticle(id);
    // console.log(data);
    setData(data);
})