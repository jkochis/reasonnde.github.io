define([
      'tools/agent_locator/core/constants',
      'tools/agent_locator/spinnerController',
      'tools/agent_locator/core/eventBus',
      'tools/agent_locator/api/apiCaller',
      'tools/agent_locator/core/dataHandler'
],
  function (constants, spinner, eventBus, apiCaller, dataHandler) {
      var zipCodeIsValid = true,
          $zipCodeForm,
          $zipTtooltip,
          $allZipCodeInputs;
      function onFormSubmit(e) {
          e.preventDefault();
          var $zipCode = $(this).find('.js-zipcodeInput'),
              zipCodeVal = $zipCode.val();
          // always use 31909 as zipcode when data is faked
          if (apiCaller.getIsFaked()) {
              zipCodeVal = 10012;
          }
          zipCodeIsValid = validateZipCode(zipCodeVal);
          if (zipCodeIsValid) {
              spinner.startSpinning();
              $zipCodeForm.removeClass('is-invalid');
              dataHandler.setZip(zipCodeVal, function (response) {
                  eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_LIST);
                  spinner.stopSpinning();
              }, function () {
                  spinner.stopSpinning();
                  //zipCodeIsValid = false;
                  //$zipCodeForm.addClass('is-invalid');
                  eventBus.bus.trigger(eventBus.events.VIEW_REQUESTED, constants.VIEW_STATE_LIST);
                  $('.aal-list-noResults').addClass('is-visible');
              });
          } else {
              $zipCodeForm.addClass('is-invalid');
          }
      }
      function validateZipCode(zipcode) {
          // only test if zipcode is exactly 5 digits
          var r = new RegExp("^\\d{5}");
          return r.test(zipcode);
      }
      function onDataZipUpdated(e, zipCode) {
          $allZipCodeInputs.val(zipCode);
      }
      return {
          setup: function () {
              $zipCodeForm = $('.js-zipcodeForm');
              $allZipCodeInputs = $('.js-zipcodeInput');
              $zipCodeForm.attr('novalidate', '');
              $zipCodeForm.submit(onFormSubmit);
              eventBus.bus.on(eventBus.events.DATA_ZIP_UPDATED, onDataZipUpdated);
          }
      }
  }
);// JavaScript source code