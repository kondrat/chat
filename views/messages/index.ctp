<div class="span-16" style="margin-bottom: 1em;">
	<h2><?php __('Messages');?></h2>
	<div class="span-16 messageField" style="height:100px; background-color: #eee;border:1px solid #ccc;">
	
	</div>
	<div class="span-16 messageInput">
		<?php echo $form->create();?>
		<div class="span-14"><?php echo $form->input('body', array('class'=>'span-14','style'=> 'height:20px', 'label'=>false) );?></div>
		<div class="span-2 last" style="margin-top: 1em;"><?php echo $form->submit(__('submit',true),array('div'=>false));?></div>
		<?php echo $form->end();?>
	</div>
</div>
