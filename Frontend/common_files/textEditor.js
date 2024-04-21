// const editor = new FroalaEditor('#editor')
const quill = new Quill('#editor', {
    theme: 'snow'
  });
const copybtn = document.querySelector('#copy');
const nextbtn = document.querySelector('#next');

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

function setData () {
    // get html content from url
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

    if(!id) return;

    // Set HTML content
    let editorContent = localStorage.getItem("editorContent");
    editorContent = JSON.parse(editorContent);
    console.log(editorContent);
    const content = editorContent[id];
    quill.root.innerHTML = content;
}

function setListeners() {
    copybtn.addEventListener('click', () => {
        const content = quill.root.innerHTML;
        // console.log(content);
        // console.log(quill);
        // copy the content to clipboard
        navigator.clipboard.writeText(content);
        copybtn.innerHTML = 'Copied!';
        setTimeout(() => {
            copybtn.innerHTML = 'Copy';
        }, 2000);
    })

    nextbtn.addEventListener('click', () => {
        window.location.href = 'createArticle.html';
    })
}

window.addEventListener("DOMContentLoaded", async () => {
    setHeader();
    setData()
    setListeners();
})