<?php
class AppController extends Controller {
	var $components = array( 'Auth','AutoLogin', 'RequestHandler', 'Email','DebugKit.Toolbar');
	var $helpers = array('Javascript','Html', 'Form', 'Cache','gravatar');
	var $publicControllers = array('pages', 'test');
//--------------------------------------------------------------------
	function beforeFilter() {
	
		$defaultLang = Configure::read('Languages.default');
		//debug(env('HTTP_ACCEPT_LANGUAGE'));
		
		if ( !isset($this->params['lang']) && !$this->Session->check('langSes') ) {
			
			$this->params['lang'] = $defaultLang;
			$this->Session->write('langSes',$defaultLang);

		} elseif ( !isset($this->params['lang']) && $this->Session->check('langSes') ) {
			$this->params['lang'] = $this->Session->read('langSes');
			//$this->Session->write('testSes', 'case2');
		} 

		//debug(Configure::read('Config.language'));
		//debug(Configure::version());
		Configure::write('Config.language', $this->params['lang']);
		$this->Session->write('langSes',$this->params['lang']);
		
		
		if ( ($this->name != 'App') && !in_array($this->params['lang'], Configure::read('Languages.all')) ) {
			unset($this->params['lang']);
			$this->Session->del('langSes');
			$this->Session->setFlash(__('Whoops, not a valid language.', true));
			$this->redirect('/', 301, true);
		}
		
        if( isset($this->Auth) ) {
								
            if($this->viewPath == 'pages' && $this->params['action'] != 'admin_index') {
                $this->Auth->allow('*');
            } else {
                $this->Auth->authorize = 'controller';
	            if ( in_array( low($this->params['controller']), $this->publicControllers) ) {
                	//$this->Auth->allow('*');
                	$this->Auth->deny('pages/admin_index');
                }
            }
            $this->Auth->loginAction = array('admin' => false, 'controller' => 'users', 'action' => 'login');

        } 
				
	}
	
		function isAuthorized() {

            if ('1' == '1') {
                return true;
            } else {
                return false;
            }
        return true;
    }
	
//--------------------------------------------------------------------

	function beforeRender() {
		if( isset($this->params['prefix']) && $this->params['prefix'] == 'admin' ) {	
			$this->layout = 'admin';
		}		
		
	}

}
?>
