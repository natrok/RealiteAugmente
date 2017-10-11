var canvas, context, imageData, imageDst;

var renderer;

var Menu = function() {
  this.threshold = false;
  this.colorRGB = [0, 0, 0];
  this.tolerance = 15;
};

var menu, stats;

function init() {

  canvas = document.getElementById("canvas");
  canvas.width = parseInt(canvas.style.width);
  canvas.height = parseInt(canvas.style.height);

  context = canvas.getContext("2d");

  imageDst = new ImageData( canvas.width, canvas.height)

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0xffffff, 1);
  document.getElementById("container").appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
  scene.add(camera);
  texture = createTexture();
  scene.add(texture);

  // GUI
  menu = new Menu();
  var gui = new dat.GUI();
  gui.add(menu, 'threshold', 0, 100);
  gui.addColor(menu, 'colorRGB').listen();
  gui.add(menu, 'tolerance');

  // stats
  stats = new Stats();
  document.getElementById("container").appendChild( stats.dom );

  // Choisir la couleur par clic de souris
  canvas.addEventListener("click", function(event) {
    if (event.button == 0) {
      var x = event.clientX, y = event.clientY;
      var pix = context.getImageData(x, y, 1, 1);
      menu.colorRGB = [pix.data[0], pix.data[1], pix.data[2]];
    }
  }, true);

  animate();
}

function threshold(imageData, imageDst) {
  var src = imageData.data, dst = imageDst.data,
      len = src.length, tabR = [], tabG = [], tabB = [], i
      t = menu.tolerance, c = menu.colorRGB;

  var min = [c[0] - t, c[1] - t, c[2] - t];
  var max = [c[0] + t, c[1] + t, c[2] + t];

  var monoData = [];
  for (i = 0; i < len; i += 4){
    var val = 0;
    if (src[i] >= min[0] && src[i] <= max[0] && src[i+1] >= min[1] && src[i+1] <= max[1]
      && src[i+2] >= min[2] && src[i+2] <= max[2]){
      val = 255;
    }
    dst[i]     = val;
    dst[i + 1] = val;
    dst[i + 2] = val;
    dst[i + 3] = src[i + 3];
    monoData[i/4] = val;
  }

  imageDst.width = imageData.width;
  imageDst.height = imageData.height;

  return new CV.Image(imageData.width, imageData.height, monoData);
}

function createTexture() {
  var texture = new THREE.Texture(imageDst),
      object = new THREE.Object3D(),
      geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
      material = new THREE.MeshBasicMaterial( {map: texture, depthTest: false, depthWrite: false} ),
      mesh = new THREE.Mesh(geometry, material);

  texture.minFilter = THREE.NearestFilter;

  object.position.z = -1;

  object.add(mesh);

  return object;
}

function animate() {

  requestAnimationFrame( animate );

  if (video.readyState === video.HAVE_ENOUGH_DATA){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var tmp = new CV.Image(canvas.width, canvas.height);

    if(menu.threshold) {
      monoThres = threshold(imageData, imageDst);
      //var binary = new ImageData(canvas.width, canvas.height);
      contours = CV.findContours(monoThres, tmp);

      var maxLenght = 0;
      var maxIdx = -1;
      for (var i = 0; i < contours.length; i++) {
        var l = contours[i].length;
        if (l > maxLenght) {
          maxLenght = l;
          maxIdx = i;
        }
      }

      maxContour = contours[maxIdx];
      var xCentre = 0,yCentre = 0;
      for (var i = 0; i < maxContour.length; i++) {
        xCentre += maxContour[i].x;
        yCentre += maxContour[i].y;
      }
      xCentre /= maxContour.length;
      yCentre /= maxContour.length;

      var distance = 0,d=0;
      for (var i = 0; i < maxContour.length; i++) {
        d = (maxContour[i].x - xCentre)*(maxContour[i].x - xCentre) + (maxContour[i].y - yCentre)*(maxContour[i].y - yCentre);
        if(d>distance)
          distance =d;
      }
      distance = Math.sqrt(distance);


      context.beginPath();
      context.arc(xCentre, yCentre, distance, 0, 2*Math.PI);
      context.strokeStyle = "red";
      context.lineWidth = 5;
      context.stroke();

    } else {
      imageDst.data.set(imageData.data);
    }


    texture.children[0].material.map.needsUpdate = true;
    render();
  }
}

function render() {

  renderer.clear();
  renderer.render(scene, camera);

  stats.update();

}
