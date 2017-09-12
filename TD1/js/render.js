var container, stats, renderer, cube , controls , scene ,camera;

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );


  /*scene*/
  scene = new THREE.Scene();
  /*camera*/
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  /*renderer*/
  renderer = new THREE.WebGLRenderer();
  /*add render to page with the good size*/
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  /*textures*/
  var txt_tnt1 = new THREE.TextureLoader().load('textures/tnt1.png');
  var txt_tnt2 = new THREE.TextureLoader().load('textures/tnt2.png')
  var txt_brick = new THREE.TextureLoader().load('textures/stonebrick.png');
  var txt_mossy = new THREE.TextureLoader().load('textures/stonebrick_mossy.png');

  /*geometries*/
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { map: txt_tnt1 });
//  ,'new THREE.MeshBasicMaterial( { map: txt_tnt2 }'];

  /*mesh use geometrie and apply material*/
  cube = new THREE.Mesh( geometry, material );



  //controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controlInit();

  scene.add( cube );
  camera.position.z = 5;
  // stats
  stats = new Stats();
  container.appendChild( stats.dom );

};


function animate() {

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  //cube.rotation.x += 0.1;
  //cube.rotation.y += 0.1;
  //controls.update(THREE.Clock.getDelta());
  controls.update();
  stats.update();

}

function controlInit() {
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
}
