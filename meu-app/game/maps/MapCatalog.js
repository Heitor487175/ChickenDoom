export const EPOCHS = Object.freeze([
    {
        id: 1, name: "1. Pré-História & Templo", subtitle: "Galinhas Infectadas Primitivas",
        wallColor: 0x8b5a2b, floorColor: 0x4a2e16, skyColor: 0x3d1706, fogColor: 0x2e0e03,
        chickenType: "ancient", bossType: "warrior_chicken", enemiesToKill: 14, secretLoot: null
    },
    {
        id: 2, name: "2. Coliseu Romano", subtitle: "Gladiadoras Mortas-Vivas",
        wallColor: 0xa1887f, floorColor: 0x5d4037, skyColor: 0x2a1a14, fogColor: 0x20140f,
        chickenType: "roman", bossType: "gladiator_boss", enemiesToKill: 17, secretLoot: "sword"
    },
    {
        id: 3, name: "3. Fortaleza Medieval", subtitle: "Cavaleiras Amaldiçoadas",
        wallColor: 0x6b7280, floorColor: 0x374151, skyColor: 0x111827, fogColor: 0x0b1220,
        chickenType: "knight", bossType: "knight_boss", enemiesToKill: 21, secretLoot: null
    },
    {
        id: 4, name: "4. Cidade Cyberpunk", subtitle: "Ciber-Galinhas Hackeadas",
        wallColor: 0x1e3a8a, floorColor: 0x0f172a, skyColor: 0x020617, fogColor: 0x020617,
        chickenType: "cyber", bossType: "cyber_boss", enemiesToKill: 25, secretLoot: null
    },
    {
        id: 5, name: "5. Tumba do Faraó", subtitle: "Múmias do Deserto",
        wallColor: 0xb8860b, floorColor: 0x8a6a2a, skyColor: 0x4a3410, fogColor: 0x3a2a0c,
        chickenType: "mummy", bossType: "pharaoh_boss", enemiesToKill: 28, secretLoot: "alien"
    },
    {
        id: 6, name: "6. Pântano Sombrio", subtitle: "Galinhas do Lodo",
        wallColor: 0x2f4f2f, floorColor: 0x1a2e1a, skyColor: 0x0b1a0b, fogColor: 0x0a160a,
        chickenType: "swamp", bossType: "swamp_boss", enemiesToKill: 32, secretLoot: null
    },
    {
        id: 7, name: "7. Galinheiro Infernal", subtitle: "Demônios Emplumados",
        wallColor: 0x7f1d1d, floorColor: 0x450a0a, skyColor: 0x2b0505, fogColor: 0x2b0707,
        chickenType: "demon", bossType: "demon_boss", enemiesToKill: 36, secretLoot: null
    },
    {
        id: 8, name: "8. O Núcleo Cósmico", subtitle: "O Fim do Tempo",
        wallColor: 0x581c87, floorColor: 0x1e1b4b, skyColor: 0x0a0014, fogColor: 0x0a0014,
        chickenType: "cosmic", bossType: "supreme_chicken", enemiesToKill: 44, secretLoot: null
    },
    {
        id: 9, name: "9. Museu Vulcânico", subtitle: "Ancestrais das Cinzas", extra: true, room: "r1",
        wallColor: 0x7c2d12, floorColor: 0x292524, skyColor: 0x1c0a05, fogColor: 0x2a0f05,
        chickenType: "ancient", bossType: "warrior_chicken", enemiesToKill: 30, secretLoot: null
    },
    {
        id: 10, name: "10. Arranha-Céu Corporativo", subtitle: "Zumbis de Terno e Circuito", extra: true, room: "r2",
        wallColor: 0x475569, floorColor: 0x1e293b, skyColor: 0x0b1020, fogColor: 0x0a0f1c,
        chickenType: "cyber", bossType: "cyber_boss", enemiesToKill: 34, secretLoot: null
    },
    {
        id: 11, name: "11. Prédio em Colapso", subtitle: "Moradores Amaldiçoados", extra: true, room: "r3",
        wallColor: 0x365314, floorColor: 0x1a2e05, skyColor: 0x061208, fogColor: 0x0a1a0c,
        chickenType: "swamp", bossType: "swamp_boss", enemiesToKill: 38, secretLoot: null
    },
    {
        id: 12, name: "12. Biblioteca Atemporal", subtitle: "Guardiãs dos Livros do Tempo", extra: true, room: "r4",
        wallColor: 0x581c87, floorColor: 0x1e1b4b, skyColor: 0x0a0420, fogColor: 0x12062e,
        chickenType: "cosmic", bossType: "supreme_chicken", enemiesToKill: 46, secretLoot: null
    }
]);

export const HUB_COLORS = Object.freeze([
    0xf59e0b, 0xfacc15, 0xa78bfa, 0x22d3ee,
    0xd97706, 0x65a30d, 0xef4444, 0xd946ef
]);
