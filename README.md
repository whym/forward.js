HTTP redirector deployable as a Fly app.

Configuration
--------------

Set environment variables:

* ``FORWARD_CONFIG`` - main config (see below)
* ``PORT`` - port number

If ``config.json`` is present, it precedes over ``FORWARD_CONFIG``. See ``config-sample.json`` for a sample.

Use
---

``npm install && PORT=3001 npm start``

Test
-----
``npm test``
