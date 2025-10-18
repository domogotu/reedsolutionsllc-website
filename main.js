/* ==========================================================
   Reed Solutions, LLC — Main JavaScript
   Author: Reed Solutions Web Division
   Version: 1.0.0
   Updated: October 2025
   ========================================================== */

/* ---------- NAVIGATION TOGGLE (Mobile) ---------- */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav ul");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("active");
  });
}

/* ---------- SMOOTH SCROLLING ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth"
      });
    }
  });
});

/* ---------- SCROLL TO TOP BUTTON ---------- */
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "↑";
scrollBtn.classList.add("scroll-top");
document.body.appendChild(scrollBtn);

scrollBtn.style.display = "none";
scrollBtn.style.position = "fixed";
scrollBtn.style.bottom = "30px";
scrollBtn.style.right = "30px";
scrollBtn.style.backgroundColor = "#2ecc71";
scrollBtn.style.color = "#fff";
scrollBtn.style.border = "none";
scrollBtn.style.padding = "10px 15px";
scrollBtn.style.borderRadius = "8px";
scrollBtn.style.cursor = "pointer";
scrollBtn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
scrollBtn.style.zIndex = "999";

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- INTERSECTION OBSERVER ANIMATIONS ---------- */
const observerOptions = {
  threshold: 0.2
};

const animateOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(animateOnScroll, observerOptions);

document.querySelectorAll(".card, section").forEach(section => {
  observer.observe(section);
});

/* ---------- FORM HANDLING (Contact) ---------- */
const contactForm = document.querySelector("form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("✅ Message sent successfully! We’ll get back to you soon.");
        contactForm.reset();
      } else {
        alert("⚠️ There was an issue sending your message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("❌ Network error. Please check your internet connection.");
    }
  });
}

/* ---------- VISUAL EFFECTS ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in");

  fadeEls.forEach((el, index) => {
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.transition = "opacity 1s ease";
      el.style.opacity = 1;
    }, 300 * index);
  });
});
