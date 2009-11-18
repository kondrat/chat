<?php 
/* SVN FILE: $Id$ */
/* User Fixture generated on: 2009-11-18 15:11:51 : 1258546131*/

class UserFixture extends CakeTestFixture {
	var $name = 'User';
	var $table = 'users';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'length' => 10, 'key' => 'primary'),
		'username' => array('type'=>'string', 'null' => true, 'key' => 'unique'),
		'password' => array('type'=>'string', 'null' => false),
		'key' => array('type'=>'string', 'null' => true, 'default' => NULL, 'key' => 'unique'),
		'email' => array('type'=>'string', 'null' => false, 'length' => 100),
		'active' => array('type'=>'boolean', 'null' => false, 'default' => '0'),
		'created' => array('type'=>'datetime', 'null' => true, 'default' => NULL),
		'modified' => array('type'=>'datetime', 'null' => true, 'default' => NULL),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'username' => array('column' => 'username', 'unique' => 1), 'key' => array('column' => 'key', 'unique' => 1))
	);
	var $records = array(array(
		'id'  => 1,
		'username'  => 'Lorem ipsum dolor sit amet',
		'password'  => 'Lorem ipsum dolor sit amet',
		'key'  => 'Lorem ipsum dolor sit amet',
		'email'  => 'Lorem ipsum dolor sit amet',
		'active'  => 1,
		'created'  => '2009-11-18 15:08:51',
		'modified'  => '2009-11-18 15:08:51'
	));
}
?>