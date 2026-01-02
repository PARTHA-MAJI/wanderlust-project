let taxSwitch = document.getElementById("flexSwitchCheckDefault");
let taxSwitchMobile = document.getElementById("flexSwitchCheckMobile");

function toggleTax(isMsgVisible) {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (let info of taxInfo) {
    if (isMsgVisible) {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
}

if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    toggleTax(taxSwitch.checked);

    if (taxSwitchMobile) {
      taxSwitchMobile.checked = taxSwitch.checked;
    }
  });
}

if (taxSwitchMobile) {
  taxSwitchMobile.addEventListener("click", () => {
    toggleTax(taxSwitchMobile.checked);

    if (taxSwitch) {
      taxSwitch.checked = taxSwitchMobile.checked;
    }
  });
}
