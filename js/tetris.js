if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = ( function () {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

window.Tetris = window.Tetris || {};

Tetris.init = function () {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    Tetris.renderer = new THREE.WebGLRenderer();
    Tetris.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    Tetris.scene = new THREE.Scene();


    Tetris.camera.position.z = 400;
    Tetris.scene.add(Tetris.camera);

    Tetris.renderer.setSize(WIDTH, HEIGHT);

    document.body.appendChild(Tetris.renderer.domElement);

    var boundingBoxConfig = {
        width:360,
        height:360,
        depth:1200,
        splitX:6,
        splitY:6,
        splitZ:20
    };
    Tetris.boundingBoxConfig = boundingBoxConfig;
    Tetris.blockSize = boundingBoxConfig.width / boundingBoxConfig.splitX;

    Tetris.Board.init(boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ);

    var boundingBox = new THREE.Mesh(
        new THREE.CubeGeometry(boundingBoxConfig.width, boundingBoxConfig.height, boundingBoxConfig.depth, boundingBoxConfig.splitX, boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
        new THREE.MeshBasicMaterial({ color:0xff0000, wireframe:true })
    );
    Tetris.scene.add(boundingBox);

    Tetris.renderer.render(Tetris.scene, Tetris.camera);

  document.getElementById("play_button").addEventListener('click', function (event) {
    event.preventDefault();
    Tetris.start();
  });
};


Tetris.start = function() {
   document.getElementById("menu").style.display = "none";
   Tetris.pointsDOM = document.getElementById("points");
   Tetris.pointsDOM.style.display = "block";
   Tetris.Block.generate();
   Tetris.animate();
};

Tetris.gameStepTime = 1000;

Tetris.frameTime = 0; // ms
Tetris.cumulatedFrameTime = 0; // ms
Tetris._lastFrameTime = Date.now();

Tetris.gameOver = false;

Tetris.animate = function() {
  var time = Date.now();
  Tetris.frameTime = time - Tetris._lastFrameTime;
  Tetris._lastFrameTime = time;
  Tetris.cumulatedFrameTime += Tetris.frameTime;

  while(Tetris.cumulatedFrameTime > Tetris.gameStepTime) {
    Tetris.cumulatedFrameTime -= Tetris.gameStepTime;
    Tetris.Block.move(0,0,-1);
  }

  Tetris.renderer.render(Tetris.scene, Tetris.camera);

  // Tetris.stats.update();

  if(!Tetris.gameOver) window.requestAnimationFrame(Tetris.animate);
}



window.addEventListener("load", Tetris.init);
