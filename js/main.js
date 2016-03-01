$(document).ready(function() {

  // This function deselects any modules which depend on a module
  // we just removed
  var checkProvides = function(code) {

    var selector = "div.module#" + code + " > div.provides";
    if ($(selector).children().length) {

      $(selector).children().each(function () {
        var m = $(this).attr("class");

        if(($("div.module#" + m).hasClass("selected"))) {
          $("div.module#" + m).removeClass("selected");
        }

      });
    }
  };

  // This function checks the requirements for the module
  var checkRequires = function(code) {

    // Choose the list of requirements
    var selector = "div.module#" + code + " > ul.requires";
    var available = true;

     // If they exist check them, else return true
    if ($(selector).children().length) {

      $(selector).children().each(function () {
        var m = $(this).attr("class");

        if(!($("div.module#" + m).hasClass("selected"))) {
          available = false;
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

    if ($(selector).hasClass("selected")) {

      // If we have already selected the module, deselect it
      checkProvides(code); // Check to see if provides something
      $(selector).removeClass("selected");

    } else {

      // First check to see if the requirements are satisfied
      if (checkRequires(code)) {

        // If so select it
        $(selector).addClass("selected");
      }
    }

  };

  $("div.optional > div.module").click(

    // For optional modules, add the ability to (de)select them.
    function() {
      var code = $(this).attr("id");
      selectModule(code);
    });

  $("div.optional > div.module").click(function() {
    $(this).children("ul, p").slideToggle("slow");
  });
});
