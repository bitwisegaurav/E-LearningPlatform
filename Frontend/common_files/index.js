const carouselInner = document.querySelector('.boxes');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

nextBtn.addEventListener('click', () => {
  const numItems = document.querySelectorAll('.box').length;
  if (currentIndex < numItems - 1) {
    currentIndex++;
    updateCarousel();
  }
});

function updateCarousel() {
  const carouselWidth = document.querySelector('.carousel').offsetWidth;
  const translateX = -currentIndex * (carouselWidth);
  carouselInner.style.transform = `translateX(${translateX}px)`;
}