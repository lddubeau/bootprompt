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
const version = "6.0.0-beta.1";

// But export this.
/** Bootprompt's version */
export const VERSION = version;

/**
 * The names of the fields that should be defined in a [[Locale]].
 */
export type LocaleField = "OK" | "CANCEL" | "CONFIRM";

/** A locale specification. */
export type LocaleSpec = Record<LocaleField, string>;

/** A locale */
export interface Locale {
  /** The name of the locale. */
  name: string;

  /**
   * The specification of the locale, which determines how to translate
   * each field.
   */
  spec: LocaleSpec;
}

const LOCALE_FIELDS: LocaleField[] = ["OK",  "CANCEL", "CONFIRM"];

const definedLocales: Record<string, LocaleSpec> = Object.create(null);

/**
 * Data which we can insert into a DOM document. A string will be interpreted as
 * plain HTML to create DOM nodes.
 */
export type DocumentContent =
  string | Element | DocumentFragment | Text | JQuery;

/**
 * This is the kind of callback all buttons accept.
 *
 * @param this This is set to the jQuery object that models the modal.
 *
 * @param event The jQuery event that triggered the button.
 *
 * @returns ``false`` to keep the modal up. Anything else will hide the modal.
 */
export type ButtonCallback =
  (this: JQuery, event: JQuery.TriggeredEvent) => boolean | void;

/**
 * This interface provides the detailed way to specify a modal button.
 */
export interface Button {
  /**
   * The name of the button shown to the user. The buttons for a modal are
   * specified by a plain JS object with fields whose values conform to the
   * [[Button]] interface. (See [[Buttons]].) If a label is not specified, this
   * fields gets a value from the key with which the [[Button]] object is
   * associated in the map.
   */
  label?: string;

  /** An additional class name to give to the button. */
  className?: string;

  /** A callback to call when the button is clicked. */
  callback?: ButtonCallback;
}

/**
 * Used internally after the buttons specifications for a modal have been
 * processed to a sanitized form. After sanitization, all labels and class names
 * are set.
 */
interface SanitizedButton extends Button {
  label: string;
  className: string;
}

/**
 * A button specification. A button can be specified in one of two ways: by
 * providing a detailed object, or by only providing the button callback and
 * letting Bootprompt use defaults for the rest.
 */
export type ButtonSpec = Button | ButtonCallback;

/**
 * We pass an object of this shape to specify all the buttons to be shown in a
 * modal.
 */
export interface Buttons {
  // We want | undefined here so that we can declare specific names as being
  // optional.
  [key: string]:  ButtonSpec | undefined;
}

/**
 * Used internally after the buttons specifications for a modal have been
 * processed to a sanitized form.
 */
interface SanitizedButtons extends Buttons {
  [key: string]: SanitizedButton;
}

/**
 * A "specialized button" is a button for one of the specialized functions. This
 * interface eliminates the ``callback`` field. The specialized functions
 * overwrite any callback set on these buttons with their own callbacks, so it
 * is not sensible to allow setting ``callback``.
 */
export interface SpecializedButton extends Button {
  callback?: never;
}

/**
 * [[alert]] only takes the ``ok`` button, and so its button specification
 * *must* conform to this interface.
 */
export interface OkButton extends Buttons {
  ok?: SpecializedButton;
}

/**
 * [[confirm]] and [[prompt]] only take the ``confirm`` and ``cancel`` buttons,
 * so their button specification *must* conform to this interface.
 */
export interface ConfirmCancelButtons extends Buttons {
  confirm?: SpecializedButton;
  cancel?: SpecializedButton;
}

/**
 * The set of options which is common to [[alert]], [[confirm]], [[prompt]] and
 * [[dialog]].
 */
export interface CommonOptions {
  /**
   * A message to show in the modal. This is what the modal is asking of the
   * user.
   */
  message?: DocumentContent;

  /**
   * The title of the modal. This appears in the modal header.
   */
  title?: DocumentContent;

  /**
   * Whether to immediately show the modal.
   */
  show?: boolean;

  /**
   * Specifies whether or not to use a backdrop for the modal.
   *
   * - Leaving this option unset is equivalent to setting it to ``"static"``.
   *
   * - ``"static"`` means "display a backdrop that does not affect the modal".
   *
   * - ``true`` means "display a backdrop that closes the modal when clicked on.
   *
   * - ``false`` means don't display a backdrop.
   */
  backdrop?: boolean | "static";

  /**
   * Should the modal have a close button in its header?
   *
   * Default: ``true``.
   */
  closeButton?: boolean;

  /**
   * Should the modal be animated?
   *
   * Default: ``true``.
   */
  animate?: boolean;

