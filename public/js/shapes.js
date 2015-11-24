// shapes and drawing utilities
// bottomLeft, bottomRight, topLeft, topRight

function drawTex4(x1, y1, z1,
		  x2, y2 ,z2,
		  x3, y3, z3,
		  x4, y4, z4,
		  texture)
{
    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3(  x1,  y2, z1) ); //0, 0
    geometry.vertices.push( new THREE.Vector3(  x3,  y3, z3) ); //0, 1
    geometry.vertices.push( new THREE.Vector3(  x4,  y4, z4) ); //1, 1
    geometry.vertices.push( new THREE.Vector3(  x2,  y2, z2) ); //1, 0

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),
				    new THREE.Vector2(0,1),
				    new THREE.Vector2(1,1)]);

    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),
				    new THREE.Vector2(0,0),
				    new THREE.Vector2(1,1)]);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    texture.side    = THREE.DoubleSide;

  var mesh = new THREE.Mesh(
	geometry,
	texture
    );
    mesh.position.set(  0,
			0,
			0);
    return mesh;
}


// Generate testing box/material passing

function genBox4(x1, y1, z1,
		 x2, y2 ,z2,
		 x3, y3, z3,
		 x4, y4, z4,
		 material)
{


}

// blank mesh no pre-built animation or materials
// but has texture coords
function genTex4(x1, y1, z1,
		 x2, y2 ,z2,
		 x3, y3, z3,
		 x4, y4, z4,
		 material)
{
    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3(  x1,  y2, z1) ); //0, 0
    geometry.vertices.push( new THREE.Vector3(  x3,  y3, z3) ); //0, 1
    geometry.vertices.push( new THREE.Vector3(  x4,  y4, z4) ); //1, 1
    geometry.vertices.push( new THREE.Vector3(  x2,  y2, z2) ); //1, 0

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),
				    new THREE.Vector2(0,1),
				    new THREE.Vector2(1,1)]);

    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),
				    new THREE.Vector2(0,0),
				    new THREE.Vector2(1,1)]);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    for ( var i = 0; i < geometry.vertices.length; i++ )
    {
	point = geometry.vertices[ i ];
	color = new THREE.Color( 0xffffff );
	geometry.colors[i] = color; // use this array for convenience
    }

    var mesh = new THREE.Mesh(
	geometry,
	m
    );

    mesh.position.set(  0,
			0,
			0);

    return mesh;
}


