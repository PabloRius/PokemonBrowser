class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach((key) => {
      console.log(config[key]);
      this[key] = config[key];
    });

    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return Math.max(percent, 0);
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
        <rect x="0" y="0" width: "0%" height="1" fill="#ffd76a"  />
            <rect x=0 y=1 width: "0%" height=1 fill="#ffc934" />
        </svg>
        <p class="Combatant_status"></p>
    `;

    this.hpFills = this.hudElement.querySelectorAll(
      ".Combatant_life-container > rect"
    );
  }

  update(changes = {}) {
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    this.hpFills.forEach((rect) => {
      rect.style.width = `${this.hpPercent}%`;
    });

    this.hudElement.querySelector(".Combatant_level").innerText = this.level;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    this.update();
  }
}