  /**
   * An additional class name to add to the modal. This can be a list of space
   * separated names, which will all be added to the name.
   */
  className?: string;

  /**
   * The modal size. Bootstrap provides three sizes: default, large and small.
   *
   * - Not setting this option selects the default size.
   *
   * - ``"large"`` selects the large size.
   *
   * - ``"small"`` selects the small size.
   *
   * **Requires Bootstrap 3.1.0 or newer.**
   */
  size?: "large" | "small";

  /**
   * Which locale to use when generating predefined buttons.
   *
   * Default: ``en``.
   */
  locale?: string;

  /**
   * Whether to swap the button order. The effect varies depending on what
   * function is used:
   *
   * + Since [[alert]] creates a dialog with only one button, it has no visible
   * effect.
   *
   * + For [[confirm]] and [[prompt]] this reverses the order of the
   * cancel/confirm buttons.  The default order is cancel and then confirm. The
   * reverse order is confirm and then cancel.
   *
   * + For [[dialog]] this changes which button is considered "primary". The
   * default is to treat the first button as primary. In reverse, the last
   * button is primary.
   *
   * Default: ``false``.
   */
  swapButtonOrder?: boolean;

  /**
   * Whether to center the modal vertically.
   *
   * **Requires Bootstrap 4.1.0 or newer.**
   *
   * Default: ``false``.
   */
  centerVertical?: boolean;

  /**
   * The container for the modal. The modal HTML markup needs to be put
   * somewhere in the page. This specifies where to put it.
   *
   * Default: ``document.body``.
   */
  container?: string | Element | JQuery;
}

/**
 * This are the options that pertain to the [[dialog]] function.
 */
// tslint:disable-next-line:no-any
export interface DialogOptions extends CommonOptions{
  message: DocumentContent;

  /**
   * Specifies what to do if the user hits ``ESC`` on the keyboard.
   *
   * - Leaving this value unset is equivalent to setting it to ``true``.
   *
   * - ``true`` means "dismiss the modal".
   *
   * - ``false`` means "keep the modal displayed".
   *
   * - If a button callback is passed, the callback is called and if it returns
   *   ``false`` the modal remains displayed. Any other value dismisses the
   *   modal.
   */
  onEscape?: boolean | ButtonCallback;

  /**
   * Specifies a callback to call when the user clicks the close button that may
   * be optionally shown in the modal header (when [[closeButton]] is ``true``).
   *
   * If this option is not set, the default behavior is to close the modal.
   *
   * If this option is set, then the modal will remain displayed if the callback
   * returns ``false``. Any other value dismisses the modal.
   */
  onClose?: ButtonCallback;

  /**
   * The list of buttons to show in the dialog.
   */
  buttons?: Buttons;
}

/**
 * Used internally after the dialog options have been sanitized. The
 * sanitization process adds default values, etc.
 */
interface SanitizedDialogOptions extends DialogOptions {
  container: string | Element | JQuery;
  buttons: SanitizedButtons;
}

/**
 * Options that are supported by the [[alert]] function.
 */
export interface AlertOptions extends CommonOptions {
  /**
   * A callback for the modal as a whole. This callback is called when the user
   * performs an action that may dismiss the modal.
   *
   * @returns A return value of ``false`` keeps the modal open. Anything else
   * closes it.
   */
  callback?(this: JQuery): boolean | void;

  /** Alerts show only one button. */
  buttons?: OkButton;

  /**
   * Specifies what to do if the user hits ``ESC`` on the keyboard.
   *
   * - Leaving this value unset is equivalent to setting it to ``true``.
   *
   * - ``true`` invoke [[callback]].
   *
   * - ``false`` do not invoke [[callback]].
   *
   * - If a button callback is passed, this callback is called and if it returns
   *   ``false`` [[callback]] is not invoked. Any other value invokes
   *   [[callback]].
   */
  onEscape?: boolean | ButtonCallback;

  /**
   * Specifies a callback to call when the user clicks the close button that may
   * be optionally shown in the modal header (when [[closeButton]] is ``true``).
   *
   * If this option is not set, the default behavior is call [[callback]].
   *
   * If this option is set, this callback is called and if it returns
   * ``false``, [[callback]] is not invoked. Any other value invokes
   * [[callback]].
   *
   * The default value is ``undefined``.
   */
  onClose?: ButtonCallback;
}

/**
 * Options common to the functions that show confirm and cancel buttons
 * ([[confirm]] and [[prompt]]).
 */
export interface ConfirmCancelCommonOptions {
  /** Only the confirm and cancel buttons can be customized. */
  buttons?: ConfirmCancelButtons;

