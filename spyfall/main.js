function fetch_random(obj) {
	var temp_key, keys = [];
	for(temp_key in obj) {
		if(obj.hasOwnProperty(temp_key)) {
			keys.push(temp_key);
		}
	}
	return keys[Math.floor(Math.random() * keys.length)];
}

function ucfirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function doreveal(i, place, spy, stop) {
	$("#name").html(ucfirst(people[i]));
	$("#next").attr("id", "reveal");
	$("#reveal").html("reveal location / spy")
	$("#role").html("");
	$("#reveal").click(function(){
		if(spy == people[i]) {
			$("#role").html("you are spy ;-)")
		}
		else {
			$("#role").html(place)
		}

		$("#reveal").attr("id", "next");
		$("#next").html("next player");
		$("#next").click(function(){
			if(i == stop) {
				$("#playarea").html("<h1 class=\"text-center\">The game is now playing!</h1>"); //<button id=\"reset\" class=\"btn btn-block btn-danger\">Reset</button>");
				return;
			} else {
				doreveal(i+1, place, spy, stop);
			}
		});
	});
}

$(document).ready(function(){
	var players = {};
	var randomNumber = 1;
	var lastRandomNumber = randomNumber;
	var place = "";

	$(function() {
		$("input").each(function() {
			if($(this).attr("type") == "checkbox" && $(this).attr("data-toggle") == "toggle") {
				players[$(this).attr("name")] = $(this).is(":checked");
			}
		});
	});

	$(function() {
		$("input").change(function() {
			if($(this).attr("type") == "checkbox" && $(this).attr("data-toggle") == "toggle") {
				players[$(this).attr("name")] = $(this).is(":checked");
			}
		});
	});

	$("#play").click(function(){
		player_count = 0;
		for (var key in players) {
			if (players.hasOwnProperty(key)) {
				if(players[key] == false) {
					delete players[key]
				}
				else {
					++player_count;
				}
			}
		}

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

		spy = fetch_random(players);
		$("#savearea").html($("#playarea").html());
		$("#playarea").html("<h3 id=\"name\" class=\"text-center\"></h3><br /><p class=\"text-bold text-center lead\" id=\"role\"></p><br /><button id=\"reveal\" class=\"btn btn-info center-block\">reveal location / spy</button>");
		people = [];
		for (var key in players) {
			if (players.hasOwnProperty(key)) {
				people.push(key);
			}
		}

		doreveal(0, place, spy, player_count-1);

		$("#reset").click(function(){
			console.log("click me harder daddy")
			$("#playarea").html($("#savearea").html());
			$(function() {
				$("input").each(function() {
					if($(this).attr("type") == "checkbox" && $(this).attr("data-toggle") == "toggle") {
						players[$(this).attr("name")] = $(this).is(":checked");
					}
				});
			});
		});
	});
});
