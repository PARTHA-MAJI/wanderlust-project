(function () {
  "use strict";

  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        let inputs = form.querySelectorAll("input, textarea");
        inputs.forEach(function (input) {
          if (
            input.required &&
            (input.type === "text" ||
              input.tagName === "TEXTAREA" ||
              input.type === "price" ||
              input.type === "location" ||
              input.type === "country"
            )
          ) {
            if (input.value.trim() === "") {
              input.setCustomValidity(
                "This field is required and cannot be only spaces."
              );
            } else {
              input.setCustomValidity("");
            }
          }
        });

        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
