import Masonry from 'masonry-layout';

export function initMasonry() {
  const grid = document.querySelector('.masonry-grid');
  if (!grid) return;

  // Initialize Masonry
  const msnry = new Masonry(grid, {
    itemSelector: '.masonry-item',
    columnWidth: '.masonry-sizer',
    percentPosition: true,
    gutter: 24,
    horizontalOrder: true
  });

  // Refresh layout when images are loaded
  const images = grid.getElementsByTagName('img');
  Array.from(images).forEach(img => {
    if (img.complete) {
      msnry.layout();
    } else {
      img.addEventListener('load', () => msnry.layout());
    }
  });

  // Refresh on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => msnry.layout(), 250);
  });
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initMasonry();
});
