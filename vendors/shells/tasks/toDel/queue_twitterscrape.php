<?php

class queueTwitterscrapeTask extends Shell {
	/**
	 * @var array
	 */
	public $uses = array(
		'Tweet', 
		'Queue.QueuedTask'
	);
	
	/**
	 * @var QueuedTask
	 */
	public $QueuedTask;

	public function add() {
		$this->out('Twitterscraper');
		$this->out('Define a Searchterm to keep updated (every 30 minutes)');
		$this->out('use "*global*" to update global timeline every 60 seconds.');
		$term = $this->in('Tag/term to keep updated:');
		if (!empty($term)) {
			if ($this->QueuedTask->createJob('twitterscrape', array(
				'search' => $term
			))) {
				$this->out('Searchterm update Queued');
			} else {
				$this->err('Could not create Twitterscrape Job.');
			}
		}
	}

	public function run($data) {
		if (array_key_exists('search', $data) && !empty($data['search'])) {
			$search = $data['search'];
			$this->Twitter = ConnectionManager::getDataSource('twitter');
			switch ($search) {
				default:
					$this->getSearchResults($search);
					$nextUpdate = '+30 Minutes';
					break;
				case '*global*':
					$this->getGlobal($search);
					$nextUpdate = '+5 Minutes';
					break;
			}
			
			//check if there is already a task for this term.
			

			$findConf = array(
				'conditions' => array(
					'fetched' => null, 
					'data LIKE' => '%' . $search . '%'
				)
			);
			$alreadyPresent = $this->QueuedTask->find('count', $findConf);
			if ($alreadyPresent == false) {
				if ($this->QueuedTask->createJob('twitterscrape', array(
					'search' => $search
				), $nextUpdate)) {
					$this->out('Searchterm update Queued');
				} else {
					$this->err('Could not create Twitterscrape Job.');
				}
			} else {
				$this->err('There seems to be another job queued for this term, job not requeued.');
			}
			return true;
		} else {
			$this->out('No Search term found, Cancelling');
			// return true so the task does NOT get requeued.
			return true;
		}
	}

	private function getGlobal($search) {
		$search_results = $this->Twitter->status_public_timeline();
		$count = 0;
		foreach ($search_results['Statuses']['Status'] as $rawtweet) {
			$tweet['Tweet']['id'] = $rawtweet['id'];
			$tweet['Tweet']['twitter_username'] = $rawtweet['User']['screen_name'];
			$tweet['Tweet']['tweet_content'] = $rawtweet['text'];
			$tweet['Tweet']['created'] = date('Y-m-d H:i:s', strtotime($rawtweet['created_at']));
			$tweet['Tweet']['updated'] = date('Y-m-d H:i:s', strtotime($rawtweet['created_at']));
			$tweet = $this->Tweet->create($tweet);
			if (!$this->Tweet->exists()) {
				$this->Tweet->save($tweet);
				$count++;
			}
		}
		$this->out('Grabbed ' . $count . ' tweets from public Timeline');
	}

	private function getSearchResults($search) {
		$search_results = $this->Twitter->search(urlencode($search), 'all', 100);
		$count = 0;
		foreach ($search_results['Feed']['Entry'] as $rawtweet) {
			$idarr = explode(':', $rawtweet['id']);
			// format to our needs
			$i = explode(' ', $rawtweet['Author']['name']);
			$tweet['Tweet']['id'] = $idarr[2];
			$tweet['Tweet']['twitter_username'] = $i[0];
			$tweet['Tweet']['tweet_content'] = $rawtweet['title'];
			$tweet['Tweet']['created'] = date('Y-m-d H:i:s', strtotime($rawtweet['published']));
			$tweet['Tweet']['updated'] = date('Y-m-d H:i:s', strtotime($rawtweet['updated']));
			// and save
			

			$tweet = $this->Tweet->create($tweet);
			if (!$this->Tweet->exists()) {
				$this->Tweet->save($tweet);
				$count++;
			}
		}
		$this->out('Found ' . $count . ' New tweets for ' . $search);
	}
}
?>