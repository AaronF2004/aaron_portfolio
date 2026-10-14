/* ================= REGISTER GSAP PLUGINS ================= */
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    /* ================= 1. LENIS SMOOTH SCROLLING ================= */
    let lenis = null;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }

    /* ================= 2. TOP SCROLL PROGRESS BAR ================= */
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        gsap.to(progressBar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    const isPointerFine = window.matchMedia("(pointer: fine)").matches;

    /* ================= 3. CUSTOM ELASTIC CURSOR (GSAP QUICKTO) ================= */
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");

    if (isPointerFine && cursorDot && cursorRing) {
        const setDotX = gsap.quickTo(cursorDot, "x", { duration: 0.05, ease: "power3" });
        const setDotY = gsap.quickTo(cursorDot, "y", { duration: 0.05, ease: "power3" });
        const setRingX = gsap.quickTo(cursorRing, "x", { duration: 0.22, ease: "power3" });
        const setRingY = gsap.quickTo(cursorRing, "y", { duration: 0.22, ease: "power3" });

        window.addEventListener("mousemove", (e) => {
            setDotX(e.clientX);
            setDotY(e.clientY);
            setRingX(e.clientX);
            setRingY(e.clientY);
        });

        const hoverTargets = document.querySelectorAll(
            "a, button, .stack-item, .project-card, .cert-card, .contact-card"
        );
        hoverTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => {
                cursorRing.classList.add("hover");
                cursorDot.classList.add("hover");
            });
            target.addEventListener("mouseleave", () => {
                cursorRing.classList.remove("hover");
                cursorDot.classList.remove("hover");
            });
        });
    } else {
        if (cursorDot) cursorDot.style.display = "none";
        if (cursorRing) cursorRing.style.display = "none";
    }

    /* ================= 4. HERO ENTRANCE TIMELINE ================= */
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });

    heroTl
        .from(".navbar", {
            y: -80,
            opacity: 0,
            duration: 1
        })
        .from(".hello-badge", {
            scale: 0.75,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.8)"
        }, "-=0.4")
        .from(".home-content h3, .home-content h1, .home-content h2, .home-content p", {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12
        }, "-=0.3")
        .from(".social-icons a", {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(2)"
        }, "-=0.4")
        .from(".hero-buttons .btn", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.4")
        .from(".hero-stats div", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.4")
        .from(".home-image-wrap", {
            scale: 0.85,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out"
        }, "-=1.2");

    /* ================= 5. HERO IMAGE 3D PARALLAX PERSPECTIVE ================= */
    const heroWrap = document.querySelector(".home");
    const heroImageWrap = document.querySelector(".home-image-wrap");

    if (heroWrap && heroImageWrap && isPointerFine) {
        const setTiltX = gsap.quickTo(heroImageWrap, "rotationX", { duration: 0.6, ease: "power2.out" });
        const setTiltY = gsap.quickTo(heroImageWrap, "rotationY", { duration: 0.6, ease: "power2.out" });

        heroWrap.addEventListener("mousemove", (e) => {
            const rect = heroWrap.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            setTiltX(-relY * 12);
            setTiltY(relX * 12);
        });

        heroWrap.addEventListener("mouseleave", () => {
            setTiltX(0);
            setTiltY(0);
        });
    }

    /* ================= 6. SCROLL-TRIGGERED STAT COUNTERS ================= */
    ScrollTrigger.create({
        trigger: ".hero-stats",
        start: "top 88%",
        once: true,
        onEnter: () => {
            document.querySelectorAll(".hero-stats strong").forEach((stat) => {
                const rawText = stat.textContent.trim();
                const targetValue = parseInt(rawText, 10);
                const suffix = rawText.replace(/^[0-9]+/, "");

                const counterObj = { val: 0 };
                gsap.to(counterObj, {
                    val: targetValue,
                    duration: 1.8,
                    ease: "power2.out",
                    onUpdate: () => {
                        stat.textContent = Math.floor(counterObj.val) + suffix;
                    }
                });
            });
        }
    });

    /* ================= 7. SECTION REVEALS & BATCH ANIMATIONS ================= */
    const sectionsToReveal = [
        ".about-container",
        ".stack-container",
        ".projects-container",
        ".certificates-container",
        ".contact-container"
    ];

    sectionsToReveal.forEach((secSelector) => {
        const sec = document.querySelector(secSelector);
        if (!sec) return;

        gsap.from(sec.querySelectorAll(".eyebrow, .section-title, .section-subtitle, .about-content"), {
            scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                once: true
            },
            y: 40,
            opacity: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out"
        });
    });

    // Tech Stack items cascading pop-in
    ScrollTrigger.batch(".stack-item", {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
            gsap.from(batch, {
                opacity: 0,
                scale: 0.7,
                y: 20,
                stagger: 0.04,
                duration: 0.5,
                ease: "back.out(1.8)"
            });
        }
    });

    // Project and Certificate Cards staggered slide up
    ScrollTrigger.batch(".project-card, .cert-card", {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
            gsap.from(batch, {
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out"
            });
        }
    });

    /* ================= 8. TIMELINE SCRUB PROGRESS (EXPERIENCE) ================= */
    const timelineElement = document.querySelector(".timeline");
    if (timelineElement) {
        const timelineProgressBar = document.createElement("div");
        timelineProgressBar.className = "timeline-progress-bar";
        timelineElement.appendChild(timelineProgressBar);

        gsap.to(timelineProgressBar, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 70%",
                end: "bottom 75%",
                scrub: 0.5
            }
        });

        gsap.utils.toArray(".timeline-item").forEach((item) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 82%",
                    once: true
                },
                x: -30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });
    }

    /* ================= 9. GSAP 3D TILT WITH REALISTIC PERSPECTIVE ================= */
    if (isPointerFine) {
        const tiltCards = document.querySelectorAll(".project-card, .cert-card, .experience-card");

        tiltCards.forEach((card) => {
            const rotX = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power2.out" });
            const rotY = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power2.out" });

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const targetRotX = ((y - centerY) / centerY) * -8;
                const targetRotY = ((x - centerX) / centerX) * 8;

                rotX(targetRotX);
                rotY(targetRotY);
            });

            card.addEventListener("mouseleave", () => {
                rotX(0);
                rotY(0);
                gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
            });
        });

        /* ================= 10. ELASTIC MAGNETIC BUTTONS ================= */
        const magneticButtons = document.querySelectorAll(".hero-buttons .btn");

        magneticButtons.forEach((btn) => {
            const moveX = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
            const moveY = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                moveX(x * 0.35);
                moveY(y * 0.35);
            });

            btn.addEventListener("mouseleave", () => {
                moveX(0);
                moveY(0);
            });
        });
    }

    /* ================= 11. READ MORE ACCORDION ================= */
    const readMoreBtn = document.getElementById("readMoreBtn");
    const moreAbout = document.getElementById("moreAbout");

    if (readMoreBtn && moreAbout) {
        readMoreBtn.addEventListener("click", () => {
            const isOpen = moreAbout.classList.toggle("open");
            readMoreBtn.classList.toggle("open", isOpen);

            readMoreBtn.innerHTML = isOpen
                ? '<span>Read Less</span> <i class="fa-solid fa-minus"></i>'
                : '<span>Read More</span> <i class="fa-solid fa-plus"></i>';

            ScrollTrigger.refresh();
        });
    }

    /* ================= 12. TYPING EFFECT ================= */
    const typingText = document.getElementById("typing-text");
    if (typingText) {
        const words = [
            "full-stack applications.",
            "modern digital experiences.",
            "responsive web architectures.",
            "clean & maintainable code."
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            if (!deleting) {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    deleting = true;
                    setTimeout(typeEffect, 1800);
                    return;
                }
            } else {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(typeEffect, deleting ? 45 : 80);
        }
        typeEffect();
    }

    /* ================= 13. MOBILE MENU ================= */
    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.getElementById("navLinks");

    if (menuIcon && navLinks) {
        const icon = menuIcon.querySelector("i");
        const toggleMenu = () => {
            navLinks.classList.toggle("active");
            if (icon) {
                const isActive = navLinks.classList.contains("active");
                icon.classList.toggle("fa-bars", !isActive);
                icon.classList.toggle("fa-xmark", isActive);
            }
        };

        menuIcon.addEventListener("click", toggleMenu);
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    /* ================= 14. NAVBAR & SCROLL SPY ================= */
    const navbar = document.querySelector(".navbar");
    const scrollUp = document.getElementById("scrollUp");
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        if (navbar) navbar.classList.toggle("scrolled", scrollPos > 50);
        if (scrollUp) scrollUp.style.display = scrollPos >= 450 ? "flex" : "none";

        let currentSection = "home";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
        });
    });

    if (scrollUp) {
        scrollUp.addEventListener("click", (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    /* ================= 15. CONTACT FORM (BREVO API) ================= */
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("form-message");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();
            const subject = document.getElementById("subject")?.value.trim();
            const message = document.getElementById("message")?.value.trim();

            if (!name || !email || !subject || !message) {
                formMessage.textContent = "Please fill in all required fields.";
                formMessage.style.color = "#ff7b72";
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.style.color = "#ff7b72";
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            }

            formMessage.textContent = "Sending message...";
            formMessage.style.color = "#ffffff";

            try {
                const res = await fetch("/api/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });

                if (res.ok) {
                    formMessage.textContent = "Thank you! Your message has been sent successfully.";
                    formMessage.style.color = "#3fb950";
                    contactForm.reset();
                } else {
                    formMessage.textContent = "Failed to send message. Please try again later.";
                    formMessage.style.color = "#ff7b72";
                }
            } catch (err) {
                formMessage.textContent = "An error occurred. Please try again.";
                formMessage.style.color = "#ff7b72";
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
                }
                setTimeout(() => {
                    formMessage.textContent = "";
                }, 6000);
            }
        });
    }
});