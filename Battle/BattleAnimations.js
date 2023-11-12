window.BattleAnimations = {
  async tackle(event, onComplete) {
    const element = event.caster.pokemonElement;
    const animationClassName =
      event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
    element.classList.add(animationClassName);

    const animationElement = event.target.animationElement;
    animationElement.src = "assets/battle/animations/hit.png";
    animationElement.alt = "Tackle Effect";
    animationElement.classList.add("tackle-effect");
    animationElement.classList.remove("Animation_hidden");

    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClassName);
      },
      { once: true }
    );

    await utils.wait(100);
    animationElement.classList.add("Animation_hidden");
    animationElement.src = "";
    animationElement.alt = "";
    animationElement.classList.remove("tackle-effect");
    onComplete();
  },
};
