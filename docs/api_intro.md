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

All Bootstrap modals, unlike DOM ``alert()``, ``confirm()``, and ``prompt()``
calls, are non-blocking.  Keep that in mind when using this API, as the
functions provided by the API are **not** drop-in replacements for the DOM
functions they are inspired by.  Any code that depends on the user's selection
**must** be placed in the callback function.

## Alert

The [[alert]] function produce a dialog that behaves similarly to the DOM's
``alert()`` function.

```
bootprompt.alert("Your message here...")
```

Your message can also contain HTML.

```
bootprompt.alert("Your message <b>here</b>");
```

If you have code that should not be evaluated until the user has dismissed the
alert, call it within the callback function:

```
bootprompt.alert("Your message here...", () => { /* callback code */ });
```

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

## Confirm

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
bootprompt.confirm("Are you sure?", (result) => { /* callback code */ })
```

Confirm dialogs can be customized, using [[ConfirmOptions]]. Here's an example
of a small dialog, using ``size``:

```
bootprompt.confirm({
  size: "small",
  message: "Are you sure?",
  callback: (result) => { /* result is a boolean; true = OK, false = Cancel*/ }
})
```

## Prompt

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
bootprompt.prompt("What is your name?", (result) => { /* callback code */ })
```

Prompt dialogs can also be customized, using [[PromptOptions]]. Here's an
example of a small prompt, using ``size``:

```
bootprompt.prompt({
  size: "small",
  title: "What is your name?",
  callback: (result) => { /* result = String containing user input if OK clicked or null if Cancel clicked */ }
})
```

## Dialog

The [[dialog]] function allows creating custom dialogs.

The minimum required to create a custom dialog is the ``message`` option.

```
bootprompt.dialog({
  message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i>Loading...</div>'
})
```

As noted above, the only required option for a custom dialog is
``message``. However, it is possible to customize dialogs with
[[DialogOptions]]. Note that **custom dialogs do not use a global
callback**. Each button you add should have it's own callback function. Here's
an example:

```
bootprompt.dialog({
  title: 'Custom Dialog Example',
  message: '<p>This dialog demonstrates many of the options available when using the Bootprompt library</p>',
  size: 'large',
  backdrop: true,
  buttons: {
    fee: {
      label: 'Fee',
      className: 'btn-primary',
      callback: () => { }
    },
    fi: {
      label: 'Fi',
      className: 'btn-info',
      callback: () => { }
    },
    fo: {
      label: 'Fo',
      className: 'btn-success',
      callback: () => { }
    },
    fum: {
      label: 'Fum',
      className: 'btn-danger',
      callback: () => { }
    }
  }
});
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
  documentation](https://getbootstrap.com/docs/4.0/components/modal/#how-it-works].
  While it *is* possible to trigger multiple modals, custom CSS and/or
  JavaScript code is required for each layer of modal to display properly.

* **Prompt values are not sanitized.** The value(s) returned by a Bootprompt
  prompt are not sanitized in any way.
