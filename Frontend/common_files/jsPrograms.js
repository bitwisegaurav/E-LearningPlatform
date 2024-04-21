// Get references to the search button, input field, and the program links
const searchButton = document.getElementById("search");
const searchInput = document.querySelector(".search input");
const programLinks = document.querySelectorAll(".program");

// Add an event listener to the search button
searchButton.addEventListener("click", search);
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    search();
  }
});

// Function to search for a program
function search() {
  // Get the user's search query
  const searchQuery = searchInput.value.toLowerCase().trim();

  if (/^\d+$/.test(searchQuery)) {
    // If it's a number, hide all links and then show the one with matching sno attribute
    programLinks.forEach((link) => {
      link.style.display = "none";
    });

    const matchingLink = document.querySelector(
      `.program[sno="${searchQuery}"]`
    );
    if (matchingLink) {
      matchingLink.style.display = "flex";
    }
  } else {
    // If it's not a number, search for text within link text and display accordingly
    programLinks.forEach((link) => {
      const linkText = link.textContent.toLowerCase();
      if (linkText.includes(searchQuery.toLowerCase())) {
        link.style.display = "flex";
      } else {
        link.style.display = "none";
      }
    });
  }

  //   // Loop through the program links
  //   programLinks.forEach(link => {
  //     // Get the text content of the link and convert it to lowercase
  //     const linkText = link.textContent.toLowerCase();

  //     // Check if the link text contains the search query
  //     if (linkText.includes(searchQuery)) {
  //       // If the link text contains the search query, display it
  //       link.style.display = 'flex';
  //     } else {
  //       // If the link text does not contain the search query, hide it
  //       link.style.display = 'none';
  //     }
  //   });
}

// Clear the search input and show all links when clicking outside the input
document.addEventListener("click", (event) => {
  if (event.target !== searchInput && event.target !== searchButton && event.target.className !== "program") {
    searchInput.value = "";
    programLinks.forEach((link) => {
      link.style.display = "flex";
    });
  }
});

// function to add numbers in the progrmas
function addNumbers() {
  programLinks.forEach((link, index) => {
    link.setAttribute("sno", index + 1);
    // add numbers in the beginning of the program text
    let programText = link.textContent;
    programText = `${index + 1}. ${programText}`;
    link.textContent = programText;
  });
}
document.addEventListener("DOMContentLoaded", addNumbers);