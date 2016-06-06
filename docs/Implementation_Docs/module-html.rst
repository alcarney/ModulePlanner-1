.. _module-html:

The Module HTML
===============

.. highlight:: liquid

All the HTML containing both the user facing information and the information
from the database for each module is contained in
:code:`_includes/module_info.html` which gets included on the main course page
each time a module is added to the page.

When this file is included the only variables that are in scope is the module's
code and the course metadata from which we need to retrieve all the data we need
from the database. More specifically we need:

- :code:`module`: This object will contain all the information on the current
  module such as its title and pre-requisites
- :code:`provides`: Since this information isn't explicitly in the database we
  will need to construct a list of module codes that depend on the current
  module. This information will be used primarily by our Javascript when we
  deselect a module.
- :code:`lang`: This object contains all the localized translations for various
  titles and headers on the page. 

==========================
Getting a Module's Details
==========================

A module's code is unique so it's easy enough for us to search through the
database and find the right record.

The :code:`provides` object contains all the module codes that depend in the
current module separated by a space. But this information isn't stored in the
database - mainly because we shouldn't have to expect users to maintain both
requirements and provides separately as this could lead to errors in the data.

Instead we work it out ourselves just by going through each module in the
database, looking at its :code:`provides` attribute and seeing if it contains
the current module's code. If it does then we add it to the list.

Since both of these require looping through each module in the database it makes
sense to do them both at the start of the template::

    {% for m in site.data.modules %}             <-- For each module in the database
        {% if m.requires contains code %}        <-- Does this module require this one?
            {% if provides %}
                {% assign provides = provides | append: " " | append: m.code %}
            {% else %}
                {% assign provides = m.code %}   <-- If so add it to the list
            {% endif %}
        {% endif %}

        {% if m.code == code %}                  <-- Is this module the current one?
            {% assign module = m %}              <-- If so assign it to the module object
        {% endif %}

    {% endfor %}

==============================
Picking the Right Translations
==============================

The language is set by the course page importing this template in its
frontmatter, we need to make sure that we choose an appropriate localization for
all our titles and headers. So again it's a case of going through each record
until we find the right record::

    {% for l in site.data.language %}
        {% if page.lang == l.short %}
            {% assign lang = l%}
        {% endif %}
    {% endfor %}

We now have everything we need to write the HTML for the current module.

================
Writing the HTML
================

So first of call it would be good to show the user the name of the module and
its code::

    <h2>{{module.name}}</h2>
    <h3>{{module.code | upcase }}</h3>

Next we add a link to where the user can find more information about the content
of the module as well as how many credits it is worth::

    <div class="group">
        <a href="{{site.data.settings.info}}/{{module.more-info}}.html" target="_blank">{{lang.more-info}}</a>
        <aside>{{lang.credits}}:<span class="credit">{{module.credits}}</span></aside>
    </div>

Now would be a good time to note that information we want to access from the
webpage we place inside :code:`div` or :code:`span` elements with a given
:code:`class` or :code:`id` value so we can easily find it using selectors in
our Javascript code.

Next its time to add the list of modules that depend on this module (if there
are any). This information isn't displayed to the user, we only need it for when
we deselect the module::

    {% if provides %}
    <div class="provides">
        {% assign provide_list = provides | split:" " %}
        {% for c in provide_list %}
            <span class="{{c}}"></span>
        {% endfor %}
    </div>

    {% assign provides = false %}
    {% endif %}

Since this template code shares scope with the main course template we need to
set the :code:`provides` object to be false when we finish so that we don't
accidentally add the list to a module which doesn't need one.

Finally we need to add the list of requirements (if there are any) both for the
user to see and for us to access in our Javascript later. As well as getting
each requirement to link to itself on the page so users can find it easily::

    {% if module.requires %}
    <p class="requires">{{lang.requires}}</p>
    <ul class="requires">
        {% for c in module.requires %}         <-- For each module code in requirements
            {% for m in site.data.modules %}   <-- Look through the database for the module which matches this code
                {% if m.code == c %}
                    {% assign required = m %}  <-- Assign the matching module to a variable so we can use it
                {% endif %}
            {% endfor %}

            <li class="{{c}}"><a href="#{{required.code}}">{{required.name}}</a></li>
        {% endfor %}
    </ul>
    {% endif %}


.. _Liquid Template: https://github.com/Shopify/liquid/wiki/liquid-for-designers
.. _jQuery: https://jquery.com/
