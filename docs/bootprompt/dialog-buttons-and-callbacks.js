bootprompt.dialog({
  title: "A custom dialog with buttons and callbacks",
  message: "<p>This dialog has buttons. Each button has it's own callback \
function.</p>",
  size: "large",
  buttons: {
    cancel: {
      label: "I'm a cancel button!",
      className: "btn-danger",
      callback: () => {
        bootprompt.alert("Custom cancel clicked");
      },
    },
    noclose: {
      label: "I don't close the modal!",
      className: "btn-warning",
      callback: () => {
        bootprompt.alert("Custom button clicked");
        return false;
      },
    },
    ok: {
      label: "I'm an OK button!",
      className: "btn-info",
      callback: () => {
        bootprompt.alert("Custom OK clicked");
      },
    },
  },
});
