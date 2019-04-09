(async () => {
  const response = await bootprompt.confirm$("Frobulate the fnord?");
  console.log(`Response: ${response}`);
})();
