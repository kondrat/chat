<?php

class QueueChatTask extends Shell {
	/**
	 * Adding the QueueTask Model.
	 * There is no magic here..
	 *
	 * @var array
	 */
	public $uses = array('Queue.QueuedTask');

	/**
	 * Example add functionality.
	 * Will create one example job in the queue, which later will be executed using run();
	 */
	public function add() {
		$this->out('Adding one "Chat" to the Queue.');
		/**
		 * Adding a task of type 'helloworld' with no additionally passed data
		 */
		if ($this->QueuedTask->createJob('Chat', null)) {
			$this->out('OK, Chat job created, now run the worker');
		} else {
			$this->err('Could not create Chat Job');
		}
	}

	/**
	 * Chat run function.
	 * This function is used by a worker when it tries to execute a job of the type 'helloworld'.
	 * The return parameter will determine, if the task will be marked completed, or be requeued.
	 *
	 * @param array $data the array passed to QueuedTask->createJob()
	 * @return bool Success
	 */
	public function run($data) {
		/**
		 * This will simply Output text on the workers Console, which is a bit silly.
		 * Usually you would use regular CakePHP shell functionality to do something useful.
		 */
		$this->hr();
		$this->out('Hello TTT, Great TTT');
		$this->hr();
		return true;
	}

}
?>
