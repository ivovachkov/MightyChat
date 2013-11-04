/// <reference path="jquery-2.0.3.js" />
$.ready(
    (function() {
        $(function () {
            $("input[type=submit], button")
            .button()
            .click(function (event) {
                event.preventDefault();
            });
        })

        $(function(){
            $('#file').click(function(e){
                e.preventDefault();
                $('#fileupload').click();}
            );
        })

        $(function () {
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function (e, data) {
                    var attachment = "Attached file: " + data.originalFiles[0]["name"];
                    $('#fileName').val(data.originalFiles[0]["name"]);
                    $('#fileUrl').val(data.result[0]);
                    $('#fileField').html(attachment);
                },
                url: "http://chat-29.apphb.com/api/Dropbox"
            });
        });

        $("#contactUsers").on("click", "li", function (event) {
            localStorage.setItem("receiverId", $(this).data("id"));
            $(this).siblings('.selected').removeClass('selected');
            $(this).addClass("selected");
        });

        // Initialize the PubNub API connection.
        pubnub = PUBNUB.init({
            publish_key: 'pub-c-a4189838-8f71-4dde-bfed-62b8b0de2e50',
            subscribe_key: 'sub-c-9af1c04e-05c0-11e3-991c-02ee2ddab7fe'
        });

        pubnub.subscribe({
            channel: "mighty_chat",
            message: function (m) {
                controller.receiveMessage(m);
            }
        });
    })()
);

var pubnub;