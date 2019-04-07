<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?autorun=false"></script>
<style>
li.L0, li.L1, li.L2, li.L3,
li.L5, li.L6, li.L7, li.L8 {
  list-style-type: decimal !important;
}
</style>
<script>
function insertExample(title, fileName) {
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.setAttribute("title", title);
  iframe.src = `./frame.html?example-src=${fileName}`;
  iframe.height = 300;

  const pre = document.createElement("pre");
  pre.classList.add("prettyprint");
  pre.classList.add("linenums");

  const div = document.createElement("div");
  div.appendChild(pre);
  div.appendChild(iframe);
  document.currentScript.parentNode.insertBefore(div, document.currentScript);

  (async () => {
    pre.textContent = await (await fetch(`./bootprompt/${fileName}.js`)).text();
    PR.prettyPrint(undefined, div);
  })();
}
</script>

# Getting Started

## Installing

You can install via ``npm``:

``npm install bootprompt``

You can use unpkg to refer to bootprompt:

https://unpkg.com/bootprompt

## Dependencies

| Bootprompt version | Bootstrap  | jQuery   | Notes |
| -------------------|------------|----------|-------|
| 6.x                | >=3,<5*    | >= 1.9.1 |       |
| 5.x                | >=3,<5*    | >= 1.9.1 |       |

* Some options, like size, require Bootstrap 3.1.0 or higher.

## Usage Instructions

Once you’ve got your dependencies sorted, usage is fairly straightforward and
much like any other JavaScript library you’ve ever used. The library creates a
single global instance of a bootprompt object:

<!--prettify linenums=true-->
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My page</title>
    <!-- CSS dependencies -->
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css">
</head>
<body>
    <p>Content here. <a class="show-alert" href=#>Alert!</a></p>
    <!-- JS dependencies -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Bootstrap 4 dependency -->
    <script src="popper.min.js"></script>
    <script src="bootstrap.min.js"></script>
    <!-- bootprompt code -->
    <script src="bootprompt.min.js"></script>
    <script src="bootprompt.locales.min.js"></script>
    <script>
        $(document).on("click", ".show-alert", (e) => {
            bootprompt.alert("Hello world!", () => {
                console.log("Alert Callback");
            });
        });
    </script>
