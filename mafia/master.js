$(document).ready(function(){
	player_list = {};

	function win(alignment) {
		mode = (alignment == "Mafia" ? "danger": "success")
		show_message(mode, "Winner!", alignment + " have won the game!");
	}

	function remove_player(name) {
		role = player_list[name];

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

	$("[data-kill]").on("click", function(){
		remove_player($(this).data("kill"));
	});

	$('#new-player').on('keypress', function (e) {
		if(e.which === 13){

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");

            add_player($(this).val());

            $(this).val("");

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
    });

	$("#begin-game").on("click", function(e){
		players = Object.keys(player_list).length;
		showing_player = 0;
		if(players > 3) {
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
			show_message("primary", "The game is now running!", "Good Luck and Lynch Well!")
		}

		e.preventDefault();
		name = Object.keys(player_list)[showing_player];
		role = player_list[name];

		pathname = window.location.pathname.split("/");
		pathname.pop();
		pathname = pathname.join("/");

		url = window.location.hostname + pathname + "/role.html?name=" + name + "&role=" + role;
		$("#active-qrcode").empty().qrcode(url);

		document.getElementById('current-player-shown').innerHTML = name;

		showing_player++;
	});
});