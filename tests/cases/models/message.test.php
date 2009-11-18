<?php 
/* SVN FILE: $Id$ */
/* Message Test cases generated on: 2009-11-18 14:11:54 : 1258545414*/
App::import('Model', 'Message');

class MessageTestCase extends CakeTestCase {
	var $Message = null;
	var $fixtures = array('app.message');

	function startTest() {
		$this->Message =& ClassRegistry::init('Message');
	}

	function testMessageInstance() {
		$this->assertTrue(is_a($this->Message, 'Message'));
	}

	function testMessageFind() {
		$this->Message->recursive = -1;
		$results = $this->Message->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Message' => array(
			'id'  => 1,
			'uid'  => 'Lorem ipsum dolor sit amet',
			'cid'  => 'Lorem ipsum dolor sit amet',
			'body'  => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida,phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam,vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit,feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.',
			'created'  => '2009-11-18 14:56:54',
			'modified'  => '2009-11-18 14:56:54'
		));
		$this->assertEqual($results, $expected);
	}
}
?>