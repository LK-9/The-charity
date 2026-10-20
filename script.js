// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    const iconHam = menuToggle.querySelector(".icon-hamburger");
    const iconClose = menuToggle.querySelector(".icon-close");

    function setMenuState(isOpen) {
      if (isOpen) {
        navMenu.classList.add("active");
        menuToggle.classList.add("is-active");
        menuToggle.setAttribute("aria-expanded", "true");
        if (iconHam) iconHam.style.display = "none";
        if (iconClose) iconClose.style.display = "block";
      } else {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
        if (iconHam) iconHam.style.display = "block";
        if (iconClose) iconClose.style.display = "none";
      }
    }

    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains("active");
      setMenuState(!isOpen);
    });

    // Close when clicking outside of nav
    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("active")) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          setMenuState(false);
        }
      }
    });

    // Close when any link inside menu is clicked
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        setMenuState(false);
      }
    });

    // Reset when resizing to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
        setMenuState(false);
      }
    });
  }
});

// Telegram Mini App Initialization
if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
  try {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  } catch (err) {
    console.warn("Telegram WebApp init failed:", err);
  }
}

