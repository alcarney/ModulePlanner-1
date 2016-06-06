.. _course-page:

The Course Page
===============

.. highlight:: yaml

As you probably know from the :ref:`courses` page the way get Jekyll to generate
a page for a degree scheme is to get the user to create a file and provide three
pieces of information::


     ---
     layout: course
     short: <degree-scheme>
     lang: <language-code>
     ---

So that means for us we have to somehow take just these three bits of
information and generate everything we need not only information for visitors to
the site, but also enough structure for our Javascript to handle
:ref:`module-selection`.

.. highlight:: liquid

==========================
Getting the Course Details
==========================

We are only given a short code representing the degree scheme, we need to get
the full record from the database. Thankfully as this code is unique we can
simply go through each record until we find the right one::

    {% for c in site.data.courses %}
        {% if c.short == page.short %}
            {% assign course = c %}        
        {% endif %}
    {% endfor %}

You can find more information about the course object's structure on the
:ref:`courses` page

=================================
Choosing Appropriate Translations
=================================

We need to make sure we choose the right set of translations for all our titles
and headers, so like above it's just a case of searching the database for the
right record::

    {% for l in site.data.language %}
        {% if page.lang == l.short %}
            {% assign lang = l%}
        {% endif %}
    {% endfor %}

================
Writing the HTML
================

Now we have all we need it's time to write the HTML for the page we start off by
including :ref:`the-planner-header` which contains the clear all selected
modules button and options like the theme and language::

    {% include planner_header.html %}

Now we wrap everything that follows in a :code:`div` element with the
:code:`planner` class so we can find everything we need in the Javascript later.
We start out each year with writing its name and adding a counter which will
keep track of the number of credits that have been chosen by the user::

    <div class="planner">

    {% for year in course.modules %}
        <div class="year" id="year{{forloop.index}}">
             <h1>{{lang.year}} {{forloop.index}}</h1>
             <h3>{{lang.credits-chosen}}: <span class="credit"></span></h3>

Notice how we don't specify an initial value for the number of chosen credits,
that's because we set this from the Javascript as the initial value will be
dependent on the number of core modules for the course in this year.

Next we list out each of the core modules::

    <div class="core">
    {% for code in year.core %}

        <div class="module selected" id="{{code}}">
            {% include module_info.html %}
        </div>
    {% endfor %}
    </div>

The HTML for the module information and layout is handled by the
:code:`_includes/module_info.html` template which you can find more information
about it on :ref:`module-html` page. Since core modules are mandatory we add
the :code:`selected` class to the :code:`div` element surrounding each module,
so that our Javascript knows that these modules have already been selected.

Next we list out all the optional modules for the year::

      <div class="optional">
      {% for code in year.optional %}

          <div class="module" id="{{code}}">
              {% include module_info.html %}
          </div>
      {% endfor %}
      </div>
    
All that's left to do is to close the remaining :code:`div` elements and the
main for loop which I will omit from this page. You can find all of the above
code in context by looking at the :code:`_layouts/course.html` file.
