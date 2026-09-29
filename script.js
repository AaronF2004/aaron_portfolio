/* ================= MOBILE MENU ================= */

const menuIcon = document.getElementById("menuIcon");

const navLinks = document.getElementById("navLinks");

menuIcon.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const icon = menuIcon.querySelector("i");

    if (navLinks.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* ================= CLOSE MOBILE MENU ================= */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuIcon.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= TYPING EFFECT ================= */

const typingText =
    document.getElementById("typing-text");

const words = [
    "digital experiences.",
    "full-stack applications.",
    "responsive websites.",
    "creative solutions."
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;


function typeEffect() {

    const currentWord =
        words[wordIndex];


    if (!deleting) {

        typingText.textContent =
            currentWord.substring(
                0,
                charIndex + 1
            );

        charIndex++;


        if (charIndex === currentWord.length) {

            deleting = true;

            setTimeout(
                typeEffect,
                1500
            );

            return;

        }

    } else {

        typingText.textContent =
            currentWord.substring(
                0,
                charIndex - 1
            );

        charIndex--;


        if (charIndex === 0) {

            deleting = false;

            wordIndex++;


            if (wordIndex === words.length) {

                wordIndex = 0;

            }

        }

    }


    setTimeout(
        typeEffect,
        deleting ? 55 : 85
    );

}

typeEffect();


/* ================= READ MORE ================= */

const readMoreBtn =
    document.getElementById("readMoreBtn");

const moreAbout =
    document.getElementById("moreAbout");


readMoreBtn.addEventListener("click", () => {

    const isOpen =
        moreAbout.style.display === "block";


    if (isOpen) {

        moreAbout.style.display = "none";

        readMoreBtn.innerHTML =
            'Read More <i class="fa-solid fa-plus"></i>';

        readMoreBtn.classList.remove("open");

    } else {

        moreAbout.style.display = "block";

        readMoreBtn.innerHTML =
            'Read Less <i class="fa-solid fa-plus"></i>';

        readMoreBtn.classList.add("open");

    }

});


/* ================= CONTACT FORM ================= */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("form-message");


contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const phone =
            document.getElementById("phone")
                .value.trim();

        const subject =
            document.getElementById("subject")
                .value.trim();

        const message =
            document.getElementById("message")
                .value.trim();


        /* EMPTY FIELD CHECK */

        if (
            !name ||
            !email ||
            !phone ||
            !subject ||
            !message
        ) {

            formMessage.textContent =
                "Please fill all the fields.";

            formMessage.style.color =
                "#ff9ab9";

            return;

        }


        /* EMAIL VALIDATION */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            formMessage.textContent =
                "Please enter a valid email address.";

            formMessage.style.color =
                "#ff9ab9";

            return;

        }


        /* SUCCESS */

        formMessage.textContent =
            "Thank you! Your message has been submitted successfully.";

        formMessage.style.color =
            "#9ff0bd";


        contactForm.reset();


        setTimeout(() => {

            formMessage.textContent = "";

        }, 5000);

    }

);


/* ================= SCROLL REVEAL ================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* ================= NAVBAR + ACTIVE LINK + UP ARROW ================= */

const scrollUp =
    document.getElementById("scrollUp");

const navbar =
    document.querySelector(".navbar");

const sections =
    document.querySelectorAll("section[id]");

const navItems =
    document.querySelectorAll(".nav-links a");


window.addEventListener("scroll", () => {


    /* NAVBAR */

    if (window.scrollY > 40) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }


    /* UP ARROW */

    if (window.scrollY >= 500) {

        scrollUp.style.display = "flex";

    } else {

        scrollUp.style.display = "none";

    }


    /* ACTIVE SECTION */

    let currentSection = "home";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* ================= ARROW CLICK ================= */

scrollUp.addEventListener("click", event => {

    event.preventDefault();


    document.getElementById("home")
        .scrollIntoView({

            behavior: "smooth"

        });

});


/* ================= INITIAL NAV LINK ================= */

document
    .querySelector('.nav-links a[href="#home"]')
    .classList.add("active");


/* ================= CREATIVE CURSOR ================= */

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;


document.addEventListener("mousemove", event => {

    mouseX = event.clientX;
    mouseY = event.clientY;


    cursorDot.style.left =
        mouseX + "px";

    cursorDot.style.top =
        mouseY + "px";

});


function animateCursor() {

    ringX +=
        (mouseX - ringX) * 0.15;

    ringY +=
        (mouseY - ringY) * 0.15;


    cursorRing.style.left =
        ringX + "px";

    cursorRing.style.top =
        ringY + "px";


    requestAnimationFrame(
        animateCursor
    );

}

animateCursor();


/* ================= CURSOR HOVER EFFECT ================= */

const cursorTargets =
    document.querySelectorAll(
        "a, button, .stack-item, .project-card, .social-icons a, .contact-card"
    );


cursorTargets.forEach(element => {

    element.addEventListener(
        "mouseenter",
        () => {

            cursorDot.classList.add("hover");

            cursorRing.classList.add("hover");

        }
    );


    element.addEventListener(
        "mouseleave",
        () => {

            cursorDot.classList.remove("hover");

            cursorRing.classList.remove("hover");

        }
    );

});