function addCounting(element) {
    const elements = document.querySelectorAll(element);

    elements.forEach((element, index) => {
        element.innerHTML = ` ${index + 1}. ` + element.innerHTML;
    })
}