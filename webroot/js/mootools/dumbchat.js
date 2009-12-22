//a silly and simple example clientside NGiNX_HTTP_Push_Module application using mootools.
//Made in late 2009 by Leo Ponomarev. Code released under the MIT license.

//example versatile subscriber
var Subscriber = function(url, successCallback, failureCallback) {
	var etag, lastModified; //brute-force the caching headers for some dumb browsers
	//(Not naming names, but let's say it's version 6 and it rhymes with Ninternet Nexplorer)
	
	this.url = url;
	
	var listener = new Request({url: url, method: 'get'});
	var maybeSendListenerRequest = function() {
		listener.setHeader("If-None-Match", etag).setHeader("If-Modified-Since", lastModified).send();
	}.bind(this);
	function listen(when) {
		if(when===false) { return; }
		setTimeout(maybeSendListenerRequest, $type(when)=='number' ? when : 0);
		return this;
	}
	
	listener.addEvents({
		success: function listenerSuccess(resp) {
			etag=this.getHeader('Etag');
			lastModified=this.getHeader('Last-Modified');
			if($type(successCallback)=='function') {
				listen(successCallback.bind(this)(resp));
			}
		},
		failure:function(resp) {
			if($type(failureCallback)=='function') {
				listen(failureCallback.bind(this)(resp));
			}
		}
	});

	this.getListener = function getListener() { return listener; }; //someone might think this useful...
	this.listen = listen;
}

//And now for our feature presentation
var Dumbchat = new Class({
	Implements: Events,
	initialize: function(sendform, receivelist, suburl, username) {
		this.sendform = sendform, this.receivelist = receivelist, this.suburl = suburl, this.username = username || this.generateUsername();
		return this;
	},
	connect: function(){
		var sendform = this.sendform, receivelist = this.receivelist, suburl = this.suburl, username = this.username;
		sendform.addEvent('submit', function(ev) {
			ev && ev.stop();
			var msgEl = sendform.getElement("input[name=message]");
			var msg = msgEl.value;
			this.send({username: this.username, message: msg});
			msgEl.set('value', '');
		}.bind(this));
		
		var delay = 500; //error delay
		var dumbchat = this;
		
		var subscriber = new Subscriber(suburl, 
			function success(textResp) {
				var el=new Element('li');
				var resp = JSON.decode(textResp, true);
				if(resp) {
					if(resp.notice) {
						var notice;
						switch(resp.notice) {
							case 'hi':
								notice = (resp.username || "???") + " joins the chat.";
								dumbchat.fireEvent("join", [ resp.username ]);
								break;
							case 'bye':
								notice = (resp.username || "???") + " leaves.";
								dumbchat.fireEvent("leave", [ resp.username ]);
								break;
							case 'rename':
								notice = (resp.username || "???") + " is now known as " + (resp.newname || "???") + ".";
								break;
						}
						el.set({
							'class':'notice',
							'text': notice
						});
					}
					else if(resp.message) {
						el.set({
							'class':'message',
							'text': (resp.username || "???") + ": " + resp.message
						});
						if(resp.username==dumbchat.username) {
							el.addClass('iSay');
						}
					}
					receivelist.grab(el, 'bottom');
					receivelist.scrollTop = receivelist.scrollHeight; //quick 'n' dirty scroll to bottom
				}
				else {
					//el.set({'class':'error', text:'There was an error: ' + textResponse});
					dumbchat.fireEvent('clientError');
				}
			},
			function failure(resp) {
				dumbchat.fireEvent('serverError');
				delay = delay * 1.5;
				return delay;
			}
		);
			
		subscriber.listen();
		
		this.send = function () {
			var req = new Request({
				url: sendform.get('action'),
				method: 'post',
				urlEncoded : false,
				headers: {"Content-Type":"text/json", "Accept":"text/json"}
			}).addEvent('success', function(resp) {
				dumbchat.fireEvent('send', [resp]);
			});
			return function (data) {
				req.send({data: JSON.encode(data)});
				return this;
			}.bind(this);
		}.bind(this)();
		
		this.disconnect = function disconnect() {
			if(subscriber) {
				subscriber.getListener().cancel();
				dumbchat.send({username: this.username, notice:"bye"});
				subscriber = false;
			}
			return this;
		};
		
		return this.send({username: this.username, notice:"hi"});
	},
	
	'rename': function(newname) {
		if(newname!=this.username) {
			this.send({username:this.username, notice:"rename", newname: newname});
			this.username=newname;
		}
		return this;
	},
	
	generateUsername: function() {
		return "J.Doe" + Math.floor(Math.random()*1000);
	}
});
