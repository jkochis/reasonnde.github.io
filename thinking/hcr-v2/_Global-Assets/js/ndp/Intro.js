

define(['utils'], function(utilsCode) {

    var loadBar, mainBar, whiteBGLoader, loaderText, startButton, instructionsHolder, title, clickInstructions, duckImage, mouseInstructions;
    var mInstructions1, mInstructions2, mInstructions3;
    var dotsHolder, dot1, dot2, dot3;
    var currentSwipeLevel = 0;
    var initXSwipe = 0;
    var endXSwipe = 0;
    var introParams = {};

    //for the animation of the duck.
    var duckImageFrame = 0;
    var duckImagePercent = 0;
    var meshPercentLoaded = 0;
    var animateLoader = false;
    var interactionReady = false;

    //Init swaping function for the mobile version
    function touchStartSwipe(e) {
        initXSwipe = e.changedTouches[0].pageX;
    };

    //End swaping funciton for the mobile version
    function touchEndSwipe(e) {
        endXSwipe = e.changedTouches[0].pageX;

        if (initXSwipe > endXSwipe && currentSwipeLevel < 3) {

            introParams.swipe = currentSwipeLevel;
            currentSwipeLevel++;

            if(currentSwipeLevel < 3) {
                TweenMax.to(introParams, 0.28, {
                    "swipe": currentSwipeLevel, onUpdate: function () {
                        instructionsHolder.style.left = String(-window.innerWidth * introParams.swipe).concat("px");
                    }
                })
            } else {
                clearIntro();
            }
        }

        if (initXSwipe < endXSwipe && currentSwipeLevel > 0) {
            introParams.swipe = currentSwipeLevel;
            currentSwipeLevel--;
            TweenMax.to(introParams, 0.28, {
                "swipe": currentSwipeLevel, onUpdate: function () {
                    instructionsHolder.style.left = String(-window.innerWidth * introParams.swipe).concat("px");
                }
            })
        }

        if (currentSwipeLevel == 2) {
            startButton.style.opacity = 1;
            setEventsOnStartButton();
        }

        setDotElement(dot1);
        setDotElement(dot2);
        setDotElement(dot3);

        switch(currentSwipeLevel) {

            case 0:
                setCurrentSwap(dot1);
                break;

            case 1:
                setCurrentSwap(dot2);
                break;

            case 2:
                setCurrentSwap(dot3);
                break;

        }
    };

    //Function that animates the duck in the loader
    function animate() {
        if(animateLoader) requestAnimationFrame(animate);
        duckImageFrame ++;

        var left = 5 *  Math.cos(duckImageFrame * 0.03)  *  Math.sin(duckImageFrame * 0.01);
        var top = 10 * Math.sin(duckImageFrame * 0.02) *  Math.sin(duckImageFrame * 0.04) *  Math.cos(duckImageFrame * 0.01);
        duckImagePercent += 0.2 * (meshPercentLoaded - duckImagePercent);
        var duckLeft = 10 + 0.7 * duckImagePercent;

        duckImage.style.left = String(duckLeft - left) + "%";
        duckImage.style.top = String(35 - top) + "%";
    }

    //Move swap in the instructions for the mobile version
    function touchMoveSwipe(e) {
        e.preventDefault();
    };

    //this function allows the start button to place the interactions for the duck
    function setEventsOnStartButton() {
        startButton.addEventListener('click', clearIntro);
    }

    //This function is executed to clean the intro
    function clearIntro() {
        var el = document.getElementById('whiteBGLoader');
        el.parentNode.removeChild(el);

        el.removeEventListener('touchstart', touchStartSwipe);
        el.removeEventListener('touchend', touchEndSwipe);
        el.removeEventListener('touchmove', touchMoveSwipe);

        el = document.getElementById('mouseInstructions');
        el.parentNode.removeChild(el);
        el = document.getElementById('clickInstructions');
        el.parentNode.removeChild(el);
        el = document.getElementById('title');
        el.parentNode.removeChild(el);
        el = document.getElementById('startButton');
        el.parentNode.removeChild(el);
        $("#ndp_experience_copy").css("opacity", 1);
    }

    //This function sets the style for a dot in the carousel.
    function setDotElement(element) {
        element.style.width = "10px";
        element.style.height = "10px";
        element.style.background = "#80cae3";
        element.style.borderRadius = "20px";
        element.style.display = "inline-block";
        element.style.marginLeft = "5px";
        element.style.marginRight = "5px";
        element.style.border = "none";
        element.style.transform = "translate(0%, 0%)";
        element.style.webkitTransform = "translate(0%, 0%)";
    }


    //Sets the current swap for the little three circles in the mobile instructions.
    function setCurrentSwap(element) {
        element.style.background = "none";
        element.style.border = "solid";
        element.style.borderWidth = "2px";
        element.style.borderColor = "#18a7d9";
        element.style.transform = "translate(0%, 12%)";
        element.style.webkitTransform = "translate(0%, 12%)";
    }

    //Public functions for the intro module.
    var ndpIntro = {

        //This function returns the interaction mode for the duck
        ready: function() {
            return interactionReady;
        },

        //This function sets the elements for the loading process
        startLoader: function() {
            var parent = document.getElementById("ndp_canvas_holder");
            parent.appendChild(mainBar);
            parent.appendChild(loaderText);
            parent.appendChild(duckImage);
            duckImage.style.zIndex = 100;
        },

        //This function generate the required assets
        generateAssets: function(touchDevice, folder, mobile) {

            //Variables for the instructions and HTML stuff
            loadBar = document.createElement('div');
            mainBar = document.createElement('div');
            whiteBGLoader = document.createElement('div');
            loaderText = document.createElement('div');


            duckImage = utilsCode.createImage(folder, "duckFlight.png", "duckImage", "41px", "69px", "45%", "50%", 1);
            title = utilsCode.createImage(folder, "ndp-title.png", "title", "126px", "60px", "20%", "50%", 0);
            mouseInstructions = utilsCode.createImage(folder, touchDevice ? "fingerInstructions.png" : "mouseInstructions.png", "mouseInstructions", '272px', "78px", "55%", "30%", 0);
            clickInstructions = utilsCode.createImage(folder, "clickInstructions.png", "clickInstructions", '262px', '78px', "55%", "70%", 0);


            mInstructions1 = utilsCode.createSimpleImage(folder, "mInstructions1.png", "firstInstructions", '225px', "196px");
            mInstructions2 = utilsCode.createSimpleImage(folder, "mInstructions2.png", "secondInstructions", '225px', "196px");
            mInstructions3 = utilsCode.createSimpleImage(folder, "mInstructions3.png", "thirdInstructions", '225px', "196px");

            //Style for the loading bar
            loadBar.id = 'loadBar';
            loadBar.style.backgroundColor = "#f69628";
            loadBar.style.width = "0%";
            loadBar.style.height = "2px";

            //Style for the background load bar
            mainBar.style.backgroundColor = "#e0e0e0";
            mainBar.style.width = "100%";
            mainBar.style.height = "2px";
            mainBar.style.position = "absolute";
            mainBar.style.top = "50%";
            mainBar.style.zIndex = 200;
            mainBar.id = 'mainBar';
            mainBar.appendChild(loadBar);

            //Style for the background translucent.
            whiteBGLoader.style.width = "100%";
            whiteBGLoader.style.height = "100%";
            whiteBGLoader.style.position = "absolute";
            whiteBGLoader.style.top = '0px';
            whiteBGLoader.style.backgroundColor = "#fff";
            whiteBGLoader.style.opacity = "0.9";
            whiteBGLoader.id = "whiteBGLoader";

            if (mobile) {
                $('.ndp_body')[0].appendChild(whiteBGLoader);
            } else {
                document.getElementById("ndp_canvas_holder").appendChild(whiteBGLoader);
            }

            //Style for the loading text
            loaderText.id = "loaderText";
            loaderText.style.color = "#13abde";
            loaderText.style.fontFamily = "ProximaNovaThin";
            loaderText.style.position = "absolute";
            loaderText.style.top = "53%";
            loaderText.style.left = "50%";
            loaderText.style.textAlign = "center";
            loaderText.style.fontSize = "16px";
            loaderText.style.transform = "translate(-50%, -50%)";
            loaderText.style.webkiTransform = "translate(-50%, -50%)";
            loaderText.style.zIndex = 200;

            //Style for the init button.
            startButton = document.createElement("button");
            startButton.style.color = "#fff";
            startButton.id = "startButton";
            startButton.style.backgroundColor = "#f69628";
            startButton.innerHTML = "GET STARTED";
            startButton.style.position = "absolute";
            startButton.style.top = "80%";
            startButton.style.left = "50%";
            startButton.style.textAlign = "center";
            startButton.style.fontSize = "16px";
            startButton.style.transform = "translate(-50%, -50%)";
            startButton.style.webkitTransform = "translate(-50%, -50%)";
            startButton.style.paddingTop = "15px";
            startButton.style.paddingBottom = "15px";
            startButton.style.paddingLeft = "60px";
            startButton.style.paddingRight = "60px";
            startButton.style.border = "none";
            startButton.style.cursor = "pointer";
            startButton.style.opacity = 0;

            startButton.addEventListener('mouseover', function () {
                $('#startButton').css('background-color', "#f6a951");
            });
            startButton.addEventListener('mouseout', function () {
                $('#startButton').css('background-color', "#f69628")
            })
        },

        //This function defines if the duck should be keep on animated
        animateDuck: function(value) {
            animateLoader = value;
        },

        //This function updates the loader bar
        updateProgressBar: function(value) {
            meshPercentLoaded = value;
            var percentage = String(value) + "%";
            loadBar.style.width = percentage;
            loaderText.innerHTML = percentage;
        },

        //This function is executed to animate the duck from the loader
        animateLoaderDuck: function() {
            animate();
        },

        //This function shows the required instructions the first time the user visit the page
        showInstuctions: function(mobile, rendererWidth) {
            var el = document.getElementById('mainBar');
            el.parentNode.removeChild(el);
            el = document.getElementById('loaderText');
            el.parentNode.removeChild(el);
            el = document.getElementById('duckImage');
            el.parentNode.removeChild(el);

            //When all the pieces are loaded I evaluate if there's a cookie to know if we visited the page before.
            if (utilsCode.getCookie("visited") == "true") {
                //if(false) {
                el = document.getElementById('whiteBGLoader');
                el.parentNode.removeChild(el);
                $("#ndp_experience_copy").css("opacity", 1);
                interactionReady = true;

            } else {

                document.cookie = "visited=true";

                if(mobile) {
                    //if (true) {

                    document.getElementById('whiteBGLoader').addEventListener('touchstart', touchStartSwipe);
                    document.getElementById('whiteBGLoader').addEventListener('touchend', touchEndSwipe);
                    document.getElementById('whiteBGLoader').addEventListener('touchmove', touchMoveSwipe);

                    var holder = $('#whiteBGLoader')[0];

                    title.style.top = "120px";
                    title.style.opacity = 1;

                    holder.style.height = String(window.innerHeight) + "px";
                    instructionsHolder = document.createElement("div");
                    instructionsHolder.id = 'touchMobileInstructions';
                    instructionsHolder.style.width = String( 3 * window.innerWidth) + "px";
                    instructionsHolder.style.height = "196px";
                    instructionsHolder.style.overflow = "hidden";
                    instructionsHolder.style.top = "33%";
                    instructionsHolder.style.position = "relative";
                    //instructionsHolder.style.display = "inline-block";

                    var margin = Math.floor((3 * window.innerWidth - 675) / 6);
                    mInstructions1.style.marginLeft = String(margin) + 'px';
                    mInstructions2.style.marginLeft = String(margin) + 'px';
                    mInstructions3.style.marginLeft = String(margin) + 'px';
                    mInstructions1.style.marginRight = String(margin) + 'px';
                    mInstructions2.style.marginRight = String(margin) + 'px';
                    mInstructions3.style.marginRight = String(margin) + 'px';

                    instructionsHolder.appendChild(mInstructions1);
                    instructionsHolder.appendChild(mInstructions2);
                    instructionsHolder.appendChild(mInstructions3);

                    dotsHolder = document.createElement("div");
                    dotsHolder.style.position = "relative";
                    dotsHolder.style.width = "65px";
                    dotsHolder.style.top = String(window.innerHeight - 90).concat("px");
                    dotsHolder.id = "dotsHolder";
                    dotsHolder.style.marginRight = "auto";
                    dotsHolder.style.marginLeft = "auto";

                    holder.appendChild(dotsHolder);

                    dot1 = document.createElement("div");
                    dot2 = document.createElement("div");
                    dot3 = document.createElement("div");
                    dot1.id = "dot1";
                    dot2.id = "dot2";
                    dot3.id = "dot3";
                    setDotElement(dot1);
                    setDotElement(dot2);
                    setDotElement(dot3);
                    setCurrentSwap(dot1);
                    dotsHolder.appendChild(dot1);
                    dotsHolder.appendChild(dot2);
                    dotsHolder.appendChild(dot3);

                    holder.appendChild(title);
                    holder.appendChild(instructionsHolder);

                    startButton.style.top = String(window.innerHeight - 40).concat("px");
                    startButton.style.opacity = 1;
                    startButton.style.fontSize = "14px";
                    startButton.style.paddingTop = "15px";
                    startButton.style.paddingBottom = "15px";
                    startButton.style.paddingLeft = "20px";
                    startButton.style.paddingRight = "20px";
                    holder.appendChild(startButton);

                    currentSwipeLevel = 0;
                    startButton.style.opacity = 0.3;

                } else {

                    var parent = document.getElementById("ndp_canvas_holder");
                    parent.appendChild(title);
                    parent.appendChild(mouseInstructions);
                    parent.appendChild(clickInstructions);
                    title.style.opacity = 0;

                    TweenMax.to(title, 0.5, {opacity: 1, delay: 0.5});
                    TweenMax.to(startButton, 1, {opacity: 1, delay: 1.5});


                    var minWidth = rendererWidth < 800;
                    mouseInstructions.style.top = (minWidth ? "30%" : "40%");
                    clickInstructions.style.top = (minWidth ? "50%" : "40%");

                    TweenMax.to(mouseInstructions, 0.4, {
                        top: (minWidth ? "40%" : "50%"), delay: 0.9, onStart: function () {
                            mouseInstructions.style.opacity = 1;
                        }
                    });

                    TweenMax.to(clickInstructions, 0.4, {
                        top: (minWidth ? "60%" : "50%"), delay: 1.2, onStart: function () {
                            clickInstructions.style.opacity = 1;
                        }
                    });


                    parent.appendChild(startButton);
                    setEventsOnStartButton();

                }
            }
        }
    }

    return ndpIntro;
})