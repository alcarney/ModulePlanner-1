.. _module-selection:

Module Selection
================

In this section we detail the Javascript we have that handles the selection and
deselection of modules in a given degree scheme as well as the system which
keeps track of the number of credits that are selected at any given time.

The Javascript makes heavy use of the HTML on each course page that we carefully
generate to have a specific structure containing all the data that we need to
either allow or disallow a selection. So if you haven't already I suggest that
you familiarize yourself with :ref:`course-page` before continuing.

As well being familiar with the structure of each course page I recommend that
you are also familiar with the basics of `CSS Selectors`_ and `jQuery`_.

.. highlight:: javascript

=========
The Setup
=========

I think a good place to start would to walk through the initialization code that
is run when the page is loaded which will give you a high level view of how the
selection code is put together. We can then dive into the details and find out
how it really works.

At the most general view there are three parts to selecting and choosing
modules:

- Counting the number of selected credits
- Selecting individual modules
- Clearing all those selected

---------------------
Starting Credit Count
---------------------

So we first create an empty associative array which we will use to store the
total number of credits selected so far for each year::

    var creditTotals = [];

Next we need to go through each year in turn and calculate the number of credits
coming from the core modules which are mandatory and will always be selected. So
for each year we start off assuming that there are no core modules::

    $("div.year").each(function () {

        var coreCredits = 0;

Now we need to loop through each core module for the current year and add its
credit value to the current count::

    $(this).children("div.core").children().each(function () {

        var moduleCredit = $(this).find("div.group > aside > span.credit").text();

        coreCredits += parseInt(moduleCredit);
    });

Note that the credit value in :code:`moduleCredit` with the *string
representing the value* so we need to convert it to an integer before we can add
it to the total.

Finally its just a matter of putting this initial value in the array we created
earlier, using the year's id value as the key::

    creditTotals[$(this).attr("id")] = coreCredits;

Finally with the initial values calculated it's time to update the webpage to
show this to the user::

    updateTotals(creditTotals);

-----------------
Selecting Modules
-----------------

On the surface module selection is quite easy, for each *optional* module
we need jQuery to call a function each time there's a click event which does the
following:

- Toggle the selection of the module (if permitted)
- Update the credit counter.

The last bit of information we need is of course the module code which we store
in the :code:`id` attribute of the :code:`div` element surrounding the module.
Putting this all together and adding the ability to (de)select optional modules
is as simple as::

    $("div.optional > div.module").click(

        function() {
            var code = $(this).atrr("id");
            toggleModule(code);
            updateTotals(creditTotals);
    });

Since the above defined the entire module :code:`div` element to be clickable
that when the user clicks on the :code:`more-info` link it fools our code into
thinking that the user is trying to select the module when in fact they only
want to find out more about it. So this bit of code will stop the click before
it reaches the main :code:`div` element and activating the above code::

    $("div.module > div.group > a").click(function (event) {

        event.cancelBubble = true;

        if (event.stopPropagation) {
            event.stopPropagation();
        }
    })
    
The :code:`cancelBubble = true` line is needed to support Internet Explorer
browsers while the :code:`stopPropogation` function is for all the other browsers.

-----------------------------
Clearing all Selected Modules
-----------------------------

Finally it's time to make the title which we've styled to look like a button in
the header of the page actually behave like a button. We want this button when
clicked to deselect any selected optional modules. So it's simply a case of
hooking into the :code:`click` event and loop through the optional modules and
calling :code:`toggleModule` on any modules with the :code:`selected` class and
updating the credit totals accordingly::

    $("div.wrapper > h2.clear").click(function () {

        $("div.optional > div.module").each(function () {

            if ($(this).hasClass("selected")) {
                toggleModule($(this).attr("id");
            }
        });

        updateTotals(creditTotals);
    }); 

Of course we still need to write the :code:`toggleModule` and
:code:`updateTotals` functions.

==========================
The Toggle Module Function
==========================

The :code:`toggleModule` function needs to be self contained so that it doesn't
matter where we call it from (a users' click or the clear button for example) it
makes sure that everything that needs to happen to cleanly (de)select a module
is performed every time.

How do we even know if a module is selected in the first place? Well remember
when we wrote :ref:`course-page` HTML all the core modules were given an extra
class :code:`selected`? We'll use exactly the same thing here, so any module
which has this class we will assume to be selected.

So on with the function, firstly we define a few strings to be the CSS selectors
we use throughout the function. One will for the module in question, the other
will be the counter for the total number of credits picked so far for the year::

    var toggleModule = function(code) {

        var module = "div.module#" + code;

        var totalcredits = "div.year > span.total-credits";

Next we need to decide if we selecting or deselecting the module, so we simply
check for the presence of the :code:`selected` class::

    if ($(module).hasClass("selected")) {

        // Deselect Module

    } else {

        // Select Module

    }

--------------------
Deselecting a Module
--------------------

Let's consider the case where we are deselecting a module. To successfully
deselect a module we need to do the following:

- Remove the :code:`selected` class
- Update the credit totals
- If any other module depends on this module, deselecting this module will
  prevent you from studying that one so we have to deselect that one also.

In Javascript we can write this as follows::

    deselectProvides(code);

    $(module).removeClass("selected");

    updateYearlyTotal(module, false);

We wont be going into the :code:`updateYearlyTotals` function here, we will
discuss it as part of the entire credit counting system later but we may as well
dive into the :code:`deselectProvides` function here.

The :code:`deselectProvides` function is responsible for searching through the
invisible (to the user) list of module codes in the :code:`provides` section of
the module and ensuring all those modules are now not selected. So first of all
we need to get this section from the webpage given the current module's code::

    var deselectProvides = function(code) {

        var selector = "div.module#" + code + " > div.provides";

Now there's every chance that there aren't any modules which depend on this one
so we need to check for that case. But if there then we need to loop through
each one in turn, check to see if it's selected and if so deselect it::

    if($(selector).children().length) {

        $(selector).children().each(function () {

            var mCode = $(this).attr("class");

            if (($("div.module#" + mCode).hasClass("selected))) {

                toggleModule(mCode);
            }
        });
    }

Notice that we call the :code:`toggleModule` function again? That's important,
say that there were three modules :code:`A`, :code:`B`, :code:`C` where
:code:`C` depends on :code:`B` which itself depends on :code:`A`. Then say the
user deselects :code:`A` then the above function would be called and we would
deselect :code:`B` but if we deselect it just by removing the :code:`selected`
tag the user would be taking :code:`C` without any of its dependencies!

By calling :code:`toggleModule` again we ensure that any changes propagate
correctly up dependency tree and we avoid any situation like this. Now for the
case where we want to select the module.

------------------
Selecting a Module
------------------

To successfully select a module we need to do the following:

- Check that all the requirements for the module in question have already been
  selected
- If not give some feedback to the user as to why the user can't select the module
- If we can select it, add the :code:`selected` class
- Update the credit counters

Writing this in Javascript can be done as follows::

    if(checkRequires(code)) {

        $(module).addClass("selected");
        $(module + "> .requires").slideUp("slow");

        updateYearlyTotals(module, true);
    }

As before we won't go over the details to the :code:`updateYearlyTotals`
function, we'll do that when we get to the credit counter section. But we will
go over the :code:`checkRequires` function now.

A quick note from the above code we can see that we need a function that will
take a module's code and return true if the module can be selected, false
otherwise.

Firstly we define our selector that will give us the list of requirements for
the module and we'll initially assume that the module can be selected::

    var checkRequires = function(code) {

        var selector = "div.module# + code + > ul.requires";

        var available = true;

Next we check that the list of requirements exists, if it doesn't then there's
no reason the user can't select the module so we return true straight away::

    if ($(selector).children().length) {

        // Other checks

    } else {

       return available;
    }

So what else is there to check? Well we know that requirements exist, now it's
time to check if they've been selected. It's simple enough, for each requirement
in the list we get the module code and see if it has the :code:`selected`
class::

    $(selector).children().each(function () {

        var m = $(this).attr("class");

        if(!$("div.module#" + m).hasClass("selected"))) {

             // Abort!
        }
    });

    return available;

Well abort is a bit too strong a term, but we need the function to return false
from here and give some feedback to the user to tell them why. Well the list of
requirements are hidden from the user by default using the site's CSS, so a nice
bit of feedback is to now show it to them so they know what they need to select
first::

    available = false;

    $("div.module#" + code + " > .requires").slideDown("slow");

Now that :code:`slideUp` line from earlier should make more sense now as well,
since when the user successfully selects the module we hide the requirement list
as its no longer needed. 

==========================
The Update Totals Function
==========================

This function is given the array :code:`creditTotals` and updates the HTML on
the page so that the user can see the number of credits that they have selected
for each year.

So we start off by looping through each year and defining a selector which will
give us where to place the new value for the credit amount. It's worth noting
that in this particular loop the value of :code:`year` will be a **key** from
the array rather than a value::

    var updateTotals = function(totals) {

         for (year in totals) {

             var counter = "div.year#" + year + > h3 > span.credit";

Next we need to get the actual value for the total number of credits for this
year and update the value on the page::

    var value = totals[year]:

    $(counter).text(totals[year]);

Now we could stop here but we include a small extra feature where we add a class
to the element containing the value indicating if the value is higher than the
recommended number of credits for the year. This then allows us to add some CSS
rules to indicate to the user when they have gone above the limit::

    if (value > 120) {

        if($(counter).hasClass("ok")) {
            $(counter).removeClass("ok");
        }

        if(!$(counter).hasClass("warn")) {
           $(counter).addClass("warn");
        }
    }

And of course we need to be able to remove this class when the user brings the
total below or equal to the recommended value::

    if (value <= 120) {

        if ($(counter).hasClass("warn")) {
           $(counter).removeClass("warn");
        }

        if (!$(counter).hasClass("ok")) {
           $(counter).addClass("ok");
        }
    }

================================
The Update Yearly Total Function
================================

Before we finish there is just one other function we need to look at is the
function that we use to update the total number of selected credits for the
year. It takes the selector for the current module and true if we are selecting
the module and false otherwise.

So the first step is to get the number of credits that the module of worth, note
that this will be a string rather than an integer::

    var updateYearlyTotal = function(module, inc) {

        var numCredits = $(module + " > div.group > aside > span.credit").text();

Next we need to find out what year the module belongs to::

    var parent = $(module).parents("div.year").attr("id");

Finally depending on if the second argument was true or false add the value to
the current total or take it off::

    if (inc) {

        creditTotals[parent] += parseInt(numCredits);

    } else {

        creditTotals[parent] -= parseInt(numCredits);

    }

.. _CSS Selectors: http://www.w3schools.com/cssref/css_selectors.asp
.. _jQuery: https://jquery.com/
