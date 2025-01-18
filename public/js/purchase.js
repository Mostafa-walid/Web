window.onload = function () {
  updatePrice(); // Initialize on page load
};

function calculateInstallmentPrice(installmentMonths, extraRate) {
  var originalPrice = 30995; // Example price

  var totalPrice = originalPrice * (1 + extraRate);
  var monthlyInstallment = totalPrice / installmentMonths;

  return {
    totalPrice: totalPrice.toFixed(2),
    monthlyInstallment: monthlyInstallment.toFixed(2),
  };
}

function updatePrice() {
  var paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  var regularPrice = document.getElementById("totalPrice");
  var monthlyInstallment = document.getElementById("monthlyInstallment");
  var installmentsDiv = document.getElementById("installments");

  // Handle installment option visibility
  if (paymentMethod === "installments") {
    installmentsDiv.style.display = "block";
    document
      .getElementsByName("installment")
      .forEach(function (installmentRadio) {
        installmentRadio.removeAttribute("disabled");
      });
  } else {
    installmentsDiv.style.display = "none";
    document
      .getElementsByName("installment")
      .forEach(function (installmentRadio) {
        installmentRadio.checked = false;
        installmentRadio.setAttribute("disabled", "disabled");
      });
  }

  // Handle cash payment option
  if (paymentMethod === "cash") {
    regularPrice.textContent = "Total Price: $30,995";
    monthlyInstallment.textContent = "";
    document.getElementById("priceSection").style.display = "block";
    enablePayNowButton(); // Enable Pay Now button
  }
}

function selectInstallment() {
  var installmentRadios = document.getElementsByName("installment");
  var extraRate = 0;
  var installmentMonths = 0;

  for (var i = 0; i < installmentRadios.length; i++) {
    if (installmentRadios[i].checked) {
      if (installmentRadios[i].value === "6") {
        extraRate = 0.2;
        installmentMonths = 6;
      } else if (installmentRadios[i].value === "12") {
        extraRate = 0.35;
        installmentMonths = 12;
      }
      break;
    }
  }

  var priceDetails = calculateInstallmentPrice(installmentMonths, extraRate);

  var regularPrice = document.getElementById("totalPrice");
  var monthlyInstallment = document.getElementById("monthlyInstallment");

  regularPrice.textContent =
    "Total Price with Installments: $" + priceDetails.totalPrice;
  monthlyInstallment.textContent =
    "Monthly Installment: $" +
    priceDetails.monthlyInstallment +
    " (" +
    installmentMonths +
    " months)";

  enablePayNowButton(); // Enable Pay Now button
}
