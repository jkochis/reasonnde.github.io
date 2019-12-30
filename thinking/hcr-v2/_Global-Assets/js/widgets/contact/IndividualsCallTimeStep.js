/**
 * Created by roel.kok on 6/26/14.
 */
define([
	"underscore",
	"lib/Env",
	"lib/Util",
	"lib/MediaQueries",
	"lib/common_components/FormDropdown",
	"lib/common_components/FormTimeDropdown",
	"lib/common_components/InfoboxPopup",
	"widgets/ErrorLightbox",
	"./StepView"
],
function (
	_,
	Env,
	Util,
	MediaQueries,
	FormDropdown,
	FormTimeDropdown,
	InfoboxPopup,
	ErrorLightbox,
	StepView
) {
    var CallTimeStepView = StepView.extend({
        // var scheduleObject;
        setupData: function (isAvailable, schObject) {
        
	        if(isAvailable == null){
	        
	        	//For the gaum, puerto rico etc countries
				$('.form-step').addClass('guam');
	        	
	            this.model.scheduleObject = schObject;
	            
	            //console.log(this.model.scheduleObject,this.model.scheduleObject.length)
                $("select[name='time']").find('option').remove().end();
                $.each(this.model.scheduleObject, function (index, day) {
                    $("select[name='time']").append("<option value='" + day.toLowerCase() + "'>" + day + "</option>");
                });
	            
	            this.timeDropdown = new FormDropdown({
	                el: this.$(".time-dropdown")[0]
	            });
	            //console.log(this.timeDropdown)
	
	            this.formFields = [
					this.timeDropdown
	            ];
	
	            this.timeDropdown.on("change", this.onChangeGuamTimeDropdown, this);
	
	            this.timeDropdown.clear();
	        	
				this.state.set("currentTab", 1);				
				$('.call-options .tab-nav').hide();
				if (!Util.isSpanish()) {
					$('.later-info').html("Select a time you'd like to be contacted by an Aflac agent.");
				} else {
					$('.later-info').html("Seleccione una hora que le gustaría ser contactado por un agente de Aflac.");
				}
				$('.date-dropdown').hide();
	        	
	        }else{
				$('.form-step').removeClass('guam');
	            // populate day dropdown from scheduleobject days
	            this.model.scheduleObject = schObject;
	
	            //var displayTodayTab = (isAvailable != null) ? isAvailable.availability : false;
	            var displayTodayTab = isAvailable.availability || false;
                
                
	            var dh = new DateHelper();
	            var today = new Date();
	            var todayMSecs = today.valueOf();
	            var todayValue = dh.getServerDateString(today);
				$('.call-options .tab-nav').show();
				if (!Util.isSpanish()) {
					$('.later-info').html("Select a date and time you'd like to be contacted by an Aflac agent.");
				} else {
					$('.later-info').html("Seleccione una fecha y hora desea ser contactado por un agente de Aflac.");
				}
				$('.date-dropdown').show();
	
	            // DL added or changed			
	            if (this.model.scheduleObject != null && this.model.scheduleObject.length) {
	                $("select[name='date']").find('option').remove().end();
	                $.each(this.model.scheduleObject, function (index, day) {
	                    var currDate = day.date;
	                    var currValue = dh.getServerDateString(currDate);
	                    var currText = dh.getDateString(currDate, "{DDDD}, {MMM} {dd}, {yyyy}");
	                    $("select[name='date']").append("<option value='" + currValue + "'>" + currText + "</option>");
	                });
	            }
	            this.dateDropdown = new FormDropdown({
	                el: this.$(".date-dropdown")[0]
	            });
	
	            this.formFields = [
					this.dateDropdown
	            ];
	            this.dateDropdown.clear();
	            this.dateDropdown.on("change", this.onChangeDateDropdown, this);
	            //DL end added
	
	            if(displayTodayTab)
	            {
	                this.state.set("currentTab", 0);
	            }
	            else
	            {
	                this.state.set("currentTab", 1);
	                //this.$tabNavItems.off("click", this.onClickTabNavItem);
	                this.$tabNavItems.css("display","none");

	            }
	        }
        },
		setupData_type2: function (){
		
		},
        initialize: function (options) {
            _.bindAll(this,
				"onClickTabNavItem"
			);
            this.model = new Backbone.Model({
                date: "",
                time: "",
                contactMeType: "",
                scheduleObject: {}
            });
            this.model.validate = function (attr, options) {
                var invalidFields = [];
				var selection = false;
				if(window.aflac.ajax.callCenterAvailibility){
                _.each(attr, function (value, key, list) {
                    if (value == "") {
                        invalidFields.push(key);
                    }
                });
				}else{
					$("select[name='time'] > option").each(function() {
							if($(this).attr('selected') === 'selected'){
							selection = true;	
							}
					});
					if(selection === false){
					invalidFields.push("time");
					}
				}
			if (!Util.isSpanish()) {
				if(invalidFields.length > 0) {
					return {
						message: "Please complete all required fields to continue.",
						fields: invalidFields
					};
				}
			} else {
				if(invalidFields.length > 0) {
					return {
						message: "Por favor, complete todos los campos necesarios para continuar.",
						fields: invalidFields
					};
				}
			}
            };
            this.state = new Backbone.Model({
                currentTab: -1
            });
            this.$tabNavItems = this.$(".tab-nav a");
            this.$tabs = this.$(".tab");    
            this.$nowDate = this.$(".now-date");
            this.$nowTime = this.$(".now-time");
            this.$nowContactMeType = this.$(".now-contact-me-type");
            this.$currentTimeDisplay = this.$(".current-time .value");
            this.$dropdownRow = this.$(".dropdown-row");
            this.timeDropdown = "";
            this.$tabNavItems.on("click", this.onClickTabNavItem);
            this.model.on("invalid", this.onInvalidModel, this);
            this.state.on("change:currentTab", this.onChangeCurrentTabState, this);
            // this.state.set("currentTab", 0);
        },
        reset: function () {
            if(this.dateDropdown != null && this.dateDropdown.clear)
                this.dateDropdown.clear();
            if(this.timeDropdown != null && this.timeDropdown.clear)
                this.timeDropdown.clear();
        },
        onInvalidModel: function (model, error, options) {
            //			console.log(error);
            for (var i = 0; i < this.formFields.length; i++) {
                var formField = this.formFields[i];
                if (_.indexOf(error.fields, formField.name) > -1) {
                    formField.setError(true);
                }
                else {
                    formField.setError(false);
                }
            }
            if (!Env.IE8 && matchMedia(MediaQueries.HEADER_HAMBURGER).matches) {
                var lightbox = new ErrorLightbox({
                    data: {
                        title: "Error",
                        message: error.message
                    }
                });
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 3'});
                }
				lightbox.show();
            }
            else {
                var isFixed = Util.isPositionFixed(this.$dropdownRow[0]);
                var formFieldsBoundingRect = this.$dropdownRow[0].getBoundingClientRect();
                var infoboxPopup = new InfoboxPopup({
                    title: "Error",
                    message: error.message,
                    origin: {
                        position: isFixed ? "fixed" : "absolute",
                        top: (formFieldsBoundingRect.top + formFieldsBoundingRect.bottom) / 2 + (isFixed ? 0 : $(window).scrollTop()),
                        left: formFieldsBoundingRect.left + (isFixed ? 0 : $(window).scrollLeft())
                    },
                    error: true
                });
				if (window.utag) {
					utag.link({_ga_category: 'lead form',_ga_action: 'error',_ga_label: 'form validation step 3'});
				}
                infoboxPopup.show();
            }
        },
        onClickTabNavItem: function (event) {
            event.preventDefault();
            var target = event.delegateTarget;
            var index = this.$tabNavItems.index(target);
            this.state.set("currentTab", index);
        },
        onChangeCurrentTabState: function (model, value, options) {
            this.$tabNavItems.removeClass("is-active");
            this.$tabNavItems.eq(value).addClass("is-active");
            this.$tabs.css("display", "none");
            this.$tabs.find("input, select, textarea").prop("disabled", true);
            this.$tabs.eq(value).css("display", "block");
            this.$tabs.eq(value).find("input, select, textarea").prop("disabled", false);
            if (value == 0) {
                var now = new Date();
                this.$nowDate.val((now.getMonth() + 1) + "/" + now.getDate() + "/" + now.getFullYear());
               // this.$nowTime.val(now.getHours() * 3600 + now.getMinutes() * 60);
                this.$nowTime.val(now.valueOf());
                this.$nowContactMeType.val("now");
                this.model.set({
                    date: this.$nowDate.val(),
                    time: this.$nowTime.val(),
                    contactMeType: this.$nowContactMeType.val()
                });
              
              // ISSUE: #AFL-62
                var dateHel = new DateHelper();
                this.$currentTimeDisplay.empty().append(dateHel.getDateString(now, "{hh}:{mm} {tt}"));
            }
            else {
				if(this.dateDropdown){
	                this.model.set({
	                    date: this.dateDropdown.getValue(),
	                    // time: this.timeDropdown.getValue(),
	                    // contactMeType: this.$nowContactMeType.val()
	                });
				}
            }
        },
        onChangeDateDropdown: function (dropdown) {
            this.model.set("date", dropdown.getValue());
            this.model.set("time", "");
            this.model.set("contactMeType", "");
          
            var dh = new DateHelper();
            var todayDate = dh.getServerDateString(new Date());
            var selDay = dropdown.getValue();            
            this.model.set("contactMeType", "later");
            // populate time dropdown
            var selectedDay = this.dateDropdown.getValue();
            
            //DL added code
            if (this.model.scheduleObject != null && this.model.scheduleObject.length) {
               
                var currTimeIntervals;
                $("select[name='time']").find('option').remove().end();
                $.each(this.model.scheduleObject, function (index, day) {
                    if (day.isSelected(selectedDay)) {
                        currTimeIntervals = day.timeIntervals;
                    }
                });
              //  console.log("currTimeInterval: ", currTimeIntervals);
                if(currTimeIntervals != null && currTimeIntervals.length > 0)
                {
                    var dh = new DateHelper();
                    $.each(currTimeIntervals, function (i, timeInterval) {
                       // secsInDay = timeInterval.startTimeSeconds();
					    startEpochTime = timeInterval.startTime.valueOf();
                        stLocalTime = dh.getDateString(timeInterval.startTime, "{hh}:{mm} {tt}");
                        $("select[name='time']").append("<option value='" + startEpochTime /*secsInDay*/ + "'>" + stLocalTime + "</option>");
                    });
                    
                }
            }
            this.timeDropdown = new FormTimeDropdown({
                el: this.$(".time-dropdown")[0]
            });
            this.formFields.push(this.timeDropdown);
            this.timeDropdown.on("change", this.onChangeTimeDropdown, this);
            this.timeDropdown.clear();
            //end DL added
        },
        onChangeTimeDropdown: function (dropdown) {
            this.model.set("time", dropdown.getValue());
            var dh = new DateHelper();
            var todayDate = dh.getServerDateString(new Date());
            var selDay = this.model.get("date");
            var selTime = dropdown.getValue();
            var contactType = "later"
           // if (selDay == todayDate) {
           //     contactType = (selTime < 57600) ? "morning" : "evening";
           // }
            this.formFields.push(this.$nowContactMeType)
            this.model.set("contactMeType", contactType);
            // this.$nowDate.val((this.model.date.getMonth() + 1) + "/" + this.model.date.getDate() + "/" + this.model.date.getFullYear());
            // this.$nowTime.val(this.model.time.getHours() * 3600 + this.model.time.getMinutes() * 60);
            this.$nowContactMeType.val(contactType);
        },
        onChangeGuamTimeDropdown: function (dropdown) {
            this.model.set("time", dropdown.getValue());
            var selTime = dropdown.getValue();
            var contactType = dropdown.getValue();
            this.formFields.push(this.$nowContactMeType)
            this.model.set("contactMeType", contactType);
            this.$nowContactMeType.val(contactType);
        }
    });
    return CallTimeStepView;
});
function DateHelper()
{
    this.MonthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.WeekDayShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.WeekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.getServerDateString = function (date)
    {
        sMonth = date.getMonth() + 1;
        sDate = date.getDate();
        sYear = date.getFullYear();
        return sMonth + "/" + sDate + "/" + sYear;;
    };
    this.getDateString = function(date, format)
    {
        var newDate = format;
        sMonth = date.getMonth();
        sMonthRank = sMonth+1;
        sDay = date.getDay();
        sDate = date.getDate();
        s0Date = (sDate < 10) ? "0" + sDate : "" + sDate;
        sFullYear = date.getFullYear();
        sYear = date.getYear() - 100;
        sHours24 = date.getHours();
        s0Hours24 = (sHours24 < 10 && sHours24 != 00)? "0"+sHours24 : ""+sHours24;
        sMins = date.getMinutes();
        s0Mins = (sMins < 10)? "0"+sMins : ""+sMins;
        sSecs = date.getSeconds();
        s0Secs = (sSecs < 10) ? "0" + sSecs : "" + sSecs;
        sHours = (sHours24 > 12) ? sHours24 - 12 : sHours24;
        sHours = (sHours24 == 0) ? 12 : sHours;
        s0Hours = (sHours < 10) ? "0" + sHours : "" + sHours;
        sAMPM = (sHours24 >= 12) ? "PM" : "AM";
        newDate = newDate.replace("{DDDD}", this.WeekDayNames[sDay]);
        newDate = newDate.replace("{DDD}", this.WeekDayShortNames[sDay]);
        newDate = newDate.replace("{DD}", this.WeekDayShortNames[sDay].substr(0, 2));
        newDate = newDate.replace("{D}", this.WeekDayShortNames[sDay][0]);
        newDate = newDate.replace("{MMMM}", this.MonthNames[sMonth]);
        newDate = newDate.replace("{MMM}", this.MonthShortNames[sMonth]);
        newDate = newDate.replace("{MM}", sMonthRank);
        newDate = newDate.replace("{M}", sMonthRank);
        newDate = newDate.replace("{yyyy}", sFullYear);
        newDate = newDate.replace("{yy}", sYear);
        newDate = newDate.replace("{dd}", s0Date);
        newDate = newDate.replace("{d}", sDate);
        newDate = newDate.replace("{HH}", s0Hours24);
        newDate = newDate.replace("{H}", sHours24);
        newDate = newDate.replace("{hh}", s0Hours);
        newDate = newDate.replace("{h}", sHours);
        newDate = newDate.replace("{mm}", s0Mins);
        newDate = newDate.replace("{m}", sMins);
        newDate = newDate.replace("{ss}", s0Secs);
        newDate = newDate.replace("{s}", sSecs);
        newDate = newDate.replace("{tt}", sAMPM);
        newDate = newDate.replace("{t}", sAMPM);
        return newDate;
    }
}