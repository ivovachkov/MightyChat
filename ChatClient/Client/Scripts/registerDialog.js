/// <reference path="jquery-ui-1.10.3.js" />
var register = (function () {
    function registerDialog() {
        var dialog = document.createElement("div");
        dialog.id = "registerDialog";
        dialog.title = "Register";
        dialog.style.visible = "hidden";

        var NameInput = document.createElement("input");
        NameInput.type = "text";
        NameInput.placeholder = "Username";
        NameInput.id = "registerName";

        var passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.placeholder = "password";
        passwordInput.id = "registerPassword";

        var passwordAgainInput = document.createElement("input");
        passwordAgainInput.type = "password";
        passwordAgainInput.placeholder = "password again";
        passwordAgainInput.id = "registerPasswordAgain";

        dialog.appendChild(NameInput);
        dialog.appendChild(passwordInput);
        dialog.appendChild(passwordAgainInput);

        $("body").append(dialog);
        $("#registerDialog").dialog({
            closeOnEscape: false,
            height: 350,
            width: 270,
            modal: true,
            close: function (event, ui) {
                $(this).dialog("destroy");
                $("#registerDialog").remove();
            },
            show: {
                effect: "clip",
                duration: 1000
            },
            buttons: {
                "Register": function () {
                    var name = $("#registerName").val();
                    var password = $("#registerPassword").val();
                    var passwordAgain = $("#registerPasswordAgain").val();
                    var error = false;

                    if (name === "") {
                        $("#registerName").addClass("ui-state-error");
                        error = true;
                    } else {
                        $("#registerName").removeClass("ui-state-error");
                    }

                    if (password === "" || password !== passwordAgain) {
                        $("#registerPassword").addClass("ui-state-error");
                        $("#registerPasswordAgain").addClass("ui-state-error");
                        error = true;
                    } else {
                        $("#registerPassword").removeClass("ui-state-error");
                        $("#registerPasswordAgain").removeClass("ui-state-error");
                    }

                    if (!error) {
                        var user = {
                            username: $('#registerName').val(),
                            password: $('#registerPassword').val()
                        }

                        controller.register(user);

                        $(this).dialog("close");
                    }
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    return {
        create: registerDialog
    }
})();
