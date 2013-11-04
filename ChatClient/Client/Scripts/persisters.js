/// <reference path="http-requester.js" />
/// <reference path="class.js" />
/// <reference path="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha1.js" />
var persisters = (function () {
    var nickname = localStorage.getItem("username");
    var userId = localStorage.getItem("id");
    function saveUserData(userData) {
        localStorage.setItem("username", userData["UserName"]);
        localStorage.setItem("id", userData["Id"]);
        nickname = userData.username;
        userId = userData.id;
    }
    function clearUserData() {
        localStorage.removeItem("username");
        localStorage.removeItem("id");
        nickname = "";
        userId = "";
    }

    var MainPersister = Class.create({
        init: function (rootUrl) {
            this.rootUrl = rootUrl;
            this.user = new UserPersister(this.rootUrl);
        },
        isUserLoggedIn: function () {
            var isLoggedIn = nickname != null && id != null;
            return isLoggedIn;
        },
        nickname: function () {
            return nickname;
        }
    });
    var UserPersister = Class.create({
        init: function (rootUrl) {
            //...api/user/
            this.rootUrl = rootUrl + "users";
        },
        login: function (usr, success, error) {
            var url = this.rootUrl;
            var userData = {
                username: usr.username,
                password: CryptoJS.SHA1(usr.username + usr.password).toString()
            };

            httpRequester.postJSON(url, userData,
				function (data) {
				    saveUserData(data);
				    success(data);
				}, error);
        },
        register: function (user, success, error) {
            var url = this.rootUrl;
            var userData = {
                username: user.username,
                password: CryptoJS.SHA1(user.username + user.password).toString()
            };
            httpRequester.postJSON(url, userData,
				function (data) {
				    saveUserData(data);
				    success(data);
				}, error);
        },
        logout: function (user, success, error) {
            var url = this.rootUrl;
            httpRequester.putJSON(url, user,
				function (data) {
				    clearUserData();
				    success(data);
				}, error);
        },
        getall: function (success, error) {
            var url = this.rootUrl;
            httpRequester.getJSON(url,
				function (data) {
				    success(data);
				}, error);
        },
        sendMessage: function (message, success, error) {
            var url = 'http://chat-29.apphb.com/api/message';

            httpRequester.postJSON(url, message,
				function (data) {
				    success(data);
				}, error);
        }
    });

    return {
        get: function (url) {
            return new MainPersister(url);
        }
    }
})();