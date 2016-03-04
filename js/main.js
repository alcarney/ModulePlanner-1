$(document).ready(function() {

    //This is for the credit counter
    var credit = 0;

    // This function deselects any modules which depend on a module
    // we just unselected
    var checkProvides = function(code) {

        // This selects the list of modules this one enables you to study
        var selector = "div.module#" + code + " > div.provides";

        // If that list actually exists for this module
        if ($(selector).children().length) {

            $(selector).children().each(function () {
                var m = $(this).attr("class");

                if(($("div.module#" + m).hasClass("selected"))) {
                    $("div.module#" + m).removeClass("selected");
                    credit = credit - $(selector + " > span.value").text();
                }

            });
        }
    };

    // This function checks the requirements for the module, if this returns
    // false then you cannot choose this module
    var checkRequires = function(code) {

        // This will select the list of requirements
        var selector = "div.module#" + code + " > ul.requires";

        // Assume that we can choose the module for now
        var available = true;

         // If the list of requirements exist
        if ($(selector).children().length) {

            // For each item in the list,
            $(selector).children().each(function () {

                // The class of this item contains the module code we need
                var m = $(this).attr("class");

                // If the module isn't selected
                if(!($("div.module#" + m).hasClass("selected"))) {

                  // Then we can't choose this module
                  available = false;

                  // Show the list of requirements so that the user knows why
                  $("div.module#" + code + " > .requires").slideDown("slow");
                }
            });
            return available;
        } else {
            // No requirements, just select it
            return available;
        }
    };

    // This function handles toggling your selection of a module
    var selectModule = function(code) {

        // This selects the module
        var selector = "div.module#" + code;
        var totalcredits = "div.year > span.total-credits";
        credit = credit + $(selector + " > span.value").text();

        if ($(selector).hasClass("selected")) {

            // If we have already selected the module, deselect it
            checkProvides(code); // Check to see if provides something
            $(selector).removeClass("selected");
            credit = credit - $(selector + " > span.value").text();

        } else {

            // First check to see if the requirements are satisfied
            if (checkRequires(code)) {

                // If so select it
                $(selector).addClass("selected");
                $(selector + "> .requires").slideUp("slow");
                credit = credit - $(selector + " > span.value").text();
                $("div.year >").text() = "Text";
            }
        }

    };

    $("div.optional > div.module").click(

        // For optional modules, add the ability to (de)select them.
        function() {
            var code = $(this).attr("id");
            selectModule(code);
        });
});
