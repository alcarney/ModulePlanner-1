.. _modules:

====================
Modules
====================

In order to add a module to the database, you need to input data into the
:code:`modules.yml` file in the :code:`_data` folder. Before you go and do this,
you must first make sure that you have the following pieces of infomation:

* Module code
* Module name
* No. of credits this module is worth
* Module codes for any modules required to take this module
* Short link for more info. (see :ref:`links` for help)

If the module that you are adding does not have any pre-requisites don't worry
as I will now go through two examples of adding a new module: one with
pre-requisites and one without to show how it is done in both cases.

Example 1: with pre-requisites
=================================

The module I am going to add is called :code:`Elementary Fluid Dynamics`.  This
is a :code:`10 credit` module with the module code: :code:`ma0235`.  In order to
take this module you must have first the modules Mechanics I and Vector
Calculus which have the module codes :code:`ma1300` and :code:`ma2301`
respectively.  The short link for this :code:`1516-MA0235`.

This is what you write in modules.yml::

	- code: ma0235
	  name: Elementary Fluid Dynamics
	  credits: 10
	  requires: ['ma1300', 'ma2301']
	  more-info: MA0235

Example 2: without pre-requisites
====================================

The module I am going to add is called :code:`Modelling with Differential
Equations`.  This is a :code:`10 credit` module with the module code:
:code:`ma0232`.  The short link for this :code:`1516-MA0232`.

This is what you write in modules.yml::

	- code: ma0232
	  name: Modelling with Differential Equations
	  credits: 10
	  more-info: MA0232

You now know how add modules into the database. Once you have added all of your
modules, you are ready to add in your school's :ref:`courses`.
