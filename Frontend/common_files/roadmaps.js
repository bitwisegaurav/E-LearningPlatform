const outerContainer = document.querySelector("#outer-container");

async function getData() {
  const res = await fetch("../languagesData/roadmaps.json");
  const data = await res.json();
  return data;
}

async function setData() {
  const data = await getData();
  let outerBox = "";
  // console.log();
  data.forEach((topic) => {
    let boxes = "";
    console.log(Object.values(topic.containers));
    topic.containers.forEach((container) => {
      if (!container.image) container.image = `c++.png`;
      const box = `<a href="../roadmaps/roadmapTemplate.html?roadmap=${container.roadmap}" class="box" id="${container.title}">
                    <div class="logo">
                        <img src="../images/${container.image}" alt="${container.title} logo">
                    </div>
                    <p class="title">${container.title}</p>
                </a>`;
      boxes += box;
    });
    outerBox += `<section class="courses">
                <div class="topic">${topic.name}</div>
                <section id="roadmapsContainer">
                    ${boxes}
                </section>
            </section>`;
  });
  // roadmapsContainer.innerHTML = containers;
  outerContainer.innerHTML = outerBox;
}

window.addEventListener("DOMContentLoaded", async () => {
  await getHeader();

  const user = localStorage.getItem("user")

  if(!user) window.location.href = "../pages/login.html"

  setTheme();
  setListenersTheme();
  setHamburgerListeners();
  setData();
});
