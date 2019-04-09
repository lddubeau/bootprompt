bootprompt.prompt({
  title: "This is a prompt with a set of radio inputs!",
  message: "<p>Please select an option below:</p>",
  inputType: "radio",
  inputOptions: [{
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
