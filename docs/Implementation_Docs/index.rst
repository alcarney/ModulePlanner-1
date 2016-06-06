Implementation Details
======================

In this section we have the documentation detailing how the site is implemented.
You do not need to worry about what is contained here unless you are a developer
looking to contribute to the project.

This section is divided into two parts:

- **Core:** This section details how the main feature of the module planner is
  implemented - the selection of modules and their dependencies.
- **Extras:** This section goes over a few other smaller features such as
  the implementation of support for multiple languages.

========
The Core
========

The core itself has two main concerns the translation of the data in the
database to the HTML that we can interact with using Javascript.

.. toctree::
   :maxdepth: 1

   course-page.rst
   planner-header.rst
   module-html.rst

Then there is the actual Javascript which handles the logic behind selecting
modules

.. toctree::
   :maxdepth: 1

   module-selection.rst
   

======
Extras
======

Here you will find the documentation for some of the smaller features which go
into module planner that aren't directly related to the selection of modules.

.. toctree::
   :maxdepth: 1

   theme-changer.rst
   language-changer.rst
