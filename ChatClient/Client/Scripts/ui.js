/// <reference path="jquery-2.0.3.js" />
var ui = (function () {
    function uploadFile() {
        $('#file').attr('disabled', 'disabled');
    }

    function loginUser() {
       // var url = 'http://chat-29.apphb.com/api/users';
        var user = {
            username : $('#username').val(),
            password : $('#password').val()
        }

        controller.login(user);
    }

    return {
        uploadFile: uploadFile,
        loginUser: loginUser
    }
})();