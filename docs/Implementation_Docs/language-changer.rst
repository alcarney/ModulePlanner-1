.. _language-changer:

Language Changer
================

Since the module planner supports multiple languages we need a way to allow the
user to easily change the language they are currently using the site in. On
:ref:`the-planner-header` page we went through adding the dropdown menu
containing the to the available languages to the header of the page. Here we
talk about the Javascript that makes the dropdown function.

Languages are supported by generating a page for each language for each course
in the planner which are then grouped in folders by language. For example say we
had two languages, English (en) and Welsh (cy) then the URLs for a given degree
would look like::

    http://www.website.com/en/<degreecode>.html
    http://www.website.com/cy/<degreecode>.html

So when the user changes the language all we have to do is get the browser to do
is to load the new URL for the current degree, just swapping out the language
code.

.. highlight:: javascript

=========
The Setup
=========

So before we dive into the details let's look at the code which is run as the
page loads. Firstly we define some selectors which will be useful throughout
this process::

    var langnames = "div.language";
    var langchooser = "#lang-chooser";

Then we look to see if the user has a preference saved on their
machine if not then we will default to English::

    if(localStorage.lang) {

        var new_lang = localStorage.lang;
    } else {

        var new_lang = "en";
    }

Next we need to get the language the user is currently using from the URL and
see if we need to do anything about it::

    var l = window.location;
    var current_lang = l.pathname.substr(1,2);

Where :ref:`pathname` is the URL after the .com or .org bit in the address. For
example if the address was :code:`www.website.co.uk/blog/post17/edit` then
:code:`pathname` would hold :code:`blog/post17/edit`. Since all we want is the
language code which is the first 2 characters of the pathname we extract them
using :code:`substr`.

Now we check to see if any action needs to be taken, if not then we just ensure
that the dropdown actually matches what the current language is::

    if (current_lang !== new_lang) {

        changeLanguage(new_lang);
    } else {

        $(langchooser).val(current_lang);
    }

Finally after loading the user's preference we hook up the :code:`change` event
on the dropdown menu to change the language when the user makes a choice::

    $(langchooser).change(function() {

        var new_lang = $(langchooser).val();
        changeLanguage(new_lang);
    });

So now we just have to write the :code:`changeLanguage` function

============================
The Change Language Function
============================

The first thing we do is check to see if the user's browser supports local
storage so we can save the user's preference. If it does then we save their
choice as the new preference::

    if (typeof(Storage) !== undefined) {
        localStorage.setItem("lang", short);
    }

Next we need to get the browser to open the right URL for the current degree
scheme but with the new language. So first we need the path to the current
page::

    var l = window.location;
    var path = l.pathname;

Now we need to swap the language code in the path, but take care since if we are
on the list of available degrees (the :code:`index` page) then we will need to
handle this differently::

    if (path == "/") {

        path = '/' + short + "/index.html";
    } else {

        path = '/' + short + path.substr(3);
    }

Finally we need to construct the new URL making sure we match the protocol
(:code:`http:` or :code:`https:`) the
user is using and get the browser to open it::

    var url = l.protocol + '//' + l.host + path;
    window.open(url, "_self");
