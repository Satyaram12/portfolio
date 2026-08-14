/* ==========================================================================
   CONTACT FORM, CLIPBOARD COPY & TOAST NOTIFICATION SYSTEM
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Toast Notification Helper ---
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '✨';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Audio feedback if sound enabled
    if (window.playFeedbackSound) {
      window.playFeedbackSound('toast');
    }

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

  window.showToast = showToast;


  // --- 2. Copy Email to Clipboard ---
  const copyBtn = document.getElementById('copy-email-btn');
  const directEmail = 's09084268@gmail.com';

  function copyDirectEmail() {
    navigator.clipboard.writeText(directEmail).then(() => {
      showToast('Email address copied to clipboard: ' + directEmail, 'success');
      if (copyBtn) {
        const origText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = origText;
        }, 2500);
      }
    }).catch(() => {
      showToast('Contact: ' + directEmail, 'success');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copyDirectEmail);
  }
  window.copyDirectEmail = copyDirectEmail;


  // --- 3. Interactive Contact Form Submission ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const msg = msgInput ? msgInput.value.trim() : '';

      // Basic client validation
      if (!name || !email || !msg) {
        showToast('Please fill out all fields before sending.', 'error');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Show sending state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Transmitting...</span>
        `;
      }

      // Simulate network request
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          `;
        }

        contactForm.reset();
        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
      }, 1200);
    });
  }


  // --- 4. Calendar Booking Modal Simulation ---
  const bookingModal = document.getElementById('booking-modal');
  const bookingTriggers = document.querySelectorAll('.trigger-booking');

  function openBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.add('active');
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
  }

  bookingTriggers.forEach(t => t.addEventListener('click', (e) => {
    e.preventDefault();
    openBookingModal();
  }));

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
    const closeBtn = bookingModal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);

    const slotBtns = bookingModal.querySelectorAll('.time-slot-btn');
    slotBtns.forEach(slot => {
      slot.addEventListener('click', () => {
        const time = slot.getAttribute('data-slot');
        closeBookingModal();
        showToast(`15-min Intro Call confirmed for ${time}! Calendar invite dispatched.`, 'success');
      });
    });
  }

  window.openBookingModal = openBookingModal;
  window.closeBookingModal = closeBookingModal;
})();
