$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Id", "Name", "Release Year"];
	var header = document.createElement('tr');
	
	for (i in headers){
		var headerCell = document.createElement('th');
		headerCell.append(headers[i]);
		if(i == 0){
			$(headerCell).addClass('hiddenCol');
		}
		else if(i == 7){
			$(headerCell).addClass('updateCell');
		}
		header.append(headerCell);
	}
	
	tablehead.append(header);
	$('#dataDisplay').append(tablehead);
	
	console.log("Loading Data");
	loadData();
	fillGames();
});

function loadData(){
	$.ajax({
		url: '/fill_smash',
		method: "get",
		dataType: 'json',
		success: function(data,textStatus,jqXHR){
			var json = JSON.parse(data.results);
			
			$('table #dataRow').each(function(){
				$(this).remove();
			});
			$('table tbody').each(function(){
				$(this).remove();
			});
	
			var tablebody = document.createElement('tbody');
			
			if(json.length){
				for (var i = 0; i < json.length; i++){
					var newRow = document.createElement('tr');
					$('newRow').attr('id','dataRow');
					for(data in json[i]){
						var newCell = document.createElement('td');
						newCell.append(json[i][data]);
						if(data == "date"){
							var date = $(newCell).text();
							date = date.substring(0, (date.indexOf('T')));
							$(newCell).text(date);
						}
						if(data == "Id"){
							$(newCell).addClass('hiddenCol');
						}
						newRow.append(newCell);
					}
					var deleteBtn = document.createElement('button');
					var newCell = document.createElement('td');
					$(deleteBtn).addClass("deleteGame");
					$(deleteBtn).text('Delete');
					newCell.append(deleteBtn);
					newRow.append(newCell);
					
					var edit = document.createElement('button');
					var newCell = document.createElement('td');
					$(newCell).addClass('updateCell');
					$(edit).addClass('updateSmash');
					$(edit).text('Edit');
					newCell.append(edit);
					newRow.append(newCell);
					
					tablebody.append(newRow);
				}
				$('#dataDisplay').append(tablebody);
			}
		},
		error: function(ts){console.log("Error in the Get");},
	});
}

function fillGames(){
	$.ajax({
		url: '/fill_dropdown_by_smash',
		method: "get",
		dataType: 'json',
		success: function(data,textStatus,jqXHR){
			var json = JSON.parse(data.results);
			if(json.length){
					var select = $('#smash_games_select');
					for (var i = 0; i < json.length; i++){
						for(data in json[i]){
							console.log(json[i][data]);
							var option = document.createElement('option');
							option.value = json[i][data];
							option.innerHTML = json[i][data];
							console.log(option);
							select.append(option);
						}
					}
				}
		},
		error: function(ts){console.log("Error in the Get");},
	});
}

$(document).on('click','#submitGCMButton',function(){
	var desired = $('#check_smash_contents option:selected').text();
	var game = $('#smash_games_select option:selected').text();
	
	if(desired!="--Choose One--" && game!="--Choose One--"){
		$('#searchResults').show();
		$('#searchInfo').empty();
		$('#searchPrint').empty();
		$('#searchInfo').append(desired+" found in the game " + game);
		var url = '';
		if(desired == "Characters"){
			url = "/search_games_characters?game_name="+game;
		}
		else if(desired == "Maps"){
			url = "/search_games_maps?game_name="+game;
		}
		loadSearch(url);
	}
});

$(document).on('click','#hideButton',function(){
	$('#searchInfo').empty();
	$('#searchPrint').empty();
	$('#searchResults').hide();
});

function loadSearch(x){
	$.ajax({
		url: x,
		method: "get",
		dataType: 'json',
		success: function(data,textStatus,jqXHR){
			var json = JSON.parse(data.results);
			if(json.length){
					var search = $('#searchPrint');
					for (var i = 0; i < json.length; i++){
						for(data in json[i]){
							console.log(json[i][data]);
							search.append("<li>"+json[i][data]);
						}
					}
				}
		},
		error: function(ts){console.log("Error in the Get");},
	});
}

$('#newSmash').submit('click',function(event) {
	if($('#Series_dropdown').val() == "no_series"){
		window.location.href = 'Original_series';
	}
	else{
		$.ajax({
			url : "/insert_Smash",
			method: "get",
			dataType: "json",
			data: $("#newSmash").serialize(),
			success: function(){
				console.log("Loading Data after insert");
				loadData('/fill_smash');
			},
			error: function(ts){console.log(ts.responseText);},
		});	
	}
	event.preventDefault();
});

$(document).on('click','.updateSmash',function(){
	console.log("Changing Windows");
	$('#updateSmash').toggle();
	$('#newSmash').toggle();
	$('.updateCell').toggle();
	$('.deleteSmash').toggle();

	console.log($(this).closest('tr').find('td:eq(3)').text());

	$('#idUpdateSmash').val($(this).closest('tr').find('td:eq(0)').text());
	$('#smashNameUpdate').val($(this).closest('tr').find('td:eq(1)').text());
	$('#smashReleaseUpdate').val($(this).closest('tr').find('td:eq(2)').text());
	
});

$(document).on('click','#cancelUpdateSmash',function(){
	console.log("Changing Windows");
	$('#updateSmash').toggle();
	$('#newSmash').toggle();
	$('.updateCell').toggle();
	$('.deleteSmash').toggle();
});

$('#updateSmash').submit('click', function(event){
	var id = $('#idUpdateSmash').val();
	console.log(id);
	$.ajax({
		url: '/update_smash?id='+id,
		method: "get",
		dataType: "json",
		data: $("#updateSmash").serialize(),
		success: function(){
			console.log("Updating Data");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#updateSmash').toggle();
	$('#newSmash').toggle();
	$('.updateCell').toggle();
	$('.deleteSmash').toggle();
	event.preventDefault();
});

$(document).on('click','.deleteGame',function(){
	$('#deleteGame').show();
	var id = $(this).closest('tr').find('td:eq(0)').text();
	var name = $(this).closest('tr').find('td:eq(1)').text();

	$('#deleteGameId').text(id);
	$('#deleteGameName').text(name);
});

$(document).on('click','#cancelDeleteGame',function(){
	$('#deleteGame').hide();
});

$(document).on('click','#submitDeleteGame',function(){
	var id = $('#deleteGameId').text();
	console.log(id);
	
	$.ajax({
		url : "/delete_smash_relation?game_id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$.ajax({
		url : "/delete_smash?id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#deleteGame').hide();
});