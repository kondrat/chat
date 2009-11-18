<?php 
/* SVN FILE: $Id$ */
/* User Test cases generated on: 2009-11-18 15:11:51 : 1258546131*/
App::import('Model', 'User');

class UserTestCase extends CakeTestCase {
	var $User = null;
	var $fixtures = array('app.user');

	function startTest() {
		$this->User =& ClassRegistry::init('User');
	}

	function testUserInstance() {
		$this->assertTrue(is_a($this->User, 'User'));
	}

	function testUserFind() {
		$this->User->recursive = -1;
		$results = $this->User->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('User' => array(
			'id'  => 1,
			'username'  => 'Lorem ipsum dolor sit amet',
			'password'  => 'Lorem ipsum dolor sit amet',
			'key'  => 'Lorem ipsum dolor sit amet',
			'email'  => 'Lorem ipsum dolor sit amet',
			'active'  => 1,
			'created'  => '2009-11-18 15:08:51',
			'modified'  => '2009-11-18 15:08:51'
		));
		$this->assertEqual($results, $expected);
	}
}
?>