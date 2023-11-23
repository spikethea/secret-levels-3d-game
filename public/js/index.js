//GLOBAL VARIABLES
    
    //User Interface

    let livesCounter = document.getElementById('lives');
    let lives = 5;
        //Media Queries
        function isTouchDevice() {
            return (('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0));
        }

    let gameOverScreen = document.getElementById('game-over');

    //touch events
    let touchButton = document.getElementById('button');
    let touchcontrols = false;//Create a html button to toggle this!
    let buttonArea = false;
    let touchMoving = false;

    let initialTouch = {x:0, y:0};
    let movingTouch = {x:0, y:0};
    let touchDistance = {x:0, y:0};

    if (isTouchDevice()) {
        touchcontrols = true;
        console.log("Touch Controls");
        console.log(window.innerWidth);
    }

    //Stats.js
    let stats = new Stats;
    stats.showPanel( 0 );
	//document.body.appendChild( stats.dom );

    //scene
    let camera, scene, renderer;
    let geometry, material, cube, sprite, slider, character;
    let clock, time;
    let fov = 70;

    let ball, platform;
    let playerPosition,followPosition,cameraPosition;

    //Physics World
        let physicsWorld;
        let rigidBodies = [], tmpTrans;
        let ballObject = null, planeObject = null;
        
        let moveScaleFactor = 100;// The Magnitude of the impulse
        let canJump = false;
        let initialTime = 0;
        let moveDirection = { left:0, right:0, forward: 0, back: 0, jump: false };
        let manifoldCount = 0;

        const STATE = {DISABLE_DEACTIVATION: 4};
        const FLAGS = { CF_KINEMATIC_OBJECT: 2 };

        // Temp Variables
        let tmpPos = new THREE.Vector3(), tmpQuat = new THREE.Quaternion();
        let ammoTmpPos = null, ammoTmpQuat = null;
        // Directions
        let childDirection = 1;
        let stepDirection = 1;
        

    //Raycaster (Non-Functional)
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let intersects;
    let INTERSECTED;

    let colGroupPlane = 1, colGroupRedBall = 2, colGroupGreenBall = 4;

let xForce = 0;
let yForce = 0;

let xSpeed = 0;
let ySpeed = 0;
let zSpeed = 0;

Ammo().then( start ) 

function start () {
    tmpTrans = new Ammo.btTransform();
    ammoTmpPos = new Ammo.btVector3();
    ammoTmpQuat = new Ammo.btQuaternion();
    setupPhysicsWorld();
    init();
    animate();

    
}

 
function setupPhysicsWorld () {
    let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache    = new Ammo.btDbvtBroadphase(),
        solver                  = new Ammo.btSequentialImpulseConstraintSolver();

        physicsWorld           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, -15, 0));
}

function createBlock(){
    
    let pos = {x: 0, y: 0, z: 0};
    let scale = {x: 50, y: 2, z: 50};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = planeObject =  new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0x26803e, shininess: 10}));// Handler to access the ball globally.

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(1);

    physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
}

function createBlock2(){
    
    let pos = {x: 0, y: 8, z: -100};
    let scale = {x: 30, y: 2, z: 30};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = planeObject =  new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));// Handler to access the ball globally.

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(1);

    physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
}

function createBlock3(){
    
    let pos = {x: 0, y: 30, z: -180};
    let scale = {x: 30, y: 2, z: 30};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = planeObject =  new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));// Handler to access the ball globally.

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(1);

    physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
}

function createEndBlock(){
    
    let pos = {x: 0, y: 30, z: -325};
    let scale = {x: 20, y: 2, z: 20};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;

    //threeJS Section
    let blockPlane = planeObject =  new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xa0afa4}));// Handler to access the ball globally.

    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    scene.add(blockPlane);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(4);
    body.setRollingFriction(1);

    physicsWorld.addRigidBody( body, colGroupPlane, colGroupRedBall );
}


