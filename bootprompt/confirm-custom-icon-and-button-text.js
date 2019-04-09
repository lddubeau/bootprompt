bootprompt.confirm({
  title: "Destroy planet?",
  message: "Do you want to activate the Deathstar now? This cannot be undone.",
  buttons: {
    cancel: {
      label: "<i class='fa fa-times'></i> Cancel",
    },
    confirm: {
      label: "<i class='fa fa-check'></i> Confirm",
    },
  },
  callback: (result) => {
    console.log(`This was logged in the callback: ${result}`);
  },
});
