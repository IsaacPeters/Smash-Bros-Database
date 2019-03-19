$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Map Id", "Game Id","Smash Map", "Smash Game"];
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
	
	fillDropdowns();
	loadData();
});

function loadData(){
	$.ajax({
		url: '/fill_mg',
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
						if(data == "Map_id" || data == "Game_id"){
							$(newCell).addClass('hiddenCol');
						}
						newRow.append(newCell);
					}
					var deleteBtn = document.createElement('button');
					var newCell = document.createElement('td');
					$(deleteBtn).addClass("deleteMG");
					$(deleteBtn).text('Delete');
					newCell.append(deleteBtn);
					newRow.append(newCell);
					
					var edit = document.createElement('button');
					var newCell = document.createElement('td');
					$(newCell).addClass('updateCell');
					$(edit).addClass('updateMG');
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
	url: '/fill_dropdown_by_map',
	method: "get",
	dataType: 'json',
	success: function(data,textStatus,jqXHR){
		var json = JSON.parse(data.results);
		if(json.length){
				var select = $('#smash_maps_dropdown');
				var update = $('#smash_maps_dropdown_update');
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

$('#newMGRelationship').submit('click',function(event) {
	var map = $('#smash_maps_dropdown option:selected').text();
	var game = $('#smash_games_dropdown option:selected').text();
	
	if(map!="No Map" && game!="No Game"){
		$.ajax({
			url : '/insert_mg',
			method: "get",
			dataType: "json",
			data: $("#newMGRelationship").serialize(),
			success: function(){
				console.log("Loading Data after insert");
				loadData();
			},
			error: function(ts){console.log(ts.responseText);},
		});
	}
	event.preventDefault();
});

$(document).on('click','.updateMG',function(){
	$('#updateMGRelationship').toggle();
	$('#newMGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteMG').toggle();

	$('#idUpdateMGMap').val($(this).closest('tr').find('td:eq(0)').text());
	$('#idUpdateMGGame').val($(this).closest('tr').find('td:eq(1)').text());
	$('#smash_maps_dropdown_update').val($(this).closest('tr').find('td:eq(2)').text());
	$('#smash_games_dropdown_update').val($(this).closest('tr').find('td:eq(3)').text());
	
});

$(document).on('click','#cancelUpdateMG',function(){
	$('#updateMGRelationship').toggle();
	$('#newMGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteMG').toggle();
});

$('#updateMGRelationship').submit('click', function(event){
	var Map_id = $('#idUpdateMGMap').val();
	var Game_id = $('#idUpdateMGGame').val();

	$.ajax({
		url: '/update_mg?Map_id='+Map_id+'&Game_id='+Game_id+'&',
		method: "get",
		dataType: "json",
		data: $("#updateMGRelationship").serialize(),
		success: function(){
			loadData();
			console.log("Updating Data");
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#updateMGRelationship').toggle();
	$('#newMGRelationship').toggle();
	$('.updateCell').toggle();
	$('.deleteMG').toggle();

	event.preventDefault();
});
$(document).on('click','.deleteMG',function(){
	var Map_id = $(this).closest('tr').find('td:eq(2)').text();
	var Game_id = $(this).closest('tr').find('td:eq(3)').text();

	$.ajax({
		url : "/delete_mg?Map_id="+Map_id+"&Game_id="+Game_id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});
});