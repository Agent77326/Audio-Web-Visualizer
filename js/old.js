var msgList = [];
var doneInit = false
var errList = [];

function setStatus(msg){
	msgList.push(msg);
}

$("loadingStatus").html("Hello Browser");

function loadingCheck(){
	$("loadingStatus").html(msgList[0]);
	console.log(msgList[0]);
	msgList.shift();
	doneInit = true;
}

var syncServer = new Worker("/cdn/js/syncServer.js");
syncServer.addEventListener("message", function(e){
	e = e.data;
	console.log(e);
	switch(e.type){
	case "status":
		setStatus(e.data);
		break;
	case "login":
		if(e.status=="fail"){
			errList.push(e.message);
			showLogin();
		}
		break;
	default:
		setStatus("Unknown case requested from server worker: " + e.type);
		break;
	}
}, false);

var statusCheck;

function localStorageTest(){
	var testKey = 'test', storage = window.localStorage;
	try{
		storage.setItem(testKey, '1');
		if(!storage.exist("test")){
			return false;
		}
		storage.removeItem(testKey);
		return true;
	}catch(error){
		return false;
	}
}

function showLogin(){
	window.clearInterval(statusCheck);
	console.log("Clearing Status and loading");
	setTimeout(function(){
		$("#loading").hide();
		console.log("Showing login-modal");
		var errors = "";
		if(errList.length > 0){
			for(var i = errList.length - 1; 0 <= i; i--){
			  errors += '<div class="alert alert-danger"><strong>Failed</strong> ' + errList[i] + '</div>';
			  errList.splice(-1,1);
			}
		}
		HTML.modal.show({
			header: 'Login',
			body: '<form id="loginForm">' + errors + '<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span><input id="username" type="text" class="form-control" name="username" placeholder="Username" autofocus required></div><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span><input id="password" type="password" class="form-control" name="password" placeholder="Password" required></div></form>',
			footer: '<button id="loginButton" type="button" form="loginForm" class="btn btn-default">Enter</button>'
		},{
			keyboard: false,
			backdrop: "static",
			events: {
				"hide.bs.modal": function(){
					
				}
			}
		});
		$("#loginButton").click(login);
	}, 300);
}

function login(){
	if($("#username").val() != "" && $("#password").val() != ""){
		console.log("Hiding login-modal");
		$("#modal").modal("hide");
		server.post("?login", storage.read("clientID") + ":" + $("#username").val() + ":" + $("#password").val(), function(e){
			
		});
	}
}

window.onload = function(){
	statusCheck = setInterval(loadingCheck, 200);
	setStatus("Hello Browser");
	setStatus("Beginning with checks");
	setStatus("JS enabled:\tOK");
	if(typeof(Storage) === "undefined" || !localStorageTest()){
		setStatus("Local storage:\tFAIL");
		setStatus("ERROR: required function missing -> abort script")
		setStatus("Your Browser does not support local storage.<br>To view this site please enable local storage support.");
		return;
	}
	setStatus("Local storage:\tOK");
	if(!window.Worker){
		setStatus("Web Worker:\tFAIL");
		setStatus("ERROR: required function missing -> abort script")
		setStatus("Your Browser does not support Web Worker.<br>To view this site please enable Web Worker support.");
		return;
	}
	setStatus("Web Worker:\tOK");
	if(!storage.exist("clientID")){
		setStatus("ClientID:\tnot found");
		storage.write("clientID", utils.randString(64));
		setStatus("ClientID generated:\t" + storage.read("clientID"));
	}
	setStatus("Done with checkup");
}