bootprompt.prompt("What is your name?", (result) => {
  bootprompt.alert(result === null ?
                   "You did not tell me your name!" :
                   `You said your name is: ${result}`);
});
