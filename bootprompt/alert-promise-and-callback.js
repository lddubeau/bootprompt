(async () => {
  let count = 3;
  await bootprompt.alert$({
    message: "This is an alert!",
    callback: () => --count === 0,
  });
  console.log("The dialog has been closed!");
})();
