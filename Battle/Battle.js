class Battle {
  constructor() {
    this.combatants = {
      player1: new Combatant(
        {
          ...window.Pokemons.dragonite,
          team: "player",
          hp: 50,
          maxHp: 50,
          xp: 0,
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
          xp: 0,
          level: 1,
          status: null,
        },
        this
      ),
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
  }
}
