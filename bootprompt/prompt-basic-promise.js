(async () => {
  const response = await bootprompt.prompt$("What is your name?");
  bootprompt.alert$(`You answered: ${response}.`);
})();
