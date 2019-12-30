
//Inverse Kinematics
define([], function() {

    function checkFromStructure(bone, bonesStructure) {
        var salida = false;
        for(var i = 0; i < bonesStructure.length; i ++) {
            if(bone.name == bonesStructure[i]) {
                salida = true;
                break;
            }
        }
        return salida;
    }

    //IK solver object
    var IK = {

        //Fabrik unrestricted solver for a list of bones.
        solve: function(structure, desiredEnd, distances, totalDistance, bonesPositions) {
            var maxIterations = 5;
            var desiredError = 0.1;
            var currentIteration = 0;
            var lastLink = structure.length - 1;
            var c = new THREE.Vector3().subVectors(desiredEnd, structure[0].getWorldPosition());
            var animationPositions = [];
            var originalPositions = [];

            for(var i = 0; i < structure.length; i ++) {
                originalPositions[i] = structure[i].position.clone();
                animationPositions[i] = structure[i].position.clone().normalize();
            }

            if (c.length() > totalDistance) {
                for (var i = 0; i < lastLink; i++) {
                    for (var k = 0; k < structure.length; k++) structure[k].updateMatrixWorld();
                    var ri = desiredEnd.distanceTo( bonesPositions[i]);
                    var lambda = distances[i] / ri;
                    var worldNewPosition = structure[i].getWorldPosition().clone().multiplyScalar((1 - lambda)).add(desiredEnd.clone().multiplyScalar(lambda));
                    var localNewPosition = structure[i].worldToLocal(worldNewPosition);
                    structure[i + 1].position.copy(localNewPosition);
                }
            }

            else {
                var b = structure[0].position.clone();
                while (desiredEnd.clone().sub(structure[lastLink].getWorldPosition()).length() > desiredError && currentIteration++ < maxIterations) {
                    structure[0].updateMatrixWorld();

                    var localTarget = desiredEnd.clone();
                    structure[lastLink - 1].worldToLocal(localTarget);
                    structure[lastLink].position.copy(localTarget);

                    for (var i = lastLink - 1; i >= 0; i--) {
                        for (var k = 0; k < structure.length; k++) structure[k].updateMatrixWorld();
                        var ri = structure[i + 1].getWorldPosition().distanceTo(structure[i].getWorldPosition());
                        var lambda = distances[i] / ri;
                        var worldNewPosition = structure[i + 1].getWorldPosition().clone().multiplyScalar((1 - lambda)).add(structure[i].getWorldPosition().clone().multiplyScalar(lambda));
                        var localNewPosition = structure[Math.max(i - 1, 0)].worldToLocal(worldNewPosition);
                        structure[i].position.copy(localNewPosition);
                    }

                    structure[0].updateMatrixWorld();
                    structure[0].position.copy(b);

                    for (var i = 0; i < lastLink; i++) {

                        structure[0].updateMatrixWorld();
                        var ri = structure[i + 1].getWorldPosition().distanceTo(structure[i].getWorldPosition());
                        var lambda = distances[i] / ri;
                        var worldNewPosition = structure[i].getWorldPosition().clone().multiplyScalar((1 - lambda)).add(structure[i + 1].getWorldPosition().clone().multiplyScalar(lambda));
                        var localNewPosition = structure[i].worldToLocal(worldNewPosition);
                        structure[i + 1].position.copy(localNewPosition);
                    }

                    for (var i = 0; i < structure.length; i++) bonesPositions[i] = structure[i].getWorldPosition().clone();
                }
            }

            var directions = [];
            for (var i = 0; i < structure.length - 1; i++) {
                directions[i] = structure[i + 1].getWorldPosition().clone().sub(structure[i].getWorldPosition()).normalize();
            }

            for(var i = 0; i < structure.length; i ++) {
                structure[i].quaternion.set(0, 0, 0, 1);
                structure[i].position.copy(originalPositions[i].clone());
            }

            var direction, angle, axis;
            for (var i = 0; i < structure.length - 1; i++) {
                structure[0].updateMatrixWorld();
                direction = directions[i];
                angle = animationPositions[i].angleTo(direction);
                axis = animationPositions[i].clone().cross(direction);
                structure[i].quaternion.set(0, 0, 0, 1);
                structure[i].quaternion.setFromAxisAngle(axis, angle);
                if (i > 0) {
                    for (var j = 0; j < i; j++) {
                        structure[i].quaternion.multiply(structure[j].quaternion.clone().inverse());
                    }
                }
            }

            structure[structure.length - 1].quaternion.set(0, 0, 0, 1);
            structure[structure.length - 1].quaternion.setFromAxisAngle(axis, -.5 * angle );

            structure[0].updateMatrixWorld();

        },

        //Function used to evaluate the bones required for a mesh.
        getBoneList: function( object, bonesStructure) {
            var boneList = [];
            if ( object instanceof THREE.Bone && checkFromStructure(object, bonesStructure)) {
                boneList.push( object );
            }
            for ( var i = 0; i < object.children.length; i ++ ) {
                boneList.push.apply( boneList, this.getBoneList( object.children[ i ], bonesStructure ) );
            }
            return boneList;
        }
    }

    return IK;
});