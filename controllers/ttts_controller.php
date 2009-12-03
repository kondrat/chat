<?php
class TttsController extends AppController {

	var $name = 'Ttts';
	var $helpers = array();
	var $uses = array();
//--------------------------------------------------------------------	
	function beforeFilter() {
		$this->Auth->allow('index','ttt');
		parent::beforeFilter(); 
		$this->Auth->autoRedirect = false;

		// swiching off Security component for ajax call
		if( isset($this->Security) && $this->RequestHandler->isAjax() ) {
			$this->Security->enabled = false; 
		}	
	}
//--------------------------------------------------------------------

	function ttt() {
			Configure::write('debug', 0);
			$this->autoRender = false;
		if ($this->RequestHandler->isAjax()) {
		

			$json = array('jon'=>'jon');
			
			
			echo json_encode($json);
		
			exit;
			
		} else {
			echo json_encode(array('json'=>'blin'));
			exit;
		}
	}

//--------------------------------------------------------------------

}
?>