function createBall(){
    
    let pos = {x: 0, y: 20, z: 0};
    let scale = {x: 1, y: 1, z: 1};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;


    //threeJS Section
    let ball = ballObject = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: true, opacity: 0, transparent: true,}));

    ball.position.set(pos.x, pos.y, pos.z);
    ball.scale.set(scale.x, scale.y, scale.z);
    
    ball.castShadow = true;
    ball.receiveShadow = true;

    scene.add(ball);
    ball.name = "player";

    playerPosition = ball.position;

    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );


    //let cylinder = new btCylinderShape(btVector3(1,1.7,1));
    //let sphere1 = new btCylinderShape(btVector3(1,1.7,1));
    //let sphere2 = new btCylinderShape(btVector3(1,1.7,1));
    
    let colShape = new Ammo.btCapsuleShape(scale.x * 0.5, scale.y * 0.5);// radius, height
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );

    body.setFriction(1);
    body.setRollingFriction(1);
    body.setActivationState( STATE.DISABLE_DEACTIVATION );
    body.setDamping(0.8, 0.2);// Think of this as a MaxSpeed / Air Resistance
    body.setAngularFactor(new Ammo.btVector3( 0, 0, 0 ))// locks the angular degrees to 0, so that the character is always facing upwards

    physicsWorld.addRigidBody( body, colGroupRedBall, colGroupPlane | colGroupGreenBall  );
    
    ball.userData.physicsBody = body;// physicsBody is the assign identification of the body of the Physics World into three.js' UserData. This syncs three.js with the result of the Physics simulation. It can be used to compare against manifolds to detect collision with other RigidBodys.
    rigidBodies.push(ball);// pushes the Three.js Object into the Rigid Bodies Array
}

function moveBall () { // TODO: Lower Mid-Air Speed 

    
    let jumpScaleFactor = 10;
    let moveX = 0, moveY = 0, moveZ = 0;
    
    
    let physicsBody = ballObject.userData.physicsBody;// physicsBody is set as the physics world body of our three.js object. It is hidden in the user Data so we are just destructuring.
    let jumpVector = new Ammo.btVector3( 0, 20, 0);
    
    //let rotationMatrix = new Ammo.btMatrix3x3();

    let jump = moveDirection.jump;
    if (canJump && jump) {
        physicsBody.applyCentralImpulse(jumpVector);
        canJump = false;
        initialTime = time;
        console.log("jump");
    }

    let threeVector = new THREE.Vector3( moveX, moveY, moveZ  );

    if (moveDirection.left == 1) {
        threeVector.x -= 1;
    }

    if (moveDirection.right == 1) {
        threeVector.x += 1;
    }

    if (moveDirection.forward == 1) {
        threeVector.z -= 1;
    }

    if (moveDirection.back == 1) {
        threeVector.z += 1;
    }

    
    threeVector.normalize();
    let resultantForce = new Ammo.btVector3( threeVector.x, threeVector.y, threeVector.z );
    //resultantForce.normalize();
    if (manifoldCount > 0 ) {resultantForce.op_mul(moveScaleFactor)} else resultantForce.op_mul(jumpScaleFactor);
    


    //if (physicsBody.getVelocity().getX())
    physicsBody.applyForce(resultantForce);

    if (ballObject.position.y < -30) Reposition();// Teleports the user back to the main point.

    //let speed = physicsBody.getMotionState();
    //physicsBody.getLinearVelocity is the Speed, can be used to max speed by disabling
}

function Reposition () {
    if (lives > 0) {
        lives -= 1;
        document.getElementById("lives").innerHTML = lives;
    } else {
        gameOver();
    }
    let physicsBody = ballObject.userData.physicsBody

    let pos = {x: 0, y: 20, z: 0};
    let scale = {x: 1, y: 2, z: 1};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    console.log("fell down");
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    physicsBody.setWorldTransform(transform);
    motionState.setWorldTransform(transform);
}

function followPlayer () {
    followPosition = new THREE.Vector3(playerPosition.x, playerPosition.y+5, playerPosition.z+10);
    camera.position = cameraPosition
    

    if (camera.position.distanceTo(followPosition) > 5) {


        camera.position.lerp(followPosition, 0.03);
    }

}

function createMaskBall(){
    
    let pos = {x: 1, y: 30, z: 0};
    let radius = 2;
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 1;

    //threeJS Section
    let ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius), new THREE.MeshPhongMaterial({color: 0x00ff08}));

    ball.position.set(pos.x, pos.y, pos.z);
    
    ball.castShadow = true;
    ball.receiveShadow = true;

    scene.add(ball);


    //Ammojs Section
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    let motionState = new Ammo.btDefaultMotionState( transform );

    let colShape = new Ammo.btSphereShape( radius );
    colShape.setMargin( 0.05 );

    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( mass, localInertia );

    let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );


    physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall);
    
    ball.userData.physicsBody = body;
    rigidBodies.push(ball);
}