</body>
</html>
```

Note the order of the ``script`` references. Since Bootprompt is a wrapper
around Bootstrap's modal functionality, you need to include the libraries in
this order:

1. jQuery
2. Popper.js
3. Bootstrap
4. Bootprompt
5. Bootprompt Locales (optional - omit if you only need the default English
   locale)

# API Introduction

The main functions of Bootprompt's API can be divided into two groups:

* The specialized functions which create specialized dialogs: [[alert]],
  [[confirm]], [[prompt]], and their promise-returning equivalents.

* The general function [[dialog]] which creates custom dialogs.

The specialized functions can be grouped according to another criterion:

* Those that return the ``jQuery`` object which is the modal dialog that was
  created by the function, and report their results through callbacks:
  [[alert]], [[confirm]], [[prompt]].

* Those that return a promise which resolves to the result of the user
  interaction: [[alert$]], [[confirm$]], [[prompt$]].

The [[dialog]] function has no Promise-based counterpart because it does not
have a general "we're done" callback to call.

All Bootstrap modals, and thus all Bootprompt modals, unlike DOM ``alert()``,
``confirm()``, and ``prompt()`` calls, are non-blocking.  Keep that in mind when
using this API, as the functions provided by the API are **not** drop-in
replacements for the DOM functions they are inspired by.  Any code that depends
on the user's selection **must** be placed in the callback function, or wait for
the promise to resolve.

## The Callback-based API

### Alert

The [[alert]] function produce a dialog that behaves similarly to the DOM's
``alert()`` function.

<script>
  insertExample("Alert: Minimal Example", "alert-minimal-example");
</script>

Your message can also contain HTML.

<script>
  insertExample("Alert: With HTML", "alert-with-html");
</script>

If you have code that should not be evaluated until the user has dismissed the
alert, call it within the callback function:

<script>
  insertExample("Alert: With Callback", "alert-with-callback");
</script>

Alerts can be customized, using [[AlertOptions]]. Here's an example of a small
alert, using ``size``:

<!--prettify linenums=true-->
```
bootprompt.alert({
  size: "small",
  title: "Your Title",
  message: "Your message here...",
  callback: () => { /* callback code */ }
});
```

See [the examples section](#alert-examples) for more examples.

### Confirm

The [[confirm]] function produce a dialog that behaves similarly to the DOM's
``confirm()`` function. The dialog has a cancel and a confirm button. Pressing
the <kbd>ESC</kbd> key or clicking close (<i class="fa fa-times"></i>) dismisses
the dialog and invokes the callback as if the user had clicked the Cancel
button.

**Confirm dialogs require a callback function.**

The simplest method of using the ``confirm()`` dialog requires the text of the
message you wish to show and a callback to handle the user's selection. The
callback function is passed a value of ``true`` or ``false``, depending on which
button the user pressed.

<script>
  insertExample("Confirm: Basic Usage", "confirm-basic-usage");
</script>

Confirm dialogs can be customized, using [[ConfirmOptions]]. Here's an example
of a small dialog, using ``size``:

<!--prettify linenums=true-->
```
bootprompt.confirm({
  size: "small",
  message: "Are you sure?",
  callback: (result) => { /* result is a boolean; true = OK, false = Cancel*/ }
})
```

See [the examples section](#confirm-examples) for more examples.

### Prompt

The [[prompt]] function produce a dialog that behaves similarly to the DOM's
``prompt()`` function. Pressing the <kbd>ESC</kbd> key or clicking close
(<i class="fa fa-times"></i>) dismisses the dialog and invokes the callback as
if the user had clicked the Cancel button.

**Prompt dialogs require a callback function.**

The simplest usage requires the text of the message you wish to show and a
callback to handle the user's input. The value passed to the callback will be
the default value that the ``input`` takes if the user enters nothing if the
user cancelled or dismissed the dialog; otherwise it is passed the value of the
text input.

<script>
  insertExample("Prompt: Basic Usage", "prompt-basic-usage");
</script>

Prompt dialogs can also be customized, using [[PromptOptions]]. Here's an
example of a small prompt, using ``size``:

<!--prettify linenums=true-->
```
bootprompt.prompt({
  size: "small",
  title: "What is your name?",
  callback: (result) => { /* result = String containing user input if OK clicked or null if Cancel clicked */ }
})
```

See [the examples section](#prompt-examples) for more examples.

### Dialog

The [[dialog]] function allows creating custom dialogs.

The minimum required to create a custom dialog is the ``message``
option. However, it is possible to customize dialogs with
[[DialogOptions]]. Note that **custom dialogs do not use a global
callback**. Each button you add should have it's own callback function. See
[the examples section](#dialog-examples) for examples.

## The Promise-based API

The specialized Promise-based function all operate from the same basic
principle:

* The promise returned by these function resolves after the dialog has been
  hidden. Formally, it listens for the event ``hidden.bs.modal`` and resolves
  when this event occurs. **IT DOES NOT MATTER WHAT HID THE DIALOG.** If you call
  ``$dialog.modal("hide")`` yourself in your own code, this counts as "hiding
  the dialog" and the promise will resolve.

* ``callback`` still can be used to prevent the dialog from closing by returning
  the value ``false``.

* The promise resolves to the last value that was passed to the ``callback``
  option before the dialog was hidden. For instance, if a callback vetoes the
  dialog closure three times, then the promise will resolve to the value that
  was passed to ``callback`` the fourth time.

### Alert

The [[alert$]] function produce a dialog that behaves similarly to the DOM's
``alert()`` function.

If you have code that should not be evaluated until the user has dismissed the
alert, await the promise:

<script>
  insertExample("Alert: Basic Promise", "alert-basic-promise");
</script>

You can still use a callback to control when the dialog closes:

<script>
  insertExample("Alert: Promise and Callback", "alert-promise-and-callback");
</script>

### Confirm

The [[confirm$]] function produce a dialog that behaves similarly to the DOM's
``confirm()`` function.

If you have code that should not be evaluated until the user has dismissed the
alert, await the promise:

<script>
  insertExample("Confirm: Basic Promise", "confirm-basic-promise");
</script>

You can still use a callback to control when the dialog closes:

<script>
  insertExample("Confirm: Promise and Callback",
                "confirm-promise-and-callback");
</script>

### Prompt

The [[prompt$]] function produce a dialog that behaves similarly to the DOM's
``prompt()`` function.

If you have code that should not be evaluated until the user has dismissed the
alert, await the promise:

<script>
  insertExample("Prompt: Basic Promise", "prompt-basic-promise");
</script>

You can still use a callback to control when the dialog closes:

<script>
  insertExample("Prompt: Promise and Callback", "prompt-promise-and-callback");
</script>

## Locales

The following locales are available:

* ``ar`` Arabic
* ``az`` Azerbaijani
* ``bg_BG`` Bulgarian
* ``br`` Portuguese - Brazil
* ``cs`` Czech
* ``da`` Danish
* ``de`` German
* ``el`` Greek
* ``en`` English
* ``es`` Spanish / Español
* ``et`` Estonian
* ``eu`` Basque
* ``fa`` Farsi / Persian
* ``fi`` Finnish
* ``fr`` French / Français
* ``he`` Hebrew
* ``hr`` Croatian
* ``hu`` Hungarian
* ``id`` Indonesian
* ``it`` Italian
* ``ja`` Japanese
* ``ko`` Korean
* ``lt`` Lithuanian
* ``lv`` Latvian
* ``nl`` Dutch
* ``no`` Norwegian
* ``pl`` Polish
* ``pt`` Portuguese
* ``ru`` Russian
* ``sk`` Slovak
* ``sl`` Slovenian
* ``sq`` Albanian
* ``sv`` Swedish
* ``th`` Thai
* ``tr`` Turkish
* ``uk`` Ukrainian
* ``zh_CN`` Chinese (People's Republic of China)
* ``zh_TW`` Chinese (Taiwan / Republic of China)

To use any locale other than **en**, you must do **one** of the following:

* Use the ``bootprompt.all.js`` or ``bootprompt.all.min.js`` file, which
includes all locales.

* Add a reference to ``bootprompt.locales.js`` or ``bootprompt.locales.min.js``
  after ``bootprompt.js``.

* Add a reference to the target locale file (``fr.js`` to use the French
  locale, for example), found in the ``locales`` directory.

* Add the locale manually, using the [[addLocale]] function.

## Using jQuery Functions with Bootprompt

The Bootprompt object returned from each of the dialog functions is a jQuery
object. As such, you can chain most jQuery functions onto the result of a
Bootprompt dialog. Here's an example showing how to handle Bootstrap's
``shown.bs.modal`` event, using [``.on()``](http://api.jquery.com/on/):

<!--prettify linenums=true-->
```
const dialog = bootprompt.dialog({
    /* Your options... */
});

