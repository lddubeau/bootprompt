/**
 * bootprompt.js
 * license: MIT
 * http://github.com/lddubeau/bootprompt
 */

// tslint:disable-next-line:no-import-side-effect
import "bootstrap";
// tslint:disable-next-line:import-name match-default-export-name
import $ from "jquery";

// We use this to keep versync happy.
const version = "5.0.0-alpha.1";

// But export this.
export const VERSION = version;

export type LocaleField = "OK" | "CANCEL" | "CONFIRM";
export type LocaleSpec = Record<LocaleField, string>;
export interface Locale {
  name: string;
  spec: LocaleSpec;
}

const LOCALE_FIELDS: LocaleField[] = ["OK",  "CANCEL", "CONFIRM"];

const definedLocales: Record<string, LocaleSpec> = Object.create(null);

export type StringOrDocumentContent =
  string | Element | DocumentFragment | Text | JQuery;

export type GeneralCallback =
  (this: JQuery, event: JQuery.TriggeredEvent) => boolean | undefined;

export interface Button {
  label?: string;
  className?: string;
  callback?: GeneralCallback;
}

interface SanitizedButton {
  label: string;
  className: string;
  callback?: GeneralCallback;
}

export type ButtonSpec = Button | GeneralCallback;

export interface Buttons {
  [key: string]:  ButtonSpec;
}

interface SanitizedButtons extends Buttons {
  [key: string]: SanitizedButton;
}

export interface OkButton extends Buttons {
  ok: ButtonSpec;
}

export interface ConfirmCancelButtons extends Buttons {
  confirm: ButtonSpec;
  cancel: ButtonSpec;
}

// tslint:disable-next-line:no-any
export interface CommonOptions<T extends any[]> {
  message?: StringOrDocumentContent;
  title?: StringOrDocumentContent;
  callback?(...args: T): boolean | undefined;
  onEscape?: boolean | GeneralCallback;
  show?: boolean;
  backdrop?: boolean | "static";
  closeButton?: boolean;
  animate?: boolean;
  className?: string;
  size?: "large" | "small";
  locale?: string;
  buttons?: Buttons;
  swapButtonOrder?: boolean;
  centerVertical?: boolean;
  container?: string | Element | JQuery;
}

// tslint:disable-next-line:no-any
export interface DialogOptions extends CommonOptions<any[]>{
  message: StringOrDocumentContent;
}

interface SanitizedDialogOptions extends DialogOptions {
  container: string | Element | JQuery;
  buttons?: SanitizedButtons;
}

export interface AlertOptions extends CommonOptions<[]> {
  callback?(): boolean | undefined;
  buttons?: OkButton;
}

export interface ConfirmOptions extends CommonOptions<[boolean]> {
  message: StringOrDocumentContent;
  buttons?: ConfirmCancelButtons;
}

export interface PromptCommonOptions extends CommonOptions<[string]> {
  title: StringOrDocumentContent;
  callback?(result: string | string[] | null): boolean | undefined;
  value?: string | number | string[];
  buttons?: ConfirmCancelButtons;
  pattern?: string;
}

export interface TextPromptOptions extends PromptCommonOptions {
  inputType: "text" | "password" | "textarea" | "email";
  maxlength?: number;
  placeholder?: string;
  required?: boolean;
}

export interface NumericPromptOptions extends PromptCommonOptions {
  inputType: "number" | "range";
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  required?: boolean;
}

export interface TimePromptOptions extends PromptCommonOptions {
  inputType: "time";
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string | number;
  required?: boolean;
}

export interface DatePromptOptions extends PromptCommonOptions {
  inputType: "date";
  placeholder?: string;
  min?: string;
  max?: string;
  required?: boolean;
}

export interface InputOption {
  text: string;
  value: string;
  group?: string;
}

export interface SelectPromptOptions extends PromptCommonOptions {
  inputType: "select";
  placeholder?: string;
  inputOptions: InputOption[];
  required?: boolean;
  multiple?: boolean;
}

export interface EtcPromptOptions extends PromptCommonOptions {
  inputType: "checkbox" | "radio";
  inputOptions: InputOption[];
}

export type PromptOptions = TextPromptOptions | SelectPromptOptions |
  NumericPromptOptions | TimePromptOptions | DatePromptOptions |
  EtcPromptOptions;

