let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let taxSwitchMobile = document.getElementById("flexSwitchCheckMobile");

// Function to toggle tax display
function toggleTax() {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
}

// Add event listener to Desktop Switch
if (taxSwitch) {
  taxSwitch.addEventListener("click", toggleTax);
}

// Add event listener to Mobile Switch
if (taxSwitchMobile) {
  taxSwitchMobile.addEventListener("click", toggleTax);
}