function createGrid () {
    let pos = {x: -22.5, y: -5, z: -75};
    let scale = {x: 10, y: 10, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;
    let boxes = 4;
    let dist = 15;

    const textureMap = new THREE.TextureLoader().load( "../assets/images/cube.png" );

    var grid = new THREE.Group();
    let gridUp = gridUpGroup = new THREE.Group();
    var gridDown = new THREE.Group();

    grid.add(gridUp);
    grid.add(gridDown);


    for(let i = 0; i < boxes; i++) {

        for(let j = 0; j < boxes; j++) {

            //ThreeJS Section
            let box = new THREE.Mesh(new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z), new THREE.MeshPhongMaterial({map: textureMap}));
            box.position.set(pos.x+(i*dist), pos.y, pos.z+(j*dist));
            box.receiveShadow = true;
            grid.add(box);// Adding

            //Ammojs Section

            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin( new Ammo.btVector3( pos.x+(i*dist), pos.y, pos.z+(j*dist) ) );
            transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
            let motionState = new Ammo.btDefaultMotionState( transform );
        
            let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
            colShape.setMargin( 0.05 );
        
            let localInertia = new Ammo.btVector3( 0, 0, 0 );
            colShape.calculateLocalInertia( mass, localInertia );
        
            let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
            let body = new Ammo.btRigidBody( rbInfo );
        
            body.setFriction(4);
            body.setRollingFriction(1);

            body.setActivationState( STATE.DISABLE_DEACTIVATION );
            body.setCollisionFlags( FLAGS.CF_KINEMATIC_OBJECT );
        
            physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall );
            box.userData.physicsBody = body;
        }
    }

    scene.add(grid);
    
    gridUp.add(grid.children[15]);
    gridUp.add(grid.children[13]);
    gridUp.add(grid.children[11]);
    gridUp.add(grid.children[9]);
    gridUp.add(grid.children[6]);
    //gridUp.add(grid.children[12]);
    gridUp.add(grid.children[4]);
    
    let child = gridChild = grid.children[0];
    child.children[0].material.color.setHex(0x0000ff);
    
    //TweenMax.from(childBody.position, 25, {y:20});

}

function moveGrid(){

    //console.log(gridChild);

    let scalingFactor = 0.02;

    let moveX =  0;
    let moveZ =  0;
    let moveY

    
    for (let i = 0; i < gridChild.children.length; i++) {

        /*if (time < 2) {
            childDirection = 1;
        } else if (2 < time && time < 5) {
            childDirection = 0;
        } else if (5 < time && time < 7) {
            childDirection = -1;
        } else if (7 < time && time < 10) {
            childDirection = 0;
        }*/

        if (gridChild.children[i].position.y < -5) {
            childDirection = 1;
        } else if (gridChild.children[i].position.y > 4 && gridChild.children[i].position.y > -5) {
            childDirection = -1;
        }

        if (childDirection == 1) {
            gridChild.children[i].material.color.setHex(0xff0000);
            moveY =  1;
        } else if (childDirection == -1) {
            gridChild.children[i].material.color.setHex(0x00fff0);
            moveY =  -1;
        } else if (childDirection == 0) {
            gridChild.children[i].material.color.setHex(0x00fff0);
            moveY = 0;
        }

        let translateFactor = tmpPos.set(moveX, moveY, moveZ);

        translateFactor.multiplyScalar(scalingFactor);

        gridChild.children[i].translateX(translateFactor.x);
        gridChild.children[i].translateY(translateFactor.y);
        gridChild.children[i].translateZ(translateFactor.z);
        
        gridChild.children[i].getWorldPosition(tmpPos);
        gridChild.children[i].getWorldQuaternion(tmpQuat);

        let physicsBody = gridChild.children[i].userData.physicsBody;

        let ms = physicsBody.getMotionState();
        if ( ms ) {

            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            
            tmpTrans.setIdentity();
            tmpTrans.setOrigin( ammoTmpPos ); 
            tmpTrans.setRotation( ammoTmpQuat ); 

            ms.setWorldTransform(tmpTrans);
            
        }
    
    }    

    //console.log(childDirection);
}

