(async () => {
  await bootprompt.alert$("This is an alert!");
  console.log("The dialog has been closed!");
})();
