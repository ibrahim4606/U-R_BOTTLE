// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".template-card");
  const hiddenInput = document.getElementById("selectedTemplate");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selection from all cards
      cards.forEach((c) => {
        c.classList.remove(
          "border-info",
          "border-opacity-50",
          "border-3",
          "shadow",
        );
      });

      // Add selection style to clicked card
      this.classList.add(
        "border-info",
        "border-opacity-50",
        "border-3",
        "shadow",
      );

      // Store selected template value
      hiddenInput.value = this.dataset.template;
    });
  });
});

// Toasts

document.querySelectorAll('[data-bs-toggle="toast"]').forEach((btn) => {
  btn.addEventListener("click", function () {
    const target = this.getAttribute("data-bs-target");
    const toastEl = document.querySelector(target);

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  });
});

// progress bar
document.querySelectorAll(".order-progress").forEach((bar) => {
  const status = bar.dataset.status;

  if (status === "Order Placed") {
    width = "35%";
  }

  if (status === "In Progress") {
    width = "75%";
  }

  if (status === "Delivered") {
    width = "100%";
  }

  if (status === "Rejected") {
    width = "100%";
    bar.classList.add("bg-danger");
    bar.classList.remove("order-prog-color");
  }

  bar.style.width = width;
});

// label order

document.addEventListener("DOMContentLoaded", function () {
  const logos = document.querySelectorAll(".generated-logo");
  const fileInput = document.getElementById("formFile");
  const hiddenLogo = document.getElementById("selectedLogo");
  const fileLabel = document.getElementById("fileLabel");

  logos.forEach((img) => {
    img.addEventListener("click", function () {
      // remove previous selection
      logos.forEach((i) =>
        i.classList.remove(
          "border-info",
          "border-opacity-50",
          "border-3",
          "shadow",
        ),
      );

      // highlight selected
      this.classList.add(
        "border-info",
        "border-opacity-50",
        "border-3",
        "shadow",
      );

      // store generated logo path
      hiddenLogo.value = this.dataset.logo;

      // clear file input
      fileInput.value = "";

      fileLabel.innerText = "Generated logo selected";
    });
  });

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      // remove generated logo selection
      hiddenLogo.value = "";

      logos.forEach((i) =>
        i.classList.remove(
          "border-info",
          "border-opacity-50",
          "border-3",
          "shadow",
        ),
      );

      fileLabel.innerText = this.files[0].name;
    }
  });
});

// design studio volume button

document.addEventListener("DOMContentLoaded", function () {
  const volumeRadios = document.querySelectorAll(".volume-radio");
  const unitsInput = document.getElementById("units");
  const perUnitPriceInput = document.getElementById("perUnitPrice");
  const totalPriceInput = document.getElementById("totalPrice");
  const bottlesInfo = document.getElementById("bottlesInfo");

  const volumeData = {
    100: { price: 60, minUnits: 10, bottles: 24 },
    250: { price: 60, minUnits: 10, bottles: 24 },
    500: { price: 80, minUnits: 8, bottles: 12 },
    1000: { price: 100, minUnits: 5, bottles: 12 },
  };

  let currentPrice = 0;

  volumeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const volume = this.value;

      currentPrice = volumeData[volume].price;

      unitsInput.min = volumeData[volume].minUnits;

      perUnitPriceInput.value = currentPrice + " Rs";

      bottlesInfo.innerText =
        volumeData[volume].bottles +
        " bottles per unit & " +
        volumeData[volume].minUnits +
        " minimum units required";

      calculateTotal();
    });
  });

  unitsInput.addEventListener("input", calculateTotal);

  function calculateTotal() {
    const units = unitsInput.value;

    if (!units || !currentPrice) return;

    const total = units * currentPrice;

    totalPriceInput.value = total + " Rs";
  }
});

// password check

document.addEventListener("DOMContentLoaded", function () {
  const password = document.getElementById("inputPassword5");
  const confirmPassword = document.getElementById("rePassword");

  function checkPassword() {
    if (confirmPassword.value === "") {
      confirmPassword.classList.remove("is-valid", "is-invalid");
      return;
    }

    if (password.value === confirmPassword.value) {
      confirmPassword.classList.add("is-valid");
      confirmPassword.classList.remove("is-invalid");
    } else {
      confirmPassword.classList.add("is-invalid");
      confirmPassword.classList.remove("is-valid");
    }
  }

  password.addEventListener("input", checkPassword);
  confirmPassword.addEventListener("input", checkPassword);
});

const password = document.getElementById("inputPassword5");
const strength = document.getElementById("passwordStrength");

password.addEventListener("input", function () {
  let value = password.value;

  let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (value.length < 8) {
    strength.innerHTML = "Weak password";
    strength.style.color = "red";
  } else if (!strongRegex.test(value)) {
    strength.innerHTML = "Medium password";
    strength.style.color = "orange";
  } else {
    strength.innerHTML = "Strong password ✔";
    strength.style.color = "green";
  }
});