dialog.on('shown.bs.modal', function(e){
    // Do something with the dialog just after it has been shown to the user...
});
```

If you set the ``show`` option to ``false``, you can also use Bootstrap's
[``modal()``](http://getbootstrap.com/docs/4.0/components/modal/) function to
show and hide your dialog manually:

<!--prettify linenums=true-->
```
const dialog = bootprompt.dialog({
    show: false,
    /* Your options... */
});

dialog.modal('show');

dialog.modal('hide');
```

## Known Limitations

Using Bootprompt has some caveats, as noted below.

* **Dialog code does not block code execution.** All Bootstrap modals (and
  therefore Bootprompt modals), unlike the DOM ``alert()``, ``confirm()``, and
  ``prompt()`` functions, are
  [asynchronous](https://getbootstrap.com/docs/4.0/components/modal/#methods).
  Therefore, code that should not be evaluated until a user has dismissed your
  dialog must be called within the callback function of the dialog.

* **Multiple open modals are not supported.** This is a limitation of the
  Bootstrap modal plugin, as noted in the [official Bootstrap
  documentation](https://getbootstrap.com/docs/4.0/components/modal/#how-it-works).
  While it *is* possible to trigger multiple modals, custom CSS and/or
  JavaScript code is required for each layer of modal to display properly.

* **Prompt values are not sanitized.** The value(s) returned by a Bootprompt
  prompt are not sanitized in any way.

# Examples

## Alert Examples

### Basic Alert

<script>
  insertExample("Alert: Minimal Example", "alert-minimal-example");
</script>

### Basic Alert, with Callback

<script>
  insertExample("Alert: With Callback", "alert-with-callback");
</script>

### Basic Alert, Using Options Object

<script>
  insertExample("Alert: Using Options", "alert-using-options");
</script>

### Small Alert

Also applies to: ``confirm``, ``prompt``, ``dialog``.

<script>
  insertExample("Alert: Small", "alert-small");
</script>

### Large Alert

Also applies to: ``confirm``, ``prompt``, ``dialog``.

<script>
  insertExample("Alert: Large", "alert-large");
</script>

### Custom CSS class (using [Animate.css](https://daneden.github.io/animate.css/))

Also applies to: ``confirm``, ``prompt``, ``dialog``.

<script>
  insertExample("Alert: With Custom CSS", "alert-with-custom-css");
</script>

### Dismiss on Background Click

Also applies to: ``confirm``, ``prompt``, ``dialog``.

<script>
  insertExample("Alert: Dismiss on Background Click",
                "alert-dismiss-on-background-click");
</script>

### Using a Locale

Also applies to: ``confirm``, ``prompt``, ``dialog``.

<script>
  insertExample("Alert: Using a Locale", "alert-using-a-locale");
</script>

## Confirm Examples

### Basic Usage

<script>
  insertExample("Confirm: Basic Usage", "confirm-basic-usage");
</script>

### Custom Button Text and Color

Also applies to: ``alert()``, ``prompt()``, ``dialog()``.

<script>
  insertExample("Confirm: Custom Button Text and Color",
                "confirm-custom-button-text-and-color");
</script>

### Icon and Button Text

Also applies to: ``alert()``, ``prompt()``, ``dialog()``.

<script>
  insertExample("Confirm: Custom Icon and Button Text",
                "confirm-custom-icon-and-button-text");
</script>

### Locales

Also applies to: ``alert()``, ``prompt()``, ``dialog()``.

<script>
  insertExample("Confirm: Locales", "confirm-locales");
</script>

## Prompt Examples

**Please note:** prompt requires the ``title`` option (when using the options
object). You may use the ``message`` option, but the prompt result will **not**
include any form inputs from your message.

### Basic Usage

<script>
  insertExample("Prompt: Basic Usage", "prompt-basic-usage");
</script>

### Custom Locale

<script>
  insertExample("Prompt: Custom Locale", "prompt-custom-locale");
</script>

### Checkbox

<script>
  insertExample("Prompt: Checkbox", "prompt-checkbox");
</script>

### Radio Buttons and a ``message`` Value

<script>
  insertExample("Prompt: Radio Buttons", "prompt-radio-buttons");
</script>

### Various Types

<script>
  insertExample("Prompt: Various Types", "prompt-various-types");
</script>

### Select

<script>
  insertExample("Prompt: Select", "prompt-select");
</script>

### Range

<script>
  insertExample("Prompt: Range", "prompt-range");
</script>

## Dialog Examples

### Loading... Overlay

<script>
  insertExample("Dialog: Loading... Overlay", "dialog-loading-overlay");
</script>

### Buttons and Callbacks

<script>
  insertExample("Dialog: Buttons and Callbacks",
                "dialog-buttons-and-callbacks");
</script>
