

define([], function() {


    var ndpUtils = {

        //Function used to create a simple Image
        createSimpleImage: function(folder, src, id, width, height) {
            var salida = document.createElement('img');
            salida.src = folder +  src;
            salida.id = id
            salida.style.width = width;
            salida.style.height = height;
            return salida;
        },

        //Function used to create an image with positioning
        createImage: function(folder, src, id, width, height, top, left, opacity) {
            var salida = this.createSimpleImage(folder, src, id, width, height);
            salida.style.position = "absolute";
            salida.style.top = top;
            salida.style.left = left;
            salida.style.transform = "translate(-50%, -50%)";
            salida.style.webkitTransform = "translate(-50%, -50%)";
            salida.style.opacity = opacity;
            return salida;
        },

        //Function used to obtain a cookie for the page
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        },

        //Function used to evaluate if one value is inside two others
        valueInside: function(value, min, max) {
            return (value > min && value < max);
        },

        //Function used to clamp a value
        clamp: function(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        //Function used to center an object
        centerObject: function(object, top, left) {
            object.style.top = top;
            object.style.left = left;
            object.style.transform = "translate(-50%, -50%)";
            object.style.webkitTransform = "translate(-50%, -50%)";
        },

        //function used to obtain a random point inside a cilinder
        randomCilynderPoint: function(radius, maxSpeed, jetpackBones) {
            var angle = 2 * Math.PI * Math.random();
            var z = - Math.random() * maxSpeed;
            var x = radius * Math.cos(angle);
            var y = radius * Math.sin(angle);
            return (new THREE.Vector3(x, y, z).add(jetpackBones[Math.random() > 0.5 ? 0 : 1].getWorldPosition()));
        }
    }

    return ndpUtils;
});