function drawTex(x1, y1, x2, y2)
{

    var z =  -camera.far;
    z = 0;

    var width = 0;

    if (x1 > x2) {

    } else {

    }

    // since this a quad
    var min =  x1;
    var max =  x2;

    var geometry = new THREE.Geometry();
    z = CameraPlane.farTopRight.z;

    geometry.vertices.push( new THREE.Vector3(  x1,  y2, z) ); //0, 0
    geometry.vertices.push( new THREE.Vector3(  x1,  y1, z) ); //0, 1
    geometry.vertices.push( new THREE.Vector3(  x2,  y1, z) ); //1, 1
    geometry.vertices.push( new THREE.Vector3(  x2,  y2, z) ); //1, 0

    geometry.dynamic = true;

    //new Vector2 (0, 0), new Vector2 (0, 1), new Vector2 (1, 1),  new Vector2 (1, 0)

    // geometry.faceVertexUvs[ 0 ][ faceIndex ][ vertexIndex ]
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),
				    new THREE.Vector2(0,1),
				    new THREE.Vector2(1,1)]);

    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),
				    new THREE.Vector2(0,0),
				    new THREE.Vector2(1,1)]);

    // apply the needed uvs
    //geometry.faceVertexUvs[0] = [];

    geometry.faceVertexUvs[0] = AnimatedFrame.getFrameCoords(0 ,0);

    // apply the needed UVs to the quad
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var mat = new THREE.MeshBasicMaterial( { color: tinycolor({r: 255,
							       g: 255,
							       b: 255}).toHexString(),
					     wireframe: false,
					     map: TextureStore.getTexture("tile")});
    mat.shading = THREE.FlatShading;
    mat.side    = THREE.DoubleSide;

    var mesh = new THREE.Mesh(
			geometry,
			mat
    );

    mesh.position.set(  0,
			0,
			0);

    scene.add(mesh);

    var object = new AnimatedObject();
    object.material = mat;
    object.geometry = geometry;
    object.mesh = mesh;
    object.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    object.addAnimation("backwards", [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    object.startAnimation("default");
    ObjectStore.addObject(object);
}

// this just draws a solid quad
// who knows where this is actually placed in the scene?
function drawTexQuad()
{
    var min = -100.0;
    var max =  100.0;

    var origin = {x: 0,
		  y: 0,
		  z: 0,
		 }

    var length = {x: 0,
		  y: 10,
		 }

    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3( min,  min, 0) );
    geometry.vertices.push( new THREE.Vector3( min,  max, 0) );
    geometry.vertices.push( new THREE.Vector3( max,  max, 0) );
    geometry.vertices.push( new THREE.Vector3( max,  min, 0) );

    //new Vector2 (0, 0), new Vector2 (0, 1), new Vector2 (1, 1),  new Vector2 (1, 0)

    // geometry.faceVertexUvs[ 0 ][ faceIndex ][ vertexIndex ]
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),
				    new THREE.Vector2(0,1),
				    new THREE.Vector2(1,1)]);

    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),
				    new THREE.Vector2(0,0),
				    new THREE.Vector2(1,1)]);


    // apply the needed uvs
    //geometry.faceVertexUvs[0] = [];

    geometry.faceVertexUvs[0] = AnimatedFrame.getFrameCoords(0 ,0);

    // apply the needed UVs to the quad
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var mat = new THREE.MeshBasicMaterial( { color: tinycolor({r: 255,
							       g: 255,
							       b: 255}).toHexString(),
					     wireframe: false,
					     map: TextureStore.getTexture("tile")});
    mat.shading = THREE.FlatShading;
    mat.side    = THREE.DoubleSide;

    var mesh = new THREE.Mesh(
	geometry,
	mat
    );

    scene.add(mesh);

    var object = new AnimatedObject();
    object.material = mat;
    object.geometry = geometry;
    object.mesh = mesh;
    object.addAnimation("default", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    object.addAnimation("backwards", [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    object.startAnimation("default");
    ObjectStore.addObject(object);

}

function buildSphere(material)
{
    var mat;
    var quad;

    var totalWidth    =  Math.abs(farTopLeft.x) + Math.abs(farTopRight.x);
    var totalHeight   =  Math.abs(farTopLeft.y) + Math.abs(farBottomRight.y);
    var pointSize     = totalWidth / 700;

    var r = 255;
    var g = 255;
    var b = 0;

    var geometry = new THREE.SphereGeometry( gRadius, 32, 32 );
    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(  0,
			  0,
			  0);

    return sphere;
}

function drawSolidSphere()
{
    var mat;
    var quad;

    var totalWidth    =  Math.abs(farTopLeft.x) + Math.abs(farTopRight.x);
    var totalHeight   =  Math.abs(farTopLeft.y) + Math.abs(farBottomRight.y);
    var pointSize     = totalWidth / 700;

    var r = 255;
    var g = 255;
    var b = 0;

    var geometry = new THREE.SphereGeometry( gRadius, 32, 32 );
    var material = new THREE.MeshNormalMaterial( {color: 0xffff00, wireframe: false} );
    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(  0,
			  0,
			  0);

    scene.add( sphere );
}

function drawGuy()
{
    var mat;
    var quad;
    var totalWidth    =  Math.abs(farTopLeft.x) + Math.abs(farTopRight.x);
    var totalHeight   =  Math.abs(farTopLeft.y) + Math.abs(farBottomRight.y);
    var loader = new THREE.JSONLoader();
    loader.load("/static/mesh/guy.json", function(geometry){
	var material = new THREE.MeshLambertMaterial({color: 0x55B663});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set(10,10,10);
	mesh.position.set(50,0,0);
	scene.add(mesh);
    });
}

function drawSphere()
{
    var mat;
    var quad;

    var totalWidth    =  Math.abs(farTopLeft.x) + Math.abs(farTopRight.x);
    var totalHeight   =  Math.abs(farTopLeft.y) + Math.abs(farBottomRight.y);

    var pointSize     = totalWidth / 700;
    var radius        = pointSize * 20;

    var r = 255;
    var g = 255;
    var b = 0;

    // generate some random points on the sphere

    sphereGroup = new THREE.Object3D();
    var sg      = new THREE.Object3D();

    for (var i = 0; i < 200; i++) {
	mat = new THREE.MeshBasicMaterial( { color: tinycolor({r: r,
							       g: g,
							       b: b}).toHexString(),
					     wireframe: false});

	mat.shading = THREE.FlatShading;
	mat.side    = THREE.DoubleSide;

	quad = new THREE.Mesh(
	    new THREE.PlaneGeometry(pointSize, pointSize, 1, 1),
	    mat
	);

	quad = new THREE.Mesh(
	    new THREE.BoxGeometry(pointSize, pointSize, pointSize ),
	    mat
	);

	var phi   = arandom(0,2.0 * Math.PI);
	var theta = arandom(0,2.0 * Math.PI);

	var x = Math.cos(theta) * Math.sin(phi) * gRadius;
	var y = Math.sin(theta) * Math.sin(phi) * gRadius;
	var z = Math.cos(phi)   * gRadius;

	quad.position.set( x + origin.x,
			   y + origin.y,
			   z + origin.z);

	sg.add(quad);
    }
    sphereGroup.add(sg);
    scene.add(sphereGroup);
    sphereGroup.position.set (0,0,0);
}

function genLine(x1, y1, z1, x2, y2, z2,  width)
{
    drawTex4(
	x1,
	y1,
	z1,

	x1+width,
	y1,
	z1,

	x2,
	y2,
	z2,

	x2+width,
	y2,
	z2
    );
}

function drawQuadPoints(tR, tL, bR, bL)
{
    var min = -100.0;
    var max =  100.0;

    var origin = {x: 0,
		  y: 0,
		  z: 0,
		 }

    var length = {x: 0,
		  y: 10,
		 }

    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3( min,  min, 0) );
    geometry.vertices.push( new THREE.Vector3( min,  max, 0) );
    geometry.vertices.push( new THREE.Vector3( max,  max, 0) );
    geometry.vertices.push( new THREE.Vector3( max,  min, 0) );

    // geometry.faceVertexUvs[ 0 ][ faceIndex ][ vertexIndex ]
    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(1,1)]);

    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );
    geometry.faceVertexUvs[0].push([new THREE.Vector2(1,0),new THREE.Vector2(0,0),new THREE.Vector2(1,1)]);

    // apply the needed UVs to the quad
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var mat = new THREE.MeshBasicMaterial( { color: tinycolor({r: 255,
							       g: 255,
							       b: 255}).toHexString(),
					     wireframe: false,
					     map: TextureStore.getTexture("tile")});
    mat.shading = THREE.FlatShading;
    mat.side    = THREE.DoubleSide;

    var mesh = new THREE.Mesh(
			geometry,
			mat
    );

    scene.add(mesh);
    var object = new AnimatedObject();
    object.update();
    ObjectStore.addObject(object);
}

function drawFox()
{
    var foxModel = ModelStore.getModel("fox");
    var geometry = foxModel["geometry"];
    var material = new THREE.MeshLambertMaterial(
	{ color: 0xffffff,
	  morphTargets: true,
	  morphNormals: true,
	  vertexColors: THREE.FaceColors,
	  shading: THREE.FlatShading }
    );
    // 		     //view-source:http://threejs.org/examples/webgl_morphtargets_horse.html
    geometry.computeMorphNormals();
    var meshAnim = new THREE.MorphAnimMesh( geometry, material );
    meshAnim.duration = 5000;
    var object = new THREE.Mesh( geometry, material );
    scene.add(object);
}

function drawTriangle()
{
    var geometry = new THREE.Geometry();
    var v1 = new THREE.Vector3(0,0,0);
    var v2 = new THREE.Vector3(10,0,0);
    var v3 = new THREE.Vector3(0,10,0);

    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);

    geometry.faces.push(new THREE.Face3(0, 2, 1));
    var redMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    var triangle = new THREE.Mesh(geometry, redMat);
    scene.add(triangle)
    return triangle;
}
