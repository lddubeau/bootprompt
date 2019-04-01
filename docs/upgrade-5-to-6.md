``onEscape`` and ``onClose``
============================

Bootprompt 5.x inherited its handling of ``onEscape`` from Bootbox. It was a
mess. See [this issue](https://github.com/lddubeau/bootprompt/issues/9) for the
details. The mess was fixed with these changes in Bootbox 6:

1. ``onClose`` was added. From now on ``onEscape`` only deals with the Escape
   key and ``onClose`` only deals with the close button in the header.

2. For the specialized functions (``alert``, ``confirm``, ``prompt``),
   ``onClose`` and ``onEscape`` affect whether ``callback`` is called or
   not. They do not *by themselves* determine whether the modal is closed or
   not. It is always ``callback`` that determines whether the modal is closed or
   not.

3. For ``dialog``, ``onEscape`` and ``onClose`` determine whether the modal is
   closed. (``callback`` is ignored so there's nothing else that can determine
   it.)

You need to review all usages you made of ``onEscape`` and determine whether you
need to also specify an ``onClose`` callback.

Additionally, the default behavior of ``dialog`` when ``onEscape`` is unset is
in Bootbox 6 the exact opposite of what it was in Bootprompt 5.x. Previously,
not setting ``onEscape`` meant that the Escape key would not close the
modal. The new default is that not setting ``onEscape`` means that the Escape
key closes the modal. You need to inspect all calls to ``dialog`` and:

1. If it had ``onEscape: true`` you may remove this option.

2. If ``onEscape`` was not set and you want the Escape key to not close the
   modal, then you need to set ``onEscape: true``.

``setDefaults`` is gone
=======================

With two exceptions Bootprompt no longer support module state. The two
exceptions are

1. A locale which can be set with ``setLocale``.

2. Whether or not to animate the modals produced, which can be set with
   ``setAnimate``.

You can emulate the old behavior by writing a factory function that sets the
options you want to be set a certain way, and calling this factory instead of
Bootprompt directly.

``callback`` is no longer allowed on ``DialogOptions``
======================================================

The TypeScript typings no longer allow passing ``callback`` to ``dialog``. If
you did pass ``callback`` to ``dialog``, you will get a compliation error,
remove ``callback``.

If you sneak ``callback`` into the options passed to ``dialog`` (because you
don't use TS or because you perform a type assertion), ``callback`` will be
ignored as it has always been.

Button callbacks are no longer allowed on the specialized functions
===================================================================

The specialized functions are ``alert``, ``confirm``, ``prompt``.

The TypeScript typings no longer allow setting a callback on the buttons in the
options passed to specialized functions. At runtime, Bootprompt silently
overwrites any such callback as needed to create a specialized dialog. (This
behavior is inherited from Bootbox.) Previously, the typings allowed setting
such callback, even though it would be overwritten at run time. If you use TS,
and were setting callbacks on the options you passed to the specialized
functions, you need to remove these callbacks.

As implied above, if you use JS or if you use TS but perform a type assertion
and pass a button callback to a specialized function, the callback will be
silently ignored. Again, this behavior comes from Bootbox, prior to the fork
from that created Bootprompt.
