jQuery.cookie=function(a,b,c){if(typeof b!='undefined'){c=c||{};if(b===null){b='';c.expires=-1}var d='';if(c.expires&&(typeof c.expires=='number'||c.expires.toUTCString)){var e;if(typeof c.expires=='number'){e=new Date();e.setTime(e.getTime()+(c.expires*24*60*60*1000))}else{e=c.expires}d='; expires='+e.toUTCString()}var f=c.path?'; path='+(c.path):'';var g=c.domain?'; domain='+(c.domain):'';var h=c.secure?'; secure':'';document.cookie=[a,'=',encodeURIComponent(b),d,f,g,h].join('')}else{var j=null;if(document.cookie&&document.cookie!=''){var k=document.cookie.split(';');for(var i=0;i<k.length;i++){var l=jQuery.trim(k[i]);if(l.substring(0,a.length+1)==(a+'=')){j=decodeURIComponent(l.substring(a.length+1));break}}}return j}};

$(function(){
	$.ajaxSetup({
		beforeSend: function(request){
			request.setRequestHeader('Accept', 'application/html+ajax');
		}
	});
	
	$('a.follow').live('click', follow);	
	$('.followAll').click(follow);
	
	$('a.cancel').live('click', function(){
		var $this = $(this);
		confirm({
			text: 'Отменить заявку?',
			onConfirm: function(){
				$.post('/following_requests/cancel', {
					userid: $this.attr('rel')
				}, function(_){
					location.reload();
					// $this.hide().siblings().show();
				});
			}
		});		
		return false;
	});
	
	$('a.unfollow').live('click', function(){
		var $this = $(this);
		confirm({
			text: 'Перестать читать этого автора?',
			onConfirm: function(){
				$.post('/unfollow', {
					userid: $this.attr('rel')
				}, function(_){
					$this.hide();
					$this.siblings().show();
					$('li.followAll', '#userlistHeader').show();
				});
			}
		});		
		return false;
	});
	
	$('a.blockUser').click(function(){
		var $this = $(this);
		confirm({
			text: 'Заблокировать <b>'+ $this.attr('rev') + '</b>?',
			description: 'Если вы заблокируете <b>' + $this.attr('rev') + '</b>, то вам будут не видны его твиты, а он не сможет стать вашим читателем.',
			onConfirm: function(){
				$.post('/block', {
					userid: $this.attr('rel')
				}, function(_){
					location.reload();
				});
			}
		});		
		return false;
	});
	
	$('a.unblockUser').click(function(){
		var $this = $(this);
		$.post('/unblock', {
			userid: $this.attr('rel')
		}, function(_){
			location.reload();
		});
		return false;
	});
	
	$('a', 'li.moreTvits').live('click', function(){
		var $this = $(this).addClass('loading'),
			params = {
				beforeUserId:	$this.attr('rel'),
				beforePostTime:	$this.attr('rev')				
			};

		if (__env__.viewType == 'tree') params.tree = 1;
		$.post(location.href, params, function(_){
			_ = parseJSON(_);
			$this.parent().after(_.html).remove();
			if (_.channels && liveUpdate.initialized()) liveUpdate.addChannel(_.channels);
		});
		return false;
	});
	$('a', 'li.moreUsers').live('click', function(){
		var $this = $(this).addClass('loading');

		$.post($this.attr('rel'), {}, function(_){			
			if ( !(_ = parseJSON(_)) ) return false;
			var $followAll = $('li.followAll', '#userlistHeader');
			$followAll.attr('rel', $followAll.attr('rel') + _.ids + ' ');
			if (!_.allFriends) $followAll.removeClass('none');
			$this.parent().after(_.html).remove();
		});
		return false;
	});
	
	$('a.delete, a.dm-delete').live('click', function(e){
		var postId = $(this).attr('rel');
		if (e.shiftKey)
			remove();
		else
			confirm({
				text: __env__.page == 'inbox' ? 'Удалить сообщение?' : 'Удалить твит?',
				onConfirm: remove,
				that: this
			});		
		return false;
		
		function remove(){
			$.post('/tvit/delete/', {
				postId: postId
			}, function(_){
				if (liveUpdate.playing()) return false;
				$('#' + postId).slideUp('fast', function(){
					$(this).remove();
				});
			})
		}
	});
		
	$('a.like').live('click', function(){
		if (!user.id) return (location.href = '/login') && false;
	
		var $this = $(this),
			postId = $this.attr('rel'),
			isLiked = $this.hasClass('liked');
		$.post(isLiked ? '/tvit/unlike' : '/tvit/like', {
			postId: postId
		}, function(_){
			if (!liveUpdate.initialized()) {
				_ = parseJSON(_);
				updateTvit('#' + postId, _.html);
			}
			if (isLiked) {
				$this.removeClass('liked').html('оценить');
			} else {
				$this.addClass('liked').html('отменить оценку');
			}
		});
		return false;
	});
	
	$('a.likecount').live('click', function(){
		var $this = $(this);
		$.post('/tvit/who_liked', {
			postId: $this.attr('rel')
		}, function(_){
			_ = parseJSON(_);
			$this.parent().after(_.html).remove();
		});
		return false;	
	});
	
	if ( $('div.system-message').length ){
		$('div.system-message')
			.fadeIn()
			.click(function(){
				$(this).fadeOut();
			});
		
		$.cookie('message', null, {domain: __env__.cookieDomain, path: '/'});
		
		setTimeout(function(){
			$('div.system-message').fadeOut();
		}, 6000);
	}
	
	$('a.toThread').live('click', function(){
		var $this = $(this).addClass('loading');
		if ($this.attr('disabled')) return false; else $this.attr('disabled', 'disabled');
		$.get($this.attr('href'), {}, function(_){
			$('<ul class="comments">' + _ + '</ul>').css('display', 'none').insertAfter(
				$this.parent().slideUp(function(){
					$(this).remove()
				})
			).slideDown();
		});
		return false;
	});
	
	$('#searchbox').inputHint('найти слова');
	
	$('p.viewMode a, a.switchViewMode').click(function(){
		$.cookie('tree', $(this).hasClass('switchViewModeTree') ? 1 : 0, {domain: __env__.cookieDomain, path: '/', expires: 365});
		location.reload();
		return false;
	});
	$('a.switchViewMode').bind('mouseenter', function(){
		var $this = $(this);
		$this.tooltip({
			text: $this.hasClass('switchViewModeTree') ? 'Сделать РуТвит похожим на Френдфид' : 'Сделать РуТвит похожим на Твиттер',
			position: 'top',
			hover: true
		});
	});
	
	$('a.tvitLink', 'ul.posts').live('click', function(){
		var $this = $(this),
			href = $this.attr('href')
			link = false;
		
		if (href.indexOf('youtube.com/watch?') != -1)
			link = 'http://www.youtube.com/v/' + href.replace(/(^.*v=|&.*$)/, '') + '?autoplay=1';
		else if (href.indexOf('rutube.ru/tracks/') != -1)
			link = 'http://video.rutube.ru/' + href.replace(/^.*v=/, '');
		else if (href.indexOf('smotri.com/video/view/?') != -1)
			link = 'http://pics.smotri.com/scrubber_custom8.swf?file=' + href.replace(/^.*\?id=/, '')+'&bufferTime=3&autoStart=true&str_lang=rus&xmlsource=http%3A%2F%2Fpics.smotri.com%2Fcskins%2Fblue%2Fskin_color_grayaqua.xml&xmldatasource=http%3A%2F%2Fpics.smotri.com%2Fskin_ng.xml';
		else if (/(\.png|\.jpg|\.gif)$/i.test(href))
			link = {
				src: href,
				type: 'image'
			};
		else if ( href.indexOf('.tikr.ru/') != -1 &&
			   ( href.indexOf('.tikr.ru/micex') != -1
			  || href.indexOf('.tikr.ru/rts') != -1
			  || href.indexOf('.tikr.ru/cbr') != -1
			  || href.indexOf('.tikr.ru/nbu') != -1 ) ) {
			var a = href.split(/(\/|\.)/);
			link = 'http://tikr.ru/chart.swf?board0=' + a[10].toUpperCase() + '&amp;ticker0=' + a[4].toUpperCase();
		}
		if (link) {
			if ($this.hasClass('expanded'))
				$this.removeClass('expanded').next().remove();
			else {
				if (link.type == 'image') {
					$('<img src="' + link.src + '"/>').insertAfter( $this.addClass('expanded') ).load(imageResize).wrap('<div class="tvitLink-loading"/>');					
				} else {
					$this.addClass('expanded').after('<object width="500" height="385"><param name="movie" value="' + link + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + link + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="transparent" width="500" height="385"></embed></object>');					
				}
			}
			return false;			
		}
	});
	
	$('#feedbackURL').click(function(){
		if (!user.id) return true;
		var $form = $('#update-status');
		if ($form.length) {
			$($.browser.safari ? 'body' : 'html').animate({
				scrollTop: 0
			}, 1000, 'swing', function(){
				textareaEndFocus( $('textarea', $form).val('@Support ') );
			});
		} else {
			location.href = '/?text=@Support%20';
		}		
		return false;
	});
	
	var $NYhat = $('#NY-hat').click(function(){
		$NYhat.animate({top: '-25px', left: '-200px'}, 500, 'swing', function(){
			setTimeout(function(){
				$NYhat.css({left:'-45px'}).animate({top: '2px', left: '-23px'}, 500, 'swing');				
			}, 3000);
		});		
	});
	
	updater.init();
	AJAXreply.init();
	userlistSwitcher.init();
	if (__env__.page == 'search') savedSearches.init();
});

function follow(){
	var $this = $(this),
		userid = $(this).attr('rel');
	$.post('/follow', {
		userid: userid
	}, function(_){
		/*_ = eval('(' + _ + ')');
		 if (_.error) {
			alert(_.error);
			return false;
		} else if (_.message) {
			displayMessage(_.message);			
		} else if (_.status == 'request sent') location.reload(); */
		if ( !(_ = parseJSON(_)) ) return false;
			else if (_.status == 'request sent') location.reload();
		if (_.message) displayMessage(_.message);
		$this.hide().siblings().show();
		if (userid.indexOf(' ') != -1) {
			$('a.unfollow').show();
			$('a.follow').hide();
		}
	});
	return false;
}

var AJAXreply = (function(){
	var template =
		'<form class="reply">\
			<span>140</span>\
			<input type="submit" class="submit gift" value="Ответить" tabindex="101"/>\
			<textarea tabindex="100">%replyTo</textarea>\
		</form>';

	function init(){
		$('a.reply').live('click', function(e){
			if (!user.id) return (location.href = '/login') && false;
			
			var $this = $(this),
				authorname = $this.attr('name'),
				postId = $this.attr('rel'),
				$replyForm = $( template.replace('%replyTo', e.shiftKey ? '' : '@' + authorname + ' ') ),
				$textarea = $('textarea', $replyForm).focus(liveUpdate.pause).blur(liveUpdate.start),
				$input = $('input', $replyForm),				
				$parent = $('div:eq(0)', '#' + postId),
				$lastPost = $('dd', '#update-status');
			
			if ( ! ($replyDiv = $('form.reply', $parent)).length ) {
				
				$parent.append($replyForm);
			
				$input.click(function(){
					var body = $textarea.val();
					
					$input.addClass('loading').val('').attr('disabled', 'disabled');
					
					$.post(__env__.page == 'inbox' ? '/send' : '/tvit/new', {
						body: body,
						postId: postId
					}, function(_){
						slideRemove($replyForm);
						_ = parseJSON(_);
						if (__env__.page == 'inbox') {
							addTvit(_.html);
						} else if ( !liveUpdate.initialized() )
							updater.updateTimeline(_, {
								authorname:	authorname,
								$link:		$this
							}); else if ( $lastPost.length ) {
								if (__env__.page == 'search' && _.message) displayMessage(_.message);
								$lastPost.text(_.rawText);
							};
						if (__env__.page == 'profile' && __env__.viewType == 0 && _.message) displayMessage(_.message);
					});
					return false;
				});
				
				counter({
					$textarea:	$textarea,
					$counter:	$('span', $replyForm),
					$submit:	$input,
					ctrlEnterSubmit: true
				});
				
				textareaEndFocus($textarea);
				
				//liveUpdate.pause();				
			} else {
				$replyDiv.remove();
				/* if (!$('textarea').filter('[value]').length) */ liveUpdate.start();
			}
			
			return false;
		});
	}
	
	return {init: init}
})();

function textareaEndFocus($textarea){
	var ta = $textarea[0];
	if (ta.setSelectionRange) {
		ta.focus(); 
		ta.setSelectionRange(ta.value.length, ta.value.length); 
	} else $textarea.focus().val($textarea.val() + '');	
}

function counter(_){
	var regExp = /http(?:s?):\/\/([a-z0-9\.-]+)\/?.*?(?=\s|$)/ig;
	_.$textarea.keyup(function(e){		
		var text = _.$textarea.val(),
			charsRemain = __env__.tvitMaxLength - text.replace(/http(?:s?):\/\/([a-z0-9\.-]+)\/?.*?(?=\s|$)/ig, '$1').length;
		_.$counter.html(charsRemain).removeClass('warning danger');
		
		if (charsRemain < 20 && charsRemain >= 0) _.$counter.addClass('warning');
			else if (charsRemain < 0) _.$counter.addClass('danger');
		
		if (charsRemain < 0) _.$submit.attr('disabled', 'disabled'); else if (!_.checkSelect || !DM.locked()) _.$submit.attr('disabled', '');

		if (_.ctrlEnterSubmit && charsRemain >= 0 && e && e.keyCode == '13' && (e.ctrlKey || e.metaKey))
			if (typeof _.ctrlEnterSubmit == 'function')
				_.ctrlEnterSubmit();
			else {
				_.$textarea.blur();
				_.$submit.click();
			}
	}).keyup();
}

var updater = (function(){
	var template, $form, $counter, $textarea, $input, $lastPost, $header,		
		mode = 'tvit', tvitModeMsg, DMusername,
		DM_regExp = /^d @?(\w+)/i,
		DM_regExpShort = /^d /i;
	
	function init(){
		template = '<li class="byUpdater" id="' + user.id + '_%posttime">\
			<a class="avatar" href="/%username">\
				<img src="%avatar"/>\
			</a>\
			<span class="body">\
				<a href="/%username">%username</a>\
				%msg\
				<span class="meta">%time\
					<ul class="actions">\
						<li><a title="удалить" rel="/tvit/delete/%posttime" class="delete" href="#">&nbsp;</a></li>\
						<li><a class="reply" name="%username" rev="%posttime" rel="' + user.id + '" href="#">ответить</a></li>\
					</ul>\
				</span>\
			</span>\
		</li>';
		$form = $('#update-status');
		if (!$form.length) return false;
		
		$header = $('h1', '#update-status');
		tvitModeMsg = $header.html();
		$counter = $('span.counter', '#update-status');
		$textarea = $('textarea', $form);
		$input = $('input', $form);
		$lastPost = $('dd', $form);
	
		$form.submit(submit);
		
		counter({
			$textarea:	 $textarea,
			$counter:	 $counter,
			$submit:	 $input,
			checkSelect: __env__.page == 'inbox' ? true : false,
			ctrlEnterSubmit: submit
		});
		
		if (!__env__.dreamRegister) {
			update();
			$textarea.keyup(update);
		}
	}
	
	function submit(){
		var msg = $textarea.val(),
			action = $form.attr('action');
			
		if (!msg) return false;
		
		$input.addClass('loading');
				
		var params = {
			body: msg
		};
		if ($('#to').length) params.userid = $('#to').val();
		
		$.post(action, params, function(_){
				$input.removeClass('loading');
				if ( !(_ = parseJSON(_)) ) return false;
				$textarea.val('');
				$counter.html(__env__.tvitMaxLength);

				if (__env__.page == 'inbox')
					addTvit(_.html);
				else
					if ($lastPost) $lastPost.text(_.rawText);
			}
			//updateTimeline
		);
		
		return false;	
	}
	
	function updateTimeline(_, reply){
		/* _ = eval('(' + _ + ')');
		if (_.error) {
			alert(_.error);
			return false;
		} */
		if (typeof _ == 'string') _ = parseJSON(_);
		if (!_) return false;
		if (__env__.page == 'B' || __env__.page == 'B1') {
			location.href = location.protocol + '//' + location.host + '/' + user.nickname + '/twotvits/' + _.posttime;
			return false;
		}
		if (__env__.noTimelineUpdate) return displayMessage(_.message);
		var $tvit = $(template
			.replace(/%username/g, user.nickname)
			.replace('%avatar', user.avatar)
			.replace('%msg', user.protected ? '<span class="lock"></span>' + _.text : _.text)
			//.replace('%time', _.time + (reply.authorname ? ' <a href="/'+ reply.authorname +'/tvit/'+ reply.postTime +'">в ответ '+ reply.authorname +'</a>' : ''))
			.replace(/%posttime/g, _.posttime)
			.replace('<li>', $('#content').hasClass('thread') ? '<li class="compact">' : '<li>')
		);
		
		if ($lastPost) $lastPost.text(_.rawText);
		if ($counter) $counter.html(__env__.tvitMaxLength);
		
		if (__env__.page == 'myProfile') $('a.avatar', $tvit).remove();
		else if (__env__.page == 'C') {
			tvitToTread($tvit);
			$tvit.appendTo( $('ul.posts:last') ).slideDown();
			return false;
		}
		else if (__env__.viewType == 'tree') {
			if (reply.authorname) {
				var $replyToTvit = $('#' + reply.userId + '_' + reply.postTime);
				tvitToTread($tvit);
				$tvit.insertBefore(
					$replyToTvit.nextAll('li.post:eq(0)')[0] || $replyToTvit.parent().nextAll('li.post:eq(0)')[0]
				).slideDown();
			} else {
				$tvit.prependTo( $('ul.posts:last') ).slideDown();
			}
			return false;
		}
		$tvit.prependTo( $('ul.posts:last') ).slideDown();
	}
	
	function tvitToTread($tvit){
		$tvit.addClass('compact');
		$('a.avatar', $tvit).after('<span class="avatar"></span>').remove();
		$('ul.actions', $tvit).prependTo($tvit);
		$('span.meta', $tvit).remove();
	}
	
	function update(e){
		var text = $textarea.val();
		
		if (__env__.page != 'inbox')
			if (/^d /i.test(text) ) {
				mode = 'DM';
				$input.val('Отправить');
				if (DMusername = /^d @?(\w+)/i.exec(text))
					$header.html('Отправить личное сообщение пользователю ' + DMusername[1]);
				else
					$header.text('Отправить личное сообщение');
			} else if (mode != 'tvit') {
				mode = 'tvit';
				$input.val('Написать');
				$header.html(tvitModeMsg);
			}
	}
	
	return {
		init: init,
		updateTimeline: updateTimeline,
		update: update
	}
})();

function confirm(_){
	var $frame = $('<div class="popup-frame"><h1>' + _.text + '</h1></div>'),
		$shadow = $('<div class="popup-shadow"></div>').css('opacity', 0),
		$yesBtn = $('<button>Да</button>').click(function(){
			close();
			_.onConfirm && _.onConfirm();
		}),
		$noBtn = $('<button>Нет</button>').click(function(){
			close();
			_.onDeny && _.onDeny();
		});
	_.that && $(_.that).blur();
	
	if (_.description) $('<div class="popup-description">' + _.description + '</div>').appendTo($frame);
	
	$frame.append($yesBtn, $noBtn);
	$(document.body).append($shadow, $frame);
	$shadow.animate({ opacity: .8 }, 300);	
		
	function close() {
		$frame.remove();
		$shadow.animate({ opacity: 0 }, 300, function(){
			$shadow.remove();
		})
	} 
};

function alert(_) {
	if (!_ || !_.text) _ = {text: _};
	var $frame = $('<div class="popup-frame"><h1>' + _.text + '</h1></div>'),
		$shadow = $('<div class="popup-shadow"></div>').css('opacity', 0),
		$okBtn = $('<button>Ok</button>').click(function(){			
			$frame.remove();
			$shadow.animate({ opacity: 0 }, 300, function(){
				$shadow.remove();
			})
			_.onOk && _.onOk();
		});
		
	$frame.append($okBtn);
	$(document.body).append($shadow, $frame);
	$shadow.animate({ opacity: .8 }, 300);
};

function displayMessage(_){
	if (!_ || !_.text) _ = {text: _};
	var $msg = $('<div class="system-message">'+ _.text +'</div>').prependTo(document.body).fadeIn();
	setTimeout(remove, _.time || 6000);
	$msg.click(remove);
	return false;
	
	function remove(){
		$msg.fadeOut('slow', function(){
			$msg.remove();
		});
	}
}

(function($){
	$.inputHint = function(elm, _) {
		if (!elm.val()) elm.val(_).addClass('empty');
		elm
			.focus(function(){
				if (elm.val() == _) elm.removeClass('empty').val('')
			})
			.blur(function(){
				if (elm.val() == '') elm.addClass('empty').val(_)
			});		
	};
	
	$.fn.inputHint = function(_) {
		this.each(function(){
			new $.inputHint($(this), _);
		});
		
		return this;
	}	
})(jQuery);

(function($){
	$.tooltip = function(elm, _) {
		_ = _ || {};
		_.text = _.text || elm.attr('rel');
		_.speed = _.speed || 'slow';
		
		var $tooltip = $('<div class="tooltip"><div class="' + _.position + '"/>'+ _.text +'</div>');
			
		$('body').append($tooltip);
		
		position($tooltip, elm, _);
		
		$tooltip
			.fadeIn(_.speed)
			.click(hide)
			.data('elm', elm)
			.data('_', _);
		
		if (_.hover) elm.bind('mouseleave', hide); else if (_.time != 'forever') setTimeout(hide, _.time || 6000);
		function hide(){
			$tooltip.fadeOut(_.speed, function(){
				$(this).remove();
			});
		}
	};
	
	$(window).bind('resize', function(){
		$('div.tooltip').each(function(){
			var $this = $(this);
			position($this, $this.data('elm'), $this.data('_'));
		})
	});
	
	function position($tooltip, elm, _){		
		var pos = elm.offset(),
			css = _.position == 'left' ? {
				top:	pos.top  + (_.dY || 0),
				left:	pos.left - ( _.width || $tooltip.width() ) - 21
			} : _.position == 'top' ? {
				top:	pos.top  + (_.dY || 0) - $tooltip.outerHeight() - 7,
				left:	pos.left + ( (elm.outerWidth() - $tooltip.outerWidth()) / 2 ) + (_.dX || 0)
			} : _.position == 'bottom' ? {
				top:	pos.top  + (_.dY || 0) + elm.outerHeight() + 7,
				left:	pos.left + ( (elm.outerWidth() - $tooltip.outerWidth()) / 2 ) + (_.dX || 0)
			} : {
				top:	pos.top  + (_.dY || 0),
				left:	pos.left + ( elm[0].clientWidth || elm.width() ) + 9 + (_.dX || 0)
			};

		if (_.width) css.width = _.width;
		if ($.browser.msie && $.browser.version == 6) $('div', $tooltip).css({width: $tooltip.width()});
		
		$tooltip.css(css)		
	}
	
	$.fn.tooltip = function(_) {
		this.each(function(){
			new $.tooltip($(this), _);
		});
		
		return this;
	}	
})(jQuery);

var DM = (function(){
	var $select, $textarea, $submit,
		locked = false;
	
	function init(){
		initialized = true;
		$select = $('#to').change(checkSelect);
		$textarea = $('textarea', '#update-status');
		$submit = $('input.submit', '#update-status');
		/* $('a.dm-reply').click(function(){
			$textarea.focus();
			$('option[value=' + $(this).attr('rel') + ']').attr('selected', 'selected');
			$select.change();
			return false;
		}); */
		checkSelect();
	}
	
	function checkSelect(){
		if ($('option[selected]', $select).hasClass('nobody')) {
			$submit.attr('disabled', 'disabled');
			locked = true;
		} else {
			$submit.attr('disabled', '');
			locked = false;
		}
		updater.update();
	}
	
	return {
		init: init,
		locked: function() {
			return locked;
		}
	}
})();

var userlistSwitcher = (function(){

	var $users, $switches;
	
	function init(){
		$users = $('ul.users');
		$switches = $('li:not(.followAll)', '#userlistHeader');	
		$switches
			.click(change)
			.mouseover(function(){
				var $this = $(this);
				$this.tooltip({
					text: $this.attr('rel'),
					speed: 'fast',
					hover: true,
					position: 'top'
				});
			});
	}
	
	function change(){
		var $this = $(this);
		if ($this.hasClass('current')) return false;
		var mode = this.className
		$users[0].className = 'users ' + mode;
		$switches.removeClass('current');
		$this.addClass('current');
		$.cookie('ULmode', mode, {path: '/', expires: 365/*, domain: '.' + $env.domain*/})
		return false;		
	}

	return {init: init}
})();

var liveSearch = (function(){
	var params,
		$msg,
		updates = 0,
		text = '%n %s, с тех пор, как Вы начали поиск. <a href="#" onclick="location.reload()">Обновите страницу</a>.';

	function init(_){
		params = _;
		liveUpdate.init(_);
		// $msg = $('#count-realtime-results');
		// schedule({
		// 			fn: update
		// 		});
		setInterval(function(){
			$.post(_.pingURL, {
				q: _.q,
				id: _.id
			});
		}, _.interval * 1000);
	}
	
	// function update(){
	// 	$.post('/search/count_realtime_results', params, function(_){
	// 		_ = parseJSON(_); //_ && eval('(' + _ + ')');
	// 		if (_.count > 0) {
	// 			updates += _.count / 1;
	// 			$msg.html(text.replace('%n', updates).replace('%s', getWord(updates))).slideDown();
	// 			params.posttime = _.posttime;
	// 		}
	// 	});
	// }
	
	function getWord(n){
		var mod = n % 100,
			word = 'результатов';
		
		if (mod < 10 || mod > 20) {
			mod = mod % 10;
			switch (mod){
				case 1: word = 'результат появился'; break;
				case 2: word = 'результата появилось'; break;
				case 3: word = 'результата появилось'; break;
				case 4: word = 'результата появилось'; break;
				default: word ='результатов появилось'; break;
			}
		}	
		return word;
	}
		
	return {init: init}
})();

function slideRemove($_){
	$_.slideUp(function(){ $_.remove() });
}

function addTvit(_){
	_ = $(_);
	_.css('display', 'none').prependTo('ul.posts:last').slideDown();
}
function updateTvit($tvit, html, type){
	if (type == 'NC')
		html && $(html).css('display', 'none').appendTo($('ul.comments:first', $tvit)).slideDown();
	else
		$('span.likers:first', $tvit).html(html);
}

var liveUpdate = (function(){
	var $timeline,
		paused = false,
		initialized = false,
		actions = [],
		realplexor,
		lastEventTimestamp = false,
		blacklist = {},
		following = {},
		viewType,
		bubble = undefined,
		
		newTvitsCount = 0,
		documentTitle = '',
		windowIsFocused = true;
		
	function init(_){
		initialized = true;
		blacklist = _.blacklist;
		following = _.following;
		bubble = _.bubble;
		viewType = __env__.page == 'search' ? 0 : __env__.viewType;
		if (_.bubble) bubble = _.bubble;
		$timeline = $('ul.posts:eq(0)');
		$.getScript('/js/dklab_realplexor.js', function(){
			realplexor = new Dklab_Realplexor('http://realtime.' + location.host);
			Dklab_Realplexor.prototype.subscribeAll = function(channels, action, cursor){
				for (var i in channels) {
					this.subscribe(channels[i], action);
					this.setCursor(channels[i], cursor);
				}
			}
			realplexor.subscribeAll(_.channels, action, _.cursor);			
			realplexor.execute()
		});
		
		documentTitle = document.title;
		$(document).click(function(){
			if (newTvitsCount) {
				document.title = documentTitle;
				newTvitsCount = 0;
			}
		});
		$(window)
			.blur(function(){
				windowIsFocused = false
			}).focus(function(){
				windowIsFocused = true;
			});
		
		if (!window.console) console = { log: function(){} };
		return false;
	}
	
	function addChannel(channel){
		// console.log('+++ addChannel +++ ', channel)
		realplexor[ typeof channel == 'string' ? 'subscribe' : 'subscribeAll' ](channel, action);
		realplexor.execute();
	};
	function removeChannel(channel){
		// console.log('xxx removeChannel xxx ', channel)
		realplexor.unsubscribe(channel);
		realplexor.execute();
	};
	function prepareTvit(html, userID, postID, _){
		html = $(html);
		if (userID == user.id) {
			$('a.like', html).remove();
			$('ul.actions', html).prepend('<li><a href="#" class="delete" rel="' + postID + '">&nbsp;</a></li>')
		}
		
		if (_.commenters) {
			var numReplies = 0,
				$rootPost = $('#' + _.rootPostID);
			for (var i in _.commenters)
				if (!blacklist[i]) numReplies += _.commenters[i] / 1;
			
			if (numReplies) {
				var $replycount = $('a.replycount', $rootPost);
				if ($replycount.length)
					$replycount.html('ответов — ' + numReplies);
				else
					$('span.meta:first a:last', $rootPost).after(', <a class="replycount" href="http://' + location.host + '/' + _.nickname + '/context/' + _.rootPostTime + '">ответов — ' + numReplies + '</a>');
			} else {
				var $meta = $('span.meta:first', $rootPost)[0];
				if ($meta) $meta.innerHTML = $meta.innerHTML.replace(/,.*$/, '');
			}
		}
		
		if (_.type == 'NL' || _.type == 'NC')
			if (!following[userID] && user.id != userID) $('span.avatar', html).removeClass('friend');
		
		return html;
	}
	function updateLikers(_){
		var $post = $('#' + _.rootPostID);
		if (_.likedBy) {
			var likedFollowing = [],
				likedOthers = [];			
			for (var i in _.likedBy){
				if (following[i] || user.id == i)
					likedFollowing.push(_.likedBy[i]);
				else
					likedOthers.push(_.likedBy[i]);
			}
						
			likedFollowing = likedFollowing.concat(likedOthers);
						
			var delta = likedFollowing.length - __env__.maxLikersToDisplay;
			if (delta > 0) {
				likedFollowing.length = __env__.maxLikersToDisplay - 1;
				delta++;
			};
			
			var s = '';
			if (likedFollowing.length) {
				for (i in likedFollowing)
					s += '<a href="/' + likedFollowing[i] + '">' + likedFollowing[i] + '</a>, ';
			
				s = '<span class="likecount">&nbsp;</span>' + s.substr(0, s.length - 2);
				if (delta > 0) s += ' и еще ' + numWord(delta, ['пользователь', 'пользователя', 'пользователей']);
				s += ' оценил' + (likedFollowing.length > 1 ? 'и' : '') + ' этот твит';
			}
			
			$('span.likers:first', $post).html(s);

			if (_.likedBy[user.id]) $('a.like', $post).addClass('liked').html('отменить оценку');
		
		} else $('span.likers:first', $post).html(_.likeHTML);
	}
	function displayNewTvitsCount(){
		if (windowIsFocused) return false;
		newTvitsCount++;
		document.title = documentTitle + ' (' + newTvitsCount + ')';
	}
	
	function action(_, channel, timestamp){
//		console.log('action', _);
		if (timestamp == lastEventTimestamp) return false;
		if (blacklist[_.userID] || blacklist[_.rootPostUserID]) return false;
		if (_.type == 'NC' && viewType == 0 && channel.substr(0, 1) == 'p') return false;
		
		switch (_.type) {
			case 'NP':
				_.addChannel && addChannel(_.addChannel);	
				addTvit(prepareTvit(_.postHTML, _.userID, _.postID, _));
				displayNewTvitsCount();
				break;							
			case 'DC':
				prepareTvit('', 0, 0, _);
			case 'DP':
				_.removeChannel && removeChannel(_.removeChannel);
				slideRemove($('#' + _.postID));
				break;
			case 'NC':
				if (viewType == 0) {
					addChannel(_.addChannelA1);
					addTvit( prepareTvit(_.postHTML, _.userID, _.postID, _) );
				} else {
					addChannel(_.addChannelA2);
				
					var $post = $('#' + _.rootPostID);
					if (typeof bubble == 'undefined' ? _.bubble : bubble) {
						if ($post.length) {
							if ($post.prev().length) {
								$post.slideUp(function(){
									$post.prependTo('ul.posts:last').slideDown();
									updateTvit( $post, prepareTvit(_.commentHTML, _.userID, _.postID, _), _.type );
								});
							} else {
								updateTvit( $post, prepareTvit(_.commentHTML, _.userID, _.postID, _), _.type );
							}
						} else {
							addTvit( prepareTvit(_.rootPostHTML, _.userID, _.postID, _) );
						}
					} else {
						updateTvit( $post, prepareTvit(_.commentHTML, _.userID, _.postID, _), _.type );
					}	
				}
				displayNewTvitsCount();
				break;
			case 'NL':
				var $post = $('#' + _.rootPostID);
				if (typeof bubble == 'undefined' ? _.bubble : bubble) {
					if ($post.length) {
						if ($post.prev().length) {
							$post.slideUp(function(){
								$post.prependTo('ul.posts:last').slideDown();
								updateLikers(_);
							});
						} else {
							updateLikers(_);
						}
					} else {
						addChannel(_.addChannel);
						addTvit( prepareTvit(viewType == 0 ? _.postHTML : _.rootPostHTML, _.userID, _.postID, _) );
						updateLikers(_);
						displayNewTvitsCount();
					}
				} else {
					updateLikers(_);
				}
				break;
			case 'DL':
				updateLikers(_);
				break;
			default:
				//alert(_.type);
		}
		lastEventTimestamp = timestamp;
	}
	
	return {
		init: init,
		pause: function() { paused = true; },
		start: function() {
			paused = false;
			var _;
			while (_ = actions.shift()) {
				action(_);
			}
		},
		initialized: function() {return initialized},
		playing: function() {return initialized && !paused},
		addChannel: addChannel,
		removeChannel: removeChannel
	}
})();

var savedSearches = (function(){
	
	var $link, $list,
		q, count, searchIsSaved;
	
	function init(){
		$link = $('a.save-search');
		q = $link.attr('rel');
		searchIsSaved = $link.filter(':visible').hasClass('delete-search');
		$list = $('ul.saved-searches'),
		count = $('li', $list).length - 1;
		$link.click(function(){			
			$.post( searchIsSaved ? '/search/delete' : '/search/save', {
				q: q
			}, function(_){
				_ = parseJSON(_);
				if (_.status == 'fail') {
					alert (_.message || 'Ошибка');
					return false;
				}
				$link.toggle();
				if (searchIsSaved) {
					slideRemove( $('a[text='+q+']', $list) );
					count--;
					if (!count) $list.slideUp();
				} else {
					if (count == 0)
						$list.slideDown('fast', showSearch);
					else
						showSearch();					
					count++;
				}
				searchIsSaved = !searchIsSaved;
			});
			return false;
		});
	}
	
	function showSearch(){
		$('<li class="current"><a href="/search?q='+q+'">'+q+'</a></li>').css('display', 'none').appendTo($list).slideDown();
	}
	
	return {
		init: init
	}
	
})();

function schedule(_){
	_ = $.extend({
		updateTime: 30000,
		updateTimeInactive: 300000,
		requestsBeforeInactive: 2
	}, _);
	
	var timer,
		requests = 0,
		isActive = true,
		time = _.updateTime;
		
	function scheduledFn(){
		_.fn();		
		requests++;
		if (isActive && requests >= _.requestsBeforeInactive) {
			isActive = false;
			time = _.updateTimeInactive;
		}
		timer = setTimeout(scheduledFn, time);
	}
	
	timer = setTimeout(scheduledFn, time);
		
	$(document).bind('mousemove scroll', function(){
		requests = 0;
		if (isActive) return;
		isActive = true;
		time = _.updateTime;
		clearTimeout(timer);
		scheduledFn();
	});
	
}

function isEmail(email) {
	var _ = /^[\w\-\.+]+@([\w\-]+\.)+\w{1,6}$/;
	return _.test(email);
}

function parseJSON(_){
	try {
		_ = eval('(' + _ + ')');
	} catch(e) {
		// alert(e); [e.message, e.name, e.stack]
		return false;
	}
	if (_.error) {
		alert(_.error);
		return false;
	} else if (_.message && !liveUpdate.initialized()) {
		displayMessage(_.message);			
	}
	return _;
}

function numWord(n, words) {
    if (n % 100 >= 5 && n % 100 <= 20) return n + ' ' + words[2];
    else if (n % 10 == 1) return n + ' ' + words[0];
    else if (n % 10 >= 2 && n % 10 < 5) return n + ' ' + words[1];
    else return n + ' ' + words[2];
}

function imageResize(){
	var maxWidth = 500,
		maxHeight = 309, // φ = 1.6180339887
		$this = $(this),
		width = $this.width(),
		height = $this.height();

//	if (width > height) {
	if (width > maxWidth) {
		var ratio = maxWidth / width;
		width = maxWidth;
		height = height * ratio;
	}
//} else {
	if (height > maxHeight){
		var ratio = maxHeight / height;
		height = maxHeight;
		width = width * ratio;
	}
	
	$this.css({
		'width': width,
		'height': height
	});
//	}
	
	$this.parent().removeClass('tvitLink-loading');
}