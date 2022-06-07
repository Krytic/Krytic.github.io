jQuery(function ($) {

    'use strict';

    // --------------------------------------------------------------------
    // PreLoader
    // --------------------------------------------------------------------

    (function () {
        $('#preloader').delay(200).fadeOut('slow');
    }());

    $(document).ready(function(){
		var url = 'https://cdn.jsdelivr.net/gh/krytic/kaitiaki/kaitiaki/plotfile.py';

		$.get(url, function(data) {
			$('#kaitiaki-codeblock').text(data);
			hljs.highlightAll();
		}, 'text');


	    $("#show-kaitiaki").on('click', function(){
	    	$("#kaitiaki-code").show("slide", { direction: "right" }, 2000);
	    	// $("#dismiss").show("slide", { direction: "right" }, 2000);
	    });

	    $("#dismiss-btn").on('click', function(){
	    	$("#kaitiaki-code").hide("slide", { direction: "right" }, 2000);
	    });
	});

}); // JQuery end