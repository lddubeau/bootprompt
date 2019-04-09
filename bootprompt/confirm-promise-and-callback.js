(async () => {
  let count = 3;
  const response = await bootprompt.confirm$({
    message: "Please confirm!",
    callback: () => --count === 0,
  });
  bootprompt.alert(`Response: ${response}`);
})();
