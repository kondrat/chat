<?php 

	App::import('Vendor', 'dklab/realplexor');

	$mpl = new Dklab_Realplexor("127.0.0.1", "10010", "demo_");


	$ids = strlen(@$_GET["ids"])? explode(",", $_GET["ids"]) : array("alpha", "beta","ttt");
	
	$mt = null;
	
	foreach ($ids as $id) {
		$mt .= 'addListen('.json_encode($id).');';
	}

	$script = 
	'var realplexor = new Dklab_Realplexor(
		"http://rpl.'. $_SERVER['HTTP_HOST'].'/?'.  0*time().'",  // URL of engine
		"demo_" // namespace
	);
		$(document).ready(function() {
			// Template from which we create board blocks.
			var board = $("#board");
			
			//board.text("hi");
			
			// Create new channel block.	
			function addListen(id) {
				var n = board.clone(true);
				board.before(n);
				$(".title", n).text(id);
				n.show();
				var num = 0;
				n[0].identifier = id;
				n[0].callback = function(result, id, cursor) {
					var b = $(".board_body", n);
					var line = document.createElement("div");
					line.innerHTML = (++num) + ": " + 
						result.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
					b.prepend(line);
				}
				realplexor.subscribe(id, n[0].callback);
				realplexor.execute();
			}
	
			// Refresh "online" block.
			function setOnline(data) {
				$("#online .online_body").html(data.join("<br/>"));
			}
	
			// Handle "close button".
			$(".close").live("click", function() {

				var n = $(this).parents(".board");
				realplexor.unsubscribe(n[0].identifier, n[0].callback);
				realplexor.execute();
				n.remove();
			});
	
			// Handle "new channel" button.
			$(".listen .button").click(function() {
				addListen($(this).parents().find("input").val());
			});

			// Subscribe to online changes.
			realplexor.setCursor("who_is_online", 0);
			realplexor.subscribe("who_is_online", function(data) {
				setOnline(data);
			});
			setOnline('.
				json_encode($mpl->cmdOnline()).
			');
	
	
			// Create initial boards set
				'
				.$mt.
				'
	});'

?>
<?php echo $javascript->codeBlock($script, $options = array('allowCache'=>true,'safe'=>true,'inline'=>false));?>

<?php echo $javascript->link('formsend', false) ;?>


<div class="span-16" style="margin-bottom: 1em;">
	<h2><?php __('Messages');?></h2>
	<div class="span-16" style="margin-bottom:1em;"><button id="startChat">Start chat</button></div>
	<div class="span-16 messageField" style="min-height:100px; background-color: #eee;border:1px solid #ccc;">
		<div id="board" style="border:1px solid; padding: 1em;min-height:3em;background-color:#fff;margin:1em;display:none;" class="span-4 board">
			<div class="boardHead" style="border-bottom:4px solid bisque;">
				<span style="color:green;">Channel:</span>
				<span class="title"></span>
				<span style="display:block;height:15px;width:15px;float:right;background-color:red;cursor:pointer;" class="close"><?php echo $html->image('icons/close.png');?></span>
			</div>
			
			<div class="board_body"> </div>
			
		</div>
		
	
	</div>
	<div class="span-16 messageInput">
		<?php echo $form->create();?>
		<div class="span-14"><?php echo $form->input('identifier', array('class'=>'span-14 identifier','style'=> 'height:20px', 'label'=>false, 'value'=>'alpha') );?></div>
		<div class="span-14"><?php echo $form->input('body', array('class'=>'span-14','style'=> 'height:20px', 'label'=>false) );?></div>
		<div class="span-2 last" style="margin-top: .5em;"><?php echo $form->submit(__('submit',true),array('div'=>false,'id'=>'send_messge','class'=>'send'));?></div>
		<?php echo $form->end();?>
	</div>
</div>
