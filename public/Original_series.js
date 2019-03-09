$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Id", "Name", "First Game", "Creation Year", "Number of Games"];
	var header = document.createElement('tr');
	
	for (i in headers){
		var headerCell = document.createElement('th');
		headerCell.append(headers[i]);
		if(i == 0){
			$(headerCell).addClass('hiddenCol');
		}
		else if(i == 6){
			$(headerCell).addClass('updateCell');
		}
		header.append(headerCell);
	}
	
	tablehead.append(header);
	$('#dataDisplay').append(tablehead);
	
	console.log("Loading Data");
	loadData();
});

function loadData(){
	$.ajax({
		url: '/fill_series',
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
						if(data == "Id"){
							$(newCell).addClass('hiddenCol');
						}
						newRow.append(newCell);
					}

					if(i != 0){
						var deleteBtn = document.createElement('button');
						var newCell = document.createElement('td');
						$(deleteBtn).addClass("deleteSeries");
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
					}
					
					tablebody.append(newRow);
				}
				$('#dataDisplay').append(tablebody);
			}
		},
		error: function(ts){console.log("Error in the Get");},
	});
}


$('#newSeries').submit('click',function(event) {
	console.log("here? Her?");
	$.ajax({
		url : '/insert_series',
		method: "get",
		dataType: "json",
		data: $("#newSeries").serialize(),
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

$(document).on('click','.deleteSeries',function(){
	$('#deleteSeries').show();
	var id = $(this).closest('tr').find('td:eq(0)').text();
	var name = $(this).closest('tr').find('td:eq(1)').text();

	$('#deleteSeriesId').text(id);
	console.log(id);
	$('#deleteSeriesName').text(name);
	console.log(name);
});

$(document).on('click','#cancelDeleteSeries',function(){
	$('#deleteSeries').hide();
});

$(document).on('click','#submitDeleteSeries',function(){
	var id = $('#deleteSeriesId').text();
	console.log(id);
	
	$.ajax({
		url : "/remove_series_relation?series_id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$.ajax({
		url : "/delete_series?id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#deleteSeries').hide();
});