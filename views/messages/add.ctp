<div class="messages form">
<?php echo $form->create('Message');?>
	<fieldset>
 		<legend><?php __('Add Message');?></legend>
	<?php
		echo $form->input('uid');
		echo $form->input('cid');
		echo $form->input('body');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List Messages', true), array('action'=>'index'));?></li>
	</ul>
</div>
