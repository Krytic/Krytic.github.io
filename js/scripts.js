jQuery(function ($) {

    'use strict';

    // --------------------------------------------------------------------
    // PreLoader
    // --------------------------------------------------------------------

    (function () {
        $('#preloader').delay(200).fadeOut('slow');
    }());

    function setup_codeblock(codename, filestring) {
		var url = 'https://cdn.jsdelivr.net/gh/krytic/' + codename + "/" + filestring;

		$.get(url, function(data) {
			$('#' + codename + '-codeblock').text(data);
		}, 'text');


	    $("#show-" + codename).on('click', function(){
		    hljs.highlightElement(document.getElementById(codename + "-codeblock"));
	    	$("#" + codename + "-code").show("slide", { direction: "right" }, 2000);
	    	// $("#dismiss").show("slide", { direction: "right" }, 2000);
	    });

	    $("#dismiss-" + codename).on('click', function(){
	    	$('#' + codename + "-code").hide("slide", { direction: "right" }, 2000);
	    });

    }

    $(document).ready(function(){
    	function run_setups() {
			setup_codeblock('kaitiaki', 'kaitiaki/file_handlers/plotfile.py');
			setup_codeblock('takahe', 'src/integrator.jl');
			setup_codeblock('MyBBWiki', 'Upload/inc/plugins/wiki.php');
    	}

    	run_setups();

	});

}); // JQuery end