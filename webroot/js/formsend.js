jQuery(document).ready( function(){

	$(".send").live("click", function() {

		var ids = $.map($('.identifier', this.form), function(e) { return e.value? e.value : null });
		//alert(ids);
		var message = this.form.message.value;
		var repeat = this.form.repeat.value;
		var loader = $('img', this.form);
	
		loader.show();
		$.ajax({
			type: "POST",
			url: "ajax_post.php", 
			data: { ids: ids.join(","), message: message, repeat: repeat }, 
			complete: function(xhr, status) { 
				loader.hide();
				if (xhr.responseText) alert("Error: " + xhr.responseText); 
			}
		});
		
		return false;
	});
	
});
