<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $html->charset(); ?>
	<title>
		<?php __('pvr:'); ?>
		<?php echo $title_for_layout; ?>
	</title>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/mootools/1.2.3/mootools.js"></script>
	<?php

	
		echo $html->meta('icon');
		echo $html->css('chat');
		echo $html->css('chat-u');
		echo $html->css('screen');
		//echo $html->css('print');
		echo '<!--[if IE]>';
		echo $html->css('ie');
		echo $html->css('chat-ie');
		echo '<![endif]-->';

		echo $javascript->codeBlock('var path = "'.Configure::read('path').'";' );
		echo $javascript->link(array('mootools/dumbchat'));

		echo $scripts_for_layout;
	?>
</head>
<body>
	<div class="pageheader" style="">
			<div class="container">
				<div class="span-20">
					
					<div class="headerDetail span-10">
			        <div class="headerData">
			       		<?php echo date("l dS \of F"); ?>
			        </div>
			        <div class="headerWeek">
			            <?php __('Week'); 
			            echo ' '.date("W"); ?>
			        </div>	
					</div>
	
	
			    	<div class="userbox">
			    		<div class="inner">
							<ul class="usernav">
									<?php
											if ($session->check('Auth.User.username')) {
												echo $gravatar->image('a_kondrat@mail.ru',array('default' => 'identicon','size' => 20) );
												echo '<b>'.$session->read('Auth.User.username').'</b>';
											}
									?>
								<li>
				    		<?php 		
				    			if ( $session->check('Auth.User.id') ){
				    				echo $html->link(__('Logout',true),array('controller'=>'users','action'=>'logout','admin'=>false)).'&nbsp';
				    			} else {
				    				echo $html->link(__('Login',true),array('controller'=>'users','action'=>'login')).'&nbsp';
				    			}
								?>
								</li>
								<li><?php echo $html->link(__('Home',true),array('controller'=>'messages','action'=>'index')).'&nbsp';?></li>
			    			<li><?php echo $html->link("Eng",array('lang'=>'en')).'&nbsp';?></li>
			    			<li><?php echo $html->link("Рус",array('lang'=>'ru')).'&nbsp';?> </li>
			    		</ul>
			    		</div>
			    	</div>
			  </div>
			</div>
	</div>
	<div class="container showgrid.">
		    <div class="span-4">
		        Left sidebar
		        <hr />
		        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
		    </div>
		
		    <div class="span-16">
			        <div class="span-7">
			            <div class="rounded." style="background-color: #ccc; padding-left: 15px;overflow:hidden;">

									</div>
			      	</div>

		        <div class="span-16 clear last myrr">
							<div class="fl span-16 last" style="font-weight:bold; position:relative;">
									<?php $session->flash(); ?>
							</div>
							<?php echo $content_for_layout; ?>
		        </div>
		    </div>
		    <div class="span-4 last">
		        Right sidebar
		        <hr />
						
						<div id="chatStatus">Chat Status</div>
		    </div>


	


		
	</div>
	<div class="pagefooter" style="">
			<div class="container">
				<div class="span-24">
					
			    <div class="span-24">
			    	<div class="footerNote">
		      	 chat &copy;<?php echo date('Y');?>
		      	</div>
		   		</div>
		   		
			  </div>
			</div>
	</div>
	<?php echo $cakeDebug; ?>
</body>
</html>
