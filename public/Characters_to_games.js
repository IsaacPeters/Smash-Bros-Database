$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Character", "Smash Game"];
	var header = document.createElement('tr');
	
	for (i in headers){
		var headerCell = document.createElement('th');
		headerCell.append(headers[i]);
		if(i == 3){
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

function fillDropdowns(){
	$.ajax({
	url: '/fill_dropdown_by_smash',
	method: "get",
	dataType: 'json',
	success: function(data,textStatus,jqXHR){
		var json = JSON.parse(data.results);
		if(json.length){
				var select = $('#smash_games_dropdown');
				for (var i = 0; i < json.length; i++){
					for(data in json[i]){
						var option = document.createElement('option');
						option.value = json[i][data];
						option.innerHTML = json[i][data];
						select.append(option);
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
				for (var i = 0; i < json.length; i++){
					for(data in json[i]){
						var option = document.createElement('option');
						option.value = json[i][data];
						option.innerHTML = json[i][data];
						select.append(option);
					}
				}
			}
	},
	error: function(ts){console.log("Error in the Get");},
	});
}

$('#newCGRelationship').submit('click',function(event) {
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
	event.preventDefault();
});

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
