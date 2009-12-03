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
								$f = fsockopen("chat","8088");

								fwrite($f,								
													"HTTP/1.1 200 OK\n" .
													//"Content-Type	text/plain\n" .																									
													"identifier=w\n" 
								);

								//stream_socket_shutdown($f, STREAM_SHUT_WR);
								$ids = stream_get_contents($f);
								echo $ids;
								fclose($f);
	
								if (substr($ids, -1) == ".") {
									// Checked that ALL data is received ("." at the end).
									print_r(explode(",", trim(substr($ids, 0, -1))));
								}



			
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
