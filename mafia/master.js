$(document).ready(function(){
	player_list = {};

	// not used for anything demanding security. Only used to generate
	// the URLs for saved games. I'm not an idiot.
	// WARNING: IF YOU CHANGE THIS EVERY GAME EVER CREATED WILL BE FUNDAMENTALLY
	// ALTERED. ONLY FOR USE BY FUCKING MANIACS.
	MASTER_ENCRYPTION_KEY = "damir_is_god";

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

	function win(alignment) {
		// determines who has won the game
		mode = (alignment == "Mafia" ? "danger": "success")
		show_message(mode, "Winner!", alignment + " have won the game!");
		$("[data-kill]").css({"display": "none"});
	}

	function remove_player(name) {
		// removes a player from the game
		role = player_list[name];
		delete player_list[name];

		$("[data-player=" + name + "]").slideUp(1000);

		if (role == "mafia") {
			mafioso--;
		}
		else {
			villagers--;
		}

		if (mafioso == villagers) {
			win("Mafia");
		}
		else if (mafioso == 0) {
			win("Town");
		}
	}

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

		$("#playerlist").append('<div class="panel-block" data-player="' + name + '">' + name + '<a class="is-pulled-right" data-kill="' + name + '">lynch / kill</a></div>');

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

	$(document).on("click", "[data-kill]", function(){
		remove_player($(this).data("kill"));
	})

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
			mafioso = Math.min(Math.floor(players / 3), 3);
			nurse = 1;
			sheriff = 1;
			town = players - mafioso - nurse - sheriff;
			villagers = players - mafioso

			roles = [];

			for (var i = mafioso - 1; i >= 0; i--) {
				roles.push("mafia");
			}

			for (var i = nurse - 1; i >= 0; i--) {
				roles.push("nurse");
			}

			for (var i = sheriff - 1; i >= 0; i--) {
				roles.push("sheriff");
			}

			for (var i = town - 1; i>= 0; i--) {
				roles.push("town");
			}

			shuffle(roles);

			show_message("info", "The Honour Code", "Mafia runs on the honour code. Please only scan the QR code below if your name is shown beneath it.");

			i = 0
			for (var key in player_list) {
				player_list[key] = roles[i];
				i++;
			}

			$("#begin-game").css({"display": "none"});
			$("#next-player").css({"visibility": "visible"});
		} else {
			show_message("danger", "Error - Not enough players", "Mafia requires at least <strong>4</strong> players to run. You are trying to play with <strong>" + players + "</strong>. Please add some more players and try again.");
		}
	});

	$("#next-player").on("click",function(e){
		if (showing_player == players) {
			$("#next-player").css({"display": "none"});
			$("#active-qrcode").css({"display": "none"});
			$("#current-player-shown").css({"display": "none"});

			show_message("primary", "The game is now running!", "Good Luck and Lynch Well!");
		}

		e.preventDefault();
		name = Object.keys(player_list)[showing_player];
		role = player_list[name];

		url = construct_url("/role.html?name=" + name + "&role=" + role);
		$("#active-qrcode").empty().qrcode(url);

		document.getElementById('current-player-shown').innerHTML = name;

		showing_player++;
	});
});