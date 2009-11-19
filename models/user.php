<?php
class User extends AppModel {

	var $name = 'User';
	var $actsAs = array('Containable');
//--------------------------------------------------------------------
	var $validate = array(
							'username' => array(
												
												'notEmpty' => array(
																						'rule' => 'notEmpty',
																						//'message' => 'This field cannot be left blank',
																						),
																								
												'alphaNumeric' => array( 
																							'rule' => 'alphaNumeric',
																							'required' => true,
																							//'message' => 'Usernames must only contain letters and numbers.'
																							),
												
												'betweenRus' => array(
																							'rule' => array( 'betweenRus', 2, 15, 'username'),
																						//	'message' => 'Username must be between 2 and 15 characters long.',
																							'last' => true
																							),
												'checkUnique' => array( 
																							'rule' =>  array('checkUnique', 'username'),
																						//	'message' => 'This username has already been taken',
																							
																							),
															),
																						
							'password1' => array( 'betweenRus' => array(
																													'rule' => array( 'betweenRus', 4, 10,'password1'),
																													//'message' => 'Username must be between 4 and 10 characters long'
																													)
																	),
							'password2' => array( 'passidentity' => array(
																													'rule' => array( 'passidentity', '$this->data' ),
																													//'message' => 'Please verify your password again'
																													)
																	),
							
																																							
							'email' => array( 'email' => array( 
																								'rule' => array( 'email', false), //check the validity of the host. to set true.
																								//'message' => 'Your email address does not appear to be valid',
																								),
																								/*
																								'checkUnique' => array(           
																														'rule' =>  array('checkUnique', 'email'),
																														'message' => 'This Email has already been taken'
																														),
																								*/
															),
							'captcha' => array( 'notEmpty' => array(
																										'rule' => 'notEmpty',
																										//'message' => 'This field cannot be left blank',
																										'last'=>true,
																	),
																	'alphaNumeric' => array(
																										'rule' => 'alphaNumeric',
																										//'message' => 'Only contain letters and numbers'
																	),
																	'equalCaptcha' => array(
        																						'rule' => array('equalCaptcha','$this->data'),  
        																						//'message' => 'Please, correct the code'
    															),

											),

																										 
						  );

//--------------------------------------------------------------------														
	function equalCaptcha($data) {
 		if ( $this->data['User']['captcha'] != $this->data['User']['captcha2'] ) {		
        	return false;
    	}
    	return true;
   	}
//--------------------------------------------------------------------	
	function beforeSave() {
        if ( !empty($this->data['User']['password1']) ) {
        	$this->data['User']['password'] = sha1( Configure::read('Security.salt').$this->data['User']['password1'] ); 
        }  
        return true;    
    }
//--------------------------------------------------------------------	




}
?>