const templates = {
  dialog: `\
<div class="bootprompt modal" tabindex="-1" role="dialog" aria-hidden="true">\
 <div class="modal-dialog">\
  <div class="modal-content">\
   <div class="modal-body"><div class="bootprompt-body"></div></div>\
  </div>\
 </div>\
</div>`,
  header: `\
<div class="modal-header">\
 <h5 class="modal-title"></h5>\
</div>`,
  footer: `<div class="modal-footer"></div>`,
  closeButton: `
<button type="button" class="bootprompt-close-button close" aria-hidden="true">\
&times;</button>`,
  form: `<form class="bootprompt-form"></form>`,
  button: `<button type="button" class="btn"></button>`,
  option: "<option></option>",
  promptMessage: `<div class="bootprompt-prompt-message"></div>`,
  inputs: {
    text: `\
<input class="bootprompt-input bootprompt-input-text form-control" \
autocomplete="off" type="text" />`,
    textarea: `\
<textarea class="bootprompt-input bootprompt-input-textarea form-control">\
</textarea>`,
    email: `\
<input class="bootprompt-input bootprompt-input-email form-control" \
autocomplete="off" type="email" />`,
    select: `\
<select class="bootprompt-input bootprompt-input-select form-control">\
</select>`,
    checkbox: `\
<div class="form-check checkbox"><label class="form-check-label">\
 <input class="form-check-input bootprompt-input bootprompt-input-checkbox"
        type="checkbox" />\
</label></div>`,
    radio: `\
<div class="form-check radio"><label class="form-check-label">\
<input class="form-check-input bootprompt-input bootprompt-input-radio" \
       type="radio" name="bootprompt-radio" />\
</label></div>`,
    date: `\
<input class="bootprompt-input bootprompt-input-date form-control" \
autocomplete="off" type="date" />`,
    time: `\
<input class="bootprompt-input bootprompt-input-time form-control" \
autocomplete="off" type="time" />`,
    number: `\
<input class="bootprompt-input bootprompt-input-number form-control" \
       autocomplete="off" type="number" />`,
    password: `\
<input class="bootprompt-input bootprompt-input-password form-control" \
autocomplete="off" type="password" />`,
    range: `\
<input class="bootprompt-input bootprompt-input-range form-control-range"
autocomplete="off" type="range" />`,
  },
};

// tslint:disable-next-line:no-any
const defaults: Record<string, any> = {
  // default language
  locale: "en",
  // show backdrop or not. Default to static so user has to interact with dialog
  backdrop: "static",
  // animate the modal in/out
  animate: true,
  // additional class string applied to the top level dialog
  className: undefined,
  // whether or not to include a close button
  closeButton: true,
  // show the dialog immediately by default
  show: true,
  // dialog container
  container: "body",
  // default value (used by the prompt helper)
  value: undefined,
  // default input type (used by the prompt helper)
  inputType: "text",
  // switch button order from cancel/confirm (default) to confirm/cancel
  swapButtonOrder: false,
  // center modal vertically in page
  centerVertical: false,
};

//
// PUBLIC FUNCTIONS
//

// Return all currently registered locales, or a specific locale if "name" is
// defined
export function locales(): Record<string, LocaleSpec>;
export function locales(name: string): LocaleSpec | undefined;
export function locales(name?: string):
Record<string, LocaleSpec> | LocaleSpec | undefined {
  return name !== undefined ? definedLocales[name] : definedLocales;
}

// Register localized strings for the OK, Confirm, and Cancel buttons
export function addLocale(name: string, values: LocaleSpec): void {
  for (const field of LOCALE_FIELDS) {
    if (typeof values[field] !== "string") {
      throw new Error(`Please supply a translation for "${field}"`);
    }
  }

  definedLocales[name] = values;
}

// Remove a previously-registered locale
export function removeLocale(name: string): void {
  if (name !== "en") {
    delete definedLocales[name];
  }
  else {
    throw new Error(`"en" is used as the default and fallback locale and \
cannot be removed.`);
  }
}

export function setLocale(name: string): void {
  setDefaults("locale", name);
}

export function setDefaults(defaults: Record<string, unknown>): void;
export function setDefaults(name: string, value: string): void;
export function setDefaults(name: string | Record<string, unknown>,
                            value?: string): void {
  if (arguments.length === 2) {
    // allow passing of single key/value...
    defaults[name as string] = value;
  } else {
    // ... and as an object too
    Object.assign(defaults, name);
  }
}

// Hides all currently active Bootprompt modals
export function hideAll(): void {
    $(".bootprompt").modal("hide");
}

//
// CORE HELPER FUNCTIONS
//

// tslint:disable-next-line:no-any
const fnModal = $.fn.modal as any;
if (fnModal === undefined) {
  throw new Error(
    `"$.fn.modal" is not defined; please double check you have included \
the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ \
for more details.`);
}

if (!fnModal.Constructor.VERSION) {
  throw new Error("Bootprompt cannot determine the version of Bootstrap used");
}

const fullBootstrapVersion = fnModal.Constructor.VERSION;
const bootstrapVersion =
  Number(fullBootstrapVersion.substring(0,
                                        fullBootstrapVersion.indexOf(".")));

