const locale = {
  OK: "I Suppose",
  CONFIRM: "Go Ahead",
  CANCEL: "Maybe Not",
};

bootprompt.addLocale("custom", locale);

bootprompt.prompt({
  title: "This is a prompt with a custom locale! What do you think?",
  locale: "custom",
  callback: (result) => {
    bootprompt.alert(`This was logged in the callback: ${result}`);
  },
});
