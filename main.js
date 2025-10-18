/* =========================================================
   Reed Solutions, LLC - Global JavaScript
   Author: Reed Solutions Web Team
   Last Updated: 2025-10-17
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile Menu Toggle ---------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar ul");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("open");
    });
  }

  /* ---------- Sticky Header on Scroll ---------- */
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  /* ---------- Smooth Scroll for Navigation Links ---------- */
  const navLinks = document.querySelectorAll(".navbar a[href^='#']");
  for (let link of navLinks) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      navMenu.classList.remove("active");
      menuToggle?.classList.remove("open");
    });
  }

  /* ---------- Highlight Active Nav Link ---------- */
  const currentPage = window.location.pathname.split("/").pop();
  const navItems = document.querySelectorAll(".navbar a");

  navItems.forEach((link) => {
    if (link.getAttribute("href").includes(currentPage)) {
      link.classList.add("active");
    }
  });

  /* ---------- Scroll to Top Button ---------- */
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "scroll-top";
  scrollTopBtn.innerHTML = "&#8679;";
  document.body.appendChild(scrollTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Simple Fade-in Animations ---------- */
  const fadeElements = document.querySelectorAll(".fade-in");
  const appearOptions = { threshold: 0.2 };
  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("appear");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  fadeElements.forEach((el) => appearOnScroll.observe(el));

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.querySelector("form.contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const name = contactForm.querySelector("[name='name']");
      const email = contactForm.querySelector("[name='email']");
      const message = contactForm.querySelector("[name='message']");

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        alert("Please fill out all fields before submitting.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        return;
      }
    });
  }

  /* ---------- Dynamic Year in Footer ---------- */
  const yearSpan = document.querySelector(".current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
