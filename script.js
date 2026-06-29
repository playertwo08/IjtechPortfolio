/* ================================================
   IJSTECH PORTFOLIO — JAVASCRIPT
   Sections:
   1.  Cursor Glow (mouse tracker)
   2.  Navigation (scroll state + active link + hamburger)
   3.  Typewriter Effect (hero rotating words)
   4.  Scroll Reveal (fade-in on scroll)
   5.  Active Section Highlighting
   6.  Project Card Image Cycling (multi-image dots)
   7.  Project Data (PROJECT_DATA array)
   8.  Case Study Modal
   9.  Pricing Modal + Purchase Form
   10. Theme Toggle (dark/light mode)
   11. Contact Form (Formspree integration)
================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 🔧 EDIT: Formspree endpoint — emails sent to ijs.toribio.tech@gmail.com
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xlgkeeqj';

  /* ================================================
     1. CURSOR GLOW
     Tracks mouse position and moves the radial gradient
     Edit --x / --y offset in style.css .cursor-glow
  ================================================ */
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    // Only activate on devices with a precise pointer (desktop/mouse)
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }


  /* ================================================
     2. NAVIGATION
     - Adds .nav--scrolled class when user scrolls down
     - Hamburger toggle for mobile menu
     - Closes mobile menu on link click
  ================================================ */
  const nav         = document.getElementById('nav');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');

  // Scroll state — adds frosted glass effect
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  // Hamburger open/close
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);

    // Lock body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });


  /* ================================================
     3. TYPEWRITER EFFECT
     🔧 EDIT: WORDS array — words that cycle in hero
     🔧 EDIT: TYPING_SPEED, DELETING_SPEED, PAUSE_MS
  ================================================ */

  // ⬇ 🔧 EDIT: Change the rotating words here
  const WORDS = [
    'build',
    'debug',
    'automate',
    'ship',
    'optimize',
    'query',
    'design',
  ];

  // ⬇ 🔧 EDIT: Animation timing (milliseconds)
  const TYPING_SPEED   = 90;   // Speed when typing a word
  const DELETING_SPEED = 55;   // Speed when deleting a word
  const PAUSE_MS       = 1800; // Pause after word is fully typed

  const wordEl = document.getElementById('typewriterWord');
  if (wordEl) {
    let wordIndex   = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    const type = () => {
      const currentWord = WORDS[wordIndex % WORDS.length];

      if (isDeleting) {
        // Remove a character
        charIndex--;
        wordEl.textContent = currentWord.substring(0, charIndex);
      } else {
        // Add a character
        charIndex++;
        wordEl.textContent = currentWord.substring(0, charIndex);
      }

      let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

      if (!isDeleting && charIndex === currentWord.length) {
        // Word fully typed — pause then start deleting
        delay = PAUSE_MS;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Word fully deleted — move to next word
        isDeleting = false;
        wordIndex++;
        delay = 300;
      }

      setTimeout(type, delay);
    };

    // Start after a short delay
    setTimeout(type, 800);
  }


  /* ================================================
     4. SCROLL REVEAL
     Elements with the class "reveal" fade in when
     they enter the viewport.
     To add reveal to any element, just add class="reveal"
     in the HTML. The CSS handles the animation.
  ================================================ */
  const revealEls = document.querySelectorAll(
    '.about__grid, .skills__card, .project-card, ' +
    '.achievement-item, .pricing-card, .contact__grid, ' +
    '.hero__content'
  );

  // Add reveal class to all target elements
  revealEls.forEach(el => el.classList.add('reveal'));

  // Intersection Observer — triggers when element enters viewport
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stop observing after it's revealed (performance)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      // 🔧 EDIT: threshold — how much of element must be visible to trigger reveal
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ================================================
     5. ACTIVE NAV LINK HIGHLIGHTING
     Highlights the nav link for the section
     currently in the viewport.
  ================================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link, .nav__mobile-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    // 🔧 EDIT: threshold — how much of section must be visible to highlight nav link
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));


  /* ================================================
     6. PROJECT CARD IMAGE CYCLING
     When a card has multiple images, dots appear
     on hover to navigate between them.
     🔧 EDIT: AUTO_CYCLE_MS — speed of auto-rotation (set to 0 to disable)
  ================================================ */
  const AUTO_CYCLE_MS = 3500; // Time between auto-switches (ms)

  document.querySelectorAll('.project-card__image-wrap').forEach(wrap => {
    const imgs = wrap.querySelectorAll('.project-card__image');
    const dotsContainer = wrap.querySelector('.project-card__dots');

    if (imgs.length <= 1) return;

    // If no image has is-active, activate the first one
    const hasActive = wrap.querySelector('.project-card__image.is-active');
    if (!hasActive) imgs[0].classList.add('is-active');

    let currentIndex = 0;
    let interval = null;

    // Create dot for each image
    imgs.forEach((img, i) => {
      const dot = document.createElement('span');
      dot.className = 'project-card__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        switchToImage(i);
        resetAutoCycle();
      });
      dotsContainer.appendChild(dot);
    });

    dotsContainer.classList.add('has-dots');

    const allDots = dotsContainer.querySelectorAll('.project-card__dot');

    function switchToImage(index) {
      imgs[currentIndex].classList.remove('is-active');
      allDots[currentIndex].classList.remove('is-active');
      currentIndex = index;
      imgs[currentIndex].classList.add('is-active');
      allDots[currentIndex].classList.add('is-active');
    }

    function nextImage() {
      switchToImage((currentIndex + 1) % imgs.length);
    }

    function startAutoCycle() {
      if (AUTO_CYCLE_MS > 0 && imgs.length > 1) {
        interval = setInterval(nextImage, AUTO_CYCLE_MS);
      }
    }

    function stopAutoCycle() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    function resetAutoCycle() {
      stopAutoCycle();
      startAutoCycle();
    }

    // Auto-cycle on hover
    wrap.parentElement.addEventListener('mouseenter', startAutoCycle);
    wrap.parentElement.addEventListener('mouseleave', stopAutoCycle);
    wrap.parentElement.addEventListener('focusin', startAutoCycle);
    wrap.parentElement.addEventListener('focusout', stopAutoCycle);
  });


  /* ================================================
     7. PROJECT DATA — Case study content
     🔧 EDIT: Update each project's title, descriptions,
        images array, technologies, and link below.
        Each object matches a data-project-id in the HTML.

        TO ADD MORE PHOTOS TO THE FLOATING WINDOW:
        Add image paths to the "images" array. Each path
        becomes a photo in the modal gallery. Example:
        images: [
          'photos/main-shot.png',
          'photos/mobile-view.png',
          'photos/another-angle.png',
        ]
  ================================================ */
  const PROJECT_DATA = [
    {
      id: 0,
      title: 'Modern Portfolio Template',
      shortDesc: 'A modern, responsive portfolio template for showcasing work and skills.',
      // 🔧 EDIT: Full description shown inside the case study modal
      fullDesc: 'A modern, responsive portfolio template for showcasing work and skills — clean layout, smooth animations, mobile-first. Built with vanilla HTML, CSS, and JavaScript. Features include scroll-triggered animations, a typewriter effect, dark/light theme toggle, and a fully functional contact form.',
      // 🔧 EDIT: Technologies used in this project
      technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
      // 🔧 EDIT: Add photos for the floating window — each path is one image in the gallery
      images: [
        'photos/template1/1.png', 'photos/template1/2.png', 'photos/template1/3.png', 'photos/template1/4.png', 'photos/template1/6.png', 'photos/template1/7.png' 
      ],
      // 🔧 EDIT: Link to live project or repository (set to '#' if none)
      link: 'https://portfolio-template-rho-dusky.vercel.app',
    },
    {
      id: 1,
      title: 'Apex Sports — Prototype',
      shortDesc: 'Prototype website for browsing sports equipment.',
      // 🔧 EDIT: Full description shown inside the case study modal
      fullDesc: 'Prototype website where users browse and learn about different sports equipment. Focused on clean UX, fast load times, and a responsive layout that works across all devices.',
      // 🔧 EDIT: Technologies used in this project
      technologies: ['HTML', 'CSS', 'JS', 'Responsive Design'],
      // 🔧 EDIT: Add photos for the floating window — each path is one image in the gallery
      images: [
        'photos/apex/apex.png',
        'photos/apex/apexlanding.png',
        'photos/apex/apexlogin.png',
      ],
      // 🔧 EDIT: Link to live project or repository
      link: 'https://playertwo08.github.io/Apex/',
    },
    {
      id: 2,
      // 🔧 EDIT: Change project title below
      title: 'Techmplate — Side Project Template',
      shortDesc: 'Techy website template side project template for showcasing your work and skills.',
      // 🔧 EDIT: Full description shown inside the case study modal
      fullDesc: 'A Modern, techy side project template for showcasing your work and skills — clean layout, smooth animations, mobile-first.',
      // 🔧 EDIT: Technologies used in this project
      technologies: ['HTML', 'CSS', 'JavaScript'],
      // 🔧 EDIT: Add photos for the floating window — each path is one image in the gallery
      images: [
        'photos/template2/1.png','photos/template2/2.png', 'photos/template2/3.png', 'photos/template2/4.png', 'photos/template2/4.1.png', 'photos/template2/5.png', 'photos/template2/5.1.png', 'photos/template2/5.2.png', 'photos/template2/6.png', 'photos/template2/7.png'],
      // 🔧 EDIT: Link to live project or repository (set to '#' if none)
      link: 'https://playertwo08.github.io/techmplate/',
    },
    {
      id: 3,
      // 🔧 EDIT: Change project title below
      title: 'StudyWB',
      shortDesc: 'A web-based study platform for students to organize and track their learning.',
      // 🔧 EDIT: Full description shown inside the case study modal
      fullDesc: 'A web-based study platform for students to organize and track their learning. It features a clean interface, intuitive navigation, and a variety of tools to enhance the study experience.',
      // 🔧 EDIT: Technologies used in this project
      technologies: ['HTML', 'CSS', 'JavaScript'],
      // 🔧 EDIT: Add photos for the floating window — each path is one image in the gallery
      images: [
        'photos/studywb/1.png',
        'photos/studywb/2.png',
        'photos/studywb/3.png',
        'photos/studywb/4.png',
        'photos/studywb/5.png',
        'photos/studywb/6.png',
        'photos/studywb/7.png',
        'photos/studywb/8.png',
      ],
      // 🔧 EDIT: Link to live project or repository
      link: '#',
    },
  ];


  
  const caseStudyModal   = document.getElementById('caseStudyModal');
  const modalGalleryMain = document.getElementById('modalGalleryMain');
  const modalGallery     = document.getElementById('modalGallery');
  const modalTitle       = document.getElementById('modalTitle');
  const modalMeta        = document.getElementById('modalMeta');
  const modalDesc        = document.getElementById('modalDesc');
  const modalTech        = document.getElementById('modalTech');
  const modalLink        = document.getElementById('modalLink');
  const modalCloseBtns   = document.querySelectorAll('.modal-close');

  // Open modal when a case study button is clicked
  document.querySelectorAll('.js-case-study-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = parseInt(btn.getAttribute('data-project-id'));
      const project = PROJECT_DATA.find(p => p.id === projectId);
      if (!project) return;

      openCaseStudy(project);
    });
  });

  function openCaseStudy(project) {
    if (!caseStudyModal) return;

    // Main image + thumbnail strip gallery
    if (modalGalleryMain) {
      modalGalleryMain.src = project.images[0];
      modalGalleryMain.alt = project.title + ' screenshot';
    }

    if (modalGallery) {
      modalGallery.innerHTML = project.images.map((src, i) =>
        `<img src="${src}" alt="${project.title} screenshot ${i + 1}" loading="lazy"
              data-gallery-index="${i}" class="${i === 0 ? 'is-selected' : ''}" />`
      ).join('');

      // Click thumbnail → swap main image
      modalGallery.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
          if (modalGalleryMain) modalGalleryMain.src = img.src;
          modalGallery.querySelectorAll('img').forEach(im => im.classList.remove('is-selected'));
          img.classList.add('is-selected');
        });
      });
    }

    // Populate info
    modalTitle.textContent = project.title;
    modalMeta.textContent = project.technologies.join(' · ');
    modalDesc.textContent = project.fullDesc;

    // Tech tags
    modalTech.innerHTML = project.technologies.map(tech =>
      `<span class="tag">${tech}</span>`
    ).join('');

    // External link — 🔧 EDIT: Set link in PROJECT_DATA to your live URL
    modalLink.href = project.link;
    if (project.link && project.link !== '#') {
      modalLink.style.display = 'inline-flex';
      modalLink.style.pointerEvents = 'auto';
      modalLink.style.opacity = '1';
    } else {
      modalLink.style.display = 'inline-flex';
      modalLink.style.pointerEvents = 'none';
      modalLink.style.opacity = '0.4';
      modalLink.title = 'No live link set — edit link in PROJECT_DATA';
    }

    // Show modal
    caseStudyModal.classList.add('open');
    caseStudyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  // Close buttons (×)
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close on overlay click (click outside the window)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // Click anywhere on project card → open case study (skip if clicking a link/button)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const btn = card.querySelector('.js-case-study-btn');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
  });

  // Click anywhere on pricing card → open pricing modal (skip if clicking a link/button)
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const btn = card.querySelector('.js-view-samples-btn');
      if (btn) {
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    });
  });


  /* ================================================
     9. PRICING MODAL — View Samples + Purchase
     Opens when "View Samples" is clicked on a
     pricing card. Shows related projects and,
     for Website, templates available for sale.
  ================================================ */
  const pricingModal            = document.getElementById('pricingModal');
  const pricingModalTitle       = document.getElementById('pricingModalTitle');
  const pricingModalDesc        = document.getElementById('pricingModalDesc');
  const pricingProjectsSection  = document.getElementById('pricingProjectsSection');
  const pricingModalProjects    = document.getElementById('pricingModalProjects');
  const stayTunedMsg            = document.getElementById('stayTunedMsg');
  const tiktokSection           = document.getElementById('tiktokSection');
  const tiktokLink              = document.getElementById('tiktokLink');
  const templatesSection        = document.getElementById('templatesSection');
  const templatesGrid           = document.getElementById('templatesGrid');
  const purchaseFormWrapper     = document.getElementById('purchaseFormWrapper');
  const purchaseForm            = document.getElementById('purchaseForm');
  const purchaseTemplate        = document.getElementById('purchaseTemplate');
  const purchasePrice           = document.getElementById('purchasePrice');
  const purchaseSubject         = document.getElementById('purchaseSubject');

  // Template modal elements (separate from case study modal)
  const templateModal           = document.getElementById('templateModal');
  const tmplGalleryMain         = document.getElementById('tmplGalleryMain');
  const tmplGallery             = document.getElementById('tmplGallery');
  const tmplTitle               = document.getElementById('tmplTitle');
  const tmplMeta                = document.getElementById('tmplMeta');
  const tmplDesc                = document.getElementById('tmplDesc');
  const tmplTech                = document.getElementById('tmplTech');
  const tmplPurchaseBtn         = document.getElementById('tmplPurchaseBtn');

  // 🔧 EDIT: Templates available for sale — shown in the Website pricing modal
  //         Each template needs: name, price, image, description
  //         🔧 EDIT: Fill fullDesc, images[], and features[] for the floating window
  //         When a client clicks "Buy Now", a purchase email is sent to ijs.toribio.tech@gmail.com
  const TEMPLATES = [
    {
      name: 'Modern Portfolio Template',
      price: '$150',
      image: 'photos/template1/1.png',
      description: 'Clean, modern portfolio template with dark/light mode.',
      // 🔧 EDIT: Full description shown in the floating window
      fullDesc: 'A clean, modern portfolio template built for showcasing your work. Features dark/light mode toggle, smooth scroll animations, a working contact form, and fully responsive design.',
      // 🔧 EDIT: Add gallery images for the floating window
      images: ['photos/template1/1.png', 'photos/template1/2.png', 'photos/template1/3.png', 'photos/template1/4.png', 'photos/template1/6.png', 'photos/template1/7.png'], 
      // 🔧 EDIT: Features shown as tags in the floating window
      features: ['Dark/Light Mode', 'Responsive', 'Contact Form', 'Animations'],
    },
    {
      name: 'Techmplate',
      price: '$150',
      image: 'photos/template2/1.png',
      description: 'Clean, techy, modern responsive template with dark/light mode.',
      // 🔧 EDIT: Full description shown in the floating window
      fullDesc: 'A tech-focused, modern responsive template. Clean code, fast load times, and a sleek design perfect for startups and tech companies.',
      // 🔧 EDIT: Add gallery images for the floating window
      images: ['photos/template2/1.png', 'photos/template2/2.png', 'photos/template2/3.png', 'photos/template2/4.png', 'photos/template2/4.1.png', 'photos/template2/5.png', 'photos/template2/5.1.png', 'photos/template2/5.2.png', 'photos/template2/6.png', 'photos/template2/7.png'],
      // 🔧 EDIT: Features shown as tags in the floating window
      features: ['Dark/Light Mode', 'Responsive', 'SEO Ready', 'Fast Load'],
    },
    {
      name: 'Study WB',
      price: '$250',
      image: 'photos/studywb/1.png',
      description: 'Full working website that helps students focus and learn effectively.',
      // 🔧 EDIT: Full description shown in the floating window
      fullDesc: 'A full working study website designed to help students focus, organize tasks, and learn effectively. Includes a Pomodoro timer, note-taking area, and resource library.',
      // 🔧 EDIT: Add gallery images for the floating window
      images: ['photos/studywb/1.png', 'photos/studywb/2.png', 'photos/studywb/3.png', 'photos/studywb/4.png', 'photos/studywb/5.png', 'photos/studywb/6.png', 'photos/studywb/7.png', 'photos/studywb/8.png'],
      // 🔧 EDIT: Features shown as tags in the floating window
      features: ['Pomodoro Timer', 'Notes', 'Resources', 'Responsive'],
    },
    // 🔧 EDIT: Add more templates here — copy the object above and edit
  ];

  // 🔧 EDIT: Category descriptions shown in the pricing modal
  const CATEGORY_INFO = {
    website: {
      title: 'Website Design & Development',
      desc: 'Browse past website projects and ready-made templates available for purchase.',
    },
    automation: {
      title: 'AI Automation Projects',
      desc: 'Custom chatbots, workflow automation, and data processing — new projects coming soon.',
    },
    tutorial: {
      title: 'Tutorial & Coaching',
      desc: 'Check out my TikTok tutorials for coding tips, or book a 1-on-1 session.',
    },
  };

  // Open pricing modal on "View Samples" click
  document.querySelectorAll('.js-view-samples-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-category');
      openPricingModal(category);
    });
  });

  function openPricingModal(category) {
    if (!pricingModal) return;
    const info = CATEGORY_INFO[category] || CATEGORY_INFO.website;

    if (pricingModalTitle) pricingModalTitle.textContent = info.title;
    if (pricingModalDesc) pricingModalDesc.textContent = info.desc;

    // Reset all special sections
    if (pricingProjectsSection) pricingProjectsSection.style.display = 'none';
    if (stayTunedMsg) stayTunedMsg.style.display = 'none';
    if (tiktokSection) tiktokSection.style.display = 'none';
    if (templatesSection) templatesSection.style.display = 'none';
    if (purchaseFormWrapper) purchaseFormWrapper.style.display = 'none';

    if (category === 'website') {
      // Show related projects
      if (pricingProjectsSection) pricingProjectsSection.style.display = 'block';
      if (pricingModalProjects) {
        pricingModalProjects.innerHTML = PROJECT_DATA.map(project =>
          `<div class="pricing-project-thumb">
            <img src="${project.images[0]}" alt="${project.title}" loading="lazy" />
            <div class="pricing-project-thumb-info">
              <h4>${project.title}</h4>
              <p>${project.technologies.join(' · ')}</p>
            </div>
          </div>`
        ).join('');

        // Click any project thumb → close pricing modal → open case study
        pricingModalProjects.querySelectorAll('.pricing-project-thumb').forEach((thumb, i) => {
          thumb.addEventListener('click', () => {
            closeAllModals();
            setTimeout(() => openCaseStudy(PROJECT_DATA[i]), 250);
          });
        });
      }
      // Show templates
      if (templatesSection) templatesSection.style.display = 'block';
      renderTemplates();
    } else if (category === 'automation') {
      if (stayTunedMsg) stayTunedMsg.style.display = 'block';
    } else if (category === 'tutorial') {
      if (tiktokSection) tiktokSection.style.display = 'block';
    }

    // Show modal
    pricingModal.classList.add('open');
    pricingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /* Separate floating window for templates — fully independent from project modal */
  function openTemplateModal(tpl) {
    if (!templateModal) return;

    // Gallery
    if (tmplGalleryMain) {
      tmplGalleryMain.src = tpl.images && tpl.images.length ? tpl.images[0] : tpl.image;
      tmplGalleryMain.alt = tpl.name + ' preview';
    }

    if (tmplGallery) {
      const galleryImgs = tpl.images && tpl.images.length ? tpl.images : [tpl.image];
      tmplGallery.innerHTML = galleryImgs.map((src, i) =>
        `<img src="${src}" alt="${tpl.name} preview ${i + 1}" loading="lazy"
              data-gallery-index="${i}" class="${i === 0 ? 'is-selected' : ''}" />`
      ).join('');

      tmplGallery.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
          if (tmplGalleryMain) tmplGalleryMain.src = img.src;
          tmplGallery.querySelectorAll('img').forEach(im => im.classList.remove('is-selected'));
          img.classList.add('is-selected');
        });
      });
    }

    // Content
    if (tmplTitle) tmplTitle.textContent = tpl.name;
    if (tmplMeta) tmplMeta.textContent = tpl.price;
    if (tmplDesc) tmplDesc.textContent = tpl.fullDesc || tpl.description;
    if (tmplTech) {
      tmplTech.innerHTML = (tpl.features || []).map(f =>
        `<span class="tag">${f}</span>`
      ).join('');
    }

    // Purchase button → close template modal → open pricing modal with pre-filled form
    if (tmplPurchaseBtn) {
      tmplPurchaseBtn.onclick = () => {
        const templateIndex = TEMPLATES.indexOf(tpl);
        closeAllModals();
        setTimeout(() => {
          openPricingModal('website');
          setTimeout(() => {
            const tplData = TEMPLATES[templateIndex];
            purchaseTemplate.value = tplData.name;
            purchasePrice.value = tplData.price;
            purchaseSubject.value = `Purchase Request: ${tplData.name} (${tplData.price})`;
            if (purchaseFormWrapper) {
              purchaseFormWrapper.style.display = 'block';
              purchaseFormWrapper.scrollIntoView({ behavior: 'smooth' });
            }
          }, 350);
        }, 250);
      };
    }

    // Show modal
    templateModal.classList.add('open');
    templateModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderTemplates() {
    templatesGrid.innerHTML = TEMPLATES.map((tpl, i) =>
      `<div class="template-card">
        <img src="${tpl.image}" alt="${tpl.name}" loading="lazy" />
        <div class="template-card-info">
          <h4>${tpl.name}</h4>
          <span class="template-price">${tpl.price}</span>
          <p>${tpl.description}</p>
          <button class="btn btn--primary btn--small js-buy-template" data-template-index="${i}">Buy Now</button>
        </div>
      </div>`
    ).join('');

    // Click anywhere on template card → open template floating window
    templatesGrid.querySelectorAll('.template-card').forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        closeAllModals();
        setTimeout(() => openTemplateModal(TEMPLATES[i]), 250);
      });
    });

    // "Buy Now" click — show purchase form
    document.querySelectorAll('.js-buy-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-template-index'));
        const tpl = TEMPLATES[index];
        purchaseTemplate.value = tpl.name;
        purchasePrice.value = tpl.price;
        purchaseSubject.value = `Purchase Request: ${tpl.name} (${tpl.price})`;
        purchaseFormWrapper.style.display = 'block';
        purchaseFormWrapper.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Cancel purchase button
  document.querySelectorAll('.cancel-purchase').forEach(btn => {
    btn.addEventListener('click', () => {
      purchaseFormWrapper.style.display = 'none';
      purchaseForm.reset();
    });
  });

  // 🔧 EDIT: Purchase form submission — sends email to ijs.toribio.tech@gmail.com via Formspree
  if (purchaseForm) {
    purchaseForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name  = document.getElementById('purchaseName').value.trim();
      const email = document.getElementById('purchaseEmail').value.trim();
      const msg   = document.getElementById('purchaseMessage').value.trim();

      if (!name || !email) {
        alert('Please fill in your name and email.');
        return;
      }

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            template: purchaseTemplate.value,
            price: purchasePrice.value,
            message: msg,
            _subject: purchaseSubject.value,
          }),
        });

        if (response.ok) {
          alert('Purchase request sent! I\'ll get back to you shortly.');
          purchaseFormWrapper.style.display = 'none';
          purchaseForm.reset();
          closeAllModals();
        } else {
          alert('Something went wrong. Please try again or email me directly at ijs.toribio.tech@gmail.com.');
        }
      } catch (err) {
        console.error('Purchase form error:', err);
        alert('Network error. Please email me directly at ijs.toribio.tech@gmail.com.');
      }
    });
  }


  /* ================================================
     10. THEME TOGGLE — Dark / Light mode
     🔧 EDIT: Adjust light theme colors in style.css
        (search "[data-theme="light"]")
  ================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme or fall back to system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
  }

  // Update aria-label based on current theme
  function updateThemeLabel() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  updateThemeLabel();

  // Toggle on click with smooth transition
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    // Add transition class for smooth color fade
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeLabel();

    // Remove transition class after animation completes
    setTimeout(() => html.classList.remove('theme-transitioning'), 500);
  });


  /* ================================================
     11. CONTACT FORM
     ------------------------------------------------
     HOW TO MAKE THIS WORK (choose one):

     OPTION A — Formspree (easiest, free):
     1. Go to https://formspree.io and create an account
     2. Create a new form, copy the endpoint URL
     3. Replace FORMSPREE_ENDPOINT below with your URL
        e.g. 'https://formspree.io/f/xyzabc12'
     4. Done! Formspree handles email delivery.

     OPTION B — EmailJS (free, no server):
     1. Go to https://www.emailjs.com and create an account
     2. Set up an email service + template
     3. Replace the fetch() call below with EmailJS SDK call
        (see https://www.emailjs.com/docs/)

     OPTION C — Your own backend:
     Replace the fetch() call with your own API endpoint.
  ================================================ */

  // 🔧 EDIT: Emails sent to ijs.toribio.tech@gmail.com via Formspree
  // Formspree endpoint — already connected to your email (defined at top of file)

  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className   = 'form-status error';
        return;
      }

      if (!isValidEmail(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className   = 'form-status error';
        return;
      }

      // Loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;
      formStatus.textContent = '';
      formStatus.className   = 'form-status';

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':        'application/json',
          },
          body: JSON.stringify({
            name:    name,
            email:   email,
            service: form.service ? form.service.value : '',
            message: message,
          }),
        });

        if (response.ok) {
          // SUCCESS
          formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formStatus.className   = 'form-status success';
          form.reset();
        } else {
          // SERVER ERROR
          formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
          formStatus.className   = 'form-status error';
        }
      } catch (err) {
        // NETWORK ERROR (or Formspree endpoint not configured yet)
        console.error('Form submission error:', err);
        formStatus.textContent = 'Network error. Please check your connection or email me directly.';
        formStatus.className   = 'form-status error';
      } finally {
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled    = false;
      }
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ================================================
     BONUS: Smooth scroll offset for fixed nav
     🔧 EDIT: OFFSET_PX — adjust if nav height changes
  ================================================ */
  const OFFSET_PX = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) { e.preventDefault(); return; } // stop href="#" from scrolling to top
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET_PX;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

}); // end DOMContentLoaded
