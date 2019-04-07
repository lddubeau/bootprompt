const dialog = bootprompt.dialog({
  message: "<p class='text-center mb-0'><i class='fa fa-spin fa-cog'></i> \
 Please wait while we do something...</p>",
  closeButton: false,
  onEscape: false,
});

setTimeout(() => {
  dialog.modal("hide");
}, 2000);
