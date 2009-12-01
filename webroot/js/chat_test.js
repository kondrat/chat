
var chatUid = null;
var chat_cid = null;
var chat_typing_time = null;
var chat_typing_status = false;
var chat_sound_on = false;
var chat_focus = true;
var chat_title_timer;
var chat_ping_send = null;
var chat_ping_receive = null;

var chat_original_title = null;
/**
 * Возможные статусы:
 * disconnect, connect
 */
var chat_status = 'disconnect';
//--------------------------------------------------------------------

$(document).ready(function(){
	$("#startChat").click(function(){
		chat_start();	
		return false;
	});
});
/**
 * Press button "Start chat"
 */
function chat_start() {

	$("#messages").html('<ol></ol>');
	$("#text_send,#chat_close").attr('disabled', true);
	if (chatUid) {
		chat_wait_opponent();
		return true;
	}
	status_set('<span style="color:darkBlue;">Подключаемся к серверу</style>');
	$.post(
		"./messages/send",
		{"data[action]": 'get_uid'},
		function(data){
			//console.log(data);
			if (data.result == 'ok') {
				chat_set_uid(data.uid);
				chat_wait_opponent();
			}
		},
		"json"
	);
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

/**
 * Uid assigned to user.
 */
function chat_set_uid(sid) {
	chatUid = sid;
	//chatUid = 'w';
	//alert(chatUid);
	chat_get_events();
}



/**
 * Сообщить об ожидании оппонента
 */
function chat_wait_opponent() {
	status_set('<span style="color:darkOrchid;">Ожидание собеседника</span>');
	$.post(
		"./messages/send", 
		{"data[action]": 'wait_opponent', "uid": chatUid}, 
		function(data){
			if (data == 'error uid') {
				chatUid = null;
				setTimeout('chat_start()', 100);
			}
		});
	var chat_time = new Date();
	//flag time
	chat_ping_send = chat_time.getTime();
}
//------------------------------------
/**
 * Send message
 */
$(document).ready(function(){
	$("#MessageAddForm").submit(function(){
		//alert( $("#MessageBody").val()  );
		if ( chat_send_message( $("#MessageBody").val() ) ) {
			$("#MessageBody").val('');
			$("#MessageBody").focus();
		}
		return false;
	});
});

function chat_send_message(message) {
	//alert('hiu :'+message);
	if (!chat_cid) {
		alert('ups');
		return false;
	} else {
		alert(message);
	}
	$.post("/send", {"action": 'send_message', "uid": chatUid, "cid": chat_cid, "message": message});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
	return true;
}

//-----------------------------------
function chat_blink_title() {
	if (chat_focus) return;
	document.title = document.title == '***** '+chat_original_title ? '_____ '+chat_original_title : '***** '+chat_original_title;
	chat_title_timer = setTimeout(chat_blink_title, 500);
}

$(document).focus(function(){
	clearTimeout(chat_title_timer);
	document.title = chat_original_title;
	chat_focus = true;
});
$(document).blur(function(){
	chat_focus = false;
});

//----------------------------------------------------------------
/**
 * Long-polling connection
 */
function chat_get_events(){
	//alert('event');
	$.ajax({
		type: "POST",
		url: "http://chat/messages/event/"+chatUid,
		async: true,
		cache: false,
		timeout:40000,
		dataType: "json",
		data: {"action": 'get'},
		success: function(data){
			//console.log(data);
			setTimeout('chat_get_events()', 500)
			$("#online_counter").text(data.online)
			var chat_time = new Date()
			switch (data.action) {
				case 'new_message':
					$("#messages>ol").append('<li class="message'+(data.user=='im'?'To':'From')+'"><em class="name"><i>'+(data.user=='im'?'Я':'Некто')+'</i></em> <span class="message">'+data.message+'</span></li>')
					// scroll
					//$(".logbox").animate({ scrollTop: $(".logbox").attr("scrollHeight") }, 'normal')
					//if (chat_sound_on) soundManager.play(data.user=='im' ? 'obtaining' : 'sending')
					//if (!chat_title_timer) chat_blink_title()
					chat_ping_receive = chat_time.getTime()
					break;
				case 'get_ready':
					chat_send_ready(chatUid, data.cid)
					// происходит проверка, подтвердился ли оппонент
					// если нет, то запрашиваем другого
					setTimeout('chat_new_opponent("'+data.cid+'")', 3500)
					chat_ping_receive = chat_time.getTime()
					break
				case 'start_chat':
					chat_status = 'connect'
					status_set('Чат начат. Поздоровайтесь с собеседником!')
					chat_cid = data.cid;
					$("#text_send,#chat_close").attr('disabled', false)
					if (chat_sound_on) soundManager.play('connecting')
					chat_ping_receive = chat_time.getTime()
					break
				case 'stop_chat':
					// на стоп уже жали
					if (!chat_cid) break
					chat_status = 'disconnect'
					status_set('')
					$("#messages>ol").append(
						'<div class="disconnected"><p>'
						+ (data.user == 'im' ? 'Вы окончили беседу.' : 'Ваш собеседник прервал беседу.')
						+ ' <a href="/" onclick="javascript:$(\'#chat_start\').click();return false;" class="btn"><span><span>Начать новую</span></span></a>'
						+ ' или <a href="/log?cid='+chat_cid+'&uid='+chatUid+'" class="btn"><span><span>сохранить лог</span></span></a></p></div>'
					)
					chat_cid = null
					$("#text_send,#chat_close").attr('disabled', true)
					$(".logbox").animate({ scrollTop: $(".logbox").attr("scrollHeight") }, 'normal')
					if (chat_sound_on) soundManager.play('disconnecting')
					chat_ping_receive = chat_time.getTime()
					break
				case 'start_typing':
					status_set('Собеседник печатает...')
					chat_ping_receive = chat_time.getTime()
					break
				case 'stop_typing':
					status_set('Собеседник прекратил печать')
					setTimeout('if (status_get() == "Собеседник прекратил печать") status_set("")', 1500)
					chat_ping_receive = chat_time.getTime()
					break
				case 'ping':
					chat_ping_receive = chat_time.getTime()
					break
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			//console.log('blinnn');
			setTimeout('chat_get_events()', 2000)
		}
	})
}
//-----------------------------------------------------------------------
function chat_new_opponent(cid) {
	if (chat_status == 'connect') return;
	$.post("./messages/send", {"action": 'wait_new_opponent', "uid": chatUid, "cid": cid});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

/**
 * Сообщает о том что пользователь uid
 * готов принять участие в чате cid
 */
function chat_send_ready(uid, cid) {
	$.post(
		"./messages/send", 
		{"action": 'set_ready', "uid": uid, "cid": cid},
		function(data){
			if (data == 'reconnect') {
				//alert('reconnect');
				setTimeout('chat_start()', 100);
			}
		}
	);
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}






/**
 * Завершить чат
 */
function chat_stop(opponent_init) {
	if (!chat_cid) return true;
	$.post("/send", {"action": 'stop_chat', "uid": chatUid, "cid": chat_cid, "opponent_init": opponent_init ? 1 : 0});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}




$("#chat_close").click(function(){
	if (chat_cid && confirm("Уверены, что хотите закончить чат?")) {
		chat_stop();
	}
	return false;
});

function chat_typing_end() {
	if (!chat_typing_status) return;
	date = new Date();
	time = date.getTime();
	if (chat_typing_time + 1500 < time) {
		chat_typing_status = false;
		$.post("/send", {"action": 'stop_typing', "uid": chatUid, "cid": chat_cid});
		var chat_time = new Date();
		chat_ping_send = chat_time.getTime();
	}
}

$("#MessageBody").keypress(function(){
	if (chat_cid) {
		date = new Date();
		time = date.getTime();
		if (chat_typing_time + 1500 < time) {
			$.post("/send", {"action": 'start_typing', "uid": chatUid, "cid": chat_cid});
			var chat_time = new Date();
			chat_ping_send = chat_time.getTime();
		}
		chat_typing_time = time;
		chat_typing_status = true;
		setTimeout('chat_typing_end()', 1600);
	}
});

$("#MessageBody").keypress(function(event){
	if (event.keyCode == 13) {
		$("#message_form").submit();
		return false;
	}
});


function test_ping_send() {
	if (!chat_cid) return;
	// больше 10 секунд
	var chat_time = new Date();
	if (chat_time.getTime() - chat_ping_send > 10000) {
		$.post("/send", {"action": 'ping', "uid": chatUid, "cid": chat_cid});
		chat_ping_send = chat_time.getTime();
	}
}

function test_ping_receive() {
	if (!chat_cid) return;
	// прошло более 31 секунды с последних данных от оппонента
	var chat_time = new Date();
	if (chat_time.getTime() - chat_ping_receive > 31000) {
		// временно не будем прерывать чат по таймауту
		//chat_stop(true);
	}
}

/**
 * status output
 *
 */
function status_set(text) {
	$("#chatStatus").html(text);
}
function status_get() {
	return $("#chatStatus").text();
}

$(document).ready(function(){
	/*
	var s = readCookie('sound');
	chat_switch_sound(!s || s == 'on', false);
	*/
	setInterval('test_ping_send()', 1000);
	setInterval('test_ping_receive()', 1000);
});

window.onunload = function () {
	if (chat_cid) chat_stop(false);
};
window.onbeforeunload = function () {
	if (chat_cid) {
		return "Точно хотите уйти?";
	} else {
		return;
	}
};

/**
 * Включить или отключить звук
 */
/*
function chat_switch_sound(status, set_cookie) {
	if (status) {
		$("#sound_switcher").attr('class', 'soundOff');
		$("#sound_switcher>a").text('Откл. звук');
		chat_sound_on = true;
		if (set_cookie) createCookie('sound', 'on', 90);
	} else {
		$("#sound_switcher").attr('class', 'soundOn');
		$("#sound_switcher>a").text('Вкл. звук');
		chat_sound_on = false;
		if (set_cookie) createCookie('sound', 'off', 90);
	}
}

$("#sound_switcher").click(function(){
	chat_switch_sound($(this).attr('class') == 'soundOn', true);
	return false;
});
*/
