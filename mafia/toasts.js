toast = $("#id").toast(options);
toast.pop();

(function($){
  $.fn.toast = function(options) {
    var settings = $.extend({
      "type": "jam"
    }, options);

    $('.toast').addClass('on');
    setTimeout(function(){
      $('.toast').removeClass("on");;
    }, 3000);
  }
})