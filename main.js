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

  const emailInput = document.getElementById('cust-email');
  const nameInput = document.getElementById('cust-name');
  const dateInput = document.getElementById('cust-date');
  const timeInput = document.getElementById('cust-time');

  // Set today as minimum date so past dates can't be selected
  if (dateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', todayStr);
  }

  // Generate all 15-min slots ab 08:30 (Mo-Fr bis 18:00, Sa bis 13:00, So geschlossen)
  function generateTimeSlots(dayOfWeek) {
    // 0 = Sonntag, 6 = Samstag
    if (dayOfWeek === 0) {
      return []; // Sonntags geschlossen
    }
    const endHour = (dayOfWeek === 6) ? 13 : 18; // Samstags bis 13:00, Mo-Fr bis 18:00
    const slots = [];
    for (let h = 8; h <= endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 8 && m < 30) continue; // Start ab 08:30
        if (h === endHour && m > 0) break; // Stopp zur vollen Endstunde
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  }

  // Populate time dropdown for a given date, hiding booked / past slots
  function populateTimeDropdown(selectedDate) {
    if (!timeInput) return;

    // Parse date parts to prevent timezone offsets
    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) {
      timeInput.innerHTML = '<option value="" disabled selected>Sonntags geschlossen</option>';
      if (dateInput) {
        alert('Sonntags hat das Studio geschlossen. Bitte wählen Sie einen Termin von Montag bis Samstag.');
        dateInput.value = '';
      }
      return;
    }

    const allSlots = generateTimeSlots(dayOfWeek);
    const allBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
    const bookedTimesOnDate = allBookings
      .filter(b => b.date === selectedDate)
      .map(b => b.time);

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;
    const nowMinutes = isToday ? (new Date().getHours() * 60 + new Date().getMinutes()) : -1;

    timeInput.innerHTML = '<option value="">Uhrzeit wählen...</option>';
    let hasOptions = false;

    allSlots.forEach(slot => {
      // Skip already booked
      if (bookedTimesOnDate.includes(slot)) return;
      // Skip past times for today
      if (isToday) {
        const [sh, sm] = slot.split(':').map(Number);
        if (sh * 60 + sm <= nowMinutes) return;
      }
      const opt = document.createElement('option');
      opt.value = slot;
      opt.textContent = slot + ' Uhr';
      timeInput.appendChild(opt);
      hasOptions = true;
    });

    if (!hasOptions) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.disabled = true;
      opt.textContent = 'Keine Uhrzeiten verfügbar';
      timeInput.appendChild(opt);
    }
  }

  // Populate time slots when date changes
  if (dateInput && timeInput) {
    dateInput.addEventListener('change', () => {
      const selectedDate = dateInput.value;
      if (selectedDate) {
        populateTimeDropdown(selectedDate);
      } else {
        timeInput.innerHTML = '<option value="">Bitte zuerst Datum w\u00e4hlen...</option>';
      }
    });
  }

  // ─────────────────────────────────────────────
  // FAKE E-MAIL DETECTOR
  // ─────────────────────────────────────────────
  const DISPOSABLE_DOMAINS = new Set([
    'mailinator.com','guerrillamail.com','guerrillamail.info','guerrillamail.biz',
    'guerrillamail.de','guerrillamail.net','guerrillamail.org','tempmail.com',
    'tempmail.net','temp-mail.org','temp-mail.io','throwam.com','throwaway.email',
    '10minutemail.com','10minutemail.net','10minutemail.org','10minutemail.de',
    'yopmail.com','yopmail.fr','cool.fr.nf','jetable.fr.nf','nospam.ze.tc',
    'nomail.xl.cx','mega.zik.dj','speed.1s.fr','courriel.fr.nf','moncourrier.fr.nf',
    'monemail.fr.nf','monmail.fr.nf','fakeinbox.com','mailnull.com','spamgourmet.com',
    'spamgourmet.net','spamgourmet.org','spamex.com','spamcero.com','trashmail.com',
    'trashmail.at','trashmail.io','trashmail.me','trashmail.net','trashmail.org',
    'trashmail.xyz','trash-mail.at','dispostable.com','spamhole.com','spamspot.com',
    'spamthis.co.uk','mailnesia.com','mailnull.com','maildrop.cc','sharklasers.com',
    'guerrillamailblock.com','grr.la','guerrillamail.info','spam4.me','spaml.de',
    'spaml.com','discard.email','spamgob.com','fakemailgenerator.com','mailboxy.fun',
    'mailsac.com','mailslurp.com','discard.email','getnada.com','inboxbear.com',
    'mohmal.com','spamwc.de','spamwc.com','spamwc.net','byom.de','sofort-mail.de',
    'wegwerfmail.de','wegwerfmail.net','wegwerfmail.org','emkei.cz','hatespam.org',
    'mailnew.com','mailsiphon.com','mailt.me','netmails.net','netmails.com',
    'nospamfor.us','nowmymail.com','objectmail.com','obobbo.com','oneoffemail.com',
    'onewaymail.com','pookmail.com','powered.name','proxymail.eu','prtnx.com',
    'rtrtr.com','s0ny.net','safe-mail.net','safersignup.de','skeefmail.com',
    'slapsfromlastnight.com','slopsbox.com','smellfear.com','snakemail.com',
    'sneakemail.com','snkmail.com','sofimail.com','sogetthis.com','speedymail.org',
    'splyco.com','spofax.com','spamgob.com','spam.la','spoofmail.de',
    'super-auswahl.de','tempalias.com','tempe-mail.com','tempemail.biz',
    'tempemail.com','tempemail.net','tempinbox.co.uk','tempinbox.com',
    'tempomail.fr','temporaryemail.net','temporaryforwarding.com','temporaryinbox.com',
    'temporarymailaddress.com','thanksnospam.info','thisisnotmyrealemail.com',
    'throam.com','throwam.com','throwam.net','throwam.org','throwam.us',
    'trashdevil.com','trashdevil.de','trashemail.de','trashimail.com',
    'trashmail.at','trashmail.com','trashmail.io','trashmail.me','trbvm.com',
    'turual.com','twinmail.de','tyldd.com','uggsrock.com','umail.net',
    'uroid.com','veryrealemail.com','viditag.com','viewcastmedia.com',
    'viralplays.com','vncoders.net','vomoto.com','vopmail.com','vpn.st',
    'vsimcard.com','vubby.com','walala.org','watch-harry-potter.com',
    'webemail.me','weg-werf-email.de','wegwerf-email.de','wegwerf-email.net',
    'wegwerf-email.org','wegwerfadresse.de','wegwerfemail.com','wegwerfemail.de',
    'wegwerfemail.net','wegwerfemail.org','wegwerfemails.de','wetrainbayarea.com',
    'willhackforfood.biz','wilemail.com','willselfdestruct.com','winemaven.info',
    'wronghead.com','wuzupmail.net','www.e4ward.com','www.gishpuppy.com',
    'www.mailinator.com','xagloo.co','xagloo.com','xemaps.com','xents.com',
    'xmaily.com','xoxy.net','xsmail.com','yapped.net','yeah.net','yep.it',
    'yertxenor.com','yodx.ro','yogamaven.com','yopmail.pp.ua','youmail.ga',
    'yourdomain.com','yuurok.com','z1p.biz','za.com','zain.site',
    'zaktouni.fr','zehnminutenmail.de','zetmail.com','zippymail.info',
    'zoaxe.com','zoemail.net','zoemail.org','zoemail.com','zomg.info',
  ]);

  function isDisposableEmail(email) {
    const parts = (email || '').toLowerCase().split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].trim();
    return DISPOSABLE_DOMAINS.has(domain);
  }

  function isValidEmailFormat(email) {
    // Strict RFC-like check: local@domain.tld (tld min 2 chars)
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  // ─────────────────────────────────────────────
  // FAKE PHONE DETECTOR
  // ─────────────────────────────────────────────
  function isValidPhone(phone) {
    if (!phone) return false;
    // Strip whitespace, dashes, parentheses
    const stripped = phone.replace(/[\s\-().+]/g, '');
    // Must have 7–15 digits
    if (!/^\d{7,15}$/.test(stripped)) return false;
    // Reject all-same digit (0000000, 1111111, ...)
    if (/^(\d)\1{6,}$/.test(stripped)) return false;
    // Reject sequential patterns (1234567, 7654321)
    const isSequential = (s) => {
      for (let i = 1; i < s.length; i++) {
        if (Math.abs(parseInt(s[i]) - parseInt(s[i-1])) !== 1) return false;
      }
      return s.length >= 7;
    };
    if (isSequential(stripped)) return false;
    // Reject known test numbers
    const testPatterns = ['0000000','1234567','7654321','0123456','9876543',
      '1111111','2222222','3333333','4444444','5555555','6666666','7777777',
      '8888888','9999999','12345678','87654321'];
    if (testPatterns.some(p => stripped.includes(p))) return false;
    return true;
  }

  // ─────────────────────────────────────────────
  // RATE LIMITER (100 requests / 60 min)
  // ─────────────────────────────────────────────
  const RATE_LIMIT = 100;
  const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

  function checkRateLimit() {
    let timestamps = JSON.parse(localStorage.getItem('tonoyans_req_ts') || '[]');
    const now = Date.now();
    timestamps = timestamps.filter(ts => now - ts < RATE_WINDOW_MS);
    if (timestamps.length >= RATE_LIMIT) {
      localStorage.setItem('tonoyans_req_ts', JSON.stringify(timestamps));
      const waitMin = Math.ceil((RATE_WINDOW_MS - (now - Math.min(...timestamps))) / 60000);
      return { blocked: true, waitMin };
    }
    timestamps.push(now);
    localStorage.setItem('tonoyans_req_ts', JSON.stringify(timestamps));
    return { blocked: false };
  }

  if (step1Form) {
    step1Form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const dateVal = dateInput ? dateInput.value : '';
      const timeVal = timeInput ? timeInput.value : '';
      const phoneVal = document.getElementById('cust-phone')?.value?.trim() || '';

      // ── 1. E-Mail Format
      if (!isValidEmailFormat(emailVal)) {
        alert('\u274C Bitte gib eine gültige E-Mail-Adresse ein (z. B. name@beispiel.de).');
        return;
      }

      // ── 2. Wegwerf-E-Mail
      if (isDisposableEmail(emailVal)) {
        alert('\u274C Diese E-Mail-Domain ist nicht erlaubt. Bitte verwende deine echte E-Mail-Adresse (z. B. Gmail, GMX, iCloud).');
        return;
      }

      // ── 3. Telefonnummer
      if (!isValidPhone(phoneVal)) {
        alert('\u274C Bitte gib eine gültige Handynummer ein. Wegwerf- oder Testnummern werden nicht akzeptiert.');
        return;
      }

      // ── 4. CAPTCHA
      const captchaInput = document.getElementById('cust-captcha');
      if (captchaInput && captchaInput.value.toUpperCase() !== currentCaptchaText) {
        alert('\u274C Bot-Schutz: Der eingegebene Code ist falsch!');
        generateCaptcha();
        return;
      }

      // ── 5. Rate Limit (100/Stunde)
      const rateCheck = checkRateLimit();
      if (rateCheck.blocked) {
        alert(`\u23F3 Zu viele Anfragen. Bitte warte noch ca. ${rateCheck.waitMin} Minute(n) und versuche es erneut.`);
        return;
      }

      // Check Double Booking
      const allBookings = JSON.parse(localStorage.getItem('tonoyans_bookings') || '[]');
      const isBooked = allBookings.some(b => b.date === dateVal && b.time === timeVal);
      if (isBooked) {
        alert(`Leider ist am ${dateVal} um ${timeVal} Uhr bereits ein Termin vergeben. Bitte wähle eine andere Uhrzeit.`);
        return;
      }

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

  // Scroll to Top & Hide Header on Scroll Down
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const siteHeader = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Toggle scroll-to-top button
    if (scrollToTopBtn) {
      if (currentScrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Toggle header visibility
    if (siteHeader) {
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down
        siteHeader.classList.add('hidden-scroll');
      } else {
        // Scrolling up
        siteHeader.classList.remove('hidden-scroll');
      }
    }
    lastScrollY = currentScrollY;
  });

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
