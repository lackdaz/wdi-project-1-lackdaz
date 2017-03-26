(function() {
  // define variables
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var player = {};
  var ground = [];
  var platformWidth = 32;
  var platformHeight = canvas.height - platformWidth * 4;
  /**
   * Request Animation Polyfill
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  /*
    Asset pre-loader object. Loads all images
    */
  var assetLoader = (function() {
    // images dictionary
    this.imgs = {
      "bg": "imgs/bg.png",
      "sky": "imgs/sky.png"
    };
    var assetsLoaded = 0; // how many assets have been loaded
    var numImgs = Object.keys(this.imgs).length; // total number of image assets
    this.totalAssets = numImgs; // total number of assets
    /**
     * Ensure all assets are loaded before using them
     * @param {number} dic  - Dictionary name ('imgs')
     * @param {number} name - Asset name in the dictionary
     */
    function assetLoaded(dic, name) {
      // don't count assets that have already loaded
      if (this[dic][name].status !== "loading") {
        return;
      }
      this[dic][name].status = "loaded";
      assetsLoaded++;

      // finished callback
      if (assetsLoaded === this.totalAssets && typeof this.finished === "function") {
        this.finished();
      }
    }
    /**
     * Create assets, set callback for asset loading, set asset source
     */
    this.downloadAll = function() {
      var _this = this;
      var src;
      // load images
      for (var img in this.imgs) {
        if (this.imgs.hasOwnProperty(img)) {
          src = this.imgs[img];
          // create a closure for event binding
          (function(_this, img) {
            _this.imgs[img] = new Image();
            _this.imgs[img].status = "loading";
            _this.imgs[img].name = img;
            _this.imgs[img].onload = function() {
              assetLoaded.call(_this, "imgs", img)
            };
            _this.imgs[img].src = src;
          })(_this, img);
        }
      }
    }
    return {
      imgs: this.imgs,
      totalAssets: this.totalAssets,
      downloadAll: this.downloadAll
    };
  });
  assetLoader.finished = function() {
    startGame();
  }
})
// Runner.spriteDefinition = {
//   LDPI: {
//     CACTUS_LARGE: {x: 332, y: 2},
//     CACTUS_SMALL: {x: 228, y: 2},
//     CLOUD: {x: 86, y: 2},
//     HORIZON: {x: 2, y: 54},
//     MOON: {x: 484, y: 2},
//     PTERODACTYL: {x: 134, y: 2},
//     RESTART: {x: 2, y: 2},
//     TEXT_SPRITE: {x: 655, y: 2},
//     TREX: {x: 848, y: 2},
//     STAR: {x: 645, y: 2}
//   },
//   HDPI: {
//     CACTUS_LARGE: {x: 652, y: 2},
//     CACTUS_SMALL: {x: 446, y: 2},
//     CLOUD: {x: 166, y: 2},
//     HORIZON: {x: 2, y: 104},
//     MOON: {x: 954, y: 2},
//     PTERODACTYL: {x: 260, y: 2},
//     RESTART: {x: 2, y: 2},
//     TEXT_SPRITE: {x: 1294, y: 2},
//     TREX: {x: 1678, y: 2},
//     STAR: {x: 1276, y: 2}
//   }
// };

/**
 * Create a parallax background
 */

var background = (function() {
  var sky   = {};
  var backdrop = {};
  var backdrop2 = {};
  /**
   * Draw the backgrounds to the screen at different speeds
   */
  this.draw = function() {
    ctx.drawImage(assetLoader.imgs.bg, 0, 0);
    // Pan background
    sky.x -= sky.speed;
    backdrop.x -= backdrop.speed;
    backdrop2.x -= backdrop2.speed;
    // draw images side by side to loop
    ctx.drawImage(assetLoader.imgs.sky, sky.x, sky.y);
    ctx.drawImage(assetLoader.imgs.sky, sky.x + canvas.width, sky.y);
    ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x, backdrop.y);
    ctx.drawImage(assetLoader.imgs.backdrop, backdrop.x + canvas.width, backdrop.y);
    ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x, backdrop2.y);
    ctx.drawImage(assetLoader.imgs.backdrop2, backdrop2.x + canvas.width, backdrop2.y);
    // If the image scrolled off the screen, reset
    if (sky.x + assetLoader.imgs.sky.width <= 0)
      sky.x = 0;
    if (backdrop.x + assetLoader.imgs.backdrop.width <= 0)
      backdrop.x = 0;
    if (backdrop2.x + assetLoader.imgs.backdrop2.width <= 0)
      backdrop2.x = 0;
  };
  /**
   * Reset background to zero
   */
  this.reset = function()  {
    sky.x = 0;
    sky.y = 0;
    sky.speed = 0.2;
    backdrop.x = 0;
    backdrop.y = 0;
    backdrop.speed = 0.4;
    backdrop2.x = 0;
    backdrop2.y = 0;
    backdrop2.speed = 0.6;
  }
  return {
    draw: this.draw,
    reset: this.reset
  };
});