if (bootstrapVersion < 3) {
  throw new Error("Bootprompt does not work with Bootstrap 2 and lower.");
}

// Core dialog function
// tslint:disable-next-line:max-func-body-length cyclomatic-complexity
export function dialog(options: DialogOptions): JQuery {
  const finalOptions = sanitize(options);

  const $dialog = $(templates.dialog);
  const innerDialog = $dialog.find(".modal-dialog");
  const body = $dialog.find(".modal-body");
  const footer = $(templates.footer);
  const buttons = finalOptions.buttons;

  const callbacks: Record<string, GeneralCallback | boolean | undefined> = {
    onEscape: finalOptions.onEscape,
  };

  const { backdrop, className, closeButton, message, size,
          title } = finalOptions;
  if (typeof message === "string") {
    body.find(".bootprompt-body").html(message);
  }
  else {
    body.find(".bootprompt-body").empty().append(message);
  }

  let hadButtons = false;
  // tslint:disable-next-line:forin
  for (const key in buttons) {
    hadButtons = true;
    const b = buttons[key];
    const button = $(templates.button);
    button.data("bb-handler", key);
    button.addClass(b.className);

    switch (key) {
      case "ok":
      case "confirm":
        button.addClass("bootprompt-accept");
        break;

      case "cancel":
        button.addClass("bootprompt-cancel");
        break;
      default:
    }

    button.html(b.label);
    footer.append(button);

    callbacks[key] = b.callback;
  }

  // Only attempt to create buttons if at least one has
  // been defined in the options object
  if (hadButtons) {
    body.after(footer);
  }

  if (finalOptions.animate === true) {
    $dialog.addClass("fade");
  }

  if (className !== undefined) {
    $dialog.addClass(className);
  }

  if (size !== undefined) {
    // Requires Bootstrap 3.1.0 or higher
    if (fullBootstrapVersion.substring(0, 3) < "3.1") {
      console.warn(`"size" requires Bootstrap 3.1.0 or higher. You appear \
to be using ${fullBootstrapVersion}. Please upgrade to use this option.`);
    }

    if (size === "large") {
      innerDialog.addClass("modal-lg");
    } else if (size === "small") {
      innerDialog.addClass("modal-sm");
    }
  }

  if (title !== undefined) {
    body.before(templates.header);
    if (typeof title === "string") {
      // tslint:disable-next-line:no-inner-html
      $dialog.find(".modal-title").html(title);
    }
    else {
      $dialog.find(".modal-title").empty().append(title);
    }
  }

  if (closeButton === true) {
    const closeButtonEl = $(templates.closeButton);

    if (title !== undefined) {
      if (bootstrapVersion > 3) {
        $dialog.find(".modal-header").append(closeButtonEl);
      }
      else {
        $dialog.find(".modal-header").prepend(closeButtonEl);
      }
    } else {
      closeButtonEl.prependTo(body);
    }
  }

  if (finalOptions.centerVertical !== undefined){
    // Requires Bootstrap 4.0.0-beta.3 or higher
    if (fullBootstrapVersion < "4.0.0") {
      console.warn(`"centerVertical" requires Bootstrap 4.0.0-beta.3 or \
higher. You appear to be using ${fullBootstrapVersion}. Please upgrade to use \
this option.`);
    }

    innerDialog.addClass("modal-dialog-centered");
  }

  // Bootstrap event listeners; these handle extra setup & teardown required
  // after the underlying modal has performed certain actions.

  // make sure we unbind any listeners once the dialog has definitively been
  // dismissed
  $dialog.one("hide.bs.modal", function (e: JQuery.TriggeredEvent): void {
    // tslint:disable-next-line:no-invalid-this
    if (e.target === this) {
      $dialog.off("escape.close.bb");
      $dialog.off("click");
    }
  });

  $dialog.one("hidden.bs.modal", function (e: JQuery.TriggeredEvent): void {
    // ensure we don't accidentally intercept hidden events triggered by
    // children of the current dialog. We shouldn't need to handle this anymore,
    // now that Bootstrap namespaces its events, but still worth doing.
    // tslint:disable-next-line:no-invalid-this
    if (e.target === this) {
      $dialog.remove();
    }
  });

  $dialog.one("shown.bs.modal", () => {
    $dialog.find(".btn-primary:first").trigger("focus");
  });

  // Bootprompt event listeners; used to decouple some
  // behaviours from their respective triggers

  if (backdrop !== "static") {
    // A boolean true/false according to the Bootstrap docs
    // should show a dialog the user can dismiss by clicking on
    // the background.
    // We always only ever pass static/false to the actual
    // $.modal function because with "true" we can't trap
    // this event (the .modal-backdrop swallows it)
    // However, we still want to sort of respect true
    // and invoke the escape mechanism instead
    $dialog.on("click.dismiss.bs.modal",
               function (e: JQuery.TriggeredEvent): void {
                 // @NOTE: the target varies in >= 3.3.x releases since the
                 // modal backdrop moved *inside* the outer dialog rather than
                 // *alongside* it
                 if ($dialog.children(".modal-backdrop").length !== 0) {
                   e.currentTarget = $dialog.children(".modal-backdrop").get(0);
                 }

                 if (e.target !== e.currentTarget) {
                   return;
                 }

                 $dialog.trigger("escape.close.bb");
               });
  }

  $dialog.on("escape.close.bb", (e: JQuery.TriggeredEvent) => {
    // the if statement looks redundant but it isn't; without it
    // if we *didn't* have an onEscape handler then processCallback
    // would automatically dismiss the dialog
    if (callbacks.onEscape === true ||
        typeof callbacks.onEscape === "function") {
      processCallback(e, $dialog, callbacks.onEscape);
    }
  });

  $dialog.on("click", ".modal-footer button",
             function (e: JQuery.TriggeredEvent): void {
               // tslint:disable-next-line:no-invalid-this
               const callbackKey = $(this).data("bb-handler");

               processCallback(e, $dialog, callbacks[callbackKey]);
             });

  $dialog.on("click", ".bootprompt-close-button", (e) => {
    // onEscape might be falsy but that's fine; the fact is
    // if the user has managed to click the close button we
    // have to close the dialog, callback or not
    processCallback(e, $dialog, callbacks.onEscape);
  });

  $dialog.on("keyup", (e) => {
    if (e.which === 27) {
      $dialog.trigger("escape.close.bb");
    }
  });

  // The interface defined for $ messes up type inferrence so we have to assert
  // the type here.
  $(finalOptions.container as JQuery).append($dialog);

  $dialog.modal({
    backdrop: (backdrop === true || backdrop === "static") ? "static" : false,
    keyboard: false,
    show: false,
  });

  if (finalOptions.show === true) {
    $dialog.modal("show");
  }

  return $dialog;
}

