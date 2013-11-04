/// <reference path="jquery-2.0.3.js" />
/// <reference path="persisters.js" />
var controllers = (function () {
    var updateTimer = null;

    var rootUrl = "http://chat-29.apphb.com/api/";
    var Controller = Class.create({
        init: function () {
            this.persister = persisters.get(rootUrl);
        },
        login: function () {
            var userData = {
                username: $('#username').val(),
                password: $('#password').val()
            }
            var self = this;
            this.persister.user.login(userData, function (data) {
                var user = data;
                self.persister.user.getall(
                    function (data) {
                        if (data) {
                            var html = "";
                            for (var i = 0; i < data.length; i++) {
                                users[data[i]["Id"]] = data[i]["UserName"];
                                var status = data[i]["IsOnline"] ? "online" : "offline";
                                html += '<li id="' + data[i]["Id"] + '" data-id="' + data[i]["Id"] + '" data-status="' + status + '">' + data[i]["UserName"] + '</li>';
                            }

                            $('#contactUsers').append(html);

                            if (user.UnreceivedMessages) {
                                for (var i = 0; i < user.UnreceivedMessages.length; i++) {
                                    var message = users[user.UnreceivedMessages[i]["SenderId"]] + ": " +
                                        user.UnreceivedMessages[i]["Content"];
                                    if (user.UnreceivedMessages[i]["FileName"]) {
                                        message += ' Attachment: <a href="' + user.UnreceivedMessages[i]["FileUrl"] +
                                            '">' + user.UnreceivedMessages[i]["FileName"] + '</a>'
                                    }
                                    $('#messageWindow').append(message + "<br />");
                                }
                            }
                        }
                    }
                    );
                $('#login').html('<button id="logoutBtn" onclick="controller.logout();" class="ui-widget button">Logout</button>');
                $('#logoutBtn').button()
                .click(function (event) {
                    event.preventDefault();
                });

                var statusMsg = {
                    senderid: localStorage.getItem('id'),
                    status: "online",
                    content: localStorage.getItem('username')
                };

                pubnub.publish({
                    channel: "mighty_chat",
                    message: JSON.stringify(statusMsg)
                });

            }, function () {
                $('#username').addClass("ui-state-error");
                $('#password').addClass("ui-state-error");
            });
        },
        logout: function () {
            var logoutUser = {
                id: localStorage.getItem('id'),
                username: localStorage.getItem('username')
            }
            this.persister.user.logout(logoutUser, function () {
                $('#messageWindow').html('');
                $('#contactUsers').html('');
                $('#login').html('<input type="text" id="username" placeholder="Username"/>\
                <input type="password" id="password" placeholder="Password"/>\
                <button id="loginBtn" onclick="controller.login();" class="ui-widget button">Login</button>\
                <div><a href="#" onclick="register.create();">Click to register</a></div>');
                $('#loginBtn').button()
                .click(function (event) {
                    event.preventDefault();
                });
            });

            var statusMsg = {
                senderid: localStorage.getItem('id'),
                status: "offline"
            };

            pubnub.publish({
                channel: "mighty_chat",
                message: JSON.stringify(statusMsg)
            });
        },
        sendMessage: function () {
            var msg = {
                senderid: localStorage.getItem("id"),
                receiverid: localStorage.getItem("receiverId"),
                content: $('#messageToSend').val()
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;"),
                filename: $('#fileName').val(),
                fileurl: $('#fileUrl').val(),
                status: undefined
            };

            if ($('#' + localStorage.getItem('receiverId')).data('status') == 'online') {
                pubnub.publish({
                    channel: "mighty_chat",
                    message: JSON.stringify(msg)
                });
            }
            else {
                this.persister.user.sendMessage(msg, function () {
                    var msgString = users[msg.senderid] + ": " + msg.content;

                    if (msg.filename) {
                        msgString += " Attachment: <a href='" + msg.fileurl + "'>" + msg.filename + "</a>";
                    }

                    $('#messageWindow').append("<p>" + msgString + "</p>");
                });
            }

            $("#fileField").html('');
            $('#fileName').val('');
            $('#fileUrl').val('');
            $('#messageToSend').val('');
            $('#file').removeAttr('disabled');
        },
        receiveMessage: function (message) {
            var currMsg = JSON.parse(message);
            var currUserId = localStorage.getItem("id");

            if ((currUserId == currMsg.receiverid ||
                currUserId == currMsg.senderid) &&
                !currMsg.status) {
                var msgString = users[currMsg.senderid] + ": " + currMsg.content;

                if (currMsg.filename)
                {
                    msgString += " Attachment: <a href='" + currMsg.fileurl + "'>" + currMsg.filename + "</a>";
                }

                $('#messageWindow').append("<p>"+ msgString +"</p>");
            }

            if (currMsg.status == "online") {
                if (!users[currMsg.senderid]) {
                    users[currMsg.senderid] = currMsg.content;
                }

                if (localStorage.getItem("id") &&
                    currMsg.senderid != localStorage.getItem("id") && $('#' + currMsg.senderid).length == 0) {
                    var html = '<li id="' + currMsg.senderid + '" data-id="' +
                        currMsg.senderid + '" data-status="online">' +
                        currMsg.content + '</li>';
                    $('#contactUsers').append(html);
                }
            }

            if (currMsg.status) {
                $('#' + currMsg.senderid).attr('data-status', currMsg.status);
            }

            console.log(currMsg);
        },
        register: function (userData) {
            var self = this;
            this.persister.user.login(userData, function (data) {
                self.persister.user.getall(
                    function (data) {
                        if (data) {
                            var html = "";
                            for (var i = 0; i < data.length; i++) {
                                users[data[i]["Id"]] = data[i]["UserName"];
                                var status = data[i]["IsOnline"] ? "online" : "offline";
                                html += '<li id="' + data[i]["Id"] + '" data-id="' + data[i]["Id"] + '" data-status="' + status + '">' + data[i]["UserName"] + '</li>';
                            }

                            $('#contactUsers').append(html);
                        }
                    }
                    );

                $('#login').html('<button id="logoutBtn" onclick="controller.logout();" class="ui-widget button">Logout</button>');
                $('#logoutBtn').button()
                .click(function (event) {
                    event.preventDefault();
                });

                var statusMsg = {
                    senderid: localStorage.getItem('id'),
                    status: "online",
                    content: localStorage.getItem('username')
                };

                pubnub.publish({
                    channel: "mighty_chat",
                    message: JSON.stringify(statusMsg)
                });

            }, function () {
                
            });
        },
    });

    return {
        get: function () {
            return new Controller();
        }
    }
})();

var controller = controllers.get();
var users = {};