$(document).ready(function(){
	player_list = {};

	// not used for anything demanding security. Only used to generate
	// the URLs for saved games. I'm not an idiot.
	// WARNING: IF YOU CHANGE THIS EVERY GAME EVER CREATED WILL BE FUNDAMENTALLY
	// ALTERED. ONLY FOR USE BY FUCKING MANIACS.
	MASTER_ENCRYPTION_KEY = "damir_is_god";

	bg = "is-primary" // set default background for location banner

	/**
	Utiliy functions
	*/
	function copyTextToClipboard(text) {
		// copies the variable text to the clipboard via a janky hack.
		var textArea = document.createElement("textarea");

		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';


		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying ' + text + ' command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
	}

	function getParameterByName(name, url) {
		// retrieves a parameter from the query string by name
		// e.g. getParameterByName("foo", "index.html/?foo=bar") returns "bar".
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function select_location() {
		var randomNumber = 1;
		var lastRandomNumber = randomNumber;
		$.ajax({url: 'locations.txt', async: false}).done(function(content) {
			lines = content.replace(/\r\n|\r/g, '\n').trim().split('\n');
			if (lines && lines.length) {
				while (randomNumber === lastRandomNumber) {
					randomNumber = parseInt(Math.random() * lines.length);
					if (lines.length === 1) { break; }
				}
				lastRandomNumber = randomNumber;
				place = lines[randomNumber];
			}
		});

		return place;
	}

	/**
	 * End of utility functions
	 */

	 function construct_url(file) {
	 	pathname = window.location.pathname.split("/");
	 	pathname.pop();
	 	pathname = pathname.join("/");
	 	return (window.location.hostname + pathname + file);
	 }

	 function shuffle(array) {
	 	var currentIndex = array.length, temporaryValue, randomIndex;

	 	while (0 !== currentIndex) {

	 		randomIndex = Math.floor(Math.random() * currentIndex);
	 		currentIndex -= 1;

	 		temporaryValue = array[currentIndex];
	 		array[currentIndex] = array[randomIndex];
	 		array[randomIndex] = temporaryValue;
	 	}

	 	return array;
	 }

	 function add_player(name) {
	 	if (name == "") {
	 		return;
	 	}

	 	if (name in player_list) {
	 		return;
	 	}

	 	$("#no-players").remove();

	 	$("#playerlist").append('<div class="panel-block" data-player="' + name + '">' + name + '</div>');

	 	$('[data-player="' + name + '"]').slideDown(1000);

	 	player_list[name] = "";
	 }

	 function show_message(type, title, body) {
	 	$("#messages").html(`<article class="message is-` + type + `">
	 		<div class="message-header">
	 		<p><strong>` + title + `</strong></p>
	 		</div>
	 		<div class="message-body">
	 		` + body + `
	 		</div>
	 		</article>`);
	 }

	 $('#new-player').on('keypress', function (e) {
	 	if(e.which === 13){

	 		if($(this).val() == "") {
	 			$("#begin-game").click();
	 			return;
	 		}

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            add_player($(this).val());

            $(this).val("");

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");

            $(this).focus();
        }
    });

	 if(getParameterByName("pl") != null) {
	 	pl = XORCipher.decode(MASTER_ENCRYPTION_KEY, getParameterByName("pl"));
	 	pls = pl.split(",");
	 	pls.map(add_player);
	 }

	 $("#get-url").on("click", function(e){
	 	querystr = XORCipher.encode(MASTER_ENCRYPTION_KEY, Object.keys(player_list).join(","));
	 	url_str = construct_url("") + "/?pl=" + querystr;
	 	copyTextToClipboard(url_str);
	 	$('.toast').addClass('on');
	 	setTimeout(function(){
	 		$('.toast').removeClass("on");;
	 	}, 3000);
	 });

	 $("#begin-game").on("click", function(e){
	 	players = Object.keys(player_list).length;
	 	showing_player = 0;
	 	if(players > 3) {
	 		$("#add-player-box").remove();

	 		i = 0

	 		spy_index = Math.floor(Math.random() * players);

	 		for (var key in player_list) {
	 			role = 'agent';
	 			if(i == spy_index) {
	 				role = 'spy';
	 				console.log("[game] " + key + " is the spy")
	 			}
	 			player_list[key] = role;
	 			i++;
	 		}

	 		$("#begin-game").remove();
	 		$("#next-player").css({"visibility": "visible"});
	 		$("#get-url").remove();
	 	} else {
	 		show_message("danger", "Error - Not enough players", "Spyfall requires at least <strong>4</strong> players to run. You are trying to play with <strong>" + players + "</strong>. Please add some more players and try again.");
	 	}
	 });

	 place_to_guess = select_location();
	 console.log("[game] " + place_to_guess + " selected as the location");

	 $("#next-player").on("click",function(e){
	 	if (showing_player == Object.keys(player_list).length) {
	 		show_message("primary", "The game is now running!", "May the odds be <em>ever</em> in your favor!");
	 		$("#controls").remove();
	 		$("#current-player-shown").remove();
	 		$("#location").remove();
	 		return;
	 	}

	 	e.preventDefault();
	 	name = Object.keys(player_list)[showing_player];
	 	role = player_list[name];

	 	$("#location").removeClass(bg);
	 	$("#location").addClass('is-primary');

	 	document.getElementById('current-player-shown').innerHTML = "Current player: " + name;
	 	document.getElementById('location').innerHTML = "";

	 	setTimeout(function(){
	 		bg = "is-primary";
	 		text = place_to_guess;

	 		if(role == "spy") {
	 			bg = "is-danger";
	 			text = "You are SPY!";
	 		}

	 		$("#location").removeClass("is-primary");
	 		$("#location").removeClass("is-danger");
	 		$("#location").addClass(bg);

	 		document.getElementById('location').innerHTML = '<h1 class="title is-1 has-text-centered">' + text + '</h1>'
	 	}, 1000);

	 	showing_player++;
	 });
	});