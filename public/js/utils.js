// Just some random utils
(function (EasyLoader, THREE) {
    var loader;
    EasyLoader.JSONLoader = function (manager) {
        loader = new THREE.JSONLoader;
        this.manager = manager;
    }
    EasyLoader.JSONLoader.prototype.manager = null;
    EasyLoader.JSONLoader.prototype.load = function (url, callback, texturePath) {
        this.manager.itemStart(url);
        var scope = this;
        loader.load(url, function () {
            callback.apply(this, arguments);
            scope.manager.itemEnd(url);
        }, texturePath);
    };
});

CameraPlane = {
    camera: null,
    farTopRight: null,
    farTopLeft: null,
    farBottomRight: null,
    farBottomLeft: null,

    nearTopRight: null,
    nearTopLeft: null,
    nearBottomRight: null,
    nearBottomLeft: null,

    compute: function (_camera) {
        this.camera = _camera;
        var hFar = 2 * Math.tan(camera.fov * Math.PI / 180 / 2) * this.camera.far;
        var wFar = hFar * this.camera.aspect;

        this.farTopLeft = new THREE.Vector3(-wFar / 2, hFar / 2, -this.camera.far);
        this.farBottomRight = new THREE.Vector3(wFar / 2, -hFar / 2, -this.camera.far);
        this.farTopRight = new THREE.Vector3(wFar / 2, hFar / 2, -this.camera.far);
        this.farBottomLeft = new THREE.Vector3(-wFar / 2, -hFar / 2, -this.camera.far);

        this.camera.updateMatrixWorld();

        this.farTopLeft.applyMatrix4(this.camera.matrixWorld);
        this.farBottomRight.applyMatrix4(this.camera.matrixWorld);
        this.farTopRight.applyMatrix4(this.camera.matrixWorld);
        this.farBottomLeft.applyMatrix4(this.camera.matrixWorld);

        var hNear = 2 * Math.tan(this.camera.fov * Math.PI / 180 / 2) * this.camera.near;
        var wNear = hNear * this.camera.aspect;

        this.nearTopLeft = new THREE.Vector3(-wNear / 2, hNear / 2, -this.camera.near);
        this.nearBottomRight = new THREE.Vector3(wNear / 2, -hNear / 2, -this.camera.near);
        this.nearTopRight = new THREE.Vector3(wNear / 2, hNear / 2, -this.camera.near);
        this.nearBottomLeft = new THREE.Vector3(-wNear / 2, -hNear / 2, -this.camera.near);

        this.camera.updateMatrixWorld();
        this.nearTopLeft.applyMatrix4(this.camera.matrixWorld);
        this.nearBottomRight.applyMatrix4(this.camera.matrixWorld);
        this.nearTopRight.applyMatrix4(this.camera.matrixWorld);
        this.nearBottomLeft.applyMatrix4(this.camera.matrixWorld);
    },
};

// Generate the UVs required for an animated frame.
AnimatedFrame = {
    width: 1494,
    height: 1336,

    framesWide: 3,
    framesTall: 4,

    spriteIndex: function (index) {
        if (index < this.framesWide) {
            return [index, 0];
        }
        var y = Math.floor(index / this.framesWide);
        var offt = index - (this.framesWide * y);
        return [Math.round(offt), Math.round(y)];
    },


    // for quads
    getFrameCoords: function (index) {
        var result = [];

        var frame = this.spriteIndex(index);
        var x = frame[0];
        var y = frame[1];

        var tX = 1.0 / this.framesWide;
        var tY = 1.0 / this.framesTall;
        var xc = (tX * x);
        var yc = 1.0 - (tY * y);

        var x1 = xc;
        var y1 = yc;

        var x2 = x1 + tX;
        var y2 = y1;

        var x3 = x1;
        var y3 = y1 - tY;

        var x4 = x1 + tX;
        var y4 = y1 - tY;

        // ready for faceVertexUvs

        result.push([new THREE.Vector2(x3, y3), //a
            new THREE.Vector2(x1, y1), //b
            new THREE.Vector2(x2, y2), //c
        ]);

        result.push([new THREE.Vector2(x4, y4), //d
            new THREE.Vector2(x3, y3), //a
            new THREE.Vector2(x2, y2), //c
        ]);

        return result;
    }

};

