export const WEAPONS = Object.freeze({
    pistol: { tipo: "balistica", rar: 1, name: "PISTOLA", icon: "🔫", interval: 320, mag: 12, res: 96, reload: 900, ac: 0xd4d4d8, dmg: 1.15, bul: "pistol", c: 0x3f3f46, b: [0.9, 0.55, 0.9] },
    mg: { tipo: "balistica", rar: 2, name: "METRALHADORA", icon: "🪖", interval: 170, mag: 30, res: 240, reload: 1300, ac: 0xfacc15, dmg: 1, bul: "mg", c: 0x1a1a1a, b: [1, 1, 1] },
    shotgun: { tipo: "balistica", rar: 2, name: "ESCOPETA", icon: "💥", interval: 650, mag: 6, res: 48, reload: 1900, ac: 0xfb923c, dmg: 0.7, n: 7, spread: 0.22, bul: "shell", c: 0x7c4a1e, b: [2.2, 0.7, 2.2] },
    lance: { tipo: "antiga", rar: 2, name: "LANÇA DO GUERREIRO", icon: "🔱", interval: 700, mag: 6, res: 36, reload: 1400, ac: 0xd97706, dmg: 3.2, bul: "spear", c: 0x92400e, b: [0.6, 2.6, 0.6], ammoName: "LANÇAS" },
    alien: { tipo: "alienigena", rar: 3, name: "RIFLE ALIENÍGENA", icon: "🛸", interval: 300, mag: 14, res: 84, reload: 1500, ac: 0x4ade80, dmg: 1.9, bul: "alien", c: 0x166534, b: [1.3, 1.3, 1.3], ammoName: "CÉLULAS", secret: true },
    rocket: { tipo: "balistica", rar: 3, name: "LANÇA-FOGUETES", icon: "🚀", interval: 800, mag: 4, res: 32, reload: 1800, ac: 0xef4444, dmg: 2.2, bul: "rocket", c: 0x7f1d1d, b: [1.6, 1.6, 1.6], ammoName: "FOGUETES" },
    gren: { tipo: "balistica", rar: 2, name: "LANÇA-GRANADAS", icon: "💣", interval: 600, mag: 6, res: 36, reload: 1700, ac: 0x84cc16, dmg: 1.6, bul: "grenade", c: 0x3f6212, b: [1.4, 1.1, 1.4], ammoName: "GRANADAS" },
    cannon: { tipo: "experimental", rar: 3, name: "CANHÃO DE FRANGO", icon: "🐔", interval: 1100, mag: 3, res: 18, reload: 2200, ac: 0xfde047, dmg: 4, bul: "chicken", c: 0xca8a04, b: [3, 1, 3], ammoName: "FRANGOS" },
    sword: { tipo: "temporal", rar: 4, name: "ESPADA TEMPORAL", icon: "🗡️", interval: 260, mag: 40, res: 240, reload: 1200, ac: 0x818cf8, dmg: 1.1, n: 2, spread: 0.3, bul: "slash", c: 0x4338ca, b: [0.5, 2.4, 0.5], ammoName: "ENERGIA", secret: true },
    eye: { tipo: "cosmica", rar: 5, name: "OLHO CÓSMICO", icon: "👁️", interval: 900, mag: 4, res: 28, reload: 2000, ac: 0xe879f9, dmg: 6.5, bul: "eye", c: 0x701a75, b: [3.2, 0.8, 3.2], ammoName: "ENERGIA" }
});

export const WEAPON_TYPES = Object.freeze({
    balistica: { icon: "🔫", n: "Balística", d: "Armas de fogo convencionais" },
    antiga: { icon: "⚔️", n: "Antiga", d: "Armas de outras eras" },
    alienigena: { icon: "👽", n: "Alienígena", d: "Tecnologia extraterrestre" },
    experimental: { icon: "☢️", n: "Experimental", d: "Criadas por experimentos científicos" },
    temporal: { icon: "🌀", n: "Temporal", d: "Ligadas à viagem no tempo" },
    cosmica: { icon: "👁️", n: "Cósmica", d: "Poder de criaturas/dimensões cósmicas" }
});

export const WEAPON_RARITIES = Object.freeze([
    null,
    { r: "I", n: "Sucata", d: "Improvisada e fraca", c: "#9ca3af" },
    { r: "II", n: "Militar", d: "Convencional e confiável", c: "#4ade80" },
    { r: "III", n: "Avançada", d: "Tecnologia experimental ou muito poderosa", c: "#38bdf8" },
    { r: "IV", n: "Anômala", d: "Quebra as regras normais do mundo", c: "#c084fc" },
    { r: "V", n: "Apocalíptica", d: "Feita para destruir o universo", c: "#f87171" }
]);

