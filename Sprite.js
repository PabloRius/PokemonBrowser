class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Configre animation & initial state

    this.animations = config.animations || {
      "idle-up": [[1, 1]],
      "idle-down": [[1, 0]],
      "idle-left": [[1, 2]],
      "idle-right": [[1, 3]],
      "walk-up": [
        [1, 1],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      "walk-down": [
        [1, 0],
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      "walk-left": [
        [1, 2],
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      "walk-right": [
        [1, 3],
        [0, 3],
        [1, 3],
        [2, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;

    //Sprite properties if defined
    this.width = config.width || 32;
    this.height = config.height || 64;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraman, limitx, limity) {
    let xpad = utils.withGrid(9) - cameraman.x;
    if (xpad > 0) {
      xpad = 0;
    } else if (xpad < ctx.canvas.width - limitx) {
      xpad = ctx.canvas.width - limitx;
    }
    let x = this.gameObject.x + xpad;
    let ypad = utils.withGrid(6) - cameraman.y;
    if (ypad > 0) {
      ypad = 0;
    } else if (ypad < ctx.canvas.height - limity) {
      ypad = ctx.canvas.height - limity;
    }
    let y = this.gameObject.y + ypad;

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      ctx.drawImage(
        this.image,
        frameX * this.width,
        frameY * this.height,
        this.width,
        this.height,
        x,
        y,
        this.width,
        this.height
      );
    this.updateAnimationProgress();
  }
}
