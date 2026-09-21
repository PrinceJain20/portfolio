/**
 * Prince Jain - Full Stack Developer Portfolio Client Application Logic
 * Integrates: Dynamic UI, REST API Client, Modal Systems, Animations & Themes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Tagline Typewriter Effect
  const taglines = [
    "Building scalable full-stack web applications.",
    "Frontend Developer for Team AlgNite (SIH 2026) 🏆",
    "246+ DSA Problems Solved in Java & JS 🧠",
    "Turning ambitious ideas into seamless software 🚀"
  ];
  let taglineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('typing-target');

  function typeEffect() {
    if (!typingElement) return;
    const currentTagline = taglines[taglineIndex];

    if (isDeleting) {
      charIndex--;
      typingElement.textContent = currentTagline.substring(0, charIndex);
    } else {
      charIndex++;
      typingElement.textContent = currentTagline.substring(0, charIndex);
    }

    let typeSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && charIndex === currentTagline.length) {
      typeSpeed = 2200; // Pause at full sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      taglineIndex = (taglineIndex + 1) % taglines.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 2. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0) {
      const scrollPercent = (window.scrollY / scrollTotal) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
  }, { passive: true });

  // 3. Navigation Active State & Smooth Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => sectionObserver.observe(section));

  // Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');

  if (mobileToggle && navMenuWrapper) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenuWrapper.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenuWrapper.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // 4. Theme Switcher (Dark / Light)
  const themeBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // 5. DSA Counter Animation (246+)
  const counterElement = document.getElementById('dsa-counter-target');
  let animated = false;

  function animateCounter() {
    if (!counterElement || animated) return;
    const target = 246;
    const duration = 1800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counterElement.textContent = target + '+';
        clearInterval(timer);
        animated = true;
      } else {
        counterElement.textContent = Math.floor(current) + '+';
      }
    }, stepTime);
  }

  const dsaSection = document.getElementById('dsa');
  if (dsaSection) {
    const dsaObserver = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) {
        animateCounter();
      }
    }, { threshold: 0.4 });
    dsaObserver.observe(dsaSection);
  }

  // 6. Skills Category Filter
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Modals Architecture
  const modals = document.querySelectorAll('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => closeModal(m));
    }
  });

  // Global modal triggers
  window.openResumeModal = () => openModal('resume-modal');
  window.openCertModal = () => openModal('cert-modal');
  window.openSihModal = () => openModal('sih-modal');
  window.openProjectModal = (projectId) => {
    const targetId = (projectId === 'sharyn') ? 'sheryians' : projectId;
    openModal(`project-modal-${targetId}`);
  };
  window.openInboxModal = () => {
    openModal('inbox-modal');
    fetchMessages();
  };

  // 8. Copy Email Function
  window.copyEmail = () => {
    const email = 'princejain9294@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Email copied to clipboard: princejain9294@gmail.com', false);
    }).catch(() => {
      showToast('Prince\'s Email: princejain9294@gmail.com', false);
    });
  };

  // 9. Toast Notification System
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    const msgElement = toast.querySelector('.toast-msg');
    const iconElement = toast.querySelector('#toast-icon');

    if (msgElement) msgElement.textContent = message;

    if (isError) {
      toast.classList.add('error');
      if (iconElement) iconElement.className = 'fas fa-triangle-exclamation';
    } else {
      toast.classList.remove('error');
      if (iconElement) iconElement.className = 'fas fa-circle-check';
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // 10. Print Resume
  window.triggerPrintResume = () => {
    window.print();
  };

  // Helper for Local Messages Store (Static / Offline fallback)
  function getLocalMessages() {
    try {
      return JSON.parse(localStorage.getItem('portfolio_local_messages') || '[]');
    } catch {
      return [];
    }
  }

  function saveLocalMessage(msg) {
    const msgs = getLocalMessages();
    msgs.unshift(msg);
    localStorage.setItem('portfolio_local_messages', JSON.stringify(msgs));
    updateMessageCountBadge();
    return msgs;
  }

  function removeLocalMessage(id) {
    const msgs = getLocalMessages().filter(m => m.id !== id);
    localStorage.setItem('portfolio_local_messages', JSON.stringify(msgs));
    updateMessageCountBadge();
    return msgs;
  }

  // 11. Backend API Ping & Live Health Check
  let isBackendLive = false;
  async function checkBackendHealth() {
    const statusText = document.getElementById('backend-status-text');
    const statusPill = document.getElementById('backend-status-pill');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        isBackendLive = true;
        if (statusText) statusText.textContent = 'API Live';
        if (statusPill) {
          statusPill.title = 'Node.js Express Backend / Serverless API is Active';
          statusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          statusPill.style.color = '#34d399';
        }
        updateMessageCountBadge();
      } else {
        throw new Error('API non-200');
      }
    } catch {
      isBackendLive = false;
      if (statusText) statusText.textContent = 'Static / Edge';
      if (statusPill) {
        statusPill.title = 'Running in Static Mode (Local storage & direct dispatch active)';
        statusPill.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        statusPill.style.color = '#38bdf8';
      }
      updateMessageCountBadge();
    }
  }
  checkBackendHealth();

  // 12. Message Count Badge Updater
  async function updateMessageCountBadge() {
    const footerCount = document.getElementById('footer-msg-count');
    let count = getLocalMessages().length;

    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        const serverCount = data.total || (data.messages ? data.messages.length : 0);
        count = Math.max(count, serverCount);
      }
    } catch {
      // Use local count in static mode
    }

    if (footerCount) footerCount.textContent = count;
  }

  // 13. Contact Form Submission with Hybrid API & Offline Fallback
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name) {
        showFormFeedback('Please provide your name.', true);
        nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFormFeedback('Please provide a valid email address.', true);
        emailInput.focus();
        return;
      }

      if (!message || message.length < 5) {
        showFormFeedback('Message must be at least 5 characters long.', true);
        messageInput.focus();
        return;
      }

      // UI Loading state
      setFormLoading(true);
      hideFormFeedback();

      const payload = { name, email, subject, message };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result && result.success) {
          contactForm.reset();
          showFormFeedback(`Thank you, ${name}! Your message has been safely received by Prince.`, false);
          showToast('Message sent successfully! Prince will respond shortly.', false);
          updateMessageCountBadge();
        } else {
          throw new Error((result && result.error) || `Server responded with status ${response.status}`);
        }
      } catch (err) {
        console.warn('Backend API unreachable or static mode. Storing locally and providing direct mail option:', err);
        
        // Save to persistent local session
        const localMsg = {
          id: 'local_' + Date.now(),
          name,
          email,
          subject,
          message,
          createdAt: new Date().toISOString(),
          isLocal: true
        };
        saveLocalMessage(localMsg);
        contactForm.reset();

        const mailtoUrl = `mailto:princejain9294@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Prince,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        showFormFeedback(`Message stored in your session inbox! Click below if you'd also like to send directly to Prince's inbox: <a href="${mailtoUrl}" style="color: var(--accent-cyan); text-decoration: underline; margin-left: 0.25rem;">Send via Email</a>`, false);
        showToast('Message saved! Prince can also be contacted directly at princejain9294@gmail.com', false);
        updateMessageCountBadge();
      } finally {
        setFormLoading(false);
      }
    });
  }

  function setFormLoading(isLoading) {
    if (!submitBtn) return;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (isLoading) {
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';
    } else {
      submitBtn.disabled = false;
      if (btnText) btnText.style.display = 'inline-flex';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }

  function showFormFeedback(msg, isError) {
    if (!formFeedback) return;
    formFeedback.innerHTML = msg;
    formFeedback.className = isError ? 'form-feedback error' : 'form-feedback success';
    formFeedback.style.display = 'flex';
  }

  function hideFormFeedback() {
    if (!formFeedback) return;
    formFeedback.style.display = 'none';
  }

  // 14. Fetch & Render Messages for Inbox Modal (Hybrid API + Local Fallback)
  window.fetchMessages = async function() {
    const listContainer = document.getElementById('inbox-messages-list');
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <i class="fas fa-circle-notch fa-spin fa-2x"></i>
        <p style="margin-top: 0.75rem;">Retrieving messages...</p>
      </div>
    `;

    let allMessages = [];
    const localMsgs = getLocalMessages();

    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        const serverMsgs = data.messages || [];
        // Merge without duplicates
        const seenIds = new Set(serverMsgs.map(m => m.id));
        const uniqueLocal = localMsgs.filter(m => !seenIds.has(m.id));
        allMessages = [...uniqueLocal, ...serverMsgs];
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Static / offline mode
      allMessages = localMsgs;
    }

    // Update badge
    const footerCount = document.getElementById('footer-msg-count');
    if (footerCount) footerCount.textContent = allMessages.length;

    if (allMessages.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="fas fa-envelope-open" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-glow);"></i>
          <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Inquiries Yet</h4>
          <p>Any messages submitted via the Contact form will appear here in real-time.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = allMessages.map(msg => {
      const dateFormatted = new Date(msg.createdAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const isLocal = msg.isLocal || String(msg.id).startsWith('local_');

      return `
        <div class="inbox-card" id="inbox-card-${msg.id}">
          <div class="inbox-meta">
            <div class="inbox-sender">
              <i class="fas fa-user-circle" style="color: var(--accent-primary); margin-right: 0.35rem;"></i>
              ${escapeHTML(msg.name)}
              <a href="mailto:${escapeHTML(msg.email)}" style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: normal; margin-left: 0.5rem; text-decoration: none;">
                &lt;${escapeHTML(msg.email)}&gt;
              </a>
              ${isLocal ? '<span class="badge" style="font-size: 0.7rem; padding: 0.15rem 0.4rem; margin-left: 0.5rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">Session Store</span>' : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="inbox-time"><i class="fas fa-clock"></i> ${dateFormatted}</span>
              <button onclick="deleteMessage('${msg.id}')" class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;" title="Delete message">
                <i class="fas fa-trash-can" style="color: var(--accent-rose);"></i>
              </button>
            </div>
          </div>
          <div class="inbox-subject">Subject: ${escapeHTML(msg.subject)}</div>
          <div class="inbox-msg">${escapeHTML(msg.message)}</div>
        </div>
      `;
    }).join('');
  };

  // Delete message function (API + Local)
  window.deleteMessage = async function(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    // Always remove from local store if present
    removeLocalMessage(id);

    try {
      if (!String(id).startsWith('local_')) {
        await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      }
      showToast('Message deleted successfully.', false);
      const card = document.getElementById(`inbox-card-${id}`);
      if (card) card.remove();
      updateMessageCountBadge();
    } catch (err) {
      // Local removal was still successful
      const card = document.getElementById(`inbox-card-${id}`);
      if (card) card.remove();
      showToast('Message removed from local session.', false);
      updateMessageCountBadge();
    }
  };

  // Simple HTML Escaper
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