function createStairs () {
    let pos = {x: -4, y: 11, z: -120};
    let scale = {x: 20, y: 2, z: 8};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;
    let steps = 4;
    let distZ = 13;
    let distY = 5;

    var stairs = stairGroup = new THREE.Group();
    let stairsLeft = stairsLeftGroup = new THREE.Group();
    let stairsRight = stairsRightGroup = new THREE.Group();

    for(let i = 0; i < steps; i++) {

    

            //ThreeJS Section
            let box = new THREE.Mesh(new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z), new THREE.MeshPhongMaterial({color: 0xEB4034}));
            box.position.set(pos.x, pos.y+(i*distY), pos.z-(i*distZ));
            box.receiveShadow = true;
            stairs.add(box);// Adding

            //Ammojs Section

            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin( new Ammo.btVector3( pos.x, pos.y+(i*distY), pos.z-(i*distZ) ) );
            transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
            let motionState = new Ammo.btDefaultMotionState( transform );
        
            let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
            colShape.setMargin( 0.05 );
        
            let localInertia = new Ammo.btVector3( 0, 0, 0 );
            colShape.calculateLocalInertia( mass, localInertia );
        
            let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
            let body = new Ammo.btRigidBody( rbInfo );
        
            body.setFriction(4);
            body.setRollingFriction(10);

            body.setActivationState( STATE.DISABLE_DEACTIVATION );
            body.setCollisionFlags( FLAGS.CF_KINEMATIC_OBJECT );
        
            physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall );
            box.userData.physicsBody = body;
        
    }

    stairsLeft.add(stairs.children[0]);
    stairsRight.add(stairs.children[0]);
    stairsLeft.add(stairs.children[0]);
    stairsRight.add(stairs.children[0]);

    stairs.add(stairsLeft);
    stairs.add(stairsRight);

    scene.add(stairs);

    
    
    
    //TweenMax.from(childBody.position, 25, {y:20});

}

function moveStairs(){

    let scalingFactor = 0.1;

    let moveX;
    let moveZ =  0;
    let moveY =  0;

    if (stepDirection == 1) {
        moveX =  1;
    } else if (stepDirection == -1) {
        moveX =  -1;
    } else if (stepDirection == 0) {
        moveX = 0;
    }

    /*if (gridChild.position.y > 10) {
        childDirection = 0;
        childDirection = -1
        
    }
    
    if (gridChild.position.y < -10) {
        childDirection = 1;
    }*/

    for (let i = 0; i < stairsLeftGroup.children.length; i++) {

        let translateFactor = tmpPos.set(moveX, moveY, moveZ);

        translateFactor.multiplyScalar(scalingFactor);

        stairsLeftGroup.children[i].translateX(translateFactor.x);
        //stairsLeftGroup.children[i].rotateX(translateFactor.x); // How to Rotate Kinematic objects
        stairsLeftGroup.children[i].translateY(translateFactor.y);
        stairsLeftGroup.children[i].translateZ(translateFactor.z);
        
        stairsLeftGroup.children[i].getWorldPosition(tmpPos);
        stairsLeftGroup.children[i].getWorldQuaternion(tmpQuat);

        let physicsBody = stairsLeftGroup.children[i].userData.physicsBody;

        let ms = physicsBody.getMotionState();
        if ( ms ) {

            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            
            tmpTrans.setIdentity();
            tmpTrans.setOrigin( ammoTmpPos ); 
            tmpTrans.setRotation( ammoTmpQuat ); 

            ms.setWorldTransform(tmpTrans);
            
        }
    
    }
    
    for (let i = 0; i < stairsRightGroup.children.length; i++) {

        let translateFactor = tmpPos.set(-moveX, moveY, moveZ);

        translateFactor.multiplyScalar(scalingFactor);

        stairsRightGroup.children[i].translateX(translateFactor.x);
        stairsRightGroup.children[i].translateY(translateFactor.y);
        stairsRightGroup.children[i].translateZ(translateFactor.z);
        
        stairsRightGroup.children[i].getWorldPosition(tmpPos);
        stairsRightGroup.children[i].getWorldQuaternion(tmpQuat);

        let physicsBody = stairsRightGroup.children[i].userData.physicsBody;

        let ms = physicsBody.getMotionState();
        if ( ms ) {

            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            
            tmpTrans.setIdentity();
            tmpTrans.setOrigin( ammoTmpPos ); 
            tmpTrans.setRotation( ammoTmpQuat ); 

            ms.setWorldTransform(tmpTrans);
            
        }
    
    }

    

    if (stairsRightGroup.children[0].position.x < -20) {
        stepDirection = -1;
    } else if (-35 < stairsRightGroup.children[0].position.x  && stairsRightGroup.children[0].position.x > 10) {
        stepDirection = 1;
    }
}

