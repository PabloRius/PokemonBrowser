class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      //Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Cameraman
      const cameraMan = this.map.gameObjects.hero;

      //Update objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      //Draw layers below the player
      this.map.drawLowerImage(this.ctx, cameraMan);

      //Draw game objects, npcs, player
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(
            this.ctx,
            cameraMan,
            this.map.width,
            this.map.height
          );
        });

      //Draw layers above the player
      this.map.drawUpperImage(this.ctx, cameraMan);
      //Loop for each frame refresh
      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener(eventWalking, (e) => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new Map(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    console.log("Initializing game instance");
    this.startMap(window.OverWorldMaps.pallet_town);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
    console.log("Initialization complete");

    this.map.startCutscene([
      // {
      //   type: "textMessage",
      //   text: "Game beginning, welcome to the first and best version of Pokemon fire red playable version for browsers",
      // },
      { type: "battle" },
    ]);
  }
}
