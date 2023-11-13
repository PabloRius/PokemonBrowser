class Battle {
  constructor() {
    this.combatants = {
      player1: new Combatant(
        {
          ...window.Pokemons.dragonite,
          team: "player",
          hp: 30,
          maxHp: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
        },
        this
      ),
      player2: new Combatant(
        {
          ...window.Pokemons.charmander,
          team: "player",
          hp: 30,
          maxHp: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
        },
        this
      ),
      player3: new Combatant(
        {
          ...window.Pokemons.bulbasaur,
          team: "player",
          hp: 30,
          maxHp: 50,
          xp: 0,
          maxXp: 100,
          level: 1,
          status: null,
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...window.Pokemons.dragonite,
          team: "enemy",
          hp: 50,
          maxHp: 50,
          level: 1,
          status: null,
        },
        this
      ),
      enemy2: new Combatant(
        {
          ...window.Pokemons.bulbasaur,
          team: "enemy",
          hp: 50,
          maxHp: 50,
          level: 1,
          status: null,
        },
        this
      ),
      enemy3: new Combatant(
        {
          ...window.Pokemons.charmander,
          team: "enemy",
          hp: 50,
          maxHp: 50,
          level: 1,
          status: null,
        },
        this
      ),
    };
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy3",
    };
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = `
        <div class="Battle_hero">
            <img src="${"assets/battle/battlers/Hero.png"}" alt="Hero"/>
        </div>
        
        <div class="Battle_enemy">
            <img src="${"assets/battle/battlers/Blue.png"}" alt="Enemy"/>
        </div>
        `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
    });
    this.turnCycle.init();
  }
}
