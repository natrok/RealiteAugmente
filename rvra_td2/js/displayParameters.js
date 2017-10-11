var displayParameters = {

  // parameters for stereo rendering
  // physical screen diagonal -- in mm
  screenDiagonal: 337.82, //mm
  screenResolutionWidth: 1440, //px
  aspectRatio: 1.6,
  // inter pupillar distance -- in mm
  ipd: 64,
  screenResolutionHeight: 1440 / 1.6,
  // distance bewteen the viewer and the screen -- in mm
  distanceScreenViewer: 500,

  // TODO: amount of distance in mm between adjacent pixels
  pixelPitch: function() {

    var pixelPitchf;
    var x = displayParameters.screenResolutionHeight;
    var y = displayParameters.screenResolutionWidth;
    var diagPixel = Math.sqrt( (x*x) + (y*y));
    //pixels distance
    pixelPitchf = displayParameters.screenDiagonal / diagPixel ;
    return pixelPitchf;
  },

  //TODO: physical display width and height -- in mm
  screenSize: function() {
  return new THREE.Vector2(displayParameters.screenResolutionWidth, displayParameters.screenResolutionHeight);
  }

};
