<?php
class UsersController extends AppController {

	var $name = 'Users';
	var $helpers = array();
	var $components = array( 'Security','Cookie','userReg','kcaptcha');	
	
//--------------------------------------------------------------------	
  function beforeFilter() {
        $this->Auth->allow( 'logout','login', 'reg','kcaptcha', 'reset', 'acoset','aroset','permset','buildAcl');
          
        //to Del:
        $this->Auth->allowedActions = array('*');
        //$this->Auth->allowedControllers = array('*');
        parent::beforeFilter(); 
        $this->Auth->autoRedirect = false;
        
        // swiching off Security component for ajax call
			if( isset($this->Security) && $this->RequestHandler->isAjax() ) {
     			$this->Security->enabled = false; 
     		}
    }
//--------------------------------------------------------------------	

	function login() {
		$this->pageTitle = __('Login',true);

		if( !empty($this->data) ) {

			if( $this->Auth->login() ) {
					
    		$this->Session->delete('guestKey');
    		$this->Cookie->del('IniVars');
    		$this->Cookie->del('guestKey');


					if ($this->referer()=='/') {
						$this->redirect( $this->Auth->redirect() );
					} else {

						$this->redirect( $this->Auth->redirect() );
					}
			
			} else {

				$this->data['User']['password'] = null;
				$this->Session->setFlash(__('Check your login and password',true),'default', array('class' => 'er'));
			}
		} else {
			if( !is_null( $this->Session->read('Auth.User.username') ) ){

				$this->redirect( $this->Auth->redirect() );			
			}
		}
		
	}

//--------------------------------------------------------------------
    function logout() {
    	    	
    		$tempUserName = __('Good bay, ',true).$this->Session->read('Auth.User.username');
    		
    		$this->Session->delete('guestKey');
    		$this->Cookie->del('IniVars');
    		$this->Cookie->del('guestKey');
    		
    		
    		
        $this->Auth->logout();
        $this->Session->setFlash( $tempUserName, 'default', array('class' => '') );
        $this->redirect( '/',null,true);        
    }
//--------------------------------------------------------------------	
	function reg() {
		
		if($this->Auth->user('id')) {
			$this->redirect('/',null,true);
		}
		
		$this->pageTitle = __('SignUp',true);
		
		if ( !empty($this->data) ) {
						
			$this->data['User']['captcha2'] = $this->Session->read('captcha');

			if ( $this->User->save( $this->data) ) {		
							
				$a = $this->User->read();
				$this->Auth->login($a);
				$this->Session->setFlash(__('New user\'s accout has been created',true));
				$this->redirect(array('controller' => 'messages','action'=>'index'),null,true);
         	} else {
				$this->data['User']['captcha'] = null;
				$this->Session->setFlash(__('New user\'s accout hasn\'t been created',true) , 'default', array('class' => 'er') );
			}
		}
		
		

	}
//--------------------------------------------------------------------	
		
    function kcaptcha() {
        $this->kcaptcha->render(); 
    } 
    function kcaptchaReset() {
    	Configure::write('debug', 0);
    	$this->autoRender = false;
     	$this->kcaptcha->render(); 
     	exit();
    } 
//--------------------------------------------------------------------
	function thanks() {
	}
	function index() {
		$this->User->recursive = 0;
		$this->set('users', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid User.', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->set('user', $this->User->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->User->create();
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid User', true));
			$this->redirect(array('action'=>'index'));
		}
		if (!empty($this->data)) {
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->User->read(null, $id);
		}
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for User', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->User->del($id)) {
			$this->Session->setFlash(__('User deleted', true));
			$this->redirect(array('action'=>'index'));
		}
	}


	function admin_index() {
		$this->User->recursive = 0;
		$this->set('users', $this->paginate());
	}

	function admin_view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid User.', true));
			$this->redirect(array('action'=>'index'));
		}
		$this->set('user', $this->User->read(null, $id));
	}

	function admin_add() {
		if (!empty($this->data)) {
			$this->User->create();
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
	}

	function admin_edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid User', true));
			$this->redirect(array('action'=>'index'));
		}
		if (!empty($this->data)) {
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action'=>'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->User->read(null, $id);
		}
	}

	function admin_delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for User', true));
			$this->redirect(array('action'=>'index'));
		}
		if ($this->User->del($id)) {
			$this->Session->setFlash(__('User deleted', true));
			$this->redirect(array('action'=>'index'));
		}
	}

}
?>