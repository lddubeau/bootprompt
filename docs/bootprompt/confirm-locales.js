document.body.insertAdjacentHTML("beforeend", `
  <div class="form-group">
  <label>Choose a locale: </label>
  <select id="locales" class="custom-select" style="max-width: 200px;"></select>
</div>
<button id="confirm">Confirm</button>`);

const locales = document.getElementById("locales");
for (const locale in bootprompt.locales()) {
  const option = document.createElement("option");
  option.setAttribute("value", locale);
  option.textContent = locale;

  locales.appendChild(option);
}

const confirm = document.getElementById("confirm");
$(confirm).on("click", () => {
  bootprompt.confirm({
    message:
      "This confirm uses the selected locale. Were the labels what you expected?",
    locale: locales.value,
    callback: (result) => {
      bootprompt.alert(`This was logged in the callback: ${result}`);
    },
  });
});
