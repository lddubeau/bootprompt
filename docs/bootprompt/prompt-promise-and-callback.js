(async () => {
  let count = 3;
  const response = await bootprompt.prompt$({
    title: "What is your name?",
    callback: () => --count === 0,
  });
  bootprompt.alert(`Response: ${response}`);
})();
