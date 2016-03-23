$(document).ready(function () {


    // Hopefully so that the code is easier to follow we define our selectors
    // now
    var langnames = "div.language";
    var langchooser = "select#lang-chooser";

    // This function handles everything to do with changing the language
    // including:
    //             - Updating the dropdown selection
    //             - If the facility is available, saving the user preference
    var changeLanguage = function(short) {


        // Unhide the relevant language
        var new_lang = short.substr(0, 2);
        $(langnames + "#" + new_lang).show();

        // Update the dropdown
        $(langchooser).val(short);

        // If local storage is available, save the language so the change
        // is persistent both accross page loads and entire sessions
        if (typeof(Storage) !== undefined) {
            localStorage.setItem("lang", short);
        };
    };

    // In case there already is a saved preference, load that language
    // otherwise load the default
    if (localStorage.lang) {
        changeLanguage(localStorage.lang);
    } else {
	    changeLanguage("en");
    };

    // Finally this code is only run when the user makes a choice using the
    // dropdown in the footer
    $(langchooser).change(function() {
        var new_end = $(langchooser).val();

	    changeLanguage(new_end);
        var l = window.location,
        url = l.protocol + '//' + l.host + '/' + new_end;
        window.open(url, "_self");
    });
});
