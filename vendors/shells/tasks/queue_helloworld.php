<?php

class QueueHelloworldTask extends Shell {
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
		$this->out('Adding one "Hello World" to the Queue.');
		/**
		 * Adding a task of type 'helloworld' with no additionally passed data
		 */
		if ($this->QueuedTask->createJob('helloworld', null)) {
			$this->out('OK, job created, now run the worker');
		} else {
			$this->err('Could not create Job');
		}
	}

	/**
	 * Hello World run function.
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
		$this->out('Hello World, just this');
		$this->hr();
		return true;
	}

}
?>