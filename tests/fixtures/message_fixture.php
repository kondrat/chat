<?php 
/* SVN FILE: $Id$ */
/* Message Fixture generated on: 2009-11-18 14:11:54 : 1258545414*/

class MessageFixture extends CakeTestFixture {
	var $name = 'Message';
	var $table = 'messages';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'length' => 10, 'key' => 'primary'),
		'uid' => array('type'=>'string', 'null' => true, 'default' => NULL),
		'cid' => array('type'=>'string', 'null' => true, 'default' => NULL),
		'body' => array('type'=>'text', 'null' => true, 'default' => NULL),
		'created' => array('type'=>'datetime', 'null' => true, 'default' => NULL),
		'modified' => array('type'=>'datetime', 'null' => true, 'default' => NULL),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'id' => array('column' => 'id', 'unique' => 1), 'id_2' => array('column' => 'id', 'unique' => 0))
	);
	var $records = array(array(
		'id'  => 1,
		'uid'  => 'Lorem ipsum dolor sit amet',
		'cid'  => 'Lorem ipsum dolor sit amet',
		'body'  => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida,phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam,vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit,feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.',
		'created'  => '2009-11-18 14:56:54',
		'modified'  => '2009-11-18 14:56:54'
	));
}
?>