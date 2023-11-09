class Map {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};
    this.width = config.limitx;
    this.height = config.limity;

    this.lower_layers = [];
    config.lower_layers.forEach((element) => {
      let lower_image = new Image();
      lower_image.src = element;
      this.lower_layers.push(lower_image);
    });

    this.upper_layers = [];
    config.upper_layers.forEach((element) => {
      let lower_image = new Image();
      lower_image.src = element;
      this.upper_layers.push(lower_image);
    });

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraMan) {
    let imageX = utils.withGrid(9) - cameraMan.x;
    if (imageX > 0) {
      imageX = 0;
    } else if (imageX < ctx.canvas.width - this.width) {
      imageX = ctx.canvas.width - this.width;
    }
    let imageY = utils.withGrid(6) - cameraMan.y;
    if (imageY > 0) {
      imageY = 0;
    } else if (imageY < ctx.canvas.height - this.height) {
      imageY = ctx.canvas.height - this.height;
    }
    this.lower_layers.forEach((image) => {
      ctx.drawImage(image, imageX, imageY);
    });
  }

  drawUpperImage(ctx, cameraMan) {
    let imageX = utils.withGrid(9) - cameraMan.x;
    if (imageX > 0) {
      imageX = 0;
    } else if (imageX < ctx.canvas.width - this.width) {
      imageX = ctx.canvas.width - this.width;
    }
    let imageY = utils.withGrid(6) - cameraMan.y;
    if (imageY > 0) {
      imageY = 0;
    } else if (imageY < ctx.canvas.height - this.height) {
      imageY = ctx.canvas.height - this.height;
    }
    this.upper_layers.forEach((image) => {
      ctx.drawImage(image, imageX, imageY);
    });
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverWorldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverWorldMaps = {
  pallet_town: {
    limitx: 768,
    limity: 640,
    lower_layers: [
      "assets/maps/pallet_town/exterior/pallet_town_bg.png",
      "assets/maps/pallet_town/exterior/pallet_town_floor.png",
      "assets/maps/pallet_town/exterior/pallet_town_houses.png",
      "assets/maps/pallet_town/exterior/pallet_town_trees.png",
    ],
    upper_layers: ["assets/maps/pallet_town/exterior/pallet_town_heaven.png"],
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(11),
        y: utils.withGrid(5),
        src: "assets/players/TrainerM.png",
        speed: 2,
      }),
      rival: new Person({
        x: utils.withGrid(11),
        y: utils.withGrid(12),
        src: "assets/players/Blue.png",
        animations: {
          "idle-up": [[0, 1]],
          "idle-down": [[0, 0]],
          "idle-left": [[0, 3]],
          "idle-right": [[0, 2]],
          "walk-up": [
            [0, 1],
            [1, 1],
            [0, 1],
            [2, 1],
          ],
          "walk-down": [
            [0, 0],
            [1, 0],
            [0, 0],
            [2, 0],
          ],
          "walk-left": [
            [0, 3],
            [1, 3],
            [0, 3],
            [2, 3],
          ],
          "walk-right": [
            [0, 2],
            [1, 2],
            [0, 2],
            [2, 2],
          ],
        },
        behaviorLoop: [
          { type: "stand", direction: "left", time: 800 },
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "up", time: 300 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "rival" },
              { type: "textMessage", text: "Go away!" },
              { who: "hero", type: "walk", direction: "up" },
            ],
          },
        ],
      }),
    },
    walls: {
      [utils.asGridCoord(4, 7)]: true,
    },
    cutsceneSpaces: {
      // [utils.asGridCoord(7, 4)]: [
      //   {
      //     events: [
      //       { who: "rival", type: "walk", direction: "left" },
      //       { who: "rival", type: "stand", direction: "up", time: 500 },
      //       { type: "textMessage", text: "You can't be in there!" },
      //       { who: "rival", type: "walk", direction: "right" },
      //       { who: "hero", type: "walk", direction: "down" },
      //       { who: "hero", type: "walk", direction: "left" },
      //     ],
      //   },
      // ],
      [utils.asGridCoord(17, 13)]: [
        {
          events: [{ type: "changeMap", map: "oak_lab" }],
        },
      ],
    },
  },
  oak_lab: {
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(12),
        y: utils.withGrid(16),
        src: "assets/players/TrainerM.png",
        isPlayerControlled: true,
        speed: 2,
      }),
    },
    lower_layers: ["assets/maps/pallet_town/interior/oak_lab_floor.png"],
    upper_layers: ["assets/maps/pallet_town/interior/oak_lab_heaven.png"],
    walls: {
      [utils.asGridCoord(19, 13)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(14, 18)]: [
        {
          events: [{ type: "changeMap", map: "pallet_town" }],
        },
      ],
    },
  },
};