function createRotatingBlock () {
    let pos = {x: -4, y: 25, z: -205};//z: -180
    let scale = {x: 10, y: 10, z: 10};
    let quat = {x: 0, y: 0, z: 0, w: 1};
    let mass = 0;
    let steps = 6;
    let distZ = 20;
    let distY = 5;

    var stairs = rotatingBlockGroup = new THREE.Group();
    let stairsLeft = rotatingBlockLeftGroup = new THREE.Group();
    let stairsRight = rotatingBlockRightGroup = new THREE.Group();

    for(let i = 0; i < steps; i++) {

    

            //ThreeJS Section
            let box = new THREE.Mesh(new THREE.BoxBufferGeometry(scale.x, scale.y, scale.z), new THREE.MeshPhongMaterial({color: 0x7242f5}));
            box.position.set(pos.x, pos.y, pos.z-(i*distZ));
            box.receiveShadow = true;
            stairs.add(box);// Adding

            //Ammojs Section

            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z-(i*distZ) ) );
            transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
            let motionState = new Ammo.btDefaultMotionState( transform );
        
            let colShape = new Ammo.btBoxShape( new Ammo.btVector3( scale.x * 0.5, scale.y * 0.5, scale.z * 0.5 ) );
            colShape.setMargin( 0.05 );
        
            let localInertia = new Ammo.btVector3( 0, 0, 0 );
            colShape.calculateLocalInertia( mass, localInertia );
        
            let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
            let body = new Ammo.btRigidBody( rbInfo );
        
            body.setFriction(4);
            body.setRollingFriction(0);

            body.setActivationState( STATE.DISABLE_DEACTIVATION );
            body.setCollisionFlags( FLAGS.CF_KINEMATIC_OBJECT );
        
            physicsWorld.addRigidBody( body, colGroupGreenBall, colGroupRedBall );
            box.userData.physicsBody = body;
        
    }

    stairsLeft.add(stairs.children[0]);
    stairsRight.add(stairs.children[0]);
    stairsLeft.add(stairs.children[0]);
    stairsRight.add(stairs.children[0]);
    stairsLeft.add(stairs.children[0]);
    stairsRight.add(stairs.children[0]);

    stairs.add(stairsLeft);
    stairs.add(stairsRight);

    scene.add(stairs);

    
    
    
    //TweenMax.from(childBody.position, 25, {y:20});

}

function rotateBlock(){

    let scalingFactor = 0.01;

    let moveX = 0;
    let moveZ;
    let moveY =  0;

    if (stepDirection == 1) {
        moveZ =  1;
    } else if (stepDirection == -1) {
        moveZ =  -1;
    } else if (stepDirection == 0) {
        moveZ = 0;
    }

    /*if (gridChild.position.y > 10) {
        childDirection = 0;
        childDirection = -1
        
    }
    
    if (gridChild.position.y < -10) {
        childDirection = 1;
    }*/

    for (let i = 0; i < rotatingBlockLeftGroup.children.length; i++) {

        let translateFactor = tmpPos.set(moveX, moveY, moveZ);

        translateFactor.multiplyScalar(scalingFactor);

        //rotatingBlockLeftGroup.children[i].translateX(translateFactor.x);
        rotatingBlockLeftGroup.children[i].rotateZ(translateFactor.z); // How to Rotate Kinematic objects
        rotatingBlockLeftGroup.children[i].translateY(translateFactor.y);
        rotatingBlockLeftGroup.children[i].translateZ(translateFactor.z);
        
        rotatingBlockLeftGroup.children[i].getWorldPosition(tmpPos);
        rotatingBlockLeftGroup.children[i].getWorldQuaternion(tmpQuat);

        let physicsBody = rotatingBlockLeftGroup.children[i].userData.physicsBody;

        let ms = physicsBody.getMotionState();
        if ( ms ) {

            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            
            tmpTrans.setIdentity();
            tmpTrans.setOrigin( ammoTmpPos ); 
            tmpTrans.setRotation( ammoTmpQuat ); 

            ms.setWorldTransform(tmpTrans);
            
        }
    
    }
    
    for (let i = 0; i < rotatingBlockRightGroup.children.length; i++) {

        let translateFactor = tmpPos.set(moveX, moveY, -moveZ);

        translateFactor.multiplyScalar(scalingFactor);

        rotatingBlockRightGroup.children[i].rotateZ(translateFactor.z);
        //rotatingBlockRightGroup.children[i].translateX(translateFactor.x);
        rotatingBlockRightGroup.children[i].translateY(translateFactor.y);
        rotatingBlockRightGroup.children[i].translateZ(translateFactor.z);
        
        rotatingBlockRightGroup.children[i].getWorldPosition(tmpPos);
        rotatingBlockRightGroup.children[i].getWorldQuaternion(tmpQuat);

        let physicsBody = rotatingBlockRightGroup.children[i].userData.physicsBody;

        let ms = physicsBody.getMotionState();
        if ( ms ) {

            ammoTmpPos.setValue(tmpPos.x, tmpPos.y, tmpPos.z);
            ammoTmpQuat.setValue( tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);

            
            tmpTrans.setIdentity();
            tmpTrans.setOrigin( ammoTmpPos ); 
            tmpTrans.setRotation( ammoTmpQuat ); 

            ms.setWorldTransform(tmpTrans);
            
        }
    
    }


}

