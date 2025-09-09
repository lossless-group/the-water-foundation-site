// Show bio in a modal
function showBio(button) {
  const bio = button.getAttribute('data-full-bio');
  
  // Create modal container
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;justify-content:center;align-items:center;z-index:1000';
  
  // Create text box
  const textBox = document.createElement('div');
  textBox.style.cssText = 'background:white;color:#1f2937;padding:2rem;border-radius:1rem;max-width:500px;max-height:80vh;overflow-y:auto;position:relative;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);width:90%';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = 'position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6b7280;padding:0.25rem;border-radius:0.25rem';
  closeBtn.onclick = () => modal.remove();
  
  // Create bio text
  const bioText = document.createElement('p');
  bioText.style.cssText = 'margin:0;line-height:1.6;font-size:1rem;white-space:pre-line';
  bioText.textContent = bio;
  
  // Assemble elements
  textBox.appendChild(closeBtn);
  textBox.appendChild(bioText);
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
