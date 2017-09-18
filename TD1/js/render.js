document.addEventListener("keyup", keyupFunction);
document.addEventListener("keydown", keydownFunction);

/*pointerlock*/
document.addEventListener("pointerlockchange", pointerlockchange);
document.addEventListener("mozpointerlockchange", pointerlockchange);
document.addEventListener("webkitpointerlockchange", pointerlockchange);


window.addEventListener("resize", onWindowResize);

var container, stats, renderer,  controls;
var scene, sceneOrto;
var camera, cameraOrto;
var cube, line;

/*Keyboards*/
var up = false;
var right = false;
var down = false;
var left = false;

var clock, velocity;

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  /*scene*/
  scene = new THREE.Scene();
  sceneOrto = new THREE.Scene();

  /*camera*/   /*OrthographicCamera( left, right, top, bottom, near, far )*/
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  cameraOrto = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
  cameraOrto.position.z = 1;

  /*renderer*/
  renderer = new THREE.WebGLRenderer();
  /*add render to page with the good size*/
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );

  /*clock*/
  clock = new THREE.Clock();
  velocity = new THREE.Vector3();


  /*textures*/
  var txt_tnt1 = new THREE.TextureLoader().load('textures/tnt1.png');
  var txt_tnt2 = new THREE.TextureLoader().load('textures/tnt2.png')
  var txt_brick = new THREE.TextureLoader().load('textures/stonebrick.png');
  var txt_sand = new THREE.TextureLoader().load('textures/sand.png');

  /*geometries*/
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );

  var geo_linecross = new THREE.Geometry();
  geo_linecross.vertices.push(new THREE.Vector3(-20, 0, 0));
  geo_linecross.vertices.push(new THREE.Vector3(20, 0, 0));
  var geo_linedown = new THREE.Geometry();
  geo_linedown.vertices.push(new THREE.Vector3(0, -20, 0));
  geo_linedown.vertices.push(new THREE.Vector3(0, 20 , 0));


  /*material*/
  var material = new THREE.MeshBasicMaterial( { map: txt_tnt1 });
  var mat_brick = new THREE.MeshBasicMaterial( { map: txt_brick });
  var mat_sand = new THREE.MeshBasicMaterial( { map: txt_sand });
  /*line material*/
  var mat_line = new THREE.LineBasicMaterial({ color: 0x0000ff });
keydownFunction
  var materialArray  = new Array();
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt2 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt2 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));


  /*mesh use geometrie and apply material*/
  cube = new THREE.Mesh( geometry, materialArray );
  cube.position.set(0,0,0);
  scene.add( cube );

  line = new THREE.Line(geo_linecross, mat_line);
  sceneOrto.add( line );
  line = new THREE.Line(geo_linedown, mat_line);
  sceneOrto.add( line );

  /*brick*/
  for (var i = -10; i<10;i++)
  {
    for (var j = -10; j<10;j++){
      cube = new THREE.Mesh( geometry, mat_brick );keydownFunction
      cube.position.set(i,-1,j);
      scene.add( cube );scene
   }
 }

  /*Sable*/
  for (var i = -10; i<10;i++)
  {
    for (var j = -10; j<10;j++){
      cube = new THREE.Mesh( geometry, mat_sand );
      cube.position.set(i,-2,j);
      scene.add( cube );
   }
  }

  controlInit();document.addEventListener("pointerlockchange", keydownFunction);
document.addEventListener("mozpointerlockchange", keydownFunction);


  camera.position.y = -1;

  // statskeydownFunction
  stats = new Stats();
  container.appendChild( stats.dom );
};


function animate() {
  requestAnimationFrame( animate );
  render();
  //controls.update(delta);
  //controls.update();
  stats.update();

}

function controlInit() {
  controls = new THREE.PointerLockControls( camera, renderer.domElement );
  controls.enabled = true;
  scene.add( controls.getObject() );

  /*controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;*/
}

function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrto.left = - width / 2;
  cameraOrto.right = width / 2;
  cameraOrto.top = height / 2;
  cameraOrto.bottom = - height / 2;
  cameraOrto.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function keydownFunction(e) {
  if (e.keyCode === 38 /* up */ || e.keyCode === 90 /* z */)
    up = true;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */)
    right = true;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */)
    down = true;
  if (e.keyCode === 37 /* left */ || e.keyCode === 81 /* q */)
    left = true;
}

function keyupFunction(e) {
  if (e.keyCode === 38 /* up */ ||  e.keyCode === 90 /* z */)
    up = false;  camera.position.z = 3;
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */)
    right = false;
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */)
    down = false;
  if (e.keyCode === 37 /* left */ ||  e.keyCode === 81 /* q */)
    left = false;
}


function render() {

  var delta = clock.getDelta();
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  if ( up ) velocity.z -=20.0 * delta;
  if ( down ) velocity.z +=20.0 * delta;
  if ( right ) velocity.x +=20.0 * delta;
  if ( left ) velocity.x -=20.0 * delta;

  controls.getObject().translateX( velocity.x * delta );
  controls.getObject().translateZ( velocity.z * delta );
  renderer.clear();
  renderer.render( scene, camera );
  renderer.clearDepth();
  renderer.render( sceneOrto, cameraOrto );
}

function pointerlockchange() {

}
