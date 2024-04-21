window.addEventListener("DOMContentLoaded", () => {

  const codeBlocks = document.querySelectorAll(".code");
  
  codeBlocks.forEach((codeBlock) => {
    codeBlock.addEventListener("mouseenter", () => {
      // console.log("entered in code box");
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.classList.add("copybtn");
      codeBlock.appendChild(copyButton);
      
      copyButton.addEventListener("click", () => {
        const textArea = document.createElement("textarea");
        textArea.value = codeBlock.querySelector("pre").innerText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        copyButton.textContent = "✅";
        setTimeout(() => {
          copyButton.textContent = "Copy";
        }, 2000);
      });    
    });
    
    codeBlock.addEventListener("mouseleave", () => {
    const copyButton = codeBlock.querySelector(".copybtn");
    if (copyButton) {
      codeBlock.removeChild(copyButton);
    }
  });
});
})

// const codeBlocks = document.querySelectorAll(".code");

// codeBlocks.forEach((codeBlock) => {
//   const copyButton = codeBlock.querySelector(".copybtn");

//   copyButton.addEventListener("click", () => {
//     const textArea = document.createElement("textarea");
//     textArea.value = codeBlock.querySelector("pre").innerText;
//     document.body.appendChild(textArea);
//     textArea.select();
//     document.execCommand("copy");
//     document.body.removeChild(textArea);
//     copyButton.textContent = "✅";
//     setTimeout(() => {
//       copyButton.textContent = "Copy";
//     }, 2000);
//   });
// });