// the various animated states will have different frames/types
AnimatedState = (function () {
    this.name = "";
    this.frames = [];
    this.uvCache = {};
    this.currentFrame = 0;
    this.frameDelay = 20;
    this.lastUpdate = 0;

    this.setupWithFrames = function (_name, _frames) {
        this.currentFrame = 0;
        this.name = _name;
        this.frames = _frames.slice();
    };

    this.getFrameUVs = function () {
        var ct = currentTime();

        if (this.lastUpdate == 0) {
            this.lastUpdate = ct;
        }

        if ((ct - this.lastUpdate) >= 40) {
            this.currentFrame = this.currentFrame + 1;
            this.lastUpdate = ct;
            if (this.currentFrame > 11) {
                this.currentFrame = 0;
            }
        }

        // Cache UV storage so we don't have to perform math all the time
        //
        //
        var cached = this.uvCache[this.currentFrame.toString()];

        if (cached) {
            return cached;
        }
        cached = AnimatedFrame.getFrameCoords(this.currentFrame);
        this.uvCache[this.currentFrame.toString()] = cached;
        return cached;
    };
});

// This is a simple mesh/object with spirte sheet support
AnimatedObject = (function () {
    this.type = null;
    this.geometry = null;
    this.mesh = null;
    this.height = null;
    this.width = null;
    this.position = null;
    this.material = null;

    // needs to be configurable
    this.imageWidth = 1494;
    this.height = 1336;
    this.framesWide = 3;
    this.framesTall = 4;

    this.lastUpdate = new Date();
    this.currentAnimation = null;
    this.animations = [];
    this.animationRunning = false;
    this.currentFrame = 0;

    this.addAnimation = function (name, frames) {
        var state = new AnimatedState();
        state.setupWithFrames(name, frames);
        this.animations.push(state);
    };

    this.stopAnimation = function () {

    };

    this.startAnimation = function (name) {
        var animation = null;

        for (var i = 0; i < this.animations.length; i++) {
            var a = this.animations[i];
            if (a.name == name) {
                animation = a;
            }
        }

        if (animation == null) {
            return;
        }

        this.currentAnimation = animation;
        this.currentAnimation.currentFrame = 0;
        this.currentAnimation.lastUpdate = 0;
    };
    this.update = function () {
        var ct = currentTime();
        if (this.lastUpdate != null) {
            if ((ct - this.lastUpdate) < 1000 / 60) {
                return;
            }
        }
        this.geometry.faceVertexUvs[0] = this.currentAnimation.getFrameUVs();
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.currentFrame = this.currentFrame + 1;
        if (this.currentFrame > 2) {
            this.currentFrame = 0;
        }
        this.geometry.uvsNeedUpdate = true;
        this.lastUpdate = currentTime();
    };
});

ShaderStore = {
    shaders: [],
    updateShaders: function () {
    },
    get : function (name) {
      return this.shaders[name];
    },
    set: function (name, data) {
      this.shaders[name] = data;
    },
};

TextureStore = {
    textures: {},
    setTexture: function (name, texture) {
        this.textures[name] = texture;
    },
    getTexture: function (name) {
        return this.textures[name];
    },
    printTextures: function () {
    },
};

ModelStore = {
    models: {},
    setModel: function (name, mesh, geometry, materails) {
        var object = {}
        object["mesh"] = mesh;
        object["name"] = name;
        object["geometry"] = geometry;
        object["materials"] = materails;
        console.log("Adding ", name);
        this.models[name] = object;
    },
    getModel: function (name) {
        return this.models[name];
    },
    printTextures: function () {
    },
};

ObjectStore = {
    objects: [],
    addObject: function (obj) {
        this.objects.push(obj);
    },

    removeObject: function (obj) {

    },

    draw: function () {

    },

    update: function () {
        this.objects.forEach(function (o, i) {
            o.update();
        });
    },
};

var object = (function () {
    var obj;
    var type;
    var width;
    var height;
    var timeStart;
    var rotation = new AVector3();
    var scale = new AVector3();
});

var ASphere2D = (function () {

});

