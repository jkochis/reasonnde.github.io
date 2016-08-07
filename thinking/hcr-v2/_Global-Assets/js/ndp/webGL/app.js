define(['intro', 'utils', 'ik'],
        function(Intro, utilsCode, IK) {
    //these variables are setted after the document is fully loaded.
    var parent, bagHolder, bagActivated, retina, touchDevice;
    //Folder used to find the assets.
    var folder = "/_Global-Assets/images/ndp/webGL/";
    //Variables for the duck experience
    var backgroundColor = 0Xffffff;
    var container, camera, scene, renderer;
    var alpha, beta, currentMouseX = 0, currentMouseY = 0
    var duck, box, posHelper;
    var counter = 0;
    var duckTexturesLoaded = 0;
    var currentFrame = 0.;
    var helpers = [];
    var bones = [];
    var distances = [];
    var bonesDistance = 0;
    var bonesPositions = [];
    var headBone, difference, difference2, beakBone, jawBone, jetpackBones;
    var clock;
    var down = false;
    var init = true;
    var delta = 0;
    var animations = [];
    var gliding = false;
    var glidingInit = 0.625;
    var glidingEnd = 1.875;
    var flyingInit = 3.125;
    var flyingEnd = 4.25;
    var animationInit, animationEnd;
    var glidingCycle = 1;
    var animationCounter = glidingInit;
    var raycaster;
    var background, backgroundMaterial, smoke, smokeMaterial, trees, clouds;
    var buildings = [];
    var addedSpeed = 0;
    var speed = 16;
    var maxSpeed = 16;
    var mouseInCanvas = false;
    var ratio = 500;
    var textures = [];
    var mats = [];
    var loaders = [];
    var amountLoaded = [];
    var duckReady = false;
    var cloudReady = false;
    var imagesLoaded = 0;
    var images = [];
    var cameraSeparation = 600;
    var cameraDistance = 600;
    var acelerator = 0.02;
    var flappingCycle = 0;
    var activateScroll = false;
    var bagsAnimation = false;
    var currentBagImage = 0;
    var bagImages = [];
    var parameters = {};
    var treesContainer, buildingsContainer;
    var ambientCycle = 0;
    var changeAmbient = true;
    var cloudsHolder;
    var mobile = false;
    var canvasHeight;
    var staticImage;
    var clicked = true;
    var buildingGeometries, buildingLoaded, buildingLoaders;
    var totalSmoke;
    var treeTextureReady = false;
    var officeTextureReady = false;
    var houseTextureReady = false;
    //This function is used to evaluate if we have a webgl enabled device.
    function evalWebGL() {
        try {
            var canvas = document.createElement( 'canvas' );
            return !! (window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' )));
        } catch( e ) {
            return false;
        }
    }
    //This function is fired if there's no webgl
    function nonWebGLRoute() {
        canvasHeight = window.innerWidth < 500 ? 300 : 546;
        var imageWidth = canvasHeight == 300 ? 703 : 1280;
        staticImage = utilsCode.createSimpleImage(folder, 'staticImage.jpg', 'duckBackground', imageWidth, canvasHeight);
        parent.appendChild(staticImage);
        staticImage.style.position = "relative";
        staticImage.style.top = "0%";
        staticImage.style.zIndex = -1;
        $("#ndp_experience_copy").css("opacity", 1);
        var left = 0;
        if(1200 > window.innerWidth ) {
            left = Math.min(30, 30 * window.innerWidth  / imageWidth);
        }
        if(window.addEventListener){
            window.addEventListener('resize', function() {
                left = 0;
                if(1200 > window.innerWidth ) {
                    left = Math.min(30, 30 * window.innerWidth  / imageWidth);
                }
                staticImage.style.right = String(left) + "%";
            });
        }else{
            window.attachEvent('onresize', function() {
                left = 0;
                if(1200 > window.innerWidth ) {
                    left = Math.min(30, 30 * window.innerWidth  / imageWidth);
                }
                staticImage.style.right = String(left) + "%";
            });
        }
        staticImage.style.right = String(left) + "%";
    }
    //This is the initial function
    function initWebGLExperience() {
        clock = new THREE.Clock();
        //Define the size of the experience based on the width of the window.
        canvasHeight = window.innerWidth < 580 ? 300 : 546;
        canvasHeight = window.orientation != undefined ? canvasHeight : 546;
        //If the size of the canvas is small we might be in a mobile device.
        if (canvasHeight == 300) {
            mobile = true;
            $("#ndp_experience_copy").remove();
        }
        totalSmoke = (mobile || touchDevice ||  window.orientation != undefined) ? 10000 : 100000;
        if(mobile || touchDevice ||  window.orientation != undefined) $("#ndp_login_link").remove();
        //Generate the intro assets for the first time.
        Intro.generateAssets(touchDevice, folder, mobile);
        //Generate the bag assets.
        bagImages[0] = utilsCode.createSimpleImage(folder, 'bag1.png', 'bag1', "256px", "256px", "0px", "0px", 1);
        bagImages[1] = utilsCode.createSimpleImage(folder, 'bag2.png', 'bag2', "256px", "256px", "0px", "0px", 1);
        bagImages[2] = utilsCode.createSimpleImage(folder, 'bag3.png', 'bag3', "256px", "256px", "0px", "0px", 1);
        bagImages[3] = utilsCode.createSimpleImage(folder, 'bag4.png', 'bag4', "256px", "256px", "0px", "0px", 1);
        bagImages[4] = utilsCode.createSimpleImage(folder, 'bag5.png', 'bag5', "256px", "256px", "0px", "0px", 1);
        bagImages[5] = utilsCode.createSimpleImage(folder, 'bag6.png', 'bag6', "256px", "256px", "0px", "0px", 1);
        //Defining variables for the scene 3D
        camera = new THREE.PerspectiveCamera(20, parent.offsetWidth / canvasHeight, mobile? 200 : 50, 10000);
        camera.position.z = ratio;
        duck = new THREE.Object3D();
        duck.position.y = -300;
        scene = new THREE.Scene();
        scene.add(duck);
        posHelper = new THREE.Object3D();
        raycaster = new THREE.Raycaster();
        //Create the gradient background for the world
        backgroundMaterial = new THREE.ShaderMaterial({
            uniforms: {
                aspect: {type: "f", value: parent.offsetWidth / canvasHeight}
            },
            vertexShader: 'precision highp float; varying vec2 vText; void main() {vec2 pos = 2. * position.xy; vText = pos; gl_Position = vec4(pos, 1., 1.0);}',
            fragmentShader: "precision highp float; varying vec2 vText; void main() {gl_FragColor = vec4(mix(vec3(1., 1., 1.), vec3(0.353, 0.557, 0.804), clamp(0.5 * (vText.y + 1.), 0., 1.)), 1.0 );}"
        });
        background = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), backgroundMaterial);
        scene.add(background);
        //Load the cloud texture and when is ready I start loading all the assets for the duck
        var texture = THREE.ImageUtils.loadTexture(folder + 'cloud.png', THREE.UVMapping, function () {
            Intro.startLoader();
            startDuckLoad();
            startBuildingsLoad();
            cloudReady = true;
        });
        //This is the material for the smoke trail (the one that goes out from the jetpack)
        smokeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "uHeight": {type: "f", value: canvasHeight},
                "map": {type: "t", value: texture}
            },
            vertexShader: "precision highp float; varying float posZ; uniform float uHeight; void main() {gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); posZ = position.z; float scaler = smoothstep(0., 1., abs(uHeight - posZ) / 400.); gl_PointSize = max(20. * (1. - scaler), 5.);}",
            fragmentShader: "precision highp float; uniform sampler2D map; uniform float uHeight; varying float posZ; varying float scaler; void main() {gl_FragColor = texture2D(map, gl_PointCoord); float scaler = clamp(abs(uHeight - posZ) / 3000., 0., 1.); gl_FragColor.rgb *=  0.06 * (1. - scaler); gl_FragColor.a *=  0.5 * (1. - scaler); scaler = clamp(abs(uHeight - posZ) / 10., 0., 1.); gl_FragColor.rgb *= scaler; gl_FragColor.a *= scaler;}"
        });
        smokeMaterial.transparent = true;
        smokeMaterial.blending = THREE.AdditiveBlending;
        smokeMaterial.depthWrite = false;
        var geometry = new THREE.Geometry();
        geometry.dynamic = true;
        for (i = 0; i < totalSmoke; i++) {
            var vertex = new THREE.Vector3();
            vertex.life = Math.floor(i / 30);
            geometry.vertices.push(vertex);
        }
        smoke = new THREE.PointCloud(geometry, smokeMaterial);
        smoke.frustumCulled = false;
        //This is where the trees are generated
        var plane = new THREE.PlaneBufferGeometry(64, 64);
        //Load the cloud texture and when is ready I start loading all the assets for the duck
        var treeTexture = THREE.ImageUtils.loadTexture(folder + 'tree.png', THREE.UVMapping, function () {
            treeTextureReady = true;
        });
        //Simple trees
        treesContainer = new THREE.Object3D();
        trees = [];
        for (var i = 0; i < 200; i++) {
            var mat = new THREE.ShaderMaterial({
                uniforms: {
                    "map": {type: "t", value: treeTexture},
                    "uHeight": {type: "f", value: canvasHeight},
                    "uDuckZ": {type: "f", value: duck.position.z},
                    "color": {
                        type: "v4",
                        value: new THREE.Vector4(0.6 + 0.4 * Math.random(), 0.6 + 0.4 * Math.random(), 0.6 + 0.4 * Math.random(), 1)
                    }
                },
                vertexShader: "precision mediump float; varying vec2 vText; void main() {vText = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}",
                fragmentShader: "precision mediump float; uniform sampler2D map; uniform vec4 color; uniform float uHeight; uniform float uDuckZ; varying vec2 vText; void main() {gl_FragColor = texture2D(map, vText) * color; vec3 backgroundColor = vec3(mix(vec3(1., 1., 1.), vec3(0.353, 0.557, 0.804) , clamp((gl_FragCoord.y / uHeight), 0., 1.))); gl_FragColor.rgb = mix( 1.48 * gl_FragColor.rgb, backgroundColor, clamp(uDuckZ, 0., 1.));}",
                transparent: true
            });
            mat.needsUpdate = true;
            mat.depthWrite = false;
            trees[i] = new THREE.Mesh(plane, mat);
            var width = 300;
            trees[i].position.x = 4 * width * (2 * Math.random() - 1);
            trees[i].position.y = -Math.random() * 100 - 330;
            trees[i].position.z = Math.floor(50 * i);
            trees[i].scale.set(6 + 4 * Math.random(), 6 + 3 * Math.random(), 6);
            treesContainer.add(trees[i]);
        }
        //This is where the clouds are generated
        clouds = [];
        cloudsHolder = new THREE.Object3D();
        for (var i = 0; i < 300; i++) {
            var mat = new THREE.ShaderMaterial({
                uniforms: {
                    "map": {type: "t", value: texture},
                    "uHeight": {type: "f", value: canvasHeight},
                    "uDuckZ": {type: "f", value: duck.position.z},
                    "uAlpha": {type: "f", value: 1}
                },
                vertexShader: "precision mediump float; varying vec2 vText; void main() {vText = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}",
                fragmentShader: "precision mediump float; uniform float uAlpha; uniform sampler2D map; uniform float uHeight; uniform float uDuckZ; varying vec2 vText; void main() {gl_FragColor =texture2D( map, vText ); gl_FragColor.a *= uAlpha; vec3 backgroundColor = vec3(mix(vec3(1., 1., 1.), vec3(0.353, 0.557, 0.804) , clamp((gl_FragCoord.y / uHeight), 0., 1.))); gl_FragColor.rgb = mix( gl_FragColor.rgb, backgroundColor, clamp(uDuckZ, 0., 1.));}",
                transparent: true
            });
            mat.needsUpdate = true;
            mat.depthWrite = false;
            clouds[i] = new THREE.Mesh(plane, mat);
            var width = 300;
            clouds[i].position.x = 1.5 * width * (2 * Math.random() - 1);
            clouds[i].position.y = -Math.random() * Math.random() * 100 - 130;
            clouds[i].position.z = -600 + Math.floor(50 * i);
            clouds[i].rotation.z = Math.random() * Math.PI;
            clouds[i].scale.set(5 + 4 * Math.random() * Math.random(), 4, 4);
            cloudsHolder.add(clouds[i]);
        }
        scene.add(cloudsHolder);
        renderer.setClearColor(backgroundColor, 1);
        renderer.clear(backgroundColor);
        renderer.setSize(parent.offsetWidth, canvasHeight);
        parent.appendChild(renderer.domElement);
        //These are the usual events for interaction.
        renderer.domElement.addEventListener('touchstart', onTouchStart);
        renderer.domElement.addEventListener('touchend', onTouchEnd);
        renderer.domElement.addEventListener('touchmove', onTouchMove);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onMouseDown, false);
        renderer.domElement.addEventListener('mouseup', onMouseUp, false);
        document.addEventListener('mouseout', onMouseOut, false);
        window.addEventListener('resize', onWindowResize, false);
    }
    //This function evaluates the total amount of data loaded from the different parts of the duck
    var onProgress = function (id, loaded) {
        amountLoaded[id] = loaded;
        var totalLoaded = 0;
        for (var i = 0; i < amountLoaded.length; i++) {
            totalLoaded += amountLoaded[i];
        }
        Intro.updateProgressBar(Math.floor(totalLoaded * 100 / 5532617));
    };
    //This function is used to load the buildings
    function startBuildingsLoad() {
        var assets = [
            folder + 'building_01.js',
            folder + 'building_02.js',
            folder + 'building_03.js',
            folder + 'building_04.js',
            folder + 'building_06.js',
            folder + 'building_07.js'
        ];
        var sizes = [400, 400, 400, 850, 850, 850];
        buildings = [];
        buildingGeometries = [];
        buildingLoaded = 0;
        buildingsContainer = new THREE.Object3D();
        //Loading of the geometries
        buildingLoaders = [];
        var totalBuildings = 0;
        var houses = THREE.ImageUtils.loadTexture(folder.concat('building_houses.jpg'), THREE.UVMapping, function () {
            houseTextureReady = true;
        });
        var offices = THREE.ImageUtils.loadTexture(folder.concat('building_offices.jpg'), THREE.UVMapping, function () {
            officeTextureReady = true;
        });
        for(var i = 0; i < assets.length; i++) {
            buildingLoaders[i] = new THREE.JSONLoader();
            buildingLoaders[i].load(assets[i], i + 100, function() {}, function (object) {
                buildingGeometries[buildingLoaded] = object;
                buildingLoaded ++;
                //All the geometries are loaded
                if(buildingLoaded == assets.length) {
                    var bands = [];
                    for(var j = 0; j < 12; j++) {
                        var side = 0;
                        bands[j] = new THREE.Object3D();
                        while(side < 6000) {
                            //Building material
                            var buildingOfficeMaterial = new THREE.ShaderMaterial({
                                uniforms: {
                                    "map": {type: "t", value: Math.random() > 0.5 ? houses : offices},
                                    "uHeight": {type: "f", value: canvasHeight},
                                    "uDuckZ": {type: "f", value: duck.position.z},
                                    "color": {
                                        type: "v4",
                                        value: new THREE.Vector4(0.95 + 0.05 * Math.random(), 0.95 + 0.05 * Math.random(), 0.95 + 0.05 * Math.random(), 1)
                                    }
                                },
                                vertexShader: "precision mediump float; varying vec2 vText; void main() {vText = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}",
                                fragmentShader: "precision mediump float; uniform sampler2D map; uniform float uHeight; uniform float uDuckZ; uniform vec4 color; varying vec2 vText; void main() {gl_FragColor = texture2D(map, vText) * color; vec3 backgroundColor = vec3(mix(vec3(1., 1., 1.), vec3(0.353, 0.557, 0.804) , clamp((gl_FragCoord.y / uHeight), 0., 1.))); gl_FragColor.rgb = mix(gl_FragColor.rgb, backgroundColor, clamp(uDuckZ, 0., 1.));}",
                                transparent: true
                            });
                            buildingOfficeMaterial.needsUpdate = true;
                            var bg = Math.floor(5 * Math.random());
                            if ((bg == 0 || bg == 2) && Math.random > 0.2 ) bg = Math.floor(5 * Math.random());
                            buildings[totalBuildings] = new THREE.SkinnedMesh(buildingGeometries[bg], buildingOfficeMaterial);
                            buildings[totalBuildings].scale.set(11 + 2 * Math.random(), 5 + 5 * Math.random(), 12);
                            buildings[totalBuildings].material.side = THREE.DoubleSide;
                            bands[j].add(buildings[totalBuildings]);
                            buildings[totalBuildings].rotation.set(0, 0.2 * Math.random() * (Math.random() > 0.5 ? -1 : 1), 0);
                            buildings[totalBuildings].position.set(side, ((bg == 0) ? - 1450 : -1200) - 50 * Math.random(), 450 * (j));
                            side += sizes[bg];
                            totalBuildings ++;
                        }
                        bands[j].position.x = - side * (0.5 + 0.1 * Math.random() * (Math.random() > 0.5 ? -1 : 1));
                        buildingsContainer.add(bands[j]);
                    }
                }
            });
        }
    }
    //this function is fired when the trees texture is loaded.
    function startDuckLoad() {
        Intro.animateDuck(true);
        Intro.animateLoaderDuck();
        var duckTexture1 = THREE.ImageUtils.loadTexture(folder + 'AlternateBody_Texture.png', THREE.UVMapping, function () {
            duckTexturesLoaded ++;
            if(duckTexturesLoaded == 5) loadDuckMeshes();
        });
        var duckTexture2 = THREE.ImageUtils.loadTexture(folder + 'jetPack_Texture.jpg', THREE.UVMapping, function () {
            duckTexturesLoaded ++;
            if(duckTexturesLoaded == 5) loadDuckMeshes();
        });
        var duckTexture3 = THREE.ImageUtils.loadTexture(folder + 'Beak_Texture.jpg', THREE.UVMapping, function () {
            duckTexturesLoaded ++;
            if(duckTexturesLoaded == 5) loadDuckMeshes();
        });
        var duckTexture4 = THREE.ImageUtils.loadTexture(folder + 'Feet_Texture.jpg', THREE.UVMapping, function () {
            duckTexturesLoaded ++;
            if(duckTexturesLoaded == 5) loadDuckMeshes();
        });
        var duckTexture5 = THREE.ImageUtils.loadTexture(folder + 'Accessories_Texture_Money_Alt.jpg', THREE.UVMapping, function () {
            duckTexturesLoaded ++;
            if(duckTexturesLoaded == 5) loadDuckMeshes();
        });
        mats[0] = new THREE.MeshBasicMaterial({map: duckTexture1});
        mats[1] = new THREE.MeshBasicMaterial({map: duckTexture2});
        mats[2] = new THREE.MeshBasicMaterial({map: duckTexture3});
        mats[3] = new THREE.MeshBasicMaterial({map: duckTexture4});
        mats[4] = new THREE.MeshBasicMaterial({map: duckTexture5});
        mats[5] = mats[4];
        mats[6] = mats[4];
        mats[7] = mats[4];
        //Start the animation.
        animate();
    }
    //After the images are loaded the meshes are loaded.
    function loadDuckMeshes() {
        var pieces = [
            folder + 'Duck_Body.js',
            folder + 'Duck_Jetpack.js',
            folder + 'Duck_Beak.js',
            folder + 'Duck_Feet.js',
            folder + 'Duck_JetpackHarness.js',
            folder + 'Duck_Helmet_NoHeadMovement.js',
            folder + 'Duck_Bag.js',
            folder + 'Duck_Scarf_NoHeadMovement.js',
        ]
        for (var i = 0; i < pieces.length; i++) {
            amountLoaded[i] = 0;
            loaders[i] = new THREE.JSONLoader();
            loaders[i].load(pieces[i], i, onProgress, function (object) {
                var mesh = new THREE.SkinnedMesh(object, this);
                mesh.material.skinning = true;
                mesh.material.side = THREE.DoubleSide;
                duck.add(mesh);
                for (var i = 0; i < bones.length; i++) {
                    bones[i].position.setX(0);
                }
                mesh.name = mesh.geometry.name;
                if ((mesh.name == "helmet" || mesh.name == "scarf") && mobile) mesh.scale.set(1.2, 1.02, 1.0);
                //Generate the bone list for the neck and create the final structure.
                if (mesh.name == "body") {
                    mesh.material.side = THREE.FrontSide;
                    var bonesStructure = [];
                    bonesStructure[0] = "neck_joint_01";
                    bonesStructure[1] = "neck_joint_02";
                    bonesStructure[2] = "neck_joint_03";
                    bonesStructure[3] = "neck_joint_04";
                    bonesStructure[4] = "neck_joint_05";
                    bones = IK.getBoneList(mesh, bonesStructure);
                    mesh.material.transparent = true;
                    bonesStructure = [];
                    bonesStructure[0] = "head_joint";
                    headBone = IK.getBoneList(mesh, bonesStructure)[0];
                    difference2 = headBone.getWorldPosition().clone();
                    difference2 = bones[bones.length - 1].worldToLocal(difference2);
                    headBone.position.copy(difference2);
                    bones[bones.length - 1].add(headBone);
                    bones.push(headBone);
                    helpers[0] = new THREE.SkeletonHelper(mesh);
                    helpers[0].material.linewidth = 5;
                    for (i = 0; i < bones.length - 1; i++) {
                        distances[i] = bones[i + 1].getWorldPosition().distanceTo(bones[i].getWorldPosition());
                        bonesPositions[i] = bones[i].getWorldPosition().clone();
                        bonesDistance += distances[i];
                    }
                }
                //Obtain the joints used for the beak.
                if (mesh.name == 'beak') {
                    bonesStructure = [];
                    bonesStructure[0] = "head_joint";
                    beakBone = IK.getBoneList(mesh, bonesStructure)[0];
                    bonesStructure = [];
                    bonesStructure[0] = "bottom_jaw_joint";
                    jawBone = IK.getBoneList(mesh, bonesStructure)[0];
                }
                //Obtain the joints used to place the particle steams when the duck is flying
                if (mesh.name == "jetpack") {
                    var bonesStructure = [];
                    bonesStructure[0] = "jet_joint1";
                    bonesStructure[1] = "jet_joint2";
                    jetpackBones = IK.getBoneList(mesh, bonesStructure);
                }
                //Initiate the animation
                var animation = new THREE.Animation(mesh, object.animation);
                animation.play();
                animations[counter] = animation;
                counter++;
                if (counter == pieces.length) {
                    Intro.animateDuck(false);
                    duck.position.setX(0);
                    duck.position.setY(-300);
                    duckReady = true;
                    //Here I should call the intro
                    Intro.showInstuctions(mobile, renderer.domElement.width);
                }
            }.bind(mats[i]));
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        var scrollTop = Math.max($("body").scrollTop(), $("html").scrollTop());
        if (!bagActivated && scrollTop == 0) bagActivated = true;
        //This is where the animation for the bags is defined.
        if (duckReady && bagActivated && Intro.ready) {
            if (!activateScroll) {
                var scrolledDistance = 1.1 * renderer.domElement.height;
                activateScroll = scrollTop > scrolledDistance;
            } else {
                if (!bagsAnimation) {
                    bagsAnimation = true;
                    for (var i = 0; i < duck.children.length; i++) {
                        if (duck.children[i].name == "bags") {
                            duck.remove(duck.children[i]);
                            bagHolder.css("top", "20%");
                            bagHolder.css("opacity", 0);
                            parameters.one = 0;
                            parameters.image = 0;
                            bagHolder.append(bagImages[0]);
                            TweenMax.to(parameters, 1, {
                                one: 1, ease: "Linear.easeNone", onUpdate: function () {
                                    bagHolder.css("opacity", 1);
                                    var partialTop = parameters.one * ($('.w_footer').offset().top - 200);
                                    
							        if($(window).width()<620){
							        	partialTop = ($('.w_footer').offset().top - 270);
							        }
                                    bagHolder.css("top", String(partialTop) + "px");
                                    bagHolder.empty();
                                    currentBagImage += 0.5;
                                    bagHolder.append(bagImages[Math.floor(currentBagImage)]);
                                    if (currentBagImage == bagImages.length - 2) currentBagImage = 0;
                                }, onComplete: function () {
                                    bagHolder.empty();
                                    bagHolder.append(bagImages[5]);
                                }
                            });
                            break;
                        }
                    }
                }
            }
        }
        //This controls the interaction for the duck, it occurs when all the images and pieces are loaded
        if (duckReady) {
            duck.add(headBone);
            var delta = clock.getDelta();
            animationCounter += delta;
            if (mouseInCanvas) {
                if (down) {
                    var vector = new THREE.Vector3(currentMouseX, currentMouseY, 1).unproject(camera);
                    raycaster.set(camera.position, vector.sub(camera.position).normalize());
                    var intersects = raycaster.intersectObjects(duck.children);
                    if (intersects.length > 0) {
                        gliding = true;
                        cameraSeparation = ratio;
                        acelerator = 0.01;
                        scene.add(smoke);
                        if (glidingCycle == 1 && gliding == false) {
                            animationInit = glidingInit;
                            if (animationEnd > glidingEnd) {
                                animationInit = glidingInit;
                                glidingCycle++;
                                gliding = true;
                                cameraSeparation = ratio;
                                acelerator = 0.01;
                            }
                        } else {
                            animationInit = glidingInit;
                        }
                        if (glidingCycle == 0) {
                            animationEnd = 5;
                            animationInit = 0
                            if (animationCounter >= 5) {
                                glidingCycle++;
                            }
                        } else {
                            animationEnd = glidingEnd;
                        }
                    }
                    flappingCycle = 0;
                } else {
                    gliding = false;
                    acelerator = 0.06;
                    cameraSeparation = 1.15 * ratio;
                    animationInit = flyingInit;
                    animationEnd = flyingEnd;
                    glidingCycle = 0;
                    flappingCycle++;
                }
            }
            for (var i = 0; i < animations.length; i++) {
                animations[i].resetBlendWeights();
                animations[i].update(animationCounter);
            }
            if (animationCounter > animationEnd) {
                animationCounter = animationInit;
                for (var i = 0; i < animations.length; i++) {
                    animations[i].resetBlendWeights();
                    animations[i].play(animationInit);
                }
            }
            //This is the unprojection of the mouse position to place it inside the 3D world.
            var desiredPosition = new THREE.Vector3().set(currentMouseX, currentMouseY, 0.5);
            desiredPosition.unproject(camera);
            cameraDistance += acelerator * (cameraSeparation - cameraDistance);
            var dir = desiredPosition.sub(camera.position).normalize();
            var distance = -cameraDistance / dir.z;
            var pos = (camera.position.clone().add(dir.multiplyScalar(distance)));
            posHelper.position.copy(pos);
            headBone.position.copy(difference2);
            try {
                bones[bones.length - 2].add(headBone);
            } catch (e) {
            }
            var exteriorPos = pos.clone();
            exteriorPos.z += mobile ? 55 : 42;
            duck.position.x += 0.06 * (pos.x - duck.position.x);
            duck.position.y += 0.03 * ((pos.y - 20) - duck.position.y);
            duck.rotation.z += 0.02 * (currentMouseX - duck.rotation.z);
            //Evaluate the solver for the neck.
            IK.solve(bones, exteriorPos, distances, bonesDistance, bonesPositions);
            bones[0].updateMatrixWorld();
            for (var i = 0; i < duck.children.length; i++) {
                if (duck.children[i].name == "beak") {
                    bones[bones.length - 2].add(beakBone);
                    beakBone.position.copy(headBone.position);
                    beakBone.quaternion.copy(headBone.quaternion);
                    beakBone.updateMatrix();
                }
                if (duck.children[i].name == "helmet") {
                    var helmet = duck.children[i];
                    headBone.add(helmet);
                    helmet.position.set(0, -58, -26);
                }
                if (duck.children[i].name == "scarf") {
                    var scarf = duck.children[i];
                    bones[2].add(scarf);
                    scarf.rotation.set(Math.PI / 2, 0, 0);
                    scarf.position.set(0, 18, -42);
                }
            }
            jawBone.rotation.set(0.2 + 0.3 * Math.cos(currentFrame * 3.), 0, 0);
            //Update the particle's positions depending on how away they are from the duck.
            var vertices = smoke.geometry.vertices;
            for (var i = 0; i < vertices.length; i++) {
                vertices[i].life += 1;
                if (vertices[i].life > totalSmoke / 30) {
                    vertices[i].life = 0;
                    if (gliding) vertices[i].copy(utilsCode.randomCilynderPoint(2, maxSpeed, jetpackBones), i);
                }
            }
            smoke.geometry.verticesNeedUpdate = true;
            smokeMaterial.uniforms.uHeight.value = duck.position.z;
        }
        //Move the duck and the camera forward
        addedSpeed = gliding ? maxSpeed : 4;
        speed += 0.02 * (addedSpeed - speed);
        duck.position.z += speed;
        camera.position.z = duck.position.z + cameraDistance;
        background.position.z += speed;
        //Reset the duck when it has been traveling too much
        if (duck.position.z > 10000) {
            var vertices = smoke.geometry.vertices;
            for (var i = 0; i < vertices.length; i++) {
                vertices[i].z -= 10000;
            }
            duck.position.z = 0;
            camera.position.z = cameraDistance;
            background.position.z = 0;
            for (var i = 0; i < trees.length; i++) {
                trees[i].position.z -= 10000;
            }
            for (var i = 0; i < clouds.length; i++) {
                clouds[i].position.z -= 10000;
            }
            for (var i = 0; i < buildings.length; i++) {
                buildings[i].position.z -= 10000;
            }
        }
        currentFrame -= 0.03;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        var buildingsFader = 5000;
        //Update the buildings.
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].position.z < duck.position.z - buildingsFader) buildings[i].position.z = 1000 + duck.position.z;
            buildings[i].material.uniforms.uHeight.value = (retina ? 2 : 1) * canvasHeight;
            buildings[i].material.uniforms.uDuckZ.value = Math.pow(utilsCode.clamp((duck.position.z - buildings[i].position.z) / buildingsFader, 0, 1), 5.5);
        }
        var treesFader = 4000;
        //Update the trees.
        for (var i = 0; i < trees.length; i++) {
            if (trees[i].position.z < duck.position.z - treesFader) trees[i].position.z = 800 + duck.position.z;
            trees[i].material.uniforms.uHeight.value = (retina ? 2 : 1) * canvasHeight;
            trees[i].material.uniforms.uDuckZ.value = Math.pow(utilsCode.clamp((duck.position.z - trees[i].position.z) / treesFader, 0, 1), 5.5);
        }
        if(treeTextureReady && officeTextureReady && houseTextureReady) {
            var alphaFrame = Math.pow(Math.abs(Math.cos(currentFrame * 0.1)), 3.5);
            if (alphaFrame > 0.998 && changeAmbient) {
                ambientCycle++;
                changeAmbient = false;
                if (ambientCycle == 0) scene.add(buildingsContainer);
                else {
                    if (ambientCycle % 2 == 0) {
                        scene.add(buildingsContainer);
                        scene.remove(treesContainer);
                    } else {
                        scene.add(treesContainer);
                        scene.remove(buildingsContainer);
                    }
                }
            }
            if (alphaFrame < 0.01) changeAmbient = true;
        } else {
            currentFrame = 0;
            alphaFrame = 1;
        }
        //Update the clouds.
        for (var i = 0; i < clouds.length; i++) {
            if (clouds[i].position.z < duck.position.z - 3000) clouds[i].position.z = 800 + duck.position.z;
            clouds[i].material.uniforms.uHeight.value = (retina ? 2 : 1) * canvasHeight;
            clouds[i].material.uniforms.uDuckZ.value = (duck.position.z - clouds[i].position.z) / 3000;
            clouds[i].material.uniforms.uAlpha.value = alphaFrame;
        }
        if (cloudReady) renderer.render(scene, camera);
    }
    /*
    * These are the different listeners used to generate the interaction with the duck,
    * usually mouseUp, mouseDown, mouseMove, touchStart, touchEnd, touchMove.
    *
    */
    function onTouchStart(e) {
        down = true;
        e.preventDefault();
    };
    function onTouchEnd(e) {
        down = false;
        if (mouseInCanvas) {
            maxSpeed += 8;
            maxSpeed = Math.min(maxSpeed, 60);
        }
        currentMouseX = 0;
        currentMouseY = 0;
        e.preventDefault();
    };
    function onMouseDown(e) {
        down = true;
        e.preventDefault();
    }
    function onMouseUp(e) {
        down = false;
        clicked = true;
        if (mouseInCanvas) {
            maxSpeed += 8;
            maxSpeed = Math.min(maxSpeed, 60);
        }
        e.preventDefault();
    }
    function onTouchMove(e) {
        e.preventDefault();
        var ev = {pageX: e.changedTouches[0].pageX, pageY: e.changedTouches[0].pageY};
        ev.preventDefault = function () {
        };
        onDocumentMouseMove(ev);
    }
    //Evaluates the position of the mouse inside the corresponding place (inside the canvas).
    function onDocumentMouseMove(event) {
        event.preventDefault();
        var obj = renderer.domElement;
        var e_posx = 0;
        var e_posy = 0;
        var m_posx, m_posy;
        if (obj.offsetParent) {
            do {
                e_posx += obj.offsetLeft;
                e_posy += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        mouseInCanvas = clicked && utilsCode.valueInside(event.pageX, e_posx, e_posx + renderer.domElement.width) && utilsCode.valueInside(event.pageY, e_posy, e_posy + renderer.domElement.height);
        var retinaMultiplier = retina ? 0.5 : 1;
        m_posx = event.pageX - e_posx;
        m_posy = event.pageY - e_posy;
        m_posx = utilsCode.clamp(m_posx, 0, retinaMultiplier * renderer.domElement.width);
        m_posy = utilsCode.clamp(m_posy, 0, retinaMultiplier * renderer.domElement.height);
        currentMouseX = 2 * (m_posx / (retinaMultiplier * renderer.domElement.width)) - 1;
        currentMouseY = -2 * (m_posy / (retinaMultiplier * renderer.domElement.height)) + 1;
        if (!Intro.ready || !mouseInCanvas) {
            currentMouseX = 0;
            currentMouseY = 0;
        }
    }
    //Function that executes when the user is outside the document.
    function onMouseOut(event) {
        currentMouseX = 0;
        currentMouseY = 0;
    }
    //Replace all the objects depending on the size of the screen, mainly used for the instructions at the init.
    function onWindowResize() {
        camera.aspect = parent.offsetWidth / canvasHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(parent.offsetWidth, canvasHeight);
        var partialTop = ($('.w_footer').offset().top - 200);
        
        if($(window).width()<620){
        	partialTop = ($('.w_footer').offset().top - 270);
        }
        
        bagHolder.css("top", String(partialTop) + "px");
        try{
            if (renderer.domElement.width > 800) {
                utilsCode.centerObject(mouseInstructions, "50%", "30%");
                utilsCode.centerObject(clickInstructions, "50%", "70%");
            } else {
                utilsCode.centerObject(mouseInstructions, "40%", "50%");
                utilsCode.centerObject(clickInstructions, "60%", "50%");
            }
        }
        catch(e) {
        }
    }
    //Function that executes when the user clicks outside the page
    $(window).blur(function() {
        currentMouseX = 0;
        currentMouseY = 0;
        clicked = false;
    });
    //Function that executes when the user clicks outside the page
    $(window).focus(function() {
        clicked = true;
    });
    return {
        //Init the canvas depending on the current webgl enabled state
        initExperience: function() {
            parent = document.getElementById("ndp_canvas_holder");
            bagHolder = $("#bag_holder");
            bagActivated = Math.max($("body").scrollTop(), $("html").scrollTop()) == 0;
            retina = window.devicePixelRatio > 1;
            touchDevice = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            //If the browser supports webgl
            if(evalWebGL()) {
                //Creation of the renderer
                renderer = new THREE.WebGLRenderer({antialiasing: true});
                if(renderer.supportsVertexTextures()) initWebGLExperience();
                else nonWebGLRoute();
            } else {
                nonWebGLRoute();
            }
        }
    }
})