  /**
   * Specifies what to do if the user hits ``ESC`` on the keyboard.
   *
   * - Leaving this value unset is equivalent to setting it to ``true``.
   *
   * - ``true`` invoke [[callback]].
   *
   * - ``false`` do not invoke [[callback]].
   *
   * - If a button callback is passed, this callback is called and if it returns
   *   ``false`` [[callback]] is not invoked. Any other value invokes
   *   [[callback]].
   *
   * If [[callback]] is invoked due to this option, it is invoked with the
   * value ``false``. That is, the user's action is interpreted as a
   * cancellation.
   */
  onEscape?: boolean | ButtonCallback;

  /**
   * Specifies a callback to call when the user clicks the close button that may
   * be optionally shown in the modal header (when [[closeButton]] is ``true``).
   *
   * If this option is not set, the default behavior is call [[callback]].
   *
   * If this option is set, this callback is called and if it returns
   * ``false``, [[callback]] is not invoked. Any other value invokes
   * [[callback]].
   *
   * If [[callback]] is invoked due to this option, it is invoked with the
   * value ``false``. That is, the user's action is interpreted as a
   * cancellation.
   *
   * The default value is ``undefined``.
   */
  onClose?: ButtonCallback;
}

/**
 * The options that are supported by the [[confirm]] function.
 */
export interface ConfirmOptions extends CommonOptions,
ConfirmCancelCommonOptions {
  message: DocumentContent;

  /**
   * A callback for the modal as a whole. This callback is called when the user
   * performs an action that may dismiss the modal.
   *
   * @param value ``true`` if the user confirmed, ``false`` otherwise.
   *
   * @returns A return value of ``false`` keeps the modal open. Anything else
   * closes it.
   */
  callback?(this: JQuery, value: boolean): boolean | void;
}

/**
 * The options that are supported by the [[prompt]] function, irrespective of
 * what ``inputType`` is used.
 */
export interface PromptCommonOptions<T extends unknown>
  extends CommonOptions, ConfirmCancelCommonOptions {
  title: DocumentContent;

  /**
   * A callback for the modal as a whole. This callback is called when the user
   * performs an action that may dismiss the modal.
   *
   * @param value ``null`` if the user canceled the modal. Otherwise, it is the
   * value of the ``input`` element.
   *
   * @returns A return value of ``false`` keeps the modal open. Anything else
   * closes it.
   */
  callback?(this: JQuery, value: T | null): boolean | void;

  /**
   * If ``pattern`` is set, the prompt will not close if the input value does
   * not match the pattern. Internally, this option uses the property of the
   * same name on the ``input`` element.
   *
   * It can be used for any input type, but generally only used for ``text``
   * inputs, normally as a fallback for ``email``, ``time``, ``date``,
   * ``number`` or ``range`` inputs where native browser support for those types
   * is lacking.
   *
   * Default: unset, which means that the input is not validated.
   */
  pattern?: string;
}

/**
 * The [[prompt]] options that are supported when the ``inputType`` is one of
 * the textual inputs.
 */
export interface TextPromptOptions extends PromptCommonOptions<string> {
  /**
   * These input types are all textual input types. These input type generate an
   * ``input`` (or ``textarea``) element with the following classes:
   *
   * | ``inputType``  | ``className``                 |
   * | ---------------| ----------------------------- |
   * | ``"text"``     | ``bootprompt-input-text``     |
   * | ``"password"`` | ``bootprompt-input-password`` |
   * | ``"textarea"`` | ``bootprompt-input-textarea`` |
   * | ``"email"``    | ``bootprompt-input-email``    |
   *
   * Default: ``"text"``.
   */
  inputType?: "text" | "password" | "textarea" | "email";

  /**
   * An initial value for the input type.
   *
   * Default: ``undefined``.
   */
  value?: string;

  /**
   * Set a maximum length for the input. Users won't be able to type more than
   * the limit established here. Must be a positive numeric value.
   *
   * Default: ``undefined``, which means there's no limit.
   */
  maxlength?: number;

  /**
   * Use this option to provide "helper" text displayed in the text field prior
   * to the user entering anything.
   *
   * There is no limit on the amount of text you may use for your placeholder,
   * but keep in mind that the placeholder disappears when the input either has
   * focus or has a value (depending on the browser). Use the ``message`` option
   * instead of this option to provide help text which you want to always be
   * visible.
   *
   * Default: ``undefined``, which means no placeholder.
   */
  placeholder?: string;

  /**
   * Set this option to ``true`` to require an input value. When ``true``, the
   * prompt will not close if the input value is ``null``, an empty string, or
   * fails the input type's built-in validation constraints.
   *
   * Default: ``undefined``.
   */
  required?: boolean;
}

