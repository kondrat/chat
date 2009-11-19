<div class="inner_page">
	<fieldset class="fildsetReg">
		<legend><?php __('Password reset');?></legend>
	<?php echo $form->create('User', array('action' => 'reset','class' => 'styled account_form') ); ?>         			
          			<?php echo $form->input('email', array('id'=>'UserEmailReset','size' => 60,'label'=>__('Enter your E-mail',true).":",'div'=>array('class'=>'formWrap clearfix'),'error'=>array('class'=>'error-message') ) ); ?>
		</fieldset>	
							<div class="submit clearfix">	
								<span><?php echo $form->button( __('Send me new password',true), array('type'=>'submit', 'id'=>'logSubmit','class'=>'span-5') ); ?></span>
          		</div>
	<?php echo $form->end(); ?>
		<div class="reg" style="position:absolute; left:420px;top:15px;left:420px;">
			<?php echo $html->link( __('Get Started - Join!',true), array( 'action' => 'reg' ), array('class' => '' ) ); ?>
		</div>
</div>





