document.body.insertAdjacentHTML("beforeend", `
<div class="form-group">
  <label>Choose a type: </label>
  <select id="types" class="custom-select" style="max-width: 200px;">
    <option>text</option>
    <option>textarea</option>
    <option>email</option>
    <option>password</option>
    <option>number</option>
    <option>date</option>
    <option>time</option>
  </select>
</div>
<button id="prompt">Prompt</button>`);

const prompt = document.getElementById("prompt");
const types = document.getElementById("types");

$(prompt).on("click", () => {
  const type = types.value;
  bootprompt.prompt({
    title: `This is a prompt with input type: ${type}`,
    inputType: type,
    callback: (result) => {
      bootprompt.alert(`Result: ${result}`);
    },
  });
});
