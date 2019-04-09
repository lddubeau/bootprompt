bootprompt.prompt({
  title: "This is a prompt with select!",
  inputType: "select",
  inputOptions: [{
    text: "Choose one...",
    value: "",
  }, {
    text: "Choice One",
    value: "1",
  }, {
    text: "Choice Two",
    value: "2",
  }, {
    text: "Choice Three",
    value: "3",
  }],
  callback: (result) => {
    bootprompt.alert(`Result: ${result}`);
  },
});
