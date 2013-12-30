/*
 *
 * This program is licensed under the MIT License.
 * Copyright 2013, aike (@aike1000)
 *
 */

var ThView = function(arg) {
	var d2r = function(d) { return d * Math.PI / 180; };
	this.id = arg.id;											// id of parent element *required*
	this.file = arg.file;										// filename *required*
	// note: image file must be located at same origin

	this.width = (arg.width == undefined) ? 500 : arg.width;				// pixel (500)
	this.height = (arg.height == undefined) ? 300 : arg.height;				// pixel (300)
	this.rotation = (arg.rotation == undefined) ? false : arg.rotation;		// true/false (false)
	this.speed = (arg.speed == undefined) ?
			0.001 * 10 / 10 : 0.001 * arg.speed / 10;						// -100..-1, 1..100 (10)
	this.zoom = (arg.zoom == undefined) ? 70 : arg.zoom;					// 10 .. 500 (70)
	this.firstview = (arg.firstview == undefined) ? 0 : d2r(-arg.firstview);// 0 .. 360 (0)
	this.degree = (arg.degree == undefined) ? [0, 0, 0]						// [0,0,0] .. [360,360,360] ([0,0,0])
					: [d2r(arg.degree[0]), d2r(arg.degree[1]), d2r(arg.degree[2])];
	this.rendererType = (arg.rendererType == undefined) ? 0 : arg.rendererType;	// 0,1,2 (0)

	this.show();
}

ThView.prototype.toggleRotation = function() {
	this.rotation = ! this.rotation;
}


ThView.prototype.show = function() {
	var self = this;
	this.element = document.getElementById(this.id);

	var renderer;
	if (this.rendererType == 0)
		renderer = new THREE.WebGLRenderer({ antialias:true });
	else if (this.rendererType == 1)
		renderer = new THREE.CanvasRenderer({ antialias:true });
	else
		renderer = new THREE.CSS3DRenderer({ antialias:true });
	renderer.setSize(this.width, this.height);
	renderer.setClearColorHex(0x000000, 1);
	this.element.appendChild(renderer.domElement);	// append to <DIV>
	this.element.onclick = function() {self.toggleRotation();};

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(this.zoom, this.width / this.height);
	camera.position = new THREE.Vector3(0, 0, 0);
	camera.lookAt(new THREE.Vector3(Math.sin(this.firstview), 0, Math.cos(this.firstview)));
	scene.add(camera);

	var light = new THREE.AmbientLight(0xffffff);
	scene.add(light);

	var geometry = new THREE.SphereGeometry(100, 32, 16);
	var texture = THREE.ImageUtils.loadTexture(this.file);
	texture.flipY = false;
	var material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		color: 0xffffff, specular: 0xcccccc, shininess:50, ambient: 0xffffff,
		map: texture });
	var mesh = new THREE.Mesh(geometry, material);
	if (this.rendererType == 0)
		mesh.rotation.x = Math.PI;
	mesh.rotation.x += this.degree[0];
	mesh.rotation.y += this.degree[1];
	mesh.rotation.z += this.degree[2];
	scene.add(mesh);

	function render() {
		requestAnimationFrame(render);
		if (self.rotation)
			mesh.rotation.y += self.speed;
		renderer.render(scene, camera);
	};
	render();
}