// Helper function to simulate the native alert() behavior. **NOTE**: This is
// non-blocking, so any code that must happen after the alert is dismissed
// should be placed within the callback function for this alert.
export function alert(options: AlertOptions): JQuery;
export function alert(message: string,
                      callback?: AlertOptions["callback"]): JQuery;
export function alert(messageOrOptions: string | AlertOptions,
                      callback?: AlertOptions["callback"]): JQuery {
  const finalOptions =
    mergeDialogOptions("alert", ["ok"], ["message", "callback"],
                       messageOrOptions, callback);

  const { callback: finalCallback } = finalOptions;

  // tslint:disable-next-line:no-suspicious-comment
  // @TODO: can this move inside exports.dialog when we're iterating over each
  // button and checking its button.callback value instead?
  if (finalCallback !== undefined && !$.isFunction(finalCallback)) {
    throw new Error("alert requires callback property to be a function when \
provided");
  }

  // override the ok and escape callback to make sure they just invoke the
  // single user-supplied one (if provided)
  // tslint:disable-next-line:no-non-null-assertion
  (finalOptions.buttons.ok as Button).callback = finalOptions.onEscape =
    function (): boolean | undefined {
      // tslint:disable-next-line:no-invalid-this
      return $.isFunction(finalCallback) ? finalCallback.call(this) : true;
    };

  return dialog(finalOptions);
}

// Helper function to simulate the native confirm() behavior. **NOTE**: This is
// non-blocking, so any code that must happen after the confirm is dismissed
// should be placed within the callback function for this confirm.
export function confirm(options: ConfirmOptions): JQuery;
export function confirm(message: string,
                        callback: ConfirmOptions["callback"]): JQuery;
export function confirm(messageOrOptions: string | ConfirmOptions,
                        callback?: ConfirmOptions["callback"]): JQuery {
  const finalOptions = mergeDialogOptions("confirm", ["cancel", "confirm"],
                                          ["message", "callback"],
                                          messageOrOptions, callback);

  const { callback: finalCallback, buttons } = finalOptions;

  // confirm specific validation; they don't make sense without a callback so
  // make sure it's present
  if (!$.isFunction(finalCallback)) {
    throw new Error("confirm requires a callback");
  }

  // overrides; undo anything the user tried to set they shouldn't have
  // tslint:disable-next-line:no-non-null-assertion
  (buttons.cancel as Button).callback = finalOptions.onEscape =
    function (): boolean | undefined {
      // tslint:disable-next-line:no-invalid-this
      return finalCallback.call(this, false);
    };

  // tslint:disable-next-line:no-non-null-assertion
  (buttons.confirm as Button).callback = function (): boolean | undefined {
    // tslint:disable-next-line:no-invalid-this
    return finalCallback.call(this, true);
  };

  return dialog(finalOptions);
}

