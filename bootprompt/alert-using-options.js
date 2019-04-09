bootprompt.alert({
  message: "This is an alert with a callback!",
  callback: () => {
    console.log("This was logged in the callback!");
  },
});
