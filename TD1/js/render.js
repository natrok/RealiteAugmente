document.addEventListener("keyup", keyupFunction);
document.addEventListener("keydown", keydownFunction);
window.addEventListener("resize", onWindowResize);
document.addEventListener("click", clickFunction);


var container, stats, renderer, colorPickRenderTexture, controls;
var scene, sceneOrto, sceneHide;
var camera, cameraOrto;
var cube, line, cubeClone;

/*Keyboards*/
var up = false;
var right = false;
var down = false;
var left = false;
var clock, velocity;

var pickingMat;
var mouse = new THREE.Vector2();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  /*scene*/
  scene = new THREE.Scene();
  sceneOrto = new THREE.Scene();
  sceneHide = new THREE.Scene();

  /*camera*/   /*OrthographicCamera( left, right, top, bottom, near, far )*/
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  cameraOrto = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
  cameraOrto.position.z = 1;

  /*renderer*/
  renderer = new THREE.WebGLRenderer();

  colorPickRenderTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  colorPickRenderTexture.texture.minFilter = THREE.LinearFilter;

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

  var materialArray  = new Array();
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt2 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt2 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: txt_tnt1 }));

  pickingMat = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors });

  /*mesh use geometrie and apply material*/
  cube = new THREE.Mesh( geometry, materialArray );
  cube.position.set(0,0,0);
  scene.add( cube );

  cubeClone = new THREE.Mesh( cube.geometry.clone(), pickingMat);
  applyFaceColor(cubeClone.geometry, cubeClone.id);
  cubeClone.position.set(0,0,0);
  sceneHide.add( cubeClone );

  line = new THREE.Line(geo_linecross, mat_line);
  sceneOrto.add( line );
  line = new THREE.Line(geo_linedown, mat_line);
  sceneOrto.add( line );

  /*brick*/
  for (var i = -10; i<10;i++)
  {
    for (var j = -10; j<10;j++){
      cube = new THREE.Mesh( geometry, mat_brick );
      cube.position.set(i,-1,j);
      scene.add( cube );

      cubeClone = new THREE.Mesh( cube.geometry.clone(), pickingMat);
      //IL Faut forcer la clonation de lq geometry
      applyFaceColor(cubeClone.geometry, cubeClone.id);
      cubeClone.position.set(i,-1,j);
      sceneHide.add( cubeClone );
   }
 }

  /*Sable*/
  for (var i = -10; i<10;i++)
  {      //mat_brick pickingMat
    for (var j = -10; j<10;j++){
      cube = new THREE.Mesh( geometry, mat_sand );
      cube.position.set(i,-2,j);
      scene.add( cube );
      //il faut le material
      cubeClone = new THREE.Mesh( cube.geometry.clone(), pickingMat);
      applyFaceColor(cubeClone.geometry, cubeClone.id);
      cubeClone.position.set(i,-2,j);
      sceneHide.add( cubeClone );

      console.log(cubeClone.id  +"-"+cube.id);

   }
  }

  controlInit();
  camera.position.y = -1;
  // statskeydownFunction
  stats = new Stats();
  container.appendChild( stats.dom );
};


function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();

}

function controlInit() {
  controls = new THREE.PointerLockControls( camera, renderer.domElement );
  controls.enabled = true;
  scene.add( controls.getObject() );
  sceneHide.add( controls.getObject() );
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
  //hide texture
  //IL FAUT POUR EFFACER LE RENDER BIEN
  renderer.clearDepth();
  renderer.clear();
  renderer.clearTarget( colorPickRenderTexture, true, true, true );

  renderer.render( sceneHide, camera, colorPickRenderTexture );
  renderer.render( scene, camera );
  renderer.render( sceneOrto, cameraOrto );
}

function applyFaceColor( geom, color ) {
	geom.faces.forEach( function( f ) {
		f.color.setHex(color);
	} );
}

function clickFunction(e){
  pick();
}

function pick(){
    //create buffer for reading single pixel
  var pixelBuffer = new Uint8Array( 4 );
  renderer.readRenderTargetPixels(colorPickRenderTexture, window.innerWidth / 2, window.innerHeight / 2, 1, 1, pixelBuffer);
  //interpret the pixel as an ID
  var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
  //console.log(id);
  scene.remove(scene.getObjectById( id -1));
  sceneHide.remove(sceneHide.getObjectById( id));

  /*var object = scene.getObjectById( id );
  if (!object) {
    return;
  }
  else {
    object.parent.remove(object);
  }*/
}
