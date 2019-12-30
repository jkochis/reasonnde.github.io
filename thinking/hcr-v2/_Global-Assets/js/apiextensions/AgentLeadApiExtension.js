var agentLeadsServiceUrl = "/webservices/agentleadsservice.asmx/PostAgentLead";
 function AgentLeadApiExtension (){
 
/*
     var prefix = $('#').val();
     var firstName = $('#firstname').val();
     var lastName = $('#lastname').val();
     var address1 = $('#addressline1').val();
     var address2 = $('#addressline2').val();
     var city = $('#').val();
     var state = $('#lstState').val();
     var zip = $('#zipcode').val();
     var phone = $('#phone').val();
     var email = $('#email').val();
     var source = $('#').val();
     var writingNumber = $('#').val();
     var ageVerified = $('#checkbox').val();
     var additionalSource = $('#').val();
     var enableInternetSource = $('#').val();
     var internetSource = $('#').val();
     var externalResult = $('#').val();
     var partnetID = $('#').val();
     var subscriberID = $('#').val();
     $('spanish')
     var languages = $('#').val();
    */
     this.POSTAgentLead = function(postData) {
         $.ajax({
             async: false,
             type: 'POST',
             dataType: 'json',
             contentType: 'application/json ',
             url: agentLeadsServiceUrl,
             data: '{ "agentLead": '+JSON.stringify(postData)+' }',
             dataFilter: function (resp) {
                 var msg = eval('(' + resp + ')');
                 if (msg.d && msg.d != null)
                     return JSON.stringify(msg.d);
                 else
                     return resp;
             },
             success: function (response) {
                 if (!response.HasError) {
                     //Display "thank you" message
                 }
                 else {
                     $('.complete-panel').empty();
                     $('.complete-panel').append($('<h2><span>We\'re sorry. There was a problem with your request...</span></h2>'));
                 }
             },
             error: function (err) {
                 $('.complete-panel').empty();
                 $('.complete-panel').append($('<h2><span>We\'re sorry. There was a problem with your request...</span></h2>'));
             }
         });
     }
 }