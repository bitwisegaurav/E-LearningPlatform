let theme = localStorage.getItem("theme");

setTheme(theme);
window.addEventListener("message", (event) => {
  if (event.data.msg === "toggleTheme") {
    // console.log("pohoch rha h");
    setTheme(event.data.theme);
  }
});

// function addPreLoader(){
//   fetch("../languages/innerPreLoader.html").then((res, err) => {
//     if (res.ok) {
//       res.text().then((text) => {
//         document.body.innerHTML += `
//         <iframe src="../languages/innerPreLoader.html" frameborder="0" title="Pre Loader" id="preloader"></iframe>
//         `;
//       });
//     } else {
//       console.log(err);
//     }
//   })
// }
// addPreLoader();
function setTheme(themevalue) {
  // console.log("called");
  // theme = localStorage.getItem("theme");
  // console.log(themevalue);
  if (!themevalue) {
    themevalue = "dark";
    document.body.classList.remove("light");
  } else {
    if(themevalue === "light") document.body.classList.remove("dark");
    if(themevalue === "dark") document.body.classList.remove("light");
  }
  document.body.classList.add(themevalue);
}

window.addEventListener("DOMContentLoaded", ()=>{
  wrapContent();
  theme = localStorage.getItem("theme");
  setTheme(theme);
  // test();
});

// function test(){
//   setTimeout(()=>{
//     const preLoader = document.getElementById("preloader");
//     console.log("test");
//     if(!preLoader) test();
//     else preLoader.style.display = "none";
//   }, 10)
// }

function wrapContent () {
  const body = document.body.innerHTML;
  document.body.innerHTML = `
      <main>${body}</main>
      <aside id="sideTopicSection">
        <section class="top">Topics</section>
        <section id="topics"></section>
      </aside>
  `;
  getTopics();
}

function getTopics () {
  const topics = document.querySelectorAll("h1,h2");
  const topicBox = document.getElementById("topics");
  let topicData = '';
  // console.log(topics);
  if(topics && topics.length > 1){
    topics.forEach(topic => {
      topic.setAttribute("id", topic.innerText);
      topicData += `<a href="#${topic.innerText}">${topic.innerText}</a>`;
    });
    topicBox.innerHTML = topicData;
  } else {
    const sideTopicSection = document.querySelector('#sideTopicSection');
    sideTopicSection.style.display = "none";
  }
}
