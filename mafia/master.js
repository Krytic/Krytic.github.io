$(document).ready(function(){
	player_list = {};

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

		$("#playerlist").append('<div class="panel-block" data-player="' + name + '">' + name + '<a class="is-pulled-right" href="#" id="kill" data-to-kill="' + name + '">lynch / kill</a></div>');

		$('[data-player="' + name + '"]').slideDown(1000);

		player_list[name] = "";
	}

	function remove_player() {
		return;
	}

	function show_message(type, title, body) {
		$("#messages").html(`<article class="message is-` + type + `">
			<div class="message-header">
			<p>` + title + `</p>
			</div>
			<div class="message-body">
			` + body + `
			</div>
			</article>`);
	}

	add_player("sean");
	add_player("john");
	add_player("dave");

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

			show_message("info", "The Honour Code", "Mafia runs on the honour code. Please only scan the QR code below if your name is shown beneath it.");

			i = 0
			for (var key in player_list) {
				player_list[key] = roles[i];
				i++;
			}

			$("#begin-game").css({"display": "none"});
			$("#next-player").css({"visibility": "visible"});
		} else {
			console.log("error");
			show_message("danger", "Error - Not enough players", "Mafia requires at least <strong>4</strong> players to run. You are trying to play with <strong>" + players + "</strong>. Please add some more players and try again.");
			add_player("ryan");
		}
	});

	$("#next-player").on("click",function(e){
		e.preventDefault();
		name = Object.keys(player_list)[showing_player];
		role = player_list[name];

		console.log(name + " is " + role);

		pathname = window.location.pathname.split("/");
		pathname.pop();
		pathname = pathname.join("/");
		console.log(pathname);

		url = window.location.hostname + pathname + "/role.html?name=" + name + "&role=" + role;
		$("#active-qrcode").val("");
		$("#active-qrcode").qrcode(url);
		$("#current-player-shown").val(name);

		showing_player++;
	});
});