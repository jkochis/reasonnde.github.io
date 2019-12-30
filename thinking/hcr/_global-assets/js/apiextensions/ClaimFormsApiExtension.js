   
//  var claimsFormServiceUrl = "/webservices/claimformsservice.asmx/GetClaimForms";
$(document).ready(function () {
    $("p[id$='Disclaimer']").hide();
	var prevState = '';
    $("#submit").on("click touchstart", function (e) {
		var state = $('#lstState').find(":selected").text();
					
			if(state == "State" || prevState == state){
				state = $(this).parent().parent().find(".dropdown-title p").text();
				prevState = state;
			}
			
		claimSubmit(state);
    });
	$("#submit").on("keydown", function (event) {
		if(event.which == 13 || event.which == 32) {
			var state = $('#lstState').find(":selected").text();
			if(state == "State" || prevState == state){
				state = $(this).parent().parent().find(".dropdown-title p").text();
				prevState = state;
			}
			claimSubmit(state);
		}
    });
	
	$(".dropdown-box").on("keydown", function (event) {
		if(event.which == 13 || event.which == 32) {
			$(this).trigger("click");
			var _this = this;
			setTimeout(function(){ 
				var anchor = $(".w-dropdown-list-wrapper a");
				anchor.attr("role", "option"); 
				$('#lstState option').each(function(index) {
			//  console.log($(this).text())
						
				//		console.log(anchor[index]);
						if($(this).text() == $(anchor[index]).text()){
							$(anchor[index]).attr("aria-label", $(this).val());
						}		
				});
				 
				anchor.first().focus();
				anchor.on("keydown", function (event) {
					event.stopPropagation();
					if(event.which == 13 || event.which == 32) {							
							var state = $(this).text();
							//claimSubmit(state);
							$(_this).find(".dropdown-title p").html(state);
							$(_this).focus();
							anchor.off("keydown");
					}
				});
			}, 300);
		}
    });
	
	
	function claimSubmit (state){
      $("p[id$='Disclaimer']").hide();
		
      $("#submit_button").addClass('is_loading');
	  $('.list_wrapper').empty();				
      //var selState = $('#lstState option[selected="selected"]').text();
	//  var selState = $('#lstState').find(":selected").text();
      //var selStateName = $('#lstState option[selected="selected"]').val();
	  var selStateName = "";//$('#lstState').find(":selected").val();
      var selLanguage = $('#lstLanguage').val();	  
	//  if(selState == "State"){
		var  selState = state;
		  $('#lstState option').each(function() {
			//  console.log($(this).text())
						if($(this).text() == selState){
							selStateName = $(this).val();
						}		
		  });
	//  }
      //console.log("state:"+selState+"; language:"+selLanguage);
     // console.log('data:'+'{ "state": '+JSON.stringify(selState)+', "language": '+JSON.stringify(selLanguage)+'}');
		//if()
	 
	 
	if (window.utag) {
		utag.link({
			_ga_category: 'site diagnostics',
			_ga_action: 'submit',
			_ga_label: 'claim form lookup'
			}); 
		}	
        $.ajax({
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            url: '/api/genericservice/ClaimForms?State='+selState+'&Language='+selLanguage,
			tryCount : 0,
			retryLimit : 2,
       //     data: '{ "state": '+JSON.stringify(selState)+', "language": '+JSON.stringify(selLanguage)+'}',
            dataFilter: function (resp) {
                var msg = eval('(' + resp + ')');
                if (msg.d && msg.d != null)
                    return JSON.stringify(msg.d);
                else
                    return resp;
            },
            success: function (response) {
                if (!response.HasError) {
                    if (selStateName != '') {
                        $("#stateImage").attr('class', '');
                        $("#stateImage").addClass('img' + selState);
                        var ilVal = "#" + selState + "Disclaimer";
                        $(ilVal).show();
                    }
                    $('#lblState').empty();
                    $('#lblState').html(selStateName);
                   
                    $.each(response.Data, function (index, element) {
                        var forms_lnkDescription = "form" + index + "_lnkDescription";
                        $('.list_wrapper').append($('<li class="claim_form"><span class="leftclaiminfo"><a id=' + '"' + forms_lnkDescription + '"' + ' title="' + element.title + '" target="_blank" href="' + element.location + '">' + element.title + '</a></span></li>'));
					//	$("#form0_lnkDescription").focus();
                    });
                }
                else {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						if(response.Status == 400){
							
						}
						//try again
						$.ajax(this);
						return;
					} 
					else { 
						if(response.Status == 400){
							//$('.list_wrapper').append($('<h2><span>We\'re sorry. There was a problem with your request. Please refresh the page and try again...</span></h2>'));
						}
						$('.list_wrapper').append($('<h2><span>We\'re sorry. There was a problem with your request... (no data)</span></h2>'));
						
						if (window.utag) {
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'claim form lookup error: api',_ga_label: 'status code: ' + response.Status }); 
							utag.link({_ga_category: 'site diagnostics',_ga_action: 'data: claim form lookup',_ga_label: ''+selState+ ': status code: ' + response.Status }); 
						}
						
					//	$(".dropdown-box.has-selection").focus();
					}
                }
				//insert here
				$("#submit_button").removeClass('is_loading');
				$('html, body').animate({ scrollTop: $('#dload-form').offset().top - 98}, 800);	
            },
            error: function (xhr, textStatus, errorThrown) {
				this.tryCount++;
				if (this.tryCount <= this.retryLimit) {
					//try again
					$.ajax(this);
					return;
				} 
				else {  
					$('.list_wrapper').append($('<h2><span>We\'re sorry. There was a problem with your request... (error)</span></h2>'));
					
					if (window.utag) {
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'claim form lookup error: web server',_ga_label: 'status code: ' + xhr.status }); 
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'data: claim form lookup',_ga_label: selState+ ': status code: ' + xhr.status }); 
					}
					$('html, body').animate({ scrollTop: $('#dload-form').offset().top - 98}, 800);
					//$(".dropdown-box.has-selection").focus();
				}	
            }
        });
	}
	
    
});