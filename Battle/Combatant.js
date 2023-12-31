class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return Math.max(percent, 0);
  }

  get xpPercent() {
    if (this.xp && this.maxXp) {
      return (this.xp / this.maxXp) * 100;
    }
  }

  get isActive() {
    return this.battle.activeCombatants[this.team] === this.id;
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("Combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = `
        <p class="Combatant_name">${this.name}</p>
        <p class="Combatant_level">${this.level}</p>
        <div class="Combatant_character_crop">
            <img class="Combatant_character" alt="${this.name}" src="${this.src}"/>
        </div>
        <img class="Combatant_type" src="${this.icon}" alt="${this.name}" />
        <svg class="Combatant_life-container">
            <rect x=0 y=0 width: "0%" height=3 fill="#82ff71" />
            <rect x=0 y=2 width: "0%" height=5 fill="#3ef126" />
        </svg>
        <svg class="Combatant_xp-container">
        <rect x="0" y="0" width: "0%" height="5" fill="#ffd76a"  />
        </svg>
        <p class="Combatant_status"></p>
    `;

    this.pokemonElement = document.createElement("div");
    this.pokemonElement.classList.add("Pokemon");
    this.pokemonElement.setAttribute("data-team", this.team);
    this.pokemonElementImg = document.createElement("img");
    this.pokemonElementImg.setAttribute("src", this.src);
    this.pokemonElementImg.setAttribute("alt", this.name);
    this.animationElement = document.createElement("img");
    this.animationElement.classList.add(`Animation_${this.team}`);
    this.animationElement.classList.add(`Animation_hidden`);
    this.animationElement.setAttribute("src", "");
    this.animationElement.setAttribute("alt", "");

    this.pokemonElement.appendChild(this.pokemonElementImg);
    this.pokemonElement.appendChild(this.animationElement);

    this.hpFills = this.hudElement.querySelectorAll(
      ".Combatant_life-container > rect"
    );

    this.xpFills = this.hudElement.querySelectorAll(
      ".Combatant_xp-container > rect"
    );
  }

  update(changes = {}) {
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    this.hudElement.setAttribute("data-active", this.isActive);
    this.pokemonElement.setAttribute("data-active", this.isActive);

    this.hpFills.forEach((rect) => {
      rect.style.width = `${this.hpPercent}%`;
    });
    if (this.xp && this.maxXp) {
      this.xpFills.forEach((rect) => {
        rect.style.width = `${this.xpPercent}%`;
      });
    }

    this.hudElement.querySelector(".Combatant_level").innerText = this.level;

    const statusElement = this.hudElement.querySelector(".Combatant_status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.setAttribute("data-status", this.status.type);
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.setAttribute("data-status", "");
      statusElement.style.display = "none";
    }
  }

  getPostEvents() {
    if (this.status?.type === "burnt") {
      return [
        { type: "textMessage", text: "... got burnt" },
        { type: "stateChange", damage: 5, onCaster: true },
      ];
    }
    return [];
  }

  getReplacedEvents(originalEvents) {
    if (
      this.status?.type === "paralysed" &&
      utils.randomForArray([false, false, false, true])
    ) {
      return [{ type: "textMessage", text: `${this.name} is paralysed` }];
    }

    return originalEvents;
  }

  decrementStatus() {
    if (this.status?.expiresIn > 0) {
      this.status.expiresIn -= 1;
      if (this.status.expiresIn === 0) {
        this.update({ status: null });
        return {
          type: "textMessage",
          text: "Status went out",
        };
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.pokemonElement);
    this.update();
  }
}