function setupTextualInput(input: JQuery,
                           options: TextPromptOptions & DialogOptions): void {
  const { value, placeholder, pattern, maxlength, required } = options;

  input.val(value as string);

  if (placeholder !== undefined) {
    input.attr("placeholder", placeholder);
  }

  if (pattern !== undefined) {
    input.attr("pattern", pattern);
  }

  if (maxlength !== undefined) {
    input.attr("maxlength", maxlength);
  }

  if (required === true) {
    input.prop({ required: true });
  }
}

function setupNumberLikeInput(input: JQuery,
                              options: NumericPromptOptions | DatePromptOptions
                              | TimePromptOptions): void {
  const { value, placeholder, pattern, required, inputType } = options;

  input.val(value as string);

  if (placeholder !== undefined) {
    input.attr("placeholder", placeholder);
  }

  if (pattern !== undefined) {
    input.attr("pattern", pattern);
  }

  if (required === true) {
    input.prop({ required: true });
  }

  // These input types have extra attributes which affect their input
  // validation.  Warning: For most browsers, date inputs are buggy in their
  // implementation of 'step', so this attribute will have no
  // effect. Therefore, we don't set the attribute for date inputs.  @see
  // tslint:disable-next-line:max-line-length
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#Setting_maximum_and_minimum_dates
  if (inputType !== "date") {
    const step = (options as TimePromptOptions | NumericPromptOptions).step;
    if (step !== undefined) {
      if (step === "any" || (!isNaN(step as number) && step > 0)) {
        input.attr("step", step);
      }
      else {
        throw new Error(`"step" must be a valid positive number or the \
value "any". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-step \
for more information.`);
      }
    }
  }

  validateMinOrMaxValue(input, "min", options);
  validateMinOrMaxValue(input, "max", options);
}

function setupSelectInput(input: JQuery, options: SelectPromptOptions): void {
  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (!$.isArray(inputOptions)) {
    throw new Error("Please pass an array of input options");
  }

  if (inputOptions.length === 0) {
    throw new Error("prompt with select requires at least one option \
value");
  }

  const { placeholder, required } = options;

  // placeholder is not actually a valid attribute for select, but we'll
  // allow it, assuming it might be used for a plugin
  if (placeholder !== undefined) {
    input.attr("placeholder", placeholder);
  }

  if (required === true) {
    input.prop({ required: true });
  }

  let firstValue: string | undefined;
  const groups: Record<string, JQuery> = Object.create(null);
  for (const { value, text, group } of inputOptions) {
    // assume the element to attach to is the input...
    let elem = input;

    if (value === undefined || text === undefined) {
      throw new Error(`each option needs a "value" and a "text" property`);
    }

    // ... but override that element if this option sits in a group

    if (group !== undefined && group !== "") {
      if (groups[group] === undefined) {
        groups[group] = $("<optgroup />").attr("label", group);
      }

      elem = groups[group];
    }

    const o = $(templates.option);
    o.attr("value", value).text(text);
    elem.append(o);
    if (firstValue === undefined) {
      firstValue = value;
    }
  }

  if (firstValue === undefined) {
    firstValue = "";
  }

  // tslint:disable-next-line:forin
  for (const groupName in groups) {
    input.append(groups[groupName]);
  }

  input.val(options.value !== undefined ? options.value : firstValue);
}

function setupCheckbox(input: JQuery, options: EtcPromptOptions,
                       inputTemplate: string): void {
  const checkboxValues =
    Array.isArray(options.value) ? options.value : [options.value];
  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (inputOptions.length === 0) {
    throw new Error("prompt with checkbox requires options");
  }

  for (const { value, text } of inputOptions) {
    if (value === undefined || text === undefined) {
      throw new Error(`each option needs a "value" and a "text" property`);
    }

    const checkbox = $(inputTemplate);

    checkbox.find("input").attr("value", value);
    checkbox.find("label").append(`\n${text}`);

    if (checkboxValues.indexOf(value) !== -1) {
      checkbox.find("input").prop("checked", true);
    }

    input.append(checkbox);
  }
}

