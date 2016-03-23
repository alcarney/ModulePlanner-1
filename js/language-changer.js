$(document).ready(function () {


    // Hopefully so that the code is easier to follow we define our selectors
    // now
    var langnames = "div.language";
    var langchooser = "#lang-chooser";

    // This function handles everything to do with changing the language
    // including:
    //             - Updating the dropdown selection
    //             - If the facility is available, saving the user preference
    var changeLanguage = function(short) {

        // Unhide the relevant language
        $(langnames + "#" + short).show();

        // Update the dropdown
        $(langchooser).val(short);

        // If local storage is available, save the language so the change
        // is persistent both accross page loads and entire sessions
        if (typeof(Storage) !== undefined) {
            localStorage.setItem("lang", short);
        };

        // Get the current path
        var l = window.location;
        var path = l.pathname;

        // Replace the lang part of the path

        // Handle the index page
        if (path == "/") {
            path = '/' + short + "/index.html";
        } else {
            // Otherwise we are assuming that we are on a 'normal' page
            path = '/' + short + path.substr(3);
        }

        // Build the new url
        var url = l.protocol + '//' + l.host + path;

        // Open it
        window.open(url, "_self");
    };

    // In case there already is a saved preference, load that language
    // otherwise load the default
    if (localStorage.lang) {
        var new_lang = localStorage.lang;
    } else {
	    var new_lang = "en";
    };

    // Get the current language from the url
    var l = window.location;
    var current_lang = l.pathname.substr(1,2);

    // If the current language is different from the requested one chnage the
    // page
    if (current_lang !== new_lang) {
        changeLanguage(new_lang);
    } else {
        // If not just ensure that the dropdown is correct
        $(langchooser).val(current_lang);
    }

    // Finally this code is only run when the user makes a choice using the
    // dropdown in the footer
    $(langchooser).change(function() {
        var new_lang = $(langchooser).val();
        changeLanguage(new_lang);
    });
});
