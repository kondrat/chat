<?php 
/* SVN FILE: $Id$ */
/* UsersController Test cases generated on: 2009-11-18 15:11:14 : 1258546154*/
App::import('Controller', 'Users');

class TestUsers extends UsersController {
	var $autoRender = false;
}

class UsersControllerTest extends CakeTestCase {
	var $Users = null;

	function startTest() {
		$this->Users = new TestUsers();
		$this->Users->constructClasses();
	}

	function testUsersControllerInstance() {
		$this->assertTrue(is_a($this->Users, 'UsersController'));
	}

	function endTest() {
		unset($this->Users);
	}
}
?>