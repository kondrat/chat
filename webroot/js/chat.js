soundManager.flashVersion = 9;
soundManager.url = '/swf/';
soundManager.useHighPerformance = true;
soundManager.useConsole = false;
soundManager.debugMode = false; // disable debug mode
soundManager.defaultOptions.multiShot = true;
soundManager.onload = function(){
	soundManager.createSound({id: 'connecting', url: '/mp3/contacts-online.mp3'});
	soundManager.createSound({id: 'disconnecting', url: '/mp3/contacts-offline.mp3'});
	soundManager.createSound({id: 'obtaining', url: '/mp3/message-inbound.mp3'});
	soundManager.createSound({id: 'sending', url: '/mp3/message-outbound.mp3'});
};

var chat_uid = null;
var chat_cid = null;
var chat_typing_time = null;
var chat_typing_status = false;
var chat_sound_on = false;
var chat_focus = true;
var chat_title_timer;
var chat_ping_send = null;
var chat_ping_receive = null;

/**
 * Возможные статусы:
 * disconnect, connect
 */
var chat_status = 'disconnect';

function status_set(text) {
	$("#chat_status").text(text);
}

function status_get() {
	return $("#chat_status").text();
}

/**
 * Пользователь получил Uid.
 * Запишем его
 */
function chat_set_uid(sid) {
	chat_uid = sid;
	chat_get_events();
}

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


/**
 * Long-polling соединение
 */
function chat_get_events(){
	$.ajax({
		type: "POST",
		url: "/events?"+chat_uid,
		async: true,
		cache: false,
		timeout:40000,
		dataType: "json",
		data: {"action": 'get'},
		success: function(data){
			setTimeout('chat_get_events()', 200)
			$("#online_counter").text(data.online)
			var chat_time = new Date()
			switch (data.action) {
				case 'new_message':
					$("#messages>ol").append('<li class="message'+(data.user=='im'?'To':'From')+'"><em class="name"><i>'+(data.user=='im'?'Я':'Некто')+'</i></em> <span class="message">'+data.message+'</span></li>')
					// скролл
					$(".logbox").animate({ scrollTop: $(".logbox").attr("scrollHeight") }, 'normal')
					if (chat_sound_on) soundManager.play(data.user=='im' ? 'obtaining' : 'sending')
					if (!chat_title_timer) chat_blink_title()
					chat_ping_receive = chat_time.getTime()
					break;
				case 'get_ready':
					chat_send_ready(chat_uid, data.cid)
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
						+ ' или <a href="/log?cid='+chat_cid+'&uid='+chat_uid+'" class="btn"><span><span>сохранить лог</span></span></a></p></div>'
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
			setTimeout('chat_get_events()', 2000)
		}
	})
}

function chat_new_opponent(cid) {
	if (chat_status == 'connect') return;
	$.post("/send", {"action": 'wait_new_opponent', "uid": chat_uid, "cid": cid});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

/**
 * Сообщает о том что пользователь uid
 * готов принять участие в чате cid
 */
function chat_send_ready(uid, cid) {
	$.post("/send", {"action": 'set_ready', "uid": uid, "cid": cid}, function(data){
		if (data == 'reconnect') {
			//alert('reconnect');
			setTimeout('chat_start()', 100);
		}
	});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

/**
 * Сообщить об ожидании оппонента
 */
function chat_wait_opponent() {
	status_set('Ожидание собеседника');
	$.post("/send", {"action": 'wait_opponent', "uid": chat_uid}, function(data){
		if (data == 'error uid') {
			chat_uid = null;
			setTimeout('chat_start()', 100);
		}
	});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

/**
 * Отправить сообщение
 */
function chat_send_message(message) {
	if (!chat_cid) {
		return false;
	}
	$.post("/send", {"action": 'send_message', "uid": chat_uid, "cid": chat_cid, "message": message});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
	return true;
}

/**
 * Нажатие кнопки "Начать чат"
 */
function chat_start() {
	$("#page").attr('id', 'chatPage');
	$("#body").attr('class', 'chatBody');
	//$("#body").css('position', 'relative');
	$("#chatbox,#sysChat,div.controlwrapper").show();
	$("#main,#footer").hide();
	$("#text").val('').focus();
	$("#messages").html('<ol></ol>');
	$("#text_send,#chat_close").attr('disabled', true);
	if (chat_uid) {
		chat_wait_opponent();
		return true;
	}
	status_set('Подключаемся к серверу');
	$.post(
		"/send",
		{"action": 'get_uid'},
		function(data){
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
 * Завершить чат
 */
function chat_stop(opponent_init) {
	if (!chat_cid) return true;
	$.post("/send", {"action": 'stop_chat', "uid": chat_uid, "cid": chat_cid, "opponent_init": opponent_init ? 1 : 0});
	var chat_time = new Date();
	chat_ping_send = chat_time.getTime();
}

$("#message_form").submit(function(){
	if (chat_send_message($("#text").val())) {
		$("#text").val('');
		$("#text").focus();
	}
	return false;
});

$("#chat_start").click(function(){
	chat_start();
	return false;
});
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
		$.post("/send", {"action": 'stop_typing', "uid": chat_uid, "cid": chat_cid});
		var chat_time = new Date();
		chat_ping_send = chat_time.getTime();
	}
}

$("#text").keypress(function(){
	if (chat_cid) {
		date = new Date();
		time = date.getTime();
		if (chat_typing_time + 1500 < time) {
			$.post("/send", {"action": 'start_typing', "uid": chat_uid, "cid": chat_cid});
			var chat_time = new Date();
			chat_ping_send = chat_time.getTime();
		}
		chat_typing_time = time;
		chat_typing_status = true;
		setTimeout('chat_typing_end()', 1600);
	}
});

$("#text").keypress(function(event){
	if (event.keyCode == 13) {
		$("#message_form").submit();
		return false;
	}
});

/**
 * Включить или отключить звук
 */
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

function test_ping_send() {
	if (!chat_cid) return;
	// больше 10 секунд
	var chat_time = new Date();
	if (chat_time.getTime() - chat_ping_send > 10000) {
		$.post("/send", {"action": 'ping', "uid": chat_uid, "cid": chat_cid});
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

$(document).ready(function(){
	var s = readCookie('sound');
	chat_switch_sound(!s || s == 'on', false);
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

