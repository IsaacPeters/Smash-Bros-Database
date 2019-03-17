$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Character_id", "Game_id","Character", "Smash Game"];
	var header = document.createElement('tr');
	
	for (i in headers){
		var headerCell = document.createElement('th');
		headerCell.append(headers[i]);
		if(i == 0 || i == 1){
			$(headerCell).addClass('hiddenCol');
		}
		if(i == 5){
			$(headerCell).addClass('updateCell');
		}
		header.append(headerCell);
	}
	
	tablehead.append(header);
	$('#dataDisplay').append(tablehead);
	
	console.log("Loading Data");
	loadData();
	fillDropdowns();
});

function loadData(){
	$.ajax({
		url: '/fill_cg',
		method: "get",
		dataType: 'json',
		success: function(data,textStatus,jqXHR){
			var json = JSON.parse(data.results);
			console.log(json);
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
						if(data == "Character_id" || data == "Game_id"){
							$(newCell).addClass('hiddenCol');
						}
						newRow.append(newCell);
					}
					var deleteBtn = document.createElement('button');
					var newCell = document.createElement('td');
					$(deleteBtn).addClass("deleteCG");
					$(deleteBtn).text('Delete');
					newCell.append(deleteBtn);
					newRow.append(newCell);
					
					var edit = document.createElement('button');
					var newCell = document.createElement('td');
					$(newCell).addClass('updateCell');
					$(edit).addClass('updateCG');
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

function fillDropdowns(){
	$.ajax({
	url: '/fill_dropdown_by_smash',
	method: "get",
	dataType: 'json',
	success: function(data,textStatus,jqXHR){
		var json = JSON.parse(data.results);
		if(json.length){
				var select = $('#smash_games_dropdown');
				var update = $('#smash_games_dropdown_update');
				for (var i = 0; i < json.length; i++){
					for(data in json[i]){
						var option = document.createElement('option');
						var option2 = document.createElement('option');
						option.value = json[i][data];
						option.innerHTML = json[i][data];
						select.append(option);
						option2.value = json[i][data];
						option2.innerHTML = json[i][data];
						update.append(option2);
					}
				}
			}
	},
	error: function(ts){console.log("Error in the Get");},
	});
	
	$.ajax({
	url: '/fill_dropdown_by_character',
	method: "get",
	dataType: 'json',
	success: function(data,textStatus,jqXHR){
		var json = JSON.parse(data.results);
		if(json.length){
				var select = $('#smash_characters_dropdown');
				var update = $('#smash_characters_dropdown_update');
				for (var i = 0; i < json.length; i++){
					for(data in json[i]){
						var option = document.createElement('option');
						var option2 = document.createElement('option');
						option.value = json[i][data];
						option.innerHTML = json[i][data];
						select.append(option);
						option2.value = json[i][data];
						option2.innerHTML = json[i][data];
						update.append(option2);
					}
				}
			}
	},
	error: function(ts){console.log("Error in the Get");},
	});
}

$('#newCGRelationship').submit('click',function(event) {
	var character = $('#smash_characters_dropdown option:selected').text();
	var game = $('#smash_games_dropdown option:selected').text();
	
	if(character!="No Character" && game!="No Game"){
		$.ajax({
			url : '/insert_cg',
			method: "get",
			dataType: "json",
			data: $("#newCGRelationship").serialize(),
			success: function(){
				console.log("Loading Data after insert");
				loadData();
			},
			error: function(ts){console.log(ts.responseText);},
		});
	}
	event.preventDefault();
});

$(document).on('click','.updateCG',function(){
	$('#updateCGRelationship').toggle();
	$('#newCGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteCG').toggle();

	$('#idUpdateCGChar').val($(this).closest('tr').find('td:eq(0)').text());
	$('#idUpdateCGGame').val($(this).closest('tr').find('td:eq(1)').text());
	$('#smash_characters_dropdown_update').val($(this).closest('tr').find('td:eq(2)').text());
	$('#smash_games_dropdown_update').val($(this).closest('tr').find('td:eq(3)').text());
	
});

$(document).on('click','#cancelUpdateCG',function(){
	$('#updateCGRelationship').toggle();
	$('#newCGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteCG').toggle();
});

$('#updateCGRelationship').submit('click', function(event){
	var Character_id = $('#idUpdateCGChar').val();
	var Game_id = $('#idUpdateCGGame').val();

	console.log(Character_id);
	console.log(Game_id);

	console.log($("#updateCGRelationship").serialize());

	$.ajax({
		url: '/update_cg?Character_id='+Character_id+'&Game_id'+Game_id+'&',
		method: "get",
		dataType: "json",
		data: $("#updateCGRelationship").serialize(),
		success: function(){
			loadData();
			console.log("Updating Data");
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#updateCGRelationship').toggle();
	$('#newCGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteCG').toggle();

	event.preventDefault();
});

$(document).on('click','.deleteCG',function(){
	var Character_id = $(this).closest('tr').find('td:eq(2)').text();
	var Game_id = $(this).closest('tr').find('td:eq(3)').text();
	
	$.ajax({
		url : "/delete_cg?Character_id="+Character_id+"&Game_id="+Game_id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	event.preventDefault();
});