/**
 * The [[prompt]] options that are supported when the ``inputType`` is one of
 * the numeric inputs.
 */
export interface NumericPromptOptions extends PromptCommonOptions<string> {
  /**
   * These input types are the numeric inputs. These input type generate an
   * ``input`` with the following classes:
   *
   * | ``inputType``  | ``className``              |
   * |----------------|----------------------------|
   * | ``"number"``   | ``bootprompt-input-number``|
   * | ``"range"``    | ``bootprompt-input-range`` |
   *
   * Default: ``"text"``.
   */
  inputType: "number" | "range";

  /**
   * See [[TextPromptOptions.placeholder]].
   */
  placeholder?: string;

  /**
   * An initial value for the input type. Note that even though we are dealing
   * with numeric inputs, the value is a string.
   *
   * **DESIGN NOTE**: If you were to do ``input.value = 1`` directly, the number
   * would automagically be converted to a string by the browser. This automatic
   * conversion of numbers to strings is not formally supported by
   * Bootprompt. The reason is that (again due to the default way the DOM works)
   * when retreiving values from the ``input`` element, the values are always
   * strings. Making the API symmetrical (put a ``number`` in, get a ``number``
   * out) would require more work than reasonable. Note that the DOM
   * specifications do not provide any automagic conversion to help in this
   * endeavor. If you read ``input.value``, it will always be a string quite
   * irrespective of whether you assigned a number to it.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string;

  /* tslint:disable:max-line-length */
  /**
   * The minimum value allowed by the input.
   *
   * See the MDN article for
   * [``min``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#min)
   * for more information.
   *
   * Default: ``undefined``, which means no minimum value.
   */
  min?: string;
  /* tslint:enable:max-line-length */

  /* tslint:disable:max-line-length */
  /**
   * The maximum value allowed by the input.
   *
   * See the MDN article for
   * [``max``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#max)
   * for more information.
   *
   * Default: ``undefined``, which means no maximum value.
   */
  max?: string;
  /* tslint:enable:max-line-length */

  /* tslint:disable:max-line-length */
  /**
   * Can be the string value ``"any"`` (the default), or a positive numeric
   * value.
   *
   * See the
   * [MDN article](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#step)
   * for more information.
   *
   * Default: ``undefined``, which means ``"any"``.
   */
  step?: string;
  /* tslint:enable:max-line-length */

  /**
   * See [[TextPromptOptions.required]].
   */
  required?: boolean;
}

/**
 * The [[prompt]] options that are supported when the ``inputType`` is
 * ``"time"``.
 */
export interface TimePromptOptions extends PromptCommonOptions<string> {
  /**
   * An ``inputType`` of value ``"time"`` creates an ``input`` with the class
   * name ``bootprompt-input-time``
   */
  inputType: "time";

  /**
   * See [[TextPromptOptions.placeholder]].
   */
  placeholder?: string;

  /**
   * An initial value for the input type.
   *
   * A string of the form ``HH:MM:SS``, where ``HH`` can be any zero-padded
   * value between 00 and 23 and ``MM`` and ``SS`` can be any zero-padded number
   * between 00 and 59.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string;

  /* tslint:disable:max-line-length */
  /**
   * The minimum value allowed by the input. Must be in the same format as
   * [[value]].
   *
   * See the MDN article for
   * [``min``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time#min)
   * for more information.
   *
   * Default: ``undefined``, which means no minimum value.
   */
  min?: string;
  /* tslint:enable:max-line-length */

  /* tslint:disable:max-line-length */
  /**
   * The maximum value allowed by the input. Must be in the same format as
   * [[value]].
   *
   * See the MDN article for
   * [``max``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time#max)
   * for more information.
   *
   * Default: ``undefined``, which means no maximum value.
   */
  max?: string;
  /* tslint:enable:max-line-length */

  /* tslint:disable:max-line-length */
  /**
   * Can be the string value ``"any"`` (the default), or a positive numeric
   * value. For ``"time"`` inputs, this is a value in seconds.
   *
   * See the [MDN
   * article](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time#step)
   * for more information.
   *
   * Default: ``undefined``, which means ``"any"``.
   */
  step?: string;
  /* tslint:enable:max-line-length */

  /**
   * See [[TextPromptOptions.required]].
   */
  required?: boolean;
}

/**
 * The [[prompt]] options that are supported when the ``inputType`` is
 * ``"date"``.
 */
export interface DatePromptOptions extends PromptCommonOptions<string> {
  /**
   * An ``inputType`` of value ``"date"`` creates an ``input`` with the class
   * name ``bootprompt-input-date``
   */
  inputType: "date";

