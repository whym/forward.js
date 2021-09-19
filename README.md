HTTP redirector deployable as a heroku app.

Configuration
--------------

Set environment variables:

* ``FORWARD_TARGET`` - prefix for paths to be resolved with
* ``PORT`` - port number
* ``NO_ARG`` - if set true, the redirector ignores paths. (By default it appends paths to ``FORWARD_TARGET``)

or have ``config.json`` when running ``node server.js``. See ``config-sample.json`` for a sample.

Use
---

``npm install && PORT=3001 npm start``

Test
-----
``npm test``
