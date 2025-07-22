// Step Navigation Logic
function goStepTwo() {
  checkName();
  checkNum();
  checkMail();
  Achieve();
}

function backStepOne() {
  stepInfo.style.display = "flex";
  stepPlan.style.display = "none";
  circle1.style.color = "black";
  circle1.style.backgroundColor = "rgba(255, 255, 255)";
  circle2.style.backgroundColor = "rgb(255, 255, 255, 0)";
  circle2.style.color = "white";
}

function goStepThree() {
  if (document.getElementById("totalPrice").innerHTML === "") {
    document.getElementById("totalPrice").innerHTML = "0";
  }
  checkPlan();
}

function backSteptTwo() {
  stepPlan.style.display = "flex";
  stepAddOn.style.display = "none";
  circle2.style.color = "black";
  circle2.style.backgroundColor = "rgba(255, 255, 255)";
  circle3.style.backgroundColor = "rgb(255, 255, 255, 0)";
  circle3.style.color = "white";
}

function goStepFour() {
  stepSummary.style.display = "flex";
  stepAddOn.style.display = "none";
  circle3.style.color = "white";
  circle3.style.backgroundColor = "rgba(255, 255, 255, 0)";
  circle4.style.backgroundColor = "rgb(255, 255, 255)";
  circle4.style.color = "black";

  // Summary: show only selected addons
  let basePrice = parseInt(document.getElementById("totalPrice").innerHTML) || 0;
  let addOnTotal = 0;

  const addons = [
    { inputId: "downloadMois", altId: "downloadAnnee", labelId: "onlinePrice", rowId: "addonRowOnline" },
    { inputId: "adfreeMois", altId: "adfreeAnnee", labelId: "storagePrice", rowId: "addonRowAdfree" },
    { inputId: "multiMois", altId: "multiAnnee", labelId: "customizablePrice", rowId: "addonRowMulti" }
  ];

  addons.forEach(addon => {
    const input = document.getElementById(addon.inputId);
    const altInput = document.getElementById(addon.altId);
    const row = document.getElementById(addon.rowId);
    const label = document.getElementById(addon.labelId);

    if ((input && input.checked) || (altInput && altInput.checked)) {
  const value = parseInt(input?.value || altInput?.value || 0);
  addOnTotal += value;
  label.innerHTML = "+₹" + value;
  row.style.display = "flex";
} else {
  label.innerHTML = "+0 ₹";
  row.style.display = "none";
}

  });

  document.getElementById("totalPrice").innerHTML = basePrice + addOnTotal;
}

function backStepThree() {
  stepSummary.style.display = "none";
  stepAddOn.style.display = "flex";
  circle3.style.color = "black";
  circle3.style.backgroundColor = "rgba(255, 255, 255)";
  circle4.style.backgroundColor = "rgb(255, 255, 255, 0)";
  circle4.style.color = "white";
}

function goFromFourToTwo() {
  stepSummary.style.display = "none";
  stepPlan.style.display = "flex";
  circle2.style.color = "black";
  circle2.style.backgroundColor = "rgba(255, 255, 255)";
  circle4.style.backgroundColor = "rgb(255, 255, 255, 0)";
  circle4.style.color = "white";
}

function goToStepThankYou() {
  if (document.getElementById("modeResume").innerHTML === "Choose a plan") {
    stepSummary.style.display = "flex";
    stepThankYou.style.display = "none";
  } else {
    stepSummary.style.display = "none";
    stepThankYou.style.display = "flex";
  }
}

// Monthly/Yearly Switch
document.getElementById("switch").addEventListener("click", function () {
  const checked = this.checked;
  planYear.style.display = checked ? "flex" : "none";
  planMonth.style.display = checked ? "none" : "flex";
  addonAnnee.style.display = checked ? "flex" : "none";
  addonMois.style.display = checked ? "none" : "flex";

  document.getElementById("labelMonthly").classList.toggle("active", !checked);
  document.getElementById("labelYearly").classList.toggle("active", checked);
});

// Plan Selection
document.getElementById("moisMobile").addEventListener("click", () => {
  highlightPlan("moisMobile");
  setPlan("Mobile", "₹149/mo", "Total (per month)", "149");
});

document.getElementById("moisSuper").addEventListener("click", () => {
  highlightPlan("moisSuper");
  setPlan("Super", "₹299/mo", "Total (per month)", "299");
});

document.getElementById("moisPremium").addEventListener("click", () => {
  highlightPlan("moisPremium");
  setPlan("Premium", "₹299/mo", "Total (per month)", "299");
});

