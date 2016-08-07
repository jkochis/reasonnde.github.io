/* globals define brightcove $ */

define([
	"underscore",
	"lib/Env",
	"lib/WidgetView",
	"vendor/mediaelement-and-player"
],
function(
	_,
	Env,
	WidgetView,
	MediaElement
) {
	var VideoPlayer = WidgetView.extend({
		youtubeHasFailed: false,

		initialize : function(options) {
			_.extend(this, options);
			window.aflac = window.aflac || {};
			window.aflac.brightcove = window.aflac.brightcove || {};
			window.aflac.brightcove.error = 0;
			window.onPlayerError = {};
			window.onTemplateReady = {};
			window.onTemplateLoad = {};
			this.setup();
		},

		setup: function() {
			var that = this;
			var el = this.$el;
			
			this.$error = el.siblings('.ev_video_error');
			this.$video = el.find('video');
			this.$youtubeIframe = null;
			
			this.ENV_TOUCH = Env.IOS || Env.ANDROID || Env.WP || Env.SURFACE;
			
			if(this.videoType === 'brightcove') {
				this.tryBrightCoverPlayer();
			}

			if(this.videoType === 'youtube') {

				// Handle the case when Youtube API is blocked
				if(!window.YT) {

					// Use the brightcove player
					this.onYoutubeError();
					return;
				}

				// Remove Youtube player if exists
				this.removeYoutubePlayer();

				var youtubeSrc = el.attr('data-src');
				this.$youtubeIframe = $('<iframe  id="aflac-youtube-video" width="100%" height="100%" data-src="'+ youtubeSrc +'?enablejsapi=1&rel=0" frameborder="0" allowfullscreen>'); //.attr('data-src', youtubeSrc);
				el.append(this.$youtubeIframe);

				if(this.$youtubeIframe.length) {
					this.$youtubeIframe.attr('src', this.$youtubeIframe.data('src'));
					setTimeout(function() {
						that.youtube_player = new YT.Player(that.$youtubeIframe.attr('id'), {
							events: {
								'onReady': _.bind(that.onYoutubeReady, that),
								'onStateChange': _.bind(that.onYoutubeStateChange, that),
								'onError': _.bind(that.onYoutubeError, that)
							}
						});
					}, 125);
				}
			} else if(this.$video.length) {
				this.player = new MediaElementPlayer(this.$video, {
					pluginPath: '../js/mediaelement/',
					success: function(mediaElement, dom) {
						el.find('.mejs-overlay-button').each( function(i){
							var arrow = $(this).find('.icon').eq(0);
							$(this).mouseenter( function(){
								TweenMax.fromTo(arrow, 0.3, {'left': 0}, {'left': -127, ease: "Quad.easeOut"});
							}).mouseleave( function(){
								TweenMax.fromTo(arrow, 0.3, {'left': -127}, {'left': -254, ease: "Quad.easeOut", onComplete: function(){
									TweenMax.to(arrow, 0, {'left': 0});
								}});
							});
						})
					}
				});
			}
		},

		onYoutubeReady: function() {
			var that = this;  

			// Play directly to trigger Youtube errors
			// if(!this.ENV_TOUCH) {
				this.toggleYoutube('play');
			// }

			this.duration = this.youtube_player.getDuration();
			this.title = this.youtube_player.getVideoData().title;
      if (window.utag) {
      	utag.link({_ga_category: 'video',_ga_action: 'initiated',_ga_label: this.title.toLowerCase()}); 
      }
			this.milestones = [
				{ percent: 25, timestamp: '' },
				{ percent: 50, timestamp: '' },
				{ percent: 75, timestamp: '' }			
			];
			_.select(this.milestones, function(milestone) {
				milestone.timestamp = Math.round((milestone.percent/100) * that.duration)
			});
		},

		trackYoutubeProgress: function() {
      var VideoTitle = this.title; 
			var current = Math.round(this.youtube_player.getCurrentTime());
			_.select(this.milestones, function(milestone) {
				if(milestone.timestamp == current) {
	        var videoMilestone = milestone.percent+'% completed'; 
	        if (window.utag) {
	            utag.link({_ga_category: 'video',_ga_action: 'milestone: '+videoMilestone,_ga_label: VideoTitle.toLowerCase()}); 
	        }
				}
			})
		},

		onYoutubeStateChange: function() {
			if(typeof this.youtube_player.getPlayerState === 'function') {
				switch(this.youtube_player.getPlayerState()) {
					case 0:
		        if (window.utag) {
		        	utag.link({_ga_category: 'video',_ga_action: 'ended',_ga_label: this.title.toLowerCase()});
		        }
						clearInterval(this.youtubeInterval);
					break;
					case 1:
	          if (window.utag) {
	          	utag.link({_ga_category: 'video',_ga_action: 'play',_ga_label: this.title.toLowerCase()});
	          }    
						this.youtubeInterval = setInterval(_.bind(this.trackYoutubeProgress, this), 1000)
					break;
					case 2:
	          if (window.utag) {
	           utag.link({_ga_category: 'video',_ga_action: 'pause',_ga_label: this.title.toLowerCase()}); 
	          }    
						clearInterval(this.youtubeInterval);
					break;
				}
			}
		},

		toggleYoutube: function(cmd) {
			switch(cmd) {
				case 'play':
					this.youtube_player.playVideo();
				break;
				case 'pause':
					this.youtube_player.pauseVideo();
				break;
				case 'stop':
					this.youtube_player.stopVideo();
				break;
				default:
					this.youtube_player.playVideo();
				break;
			}
		},

		tearDown: function() {
			if(this.videoType == 'youtube' && this.$youtubeIframe.length) {
				if(!this.youtubeHasFailed) {
					this.toggleYoutube('stop');
				}
				this.youtube_player.destroy();
				this.removeYoutubePlayer();
				clearInterval(this.youtubeInterval);
			} else {
				if(this.player) {
					this.player.remove();
				}
			}

			if(this.$error.hasClass('visible')) {
				this.$error.removeClass('visible');
			}

			this.youtubeHasFailed = false;
			this.removeBrightcovePlayer();
		},

		onYoutubeError: function () {
			if(!Env.IE8) {
				if(this.youtube_player) {
					this.youtube_player.destroy();
				}
			}

			// Remove brightcove player
			this.removeBrightcovePlayer();

			// Remove Youtube player
			this.removeYoutubePlayer();
			if(!this.youtubeHasFailed) {
				this.youtubeHasFailed = true;
				this.tryBrightCoverPlayer();
			}
			if (window.utag) {
				utag.link({_ga_category: 'video',_ga_action: 'error',_ga_label: 'youtube'}); 
			}
		},

		removeBrightcovePlayer: function () {
			var brightcoveSelector = '#' + this.brightcoveId || '#myExperience';
			if(this.$el.find(brightcoveSelector).length > 0) {
				this.$el.find(brightcoveSelector).remove();
				this.brightcoveReady = false;
			}
		},

		removeYoutubePlayer: function() {
			if(this.$el.find('iframe').length > 0) {
				this.$el.find('iframe').hide().remove();
			}
		},

		tryBrightCoverPlayer: function () {
			var that = this;
			var videoId = this.$el.attr('data-brightcove-src');
			this.brightcoveId = 'myExperience' + videoId;
			this.removeBrightcovePlayer();

			this.$brightcoveTemplate =
				$('<object id="myExperience'+ videoId +'" class="BrightcoveExperience">\
					<param name="bgcolor" value="#FFFFFF" />\
					<param name="width" value="100%" />\
					<param name="height" value="100%" />\
					<param name="wmode" value="opaque" />\
					<param name="playerID" value="4474167779001" />\
					<param name="playerKey" value="AQ~~,AAAB6-dsn7E~,23Pq_8YIbq2-B98AnAZ_aWU9c8-DfcWK" />\
					<param name="isVid" value="true" />\
					<param name="isUI" value="true" />\
					<param name="dynamicStreaming" value="true" />\
					<param name="@videoPlayer" value="' + videoId + '" />\
					<param name="includeAPI" value="true" />\
					<param name="templateLoadHandler" value="onTemplateLoad" />\
					<param name="templateReadyHandler" value="onTemplateReady" />\
					<param name="templateErrorHandler" value="onPlayerError" />\
					<param name="secureConnections" value="true" />\
					<param name="secureHTMLConnections" value="true" />\
				</object>');

			// Append player
			this.$el.append(this.$brightcoveTemplate);

			// Instantiate the player
			brightcove.createExperiences();

			window.onTemplateLoad = function(experienceID) {
				that.brightcovePlayerInstance = brightcove.api.getExperience(experienceID);
				that.brightcovePlayer = that.brightcovePlayerInstance.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
			};

			window.onTemplateReady = function() {
				/*var onProgress = function(evt) {
					if ( (evt.duration - evt.position) < .25 ) {
						 that.brightcovePlayer.seek(0);
					 }
				  };*/
				that.brightcovePlayer.play();
				that.brightcoveReady = true;
			//	that.brightcovePlayer.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, onProgress);
				that.brightcovePlayer.getCurrentVideo(function(videoDTO) {
					if (window.utag) {
						utag.link({_ga_category: 'video',_ga_action: 'initiated',_ga_label: videoDTO.displayName.toLowerCase()}); 
						utag.link({_ga_category: 'video',_ga_action: 'play',_ga_label: videoDTO.displayName.toLowerCase()});
						//console.dir(videoDTO.displayName);
					}
				});
			};

			window.onPlayerError = function(err) {
				// if(err) {
				// 	console.log('Brightcove player error: ' + JSON.stringify(err));
				// }
				if(!that.brightcoveReady) {
					that.$error.addClass('visible');
					that.removeBrightcovePlayer();				
					if (window.utag && window.aflac.brightcove.error < 1) {
						utag.link({_ga_category: 'video',_ga_action: 'error',_ga_label: 'brightcove'}); 
						utag.link({_ga_category: 'site diagnostics',_ga_action: 'brightcove',_ga_label: 'errorType: ' + err.errorType +'-code: ' + err.code + '-info: ' + err.info});
						window.aflac.brightcove.error++;
					}
				}
				//  console.log(window.aflac.brightcove.error);
				//	console.log("errorType: " + err.errorType)
				//	console.log("code: " + err.code);
				//	console.log("info: " + err.info);
			};
		}
	},
	{
		build: function() {

		}
	});

	return VideoPlayer;
});
