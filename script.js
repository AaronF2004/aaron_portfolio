/* ================= MOBILE MENU ================= */
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
    menuIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close mobile menu on nav link click
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    });
}

/* ================= TYPING EFFECT ================= */
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

/* ================= READ MORE ACCORDION ================= */
const readMoreBtn = document.getElementById("readMoreBtn");
const moreAbout = document.getElementById("moreAbout");

if (readMoreBtn && moreAbout) {
    readMoreBtn.addEventListener("click", () => {
        const isOpen = moreAbout.classList.toggle("open");
        readMoreBtn.classList.toggle("open", isOpen);

        readMoreBtn.innerHTML = isOpen
            ? '<span>Read Less</span> <i class="fa-solid fa-minus"></i>'
            : '<span>Read More</span> <i class="fa-solid fa-plus"></i>';
    });
}

/* ================= CONTACT FORM (BREVO VERCEL API) ================= */
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

        // Disable button during submit
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

/* ================= SCROLL REVEAL OBSERVER ================= */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("show"));
}

/* ================= OPTIMIZED SCROLL EVENTS ================= */
const scrollUp = document.getElementById("scrollUp");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

let isScrolling = false;

window.addEventListener("scroll", () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;

            // Scrolled Navbar background
            if (navbar) {
                navbar.classList.toggle("scrolled", scrollPos > 50);
            }

            // Up Arrow Toggle
            if (scrollUp) {
                scrollUp.style.display = scrollPos >= 450 ? "flex" : "none";
            }

            // Active section indicator
            let currentSection = "home";
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 160;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute("id");
                }
            });

            navItems.forEach(link => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${currentSection}`
                );
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Smooth Scroll to Top
if (scrollUp) {
    scrollUp.addEventListener("click", event => {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ================= DESKTOP CUSTOM CURSOR ================= */
const isPointerFine = window.matchMedia("(pointer: fine)").matches;
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (isPointerFine && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const cursorTargets = document.querySelectorAll(
        "a, button, .stack-item, .project-card, .social-icons a, .contact-card"
    );

    cursorTargets.forEach(element => {
        element.addEventListener("mouseenter", () => {
            cursorDot.classList.add("hover");
            cursorRing.classList.add("hover");
        });

        element.addEventListener("mouseleave", () => {
            cursorDot.classList.remove("hover");
            cursorRing.classList.remove("hover");
        });
    });
} else {
    if (cursorDot) cursorDot.style.display = "none";
    if (cursorRing) cursorRing.style.display = "none";
}