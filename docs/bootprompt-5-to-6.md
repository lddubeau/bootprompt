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