function loadCharacter () {
    const gltfloader = new THREE.GLTFLoader();
    const url = '../assets/meshes/character.gltf'
    const gltf = gltfloader.load (url, (gltf) => {
        character = new THREE.Group();
        character.add(gltf.scene);
        character.rotation.set(0, Math.PI/2, 0);
        character.position.set(0, 0.5, 0);
        character.scale.set(0.2, 0.2, 0.2);
        scene.add(character);
        character.name = "character";
        ballObject.add(character);

    }, (xhr) => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );}, function(error){console.log(error)});
    
    
}

function loadSlider () {

    const gltfloader = new THREE.GLTFLoader();
    const url = '../assets/meshes/slider.glb'
    const gltf = gltfloader.load (url, createSlider, (xhr) => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );}, function(error){console.log(error)});
    
    
}

function createSlider (gltf) {
    slider = new THREE.Group();
    let emissiveColor = new THREE.Color( 0x249643 );
    slider.add(gltf.scene.children[0]);
    scene.add(slider);
    slider.position.set(0, 40, -325);
    slider.children[0].rotation.set(Math.PI / 2, -Math.PI / 3, Math.PI / 2);
    slider.children[0].material.color.setHex(0x00ff00);
    
    slider.children[0].material.emissive = emissiveColor;
    slider.name = "slider";
}


function updatePhysics( deltaTime ){

    // Step world
    physicsWorld.stepSimulation( deltaTime, 10 );

    // Update rigid bodies
    for ( let i = 0; i < rigidBodies.length; i++ ) {
        let objThree = rigidBodies[ i ];
        let objAmmo = objThree.userData.physicsBody;
        let ms = objAmmo.getMotionState();
        if ( ms ) {

            ms.getWorldTransform( tmpTrans );
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

        }
    }

    collisionDetection();
}

function collisionDetection () {//Collision Callback/Filtering

    //Manifolds are intersections/collisions in the physics world https://bjlkeng.github.io/images/coordinate_chart_manifold.png


    var count = physicsWorld.getDispatcher().getNumManifolds();// From the physics world, retreive the current number of manifolds (Collisions)
    manifoldCount = count;
    for (let i=0; i < count; i++)// For loop through all collisons.
    {
        
        let contactManifold =  physicsWorld.getDispatcher().getManifoldByIndexInternal(i);// contactManifold is the group of manifolds which

        let obA = contactManifold.getBody0();//Retrieve the first body of the the contactManifold.
        let obB = contactManifold.getBody1();//Retrieve the second body of the the contactManifold.


        //console.log("ObA: ");
        //console.log(obA.a);
        //console.log("ObB: ");
        //console.log(obB.a);
        //console.log("physicsBody");
        //console.log(ballObject.userData.physicsBody.a);

        if (ballObject.userData.physicsBody.a == obA.a || ballObject.userData.physicsBody.a == obB.a){// Checking if the body of the Ball is the same as either of body of the A and B manifolds
            //console.log("a and b collided");
            
            if (initialTime + 2 < time) {
                canJump = true;
            } else canJump = false;
            
        }
        else {
            console.log('nothing');
            
        }   
    }
}

