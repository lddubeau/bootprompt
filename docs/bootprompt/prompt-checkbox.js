bootprompt.prompt({
  title: "This is a prompt with a set of checkbox inputs!",
  value: ["1", "3"],
  inputType: "checkbox",
  inputOptions: [{
    text: "Choice One",
    value: "1",
  },
  {
    text: "Choice Two",
    value: "2",
  },
  {
    text: "Choice Three",
    value: "3",
  }],
  callback: (result) => {
    bootprompt.alert(`Result: ${result}`);
  },
});
