  // Forward declare assets
    var shaders = [
      {
        "path" : "glsl/v1.glsl",
        "name" : "vertex_toy"
      },
      {
        "path" : "glsl/raymarch_base.glsl",
        "name" : "fragment_toy"
      },
      {
        "path" : "glsl/utils.glsl",
        "name" : "utils"
      }
     ];

  var models = [
		   {
		      "path": "rome/fox.js",
		      "name": "fox"
		  },
		  {
		       "path": "rome/rabbit.js",
		       "name": "rabbit"
		  },
	  ];

    var textureList = [
		 {
		     "path": "media/panda.png",
		     "name": "tile"
		 },
		 {
		     "path": "media/red.png",
		     "name": "red"
		 }
	  ];

	 uniforms = {
	     time: { type: "f", value: 1.0 },
	     xPosition: { type: "f", value: 0.0 },
	     yPosition: { type: "f", value: 0.0 },
	     zPosition: { type: "f", value: 0.0 },
	     diffuse: { type: "c", value: new THREE.Color(0xaaeeff) },
	     resolution: { type: "v2", value: new THREE.Vector2() },
		   mouse: { type: "v2", value: new THREE.Vector2() },
	     t0: {type: 't', value: TextureStore.getTexture("tile") },
	 };

   var stats = new Stats();

   var STATE_INACTIVE = 0;
   var STATE_ACTIVE = 1;

   var xPosition = 0.0;
   var yPosition = 0.0;
   var zPosition = 3.0;

   var upState     = STATE_INACTIVE;
	 var downState   = STATE_INACTIVE;
	 var leftState   = STATE_INACTIVE;
	 var rightState  = STATE_INACTIVE;
	 var actionState = STATE_INACTIVE;

	 var origin = new AVector3(0.0, 0.0, 120.0);

	 // move this shit to it's own set of classes please
	 var farTopLeft;
	 var farBottomRight;
	 var farTopRight;
	 var farBottomLeft;

	 var nearTopLeft;
	 var nearBottomRight;
	 var nearTopRight;
	 var nearBottomLeft;

	 var scene, camera, renderer;
	 var lastUpdate = 0;

   var playerObject = null;
	 var pPos         = null;

	 function loadModel(manager, model)
	 {
	     var loader = new THREE.JSONLoader();
	     loader.load(model["path"], function(geometry, materials){
		 var material = null;
		 var object = null;

		 if (materials) {
		     material  = new THREE.MeshFaceMaterial( materials );
		 }

		  ModelStore.setModel(model["name"], object, geometry, materials);
		  manager.itemStart(model["path"]);
      manager.itemEnd(model["path"]);
	   });
	 }

    function loadShaders()
    {
      jQuery.get('v1.glsl', function(data) {
        console.log(data);
      });
    }

  function loadShader(manager, t)
  {
    console.log("Loading ", t["name"]);
    jQuery.get(t["path"], function (data) {
      ShaderStore.set(t["name"], data);
		  manager.itemStart(t["path"]);
      manager.itemEnd(t["path"]);
    });
  }

  function loadTexture(manager, t)
	 {
	     console.log("Loading ", t["name"]);
	     var loader = new THREE.ImageLoader(manager);
	     loader.load(
	  	   t["path"],
		     function ( image ) {
		     var texture = new THREE.Texture();
		     texture.image = image;
		     texture.needsUpdate = true;
		     TextureStore.setTexture(t["name"], texture);
		 },
		 function ( xhr ) {
		     console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		 },
		 function ( xhr ) {
		     console.log( 'An error happened' );
		 });
	 }

   // Load modules .. etc
	 function preload() {
	  // list of models we want to load
    var modelList   = [""]
    var totalCount  = textureList.length  + models.length + shaders.length;
    var manager = new THREE.LoadingManager();

	  manager.onProgress = function ( item, loaded, total ) {
		  if (loaded == totalCount) {
	      init();
		  }
		  console.log( "Loaded", item, loaded, total, "Waiting for ", totalCount );
	  };

    // Load various models
	  for (var i = 0; i < models.length; i++) {
	    loadModel(manager, models[i]);
	  }
	  for (var i = 0; i < textureList.length; i++) {
	    loadTexture(manager, textureList[i]);
	  }
    for (var i = 0; i < shaders.length; i++) {
      loadShader(manager, shaders[i]);
    }
  }


	 function handleInput()
	 {
       var t = 0.25;
	     if (upState == STATE_ACTIVE) {
          zPosition -= t;
	     }
	     if (downState == STATE_ACTIVE) {
	        zPosition += t;
       }
	     if (rightState == STATE_ACTIVE) {
          xPosition += t;
	     }
	     if (leftState == STATE_ACTIVE) {
          xPosition -= t;
	     }
	 }

	 function updateCamera() {
	     CameraPlane.compute(camera);
	     FarPlaneWorld();
	     NearPlaneWorld();
	 }

	 function update()
	 {
	     ObjectStore.update();
	     handleInput();
	 }

   function fullScreenQuad()
	 {
		var vertexShader   =  ShaderStore.get("vertex_toy");
		var fragmentShader =  ShaderStore.get("fragment_toy");

		var shaderMaterial = new THREE.ShaderMaterial( {
			   uniforms: uniforms,
			   vertexShader:   vertexShader,
			   fragmentShader: fragmentShader
		     });
		     var farZ  = CameraPlane.farTopLeft.z;
		     var nearZ = CameraPlane.nearTopLeft.z;

     var o =  drawTex4(
			 CameraPlane.farBottomLeft.x,
			 CameraPlane.farBottomLeft.y,
			 CameraPlane.farBottomLeft.z,

			 CameraPlane.farBottomRight.x,
			 CameraPlane.farBottomRight.y,
			 CameraPlane.farBottomRight.z,

			 CameraPlane.farTopLeft.x,
			 CameraPlane.farTopLeft.y,
			 CameraPlane.farTopLeft.z,

			 CameraPlane.farTopRight.x,
			 CameraPlane.farTopRight.y,
			 CameraPlane.farTopRight.z,
			 shaderMaterial
		   );
	     scene.add(o);
	 }

	 function setup() {
	     onWindowResize();
	     var light = new THREE.AmbientLight( 0xffffff );
	     scene.add( light );
	     fullScreenQuad();
	 }

	 function onWindowResize() {
	     windowHalfX = window.innerWidth / 2;
	     windowHalfY = window.innerHeight / 2;

	     camera.aspect = window.innerWidth / window.innerHeight;
	     camera.updateProjectionMatrix();
	     renderer.setSize( window.innerWidth, window.innerHeight );

	     uniforms.resolution.value.x = renderer.domElement.width;
	     uniforms.resolution.value.y = renderer.domElement.height;
	     updateCamera();
	 }

	 function onKeyUp(event)
	 {
	     var keyCode = event.keyCode;
	     console.log("Key Up");
	     switch (keyCode) {
		 case 38:
		     upState = STATE_INACTIVE;
		     break;
		 case 40:
		     downState = STATE_INACTIVE;
		     break;
		 case 39:
		     rightState = STATE_INACTIVE;
		     break;
		 case 37:
		     leftState = STATE_INACTIVE;
		     break;
		 default:
		     break;
	     }
	 }

	 function onKeyDown(event)
	 {
	     var keyCode = event.keyCode;
	     var amount = 0.05;
	     switch (keyCode) {
		 case 70:  // f
		     if( THREEx.FullScreen.activated() ){
			 THREEx.FullScreen.cancel();
		     }else{
			 THREEx.FullScreen.request();
		     }
		     break;
		 case 38:
		     upState = STATE_ACTIVE;
		     break;
		 case 40:
		     downState = STATE_ACTIVE;
		     break;
		 case 37:
		     leftState = STATE_ACTIVE;
		     break;
		 case 39:
		     rightState = STATE_ACTIVE;
		     break;
		 case 32:
		     break;
		 default:
		     break;
	     }
	 }

   function addStats() {
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );
   }

	 function init() {
	     scene = new THREE.Scene();
	     camera = new THREE.PerspectiveCamera( 90,
						   window.innerWidth/window.innerHeight,
						   1,
						   200 );

	     var domScene = document.getElementById('scene');
	     camera.position.z = 200;
	     camera.position.x = 0;
	     camera.position.y = 0;
	     camera.lookAt(new THREE.Vector3(0,0,0));
	     camera.updateProjectionMatrix();

	     updateCamera();

	     // Setup the inital scene

	     renderer = new THREE.WebGLRenderer();
	     renderer.setClearColor(tinycolor("#aaaaaa").toHexString());
	     renderer.setSize( window.innerWidth, window.innerHeight );
	     domScene.appendChild( renderer.domElement );

	     setup();

	     lastUpdate = currentTime();
	     window.addEventListener( 'resize', onWindowResize, false );
	     document.addEventListener( 'keydown',  onKeyDown, false);
	     document.addEventListener( 'keyup',  onKeyUp, false);
	     document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		 document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		 document.addEventListener( 'mousemove', onDocumentMouseDrag, false );
	     document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	     document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	     addStats();
       animate();
	 }

	 function animate() {
		uniforms.time.value += 0.05;
		uniforms.xPosition.value = xPosition;
		uniforms.yPosition.value = yPosition;
		uniforms.zPosition.value = zPosition;
		stats.begin();
	    requestAnimationFrame( animate );
		update();
	    renderer.render( scene, camera );
		stats.end();
    }

   var dragging = false;

	 function onDocumentMouseDown( event ) {
	     event.preventDefault();
		 console.log("Mouse Down");
     dragging = true;
	 }

   function onDocumentMouseUp( event ) {
      event.preventDefault();
      dragging = false;
    }

	 function onDocumentMouseDrag( event ) {
	     event.preventDefault();

       if (dragging == false) {
         return;
       }

       var x = event.pageX - this.offsetLeft;
       var y = event.pageY - this.offsetTop;

       y = renderer.domElement.height - y;

       uniforms.mouse.value.x = x;
       uniforms.mouse.value.y = y;
	 }

	 function onDocumentTouchStart( event ) {
	    if ( event.touches.length == 1 ) {
		      event.preventDefault();
	    }
	 }

   function onDocumentTouchMove( event ) {
	    if ( event.touches.length == 1 ) {
			event.preventDefault();
			mouseX = event.touches[ 0 ].pageX - windowHalfX;
	    }
	}

preload();
