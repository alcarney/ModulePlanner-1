.. _the-planner-header:

The Planner Header
==================

The header for the page contains navigation links and options for the module
planner such as what language you'd like the website to you and a helpful "Clear
Selected" modules button.

.. highlight:: liquid

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

We put everything inside a header element and start off with adding the
navigation links::

    <header class="site-header">
        <div class="group">
            <a class="site-title" href="{{site.baseurl}}/{{lang.short}}/index.html">{{lang.change-deg}}</a>

Then we add a dropdown menu which holds all the themes available for the website
for the user to choose from. Currently there are only two :code:`Light` and
:code:`Dark`. For more information on please refer to the :ref:`theme-changer`
page::

   <aside>
       <p>
           <span class="theme">
               {{lang.theme}}:
               <select id="theme-changer">
                   {% for theme in site.data.themes %}
                       <option value="{{theme.shortname}}">{{theme.name}}</option>
                   {% endfor %}
               </select>
           </span>

Following a similar process we also build a dropdown menu for each language
supported by the website. For more information on be sure to check out the
:ref:`language-changer` page::

    <span class="language">
        {{lang.language}}:
        <select id="lang-chooser">
            {% for langu in site.data.language %}
                <option value="{{langu.short}}">{{langu.name}}</option>
            {% endfor %}
        </select>
    </span>

Next we close of the :code:`p`, :code:`aside` and :code:`div` elements before
finally adding the "Clear Selected" button. Where the "button" is actually a
header element which we style to look like a button::

    <div class="wrapper">
        <h1>{{course.name}}</h1>
        <h2 class="clear">{{lang.reset}}</h2>
    </div>



