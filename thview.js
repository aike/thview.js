/*
 *
 * This program is licensed under the MIT License.
 * Copyright 2014, aike (@aike1000)
 *
 */

var ThView = function(arg) {
	this.d2r = function(d) { return d * Math.PI / 180; };
	this.id = arg.id;											// id of parent element *required*
	// note: image file must be located at same origin
	if (arg.file instanceof Array) {
		this.file = arg.file;									// filename *required*
	} else {
		this.file = [arg.file];
	}
	this.interval = (arg.interval == undefined) ? 500 : arg.interval;		// animation rate

	this.width = (arg.width == undefined) ? 500 : arg.width;				// pixel (500)
	this.height = (arg.height == undefined) ? 300 : arg.height;				// pixel (300)
	this.rotation = (arg.rotation == undefined) ? false : arg.rotation;		// true/false (false)
	this.speed = (arg.speed == undefined) ?
			0.001 * 10 / 10 : 0.001 * arg.speed / 10;						// -100..-1, 1..100 (10)
	this.zoom = (arg.zoom == undefined) ? 70 : arg.zoom;					// 20 .. 130 (70)
	this.firstview = (arg.firstview == undefined) ? 0 : this.d2r(-arg.firstview);// 0 .. 360 (0)
	this.degree = (arg.degree == undefined) ? [0, 0, 0]						// [0,0,0] .. [360,360,360] ([0,0,0])
					: [this.d2r(arg.degree[0]), this.d2r(arg.degree[1]), this.d2r(arg.degree[2])];
	this.rendererType = (arg.rendererType == undefined) ? 0 : arg.rendererType;	// 0,1,2 (0)

	///////// camera direction
	this.pan = this.firstview;
	this.tilt = 0;
	this.cameraDir = new THREE.Vector3(Math.sin(this.pan), Math.sin(this.tilt), Math.cos(this.pan));
	this.oldPosition = {x:null, y:null};
	this.mousedown = false;
	this.moving = false;

	///////// interval images
	this.imageNo = 0;

	///////// parent element
	this.element = document.getElementById(this.id);

	///////// dual screen for HMD
	if (arg.hmd) {
		if (this.element.style.position === '')
			this.element.style.position = 'relative';

		this.width = Math.floor(arg.width / 2);
		arg.width = this.width;
		arg.id = arg.id + '_slave';
		arg.hmd = undefined;

		var slavediv = document.createElement('div');
		slavediv.id = arg.id;
		slavediv.style.position = 'absolute';
		slavediv.style.left = this.width + 'px';
		slavediv.style.top = 0 + 'px';
		this.element.appendChild(slavediv);
		arg.element = slavediv;

		this.sync = new ThView(arg);
		this.sync.sync = this;
		this.sync.isSlave = true;
	}
	this.element.style.height = this.height + 'px';
	this.element.style.width = this.width + 'px';
	this.element.style.cursor = 'move';

	///////// call main process
	this.show();
}

ThView.prototype.toggleRotation = function() {
	this.rotation = ! this.rotation;
}

///////// drag callback
ThView.prototype.rotateCamera = function(x, y) {
	if (!this.mousedown)
		return;

	var pos = {x:x, y:y};
	if (this.oldPosition.x === null) {
		this.oldPosition = pos;
		return;
	}

	this.pan -= (this.oldPosition.x - pos.x) * 0.005;
	this.tilt -= (this.oldPosition.y - pos.y) * 0.004;
	var limit = Math.PI / 2 - 0.1;
	if (this.tilt > limit) this.tilt = limit;
	if (this.tilt < -limit) this.tilt = -limit;

	this.cameraDir.x = Math.sin(this.pan) * Math.cos(this.tilt);
	this.cameraDir.z = Math.cos(this.pan) * Math.cos(this.tilt);
	this.cameraDir.y = Math.sin(this.tilt);
	this.camera.lookAt(this.cameraDir);

	if (this.sync) {
		this.sync.camera.lookAt(this.cameraDir);
	}

	this.oldPosition = pos;

	this.moving = true;
}

ThView.prototype.setCameraDir = function(alpha, beta, gamma) {
	if (this.rotation) {
		this.rotation = false;
	}

	switch (window.orientation) {
		case 0:
			this.mesh.rotation.x = this.degree[0] + Math.PI + Math.PI / 2;
			this.mesh.rotation.y = this.degree[1];
			this.mesh.rotation.z = this.degree[2];
			this.camera.rotation.x = beta;
			this.camera.rotation.y = gamma;
			this.camera.rotation.z = alpha;
			break;
		case 90:
			this.mesh.rotation.x = this.degree[0] + Math.PI;
			this.mesh.rotation.y = this.degree[1] + alpha - Math.PI / 2;
			this.mesh.rotation.z = this.degree[2];
			this.camera.rotation.x = -gamma - Math.PI / 2;
			this.camera.rotation.y = 0;
			this.camera.rotation.z = -beta;
			break;
		case -90:
			this.mesh.rotation.x = this.degree[0] + Math.PI;
			this.mesh.rotation.y = this.degree[1] + alpha - Math.PI / 2;
			this.mesh.rotation.z = this.degree[2] + 0;
			this.camera.rotation.x = -(-gamma - Math.PI / 2);
			this.camera.rotation.y = 0;
			this.camera.rotation.z = -beta + Math.PI;
			break;
		case 180:
			this.mesh.rotation.x = this.degree[0] + Math.PI + Math.PI / 2;
			this.mesh.rotation.y = this.degree[1];
			this.mesh.rotation.z = this.degree[2];
			this.camera.rotation.x = -beta;
			this.camera.rotation.y = -gamma;
			this.camera.rotation.z = alpha + Math.PI;
			break;
		}
};

