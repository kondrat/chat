<div class="span-16" style="margin-bottom: 1em;">
	<h2><?php __('Messages');?></h2>
	<div class="span-16" style="margin-bottom:1em;"><button id="startChat">Start chat</button></div>
	<div class="span-16 messageField" style="height:100px; background-color: #eee;border:1px solid #ccc;">
		<div id="messages">
		</div>
	
	</div>
	<div class="span-16 messageInput">
		<?php echo $form->create();?>
		<div class="span-14"><?php echo $form->input('body', array('class'=>'span-14','style'=> 'height:20px', 'label'=>false) );?></div>
		<div class="span-2 last" style="margin-top: .8em;"><?php echo $form->submit(__('submit',true),array('div'=>false,'id'=>'send_messge'));?></div>
		<?php echo $form->end();?>
	</div>
</div>
