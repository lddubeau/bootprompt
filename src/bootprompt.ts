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
const version = "5.0.0";

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

export type ButtonCallback =
  (this: JQuery, event: JQuery.TriggeredEvent) => boolean | void;

export interface Button {
  label?: string;
  className?: string;
  callback?: ButtonCallback;
}

interface SanitizedButton extends Button {
  label: string;
  className: string;
}

export type ButtonSpec = Button | ButtonCallback;

export interface Buttons {
  // We want | undefined here so that we can declare specific names as being
  // optional.
  [key: string]:  ButtonSpec | undefined;
}

interface SanitizedButtons extends Buttons {
  [key: string]: SanitizedButton;
}

export interface OkButton extends Buttons {
  ok: ButtonSpec;
}

export interface ConfirmCancelButtons extends Buttons {
  confirm?: ButtonSpec;
  cancel?: ButtonSpec;
}

// tslint:disable-next-line:no-any
export interface CommonOptions<T extends any[]> {
  message?: StringOrDocumentContent;
  title?: StringOrDocumentContent;
  callback?(...args: T): boolean | void;
  onEscape?: boolean | ButtonCallback;
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
  buttons: SanitizedButtons;
}

export interface AlertOptions extends CommonOptions<[]> {
  buttons?: OkButton;
}

export interface ConfirmOptions extends CommonOptions<[boolean]> {
  message: StringOrDocumentContent;
  buttons?: ConfirmCancelButtons;
}

export interface PromptCommonOptions<T extends unknown[]>
  extends CommonOptions<T> {
  title: StringOrDocumentContent;
  buttons?: ConfirmCancelButtons;
  pattern?: string;
}

export interface TextPromptOptions extends
PromptCommonOptions<[string | null]> {
  inputType?: "text" | "password" | "textarea" | "email";
  value?: string;
  maxlength?: number;
  placeholder?: string;
  required?: boolean;
}

export interface NumericPromptOptions extends
PromptCommonOptions<[string | null]> {
  inputType: "number" | "range";
  placeholder?: string;
  value?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}

export interface TimePromptOptions
extends PromptCommonOptions<[string | null]> {
  inputType: "time";
  placeholder?: string;
  value?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
}

export interface DatePromptOptions
extends PromptCommonOptions<[string | null]> {
  inputType: "date";
  placeholder?: string;
  value?: string;
  min?: string;
  max?: string;
  required?: boolean;
}

export interface InputOption {
  text: string;
  value: string;
  group?: string;
}

export interface CommonSelectOptions<T extends unknown[]>
  extends PromptCommonOptions<T> {
  inputType: "select";
  inputOptions: InputOption[];
  required?: boolean;
}

export interface MultipleSelectPromptOptions
extends CommonSelectOptions<[string[] | null]> {
  value?: string[] | string;
  multiple: true;
}

export interface SingleSelectPromptOptions
extends CommonSelectOptions<[string | null]> {
  value?: string;
  multiple?: false;
}

export type SelectPromptOptions =
  MultipleSelectPromptOptions | SingleSelectPromptOptions;

export interface CheckboxPromptOptions
extends PromptCommonOptions<[string | string[] | null]> {
  inputType: "checkbox";
  value?: string | string[];
  inputOptions: InputOption[];
}

export interface RadioPromptOptions
extends PromptCommonOptions<[string | null]> {
  inputType: "radio";
  value?: string;
  inputOptions: InputOption[];
}

export type PromptOptions = TextPromptOptions | SelectPromptOptions |
  NumericPromptOptions | TimePromptOptions | DatePromptOptions |
  CheckboxPromptOptions | RadioPromptOptions;

// On platforms that support Object.assign, use it.
// tslint:disable:no-any
const assign = (Object as any).assign !== undefined ?
  ((a: {}, b: {}) => (Object as any).assign(a, b)) :
  // For coverage purposes we don't run the tests on platforms that don't
  // have assign.
  /* istanbul ignore next */
  ((a: any, b: any) => $.extend(a, b));
