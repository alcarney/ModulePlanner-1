.. _theme-changer:

Theme Changer
=============

This page details how the theme changer is implemented. On
:ref:`the-planner-header` page we went through how we added a dropdown menu to
the header on the page containing all the themes currently installed on the
site. Here we go through the Javascript required to enable the user to make a
choice and have the respective theme applied to the site.

.. highlight:: html

As you probably know "themes" are made with CSS stylesheets and are loaded in
the :code:`<head>` section of the HTML page as follows::

    <link rel="stylesheet" href="/path/to/file.css">

Changing the :code:`href` attribute will get the browser to fetch and apply a
new stylesheet hence a new "theme".

=========
The Setup
=========

.. highlight:: javascript

Before diving into the details let's walk through the code that is run as the
page loads to get a feel for how the system works. First we define a few
selectors that will be useful throughout::

    var stylesheet = "link#theme-def";
    var themechooser = "select#theme-chooser";

Next we see if the user has a preference previously saved and if so we apply
it, else we just apply the default theme::

    if (localStorage.theme) {

        changeTheme(localStorage.theme);
    } else {

        changeTheme("dark");
    }

Finally we need to hook into the dropdown's change event to apply changes when a
user makes a choice::

    $(themechooser).chnage(function () {

        var new_theme = $(themechooser).val();
        changeTheme(new_theme);
    });

Now we only have to write the :code:`changeTheme` function

=========================
The Change Theme Function
=========================

So we need a function which takes the filename for a theme (without the
extension) and get the browser to load and apply it. Thankfully jQuery makes
this really easy for us::

    var changeTheme = function(shortname) {
  
        $(stylesheet).attr("href", "/css/" + shortname + ".css");

Next we make sure the dropdown matches the new theme::

    $(themechooser).val(shortname);

Finally we check to see if the user's browser supports local storage and if so
we save their preference::

    if (typeof(Storage)) {
        localStorage.setItem("theme", shortname);
    }