  /**
   * See [[TextPromptOptions.placeholder]].
   */
  placeholder?: string;

  /**
   * An initial value for the input type.
   *
   * A string of the form ``YYYY-MM-DD``, where ``YYYY`` can be any zero-padded
   * value greater than 0000, ``MM`` can be any zero-padded number between 01
   * and 12, and ``DD`` can be any zero-padded number between 01 and 31.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string;

  /* tslint:disable:max-line-length */
  /**
   * The minimum value allowed by the input. Must be in the same format as
   * [[value]].
   *
   * See the MDN article for
   * [``min``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#min)
   * for more information.
   *
   * Default: ``undefined``, which means no minimum value.
   */
  min?: string;
  /* tslint:enable:max-line-length */

  /* tslint:disable:max-line-length */
  /**
   * The maximum value allowed by the input. Must be in the same format as
   * [[value]].
   *
   * See the MDN article for
   * [``max``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#max)
   * for more information.
   *
   * Default: ``undefined``, which means no maximum value.
   */
  max?: string;
  /* tslint:enable:max-line-length */

  /**
   * See [[TextPromptOptions.required]].
   */
  required?: boolean;
}

/**
 * This interface provides options for the ``option`` elements that may be
 * created for ``select``-type inputs.
 */
export interface InputOption {
  /**
   * The text shown to the user for this ``option``.
   */
  text: string;

  /**
   * The value associated with this option.
   */
  value: string;

  /**
   * An optional group to which this option may be assigned. Options having the
   * same ``group`` value are grouped together.
   */
  group?: string;
}

/**
 * The options in common for all ``select``-type inputs.
 */
export interface CommonSelectOptions<T extends unknown>
extends PromptCommonOptions<T> {
  /**
   * An ``inputType`` of value ``"select"`` creates an ``input`` with the class
   * name ``bootprompt-input-select``.
   */
  inputType: "select";

  /** The list of specifications for the ``option`` elements in this input. */
  inputOptions: InputOption[];

  /**
   * See [[TextPromptOptions.required]].
   */
  required?: boolean;
}

/**
 * The options supported by ``"select"`` inputs that accept multiple values.
 */
export interface MultipleSelectPromptOptions
extends CommonSelectOptions<string[]> {
  /**
   * An initial value for the input type. It is possible to pass an array of
   * values to select multiple initial values.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string[] | string;

  /**
   * This option specifies whether this input accepts multiple values.
   *
   * It must be ``true`` for [[MultipleSelectPromptOptions]].
   */
  multiple: true;
}

/**
 * The options supported by ``"select"`` inputs that accept a single value.
 */
export interface SingleSelectPromptOptions extends CommonSelectOptions<string> {
  /**
   * An initial value for the input type.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string;

  /**
   * This option specifies whether this input accepts multiple values.
   *
   * It must be ``false`` or ``undefined`` for [[SingleSelectPromptOptions]].
   *
   * Default: ``undefined``, which is the same as ``false``.
   */
  multiple?: false;
}

/** All prompt options that create ``select`` inputs. */
export type SelectPromptOptions =
  MultipleSelectPromptOptions | SingleSelectPromptOptions;

/**
 * The options supported by ``"checkbox"`` inputs.
 */
export interface CheckboxPromptOptions
extends PromptCommonOptions<string | string[]> {
  /**
   * An ``inputType`` of value ``"checkbox"`` creates an ``input`` with the
   * class name ``bootprompt-input-checkbox``.
   */
  inputType: "checkbox";

  /**
   * An initial value for the input type. It is possible to pass an array of
   * values to select multiple initial values.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string | string[];

  /** The list of specifications for the checkboxes to create for this input. */
  inputOptions: InputOption[];
}

/**
 * The options supported by ``"radio"`` inputs.
 */
export interface RadioPromptOptions extends PromptCommonOptions<string> {
  /**
   * An ``inputType`` of value ``"radio"`` creates an ``input`` with the
   * class name ``bootprompt-input-radio``.
   */
  inputType: "radio";

  /**
   * An initial value for the input type.
   *
   * Default: ``undefined``, which means no initial value.
   */
  value?: string;

  /**
   * The list of specifications for the radio buttons to create for this
   * input.
   */
  inputOptions: InputOption[];
}

/**
 * All the options that [[prompt]] accepts.
 */
export type PromptOptions = TextPromptOptions | SelectPromptOptions |
  NumericPromptOptions | TimePromptOptions | DatePromptOptions |
  CheckboxPromptOptions | RadioPromptOptions;

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

let currentLocale = "en";
let animate = true;

//
// PUBLIC FUNCTIONS
//