function setupRadio(input: JQuery, options: EtcPromptOptions,
                    inputTemplate: string): void {
  // Make sure that value is not an array (only a single radio can ever be
  // checked)
  const { value: initialValue } = options;
  if (initialValue !== undefined && $.isArray(initialValue)) {
    throw new Error(`prompt with radio requires a single, non-array value \
for "value".`);
  }

  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (inputOptions.length === 0) {
    throw new Error("prompt with radio requires options");
  }

  // Radiobuttons should always have an initial checked input checked in a
  // "group".  If value is undefined or doesn't match an input option,
  // select the first radiobutton
  let checkFirstRadio = true;

  for (const { value, text } of inputOptions) {
    if (value === undefined || text === undefined) {
      throw new Error(`each option needs a "value" and a "text" property`);
    }

    const radio = $(inputTemplate);

    radio.find("input").attr("value", value);
    radio.find("label").append(`\n${text}`);

    if (initialValue !== undefined) {
      if (value === initialValue) {
        radio.find("input").prop("checked", true);
        checkFirstRadio = false;
      }
    }

    input.append(radio);
  }

  if (checkFirstRadio) {
    input.find("input[type='radio']").first().prop("checked", true);
  }
}

// Helper function to simulate the native prompt() behavior. **NOTE**: This is
// non-blocking, so any code that must happen after the prompt is dismissed
// should be placed within the callback function for this prompt.
export function prompt(options: PromptOptions): JQuery;
export function prompt(message: string,
                       callback: PromptOptions["callback"]): JQuery;
// tslint:disable-next-line:max-func-body-length
export function prompt(messageOrOptions: string | PromptOptions,
                       callback?: PromptOptions["callback"]): JQuery {
  // prompt defaults are more complex than others in that users can override
  // more defaults
  const finalOptions = mergeDialogOptions("prompt", ["cancel", "confirm"],
                                          ["title", "callback"],
                                          messageOrOptions, callback);
  if (finalOptions.value === undefined) {
    finalOptions.value = defaults.value;
  }

  if (finalOptions.inputType === undefined) {
    // tslint:disable-next-line:no-any
    (finalOptions as any).inputType = defaults.inputType;
  }

  // capture the user's show value; we always set this to false before spawning
  // the dialog to give us a chance to attach some handlers to it, but we need
  // to make sure we respect a preference not to show it
  const shouldShow = (finalOptions.show === undefined) ? defaults.show :
    finalOptions.show;
  // This is required prior to calling the dialog builder below - we need to add
  // an event handler just before the prompt is shown
  finalOptions.show = false;

  // prompt-specific validation
  if (finalOptions.title === undefined || finalOptions.title === "") {
    throw new Error("prompt requires a title");
  }

  const { callback: finalCallback, buttons } = finalOptions;
  if (!$.isFunction(finalCallback)) {
    throw new Error("prompt requires a callback");
  }

  const inputTemplate = templates.inputs[finalOptions.inputType];
  let input: JQuery;
  switch (finalOptions.inputType) {
    case "text":
    case "textarea":
    case "email":
    case "password":
      input = $(inputTemplate);
      setupTextualInput(input, finalOptions);
      break;
    case "date":
    case "time":
    case "number":
    case "range":
      input = $(inputTemplate);
      setupNumberLikeInput(input, finalOptions);
      break;
    case "select":
      input = $(inputTemplate);
      setupSelectInput(input, finalOptions);
      break;
    case "checkbox":
      // checkboxes have to nest within a containing element
      input = $(`<div class="bootprompt-checkbox-list"></div>`);
      setupCheckbox(input, finalOptions, inputTemplate);
      break;
    case "radio":
      // radio buttons have to nest within a containing element
      // tslint:disable-next-line:no-jquery-raw-elements
      input = $("<div class='bootprompt-radiobutton-list'></div>");
      setupRadio(input, finalOptions, inputTemplate);
      break;
    default:
      // tslint:disable-next-line:no-any
      const q: never = (finalOptions as any).inputType as never;
      throw new Error(`Unknown input type: ${q}`);
  }

  // Handles the 'cancel' action
  (buttons.cancel as Button).callback = finalOptions.onEscape =
    function (): boolean | undefined {
      // tslint:disable-next-line:no-invalid-this
      return finalCallback.call(this, null);
    };

  // Prompt submitted - extract the prompt value. This requires a bit of work,
  // given the different input types available.
  // tslint:disable-next-line:no-non-null-assertion
  (buttons.confirm as Button).callback = function (): boolean | undefined {
    let value: string | string[];

    switch (finalOptions.inputType) {
      case "checkbox":
        value = input.find("input:checked").map(function (): string {
          // tslint:disable-next-line:no-invalid-this
          return $(this).val() as string;
        }).get();
        break;
      case "radio":
        value = input.find("input:checked").val() as string;
        break;
      default:
        const rawInput = input[0] as unknown as { checkValidity(): boolean };
        if (rawInput.checkValidity !== undefined && !rawInput.checkValidity()) {
          // prevents button callback from being called
          return false;
        }

        value = input.val() as string;
    }

    // tslint:disable-next-line:no-invalid-this
    return finalCallback.call(this, value);
  };

  const form = $(templates.form);
  form.append(input);

  const { message } = finalOptions;
  if (typeof message === "string" && message.trim() !== "") {
    // Add the form to whatever content the user may have added.
    // tslint:disable-next-line:no-inner-html
    form.prepend($(templates.promptMessage).html(message));
  }

  finalOptions.message = form;

  // Generate the dialog
  const promptDialog = dialog(finalOptions);

  form.on("submit", (e) => {
    e.preventDefault();
    // Fix for SammyJS (or similar JS routing library) hijacking the form post.
    e.stopPropagation();

    // tslint:disable-next-line:no-suspicious-comment
    // @TODO can we actually click *the* button object instead?
    // e.g. buttons.confirm.click() or similar
    promptDialog.find(".bootprompt-accept").trigger("click");
  });

  // clear the existing handler focusing the submit button...
  // ...and replace it with one focusing our input, if possible
  promptDialog.off("shown.bs.modal").on("shown.bs.modal", () => {
    input.focus();
  });

  if (shouldShow === true) {
    promptDialog.modal("show");
  }

  return promptDialog;
}

