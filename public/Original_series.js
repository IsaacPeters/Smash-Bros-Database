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
						$(edit).addClass('updateSeries');
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

$(document).on('click','.updateSeries',function(){
	console.log("Changing Windows");
	$('#updateSeries').toggle();
	$('#newSeries').toggle();
	$('.updateCell').toggle();
	$('.deleteSeries').toggle();

	console.log($(this).closest('tr').find('td:eq(5)').text());

	$('#idUpdateSeries').val($(this).closest('tr').find('td:eq(0)').text());
	$('#seriesNameUpdate').val($(this).closest('tr').find('td:eq(1)').text());
	$('#seriesGameUpdate').val($(this).closest('tr').find('td:eq(2)').text());
	$('#seriesYearUpdate').val($(this).closest('tr').find('td:eq(3)').text());
	$('#seriesNumGamesUpdate').val($(this).closest('tr').find('td:eq(4)').text());
	
});

$(document).on('click','#cancelUpdateSeries',function(){
	console.log("Changing Windows");
	$('#updateSeries').toggle();
	$('#newSeries').toggle();
	$('.updateCell').toggle();
	$('.deleteSeries').toggle();
});

$('#updateSeries').submit('click', function(event){
	var id = $('#idUpdateSeries').val();
	console.log(id);
	$.ajax({
		url: '/update_series?id='+id,
		method: "get",
		dataType: "json",
		data: $("#updateSeries").serialize(),
		success: function(){
			console.log("Updating Data");
			loadData();
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#updateSeries').toggle();
	$('#newSeries').toggle();
	$('.updateCell').toggle();
	$('.deleteSeries').toggle();
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