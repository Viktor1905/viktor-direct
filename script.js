const form = document.getElementById("lead-form");
const status = document.getElementById("form-status");
const modalForm = document.getElementById("lead-form-modal");
const modalStatus = document.getElementById("form-status-modal");
const mobilePhoneCta = document.querySelector(".mobile-phone-cta");
const hero = document.querySelector(".hero");
const contactSection = document.getElementById("contact");
const leadModal = document.getElementById("lead-modal");
const modalCloseElements = document.querySelectorAll("[data-close-modal='true']");

const TELEGRAM_USERNAME = "directviktor";
const SUCCESS_TEXT =
  "Сообщение подготовлено. Если Telegram не открылся автоматически, напишите на @directviktor.";

const buildTelegramMessage = (sourceForm) => {
  const formData = new FormData(sourceForm);
  const name = (formData.get("name") || "").toString().trim();
  const contact = (formData.get("contact") || "").toString().trim();
  const niche = (formData.get("niche") || "").toString().trim();
  const task = (formData.get("task") || "").toString().trim();

  return [
    "Здравствуйте! Хочу обсудить рекламу.",
    `Имя: ${name || "Не указано"}`,
    `Контакт: ${contact || "Не указан"}`,
    `Ниша или сайт: ${niche || "Не указаны"}`,
    `Задача: ${task || "Не указана"}`,
  ].join("\n");
};

const submitLeadForm = (sourceForm, sourceStatus, afterSubmit) => {
  sourceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = buildTelegramMessage(sourceForm);
    const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;

    window.open(telegramUrl, "_blank", "noopener,noreferrer");

    if (sourceStatus) {
      sourceStatus.textContent = SUCCESS_TEXT;
    }

    if (typeof afterSubmit === "function") {
      afterSubmit();
    }
  });
};

const openLeadModal = () => {
  if (!leadModal) return;

  leadModal.classList.add("is-open");
  leadModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLeadModal = () => {
  if (!leadModal) return;

  leadModal.classList.remove("is-open");
  leadModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

if (form) {
  submitLeadForm(form, status);
}

if (modalForm) {
  submitLeadForm(modalForm, modalStatus, () => {
    window.setTimeout(closeLeadModal, 200);
  });
}

if (mobilePhoneCta && leadModal) {
  mobilePhoneCta.addEventListener("click", openLeadModal);
}

if (modalCloseElements.length) {
  modalCloseElements.forEach((element) => {
    element.addEventListener("click", closeLeadModal);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLeadModal();
  }
});

if (mobilePhoneCta && hero && contactSection) {
  let heroPassed = false;
  let contactVisible = false;

  const updateMobileCta = () => {
    mobilePhoneCta.classList.toggle("is-visible", heroPassed && !contactVisible);
  };

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroPassed = !entry.isIntersecting;
      updateMobileCta();
    },
    { threshold: 0.15 }
  );

  const contactObserver = new IntersectionObserver(
    ([entry]) => {
      contactVisible = entry.isIntersecting;
      updateMobileCta();
    },
    { threshold: 0.2 }
  );

  heroObserver.observe(hero);
  contactObserver.observe(contactSection);
  updateMobileCta();
}
