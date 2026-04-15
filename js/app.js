/* =============================================
   EmailPreview — Main App (app.js)
   All tool interactions and features
   ============================================= */

(function () {
  'use strict';

  // =====================
  // Utility
  // =====================
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function showToast(msg, type = '') {
    let toast = document.getElementById('ep-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ep-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'toast ' + type;
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  function truncateStr(str, maxLen) {
    return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
  }

  // =====================
  // Tabs
  // =====================
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const panel = btn.closest('.tool-input-panel');
      $$('.tab-btn', panel).forEach(b => b.classList.remove('active'));
      $$('.tab-content', panel).forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const content = $('#tab-' + tab, panel);
      if (content) content.classList.add('active');
    });
  });

  // =====================
  // Character Counters
  // =====================
  function updateCharCounter(input, display, ideal) {
    if (!input || !display) return;
    const len = input.value.length;
    display.textContent = len;
    const parent = display.closest('.char-counter');
    if (parent) {
      parent.classList.remove('warn', 'over');
      if (ideal && len > ideal[1]) parent.classList.add('over');
      else if (ideal && len > ideal[0] * 1.15) parent.classList.add('warn');
    }
  }

  const subjectInput = $('#subject-input');
  const subjectCount = $('#subject-char-count');
  const preheaderInput = $('#preheader-input');
  const preheaderCount = $('#preheader-char-count');

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      updateCharCounter(subjectInput, subjectCount, [40, 60]);
      // Update hero mockup
      const el = $('#preview-subject-display');
      if (el) el.textContent = subjectInput.value || 'Your subject line...';
    });
  }
  if (preheaderInput) {
    preheaderInput.addEventListener('input', () => {
      updateCharCounter(preheaderInput, preheaderCount, [85, 140]);
      // Update hero mockup
      const el = $('#preview-text-display');
      if (el) el.textContent = preheaderInput.value || 'Your preview text...';
    });
  }

  // =====================
  // Preview Text Tab — character bar
  // =====================
  const ptInput = $('#pt-preheader');
  const ptCount = $('#pt-char-count');
  const ptBar   = $('#pt-bar');
  const MAX_CHARS = 140;

  function updatePTBar() {
    if (!ptInput) return;
    const len = ptInput.value.length;
    if (ptCount) ptCount.textContent = len;
    if (ptBar) {
      const pct = Math.min((len / MAX_CHARS) * 100, 100);
      ptBar.style.width = pct + '%';
      if (len > MAX_CHARS) ptBar.style.background = 'var(--red)';
      else if (len > MAX_CHARS * 0.8) ptBar.style.background = 'var(--gold)';
      else ptBar.style.background = 'var(--accent)';
    }
  }
  if (ptInput) {
    ptInput.addEventListener('input', updatePTBar);
    updatePTBar();
  }

  // =====================
  // HTML Render
  // =====================
  const renderBtn = $('#render-btn');
  const htmlInput = $('#html-input');
  const previewFrame = $('#email-preview-frame');
  const previewFrameWrap = $('#preview-frame-wrap');
  const previewInboxWrap = $('#preview-inbox-wrap');

  function renderEmailHTML(html) {
    if (!previewFrame) return;
    previewFrameWrap.style.display = 'flex';
    if (previewInboxWrap) previewInboxWrap.style.display = 'none';
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Auto resize
    previewFrame.addEventListener('load', function onLoad() {
      try {
        const h = previewFrame.contentDocument.body.scrollHeight;
        previewFrame.style.height = (h + 20) + 'px';
      } catch(e) {}
      previewFrame.removeEventListener('load', onLoad);
    });
  }

  if (renderBtn && htmlInput) {
    renderBtn.addEventListener('click', () => {
      const html = htmlInput.value.trim();
      if (!html) { showToast('Please paste your HTML email code first.', 'error'); return; }
      renderEmailHTML(html);
      showToast('Email rendered!', 'success');
      // Scroll to preview
      document.querySelector('.tool-preview-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    // Auto-render default HTML on load
    setTimeout(() => {
      if (htmlInput.value.trim()) renderEmailHTML(htmlInput.value);
    }, 400);
  }

  // =====================
  // Compose Tab Render
  // =====================
  const composeRenderBtn = $('#compose-render-btn');
  const composeBody = $('#compose-body');
  const composeSubject = $('#compose-subject');
  const composePreheader = $('#compose-preheader');

  $$('.fmt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.execCommand(btn.dataset.cmd, false, null);
      if (composeBody) composeBody.focus();
    });
  });

  if (composeRenderBtn) {
    composeRenderBtn.addEventListener('click', () => {
      const bodyContent = composeBody ? composeBody.innerHTML : '';
      const subj = composeSubject ? composeSubject.value : '';
      const preheader = composePreheader ? composePreheader.value : '';

      const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>body{font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px 24px;color:#222;line-height:1.7;}
h1,h2,h3{color:#1a1a2e;}a{color:#2d6cdf;}</style></head>
<body>
${preheader ? `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</span>` : ''}
<h2 style="color:#1a1a2e;">${subj || 'Email Subject'}</h2>
${bodyContent}
</body></html>`;

      renderEmailHTML(html);
      showToast('Email rendered from compose!', 'success');
      // Switch preview panel
      document.querySelector('.tool-preview-panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // =====================
  // Preview Text Tab Render → Inbox
  // =====================
  const ptRenderBtn = $('#pt-render-btn');

  if (ptRenderBtn) {
    ptRenderBtn.addEventListener('click', () => {
      const sender   = ($('#pt-sender') && $('#pt-sender').value) || 'Sender';
      const subject  = ($('#pt-subject') && $('#pt-subject').value) || 'Subject Line';
      const preheader = (ptInput && ptInput.value) || '';

      // Update inbox preview card
      const ipcSender  = $('#ipc-sender');
      const ipcSubject = $('#ipc-subject');
      const ipcPreview = $('#ipc-preview');
      if (ipcSender) ipcSender.textContent = sender;
      if (ipcSubject) ipcSubject.textContent = subject;
      if (ipcPreview) ipcPreview.textContent = truncateStr(preheader, 110);

      // Show inbox view
      if (previewFrameWrap) previewFrameWrap.style.display = 'none';
      if (previewInboxWrap) previewInboxWrap.style.display = 'block';

      showToast('Inbox preview updated!', 'success');
    });
  }

  // =====================
  // Device view toggle
  // =====================
  $$('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      const frame = $('#preview-device-frame');
      if (frame) {
        frame.className = 'preview-device-frame ' + view;
        // Resize iframe
        const iframe = $('#email-preview-frame');
        if (iframe) {
          if (view === 'mobile') iframe.style.maxWidth = '375px';
          else if (view === 'tablet') iframe.style.maxWidth = '480px';
          else iframe.style.maxWidth = '100%';
        }
      }
    });
  });

  // Device toggle in PT tab
  $$('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // =====================
  // Copy HTML button
  // =====================
  const copyBtn = $('#copy-html-btn');
  if (copyBtn && htmlInput) {
    copyBtn.addEventListener('click', () => {
      const html = htmlInput.value;
      if (!html.trim()) { showToast('Nothing to copy yet — paste or compose HTML first.', 'error'); return; }
      navigator.clipboard.writeText(html).then(() => {
        showToast('HTML copied to clipboard!', 'success');
      }).catch(() => {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = html;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('HTML copied!', 'success');
      });
    });
  }

  // =====================
  // Download HTML button
  // =====================
  const downloadBtn = $('#download-html-btn');
  if (downloadBtn && htmlInput) {
    downloadBtn.addEventListener('click', () => {
      const html = htmlInput.value;
      if (!html.trim()) { showToast('Nothing to download — paste HTML first.', 'error'); return; }
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-preview.html';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Email downloaded!', 'success');
    });
  }

  // =====================
  // Subject Line Preview Section
  // =====================
  const slSubjectInput = $('#sl-subject');
  const slPreheaderInput = $('#sl-preheader-input');
  const slPreviewBtn = $('#sl-preview-btn');

  function updateSubjectPreviews() {
    const subject  = slSubjectInput ? slSubjectInput.value : '';
    const preheader = slPreheaderInput ? slPreheaderInput.value : '';

    // Gmail: ~70 chars subject
    const gmailSubj = $('#gmail-subject');
    const gmailPrev = $('#gmail-preview');
    if (gmailSubj) gmailSubj.textContent = truncateStr(subject, 70);
    if (gmailPrev) gmailPrev.textContent = preheader ? ' — ' + truncateStr(preheader, 60) : '';

    // Outlook: ~60 chars
    const outlookSubj = $('#outlook-subject');
    const outlookPrev = $('#outlook-preview');
    if (outlookSubj) outlookSubj.textContent = truncateStr(subject, 60);
    if (outlookPrev) outlookPrev.textContent = truncateStr(preheader, 50);

    // Apple Mail: ~80 chars
    const appleSubj = $('#apple-subject');
    const applePrev = $('#apple-preview');
    if (appleSubj) appleSubj.textContent = truncateStr(subject, 80);
    if (applePrev) applePrev.textContent = truncateStr(preheader, 100);

    // iOS Mobile: ~35 chars
    const mobileSubj = $('#mobile-subject');
    const mobilePrev = $('#mobile-preview');
    if (mobileSubj) mobileSubj.textContent = truncateStr(subject, 35);
    if (mobilePrev) mobilePrev.textContent = truncateStr(preheader, 45);

    // Also update hero mockup
    const heroSubj = $('#preview-subject-display');
    const heroPrev = $('#preview-text-display');
    if (heroSubj) heroSubj.textContent = subject || 'Your weekly digest is here ✨';
    if (heroPrev) heroPrev.textContent = preheader || 'Catch up on everything this week...';
  }

  if (slPreviewBtn) {
    slPreviewBtn.addEventListener('click', () => {
      updateSubjectPreviews();
      showToast('Previews updated across all clients!', 'success');
    });
  }

  // Live update on input
  if (slSubjectInput) slSubjectInput.addEventListener('input', updateSubjectPreviews);
  if (slPreheaderInput) slPreheaderInput.addEventListener('input', updateSubjectPreviews);

  // Init previews
  updateSubjectPreviews();

  // =====================
  // FAQ Accordion
  // =====================
  $$('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = btn.classList.contains('open');

      // Close all
      $$('.faq-q').forEach(b => {
        b.classList.remove('open');
        const a = b.closest('.faq-item').querySelector('.faq-a');
        if (a) a.classList.remove('open');
      });

      if (!isOpen) {
        btn.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // =====================
  // Scroll fade-up animations
  // =====================
  function initScrollAnimations() {
    const targets = [
      '.step-card', '.feature-card', '.bp-card',
      '.knowledge-card', '.faq-item', '.sl-client-card',
      '.hero-inner > *', '.hero-stats'
    ];
    targets.forEach(sel => {
      $$(sel).forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = (i * 0.06) + 's';
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.fade-up').forEach(el => observer.observe(el));
  }

  initScrollAnimations();

  // =====================
  // Hero mockup row interactions
  // =====================
  $$('.mockup-row').forEach(row => {
    row.addEventListener('click', function () {
      $$('.mockup-row').forEach(r => r.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // =====================
  // Smooth scroll for anchor links
  // =====================
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // =====================
  // iframe height auto-resize
  // =====================
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'resize' && previewFrame) {
      previewFrame.style.height = e.data.height + 'px';
    }
  });

})();
