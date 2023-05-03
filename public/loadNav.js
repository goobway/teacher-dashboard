// loadNav.js
function loadNav() {
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;
  
    fetch('nav.html')
      .then(response => response.text())
      .then(html => {
        navContainer.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading navigation:', error);
      });
  }
  