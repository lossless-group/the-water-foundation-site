// Show bio in a modal
function showBio(button) {
  const bio = button.getAttribute('data-full-bio');
  
  // Get CSS custom properties from the document
  const rootStyles = getComputedStyle(document.documentElement);
  const cardBg = rootStyles.getPropertyValue('--color-card').trim();
  const cardForeground = rootStyles.getPropertyValue('--color-foreground').trim();
  const borderColor = rootStyles.getPropertyValue('--color-border').trim();
  const mutedForeground = rootStyles.getPropertyValue('--color-muted-foreground').trim();
  
  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);display:flex;justify-content:center;align-items:center;z-index:1000;padding:1rem';
  
  // Create text box using theme colors
  const textBox = document.createElement('div');
  textBox.style.cssText = `background:rgb(${cardBg});backdrop-filter:blur(20px);color:rgb(${cardForeground});padding:2rem;border-radius:1rem;max-width:600px;max-height:80vh;overflow-y:auto;position:relative;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);width:90%;border:1px solid rgb(${borderColor});font-family:var(--font-family-primary, 'Inter', sans-serif)`;
  
  // Create close button using theme colors
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `position:absolute;top:1rem;right:1rem;background:rgb(${borderColor} / 0.3);border:none;font-size:1.5rem;cursor:pointer;color:rgb(${mutedForeground});padding:0.5rem;border-radius:0.5rem;width:2.5rem;height:2.5rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;font-weight:300;line-height:1`;
  closeBtn.onmouseover = () => closeBtn.style.background = `rgb(${borderColor} / 0.5)`;
  closeBtn.onmouseout = () => closeBtn.style.background = `rgb(${borderColor} / 0.3)`;
  closeBtn.onclick = () => modal.remove();
  
  // Create bio container and handle line breaks
  const bioContainer = document.createElement('div');
  bioContainer.style.cssText = `margin:0;line-height:1.7;font-size:1rem;color:rgb(${cardForeground});font-weight:400;letter-spacing:0.01em;font-family:var(--font-family-primary, 'Inter', sans-serif)`;
  
  // Split bio by double line breaks to create paragraphs
  const paragraphs = bio.split('\n\n').filter(p => p.trim() !== '');
  
  paragraphs.forEach((paragraph, index) => {
    const p = document.createElement('p');
    p.style.cssText = `margin:0 0 ${index < paragraphs.length - 1 ? '1rem' : '0'} 0;line-height:1.7`;
    p.textContent = paragraph.trim();
    bioContainer.appendChild(p);
  });
  
  // Assemble elements
  textBox.appendChild(closeBtn);
  textBox.appendChild(bioContainer);
  modal.appendChild(textBox);
  document.body.appendChild(modal);
  
  // Close when clicking outside
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  // Close with Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
}

// Make function available globally
window.showBio = showBio;
