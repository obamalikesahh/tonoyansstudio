// TONOYANS STUDIO — Editorial Interactive Logic & Skiper Component 16 Card Stack Scroll

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
  const sentPhoneDisplay = document.getElementById('sent-phone-display');
  const backToStep1Btn = document.getElementById('back-to-step1');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  function resetModalState() {
    if (step1Form) step1Form.classList.remove('hidden-step');
    if (step2Form) step2Form.classList.add('hidden-step');
    if (successScreen) successScreen.classList.add('hidden-step');
    if (step1Form) step1Form.reset();
    if (step2Form) step2Form.reset();
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
    step1Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('cust-phone');
      const phoneVal = phoneInput ? phoneInput.value : '';

      if (sentPhoneDisplay) sentPhoneDisplay.textContent = phoneVal;

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
    step2Form.addEventListener('submit', (e) => {
      e.preventDefault();
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

  // 6. Hero Featured Card Auto-Rotator (Every 5 Seconds)
  const heroServices = [
    {
      title: "BALAYAGE & AIRTOUCH",
      subtitle: "Beliebteste Meister-Behandlung • ab 150 € →",
      img: "./Arbeit/thumb_balayage.png"
    },
    {
      title: "DAMEN SCHNITT & GLOW",
      subtitle: "Präzisionshaarschnitt & Styling • ab 55 € →",
      img: "./Arbeit/thumb_cut.png"
    },
    {
      title: "GLOSSING & INTENSIVPFLEGE",
      subtitle: "Seidenweicher Glanz & Veredelung • ab 45 € →",
      img: "./Arbeit/thumb_gloss.png"
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
          featImg.style.backgroundImage = `url('${data.img}')`;
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
