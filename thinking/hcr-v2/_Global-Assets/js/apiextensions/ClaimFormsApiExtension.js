$(document).ready(function () {
    $("p[id$='Disclaimer']").hide();
    $("#submit").click(function (e) {
        $("p[id$='Disclaimer']").hide();
		
      $("#submit_button").addClass('is_loading');
	  
      var selState = $('#lstState option:selected').text();
      var selStateName = $('#lstState').val();
      var selLanguage = $('#lstLanguage').val();
      
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: '/api/genericservice/ClaimForms?State='+selState+'&Language='+selLanguage,
            dataFilter: function (resp) {
                var msg = eval('(' + resp + ')');
                if (msg.d && msg.d != null)
                    return JSON.stringify(msg.d);
                else
                    return resp;
            },
            success: function (response) {
                if (!response.HasError) {
                    if ($("#lstState").val() != '') {
                        $("#stateImage").attr('class', '');
                        $("#stateImage").addClass('img' + selState);
                        var ilVal = "#" + selState + "Disclaimer";
                        $(ilVal).show();
                    }
                  
                    $('#lblState').empty();
                    $('#lblState').html(selStateName);
                  
                    $('.list_wrapper').empty();
                    $.each(response.Data, function (index, element) {
                        var forms_lnkDescription = "form" + index + "_lnkDescription";
                        $('.list_wrapper').append($('<li class="claim_form"><span class="leftclaiminfo"><a id=' + '"' + forms_lnkDescription + '"' + ' title="' + element.title + '" target="_blank" href="' + element.location + '">' + element.title + '</a></span></li>'));
                    });
                }
                else {
                    $('.list_wrapper').empty();
                    $('.list_wrapper').append($('<h2><span>We\'re sorry. There was a problem with your request...</span></h2>'));
                }
				//insert here
				$("#submit_button").removeClass('is_loading');
				$('html, body').animate({ scrollTop: $('#dload-form').offset().top - 98}, 800);
				
            },
            error: function (err) {
                $('.list_wrapper').empty();
                $('.list_wrapper').append($('<h2><span>We\'re sorry. There was a problem with your request...</span></h2>'));
            }
        });
    });
$("#lstState").Selectyze({
            theme: 'mac',
            effectClose: 'fade',	
        });
});