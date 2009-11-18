<?php
class Message extends AppModel {

	var $name = 'Message';
	var $validate = array(
		'uid' => array('alphanumeric'),
		'cid' => array('alphanumeric')
	);

}
?>