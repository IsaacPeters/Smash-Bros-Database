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
					$(deleteBtn).addClass("deleteExer");
					$(deleteBtn).text('Delete');
					newCell.append(deleteBtn);
					newRow.append(newCell);
					
					var edit = document.createElement('button');
					var newCell = document.createElement('td');
					$(newCell).addClass('updateCell');
					$(edit).addClass('updateExer');
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

$('#newSmash').submit('click',function(event) {
	$.ajax({
		url : "/insert_smash",
		method: "get",
		dataType: "json",
		data: $("#newSmash").serialize(),
		success: function(){
			console.log("Loading Data after insert");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	event.preventDefault();
});

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

$(document).on('click','.updateExer',function(){
	console.log("Changing Windows");
	$('#update').toggle();
	$('#insert').toggle();
	$('.updateCell').toggle();
	
	$('#idUpdate').val($(this).closest('tr').find('td:eq(0)').text());
	$('#exerInputup').val($(this).closest('tr').find('td:eq(2)').text());
	$('#dateInputup').val($(this).closest('tr').find('td:eq(1)').text());
	$('#repsInputup').val($(this).closest('tr').find('td:eq(3)').text());
	$('#weightInputup').val($(this).closest('tr').find('td:eq(4)').text());
	
	var unit = $(this).closest('tr').find('td:eq(5)').text();
	if(unit == "Pounds"){
		$('input:radio[id="unitInputup"][value="Pounds"]').prop('checked', true);		
	}
	else{
		$('input:radio[id="unitInputup"][value="Kilograms"]').prop('checked', true);
	}
});


$('#update').submit('click', function(event){
	
	var id = $('#idUpdate').val();
	$.ajax({
		url: '/update?id='+id+'&',
		method: "get",
		dataType: "json",
		data: $("#update").serialize(),
		success: function(){
			console.log("Updating Data");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	console.log("Changing Windows");
	$('#update').toggle();
	$('#insert').toggle();
	$('.updateCell').toggle();
	
	event.preventDefault();
});

$(document).on('click','.deleteExer',function(){
	var id = $(this).closest('tr').find('td:eq(0)').text();
	console.log(id);
	
	$.ajax({
		url : "/delete?id="+id,
		success: function(){
			console.log("Loading Data after insert");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});
	
});

$(document).on('click','.clearBtn',function(){
	
	$.ajax({
		url : "/reset-table",
		success: function(){
			console.log("Resetting Data");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});
	
});