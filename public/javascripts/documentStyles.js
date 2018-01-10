// file contains all the jQuery initializers
// required by the materializecss framework

$('#address-tab').click(function() {
    var i = $(this).index();
    $('#add-map').hide();
});

$('#map-tab').click(function() {
    var i = $(this).index();
    $('#add-map').show();
});

$(document).ready(function(){
  $('ul.tabs').tabs();
});

$(document).ready(function(){
  $('.collapsible').collapsible();
});

$(document).ready(function() {
  $('select').material_select();
});

$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

(function($){
  $(function(){

    $('#button-collapse').sideNav();

  }); // end of document ready
})(jQuery); // end of jQuery name space
