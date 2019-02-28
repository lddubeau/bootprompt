Differences from Bootbox
========================

Bootprompt is a fork of Bootbox but it is also a break with the past. Some
features of Bootbox are costly to support and were removed. So for the benefit
of those who might be upgrading from Bootbox 4 to Bootprompt, here are some
major differences between the two libraries:

* This package has a new name "Bootprompt", consequently, the CSS class names
  and the DOM event names have also changed from using a ``bb-`` prefix to
  ``bp-``.

* Bootprompt does not contain a polyfill for ``Object.keys``. You should setup
  your own polyfill to load before Bootprompt or use libraries like ``core-js``
  to provide it for you.

* Bootprompt does not support chaining of the module-wide functions.

* Bootprompt formally requires "bootstrap". (Bootbox did not.) If you had custom
  configuration in your module loader to fix Bootbox, you don't need it for
  Bootprompt.

* Bootprompt cannot be loaded without "bootstrap" being first loaded. (Bootbox
  allowed it.)

* Bootprompt will not kinda-sorta work with Bootstrap 2 or earlier. It throws an
  error if it looks like Bootstrap is not at least 3.

* Bootprompt no longer exports a module-level ``init`` function. In Bootbox you
  could use it to produce new instances of the whole module. If you need to
  create multiple instances of Bootprompt, configure your module loader/bundler
  to do it for you.

* For the ``value`` option, Bootprompt accepts an array but only an array of
  strings. Bootbox was ambiguous about what the array could contain. (The value
  is passed to ``$().val(...)``. The documentation for it does not mention
  passing arrays of things other than *strings*.)

* Bootprompt does not systematically do runtime checks to figure whether you are
  passing the required number of arguments, etc. People who need such checks
  should use TypeScript to have their code checked at compile-time.

* Bootprompt's API is strict when it comes to ``undefined`` and ``null``. If a
  value is optional, and may be ``undefined``, then you cannot pass ``null``
  instead. These are different JS values. Bootbox did not systematically
  distinguish the two values (and would in some cases also treat ``false``,
  ``""``, ``0`` and other falsy values the same as ``undefined`` or ``null``).

* Bootprompt does not allow numbers as values for the various input types that
  ``prompt`` supports. The TS declarations disallow numbers. So if you are using
  TS, the type-checking will prevent you from passing numbers. If you are using
  plain JS with Bootprompt and pass numbers instead of strings, it may or may
  not work. The safe thing to do when you upgrade is to change all number values
  to strings.

  Why this? Bootbox relied on "magic" happening at the DOM level (or jQuery, but
  the distinction is not relevant here). Suppose the input element ``el``. If
  you do ``el.value = 1``, it works fine. However, when you read ``el.value``
  back you **always** get a string, not a number. This violates the principle of
  least astonishment. A developer might specify a prompt with radio buttons
  associated with numbers for possible values, but would always get a string
  when reading back the selected value. Etc.

  Note that this is *also* true when creating a prompt with ``number`` or
  ``range`` input. Even there, the values are strings, not number.

  And this is also true when specifying ``min`` ``max`` and ``step``. In the
  DOM, those values are strings, so we accept strings.

  The mishmash of values that Bootbox accepted was not only leading to confusing
  results, it also caused bugs. If the logic is going to compare two values that
  could be strings, or numbers or a mix, it has to take into account these
  various cases. Bootbox had bugs due to this.

  Bootprompt will throw an error if the default value is a number, or if any of
  the values passed as the ``value`` field of ``inputOptions`` is a number.

* Tieson Trowbridge's improvements included the capability to set
  ``placeholder`` on a ``select`` input. There was a comment explaining that it
  is not a valid attribute for select, etc. Since there is no standard semantics
  for ``placeholder`` on ``select``, I (lddubeau) removed this capability. It
  may be added back if someone can make a case for it. (I (lddubeau) searched
  the issues on Bootbox but could not find a discussion of this feature.)
