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

```
bootprompt.alert("Your message here...")
```
<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Minimal Example" src="https://codepen.io/lddubeau/embed/preview/aMgBzd/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/aMgBzd/'>Alert: Minimal Example</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Your message can also contain HTML.

```
bootprompt.alert("Your message <b>here</b>");
```
<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example With HTML" src="https://codepen.io/lddubeau/embed/preview/Oqebwr/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/Oqebwr/'>Alert: Example With HTML</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

If you have code that should not be evaluated until the user has dismissed the
alert, call it within the callback function:

```
bootprompt.alert("This is an alert with a callback!", () => {
  console.log('This was logged in the callback!');
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example With Callback" src="https://codepen.io/lddubeau/embed/preview/moZxab/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/moZxab/'>Alert: Example With Callback</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Alerts can be customized, using [[AlertOptions]]. Here's an example of a small
alert, using ``size``:

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

```
bootprompt.confirm("This is the default confirm!", (result) => {
  console.log(`This was logged in the callback: ${result}`);
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Confirm: Basic Usage" src="https://codepen.io/lddubeau/embed/preview/moNPew/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/moNPew/'>Confirm: Basic Usage</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Confirm dialogs can be customized, using [[ConfirmOptions]]. Here's an example
of a small dialog, using ``size``:

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

```
bootprompt.prompt("What is your name?", result => {
  bootprompt.alert(
    result === null
      ? "You did not tell me your name!"
      : `You said your name is: ${result}`
  );
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Basic Usage" src="https://codepen.io/lddubeau/embed/preview/vPoWJV/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/vPoWJV/'>Prompt: Basic Usage</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Prompt dialogs can also be customized, using [[PromptOptions]]. Here's an
example of a small prompt, using ``size``:

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

```
await bootprompt.alert$("This is an alert!");
console.log("The dialog has been closed!");
```

You can still use a callback to control when the dialog closes:

```
const count = 3;
await bootprompt.alert$({
  message: "This is an alert!",
  callback: () => --count > 0,
});
console.log("The dialog has been closed!");
```

### Confirm

The [[confirm$]] function produce a dialog that behaves similarly to the DOM's
``confirm()`` function.

If you have code that should not be evaluated until the user has dismissed the
alert, await the promise:

```
const response = await bootprompt.confirm$("Frobulate the fnord?");
console.log(`Response: ${response}`);
```

You can still use a callback to control when the dialog closes:

```
const count = 3;
const response = await bootprompt.confirm$({
  message: "This is an alert!",
  callback: () => --count > 0,
});
console.log(`Response: ${response}`);
```

### Prompt

The [[prompt$]] function produce a dialog that behaves similarly to the DOM's
``prompt()`` function.

If you have code that should not be evaluated until the user has dismissed the
alert, await the promise:

```
const response = await bootprompt.prompt$("What is your name?");
console.log(`Response: ${response}`);
```

You can still use a callback to control when the dialog closes:

```
const count = 3;
const response = await bootprompt.prompt$({
  message: "What is your name?",
  callback: () => --count > 0,
});
console.log(`Response: ${response}`);
```

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

```
bootprompt.alert("Your message here...")
```
<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Minimal Example" src="https://codepen.io/lddubeau/embed/preview/aMgBzd/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/aMgBzd/'>Alert: Minimal Example</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Basic Alert, with Callback

```
bootprompt.alert("This is an alert with a callback!", () => {
  console.log('This was logged in the callback!');
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example With Callback" src="https://codepen.io/lddubeau/embed/preview/moZxab/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/moZxab/'>Alert: Example With Callback</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Basic Alert, Using Options Object

```
bootprompt.alert({
  message: "This is an alert with a callback!",
  callback: () => { console.log('This was logged in the callback!'); },
})
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example Using Options" src="https://codepen.io/lddubeau/embed/preview/YgoLzK/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/YgoLzK/'>Alert: Example Using Options</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Small Alert

Also applies to: ``confirm``, ``prompt``, ``dialog``.

```
bootprompt.alert({
  message: "This is the small alert!",
  size: 'small'
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example Small" src="https://codepen.io/lddubeau/embed/preview/rREvNK/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/rREvNK/'>Alert: Example Small</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Large Alert

Also applies to: ``confirm``, ``prompt``, ``dialog``.

```
bootprompt.alert({
  message: "This is the large alert!",
  size: 'large'
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example Large" src="https://codepen.io/lddubeau/embed/preview/RdzyPP/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/RdzyPP/'>Alert: Example Large</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Custom CSS class (using [Animate.css](https://daneden.github.io/animate.css/))

Also applies to: ``confirm``, ``prompt``, ``dialog``.

```
bootprompt.alert({
  message: "This is an alert with additional classes!",
  className: 'rubberBand animated'
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example with Custom CSS Class" src="https://codepen.io/lddubeau/embed/preview/moZYVM/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/moZYVM/'>Alert: Example with Custom CSS Class</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Dismiss on Background Click

Also applies to: ``confirm``, ``prompt``, ``dialog``.

```
bootprompt.alert({
  message: "This alert can be dismissed by clicking on the background!",
  backdrop: true
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example With Clickable Background" src="https://codepen.io/lddubeau/embed/preview/GebVWZ/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/GebVWZ/'>Alert: Example With Clickable Background</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Using a Locale

Also applies to: ``confirm``, ``prompt``, ``dialog``.

```
bootprompt.alert({
 message: "This alert uses the Arabic locale!",
 locale: 'ar',
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Alert: Example Using a Locale" src="https://codepen.io/lddubeau/embed/preview/qvebed/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/qvebed/'>Alert: Example Using a Locale</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Confirm Examples

### Basic Usage

```
bootprompt.confirm("This is the default confirm!", (result) => {
  console.log(`This was logged in the callback: ${result}`);
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Confirm: Basic Usage" src="https://codepen.io/lddubeau/embed/preview/moNPew/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/moNPew/'>Confirm: Basic Usage</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Alternate Button Text and Color

Also applies to: ``alert()``, ``prompt()``, ``dialog``.

```
bootprompt.confirm({
  message: "This is a confirm with custom button text and color! Do you like it?",
  buttons: {
    confirm: {
      label: "Yes",
      className: "btn-success",
    },
    cancel: {
      label: "No",
      className: "btn-danger",
    },
  },
  callback: (result) => {
    console.log(`This was logged in the callback: ${result}`);
  },
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Confirm: Custom Button Text and Color" src="https://codepen.io/lddubeau/embed/preview/MxNyJd/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/MxNyJd/'>Confirm: Custom Button Text and Color</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Icon and Button Text

Also applies to: ``alert()``, ``prompt()``, ``dialog``.

```
bootprompt.confirm({
  title: "Destroy planet?",
  message: "Do you want to activate the Deathstar now? This cannot be undone.",
  buttons: {
    cancel: {
      label: '<i class="fa fa-times"></i> Cancel'
    },
    confirm: {
      label: '<i class="fa fa-check"></i> Confirm'
    }
  },
  callback: (result) => {
    console.log(`This was logged in the callback: ${result}`);
  }
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Confirm: Custom Icon and Button Text" src="https://codepen.io/lddubeau/embed/preview/JzgJpL/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/JzgJpL/'>Confirm: Custom Icon and Button Text</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Locales

Also applies to: ``alert()``, ``prompt()``, ``dialog``.

```
<div class="form-group">
  <label>Choose a locale: </label>
  <select id="locales" class="custom-select" style="max-width: 200px;"></select>
</div>
<button id="confirm">Confirm</button>

<script>
const locales = document.getElementById("locales");
for (const locale in bootprompt.locales()) {
  const option = document.createElement("option");
  option.setAttribute("value", locale);
  option.textContent = locale;

  locales.appendChild(option);
}

const confirm = document.getElementById("confirm");
$(confirm).on("click", () => {
  bootprompt.confirm({
    message:
      "This confirm uses the selected locale. Were the labels what you expected?",
    locale: locales.value,
    callback: result => {
      bootprompt.alert(`This was logged in the callback: ${result}`);
    }
  });
});
</script>
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Confirm: Locales" src="https://codepen.io/lddubeau/embed/preview/VRoWxV/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/VRoWxV/'>Confirm: Locales</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Prompt Examples

**Please note:** prompt requires the ``title`` option (when using the options
object). You may use the ``message`` option, but the prompt result will **not**
include any form inputs from your message.

### Basic Usage

```
bootprompt.prompt("What is your name?", result => {
  bootprompt.alert(
    result === null
      ? "You did not tell me your name!"
      : `You said your name is: ${result}`
  );
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Basic Usage" src="https://codepen.io/lddubeau/embed/preview/vPoWJV/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/vPoWJV/'>Prompt: Basic Usage</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Custom Locale

```
const locale = {
  OK: "I Suppose",
  CONFIRM: "Go Ahead",
  CANCEL: "Maybe Not",
};

bootprompt.addLocale("custom", locale);

bootprompt.prompt({
  title: "This is a prompt with a custom locale! What do you think?",
  locale: "custom",
  callback: (result) => {
    bootprompt.alert(`This was logged in the callback: ${result}`);
  },
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Custom Locale" src="https://codepen.io/lddubeau/embed/preview/eXqeVW/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/eXqeVW/'>Prompt: Custom Locale</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Checkbox

```
bootprompt.prompt({
  title: "This is a prompt with a set of checkbox inputs!",
  value: ["1", "3"],
  inputType: "checkbox",
  inputOptions: [{
    text: "Choice One",
    value: "1",
  },
  {
    text: "Choice Two",
    value: "2",
  },
  {
    text: "Choice Three",
    value: "3",
  }],
  callback: (result) => {
    bootprompt.alert(`Result: ${result}`);
  },
});
```

<iframe height="376" style="width: 100%;" scrolling="no" title="Prompt: Checkbox" src="https://codepen.io/lddubeau/embed/preview/EMqbLb/?height=376&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/EMqbLb/'>Prompt: Checkbox</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Radio Buttons and a ``message`` Value

```
bootprompt.prompt({
  title: "This is a prompt with a set of radio inputs!",
  message: "<p>Please select an option below:</p>",
  inputType: "radio",
  inputOptions: [{
    text: "Choice One",
    value: "1",
  }, {
    text: "Choice Two",
    value: "2",
  }, {
    text: "Choice Three",
    value: "3",
  }],
  callback: (result) => {
    bootprompt.alert(`Result: ${result}`);
  }
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Radio Buttons" src="https://codepen.io/lddubeau/embed/preview/pYMdZN/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/pYMdZN/'>Prompt: Radio Buttons</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Various Types

```
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
<button id="prompt">Prompt</button>

<script>
const prompt = document.getElementById("prompt");
const types = document.getElementById("types");

$(prompt).on("click", () => {
  const type = types.value;
  bootprompt.prompt({
    title: `This is a prompt with input type: ${type}`,
    inputType: type,
    callback: result => {
      bootprompt.alert(`Result: ${result}`);
    }
  });
});
</script>
```

<iframe height="403" style="width: 100%;" scrolling="no" title="Prompt: Various Types" src="https://codepen.io/lddubeau/embed/preview/PLMOrw/?height=403&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/PLMOrw/'>Prompt: Various Types</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Select

```
bootprompt.prompt({
  title: "This is a prompt with select!",
  inputType: "select",
  inputOptions: [{
    text: "Choose one...",
    value: "",
  }, {
    text: "Choice One",
    value: "1",
  }, {
    text: "Choice Two",
    value: "2",
  }, {
    text: "Choice Three",
    value: "3",
  }],
  callback: (result) => {
    bootprompt.alert(`Result: ${result}`);
  }
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Select" src="https://codepen.io/lddubeau/embed/preview/GLKKvv/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/GLKKvv/'>Prompt: Select</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Range

```
bootprompt.prompt({
  title: "This is a prompt with a range input!",
  inputType: "range",
  min: "0",
  max: "100",
  step: "5",
  value: "35",
  callback: (result) => {
    bootprompt.alert(`This was logged in the callback: ${result}`);
  }
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Prompt: Range" src="https://codepen.io/lddubeau/embed/preview/RObbjg/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/RObbjg/'>Prompt: Range</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Dialog Examples

### Loading... Overlay

```
const dialog = bootprompt.dialog({
  message: "<p class='text-center mb-0'><i class='fa fa-spin fa-cog'></i> \
 Please wait while we do something...</p>",
  closeButton: false,
  onEscape: false,
});

setTimeout(() => {
  dialog.modal("hide");
}, 2000);
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Dialog: Loading... overlay" src="https://codepen.io/lddubeau/embed/preview/MRgWJK/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/MRgWJK/'>Dialog: Loading... overlay</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Buttons and Callbacks

```
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
        }
    },
    noclose: {
      label: "I don't close the modal!",
      className: "btn-warning",
      callback: () => {
        bootprompt.alert("Custom button clicked");
        return false;
      }
    },
    ok: {
      label: "I'm an OK button!",
      className: "btn-info",
      callback: () => {
        bootprompt.alert("Custom OK clicked");
      }
    }
  }
});
```

<iframe height="265" style="width: 100%;" scrolling="no" title="Dialog: Buttons and Callbacks" src="http://codepen.io/lddubeau/embed/preview/gyYOxZ/?height=265&theme-id=0&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lddubeau/pen/gyYOxZ/'>Dialog: Buttons and Callbacks</a> by Louis-Dominique Dubeau
  (<a href='https://codepen.io/lddubeau'>@lddubeau</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