// tslint:enable:no-any

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
  // Append `multiple` property to the select when using the `prompt` helper
  multiple: false,
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
export function setDefaults(name: string, value: unknown): void;
export function setDefaults(name: string | Record<string, unknown>,
                            value?: unknown): void {
  if (arguments.length === 2) {
    // allow passing of single key/value...
    defaults[name as string] = value;
  } else {
    // ... and as an object too
    assign(defaults, name);
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
/* istanbul ignore if: we do not test with incorrect environments. */
if (fnModal === undefined) {
  throw new Error(
    `"$.fn.modal" is not defined; please double check you have included \
the Bootstrap JavaScript library. See http://getbootstrap.com/javascript/ \
for more details.`);
}

/* istanbul ignore if: we do not test with incorrect environments. */
if (!fnModal.Constructor.VERSION) {
  throw new Error("Bootprompt cannot determine the version of Bootstrap used");
}

const fullBootstrapVersion = fnModal.Constructor.VERSION;
const bootstrapVersion =
  Number(fullBootstrapVersion.substring(0,
                                        fullBootstrapVersion.indexOf(".")));

/* istanbul ignore if: we do not test with incorrect environments. */
if (bootstrapVersion < 3) {
  throw new Error("Bootprompt does not work with Bootstrap 2 and lower.");
}

// Core dialog function
// tslint:disable-next-line:max-func-body-length cyclomatic-complexity
export function dialog(options: DialogOptions): JQuery {
  const finalOptions = sanitize(options);

  const $modal = $(templates.dialog);
  const modal = $modal[0];
  const innerDialog = modal.getElementsByClassName("modal-dialog")[0];
  const body = modal.getElementsByClassName("modal-body")[0] as HTMLElement;
  const footer = $(templates.footer)[0];

  const callbacks: Record<string, ButtonCallback | boolean | undefined> = {
    onEscape: finalOptions.onEscape,
  };

  const { buttons, backdrop, className, closeButton, message, size,
          title } = finalOptions;
  // tslint:disable-next-line:no-non-null-assertion
  const bpBody = body.getElementsByClassName("bootprompt-body")[0];
  if (typeof message === "string") {
    // tslint:disable-next-line:no-inner-html
    bpBody.innerHTML = message;
  }
  else {
    // tslint:disable-next-line:no-inner-html
    bpBody.innerHTML = "";
    $(bpBody).append(message);
  }

  let hadButtons = false;
  // tslint:disable-next-line:forin
  for (const key in buttons) {
    hadButtons = true;
    const b = buttons[key];
    const $button = $(templates.button);
    const button = $button[0];
    $button.data("bp-handler", key);
    // On IE10/11 it is not possible to just do x.classList.add(a, b, c).
    for (const cl of b.className.split(" ")) {
      button.classList.add(cl);
    }

    switch (key) {
      case "ok":
      case "confirm":
        button.classList.add("bootprompt-accept");
        break;

      case "cancel":
        button.classList.add("bootprompt-cancel");
        break;
      default:
    }

    // tslint:disable-next-line:no-inner-html
    button.innerHTML = b.label;
    footer.appendChild(button);

    callbacks[key] = b.callback;
  }

  // Only attempt to create buttons if at least one has been defined in the
  // options object.
  if (hadButtons) {
    // tslint:disable-next-line:no-non-null-assertion
    body.parentNode!.insertBefore(footer, body.nextSibling);
  }

  if (finalOptions.animate === true) {
    modal.classList.add("fade");
  }

  if (className !== undefined) {
    // On IE10/11 it is not possible to just do x.classList.add(a, b, c).
    for (const cl of className.split(" ")) {
      modal.classList.add(cl);
    }
  }

  if (size !== undefined) {
    // Requires Bootstrap 3.1.0 or higher
    /* istanbul ignore if: we don't systematically test with old versions */
    if (fullBootstrapVersion.substring(0, 3) < "3.1") {
      console.warn(`"size" requires Bootstrap 3.1.0 or higher. You appear \
to be using ${fullBootstrapVersion}. Please upgrade to use this option.`);
    }

    switch (size) {
      case "large":
        innerDialog.classList.add("modal-lg");
        break;
      case "small":
        innerDialog.classList.add("modal-sm");
        break;
      default:
        const q: never = size;
        throw new Error(`unknown size value: ${q}`);
    }
  }

  if (title !== undefined) {
    // tslint:disable-next-line:no-non-null-assertion
    body.parentNode!.insertBefore($(templates.header)[0], body);
    const modalTitle = modal.getElementsByClassName("modal-title")[0];
    if (typeof title === "string") {
      // tslint:disable-next-line:no-inner-html
      modalTitle.innerHTML = title;
    }
    else {
      // tslint:disable-next-line:no-inner-html
      modalTitle.innerHTML = "";
      $(modalTitle).append(title);
    }
  }

  if (closeButton === true) {
    const closeButtonEl = $(templates.closeButton)[0];

    if (title !== undefined) {
      const modalHeader = modal.getElementsByClassName("modal-header")[0];
      /* istanbul ignore else: we don't systematically test on old versions */
      if (bootstrapVersion > 3) {
        modalHeader.appendChild(closeButtonEl);
      }
      else {
        modalHeader.insertBefore(closeButtonEl, modalHeader.firstChild);
      }
    } else {
      body.insertBefore(closeButtonEl, body.firstChild);
    }
  }

  if (finalOptions.centerVertical !== undefined){
    // Requires Bootstrap 4.0.0 or higher
    /* istanbul ignore if: we don't systematically test with old versions */
    if (fullBootstrapVersion < "4.0.0") {
      console.warn(`"centerVertical" requires Bootstrap 4.0.0 or \
higher. You appear to be using ${fullBootstrapVersion}. Please upgrade to use \
this option.`);
    }

    innerDialog.classList.add("modal-dialog-centered");
  }

  // Bootstrap event listeners; these handle extra setup & teardown required
  // after the underlying modal has performed certain actions.

  // make sure we unbind any listeners once the dialog has definitively been
  // dismissed
  $modal.one("hide.bs.modal", function (e: JQuery.TriggeredEvent): void {
    // tslint:disable-next-line:no-invalid-this
    if (e.target === this) {
      $modal.off("escape.close.bp");
      $modal.off("click");
    }
  });

  $modal.one("hidden.bs.modal", function (e: JQuery.TriggeredEvent): void {
    // ensure we don't accidentally intercept hidden events triggered by
    // children of the current dialog. We shouldn't need to handle this anymore,
    // now that Bootstrap namespaces its events, but still worth doing.
    // tslint:disable-next-line:no-invalid-this
    if (e.target === this) {
      $modal.remove();
    }
  });

  $modal.one("shown.bs.modal", () => {
    // tslint:disable-next-line:no-non-null-assertion
    $(modal.querySelector(".btn-primary")!).trigger("focus");
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
    $modal.on("click.dismiss.bs.modal", (e: JQuery.TriggeredEvent) => {
      // The target varies in 3.3.x releases since the modal backdrop moved
      // *inside* the outer dialog rather than *alongside* it
      const backdrops =
        modal.getElementsByClassName("modal-backdrop");

      const target = backdrops.length !== 0 ?
        /* istanbul ignore next: we don't systematically test with 3.3.x */
        backdrops[0] :
        e.currentTarget;

      if (e.target !== target) {
        return;
      }

      $modal.trigger("escape.close.bp");
    });
  }

  $modal.on("escape.close.bp", (e: JQuery.TriggeredEvent) => {
    // the if statement looks redundant but it isn't; without it
    // if we *didn't* have an onEscape handler then processCallback
    // would automatically dismiss the dialog
    if (callbacks.onEscape === true ||
        typeof callbacks.onEscape === "function") {
      processCallback(e, $modal, callbacks.onEscape);
    }
  });

  $modal.on("click", ".modal-footer button",
             function (e: JQuery.TriggeredEvent): void {
               // tslint:disable-next-line:no-invalid-this
               const callbackKey = $(this).data("bp-handler");

               processCallback(e, $modal, callbacks[callbackKey]);
             });

  $modal.on("click", ".bootprompt-close-button", (e) => {
    // onEscape might be falsy but that's fine; the fact is
    // if the user has managed to click the close button we
    // have to close the dialog, callback or not
    processCallback(e, $modal, callbacks.onEscape);
  });

  $modal.on("keyup", (e) => {
    if (e.which === 27) {
      $modal.trigger("escape.close.bp");
    }
  });

  // The interface defined for $ messes up type inferrence so we have to assert
  // the type here.
  $(finalOptions.container as JQuery).append($modal);

  $modal.modal({
    backdrop: (backdrop === true || backdrop === "static") ? "static" : false,
    keyboard: false,
    show: false,
  });

  if (finalOptions.show === true) {
    $modal.modal("show");
  }

  return $modal;
}

function _alert(options: AlertOptions): JQuery {
  const finalOptions = mergeDialogOptions("alert", ["ok"], options);

  const { callback: finalCallback } = finalOptions;

  // tslint:disable-next-line:no-suspicious-comment
  // @TODO: can this move inside exports.dialog when we're iterating over each
  // button and checking its button.callback value instead?
  if (finalCallback !== undefined && typeof finalCallback !== "function") {
    throw new Error("alert requires callback property to be a function when \
provided");
  }

  // override the ok and escape callback to make sure they just invoke the
  // single user-supplied one (if provided)
  // tslint:disable-next-line:no-non-null-assertion
  (finalOptions.buttons.ok as Button).callback = finalOptions.onEscape =
    function (): boolean | void {
      return typeof finalCallback === "function" ?
        // tslint:disable-next-line:no-invalid-this
        finalCallback.call(this) : true;
    };

  return dialog(finalOptions);
}

// Helper function to simulate the native alert() behavior. **NOTE**: This is
// non-blocking, so any code that must happen after the alert is dismissed
// should be placed within the callback function for this alert.
export function alert(options: AlertOptions): JQuery;
export function alert(message: string,
                      callback?: AlertOptions["callback"]): JQuery;
export function alert(messageOrOptions: string | AlertOptions,
                      callback?: AlertOptions["callback"]): JQuery {
  return _alert(typeof messageOrOptions === "string" ?
                {
                  message: messageOrOptions,
                  callback,
                } :
                messageOrOptions);
}

function _confirm(options: ConfirmOptions): JQuery {
  const finalOptions = mergeDialogOptions("confirm", ["cancel", "confirm"],
                                           options);

  const { callback: finalCallback, buttons } = finalOptions;

  // confirm specific validation; they don't make sense without a callback so
  // make sure it's present
  if (typeof finalCallback !== "function") {
    throw new Error("confirm requires a callback");
  }

  // overrides; undo anything the user tried to set they shouldn't have
  // tslint:disable-next-line:no-non-null-assertion
  (buttons.cancel as Button).callback = finalOptions.onEscape =
    function (): boolean | void {
      // tslint:disable-next-line:no-invalid-this
      return finalCallback.call(this, false);
    };

  // tslint:disable-next-line:no-non-null-assertion
  (buttons.confirm as Button).callback = function (): boolean | void {
    // tslint:disable-next-line:no-invalid-this
    return finalCallback.call(this, true);
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
  return _confirm(typeof messageOrOptions === "string" ?
                  {
                    message: messageOrOptions,
                    callback,
                  } :
                  messageOrOptions);
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
                              options: NumericPromptOptions |
                              DatePromptOptions | TimePromptOptions): void {
  const { value, placeholder, pattern, required, inputType } = options;

  if (value !== undefined) {
    input.val(String(value));
  }

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
      const stepNumber = Number(step);
      if (step === "any" || (!isNaN(stepNumber) && stepNumber > 0)) {
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

function validateInputOptions(inputOptions: InputOption[]): void {
  for (const { value, text } of inputOptions) {
    if (value === undefined || text === undefined) {
      throw new Error(`each option needs a "value" and a "text" property`);
    }

    if (typeof value === "number") {
      throw new Error(`bootprompt does not allow numbers for "value" in \
inputOptions`);
    }
  }
}

function setupSelectInput(input: JQuery, options: SelectPromptOptions): void {
  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (!Array.isArray(inputOptions)) {
    throw new Error("Please pass an array of input options");
  }

  if (inputOptions.length === 0) {
    throw new Error("prompt with select requires at least one option \
value");
  }

  const { required, multiple } = options;

  if (required === true) {
    input.prop({ required: true });
  }

  if (multiple === true) {
    input.prop({ multiple: true });
  }

  validateInputOptions(inputOptions);

  let firstValue: string | undefined;
  const groups: Record<string, HTMLElement> = Object.create(null);
  for (const { value, text, group } of inputOptions) {
    // assume the element to attach to is the input...
    let elem = input[0];

    // ... but override that element if this option sits in a group
    if (group !== undefined && group !== "") {
      let groupEl = groups[group];
      if (groupEl === undefined) {
        groups[group] = groupEl = document.createElement("optgroup");
        groupEl.setAttribute("label", group);
      }

      elem = groupEl;
    }

    const o = $(templates.option);
    o.attr("value", value).text(text);
    elem.appendChild(o[0]);
    if (firstValue === undefined) {
      firstValue = value;
    }
  }

  // Conditions are such that an undefined firstValue here is an internal error.
  /* istanbul ignore if: we cannot cause this intentionally */
  if (firstValue === undefined) {
    throw new Error("firstValue cannot be undefined at this point");
  }

  // tslint:disable-next-line:forin
  for (const groupName in groups) {
    input.append(groups[groupName]);
  }

  input.val(options.value !== undefined ? options.value : firstValue);
}

function setupCheckbox(input: JQuery, options: CheckboxPromptOptions,
                       inputTemplate: string): void {
  const checkboxValues =
    Array.isArray(options.value) ? options.value : [options.value];
  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (inputOptions.length === 0) {
    throw new Error("prompt with checkbox requires options");
  }

  validateInputOptions(inputOptions);

  for (const { value, text } of inputOptions) {
    const checkbox = $(inputTemplate);

    checkbox.find("input").attr("value", value);
    checkbox.find("label").append(`\n${text}`);

    if (checkboxValues.indexOf(value) !== -1) {
      checkbox.find("input").prop("checked", true);
    }

    input.append(checkbox);
  }
}

function setupRadio(input: JQuery, options: RadioPromptOptions,
                    inputTemplate: string): void {
  // Make sure that value is not an array (only a single radio can ever be
  // checked)
  const { value: initialValue } = options;
  if (initialValue !== undefined && Array.isArray(initialValue)) {
    throw new Error(`prompt with radio requires a single, non-array value \
for "value".`);
  }

  const inputOptions = options.inputOptions !== undefined ?
    options.inputOptions : [];

  if (inputOptions.length === 0) {
    throw new Error("prompt with radio requires options");
  }

  validateInputOptions(inputOptions);

  // Radiobuttons should always have an initial checked input checked in a
  // "group".  If value is undefined or doesn't match an input option,
  // select the first radiobutton
  let checkFirstRadio = true;

  for (const { value, text } of inputOptions) {
    const radio = $(inputTemplate);

    radio.find("input").attr("value", value);
    radio.find("label").append(`\n${text}`);

    if (initialValue !== undefined && value === initialValue) {
      radio.find("input").prop("checked", true);
      checkFirstRadio = false;
    }

    input.append(radio);
  }

  if (checkFirstRadio) {
    input.find("input[type='radio']").first().prop("checked", true);
  }
}

// tslint:disable-next-line:max-func-body-length
export function _prompt(options: PromptOptions): JQuery {
  // prompt defaults are more complex than others in that users can override
  // more defaults
  const finalOptions = mergeDialogOptions("prompt", ["cancel", "confirm"],
                                           options);
  if (finalOptions.value === undefined) {
    finalOptions.value = defaults.value;
  }

  if (typeof finalOptions.value === "number") {
    throw new Error("bootprompt does not allow numbers as values");
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
  if (typeof finalCallback !== "function") {
    throw new Error("prompt requires a callback");
  }

  if (finalOptions.inputType === undefined) {
    finalOptions.inputType = "text";
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
    function (): boolean | void {
      // tslint:disable-next-line:no-invalid-this
      return finalCallback.call(this, null);
    };

  // Prompt submitted - extract the prompt value. This requires a bit of work,
  // given the different input types available.
  // tslint:disable-next-line:no-non-null-assertion
  (buttons.confirm as Button).callback = function (): boolean | void {
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

        if (finalOptions.inputType === "select" &&
            finalOptions.multiple === true) {
          value = input.find("option:selected").map(function (): string {
            // tslint:disable-next-line:no-invalid-this
            return $(this).val() as string;
          }).get();
        }
        else {
          value = input.val() as string;
        }
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

// Helper function to simulate the native prompt() behavior. **NOTE**: This is
// non-blocking, so any code that must happen after the prompt is dismissed
// should be placed within the callback function for this prompt.
export function prompt(options: PromptOptions): JQuery;
export function prompt(message: string,
                       callback: PromptOptions["callback"]): JQuery;
// tslint:disable-next-line:max-func-body-length
export function prompt(messageOrOptions: string | PromptOptions,
                       callback?: PromptOptions["callback"]): JQuery {
  return _prompt(typeof messageOrOptions === "string" ?
                 // tslint:disable-next-line:no-object-literal-type-assertion
                 {
                   title: messageOrOptions,
                   callback,
                 } as PromptOptions :
                 messageOrOptions);
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

type ButtonName = "ok" | "cancel" | "confirm";

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
function makeButtons(labels: ButtonName[], locale: string): Buttons {
  const buttons: Buttons = Object.create(null);

  for (const label of labels) {
    buttons[label.toLowerCase()] = {
      label: getText(label.toUpperCase() as LocaleField, locale),
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
 * @param options: The first argument of the specialized functions is either an
 * options object, or a string. The value of that first argument must be passed
 * here.
 *
 * @returns Options to pass to [[dialog]].
 */
function mergeDialogOptions<T extends SpecializedOptions>(kind: string,
                                                          labels: ButtonName[],
                                                          options: T):
T & DialogOptions & { buttons: Buttons } {
  let locale;
  let swapButtons;
  if (typeof options !== "string") {
    locale = options.locale !== undefined ? options.locale : defaults.locale;
    swapButtons = options.swapButtonOrder !== undefined ?
      options.swapButtonOrder : defaults.swapButtonOrder;
  }
  else {
    ({ locale, swapButtons } = defaults);
  }

  const orderedLabels = swapButtons ? labels.slice().reverse() : labels;

  //  build up a base set of dialog properties
  const baseOptions = {
    className: `bootprompt-${kind}`,
    buttons: makeButtons(orderedLabels, locale),
  };

  // merge the generated base properties with user supplied arguments
  const merged = $.extend(true, // deep merge
                          Object.create(null),
                          baseOptions,
                          options) as T & DialogOptions & typeof baseOptions;

  // Ensure the buttons properties generated, *after* merging with user args are
  // still valid against the supplied labels

  // An earlier implementation was building a hash from ``buttons``. However,
  // the ``buttons`` array is very small. Profiling in other projects have shown
  // that for very small arrays, there's no benefit to creating a table for
  // lookup.
  for (const key in merged.buttons) {
    // tslint:disable-next-line:no-any
    if (orderedLabels.indexOf(key as any) === -1) {
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
    if (typeof button === "function") {
      // short form, assume value is our callback. Since button
      // isn't an object it isn't a reference either so re-assign it
      button = buttons[key] = {
        callback: button,
      };
    }

    // before any further checks make sure by now button is the correct type
    if (typeof button !== "object") {
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
                         $forDialog: JQuery,
                         callback:
                         ((this: JQuery,
                           e: JQuery.TriggeredEvent) => boolean | void) |
                         boolean | undefined):
void {
  e.stopPropagation();
  e.preventDefault();

  // By default we assume a callback will get rid of the dialog, although it is
  // given the opportunity to override this so, if the callback can be invoked
  // and it *explicitly returns false* then we keep the dialog active...
  // otherwise we'll bin it
  if (!(typeof callback === "function" &&
        callback.call($forDialog, e) === false)) {
    $forDialog.modal("hide");
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

  const { min , max } = options;

  // Type inference fails to realize the real type of value...
  switch (options.inputType) {
    case "date":
      /* istanbul ignore if: we don't test the positive case */
      if (!/(\d{4})-(\d{2})-(\d{2})/.test(value)) {
        console.warn(`Browsers which natively support the "date" input type \
expect date values to be of the form "YYYY-MM-DD" (see ISO-8601 \
https://www.iso.org/iso-8601-date-and-time-format.html). Bootprompt does not \
enforce this rule, but your ${name} value may not be enforced by this \
browser.`);
      }
      break;
    case "time":
      if (!/([01][0-9]|2[0-3]):[0-5][0-9]?:[0-5][0-9]/.test(value)) {
        throw new Error(`"${name}" is not a valid time. See \
https://www.w3.org/TR/2012/WD-html-markup-20120315/datatypes.html\
#form.data.time for more information.`);
      }

      // tslint:disable-next-line:no-non-null-assertion
      if (!(compareValue === undefined || max! > min!)) {
        return throwMaxMinError(name);
      }
      break;
    default:
      // Yes we force the string into isNaN. It works.
      if (isNaN(value as unknown as number)) {
        throw new Error(`"${name}" must be a valid number. See \
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-${name} \
for more information.`);
      }

      const minNumber = Number(min);
      const maxNumber = Number(max);

      // tslint:disable-next-line:no-non-null-assertion
      if (!(compareValue === undefined || maxNumber > minNumber) &&
          // Yes we force the string into isNaN. It works.
          !isNaN(compareValue as unknown as number)) {
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
