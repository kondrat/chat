<?php
class EventsController extends AppController {

	var $name = 'Events';
	var $helpers = array();
	var $uses = array();
//--------------------------------------------------------------------	
	function beforeFilter() {
		$this->Auth->allow('index');
		parent::beforeFilter(); 
		$this->Auth->autoRedirect = false;

		// swiching off Security component for ajax call
		if( isset($this->Security) && $this->RequestHandler->isAjax() ) {
			$this->Security->enabled = false; 
		}	
	}
//--------------------------------------------------------------------

	function index() {
			Configure::write('debug', 0);
			$this->autoRender = false;
		if ($this->RequestHandler->isAjax()) {
		
			$json = array();

			if(isset($this->params['pass']['0']) && $this->params['pass']['0'] != null){
				$json = array('data'=>$this->params['pass']['0'] );
			}
								//socket block
								

								


			
			echo json_encode($json);
		
			exit;
			
		} else {
			echo json_encode(array('don\'t'=>'work'));
			exit;
		}
	}

//--------------------------------------------------------------------

}
?>