/**
 * Get all known locales.
 *
 * @returns All known locales.
 */
export function locales(): Record<string, LocaleSpec>;
/**
 * Get a single locale.
 *
 * @param name The name of the locale to get.
 *
 * @returns The locale, or ``undefined`` if the locale is unknown.
 */
export function locales(name: string): LocaleSpec | undefined;
export function locales(name?: string):
Record<string, LocaleSpec> | LocaleSpec | undefined {
  return name !== undefined ? definedLocales[name] : definedLocales;
}

/**
 * Register a locale.
 *
 * @param name The name of the locale.
 *
 * @param values The locale specification, which determines how to translate
 * each field.
 *
 * @throws {Error} If a field is missing from ``values``.
 */
export function addLocale(name: string, values: LocaleSpec): void {
  for (const field of LOCALE_FIELDS) {
    if (typeof values[field] !== "string") {
      throw new Error(`Please supply a translation for "${field}"`);
    }
  }

  definedLocales[name] = values;
}

/**
 * Remove a locale. Removing an unknown locale is a no-op.
 *
 * @param name The name of the locale.
 *
 * @throws {Error} If ``name`` is ``"en"``. This locale cannot be removed.
 */
export function removeLocale(name: string): void {
  if (name !== "en") {
    delete definedLocales[name];
  }
  else {
    throw new Error(`"en" is used as the default and fallback locale and \
cannot be removed.`);
  }
}

/**
 * Set the default locale. Note that this function does not check whether the
 * locale is known.
 */
export function setLocale(name: string): void {
  currentLocale = name;
}

/**
 * Set the ``animate`` flag. When the flag is on, the modals produced by this
 * library are animated. When off, they are not animated.
 *
 * **NOTE**: The reason this function exists is to be able to turn off
 * animations during testing. Having the animations turned on can turn simple
 * tests into complicated afairs because it takes a while for a modal to show
 * up or be removed. We do not recommend using this function in production.
 */
export function setAnimate(value: boolean): void {
  animate = value;
}

/**
 * Hide all modals created with bootprompt.
 */
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