export const WEAPON_SHOP = Object.freeze([
    { id: "mg", type: "weapon", icon: "🪖", name: "Metralhadora", desc: "Rajadas rápidas e confiáveis de projéteis convencionais.", cost: 50 },
    { id: "shotgun", type: "weapon", icon: "💥", name: "Escopeta", desc: "7 projéteis em leque. Devastadora de perto.", cost: 80 },
    { id: "lance", type: "weapon", icon: "🔱", name: "Lança do Guerreiro", desc: "Lança de outra era, arremessada com força: atravessa vários inimigos.", cost: 120 },
    { id: "cannon", type: "weapon", icon: "🐔", name: "Canhão de Frango", desc: "Experimento científico que dispara frangos explosivos em área.", cost: 200 },
    { id: "gren", type: "weapon", icon: "💣", name: "Lança-Granadas", desc: "Granadas que quicam e explodem rápido. A explosão também te lança (Recoil Jump).", cost: 150 },
    { id: "rocket", type: "weapon", icon: "🚀", name: "Lança-Foguetes", desc: "Foguete explosivo em área. Atire no chão aos seus pés para dar um rocket jump (Recoil Jump).", cost: 220 },
    { id: "eye", type: "weapon", icon: "👁️", name: "Olho Cósmico", desc: "Olhar de uma criatura cósmica: raio perfurante de altíssimo dano.", cost: 300 }
]);

export const PROJECTILES = Object.freeze({
    mg: { geometry: "cylinder", geometryRadius: 0.04, height: 0.6, segments: 4, color: 0xfacc15, speed: 2, life: 70, orient: true },
    plasma: { geometry: "sphere", geometryRadius: 0.22, segments: 8, color: 0xc084fc, speed: 1.4, life: 70 },
    shell: { geometry: "sphere", geometryRadius: 0.1, segments: 6, color: 0xfb923c, speed: 1.6, life: 30 },
    pistol: { geometry: "cylinder", geometryRadius: 0.035, height: 0.45, segments: 4, color: 0xe5e7eb, speed: 2.2, life: 70, orient: true },
    spear: { geometry: "cylinder", geometryRadius: 0.06, height: 3.2, segments: 6, color: 0xd97706, speed: 2.4, life: 55, orient: true, pierce: true },
    alien: { geometry: "octahedron", geometryRadius: 0.28, color: 0x4ade80, speed: 2.3, life: 60, pierce: true },
    chicken: { geometry: "sphere", geometryRadius: 0.5, segments: 10, color: 0xfde047, speed: 1, life: 60, splash: true, splashRadius: 7, blastRadius: 6.5, blastForce: 27, selfDamage: 8 },
    rocket: { geometry: "cylinder", geometryRadius: 0.12, height: 0.9, segments: 6, color: 0xef4444, speed: 1.3, life: 80, orient: true, splash: true, splashRadius: 5.5, blastRadius: 5.5, blastForce: 30, selfDamage: 10 },
    grenade: { geometry: "sphere", geometryRadius: 0.22, segments: 8, color: 0x84cc16, speed: 0.8, life: 34, splash: true, gravity: 0.012, bounce: true, splashRadius: 5, blastRadius: 5, blastForce: 25, selfDamage: 8 },
    slash: { geometry: "box", width: 2.4, height: 0.12, depth: 0.35, color: 0x818cf8, speed: 1.5, life: 13, pierce: true, face: true },
    eye: { geometry: "sphere", geometryRadius: 0.45, segments: 10, color: 0xe879f9, speed: 2.6, life: 65, pierce: true }
});

export function createProjectileGeometry(definition) {
    switch (definition.geometry) {
        case "box":
            return new THREE.BoxGeometry(definition.width, definition.height, definition.depth);
        case "cylinder":
            return new THREE.CylinderGeometry(
                definition.geometryRadius,
                definition.geometryRadius,
                definition.height,
                definition.segments
            );
        case "octahedron":
            return new THREE.OctahedronGeometry(definition.geometryRadius);
        case "sphere":
            return new THREE.SphereGeometry(definition.geometryRadius, definition.segments || 8, definition.segments || 8);
        default:
            throw new TypeError(`Geometria de projétil desconhecida: ${definition.geometry}`);
    }
}
