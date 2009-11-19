<?php
class MessagesController extends AppController {

	var $name = 'Messages';
	var $helpers = array();
//--------------------------------------------------------------------	
	function beforeFilter() {
		$this->Auth->allow('index','add','send','event');
		parent::beforeFilter(); 
		$this->Auth->autoRedirect = false;

		// swiching off Security component for ajax call
		if( isset($this->Security) && $this->RequestHandler->isAjax() ) {
			$this->Security->enabled = false; 
		}	
	}
//--------------------------------------------------------------------

	function send() {
		Configure::write('debug', 0);
		$this->autoRender = false;
		echo json_encode(array('result' =>'ok' ) );
		exit;
	}

//--------------------------------------------------------------------

	function event() {
		Configure::write('debug', 0);
		$this->autoRender = false;
		echo json_encode(array('result' =>'ok' ) );
		exit;

	}

//--------------------------------------------------------------------









	function index() {
		$this->Message->recursive = 0;
		$this->set('messages', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid Message.', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->set('message', $this->Message->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->Message->create();
			if ($this->Message->save($this->data)) {
				$this->Session->setFlash(__('The Message has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The Message could not be saved. Please, try again.', true));
			}
		}
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid Message', true));
			$this->redirect(array('action'=>'index'));
		}
		if (!empty($this->data)) {
			if ($this->Message->save($this->data)) {
				$this->Session->setFlash(__('The Message has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The Message could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Message->read(null, $id);
		}
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for Message', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->Message->del($id)) {
			$this->Session->setFlash(__('Message deleted', true));
			$this->redirect(array('action'=>'index'));
		}
	}


	function admin_index() {
		$this->Message->recursive = 0;
		$this->set('messages', $this->paginate());
	}

	function admin_view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid Message.', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->set('message', $this->Message->read(null, $id));
	}

	function admin_add() {
		if (!empty($this->data)) {
			$this->Message->create();
			if ($this->Message->save($this->data)) {
				$this->Session->setFlash(__('The Message has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The Message could not be saved. Please, try again.', true));
			}
		}
	}

	function admin_edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid Message', true));
			$this->redirect(array('action'=>'index'));
		}
		if (!empty($this->data)) {
			if ($this->Message->save($this->data)) {
				$this->Session->setFlash(__('The Message has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The Message could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Message->read(null, $id);
		}
	}

	function admin_delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for Message', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->Message->del($id)) {
			$this->Session->setFlash(__('Message deleted', true));
			$this->redirect(array('action'=>'index'));
		}
	}

}
?>
