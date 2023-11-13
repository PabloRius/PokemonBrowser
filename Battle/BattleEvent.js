class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    const text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);

    const message = new BattleTextMessage({
      text: text,
      onComplete: () => {
        resolve();
      },
    });
    message.init(this.battle.element);
  }

  async stateChange(resolve) {
    const { caster, target, damage, heal, status } = this.event;
    const who = this.event.onCaster ? caster : target;
    if (damage) {
      who.update({
        hp: who.hp - damage,
      });
      who.pokemonElement.classList.add("battle-damage-blink");
    }

    if (heal) {
      who.update({
        hp: who.hp + heal,
      });
    }

    if (status) {
      who.update({ status: { ...status } });
    }
    if (status === null) {
      who.update({ status: null });
    }

    await utils.wait(400);
    who.pokemonElement.classList.remove("battle-damage-blink");
    resolve();
  }

  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    fn(this.event, resolve);
  }

  submissionMenu(resolve) {
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      onComplete: (submission) => {
        resolve(submission);
      },
    });
    menu.init(this.battle.element);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}
