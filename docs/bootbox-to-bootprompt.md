Differences from Bootbox
========================

Bootprompt is a fork of Bootbox but it is also a break with the past. Some
features of Bootbox are costly to support and were removed. So for the benefit
of those who might be upgrading from Bootbox 4 to Bootprompt, here are some
major differences between the two libraries:

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
  strings. Bootbox was ambiguous about what the array count contain. (The value
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
