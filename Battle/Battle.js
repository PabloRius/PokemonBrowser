class Battle {
  constructor() {}

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML(`
        <div class="Battle_hero">
            <img src="${"assets/hero.png"}" alt="Hero"/>
        </div>
        
        <div class="Battle_enemy">
            <img src="${"assets/enemy.png"}" alt="Enemy"/>
        </div>
        `);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