//
// INTERNAL FUNCTIONS
//

/**
 * Get localized text from a locale. Defaults to ``en`` locale if no locale
 * provided or a non-registered locale is requested.
 *
 * @param key The field to get from the locale.
 *
 * @param locale The locale name.
 *
 * @returns The field from the locale.
 */
function getText(key: LocaleField, locale: string): string {
  const labels = definedLocales[locale];

  return labels !== undefined ? labels[key] : definedLocales.en[key];
}

/**
 *
 * Make buttons from a series of labels. All this does is normalise the given
 * labels and translate them where possible.
 *
 * @param labels The button labels.
 *
 * @param locale A locale name.
 *
 * @returns The created buttons.
 *
 */
function makeButtons(labels: string[], locale: string): Buttons {
  const buttons: Buttons = Object.create(null);

  for (const label of labels) {
    const value = label.toUpperCase();

    // tslint:disable-next-line:no-any
    if (!LOCALE_FIELDS.includes(value as any)) {
      throw new Error(`${value} is not a valid locale field`);
    }

    buttons[label.toLowerCase()] = {
      label: getText(value as LocaleField, locale),
    };
  }

  return buttons;
}

type SpecializedOptions = AlertOptions | ConfirmOptions | PromptOptions;

/**
 * Produce a DialogOptions object from the options, or arguments passed to the
 * specialized functions (alert, confirm, prompt).
 *
 * @param kind The kind of specialized function that was called.
 *
 * @param labels The button labels that the specialized function uses.
 *
 * @param properties The properties to which the ``options`` and ``callback``
 * arguments should be mapped.
 *
 * @param optionsOrString: The first argument of the specialized functions is
 * either an options object, or a string. The value of that first argument must
 * be passed here.
 *
 * @param callback The second argument (optional) to the specialized functions
 * is a callback. It must be passed here.
 *
 * @returns Options to pass to [[dialog]].
 */
function mergeDialogOptions<T extends SpecializedOptions>(
  kind: string,
  labels: string[],
  properties: [keyof T, keyof T],
  optionsOrString: string | T,
  callback?: T["callback"]): T & DialogOptions & { buttons: Buttons } {
  let locale;
  let swapButtons;
  if (typeof optionsOrString !== "string") {
    locale = optionsOrString.locale !== undefined ? optionsOrString.locale :
      defaults.locale;
    swapButtons = optionsOrString.swapButtonOrder !== undefined ?
      optionsOrString.swapButtonOrder : defaults.swapButtonOrder;
  }
  else {
    ({ locale, swapButtons } = defaults);
  }

  const orderedLabels = swapButtons ? labels.reverse() : labels;

  //  build up a base set of dialog properties
  const baseOptions = {
    className: `bootprompt-${kind}`,
    buttons: makeButtons(orderedLabels, locale),
  };

  // merge the generated base properties with user supplied arguments
  const merged =
    $.extend(
      true, // deep merge
      {}, // ensure the target is an empty, unreferenced object
      baseOptions, // the base options for this dialog (often just buttons)
      // args could be an object or array; if it's an array properties will
      // map it to a proper options object
      (callback !== undefined || typeof optionsOrString === "string") ? {
        __proto__: null,
        [properties[0]]: optionsOrString,
        [properties[1]]: callback,
      } as unknown as T :
      optionsOrString,
    ) as T & DialogOptions & typeof baseOptions;

  // Ensure the buttons properties generated, *after* merging with user args are
  // still valid against the supplied labels

  // An earlier implementation was building a hash from ``buttons``. However,
  // the ``buttons`` array is very small. Profiling in other projects have shown
  // that for very small arrays, there's no benefit to creating a table for
  // lookup.
  for (const key in merged.buttons) {
    if (!orderedLabels.includes(key)) {
      throw new Error(`button key "${key}" is not allowed (options are \
${orderedLabels.join(" ")})`);
    }
  }

  return merged;
}

