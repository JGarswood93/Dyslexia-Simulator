"use strict";

$(document).ready(function()
{
    // defualt settings
    var pluginState_val;
    var intervalValue_val;
    var chanceOfModification_val;

    $("#options_form").submit(function (event)
    {
        // reassign vars in case of changes
        pluginState_val = $('#pluginState').is(':checked');
        intervalValue_val = $('#intervalValue').val();
        chanceOfModification_val = $('#chanceOfModification').val();

        var intervalValue_flag = false, chanceOfModification_flag = false;

        if (intervalValue_val <= 0 || !$.isNumeric(intervalValue_val))
        {
            intervalValue_flag = true;
        }
        if (chanceOfModification_val < 0  || chanceOfModification_val > 100 || !$.isNumeric(chanceOfModification_val))
        {
            chanceOfModification_flag = true;
        }

        processFlags(intervalValue_flag, chanceOfModification_flag);

        event.preventDefault();
    });


    function processFlags(intervalValue_flag, chanceOfModification_flag)
    {
        var intervalValue_msg = "The value for <u>Interval Value</u> must be equal or greater than 1.";
        var chanceOfModification_msg = "The value for <u>Chance of Modification</u> must be between 0 to 100.";

        var form_error_ul = $('.form-error ul');
        form_error_ul.empty(); // empty errors before adding again.

        if (intervalValue_flag)
        {
            form_error_ul.append('<li class="intervalValue_msg">' + intervalValue_msg +'</li>');
        }
        else
        {
            form_error_ul.remove('.intervalValue_msg');
        }

        if (chanceOfModification_flag)
        {
            form_error_ul.append('<li class="chanceOfModification_msg">' + chanceOfModification_msg +'</li>');
        }
        else
        {
            form_error_ul.remove('.chanceOfModification_msg');
        }

        //special check if the form is complete
        if(!intervalValue_flag && !chanceOfModification_flag)
        {
            $('.form-response').text('Saved your changes!').stop()
                .fadeIn(1000, function() {
                    $(this).fadeOut(1000);
            });

            // everything is good to save
            saveSettings();
        }

    }

    function saveSettings()
    {
        chrome.storage.sync.set({ "pluginState_val": pluginState_val}, function(){
            console.log("saved plugin state: ", pluginState_val)
        });
        chrome.storage.sync.set({ "intervalValue_val": intervalValue_val}, function(){
            console.log("saved interval value: ", intervalValue_val)
        });
        chrome.storage.sync.set({ "chanceOfModification_val": chanceOfModification_val}, function(){
            console.log("saved chance of mod: ", chanceOfModification_val)
        });
    }

    function loadSettings(callback)
    {
        // pass in a dict with default values for each key if its empty
        var params = {"pluginState_val":false, "intervalValue_val":20, "chanceOfModification_val":10};

        chrome.storage.sync.get(params, function (data) {
            //update vars
            pluginState_val = data.pluginState_val;
            intervalValue_val = data.intervalValue_val;
            chanceOfModification_val = data.chanceOfModification_val;

            //update UI
            $('#pluginState').prop("checked", pluginState_val);
            $('#intervalValue').val(intervalValue_val);
            $('#chanceOfModification').val(chanceOfModification_val);
        });


        // our callback function
        if (callback && typeof(callback)=== "function")
            callback();
    }


    //on-ready
    loadSettings();

});
