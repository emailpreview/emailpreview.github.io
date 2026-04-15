/* =============================================
   EmailPreview — Footer Component (footer.js)
   ============================================= */

(function () {
  const year = new Date().getFullYear();

  const html = `
  <footer id="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="EmailPreview Home">
            <span class="logo-icon" aria-hidden="true" style="width:28px;height:28px;font-size:13px;">✉</span>
            EmailPreview
          </a>
          <p class="footer-desc">
            A free HTML email preview and testing tool for marketers, designers, and developers.
            Test your emails before they land in the inbox.
          </p>
        </div>
        <div class="footer-col">
          <h4>Tools</h4>
          <ul>
            <li><a href="#preview-tool">HTML Email Preview</a></li>
            <li><a href="#preview-tool">Preview Text Editor</a></li>
            <li><a href="#subject-preview">Subject Line Preview</a></li>
            <li><a href="#preview-tool">Mobile Email Preview</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Learn</h4>
          <ul>
            <li><a href="#guide">Email Preview Guide</a></li>
            <li><a href="#best-practices">Best Practices</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>About</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="https://github.com/emailpreview" rel="noopener noreferrer" target="_blank">GitHub</a></li>
            <li><a href="mailto:hello@emailpreview.github.io">Contact</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} EmailPreview. Free email preview tool.</span>
        <div class="footer-bottom-links">
          <a href="#" onclick="return false;">Privacy</a>
          <a href="#" onclick="return false;">Terms</a>
          <a href="https://github.com/emailpreview" rel="noopener noreferrer" target="_blank">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  const root = document.getElementById('footer-root');
  if (root) root.outerHTML = html;
})();