//  Filter and tidy up any user supplied parameters to this dialog.
//  Also looks for any shorthands used and ensures that the options
//  which are returned are all normalized properly
function sanitize(options: DialogOptions): SanitizedDialogOptions {
  if (typeof options !== "object") {
    throw new Error("Please supply an object of options");
  }

  if (options.message === undefined) {
    throw new Error("Please specify a message");
  }

  // make sure any supplied options take precedence over defaults
  const finalOptions = {...defaults, ...options};

  // no buttons is still a valid dialog but it's cleaner to always have
  // a buttons object to iterate over, even if it's empty
  let { buttons } = finalOptions;
  if (buttons === undefined) {
    buttons = finalOptions.buttons = Object.create(null) as {};
  }

  const total = Object.keys(buttons).length;

  let index = 0;
  // tslint:disable-next-line:forin
  for (const key in buttons) {
    let button = buttons[key];
    if ($.isFunction(button)) {
      // short form, assume value is our callback. Since button
      // isn't an object it isn't a reference either so re-assign it
      button = buttons[key] = {
        callback: button,
      };
    }

    // before any further checks make sure by now button is the correct type
    if ($.type(button) !== "object") {
      throw new Error(`button with key "${key}" must be an object`);
    }

    if (button.label === undefined) {
      // the lack of an explicit label means we'll assume the key is good enough
      button.label = key;
    }

    if (button.className === undefined) {
      const isPrimary =
        index === (finalOptions.swapButtonOrder === true ? 0 : total - 1);

      // always add a primary to the main option in a one or two-button dialog
      button.className = (total <= 2 && isPrimary) ?
        "btn-primary" :
        "btn-secondary btn-default";
    }
    index++;
  }

  // TS cannot infer that we have SanitizedDialogOptions at this point.
  return finalOptions as SanitizedDialogOptions;
}

function throwMaxMinError(name: string): never {
  throw new Error(`"max" must be greater than "min". See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-${name} \
for more information.`);
}

//  Handle the invoked dialog callback
function processCallback(e: JQuery.TriggeredEvent,
                         forDialog: JQuery,
                         callback:
                         ((this: JQuery,
                           e: JQuery.TriggeredEvent) => boolean | undefined) |
                         boolean | undefined):
void {
  e.stopPropagation();
  e.preventDefault();

  // By default we assume a callback will get rid of the dialog, although it is
  // given the opportunity to override this so, if the callback can be invoked
  // and it *explicitly returns false* then we keep the dialog active...
  // otherwise we'll bin it
  if (!($.isFunction(callback) && callback.call(forDialog, e) === false)) {
    forDialog.modal("hide");
  }
}

// Helper function, since the logic for validating min and max attributes is
// almost identical
function validateMinOrMaxValue(input: JQuery,
                               name: "min" | "max",
                               options: NumericPromptOptions |
                               DatePromptOptions | TimePromptOptions): void {
  const value = options[name];
  if (value === undefined) {
    return;
  }

  const compareValue = options[name === "min" ? "max" : "min"];
  input.attr(name, value);

  // Type inference fails to realize the real type of value...
  switch (options.inputType) {
    case "date":
      if (!/(\d{4})-(\d{2})-(\d{2})/.test(value as string)) {
        console.warn(`Browsers which natively support the "date" input type \
expect date values to be of the form "YYYY-MM-DD" (see ISO-8601 \
https://www.iso.org/iso-8601-date-and-time-format.html). Bootprompt does not \
enforce this rule, but your ${name} value may not be enforced by this \
browser.`);
      }
      break;
    case "time":
      if (!/([01][0-9]|2[0-3]):[0-5][0-9]?:[0-5][0-9]/.test(value as string)) {
        throw new Error(`"${name}" is not a valid time. See \
https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html\
#form.data.time for more information.`);
      }

      // tslint:disable-next-line:no-non-null-assertion
      if (!(compareValue === undefined || options.max! > options.min!)) {
        return throwMaxMinError(name);
      }
      break;
    default:
      if (isNaN(value as number)) {
        throw new Error(`"${name}" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-${name} \
for more information.`);
      }

      // tslint:disable-next-line:no-non-null-assertion
      if (!(compareValue === undefined || options.max! > options.min!) &&
          !isNaN(compareValue as number)) {
        return throwMaxMinError(name);
      }
  }
}

//  Register the default locale
addLocale("en", {
  OK: "OK",
  CANCEL: "Cancel",
  CONFIRM: "OK",
});
