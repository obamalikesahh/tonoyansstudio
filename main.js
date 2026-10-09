// TONOYANS STUDIO — Editorial Interactive Logic & Skiper Component 16 Card Stack Scroll

import imgBalayage from './Arbeit/thumb_balayage.png';
import imgCut from './Arbeit/thumb_cut.png';
import imgGloss from './Arbeit/thumb_gloss.png';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Preloader Fadeout
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.remove('loading-state');
    }, 1200);
  }

  // 2. GSAP & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Top Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      gsap.to(progressBar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }

    // Number Counter Animations
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      const targetVal = parseFloat(counter.getAttribute('data-count'));
      if (!isNaN(targetVal)) {
        gsap.to(counter, {
          innerText: targetVal,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%'
          }
        });
      }
    });

    // Gallery Cards Grid Animation
    const galleryItems = document.querySelectorAll('.gallery-card-item');
    galleryItems.forEach((item, i) => {
      const rot = (i % 2 === 0 ? 2.5 : -2.5);
      const yOffset = (i % 3) * -12;

      gsap.fromTo(item,
        {
          x: 140,
          y: yOffset,
          opacity: 0,
          scale: 0.88,
          rotate: rot * 2
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.85,
          delay: (i % 3) * 0.1,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Skiper Component 16 - Card Stack Scroll GSAP Depth Animation
    const stackCards = document.querySelectorAll('.stack-card');
    stackCards.forEach((card, index) => {
      if (index < stackCards.length - 1) {
        gsap.to(card, {
          scale: 0.92,
          filter: 'brightness(0.5)',
          ease: 'power1.out',
          scrollTrigger: {
            trigger: stackCards[index + 1],
            start: 'top 80%',
            end: 'top 25%',
            scrub: 0.5
          }
        });
      }
    });
  }

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
  }

  // 4. Gallery Filter Tabs & Card Stack Filtering
  const tabBtns = document.querySelectorAll('.g-tab-btn');
  const galleryCards = document.querySelectorAll('.gallery-card-item');
  const stackCards = document.querySelectorAll('.stack-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tab');

      galleryCards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      stackCards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // 5. Planity-Style SMS Verification Modal
  const bookingBtns = document.querySelectorAll('.booking-btn');
  const bookingModal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('modal-close');
  const modalServiceTitle = document.getElementById('modal-service-title');
  const modalServicePrice = document.getElementById('modal-service-price');

  const step1Form = document.getElementById('booking-form-step1');
  const step2Form = document.getElementById('booking-form-step2');
  const successScreen = document.getElementById('booking-success');
  const sentEmailDisplay = document.getElementById('sent-email-display');
  const backToStep1Btn = document.getElementById('back-to-step1');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  let currentCaptchaText = '';
  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptchaText = code;
    const display = document.getElementById('captcha-display');
    if (display) display.textContent = code;
    const input = document.getElementById('cust-captcha');
    if (input) input.value = '';
  }

  function resetModalState() {
    if (step1Form) step1Form.classList.remove('hidden-step');
    if (step2Form) step2Form.classList.add('hidden-step');
    if (successScreen) successScreen.classList.add('hidden-step');
    if (step1Form) step1Form.reset();
    if (step2Form) step2Form.reset();
    generateCaptcha();
  }

  bookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Haarbehandlung';
      const price = btn.getAttribute('data-price') || 'ab 28 €';

      if (modalServiceTitle) modalServiceTitle.textContent = service;
      if (modalServicePrice) modalServicePrice.textContent = price;

      resetModalState();
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  if (modalClose && bookingModal) {
    modalClose.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
      }
    });
  }

  if (step1Form) {
    step1Form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const captchaInput = document.getElementById('cust-captcha');
      if (captchaInput && captchaInput.value.toUpperCase() !== currentCaptchaText) {
        alert('Bot-Schutz: Der eingegebene Code ist falsch!');
        generateCaptcha();
        return;
      }

      // Check request limits (Max 3 bookings per session)
      let reqCount = parseInt(sessionStorage.getItem('tonoyans_booking_req_count') || '0', 10);
      if (reqCount >= 3) {
        alert('Bot-Schutz: Zu viele Buchungsanfragen in dieser Sitzung. Bitte versuchen Sie es später erneut.');
        return;
      }

      // Hourly limit (max 5 per hour per device)
      let hourlyBookings = JSON.parse(localStorage.getItem('tonoyans_hourly_bookings') || '[]');
      const now = Date.now();
      hourlyBookings = hourlyBookings.filter(ts => now - ts < 3600000); // keep only last 60 mins
      if (hourlyBookings.length >= 5) {
        localStorage.setItem('tonoyans_hourly_bookings', JSON.stringify(hourlyBookings));
        alert('Bot-Schutz: Stündliches Buchungslimit erreicht. Bitte warten Sie eine Weile, bevor Sie weitere Termine anfragen.');
        return;
      }
      hourlyBookings.push(now);
      localStorage.setItem('tonoyans_hourly_bookings', JSON.stringify(hourlyBookings));

      const emailInput = document.getElementById('cust-email');
      const nameInput = document.getElementById('cust-name');
      const dateInput = document.getElementById('cust-date');
      const timeInput = document.getElementById('cust-time');
      
      const emailVal = emailInput ? emailInput.value : '';
      const nameVal = nameInput ? nameInput.value : '';
      const dateVal = dateInput ? dateInput.value : '';
      const timeVal = timeInput ? timeInput.value : '';

      // Check Double Booking
      const allBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
      const isBooked = allBookings.some(b => b.date === dateVal && b.time === timeVal);
      if (isBooked) {
        alert(`Leider ist am ${dateVal} um ${timeVal} Uhr bereits ein Termin vergeben. Bitte wähle eine andere Uhrzeit.`);
        return;
      }

      sessionStorage.setItem('tonoyans_booking_req_count', reqCount + 1);

      if (sentEmailDisplay) sentEmailDisplay.textContent = emailVal;

      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      window.currentVerificationCode = generatedCode;
      
      const btnRequestCode = document.getElementById('btn-request-code');
      if (btnRequestCode) {
        btnRequestCode.disabled = true;
        btnRequestCode.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Senden...';
      }

      try {
        await fetch('/api/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal, name: nameVal, code: generatedCode })
        });
      } catch (err) {
        console.error('Error sending code:', err);
      } finally {
        if (btnRequestCode) {
          btnRequestCode.disabled = false;
          btnRequestCode.innerHTML = '<i class="fa-solid fa-paper-plane"></i> E-Mail-Code anfordern';
        }
      }

      step1Form.classList.add('hidden-step');
      if (step2Form) step2Form.classList.remove('hidden-step');

      const firstDigit = document.querySelector('.code-digit');
      if (firstDigit) firstDigit.focus();
    });
  }

  // Auto-focus next digit in SMS verification code
  const codeDigits = document.querySelectorAll('.code-digit');
  codeDigits.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (index < codeDigits.length - 1) {
          codeDigits[index + 1].focus();
        }
      } else if (e.key === 'Backspace') {
        if (index > 0) {
          codeDigits[index - 1].focus();
        }
      }
    });
  });

  if (step2Form) {
    step2Form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputs = document.querySelectorAll('.code-digit');
      const enteredCode = Array.from(inputs).map(i => i.value).join('');
      if (window.currentVerificationCode && enteredCode !== window.currentVerificationCode) {
        alert('Falscher Code. Bitte überprüfen Sie Ihre E-Mail.');
        return;
      }

      const name = document.getElementById('cust-name')?.value || 'Kunde';
      const email = document.getElementById('cust-email')?.value || '';
      const phone = document.getElementById('cust-phone')?.value || '';
      const date = document.getElementById('cust-date')?.value || '';
      const time = document.getElementById('cust-time')?.value || '';
      const service = modalServiceTitle ? modalServiceTitle.textContent : 'Haarbehandlung';
      const price = modalServicePrice ? modalServicePrice.textContent : '';

      try {
        await fetch('/api/send-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, date, time, service })
        });
      } catch (err) {
        console.error('Error sending booking to admin:', err);
      }

      const newBooking = {
        id: 'BOOK-' + Date.now(),
        name,
        email,
        phone,
        date,
        time,
        service,
        price,
        verified: true,
        createdAt: new Date().toISOString()
      };

      const currentBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
      currentBookings.unshift(newBooking);
      localStorage.setItem('tonoyans_bookings', JSON.stringify(currentBookings));

      // Also register customer account
      const currentUsers = JSON.parse(localStorage.getItem('tonoyans_users') || '[]');
      if (!currentUsers.some(u => u.email === email)) {
        currentUsers.push({
          id: 'USER-' + Date.now(),
          name,
          email,
          phone,
          registeredAt: new Date().toISOString()
        });
        localStorage.setItem('tonoyans_users', JSON.stringify(currentUsers));
      }

      // Login the customer automatically
      localStorage.setItem('tonoyans_customer_logged_in_email', email);
      initCustomerPortal(); // Update UI immediately

      step2Form.classList.add('hidden-step');
      if (successScreen) successScreen.classList.remove('hidden-step');
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      if (step2Form) step2Form.classList.add('hidden-step');
      if (step1Form) step1Form.classList.remove('hidden-step');
    });
  }

  if (closeSuccessBtn && bookingModal) {
    closeSuccessBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  }

  // --- Customer Portal Logic ---
  const btnCustomerPortal = document.getElementById('btn-customer-portal');
  const portalModal = document.getElementById('customer-portal-modal');
  const portalClose = document.getElementById('customer-portal-close');
  const portalBookingsContainer = document.getElementById('portal-bookings-container');
  const portalEmailDisplay = document.getElementById('portal-customer-email');
  const btnPortalLogout = document.getElementById('btn-portal-logout');

  function initCustomerPortal() {
    const loggedEmail = localStorage.getItem('tonoyans_customer_logged_in_email');
    if (loggedEmail && btnCustomerPortal) {
      btnCustomerPortal.classList.remove('hidden');
      if (portalEmailDisplay) portalEmailDisplay.textContent = loggedEmail;
    } else if (btnCustomerPortal) {
      btnCustomerPortal.classList.add('hidden');
    }
  }
  initCustomerPortal();

  window.openCustomerPortal = function() {
    const email = localStorage.getItem('tonoyans_customer_logged_in_email');
    if (!email) return;
    
    // Render bookings
    const allBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
    const userBookings = allBookings.filter(b => b.email === email);
    
    if (userBookings.length === 0) {
      portalBookingsContainer.innerHTML = '<p style="color:#666;">Du hast aktuell keine Termine gebucht.</p>';
    } else {
      portalBookingsContainer.innerHTML = userBookings.map(b => `
        <div style="border: 1px solid #eaeaea; border-radius: 12px; padding: 20px; margin-bottom: 15px; position: relative;">
          <h4 style="margin: 0 0 10px; font-size: 16px;">${b.service}</h4>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Datum:</strong> ${b.date} um ${b.time} Uhr</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Preis:</strong> ${b.price}</p>
          <button onclick="cancelBooking('${b.id}', '${b.name}', '${b.email}', '${b.date}', '${b.time}', '${b.service}')" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; margin-top: 10px;">
            Termin stornieren
          </button>
        </div>
      `).join('');
    }
    
    portalModal.classList.remove('hidden');
  };

  window.cancelBooking = async function(id, name, email, date, time, service) {
    if (!confirm('Möchtest du diesen Termin wirklich stornieren?')) return;
    
    // Remove from localStorage
    let allBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
    allBookings = allBookings.filter(b => b.id !== id);
    localStorage.setItem('tonoyans_bookings', JSON.stringify(allBookings));
    
    // Refresh modal
    openCustomerPortal();
    
    // Send cancellation email
    try {
      await fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date, time, service })
      });
      alert('Termin wurde erfolgreich storniert. Eine Bestätigung per E-Mail ist auf dem Weg!');
    } catch (e) {
      console.error(e);
      alert('Termin storniert (E-Mail konnte nicht gesendet werden).');
    }
  };

  if (btnCustomerPortal) {
    btnCustomerPortal.addEventListener('click', (e) => {
      e.preventDefault();
      openCustomerPortal();
    });
  }

  if (portalClose) {
    portalClose.addEventListener('click', () => {
      portalModal.classList.add('hidden');
    });
    portalModal.addEventListener('click', (e) => {
      if (e.target === portalModal) portalModal.classList.add('hidden');
    });
  }

  if (btnPortalLogout) {
    btnPortalLogout.addEventListener('click', () => {
      localStorage.removeItem('tonoyans_customer_logged_in_email');
      initCustomerPortal();
      portalModal.classList.add('hidden');
    });
  }


  // 6. Hero Featured Card Auto-Rotator (Every 5 Seconds)
  const heroServices = [
    {
      title: "BALAYAGE & AIRTOUCH",
      subtitle: "Beliebteste Meister-Behandlung • ab 150 € →",
      img: imgBalayage
    },
    {
      title: "DAMEN SCHNITT & GLOW",
      subtitle: "Präzisionshaarschnitt & Styling • ab 55 € →",
      img: imgCut
    },
    {
      title: "GLOSSING & INTENSIVPFLEGE",
      subtitle: "Seidenweicher Glanz & Veredelung • ab 45 € →",
      img: imgGloss
    }
  ];

  let currentHeroIndex = 0;
  const featTitle = document.getElementById('hero-featured-title');
  const featSubtitle = document.getElementById('hero-featured-subtitle');
  const featImg = document.getElementById('hero-featured-img');
  const featCard = document.querySelector('.hero-featured-card');
  const dots = document.querySelectorAll('.hero-slider-dots .dot');

  function updateHeroCard(index) {
    currentHeroIndex = index;
    const data = heroServices[currentHeroIndex];

    if (featCard) {
      featCard.style.opacity = '0';
      featCard.style.transform = 'translateY(8px)';
      
      setTimeout(() => {
        if (featTitle) featTitle.textContent = data.title;
        if (featSubtitle) featSubtitle.textContent = data.subtitle;
        if (featImg) {
          featImg.src = data.img;
        }

        dots.forEach((dot, i) => {
          if (i === currentHeroIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        featCard.style.opacity = '1';
        featCard.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  // Auto-rotate every 5000ms (5 seconds)
  let heroTimer = setInterval(() => {
    let nextIndex = (currentHeroIndex + 1) % heroServices.length;
    updateHeroCard(nextIndex);
  }, 5000);

  // Allow manual click on dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      const index = parseInt(dot.getAttribute('data-index')) || 0;
      updateHeroCard(index);
      heroTimer = setInterval(() => {
        let nextIndex = (currentHeroIndex + 1) % heroServices.length;
        updateHeroCard(nextIndex);
      }, 5000);
    });
  });

  // 7. Legal Modals (Impressum & Datenschutz) Handlers
  const impressumModal = document.getElementById('impressum-modal');
  const datenschutzModal = document.getElementById('datenschutz-modal');
  const btnImpressumFooter = document.getElementById('btn-impressum-footer');
  const btnDatenschutzFooter = document.getElementById('btn-datenschutz-footer');
  const impressumClose = document.getElementById('impressum-close');
  const datenschutzClose = document.getElementById('datenschutz-close');

  if (btnImpressumFooter && impressumModal) {
    btnImpressumFooter.addEventListener('click', (e) => {
      e.preventDefault();
      impressumModal.classList.add('active');
    });
  }

  if (btnDatenschutzFooter && datenschutzModal) {
    btnDatenschutzFooter.addEventListener('click', (e) => {
      e.preventDefault();
      datenschutzModal.classList.add('active');
    });
  }

  if (impressumClose && impressumModal) {
    impressumClose.addEventListener('click', () => {
      impressumModal.classList.remove('active');
    });
    impressumModal.addEventListener('click', (e) => {
      if (e.target === impressumModal) {
        impressumModal.classList.remove('active');
      }
    });
  }

  if (datenschutzClose && datenschutzModal) {
    datenschutzClose.addEventListener('click', () => {
      datenschutzModal.classList.remove('active');
    });
    datenschutzModal.addEventListener('click', (e) => {
      if (e.target === datenschutzModal) {
        datenschutzModal.classList.remove('active');
      }
    });
  }
});