/**
 * This is a general-purpose function allowing to create custom dialogs.
 *
 * @param options The options that govern how the dialog is created.
 *
 * @returns The jQuery object which models the dialog.
 */
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
    onClose: finalOptions.onClose,
  };

  if (callbacks.onEscape === undefined) {
    callbacks.onEscape = true;
  }

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

  $modal.one("hidden.bs.modal", () => {
    $modal.off("escape.close.bp");
    $modal.off("click");
    $modal.remove();
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
    processCallback(e, $modal, callbacks.onClose);
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

function _alert(options: AlertOptions,
                callback: AlertOptions["callback"]): JQuery {
  const finalOptions = mergeDialogOptions("alert", ["ok"], options, callback);

  const { callback: finalCallback } = finalOptions;

  // tslint:disable-next-line:no-suspicious-comment
  // @TODO: can this move inside exports.dialog when we're iterating over each
  // button and checking its button.callback value instead?
  if (finalCallback !== undefined && typeof finalCallback !== "function") {
    throw new Error("alert requires callback property to be a function when \
provided");
  }

  const customCallback = function (this: JQuery): boolean | void {
    return typeof finalCallback === "function" ?
      finalCallback.call(this) : true;
  };

  (finalOptions.buttons.ok as Button).callback = customCallback;

  setupEscapeAndCloseCallbacks(finalOptions, customCallback);

  return dialog(finalOptions);
}

/**
 * This specialized function provides a dialog similar to the one provided by
 * the DOM ``alert()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param options The options governing how the dialog is created.
 *
 * @returns A jQuery object that models the dialog.
 */
export function alert(options: AlertOptions): JQuery;
/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``alert()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param message The message to display.
 *
 * @param callback The callback to call when the dialog has been dismissed.
 *
 * @returns A jQuery object that models the dialog.
 */
export function alert(message: string,
                      callback?: AlertOptions["callback"]): JQuery;
export function alert(messageOrOptions: string | AlertOptions,
                      callback?: AlertOptions["callback"]): JQuery {
  return _alert(typeof messageOrOptions === "string" ?
                { message: messageOrOptions } :
                messageOrOptions, callback);
}

/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``alert()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should await the promise returned by this function.
 *
 * @param messageOrOptions The message to display, or an object specifying the
 * options for the dialog.
 *
 * @returns A promise that resolves once the dialog has been dismissed.
 */
export async function alert$(messageOrOptions: string | AlertOptions):
Promise<void> {
  return new Promise((resolve) => {
    _alert(typeof messageOrOptions === "string" ?
           { message: messageOrOptions } : messageOrOptions,
           undefined)
      .one("hidden.bs.modal", () => {
        resolve();
      });
  });
}

function _confirm(options: ConfirmOptions,
                  callback: ConfirmOptions["callback"]): JQuery {
  const finalOptions = mergeDialogOptions("confirm", ["cancel", "confirm"],
                                          options, callback);

  const { callback: finalCallback, buttons } = finalOptions;

  // confirm specific validation; they don't make sense without a callback so
  // make sure it's present
  if (typeof finalCallback !== "function") {
    throw new Error("confirm requires a callback");
  }

  const cancelCallback = function (this: JQuery): boolean | void {
    return finalCallback.call(this, false);
  };

  (buttons.cancel as Button).callback = cancelCallback;

  setupEscapeAndCloseCallbacks(finalOptions, cancelCallback);

  (buttons.confirm as Button).callback =
    function (this: JQuery): boolean | void {
      return finalCallback.call(this, true);
    };

  return dialog(finalOptions);
}

/**
 * This specialized function provides a dialog similar to the one provided by
 * the DOM ``confirm()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param options The options governing how the dialog is created.
 *
 * @returns A jQuery object that models the dialog.
 */
export function confirm(options: ConfirmOptions): JQuery;
/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``confirm()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param message The message to display.
 *
 * @param callback The callback to call when the dialog has been dismissed.
 *
 * @returns A jQuery object that models the dialog.
 */
export function confirm(message: string,
                        callback: ConfirmOptions["callback"]): JQuery;
export function confirm(messageOrOptions: string | ConfirmOptions,
                        callback?: ConfirmOptions["callback"]): JQuery {
  return _confirm(typeof messageOrOptions === "string" ?
                  { message: messageOrOptions } :
                  messageOrOptions, callback);
}

/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``confirm()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should await the promise returned by this function.
 *
 * @param messageOrOptions The message to display, or an object specifying the
 * options for the dialog.
 *
 * @returns A promise that resolves once the dialog has been dismissed.
 */
export async function confirm$(messageOrOptions: string | ConfirmOptions):
Promise<boolean | null> {
  return new Promise((resolve) => {
    const options = typeof messageOrOptions === "string" ?
      { message: messageOrOptions } : messageOrOptions;
    const { callback } = options;

    let result: boolean | null = null;
    _confirm(options, function (this: JQuery, value: boolean): boolean | void {
      result = value;

      if (callback !== undefined) {
        return callback.call(this, result);
      }
    }).one("hidden.bs.modal", () => {
      resolve(result);
    });
  });
}

function setupTextualInput(input: JQuery,
                           options: TextPromptOptions & DialogOptions): void {
  const { value, placeholder, pattern, maxlength, required } = options;

  input.val(value!);

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
function _prompt(options: PromptOptions,
                 callback: PromptOptions["callback"]): JQuery {
  // prompt defaults are more complex than others in that users can override
  // more defaults
  const finalOptions = mergeDialogOptions("prompt", ["cancel", "confirm"],
                                          options, callback);
  if (typeof finalOptions.value === "number") {
    throw new Error("bootprompt does not allow numbers as values");
  }

  // capture the user's show value; we always set this to false before spawning
  // the dialog to give us a chance to attach some handlers to it, but we need
  // to make sure we respect a preference not to show it
  const shouldShow = finalOptions.show === undefined ? true : finalOptions.show;
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
      // The type assertion is needed in TS 3.2.4 which is the latest version
      // that typedoc currently runs. *grumble*...
      // tslint:disable-next-line:no-unnecessary-type-assertion
      const q: never = finalOptions.inputType as never;
      throw new Error(`Unknown input type: ${q}`);
  }

  const cancelCallback = function (this: JQuery): boolean | void {
    return finalCallback.call(this, null);
  };

  (buttons.cancel as Button).callback = cancelCallback;

  setupEscapeAndCloseCallbacks(finalOptions, cancelCallback);
  // Prompt submitted - extract the prompt value. This requires a bit of work,
  // given the different input types available.
  // tslint:disable-next-line:no-non-null-assertion
  (buttons.confirm as Button).callback = function (this: JQuery):
  boolean | void {
    let value: string | string[];

    switch (finalOptions.inputType) {
      case "checkbox":
        value = input.find("input:checked")
          .map(function (this: HTMLElement): string {
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
          value = input.find("option:selected")
            .map(function (this: HTMLElement): string {
              return $(this).val() as string;
            }).get();
        }
        else {
          value = input.val() as string;
        }
    }

    // TS type inferrence fails here.
    // tslint:disable-next-line:no-any
    return (finalCallback as any).call(this, value);
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

/**
 * This specialized function provides a dialog similar to the one provided by
 * the DOM ``prompt()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param options The options governing how the dialog is created.
 *
 * @returns A jQuery object that models the dialog.
 */
export function prompt(options: PromptOptions): JQuery;
/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``prompt()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should be placed within the callback function for
 * this dialog.
 *
 * @param message The message to display.
 *
 * @param callback The callback to call when the dialog has been dismissed.
 *
 * @returns A jQuery object that models the dialog.
 */
export function prompt(message: string,
                       callback: PromptOptions["callback"]): JQuery;
// tslint:disable-next-line:max-func-body-length
export function prompt(messageOrOptions: string | PromptOptions,
                       callback?: PromptOptions["callback"]): JQuery {
  return _prompt(typeof messageOrOptions === "string" ?
                 { title: messageOrOptions } :
                 messageOrOptions, callback);
}

export type PromiseValue<T extends PromptOptions> =
  Parameters<Exclude<T["callback"], undefined>>[0] | null;

/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``confirm()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should await the promise returned by this function.
 *
 * @param message The dialog title.
 *
 * @returns A promise that resolves once the dialog has been dismissed.
 */
export async function prompt$(message: string): Promise<string | null>;
/**
 * Specialized function that provides a dialog similar to the one provided by
 * the DOM ``confirm()`` function.
 *
 * **NOTE**: This function is non-blocking, so any code that must happen after
 * the dialog is dismissed should await the promise returned by this function.
 *
 * @param messageOrOptions An object specifying the options for the dialog.
 *
 * @returns A promise that resolves once the dialog has been dismissed.
 */
export async function prompt$<T extends PromptOptions>(options: T):
Promise<PromiseValue<T>>;
export async function prompt$<T extends PromptOptions>(
  messageOrOptions: string | T):
Promise<PromiseValue<T>> {
  return new Promise((resolve) => {
    const options = typeof messageOrOptions === "string" ?
      // tslint:disable-next-line:no-object-literal-type-assertion
      { title: messageOrOptions } as T : messageOrOptions;
    const { callback } = options;

    let result: PromiseValue<T> = null;
    _prompt(options, function (this: JQuery,
                               value: PromiseValue<T>): boolean | void {
      result = value;

      if (callback !== undefined) {
        // We assert the type of callback because TS's type inference fails
        // here.
        // tslint:disable-next-line:no-any
        return (callback as any).call(this, result);
      }
    }).one("hidden.bs.modal", () => {
      resolve(result);
    });
  });
}

//
// INTERNAL FUNCTIONS
//

function setupEscapeAndCloseCallbacks(options: DialogOptions,
                                      callback: ButtonCallback):
void {
  const { onEscape, onClose } = options;
  options.onEscape = (onEscape === undefined || onEscape === true) ?
    callback :
    function (this: JQuery, ev: JQuery.TriggeredEvent): boolean | void {
      if (onEscape === false || onEscape.call(this, ev) === false) {
        return false;
      }

      return callback.call(this, ev);
    };

  options.onClose = onClose === undefined ?
    callback :
    function (this: JQuery, ev: JQuery.TriggeredEvent): boolean | void {
      if (onClose.call(this, ev) === false) {
        return false;
      }

      return callback.call(this, ev);
    };
}

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
function mergeDialogOptions<T extends SpecializedOptions>(
  kind: string,
  labels: ButtonName[],
  options: T,
  callback?: T["callback"]):
T & DialogOptions & { buttons: Buttons } {
  // An earlier implementation was building a hash from ``buttons``. However,
  // the ``buttons`` array is very small. Profiling in other projects have shown
  // that for very small arrays, there's no benefit to creating a table for
  // lookup.
  //
  // An earlier implementation was also performing the check on the merged
  // options (the return value of this function) but that was pointless as it is
  // not possible to add invalid buttons with makeButtons.
  //
  for (const key in options.buttons) {
    // tslint:disable-next-line:no-any
    if (labels.indexOf(key as any) === -1) {
      throw new Error(`button key "${key}" is not allowed (options are \
${labels.join(" ")})`);
    }
  }

  const { locale, swapButtonOrder } = options;

  return $.extend(
    true, // deep merge
    Object.create(null), {
      className: `bootprompt-${kind}`,
      buttons: makeButtons(swapButtonOrder === true ? labels.slice().reverse() :
                           labels,
                           locale !== undefined ? locale : currentLocale),
    },
    options,
    { callback }) as T & DialogOptions & { buttons: Buttons };
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

  const finalOptions = {
    locale: currentLocale,
    backdrop: "static",
    animate,
    closeButton: true,
    show: true,
    container: document.body,
    ...options};

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