///////// wheel callback
ThView.prototype.zoomCamera = function(val) {
	this.zoom += val * 0.1;
	if (this.zoom < 20) this.zoom = 20;
	if (this.zoom > 130) this.zoom = 130;
	this.camera.fov = this.zoom;
	this.camera.updateProjectionMatrix();

	if (this.sync) {
		this.sync.camera.fov = this.zoom;
		this.sync.camera.updateProjectionMatrix();
	}

}


///////// main process
ThView.prototype.show = function() {
	var self = this;

	///////// RENDERER
	var renderer;
	if (this.rendererType == 0)
		renderer = new THREE.WebGLRenderer({ antialias:true });
	else if (this.rendererType == 1)
		renderer = new THREE.CanvasRenderer({ antialias:true });
	else
		renderer = new THREE.CSS3DRenderer({ antialias:true });
	renderer.setSize(this.width, this.height);
	renderer.setClearColor(0x000000, 1);
	this.element.appendChild(renderer.domElement);	// append to <DIV>

	///////// callback setting
	var onmouseupOrg = document.onmouseup;
	document.onmouseup = function() {
		if (onmouseupOrg)
			onmouseupOrg();
		self.mousedown = false;
	};
	this.element.onmousedown = function(e) { 
		self.mousedown = true;
		self.oldPosition = {x:e.pageX, y:e.pageY};
	};
	this.element.onmousemove = function(e) {
		self.rotateCamera(e.pageX, e.pageY);
	};
	this.element.onclick = function() {
		if (!self.moving)
			self.toggleRotation();
		self.moving = false;
	};

	// chrome / safari / IE
	this.element.onmousewheel = function(e) {
		var delta = e.deltaY ? e.deltaY : e.wheelDelta ? -e.wheelDelta : -e.wheelDeltaY * 0.2;
		self.zoomCamera(delta);
		e.preventDefault();
	};
	// firefox
	this.element.addEventListener("DOMMouseScroll", function(e) {
		self.zoomCamera(e.detail * 5);
		e.preventDefault();
	});

	// iOS
	window.addEventListener("deviceorientation", function(e){
		if (e.alpha) {
			self.setCameraDir(self.d2r(e.alpha), self.d2r(e.beta), self.d2r(e.gamma));
		}
	});
	window.addEventListener("orientationchange", function(e){
	});

	///////// SCENE
	var scene = new THREE.Scene();

	///////// CAMERA
	this.camera = new THREE.PerspectiveCamera(this.zoom, this.width / this.height);
	this.camera.position = new THREE.Vector3(0, 0, 0);
	this.camera.lookAt(this.cameraDir);
	this.camera.rotation.order = 'ZXY';
	scene.add(this.camera);

	///////// LIGHT
	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);

	///////// SPHERE
	var geometry = new THREE.SphereGeometry(100, 32, 16);

	///////// TEXTURE
	this.texture = new Array(this.file.length);
	for (var i = 0; i < this.texture.length; i++) {
		this.texture[i] = THREE.ImageUtils.loadTexture(this.file[i]);
		this.texture[i].flipY = false;
	}

	///////// MATERIAL
	this.material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		color: 0xffffff, specular: 0xcccccc, shininess:50, ambient: 0xffffff,
		map: this.texture[this.imageNo] });

	//// texture animation
	if ((this.texture.length > 1) && (!self.isSlave)) {
		setInterval(function() {
			self.imageNo = (self.imageNo + 1) % self.texture.length;
			self.material.map = self.texture[self.imageNo];
			if (self.sync) {
				self.sync.material.map = self.sync.texture[self.imageNo];
			}
		}, this.interval);
	}

	///////// MESH
	this.mesh = new THREE.Mesh(geometry, this.material);
	if (this.rendererType == 0)
		this.mesh.rotation.x += Math.PI;
	this.mesh.rotation.x += this.degree[0];
	this.mesh.rotation.y += this.degree[1];
	this.mesh.rotation.z += this.degree[2];
	scene.add(this.mesh);

	///////// Draw Loop
	function render() {
		requestAnimationFrame(render);
		if ((self.rotation) && (!self.isSlave)) {
			self.mesh.rotation.y += self.speed;
			if (self.sync) {
				self.sync.mesh.rotation.y += self.speed;
			}
		}
		renderer.render(scene, self.camera);
	};
	render();
}
