function AnaglyphRenderer ( renderer ) {

  // left and right cameras
  this.cameraLeft  = new THREE.Camera();
  this.cameraLeft.matrixAutoUpdate = false;
  this.cameraRight = new THREE.Camera();
  this.cameraRight.matrixAutoUpdate = false;

  var set = false;
  var gl = renderer.domElement.getContext( 'webgl' );
  var lbool,rbool = false;
  //cameraOption por defaut
  var cameraOption = this.cameraLeft ;
  lbool  = true;

  var matPerspective = new THREE.Matrix4();

  var w_h = new THREE.Vector2( );
  w_h = displayParameters.screenSize();

  var w = w_h.x * displayParameters.pixelPitch();
  var h = w_h.y * displayParameters.pixelPitch();

  var znear = 0.1;
  var zfar = 100000;
  var top = znear * ( h / (2 * displayParameters.distanceScreenViewer ));
  var bottom = -znear * (h / (2 * displayParameters.distanceScreenViewer));
  var right = znear * ((w + displayParameters.ipd) / (2 * displayParameters.distanceScreenViewer)) ;
  var left = -znear * ((w - displayParameters.ipd) / (2 * displayParameters.distanceScreenViewer)) ;

  matPerspective.makePerspective( left, right, top, bottom, znear, zfar );
  document.addEventListener( 'keypress', keypress, false );

	this.update = function ( camera ) {
    // TODO

    this.cameraLeft.updateMatrixWorld();
    this.cameraRight.updateMatrixWorld();
    var matViewr = camera.matrixWorld;
    var matViewl = camera.matrixWorld;
    var ipdr = displayParameters.ipd/2;


    //if (!set){
    this.cameraRight.matrix.set(matViewr);
    this.cameraLeft.matrix.set(matViewl);
    //}
    if (!set){
    this.cameraLeft.translateX(-ipdr);
    this.cameraRight.translateX(ipdr);
    set = true;
    }


    //matViewr.makeTranslation (ipdr, 0, 0 );

    //matViewl.makeTranslation (-ipdr, 0, 0 );




/*
    var position = camera.position.clone();
    this.cameraLeft.setPosition = position;
    this.cameraRight.setPosition = position;
    this.cameraLeft.translateX(-displayParameters.ipd / 2.0);
    this.cameraRight.translateX(displayParameters.ipd / 2.0);
*/
    console.log("l:", this.cameraLeft.position.x);
    console.log("r:", this.cameraRight.position.x);



    this.cameraLeft.projectionMatrix = matPerspective;
    this.cameraRight.projectionMatrix = matPerspective;

  }

  this.render = function ( scene, camera ) {

  //  this.update(camera);
    //camera = cameraOption;

    renderer.clearDepth();

    //if(lbool){
    gl.colorMask(true,false,false,true);
    renderer.render( scene, this.cameraLeft );

    //}else{
    gl.colorMask(false,false,true,true);
    renderer.render( scene, this.cameraRight );
    //}
  }


  function keypress(e){
  /*  //0
    if (e.keyCode === 49){
      cameraOption = this.cameraRight;
      rbool = true;
      lbool = false;
    }//1
    if (e.keyCode === 48){
      cameraOption = this.cameraLeft
      lbool = true;
      rbool = false;
    };*/
  }

}
