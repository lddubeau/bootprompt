bootprompt.prompt({
  title: "This is a prompt with a range input!",
  inputType: "range",
  min: "0",
  max: "100",
  step: "5",
  value: "35",
  callback: (result) => {
    bootprompt.alert(`This was logged in the callback: ${result}`);
  },
});
