$("document").ready(function(){
	var tablehead = document.createElement('thead');
	var headers = ["Id", "Name", "Year Added to Smash", "Original Series"];
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
	loadData('/fill_maps');
	fillSeries();
});

function loadData(x){
	$.ajax({
		url: x,
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
					$(deleteBtn).addClass("deleteMap");
					$(deleteBtn).text('Delete');
					newCell.append(deleteBtn);
					newRow.append(newCell);
					
					var edit = document.createElement('button');
					var newCell = document.createElement('td');
					$(newCell).addClass('updateCell');
					$(edit).addClass('updateMap');
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

function fillSeries(){
	$.ajax({
		url: '/fill_dropdown_by_series',
		method: "get",
		dataType: 'json',
		success: function(data,textStatus,jqXHR){
			var json = JSON.parse(data.results);
			if(json.length){
				var add = $('#Series_dropdown');
				var select = $('#Maps_by_series');
				var update = $('#updateSeriesDropdown')
				for (var i = 0; i < json.length; i++){
					for(data in json[i]){
						var option = document.createElement('option');
						var option2 = document.createElement('option');
						var option3 = document.createElement('option');
						option.value = json[i][data];
						option.innerHTML = json[i][data];
						option2.value = json[i][data];
						option2.innerHTML = json[i][data];
						option3.value = json[i][data];
						option3.innerHTML = json[i][data];
						add.append(option);
						select.append(option2);
						update.append(option3);
					}
				}
			}
		},
		error: function(ts){console.log("Error in the Get");},
	});
}

$('#newMap').submit('click',function(event) {
	if($('#map_series_dropdown').val() == "no_series"){
		window.location.href = 'Original_series';
	}
	else{
		$.ajax({
			url : "/insert_map",
			method: "get",
			dataType: "json",
			data: $("#newMap").serialize(),
			success: function(){
				console.log("Loading Data after insert");
				loadData('/fill_maps');
			},
			error: function(ts){console.log(ts.responseText);},
		});	
	}
	event.preventDefault();
});

$(document).on('click','.updateMap',function(){
	console.log("Changing Windows");
	$('#updateMap').toggle();
	$('#newMap').toggle();
	$('.updateCell').toggle();
	$('.deleteMap').toggle();

	console.log($(this).closest('tr').find('td:eq(4)').text());

	$('#idUpdateMap').val($(this).closest('tr').find('td:eq(0)').text());
	$('#mapNameUpdate').val($(this).closest('tr').find('td:eq(1)').text());
	$('#mapSmashUpdate').val($(this).closest('tr').find('td:eq(2)').text());
	$('#updateSeriesDropdown').val($(this).closest('tr').find('td:eq(3)').text());
	
});

$(document).on('click','#cancelUpdateMap',function(){
	console.log("Changing Windows");
	$('#updateMap').toggle();
	$('#newMap').toggle();
	$('.updateCell').toggle();
	$('.deleteMap').toggle();
});

$('#updateMap').submit('click', function(event){
	if($('#updateSeriesDropdown').val() == "no_series"){
		window.location.href = 'Original_series';
	}
	else{
		var id = $('#idUpdateMap').val();
		console.log(id);
		$.ajax({
			url: '/update_map?id='+id,
			method: "get",
			dataType: "json",
			data: $("#updateMap").serialize(),
			success: function(){
				loadData('/fill_maps')
				console.log("Updating Data");
			},
			error: function(ts){console.log(ts);},
		});

		$('#updateMap').toggle();
		$('#newMap').toggle();
		$('.updateCell').toggle();
		$('.deleteMap').toggle();
	}
	event.preventDefault();
});

$(document).on('click','#submitMSButton',function(){
	var series = $('#Maps_by_series option:selected').text();
	
	if(series=="All Series"){
		var url_string = "/fill_maps"
	}
	else{
		var url_string = "/filter_maps?Series_Name="+series;
	}
	
	loadData(url_string);
	
});

$(document).on('click','.deleteMap',function(){
	$('#deleteMap').show();
	var id = $(this).closest('tr').find('td:eq(0)').text();
	var name = $(this).closest('tr').find('td:eq(1)').text();

	$('#deleteMapId').text(id);
	$('#deleteMapName').text(name);
});

$(document).on('click','#cancelDeleteMap',function(){
	$('#deleteMap').hide();
});

$(document).on('click','#submitDeleteMap',function(){
	var id = $('#deleteMapId').text();
	console.log(id);

	$.ajax({
		url : "/delete_map_relation?map_id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData('/fill_maps');
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$.ajax({
		url : "/delete_map?id="+id,
		success: function(){
			console.log("Loading Data after delete");
			loadData('/fill_maps');
		},
		error: function(ts){console.log(ts.responseText);},
	});

	$('#deleteMap').hide();
});