function init() {

//Setting up Scene

    //Clock
    clock = new THREE.Clock();
    

    //Scene
    scene = new THREE.Scene();

    //Renderer
    const canvas = document.querySelector('#c');

    renderer = new THREE.WebGLRenderer( { canvas, antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth/2, window.innerHeight/2, false );
    document.body.appendChild( renderer.domElement );

    renderer.gammaFactor = 2.2;//Correcting the scenes Gamma Values
    renderer.gammaFactor = true;
    renderer.outputEncoding = THREE.GammaEncoding;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    //Camera
    camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 20;
    camera.position.y = 15;
    //controls.update() must be called after any manual changes to the camera's transform

    //Fog
    {
        const color = 0x000000;
        const density = 0.005;
        scene.fog = new THREE.FogExp2(color, density);
    }

// Lights
    
    //Sun AKA Directional Light
    var dirLight = new THREE.PointLight( 0xffffff, 1 );
    dirLight.position.set( 5, 50, 5 );
    scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 13500;
 
    //Ambient Light
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
    hemiLight.color.setHSL( 0.6, 0.6, 0.6 );
    hemiLight.groundColor.setHSL( 0.1, 1, 0.4 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );

// Particle System

    //Sprite Creation
    //const spriteMap = new THREE.TextureLoader().load( "./assets/images/mushroom.png" );

    //const spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
    //sprite = new THREE.Sprite( spriteMaterial );
    //scene.add( sprite );
    //sprite.position.set(6,3,7);


    //Particle Instancing
    var sprites = new THREE.Group();

    {
        const map = new THREE.TextureLoader().load( "../assets/images/sprite.png" );


        var material = new THREE.SpriteMaterial( { map: map, blending: THREE.AdditiveBlending, alphaMap: map } );
        

        
        
        for ( var i = 0; i < 1000; i ++ ) {

            var x = THREE.MathUtils.randFloatSpread( 300 );
            var y = THREE.MathUtils.randFloatSpread( 300 );
            var z = THREE.MathUtils.randFloatSpread( 300 );
    
            var sprite = new THREE.Sprite( material );
    
            sprite.position.set( x, y, z );
            sprites.add(sprite);
    
        }
        

        scene.add( sprites );
    }   

//Objects


    createBlock();
    createBlock2();
    createBlock3();
    createEndBlock();
    createRotatingBlock();
    createBall();
    
    createMaskBall();

    createGrid();
    

    createStairs();
    loadCharacter();
    loadSlider();
    

    
    
    

    
//Keyboard Controls

    let keyState = [];// Creates an array list to fill keydown and keyup values with. This method removes the delay by implementing a game loop which checks every 10 milliseconds for input
    
    
    window.addEventListener('keydown',function(e){// goes 
        keyState[e.keyCode || e.which] = true;// If the value is tr, 
    },true);
    
    window.addEventListener('keyup',function(e){
        keyState[e.keyCode || e.which] = false;// e.which is here for older browser compatibility.
    },true);

    function gameLoop() {
        if (touchcontrols == false) {
        console.log("no touch controls");
        if (keyState[37] || keyState[65]){
            moveDirection.left = 1;
        } else (moveDirection.left = 0);
    
        if (keyState[39] || keyState[68]){
            moveDirection.right = 1;
        } else (moveDirection.right = 0);

        if (keyState[38] || keyState[87]){
            moveDirection.forward = 1;
        } else (moveDirection.forward = 0);

        if (keyState[40] || keyState[83]){
            moveDirection.back = 1;
    } else (moveDirection.back = 0);
        
        if (keyState[32]){
            moveDirection.jump = true
            
        } else {moveDirection.jump = false}

        if (keyState[71]){// Testing Angular Velocity with Key G
            let vector = new Ammo.btVector3(0,5,0); 
            ballObject.userData.physicsBody.setAngularVelocity(vector);
        } 
        
       setTimeout(gameLoop, 10);
    }
    }
    

    gameLoop();
    

}
 
function animate() {

    stats.begin();

    let deltaTime = clock.getDelta();
    time = clock.getElapsedTime();
    moveBall();
    moveGrid();
    moveStairs();
    rotateBlock();
    followPlayer();

    if (slider != undefined) {
        slider.rotation.y += (Math.PI/180);
    }
    
    //if (typeof character != "undefined") {
    //    ball.add(character);
    //}
    
    //Update Physics World
    updatePhysics( deltaTime );
    camera.lookAt( playerPosition );
    // Raycaster
    raycast();
    //Render Scene
    renderer.render( scene, camera );
        
    stats.end();
    requestAnimationFrame( animate );

}

const gameOver = () => {
    gameOverScreen.style.display = "block";
    //cancelAnimationFrame( animate );
    console.log("Game Over")
}

document.addEventListener("mousemove", onMouseMove);

function onMouseMove (event) {
    if (event.cancelable) {
        event.preventDefault();
    }


    //Raycasting Stuff

    mouse.x = ( event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    //console.log("x:" + mouse.x + "y:" + mouse.y)
}

window.addEventListener('touchstart', event  => {
    event.preventDefault();
    document.getElementById("debug").innerHTML = event.changedTouches.length;
    touchButton.style.filter = 'blur(3px)';

    if (event.touches.length === 1) {
        initialTouch.x = ( event.touches[0].clientX / window.innerWidth) * 2 - 1;
        initialTouch.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
        buttonArea = true;
        
        touchButton.style.left = `${event.touches[0].clientX - touchButton.clientWidth / 2}px`;
        touchButton.style.top = `${event.touches[0].clientY - touchButton.clientHeight / 2}px`;
    }  

    
    
    if (event.touches[1]) {
        document.getElementById("debug").innerHTML = "second touch";
        moveDirection.jump = true;
    }
}, { passive: false })

window.addEventListener('touchmove', event => {
    touchMoving = true;
    //document.getElementById("debug").innerHTML = event.changedTouches.length
    
    event.preventDefault();
    

    movingTouch.x = ( event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    movingTouch.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;


    //console.log("x: " + (initialTouch.x - movingTouch.x));
    //console.log (" y:" + (initialTouch.y - movingTouch.y));
    touchDistance.y = initialTouch.y - movingTouch.y;
    touchDistance.x = initialTouch.x - movingTouch.x;

    if ((initialTouch.y - movingTouch.y) > 0.1 || (initialTouch.y - movingTouch.y) < -0.1) {
        console.log(touchDistance.y);
        
    }

    //document.getElementById("debug").innerHTML = "TouchMove";
    

    if (buttonArea === true) {

        if (Math.abs(touchDistance.y) > 0.4) {
            moveScaleFactor = 100;
        } else moveScaleFactor = 75;

        if (touchDistance.x > 0.2) {
            //setInterval(() => moveDirection.back = 1, 1);
            moveDirection.left = 1;
            moveDirection.right = 0;
            console.log("left");
        } else if (touchDistance.x < -0.2) {
            //setInterval(() => moveDirection.forward = 1, 1);
            moveDirection.right = 1;
            moveDirection.left = 0;
            console.log("right");
        } else {
            moveDirection.right = 0;
            moveDirection.left = 0;
        }

        if (touchDistance.y > 0.1) {
            //setInterval(() => moveDirection.back = 1, 1);
            moveDirection.back = 1;
            moveDirection.forward = 0;
            console.log("back");
        } else if (touchDistance.y < -0.1) {
            //setInterval(() => moveDirection.forward = 1, 1);
            moveDirection.forward = 1;
            moveDirection.back = 0;
            console.log("forward");
        }
        else if (Math.abs(touchDistance.y) < 0.1) {
                moveDirection.back = 0;
                moveDirection.forward = 0;
            console.log("clear");
        }
    } else touchButton.style.filter = null;

}, { passive: false })

document.addEventListener("touchend", (event) => {

    //document.getElementById("debug").innerHTML = "TouchEnd";

    if ("vibrate" in navigator) { 
        window.navigator.vibrate([10]);
    }

    if (event.touches.length === 0) {
        touchButton.style.filter = null;
        moveDirection.forward = 0;
        moveDirection.back = 0;
        moveDirection.left = 0;
        moveDirection.right = 0;
    }
    moveDirection.jump = false;
    
    

    
    
        
  }, false);

function raycast () {
    
    
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );
    
    

    INTERSECTED = false;
    if (intersects.length > 0) {
        //console.log("higher than zero")

         
        for ( var i = 0; i < intersects.length; i++ ) {
            
                if (intersects[i].object == ballObject) {
                    INTERSECTED = true;
                }

                
                //sprite.position = intersects[0].point;

        
        }
    }

    if (!INTERSECTED) {
        //console.log("lower than zero");
        ballObject.material.color.setHex( 0xff0000 );//red
        //console.log("INTERSECTED" + INTERSECTED);
    } else  ballObject.material.color.setHex( 0xfff000 );//yellow
}