var ASphere3D = (function () {
    this.origin = new AVector3(0.0, 0.0, 0.0);
    this.theta = 0.0;
    this.phi = 0.0;
    this.radius = 0.0;

    this.target_phi = 0.0;
    this.target_theta = 0.0;
    this.target_radius = 0.0;

    this.FixIt = function (b) {
        var timeStep = 0.015;
        if (this.theta != b.theta) {
            this.theta = Lerp1D(this.theta,
                b.theta,
                timeStep);
        }
        if (this.phi != b.phi) {
            this.phi = Lerp1D(this.phi,
                b.phi,
                timeStep);
        }
    };

    this.print = function () {
        console.log(this.phi + " " + this.theta + " " + this.radius);
    };

    this.interp = function (b, step) {
    };

    this.convert = function () {
        var r = new AVector3();
        var x = Math.cos(this.theta) * Math.sin(this.phi) * this.radius;
        var z = Math.sin(this.theta) * Math.sin(this.phi) * this.radius;
        var y = Math.cos(this.phi) * this.radius;
        r.x = x + this.origin.x;
        r.y = y + this.origin.y;
        r.z = z + this.origin.z;
        return r;
    };
});

var AVector3 = (function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.print = function () {
        console.log(this.x + " " + this.y + " " + this.z);
    };
});

var colors = (function () {
    var rgba2hex = function (rgba) {
        return 0x11223344
    }
});

function DEG2RAD(a) {
    return a * .017453292519943295; // (angle / 180) * Math.PI;
}

// 1D Lerp
function Lerp1D(start, end, t) {
    var result = start + (end - start) * t;
    return result;
}

// AVector lerp
function Lerp(start, end, t) {
    var result = new AVector3();
    result.x = start.x + (end.x - start.x) * t;
    result.y = start.y + (end.y - start.y) * t;
    result.z = start.z + (end.z - start.z) * t;
    return result;
}

// Very simple variable range mapping system
function MapValue(value, toMin, toMax, fromMin, fromMax) {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
}

function Curve(P1, P2, CP1, CP2, t) {
    var result = new Vector3();

    var ab = Lerp(P1, CP1, t);
    var bc = Lerp(CP1, CP2, t);
    var cd = Lerp(CP2, P2, t);

    var abbc = Lerp(ab, bc, t);
    var bccd = Lerp(bc, cd, t);
    var dest = Lerp(abbc, bccd, t);
    return dest;
}

function placeSphere() {

}

function smoothstep(min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

// interpolate over a group of vectors (for various effects)
function InterpVectors(v1, v2, t) {

}

function currentTime() {
    return +new Date();
}

function directionForDegrees(location, degrees, stepSize) {
    var result = new AVector3(0, 0, 0);
    var x = Math.cos(DEG2RAD(degrees)) * stepSize;
    var y = Math.sin(DEG2RAD(degrees)) * stepSize;
    result.x = location.x + x;
    result.y = location.y + y;
    result.z = location.z;
    return result;
}


	 function FarPlaneWorld()
	 {
	     hFar = 2 * Math.tan(camera.fov * Math.PI / 180 / 2) * camera.far;
	     wFar = hFar * camera.aspect;

	     farTopLeft = new THREE.Vector3(-wFar / 2, hFar / 2, -camera.far);
	     farBottomRight = new THREE.Vector3(wFar / 2, -hFar / 2, -camera.far);
	     farTopRight = new THREE.Vector3(wFar / 2, hFar / 2, -camera.far);
	     farBottomLeft = new THREE.Vector3(-wFar / 2, -hFar / 2, -camera.far);

	     camera.updateMatrixWorld();
	     farTopLeft.applyMatrix4(camera.matrixWorld);
	     farBottomRight.applyMatrix4(camera.matrixWorld);
	     farTopRight.applyMatrix4(camera.matrixWorld);
	     farBottomLeft.applyMatrix4(camera.matrixWorld);
	 }

	 function NearPlaneWorld()
	 {
	     var hNear = 2 * Math.tan(camera.fov * Math.PI / 180 / 2) * camera.near;
	     var wNear = hNear * camera.aspect;

	     nearTopLeft     = new THREE.Vector3(-wNear / 2, hNear / 2, -camera.near);
	     nearBottomRight = new THREE.Vector3(wNear / 2, -hNear / 2, -camera.near);
	     nearTopRight    = new THREE.Vector3(wNear / 2, hNear / 2, -camera.near);
	     nearBottomLeft  = new THREE.Vector3(-wNear / 2, -hNear / 2, -camera.near);

	     camera.updateMatrixWorld();

	     nearTopLeft.applyMatrix4(camera.matrixWorld);
	     nearBottomRight.applyMatrix4(camera.matrixWorld);
	     nearTopRight.applyMatrix4(camera.matrixWorld);
	     nearBottomLeft.applyMatrix4(camera.matrixWorld);
	 }
