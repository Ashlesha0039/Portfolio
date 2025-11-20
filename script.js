const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[data-section]");
const backToTop = document.querySelector(".back-to-top");
const contactForm = document.querySelector("#contact-form");
const animatedName = document.querySelector("#animated-name");

// Animated Name Effect (Typing)
if (animatedName) {
  const name = "Ashlesha Poudell";
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let pauseDelay = 2000;

  function typeName() {
    const currentText = name.substring(0, charIndex);
    animatedName.textContent = currentText;
    animatedName.classList.add("typing");

    if (!isDeleting && charIndex < name.length) {
      charIndex++;
      typingSpeed = 120; // Slightly slower for clarity
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      typingSpeed = 60; // Faster deletion
    }

    if (charIndex === name.length && !isDeleting) {
      isDeleting = true;
      typingSpeed = pauseDelay; // Pause before deleting (full name shown)
    } else if (charIndex === 0 && isDeleting) {
      isDeleting = false;
      typingSpeed = 500; // Pause before typing again
    }

    setTimeout(typeName, typingSpeed);
  }

  // Start typing animation after a delay
  setTimeout(() => {
    typeName();
  }, 500);
}

const toggleNav = () => {
  const isOpen = nav?.classList.toggle("open");
  const expanded = isOpen ? "true" : "false";
  navToggle?.setAttribute("aria-expanded", expanded);
  document.body.classList.toggle("no-scroll", Boolean(isOpen));
};

navToggle?.addEventListener("click", toggleNav);

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  })
);

const observerOptions = {
  root: null,
  threshold: 0.5,
};

const setActiveNavLink = (id) => {
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.replace("#", "");
    if (targetId === id) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setActiveNavLink(entry.target.id);
    }
  });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

if (sections.length) {
  setActiveNavLink(sections[0].id);
}

const handleBackToTopVisibility = () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add("show");
  } else {
    backToTop?.classList.remove("show");
  }
};

window.addEventListener("scroll", handleBackToTopVisibility);

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

handleBackToTopVisibility();

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const showError = (input, message) => {
  const formGroup = input.closest(".form-group");
  if (!formGroup) return;

  let error = formGroup.querySelector(".form-error");
  if (!error) {
    error = document.createElement("p");
    error.className = "form-error";
    formGroup.appendChild(error);
  }
  error.textContent = message;
  input.classList.add("error");
};

const clearError = (input) => {
  const formGroup = input.closest(".form-group");
  if (!formGroup) return;

  const error = formGroup.querySelector(".form-error");
  if (error) {
    error.remove();
  }
  input.classList.remove("error");
};

const validateForm = () => {
  let isValid = true;
  const nameInput = contactForm?.querySelector("#name");
  const emailInput = contactForm?.querySelector("#email");
  const messageInput = contactForm?.querySelector("#message");

  if (!nameInput || !emailInput || !messageInput) {
    return false;
  }

  [nameInput, emailInput, messageInput].forEach(clearError);

  if (!nameInput.value.trim()) {
    showError(nameInput, "Please enter your name.");
    isValid = false;
  }

  if (!emailInput.value.trim()) {
    showError(emailInput, "Please enter your email address.");
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    showError(emailInput, "Please enter a valid email address.");
    isValid = false;
  }

  if (!messageInput.value.trim()) {
    showError(messageInput, "Please share a brief message.");
    isValid = false;
  }

  return isValid;
};

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  const nameValue = contactForm.querySelector("#name").value.trim();
  const emailValue = contactForm.querySelector("#email").value.trim();
  const messageValue = contactForm.querySelector("#message").value.trim();

  const subject = encodeURIComponent(`Portfolio Contact from ${nameValue}`);
  const body = encodeURIComponent(
    `Name: ${nameValue}\nEmail: ${emailValue}\n\nMessage:\n${messageValue}`
  );

  window.location.href = `mailto:ashleshapoudel0039@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