document.getElementById("anneeMobile").addEventListener("click", () => {
  highlightPlan("anneeMobile");
  setPlan("Mobile", "₹499/yr", "Total (per year)", "499");
});

document.getElementById("anneeSuper").addEventListener("click", () => {
  highlightPlan("anneeSuper");
  setPlan("Super", "₹899/yr", "Total (per year)", "899");
});

document.getElementById("anneePremium").addEventListener("click", () => {
  highlightPlan("anneePremium");
  setPlan("Premium", "₹1499/yr", "Total (per year)", "1499");
});

function highlightPlan(id) {
  document.querySelectorAll(".planButton").forEach(btn => btn.classList.remove("selected"));
  document.getElementById(id).classList.add("selected");
}

function setPlan(name, price, totalText, value) {
  document.getElementById("modeResume").innerHTML = `${name} (${price.includes("/yr") ? "yearly" : "monthly"})`;
  document.getElementById("priceResume").innerHTML = price;
  document.getElementById("modeTotal").innerHTML = totalText;
  document.getElementById("totalPrice").innerHTML = value;
}

// Reset Logic
function reset() {
  const ids = [
    "downloadMois", "adfreeMois", "multiMois",
    "downloadAnnee", "adfreeAnnee", "multiAnnee"
  ];
  ids.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.checked = false;
  });

  document.getElementById("onlinePrice").innerHTML = "+0₹";
  document.getElementById("storagePrice").innerHTML = "+0₹";
  document.getElementById("customizablePrice").innerHTML = "+0₹";

  document.getElementById("modeResume").innerHTML = "Choose a plan";
  document.getElementById("priceResume").innerHTML = "0₹";
  document.getElementById("totalPrice").innerHTML = "0";

  document.querySelectorAll(".planButton").forEach(btn => {
    btn.classList.remove("selected");
  });

  document.getElementById("addonRowOnline").style.display = "none";
  document.getElementById("addonRowAdfree").style.display = "none";
  document.getElementById("addonRowMulti").style.display = "none";
}

// Input Validation
function checkName() {
  const input = document.getElementById("infoName");
  const error = document.getElementById("errorName");
  const regex = /^[a-zA-Z-\s]+$/;
  if (input.value.trim() === "") {
    error.innerHTML = "This field is required";
  } else if (!regex.test(input.value)) {
    error.innerHTML = "Can't contain numbers or symbols";
  } else {
    error.innerHTML = "";
  }
}

function checkNum() {
  const input = document.getElementById("infoNumber");
  const error = document.getElementById("errorNum");
  const regex = /^[0-9\s]+$/;
  if (input.value.trim() === "") {
    error.innerHTML = "This field is required";
  } else if (!regex.test(input.value)) {
    error.innerHTML = "Must contain number";
  } else if (input.value.trim().length !== 10) {
    error.innerHTML = "Invalid Phone Number";
  } else {
    error.innerHTML = "";
  }
}

function checkMail() {
  const input = document.getElementById("infoMail");
  const error = document.getElementById("errorMail");
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (input.value.trim() === "") {
    error.innerHTML = "This field is required";
  } else if (!regex.test(input.value)) {
    error.innerHTML = "Please enter a valid e-mail";
  } else {
    error.innerHTML = "";
  }
}

function Achieve() {
  const name = document.getElementById("infoName").value.trim();
  const phone = document.getElementById("infoNumber").value.trim();
  const mail = document.getElementById("infoMail").value.trim();
  const nameRegex = /^[a-zA-Z-\s]+$/;
  const phoneRegex = /^[0-9\s]+$/;
  const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (
    nameRegex.test(name) &&
    phoneRegex.test(phone) && phone.length === 10 &&
    mailRegex.test(mail)
  ) {
    stepInfo.style.display = "none";
    stepPlan.style.display = "flex";
    circle1.style.color = "white";
    circle1.style.backgroundColor = "transparent";
    circle2.style.backgroundColor = "#fff";
    circle2.style.color = "black";
  }
}

function checkPlan() {
  if (document.getElementById("modeResume").innerHTML === "Choose a plan") {
    stepInfo.style.display = "none";
    stepPlan.style.display = "flex";
    circle1.style.color = "white";
    circle1.style.backgroundColor = "transparent";
    circle2.style.backgroundColor = "#fff";
    circle2.style.color = "black";
  } else {
    stepPlan.style.display = "none";
    stepAddOn.style.display = "flex";
    circle2.style.color = "white";
    circle2.style.backgroundColor = "transparent";
    circle3.style.backgroundColor = "#fff";
    circle3.style.color = "black";
  }
}
