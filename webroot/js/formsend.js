jQuery(document).ready( function(){

	$(".send").live("click", function() {
		
		var ids = $.map($('.identifier', this.form), function(e) { return e.value? e.value : null });

		//var message = this.form.data[message][body].value;
		
		var message = $('#MessageBody').val();

		//var repeat = this.form.repeat.value;
		//var loader = $('img', this.form);
	
		//loader.show();
		
		$.ajax({
			type: "POST",
			url: "./messages/ttt", 
			data: { ids: ids.join(","), message: message }, 
			complete: function(xhr, status) { 
				//loader.hide();
				if (xhr.responseText) alert("Error: " + xhr.responseText); 
			}
		});
		//alert('click200');
		return false; 
	});
	
});
