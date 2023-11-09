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
        y: utils.withGrid(10),
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
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(7, 11)]: true,
      [utils.asGridCoord(8, 11)]: true,
      [utils.asGridCoord(9, 11)]: true,
      [utils.asGridCoord(5, 14)]: true,
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
      [utils.asGridCoord(16, 13)]: [
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
      [utils.asGridCoord(7, 17)]: true,
      [utils.asGridCoord(19, 17)]: true,
      [utils.asGridCoord(7, 13)]: true,
      [utils.asGridCoord(8, 13)]: true,
      [utils.asGridCoord(9, 13)]: true,
      [utils.asGridCoord(10, 13)]: true,
      [utils.asGridCoord(11, 13)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(6, 8)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(6, 10)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(6, 12)]: true,
      [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(6, 14)]: true,
      [utils.asGridCoord(6, 15)]: true,
      [utils.asGridCoord(6, 16)]: true,
      [utils.asGridCoord(6, 17)]: true,
      [utils.asGridCoord(6, 18)]: true,
      [utils.asGridCoord(20, 4)]: true,
      [utils.asGridCoord(20, 5)]: true,
      [utils.asGridCoord(20, 6)]: true,
      [utils.asGridCoord(20, 7)]: true,
      [utils.asGridCoord(20, 8)]: true,
      [utils.asGridCoord(20, 9)]: true,
      [utils.asGridCoord(20, 10)]: true,
      [utils.asGridCoord(20, 11)]: true,
      [utils.asGridCoord(20, 12)]: true,
      [utils.asGridCoord(20, 13)]: true,
      [utils.asGridCoord(20, 14)]: true,
      [utils.asGridCoord(20, 15)]: true,
      [utils.asGridCoord(20, 16)]: true,
      [utils.asGridCoord(20, 17)]: true,
      [utils.asGridCoord(20, 18)]: true,
      [utils.asGridCoord(7, 18)]: true,
      [utils.asGridCoord(8, 18)]: true,
      [utils.asGridCoord(9, 18)]: true,
      [utils.asGridCoord(10, 18)]: true,
      [utils.asGridCoord(11, 18)]: true,
      [utils.asGridCoord(12, 18)]: true,
      [utils.asGridCoord(13, 19)]: true,
      [utils.asGridCoord(14, 18)]: true,
      [utils.asGridCoord(15, 18)]: true,
      [utils.asGridCoord(16, 18)]: true,
      [utils.asGridCoord(17, 18)]: true,
      [utils.asGridCoord(18, 18)]: true,
      [utils.asGridCoord(19, 18)]: true,
      [utils.asGridCoord(15, 9)]: true,
      [utils.asGridCoord(15, 10)]: true,
      [utils.asGridCoord(16, 9)]: true,
      [utils.asGridCoord(16, 10)]: true,
      [utils.asGridCoord(17, 9)]: true,
      [utils.asGridCoord(17, 10)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(7, 8)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(8, 10)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(9, 10)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(10, 6)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(14, 6)]: true,
      [utils.asGridCoord(15, 6)]: true,
      [utils.asGridCoord(16, 6)]: true,
      [utils.asGridCoord(17, 6)]: true,
      [utils.asGridCoord(18, 6)]: true,
      [utils.asGridCoord(19, 6)]: true,
      [utils.asGridCoord(15, 13)]: true,
      [utils.asGridCoord(16, 13)]: true,
      [utils.asGridCoord(17, 13)]: true,
      [utils.asGridCoord(18, 13)]: true,
      [utils.asGridCoord(19, 13)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(13, 18)]: [
        {
          events: [{ type: "changeMap", map: "pallet_town" }],
        },
      ],
    },
  },
};
