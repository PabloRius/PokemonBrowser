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
  fatuous_fire: {
    name: "Fatuous Fire",
    type: PokemonTypes.fire,
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      {
        type: "stateChange",
        status: {
          type: "burnt",
        },
      },
    ],
  },
  recover: {
    name: "Recover",
    type: PokemonTypes.fire,
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      {
        type: "stateChange",
        onCaster: true,
        heal: 10,
      },
    ],
  },
  electric_wave: {
    name: "Electric Wave",
    type: PokemonTypes.electric,
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      {
        type: "stateChange",
        status: {
          type: "paralysed",
        },
      },
      {
        type: "textMessage",
        text: "{TARGET} is now paralysed, it may not move!}",
      },
    ],
  },
};
