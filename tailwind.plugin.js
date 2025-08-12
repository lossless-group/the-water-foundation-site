// Custom Tailwind plugin for responsive variants
module.exports = function({ addVariant }) {
  // Device-based variants
  addVariant('monitor', '@media (min-width: 1536px)');
  addVariant('laptop', '@media (min-width: 1024px) and (max-width: 1535px)');
  addVariant('tablet', '@media (min-width: 768px) and (max-width: 1023px)');
  addVariant('mobile-xl', '@media (max-width: 640px)');
  addVariant('mobile-base', '@media (max-width: 480px)');
  addVariant('mobile-sm', '@media (max-width: 360px)');

  // Orientation variants
  addVariant('portrait', '@media (orientation: portrait)');
  addVariant('landscape', '@media (orientation: landscape)');
};
