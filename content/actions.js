window.Actions = {
  tackle: {
    name: "Tackle",
    type: PokemonTypes.normal,
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "tackle" },
      { type: "stateChange", damage: 10 },
    ],
  },
};
