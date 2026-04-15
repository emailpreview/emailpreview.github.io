/* =============================================
   EmailPreview — Header Component (header.js)
   ============================================= */

(function () {
  const html = `
  <header id="site-header" role="banner">
    <div class="container header-inner">
      <a href="/" class="header-logo" aria-label="EmailPreview Home">
        <span class="logo-icon" aria-hidden="true">✉</span>
        EmailPreview
      </a>
      <nav aria-label="Main navigation">
        <ul class="header-nav">
          <li><a href="/#preview-tool">Preview Tool</a></li>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#best-practices">Best Practices</a></li>
          <li><a href="/#subject-preview">Subject Preview</a></li>
          <li><a href="/#guide">Guide</a></li>
          <li><a href="/#faq">FAQ</a></li>
        </ul>
      </nav>
      <div class="header-cta">
        <a href="/#preview-tool" class="btn btn-primary" style="padding:9px 20px; font-size:0.88rem;">
          Try Free Tool
        </a>
      </div>
      <button class="hamburger" id="hamburger-btn" aria-label="Toggle mobile menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
      <a href="/#preview-tool">Preview Tool</a>
      <a href="/#features">Features</a>
      <a href="/#best-practices">Best Practices</a>
      <a href="/#subject-preview">Subject Preview</a>
      <a href="/#guide">Guide</a>
      <a href="/#faq">FAQ</a>
      <a href="/#preview-tool" class="btn btn-primary" style="margin-top:8px; justify-content:center; display:flex;">Try Free Tool</a>
    </nav>
  </header>
  `;

  const root = document.getElementById('header-root');
  if (root) root.outerHTML = html;

  // Scroll shadow
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.querySelectorAll('span').forEach((s, i) => {
        if (isOpen) {
          if (i === 0) s.style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
          if (i === 1) s.style.cssText = 'opacity:0';
          if (i === 2) s.style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
        } else {
          s.style.cssText = '';
        }
      });
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
      });
    });
  }
})();
