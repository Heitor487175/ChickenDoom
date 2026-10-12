/* Chicken Doom — elenco de inimigos (etapas 4–10)
   Números ajustáveis: ENEMY_BALANCE e ENEMY_DEFS.
   Para um tipo novo: copie um bloco de ENEMY_DEFS, escolha `kind`
   (ou crie EN.updSeuTipo e registre em EN.update) e defina `intro`
   com o índice da era (0 = fase 1). */
(function () {
    const B = ENEMY_BALANCE;
    Object.assign(B, {
        hpScale: 3.2,          // zumbi da era 1 ≈ 4–6 tiros de pistola (~2s de fogo)
        timeSlow: 0.62,        // nunca chega a 0 (piso em timeMin)
        timeMin: 0.55,
        acidTick: 7,
        acidTickMs: 700,
        maxAcid: 6,
        maxTime: 2,
        gravExtra: 26,
        buffMul: 1.35,
        budgets: [6, 8, 10, 12, 12, 14, 14, 16, 14, 16, 16, 18]
    });
    EN._slow = 1;
    EN.seen = {};
    EN.zones = [];
    EN.pool = [];
    EN.quiet = false;

    const TIPS = {
        zombie: 'Persegue e bica. Mantenha distância.',
        runner: 'Muito rápida e frágil. Flanqueia — não fique parado.',
        jumper: 'Agacha e salta reto. Saia da marca; ela fica vulnerável ao pousar.',
        armored: 'Escudo na frente. Atire nas costas (brilho amarelo) ou use arma pesada.',
        gunner: 'Trava a mira e dispara. Interrompa o brilho ou use cobertura.',
        explosive: 'Pisca e mostra o raio. Mate antes ou saia do círculo.',
        spitter: 'Cospe ácido no chão. Não pise na poça verde.',
        medic: 'Cura aliados (no máximo 2 vezes cada). Mate-a primeiro.',
        burrower: 'Some no chão e avisa onde vai sair. Afaste-se do círculo.',
        flyer: 'Voa e mergulha na marca amarela. É alvo fácil depois do pouso.',
        temporal: 'Cria uma zona roxa que só deixa você mais lento — dá para sair correndo.',
        alien: 'Bolas de energia em curva. Não perseguem você: ande de lado.',
        alpha: 'Elite: anuncia uma investida reta. Desvie para o lado.',
        heavy: 'Elite: rajada longa, parada. Cubra-se enquanto ela recarrega.',
        foreman: 'Elite: acelera as galinhas perto dele. O efeito não acumula.',
        anomaly: 'Elite: zona temporal e um teleporte anunciado por luta.'
    };
    Object.keys(TIPS).forEach((k) => { if (ENEMY_DEFS[k]) ENEMY_DEFS[k].tip = TIPS[k]; });

    Object.assign(ENEMY_DEFS, {
        jumper: {
            name: 'Galinha Saltadora', tip: TIPS.jumper, hp: 0.75, dmg: 0.9, spd: 1.1, perception: 52,
            attackRange: 2.2, windupMs: 480, leapMs: 520, leapH: 3.4, recoveryMs: 780, cooldownMs: 1700,
            turnRate: 10, scale: 1.05, tint: 0xfacc15, hit: 1.25, cost: 1, cap: 4, intro: 1, weight: 3.2, kind: 'jumper'
        },
        spitter: {
            name: 'Galinha Cuspidora', tip: TIPS.spitter, hp: 0.9, dmg: 0.85, spd: 0.75, perception: 48,
            attackRange: 1.7, minDist: 7, maxDist: 16, aimMs: 520, recoveryMs: 700, cooldownMs: 2400,
            poolR: 3.3, poolMs: 4500, turnRate: 8, scale: 1.05, tint: 0x65a30d, hit: 1.3, cost: 2, cap: 3,
            intro: 3, weight: 2.6, kind: 'spitter', interrupt: true
        },
        medic: {
            name: 'Galinha Médica', tip: TIPS.medic, hp: 0.7, dmg: 0.35, spd: 1.0, perception: 46,
            attackRange: 1.6, healRange: 16, castRange: 7, castMs: 700, healFrac: 0.18, recoveryMs: 400,
            cooldownMs: 3600, turnRate: 10, scale: 0.95, tint: 0xf8fafc, hit: 1.2, cost: 2, cap: 2,
            intro: 3, weight: 2.2, kind: 'medic', interrupt: true
        },
        burrower: {
            name: 'Galinha Escavadora', tip: TIPS.burrower, hp: 0.85, dmg: 0.9, spd: 1.0, perception: 40,
            attackRange: 1.7, digMs: 700, markMs: 780, recoveryMs: 820, burrowCd: 5200, cooldownMs: 800,
            turnRate: 11, scale: 1.0, tint: 0x92400e, hit: 1.25, cost: 2, cap: 3, intro: 7, weight: 2.8, kind: 'burrow'
        },
        flyer: {
            name: 'Galinha Voadora', tip: TIPS.flyer, hp: 0.65, dmg: 0.75, spd: 1.15, perception: 56,
            attackRange: 2.2, minDist: 6, maxDist: 18, hover: 3.6, windupMs: 520, diveMs: 380,
            recoveryMs: 1100, cooldownMs: 2600, turnRate: 9, scale: 0.82, tint: 0xe0f2fe, hit: 1.35,
            cost: 2, cap: 3, intro: 4, weight: 2.5, kind: 'flyer'
        },
        temporal: {
            name: 'Galinha Temporal', tip: TIPS.temporal, hp: 1.0, dmg: 0.7, spd: 0.9, perception: 48,
            attackRange: 1.7, minDist: 7, maxDist: 15, aimMs: 700, zoneR: 5.2, zoneMs: 4000,
            recoveryMs: 800, cooldownMs: 7000, turnRate: 8, scale: 1.05, tint: 0x7c3aed, hit: 1.3,
            cost: 3, cap: 2, intro: 5, weight: 2.1, kind: 'temporal', interrupt: true
        },
        alien: {
            name: 'Galinha Alienígena', tip: TIPS.alien, hp: 1.2, dmg: 1.1, spd: 0.95, perception: 52,
            attackRange: 1.8, minDist: 8, maxDist: 18, aimMs: 560, recoveryMs: 900, cooldownMs: 2200,
            turnRate: 8, scale: 1.12, tint: 0x166534, hit: 1.35, cost: 2, cap: 3, intro: 6, weight: 2.4,
            kind: 'alien', interrupt: true
        },
        alpha: {
            name: 'Zumbi Alfa', tip: TIPS.alpha, hp: 1.8, dmg: 1.2, spd: 1.15, perception: 56,
            attackRange: 1.9, windupMs: 620, chargeMs: 420, chargeMul: 2.7, recoveryMs: 640,
            chargeCd: 2800, cooldownMs: 700, turnRate: 12, scale: 1.2, tint: 0xef4444, hit: 1.45,
            cost: 3, cap: 1, intro: 2, weight: 0.85, kind: 'alpha', elite: true
        },
        heavy: {
            name: 'Artilheira Pesada', tip: TIPS.heavy, hp: 1.6, dmg: 1.35, spd: 0.6, perception: 52,
            minDist: 9, maxDist: 18, aimMs: 900, burst: 6, burstGapMs: 160, fanRad: 0.07, shotMul: 0.85,
            recoveryMs: 1600, cooldownMs: 2100, turnRate: 6, scale: 1.25, tint: 0x9a3412, hit: 1.5,
            cost: 4, cap: 1, intro: 4, weight: 0.7, kind: 'gunner', elite: true
        },
        foreman: {
            name: 'Capataz do Galinheiro', tip: TIPS.foreman, hp: 1.5, dmg: 0.65, spd: 1.0, perception: 50,
            attackRange: 1.7, aura: 12, buffMs: 3000, cooldownMs: 6000, turnRate: 9, scale: 1.15,
            tint: 0xfbbf24, hit: 1.4, cost: 4, cap: 1, intro: 5, weight: 0.7, kind: 'buff', elite: true
        },
        anomaly: {
            name: 'Anomalia Viva', tip: TIPS.anomaly, hp: 1.6, dmg: 1.0, spd: 0.95, perception: 50,
            attackRange: 1.8, minDist: 7, maxDist: 16, aimMs: 650, zoneR: 5.4, zoneMs: 4200,
            recoveryMs: 800, cooldownMs: 6400, turnRate: 8, scale: 1.2, tint: 0xc026d3, hit: 1.4,
            cost: 5, cap: 1, intro: 6, weight: 0.65, kind: 'temporal', elite: true, tp: true, interrupt: true
        },
        totem: {
            name: 'Dispositivo', tip: 'Destrua para interromper a cura ou os reforços.', hp: 0.4, dmg: 0, spd: 0,
            perception: 1, attackRange: 0, turnRate: 20, scale: 0.7, tint: 0x38bdf8, hit: 1.4,
            cost: 0, cap: 4, intro: 99, weight: 0, kind: 'totem'
        }
    });

    const BIAS = {
        zombie: { runner: 1.35 },
        runner: { zombie: 1.2 },
        armored: { gunner: 1.9, explosive: 1.45, alien: 1.4 },
        gunner: { armored: 1.5, flyer: 1.4 },
        explosive: { armored: 1.4, burrower: 1.5 },
        spitter: { jumper: 1.7 },
        jumper: { spitter: 1.4 },
        medic: { zombie: 1.6, runner: 1.35 },
        flyer: { gunner: 1.6 },
        temporal: { runner: 1.7 },
        alien: { armored: 1.5 },
        burrower: { explosive: 1.4 }
    };

    function zoneOf(zone) {
        if (zone >= 0) return zone;
        if (typeof playerObj === 'undefined' || !playerObj) return 1;
        const z = playerObj.position.z;
        if (z > 40) return 0;
        if (z > -10) return 1;
        if (z > -46) return 2;
        return 3;
    }

    EN.weights = function (ei, zone) {
        zone = zoneOf(zone);
        const cnt = {}, present = {};
        for (let i = 0; i < enemies.length; i++) {
            const bt = enemies[i].bt;
            if (!bt) continue;
            cnt[bt] = (cnt[bt] || 0) + 1;
            present[bt] = 1;
        }
        let spent = 0;
        for (let i = 0; i < enemies.length; i++) {
            const d = enemies[i].def;
            if (d) spent += d.cost || 0;
        }
        const budget = (B.budgets && B.budgets[ei]) || 12;
        const w = {};
        Object.keys(ENEMY_DEFS).forEach((k) => {
            const d = ENEMY_DEFS[k];
            let wt = d.weight || 0;
            if (d.intro > ei) wt = 0;
            if (d.elite) {
                if (ei < d.intro) wt = 0;
                else if (ei === d.intro && zone === 0) wt = 0;
            } else if (d.intro === ei && ei > 0) {
                if (zone === 0) wt = 0;
                else wt *= 1.4;
            }
            const cap = d.elite ? d.cap : d.cap + Math.floor(ei / 3);
            if (wt > 0 && (cnt[k] || 0) >= cap) wt = 0;
            if (wt > 0 && d.cost >= 3 && spent + d.cost > budget + 1 && spent > 0) wt = 0;
            if (wt > 0 && spent >= budget && d.cost > 1) wt = 0;
            Object.keys(present).forEach((have) => {
                const b = BIAS[have];
                if (b && b[k]) wt *= b[k];
            });
            w[k] = wt;
        });
        w._spent = spent;
        w._budget = budget;
        w._zone = zone;
        return w;
    };

    EN.pickType = function (ei, zone) {
        if (EN.forceType) return EN.forceType === 'legacy' ? null : EN.forceType;
        const w = EN.weights(ei, zone);
        const keys = Object.keys(ENEMY_DEFS);
        let total = 0;
        keys.forEach((k) => { total += w[k] || 0; });
        if (total <= 0) return 'zombie';
        let r = Math.random() * total;
        for (let i = 0; i < keys.length; i++) {
            r -= w[keys[i]] || 0;
            if (r <= 0 && w[keys[i]] > 0) return keys[i];
        }
        return 'zombie';
    };

    function XG() {
        const G = EN.geo();
        if (!G.acidMat) {
            G.acidMat = new THREE.MeshBasicMaterial({ color: 0x84cc16 });
            G.alienMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
            G.timeMat = new THREE.MeshBasicMaterial({ color: 0xc4b5fd });
            G.eliteMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
            G.crossMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc, emissive: 0xef4444 });
            G.sack = new THREE.SphereGeometry(0.28, 8, 8);
            G.spring = new THREE.CylinderGeometry(0.08, 0.08, 0.45, 6);
            G.springMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
        }
        return G;
    }

    function addMesh(parent, geo, mat, x, y, z) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        parent.add(m);
        return m;
    }

    const _setup = EN.setup;
    EN.setup = function (e, bt) {
        _setup(e, bt);
        e.baseSpeed = e.speed;
        const d = e.def, m = e.mesh, G = XG(), A = e.ai;
        A.heals = {};
        if (bt === 'jumper') {
            addMesh(m, G.spring, G.springMat, -0.22, 0.15, 0.2);
            addMesh(m, G.spring, G.springMat, 0.22, 0.15, 0.2);
        } else if (bt === 'spitter') {
            addMesh(m, G.sack, G.acidMat, 0, 0.85, -0.85);
        } else if (bt === 'medic' || bt === 'totem') {
            addMesh(m, new THREE.BoxGeometry(0.12, 0.55, 0.12), G.crossMat, 0, 1.55, -0.2);
            addMesh(m, new THREE.BoxGeometry(0.4, 0.12, 0.12), G.crossMat, 0, 1.55, -0.2);
        } else if (bt === 'burrower') {
            addMesh(m, new THREE.BoxGeometry(0.55, 0.12, 0.2), G.springMat, 0, 0.2, -0.7);
        } else if (bt === 'flyer') {
            m.children.forEach((c) => { if (c.position && Math.abs(c.position.x) > 0.4) c.scale.set(1.4, 0.7, 1.3); });
        } else if (bt === 'temporal' || bt === 'anomaly') {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 6, 18), G.timeMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 1.7;
            m.add(ring);
            A.halo = ring;
        } else if (bt === 'alien') {
            addMesh(m, new THREE.SphereGeometry(0.16, 8, 8), G.alienMat, 0, 1.85, -0.2);
        } else if (bt === 'foreman') {
            const aura = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.7, 24), G.eliteMat);
            aura.rotation.x = -Math.PI / 2;
            aura.position.y = 0.08;
            m.add(aura);
            A.aura = aura;
        }
        if (d && d.elite) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 6, 18), G.eliteMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.12;
            m.add(ring);
        }
        if (d && d.tip && !EN.seen[bt]) {
            EN.seen[bt] = 1;
            if (!EN.quiet) toast((d.elite ? '⭐ ELITE — ' : '🐔 ') + d.name + ': ' + d.tip);
        }
    };

    const _mod = EN.modifyIncoming;
    EN.modifyIncoming = function (e, dmg) {
        let out = _mod(e, dmg);
        const A = e.ai, d = e.def;
        if (!A || !d) return out;
        if (e.boss && e.boss.armored && dmg < B.armorPierceDamage) {
            const pp = playerObj.position, p = e.mesh.position;
            const vx = pp.x - p.x, vz = pp.z - p.z, l = Math.hypot(vx, vz) || 1;
            const dot = ((A.fx || 0) * vx + (A.fz || -1) * vz) / l;
            if (dot > B.armorFrontCos) out *= B.armorFrontMul;
            else if (dot < B.armorBackCos) out *= B.armorBackMul;
        }
        if (d.interrupt && A.state === 'WINDUP' && !A.cancelled) {
            A.aimDmg = (A.aimDmg || 0) + out;
            if (A.aimDmg >= e.maxHp * B.interruptFrac) {
                A.cancelled = true;
                A.vuln = true;
                EN.beepAt(e, 140, 0.06, 'square', 0.08);
            }
        }
        return out;
    };

    const _step = EN.step;
    EN.step = function (e, ux, uz, mul) {
        const buff = e._buffUntil > EN.clock ? B.buffMul : 1;
        return _step(e, ux, uz, (mul === undefined ? 1 : mul) * buff);
    };

    EN.mark = function (x, y, z, R, dur, hex, kind) {
        while (EN.zones.length >= 14) {
            const old = EN.zones.shift();
            scene.remove(old.mesh);
            old.mesh.visible = false;
            EN.pool.push(old.mesh);
        }
        let mesh = EN.pool.pop();
        if (!mesh) {
            mesh = new THREE.Mesh(EN.geo().ring, new THREE.MeshBasicMaterial({
                color: hex, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false
            }));
            mesh.rotation.x = -Math.PI / 2;
        }
        mesh.material.color.setHex(hex);
        mesh.material.opacity = kind === 'mark' ? 0.9 : 0.45;
        mesh.position.set(x, (y || 0) + 0.12, z);
        mesh.scale.setScalar(Math.max(0.2, R));
        mesh.visible = true;
        scene.add(mesh);
        const zobj = { mesh, x, z, y: y || 0, R, until: EN.clock + dur, kind, next: 0, dmg: 0 };
        EN.zones.push(zobj);
        return zobj;
    };

    EN.fireAt = function (e, tx, ty, tz, opt) {
        opt = opt || {};
        if (enemyProjectiles.length > 48) return;
        const A = e.ai, p = e.mesh.position, G = XG();
        const ox = p.x + (A.fx || 0) * 0.9;
        const oy = (e.yb || 0) + (e.flyH || 1.25);
        const oz = p.z + (A.fz || -1) * 0.9;
        let vx = tx - ox, vy = ty - oy, vz = tz - oz;
        const len = Math.hypot(vx, vy, vz) || 1;
        vx /= len; vy /= len; vz /= len;
        if (opt.yaw) {
            const c = Math.cos(opt.yaw), s = Math.sin(opt.yaw);
            const nx = vx * c - vz * s, nz = vx * s + vz * c;
            vx = nx; vz = nz;
        }
        const m = new THREE.Mesh(G.bolt, opt.mat || G.boltMat);
        m.position.set(ox, oy, oz);
        scene.add(m);
        enemyProjectiles.push({
            mesh: m, dir: new THREE.Vector3(vx, vy, vz),
            speed: opt.speed || B.projectileSpeed, life: opt.life || B.projectileLife,
            damage: opt.damage || 0, wall: opt.wall !== false, onDie: opt.onDie || null, curve: opt.curve || 0
        });
        if (opt.beep) EN.beepAt(e, opt.beep, 0.08, 'square', 0.1);
    };

    EN.pickPoint = function (cx, cz, minR, maxR, minPlayer) {
        const px = playerObj.position.x, pz = playerObj.position.z;
        for (let i = 0; i < 18; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = minR + Math.random() * (maxR - minR);
            const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r;
            if (Math.abs(x) > 74 || Math.abs(z) > 74) continue;
            if (blocked(x, z, 1.05, 0)) continue;
            if (minPlayer && Math.hypot(x - px, z - pz) < minPlayer) continue;
            return { x, z };
        }
        return null;
    };

    function feetHigh(boss) {
        return playerObj.position.y - PLAYER_HEIGHT > (boss ? DODGE_CLEAR_BOSS : DODGE_CLEAR);
    }
    function hurtPlayer(amount, boss) {
        if (feetHigh(boss)) { showDodgeText(); return false; }
        applyPlayerDamage(amount);
        return true;
    }

    EN.updJumper = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.state === 'RECOVERY') {
            p.y = e.yb || 0;
            if (now - A.t0 >= d.recoveryMs) { A.state = 'CHASE'; A.vuln = false; }
            return;
        }
        if (A.state === 'LEAP') {
            const t = Math.min(1, (now - A.t0) / d.leapMs);
            p.x = A.x0 + (A.lx - A.x0) * t;
            p.z = A.z0 + (A.lz - A.z0) * t;
            p.y = (e.yb || 0) + Math.sin(Math.PI * t) * d.leapH;
            if (t >= 1) {
                p.y = e.yb || 0;
                const dh = Math.hypot(pp.x - p.x, pp.z - p.z);
                if (dh < d.attackRange + 0.5 && clearLine(p.x, p.z, pp.x, pp.z, 0.3)) hurtPlayer(B.baseDamage * d.dmg, false);
                A.state = 'RECOVERY'; A.t0 = now; A.vuln = true; A.nextAtk = now + d.cooldownMs;
                EN.beepAt(e, 120, 0.07, 'triangle', 0.1);
            }
            return;
        }
        if (A.state === 'WINDUP') {
            EN.turn(e, pp.x, pp.z);
            const k = Math.min(1, (now - A.t0) / d.windupMs);
            e.mesh.scale.y = A.baseY * (1 - 0.35 * k);
            EN.flash(e, true, 0xfde047);
            if (k >= 1) {
                e.mesh.scale.y = A.baseY;
                EN.flash(e, false, 0);
                let lx = pp.x, lz = pp.z;
                if (blocked(lx, lz, 0.9, e.fl | 0)) {
                    const vx = lx - p.x, vz = lz - p.z, L = Math.hypot(vx, vz) || 1;
                    lx = p.x + vx / L * 3; lz = p.z + vz / L * 3;
                }
                A.x0 = p.x; A.z0 = p.z; A.lx = lx; A.lz = lz;
                A.state = 'LEAP'; A.t0 = now;
            }
            return;
        }
        if (dist > 3) EN.approach(e, pp.x, pp.z, dist, 1);
        else EN.turn(e, pp.x, pp.z);
        if (dist >= 4 && dist <= 13 && now >= A.nextAtk && now >= A.armedAt) {
            A.state = 'WINDUP'; A.t0 = now; A.baseY = e.mesh.scale.y;
            EN.beepAt(e, 460, 0.08, 'square', 0.1);
        }
    };

    EN.updSpitter = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.state === 'RECOVERY') {
            EN.turn(e, pp.x, pp.z);
            if (now - A.t0 >= A.recDur) { A.state = 'CHASE'; A.vuln = false; A.cancelled = false; }
            return;
        }
        if (A.state === 'WINDUP') {
            EN.turn(e, pp.x, pp.z);
            if (A.cancelled || now - A.t0 >= d.aimMs) {
                EN.flash(e, false, 0);
                if (!A.cancelled) {
                    EN.fireAt(e, A.lx, pp.y, A.lz, {
                        mat: XG().acidMat, speed: 0.22, life: 110, beep: 210,
                        damage: B.baseDamage * d.dmg * 0.5,
                        onDie: (ep) => {
                            if (EN.zones.filter((z) => z.kind === 'acid').length >= B.maxAcid) return;
                            EN.mark(ep.mesh.position.x, e.yb || 0, ep.mesh.position.z, d.poolR, d.poolMs, 0x65a30d, 'acid');
                        }
                    });
                }
                A.state = 'RECOVERY'; A.t0 = now; A.recDur = d.recoveryMs; A.vuln = true;
                A.nextAtk = now + d.cooldownMs; A.cancelled = false;
            } else EN.flash(e, Math.floor((now - A.t0) / 70) % 2 === 0, 0x365314);
            return;
        }
        const los = EN.hasLos(e, pp.x, pp.z);
        if (dist < d.minDist) {
            EN.turn(e, pp.x, pp.z);
            EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1);
        } else if (dist > d.maxDist || !los) EN.approach(e, pp.x, pp.z, dist, 1);
        else EN.turn(e, pp.x, pp.z);
        if (los && dist >= 4 && dist <= d.maxDist && now >= A.nextAtk && now >= A.armedAt) {
            A.state = 'WINDUP'; A.t0 = now; A.lx = pp.x; A.lz = pp.z; A.aimDmg = 0; A.cancelled = false;
        }
    };

    function woundedAlly(e) {
        const d = e.def;
        let best = null, bd = 1e9;
        for (let i = 0; i < enemies.length; i++) {
            const o = enemies[i];
            if (o === e || o.isBoss || o.hp <= 0 || !o.ai || o.burrowed) continue;
            if (o.bt === 'medic' || o.bt === 'foreman' || o.bt === 'totem' || o.bt === '_boss') continue;
            if (o.hp > o.maxHp * 0.92) continue;
            if ((e.ai.heals[o.ai.id] || 0) >= 2) continue;
            const dist = Math.hypot(o.mesh.position.x - e.mesh.position.x, o.mesh.position.z - e.mesh.position.z);
            if (dist < d.healRange && dist < bd) { bd = dist; best = o; }
        }
        return best;
    }

    EN.updMedic = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        A.heals = A.heals || {};
        if (A.state === 'RECOVERY') {
            if (now - A.t0 >= (A.recDur || 400)) { A.state = 'CHASE'; A.vuln = false; A.cancelled = false; }
            return;
        }
        if (A.state === 'WINDUP') {
            const o = A.patient;
            if (A.cancelled || !o || o.hp <= 0 || enemies.indexOf(o) < 0) {
                EN.flash(e, false, 0); A.state = 'CHASE'; A.patient = null; A.cancelled = false; return;
            }
            EN.turn(e, o.mesh.position.x, o.mesh.position.z);
            EN.flash(e, true, 0x166534);
            if (now - A.t0 >= d.castMs) {
                const amt = Math.min(o.maxHp - o.hp, o.maxHp * d.healFrac);
                if (amt > 0.5) {
                    o.hp = Math.min(o.maxHp, o.hp + amt);
                    A.heals[o.ai.id] = (A.heals[o.ai.id] || 0) + 1;
                    o._greenUntil = now + 280;
                    EN.flash(o, true, 0x22c55e);
                }
                EN.flash(e, false, 0);
                EN.beepAt(e, 740, 0.1, 'sine', 0.1);
                A.state = 'RECOVERY'; A.t0 = now; A.recDur = 320; A.vuln = true;
                A.nextAtk = now + d.cooldownMs; A.patient = null;
            }
            return;
        }
        const ally = woundedAlly(e);
        if (ally && now >= A.nextAtk && now >= A.armedAt) {
            const ad = Math.hypot(ally.mesh.position.x - p.x, ally.mesh.position.z - p.z) || 0.001;
            if (ad > d.castRange) EN.approach(e, ally.mesh.position.x, ally.mesh.position.z, ad, 1);
            else { A.state = 'WINDUP'; A.t0 = now; A.patient = ally; A.aimDmg = 0; A.cancelled = false; }
            return;
        }
        if (dist < 8) { EN.turn(e, pp.x, pp.z); EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1); }
        else if (dist > 14) EN.approach(e, pp.x, pp.z, dist, 0.85);
        else EN.turn(e, pp.x, pp.z);
        if (dist < d.attackRange && now >= A.armedAt && now >= (A.peck || 0)) {
            A.peck = now + 900;
            if (clearLine(p.x, p.z, pp.x, pp.z, 0.25)) hurtPlayer(B.baseDamage * d.dmg, false);
        }
    };

    EN.updForeman = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.aura) A.aura.scale.setScalar(1 + 0.06 * Math.sin(now / 180));
        if (now >= A.nextAtk && now >= A.armedAt) {
            let n = 0;
            for (let i = 0; i < enemies.length; i++) {
                const o = enemies[i];
                if (o === e || o.isBoss || o.hp <= 0 || !o.ai || o.bt === 'totem') continue;
                if (Math.hypot(o.mesh.position.x - p.x, o.mesh.position.z - p.z) < d.aura) {
                    o._buffUntil = now + d.buffMs; n++;
                }
            }
            A.nextAtk = now + d.cooldownMs;
            if (n) { EN.beepAt(e, 500, 0.1, 'square', 0.1); EN.flash(e, true, 0xfbbf24); e._greenUntil = now + 220; }
        }
        if (dist < 7) { EN.turn(e, pp.x, pp.z); EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1); }
        else EN.approach(e, pp.x, pp.z, dist, 0.75);
        if (dist < d.attackRange && now >= (A.peck || 0) && now >= A.armedAt) {
            A.peck = now + 800;
            if (clearLine(p.x, p.z, pp.x, pp.z, 0.25)) hurtPlayer(B.baseDamage * d.dmg, false);
        }
    };

    EN.updBurrow = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position, gy = e.yb || 0;
        if (A.state === 'RECOVERY') {
            e.burrowed = false; e.hr = d.hit; p.y = gy;
            if (now - A.t0 >= d.recoveryMs) { A.state = 'CHASE'; A.vuln = false; A.nextBurrow = now + d.burrowCd; }
            return;
        }
        if (A.state === 'DIG') {
            e.burrowed = true; e.hr = 0; p.y = gy - 3.4;
            const vx = A.lx - p.x, vz = A.lz - p.z, l = Math.hypot(vx, vz);
            if (l > 0.35) { p.x += vx / l * e.speed * EN.dts * 1.35; p.z += vz / l * e.speed * EN.dts * 1.35; }
            if (l <= 0.35 || now - A.t0 >= d.digMs) {
                p.x = A.lx; p.z = A.lz;
                A.state = 'MARK'; A.t0 = now;
                EN.mark(A.lx, gy, A.lz, 2.2, d.markMs, 0xf59e0b, 'mark');
            }
            return;
        }
        if (A.state === 'MARK') {
            e.burrowed = true; e.hr = 0; p.x = A.lx; p.z = A.lz; p.y = gy - 3.4;
            if (now - A.t0 >= d.markMs) {
                e.burrowed = false; e.hr = d.hit; p.y = gy;
                if (typeof dirtBurst === 'function') dirtBurst(p.x, p.z, 8, 1, gy);
                if (Math.hypot(pp.x - p.x, pp.z - p.z) < 2.35) hurtPlayer(B.baseDamage * d.dmg, false);
                A.state = 'RECOVERY'; A.t0 = now; A.vuln = true;
                EN.beepAt(e, 100, 0.1, 'sawtooth', 0.1);
            }
            return;
        }
        p.y = gy;
        if (dist > 1.8) EN.approach(e, pp.x, pp.z, dist, 1);
        else EN.turn(e, pp.x, pp.z);
        if (dist < d.attackRange && now >= (A.peck || 0) && now >= A.armedAt) {
            A.peck = now + 780;
            if (clearLine(p.x, p.z, pp.x, pp.z, 0.25)) hurtPlayer(B.baseDamage * d.dmg * 0.75, false);
        }
        if (now >= (A.nextBurrow || 0) && now >= A.armedAt && dist < 24) {
            const spot = EN.pickPoint(pp.x, pp.z, 2.8, 6.2, 2.5);
            if (spot) {
                A.lx = spot.x; A.lz = spot.z; A.state = 'DIG'; A.t0 = now;
                EN.beepAt(e, 80, 0.12, 'triangle', 0.1);
            } else A.nextBurrow = now + 800;
        }
    };

    EN.updFlyer = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position, gy = e.yb || 0;
        if (A.state === 'RECOVERY') {
            p.y = gy; e.flyH = 1.1; A.vuln = true;
            EN.turn(e, pp.x, pp.z);
            if (now - A.t0 >= d.recoveryMs) { A.state = 'CHASE'; A.vuln = false; A.nextAtk = now + d.cooldownMs; }
            return;
        }
        if (A.state === 'DIVE') {
            const t = Math.min(1, (now - A.t0) / d.diveMs);
            p.x = A.x0 + (A.lx - A.x0) * t;
            p.z = A.z0 + (A.lz - A.z0) * t;
            p.y = gy + (A.y0 || d.hover) * (1 - t);
            if (t >= 1) {
                p.y = gy;
                if (Math.hypot(pp.x - p.x, pp.z - p.z) < 2.35) applyPlayerDamage(B.baseDamage * d.dmg);
                A.state = 'RECOVERY'; A.t0 = now; A.vuln = true;
                EN.beepAt(e, 150, 0.08, 'square', 0.1);
            }
            return;
        }
        if (A.state === 'WINDUP') {
            p.y = gy + d.hover;
            EN.turn(e, A.lx, A.lz);
            EN.flash(e, Math.floor((now - A.t0) / 60) % 2 === 0, 0xfef08a);
            if (now - A.t0 >= d.windupMs) {
                EN.flash(e, false, 0);
                A.x0 = p.x; A.z0 = p.z; A.y0 = d.hover;
                A.state = 'DIVE'; A.t0 = now;
            }
            return;
        }
        p.y = gy + d.hover + Math.sin(now / 260 + (A.id || 0)) * 0.22;
        e.flyH = d.hover + 0.8;
        const los = EN.hasLos(e, pp.x, pp.z);
        if (!los || dist > d.maxDist) EN.approach(e, pp.x, pp.z, dist, 1);
        else if (dist < d.minDist) EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1);
        else { EN.turn(e, pp.x, pp.z); EN.step(e, -(pp.z - p.z) / dist, (pp.x - p.x) / dist, 0.65); }
        p.x = Math.max(-74, Math.min(74, p.x));
        p.z = Math.max(-74, Math.min(74, p.z));
        p.y = gy + d.hover + Math.sin(now / 260 + (A.id || 0)) * 0.22;
        if (los && dist > 4 && dist < d.maxDist && now >= A.nextAtk && now >= A.armedAt) {
            A.state = 'WINDUP'; A.t0 = now; A.lx = pp.x; A.lz = pp.z;
            EN.mark(pp.x, gy, pp.z, 2.3, d.windupMs + d.diveMs, 0xfacc15, 'mark');
            EN.beepAt(e, 680, 0.09, 'square', 0.1);
        }
    };

    EN.updTemporal = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.halo) A.halo.rotation.z += 0.02 * EN.dts;
        if (d.tp && !A.tpUsed && e.hp < e.maxHp * 0.5 && A.state === 'CHASE' && now >= A.armedAt) {
            const spot = EN.pickPoint(p.x, p.z, 8, 16, 6);
            if (spot) {
                A.tpUsed = true; A.lx = spot.x; A.lz = spot.z; A.state = 'PORTAL'; A.t0 = now;
                EN.mark(spot.x, e.yb || 0, spot.z, 1.8, 720, 0xe9d5ff, 'mark');
                if (!EN.quiet) toast('🌀 Teleporte anunciado — olhe o círculo lilás!');
                return;
            }
        }
        if (A.state === 'PORTAL') {
            EN.flash(e, true, 0x6d28d9);
            if (now - A.t0 >= 700) {
                p.x = A.lx; p.z = A.lz;
                EN.flash(e, false, 0);
                A.state = 'RECOVERY'; A.t0 = now; A.recDur = 650; A.vuln = true;
            }
            return;
        }
        if (A.state === 'RECOVERY') {
            EN.turn(e, pp.x, pp.z);
            if (now - A.t0 >= (A.recDur || d.recoveryMs)) { A.state = 'CHASE'; A.vuln = false; A.cancelled = false; }
            return;
        }
        if (A.state === 'WINDUP') {
            EN.turn(e, pp.x, pp.z);
            EN.flash(e, Math.floor((now - A.t0) / 80) % 2 === 0, 0x7c3aed);
            if (A.cancelled || now - A.t0 >= d.aimMs) {
                EN.flash(e, false, 0);
                if (!A.cancelled && EN.zones.filter((z) => z.kind === 'time').length < B.maxTime) {
                    EN.mark(A.lx, e.yb || 0, A.lz, d.zoneR, d.zoneMs, 0x7c3aed, 'time');
                }
                A.state = 'RECOVERY'; A.t0 = now; A.recDur = d.recoveryMs; A.vuln = true;
                A.nextAtk = now + d.cooldownMs; A.cancelled = false;
                EN.beepAt(e, 170, 0.14, 'sawtooth', 0.1);
            }
            return;
        }
        const los = EN.hasLos(e, pp.x, pp.z);
        if (dist < d.minDist) { EN.turn(e, pp.x, pp.z); EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1); }
        else if (!los || dist > d.maxDist) EN.approach(e, pp.x, pp.z, dist, 1);
        else EN.turn(e, pp.x, pp.z);
        if (los && now >= A.nextAtk && now >= A.armedAt && dist < d.maxDist && dist > 3) {
            A.state = 'WINDUP'; A.t0 = now; A.lx = pp.x; A.lz = pp.z; A.aimDmg = 0; A.cancelled = false;
            EN.mark(pp.x, e.yb || 0, pp.z, d.zoneR, d.aimMs, 0xddd6fe, 'mark');
        }
    };

    EN.updAlien = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.state === 'RECOVERY') {
            EN.turn(e, pp.x, pp.z);
            if (now - A.t0 >= d.recoveryMs) { A.state = 'CHASE'; A.vuln = false; A.cancelled = false; }
            return;
        }
        if (A.state === 'WINDUP') {
            EN.turn(e, A.lx, A.lz);
            EN.flash(e, Math.floor((now - A.t0) / 70) % 2 === 0, 0x4ade80);
            if (A.cancelled || now - A.t0 >= d.aimMs) {
                EN.flash(e, false, 0);
                if (!A.cancelled) {
                    const dmg = B.baseDamage * d.dmg * 0.72;
                    EN.fireAt(e, A.lx, A.ly, A.lz, { mat: XG().alienMat, damage: dmg, curve: 2.4, speed: 0.28, life: 140, beep: 320 });
                    EN.fireAt(e, A.lx, A.ly, A.lz, { mat: XG().alienMat, damage: dmg, curve: -2.4, speed: 0.28, life: 140 });
                }
                A.state = 'RECOVERY'; A.t0 = now; A.vuln = true; A.cancelled = false; A.nextAtk = now + d.cooldownMs;
            }
            return;
        }
        const los = EN.hasLos(e, pp.x, pp.z);
        if (dist < d.minDist) { EN.turn(e, pp.x, pp.z); EN.step(e, (p.x - pp.x) / dist, (p.z - pp.z) / dist, 1); }
        else if (!los || dist > d.maxDist) EN.approach(e, pp.x, pp.z, dist, 1);
        else { EN.turn(e, pp.x, pp.z); EN.step(e, -(pp.z - p.z) / dist, (pp.x - p.x) / dist, 0.45); }
        if (los && dist > 5 && dist < d.maxDist && now >= A.nextAtk && now >= A.armedAt) {
            A.state = 'WINDUP'; A.t0 = now; A.lx = pp.x; A.ly = pp.y - 0.2; A.lz = pp.z; A.aimDmg = 0; A.cancelled = false;
        }
    };

    EN.updAlpha = function (e, dist, now) {
        const A = e.ai, d = e.def, pp = playerObj.position, p = e.mesh.position;
        if (A.state === 'RECOVERY') {
            if (now - A.t0 >= A.recDur) { A.state = 'CHASE'; A.vuln = false; }
            return;
        }
        if (A.state === 'CHARGE') {
            const el = now - A.t0;
            if (el < d.windupMs) {
                EN.turn(e, pp.x, pp.z);
                EN.flash(e, Math.floor(el / 70) % 2 === 0, 0xef4444);
                return;
            }
            if (!A.locked) {
                A.locked = true; EN.flash(e, false, 0);
                const l = Math.hypot(pp.x - p.x, pp.z - p.z) || 1;
                A.dx = (pp.x - p.x) / l; A.dz = (pp.z - p.z) / l;
                EN.beepAt(e, 180, 0.08, 'square', 0.12);
            }
            EN.step(e, A.dx, A.dz, d.chargeMul);
            if (!A.did && Math.hypot(pp.x - p.x, pp.z - p.z) < d.attackRange + 0.45 && clearLine(p.x, p.z, pp.x, pp.z, 0.25)) {
                A.did = true;
                hurtPlayer(B.baseDamage * d.dmg, false);
            }
            if (el >= d.windupMs + d.chargeMs) {
                A.state = 'RECOVERY'; A.t0 = now; A.recDur = d.recoveryMs; A.vuln = true;
                A.locked = false; A.did = false; A.nextCharge = now + d.chargeCd;
            }
            return;
        }
        if (dist > d.attackRange * 0.85) EN.approach(e, pp.x, pp.z, dist, 1);
        else EN.turn(e, pp.x, pp.z);
        if (dist <= d.attackRange && now >= A.nextAtk && now >= A.armedAt && clearLine(p.x, p.z, pp.x, pp.z, 0.25)) {
            hurtPlayer(B.baseDamage * d.dmg * 0.8, false);
            A.nextAtk = now + 720;
        }
        if (dist > 5.5 && dist < 16 && now >= (A.nextCharge || 0) && now >= A.armedAt) {
            A.state = 'CHARGE'; A.t0 = now; A.locked = false; A.did = false;
            EN.beepAt(e, 400, 0.1, 'square', 0.11);
        }
    };

    EN.summon = function (e, type, n) {
        const alive = enemies.filter((o) => o.summoner === e && o.hp > 0).length;
        n = Math.min(n, Math.max(0, 4 - alive));
        if (n <= 0 || enemies.length > 26) return 0;
        let got = 0;
        for (let i = 0; i < n; i++) {
            EN.forceType = type || 'zombie';
            spawnEnemy(EPOCHS[gameState.currentEpochIndex].chickenType, false, 3);
            EN.forceType = null;
            const a = enemies[enemies.length - 1];
            if (a && a !== e) { a.summoner = e; got++; }
        }
        return got;
    };

    EN.updTotem = function (e, dist, now) {
        const A = e.ai;
        EN.turn(e, playerObj.position.x, playerObj.position.z, true);
        if (e.mode === 'relay') {
            if (now < (A.nextAtk || 0) || (A.calls || 0) >= 6 || enemies.length > 26) return;
            A.nextAtk = now + 8000; A.calls = (A.calls || 0) + 1;
            const before = enemies.length;
            EN.summon(e, 'zombie', 1);
            const a = enemies.length > before ? enemies[enemies.length - 1] : null;
            if (a) {
                const spot = EN.pickPoint(e.mesh.position.x, e.mesh.position.z, 2.5, 5.5, 3);
                if (spot) a.mesh.position.set(spot.x, -(a.hh || 3), spot.z);
            }
            if (!EN.quiet) toast('📡 Transmissor chamou reforço (' + A.calls + '/6). Destrua-o!');
            return;
        }
        const boss = gameState.bossEntity;
        if (!boss || boss.hp <= 0 || boss.hp >= boss.maxHp) return;
        if ((A.healsN || 0) >= 4 || now < (A.nextAtk || 0)) return;
        A.nextAtk = now + 4000;
        const amt = Math.min(boss.maxHp * 0.06, boss.maxHp - boss.hp);
        if (amt < 1) return;
        boss.hp += amt;
        A.healsN = (A.healsN || 0) + 1;
        if (typeof updateBossHPBar === 'function') updateBossHPBar();
        EN.beepAt(e, 640, 0.1, 'sine', 0.1);
        EN.flash(e, true, 0x22c55e); e._greenUntil = now + 200;
        if (!EN.quiet) toast('💚 Dispositivo curou o chefe (' + A.healsN + '/4). Atire nele!');
    };

    // ---------- chefes ----------
    const BOSS_DEFS = [
        { name: 'O FRANGUEIRO', color: 0x84cc16, blurb: 'Investidas retas e poucos zumbis. Desvie para o lado.', summon: 'zombie', melee: 2.2,
            phases: [
                { line: '☠️ O Frangueiro acordou. Desvie das investidas.', acts: ['melee', 'charge', 'summon'] },
                { line: '☠️ Fase 2 — investidas mais seguidas.', acts: ['charge', 'melee', 'summon', 'charge'] },
                { line: '☠️ Fase 3 — ele chama a revoada.', acts: ['charge', 'summon', 'melee'] }
            ] },
        { name: 'SARGENTO CASCA-GROSSA', color: 0x94a3b8, blurb: 'Armadura na frente. Dê a volta e atire nas costas.', armor: true, melee: 2.6, turn: 1.6,
            phases: [
                { line: '🛡️ Casca-Grossa: a frente quase não sofre. Vá para as costas.', acts: ['melee', 'charge', 'melee'] },
                { line: '🛡️ Fase 2 — investidas pesadas, ainda reto.', acts: ['charge', 'melee', 'charge'] },
                { line: '🛡️ Fase 3 — não pare na frente dele.', acts: ['charge', 'charge', 'melee'] }
            ] },
        { name: 'GENERAL PIU-PIU', color: 0xf97316, blurb: 'Rajadas e reforços. Atire enquanto ele recarrega.', summon: 'gunner', melee: 2.0,
            phases: [
                { line: '🎯 Piu-Piu trava a mira. Cubra-se e priorize quem cura o tiroteio.', acts: ['burst', 'melee', 'summon'] },
                { line: '🎯 Fase 2 — rajadas mais longas. A recarga é a sua janela.', acts: ['burst', 'burst', 'summon'] },
                { line: '🎯 Fase 3 — limpe os reforços e castigue a recarga.', acts: ['burst', 'summon', 'charge'] }
            ] },
        { name: 'DRA. OVOLINA', color: 0x65a30d, blurb: 'Ácido e aparelhos de cura. Quebre os aparelhos.', summon: 'spitter', melee: 2.0,
            phases: [
                { line: '🧪 Ovolina espalha ácido. Destrua os dispositivos verdes.', acts: ['acid', 'melee', 'acid'], enter: (e) => EN.dropDevices(e, 'heal', 2) },
                { line: '🧪 Fase 2 — mais poças. Os aparelhos ainda curam, no máximo 4 vezes.', acts: ['acid', 'totem', 'acid'] },
                { line: '🧪 Fase 3 — não fique na poça.', acts: ['acid', 'acid', 'summon'] }
            ] },
        { name: 'A MÃE DOS GAVIÕES', color: 0xe0f2fe, blurb: 'Mergulha na marca e fica aberta ao pousar.', fly: true, melee: 2.1,
            phases: [
                { line: '🪶 Ela voa e mergulha. Saia da marca amarela; o pouso é a janela.', acts: ['dive', 'burst', 'dive'] },
                { line: '🪶 Fase 2 — mergulhos seguidos. Atire quando ela tocar o chão.', acts: ['dive', 'dive', 'burst'] },
                { line: '🪶 Fase 3 — leia a marca, não o corpo no ar.', acts: ['dive', 'burst', 'dive'] }
            ] },
        { name: 'O CRONO-GALO', color: 0xa78bfa, blurb: 'Zonas que só deixam você mais lento. Dá para sair.', melee: 2.2,
            phases: [
                { line: '⏳ Zona roxa = mais lento, não parado. Saia e ataque na pausa.', acts: ['zone', 'melee', 'burst'] },
                { line: '⏳ Fase 2 — o ciclo é zona, rajada, zona.', acts: ['zone', 'burst', 'zone'] },
                { line: '⏳ Fase 3 — corra na zona e castigue a recuperação.', acts: ['zone', 'charge', 'burst'] }
            ] },
        { name: 'EMISSÁRIO DO OVO CÓSMICO', color: 0xd946ef, blurb: 'Tiros em curva e portais anunciados.', melee: 2.3,
            phases: [
                { line: '👁️ Tiros curvos não perseguem. Ande de lado. O portal avisa o destino.', acts: ['curve', 'portal', 'burst'] },
                { line: '👁️ Fase 2 — mais curvas. O teleporte tem círculo antes.', acts: ['curve', 'curve', 'portal'] },
                { line: '👁️ Fase 3 — não fique entre o portal e a rajada.', acts: ['portal', 'burst', 'curve'] }
            ] },
        { name: 'O APOCALIPINTO', color: 0xf87171, blurb: 'Mistura o que você já viu. Nada de regra nova.', summon: 'zombie', melee: 2.5,
            phases: [
                { line: '🐔 Apocalipinto: investida, bico e rajada. Tudo já ensinado.', acts: ['charge', 'melee', 'burst'] },
                { line: '🐔 Fase 2 — emboscada, ácido e investida.', acts: ['burrow', 'acid', 'charge'] },
                { line: '🐔 Fase 3 — alterne distância. Toda abertura tem recuperação.', acts: ['burrow', 'zone', 'burst', 'charge'] }
            ] },
        { name: 'MARECHAL COCORICÓ', color: 0xfbbf24, blurb: 'Transmissores chamam soldados. Quebre-os.', summon: 'runner', melee: 2.3,
            phases: [
                { line: '📡 Transmissores azuis chamam reforço. Destrua-os para calar o rádio.', acts: ['burst', 'charge', 'relay'], enter: (e) => EN.dropDevices(e, 'relay', 2) },
                { line: '📡 Fase 2 — se o transmissor viver, a horda não para.', acts: ['burst', 'relay', 'charge'] },
                { line: '📡 Fase 3 — artilharia e investida. Os rádios continuam o alvo.', acts: ['burst', 'charge', 'burst'] }
            ] },
        { name: 'PROTÓTIPO 0V0', color: 0x22d3ee, blurb: 'Muda de forma. Cada forma tem uma brecha.', armor: true, mutate: true, melee: 2.4,
            phases: [
                { line: '🧬 Carapaça, investida explosiva ou ácido. Quando a casca abrir, atire.', acts: ['melee', 'charge'] },
                { line: '🧬 Fase 2 — a mutação troca sozinha. A brecha brilha.', acts: ['acid', 'charge', 'melee'] },
                { line: '🧬 Fase 3 — nenhuma forma é imune para sempre.', acts: ['burst', 'charge', 'acid'] }
            ] },
        { name: 'O GALINÁRCANO', color: 0xc084fc, blurb: 'Gravidade marcada, tiros curvos e portais.', melee: 2.2,
            phases: [
                { line: '🌌 Poço roxo puxa para baixo. Saia dele. Tiros curvos, portal anunciado.', acts: ['grav', 'curve', 'portal'] },
                { line: '🌌 Fase 2 — o poço não prende para sempre.', acts: ['grav', 'curve', 'burst'] },
                { line: '🌌 Fase 3 — reposicione. Nada aqui é hitscan.', acts: ['portal', 'grav', 'curve'] }
            ] },
        { name: 'O DEUS-GALO', color: 0xfde68a, blurb: 'Três atos com mecânicas que você já domina.', summon: 'alien', melee: 2.8, flyFrom: 1,
            phases: [
                { line: '👑 Ato 1 — chão: bico, investida e rajada.', acts: ['melee', 'charge', 'burst'] },
                { line: '👑 Ato 2 — ele sobe. Mergulho, ácido e rajada. Atire no pouso.', acts: ['dive', 'acid', 'burst'] },
                { line: '👑 Ato 3 — zona temporal, tiros curvos e reforços. A linha do tempo acaba aqui.', acts: ['zone', 'curve', 'summon', 'burst'] }
            ] }
    ];
    window.BOSS_DEFS = BOSS_DEFS;

    EN.dropDevices = function (boss, mode, n) {
        for (let i = 0; i < n; i++) {
            if (enemies.filter((o) => o.ownerBoss === boss && o.hp > 0).length >= n) return;
            EN.forceType = 'totem';
            spawnEnemy(EPOCHS[gameState.currentEpochIndex].chickenType, false, 3);
            EN.forceType = null;
            const a = enemies[enemies.length - 1];
            if (!a || a === boss) continue;
            a.mode = mode;
            a.ownerBoss = boss;
            const ang = (i / n) * Math.PI * 2 + 0.4;
            const x = boss.mesh.position.x + Math.cos(ang) * 8;
            const z = boss.mesh.position.z + Math.sin(ang) * 8;
            a.mesh.position.set(Math.max(-70, Math.min(70, x)), -(a.hh || 3), Math.max(-70, Math.min(70, z)));
            a.fl = boss.fl || 0; a.yb = boss.yb || 0;
        }
    };

    EN.attachBoss = function (e) {
        const i = gameState.currentEpochIndex | 0;
        const def = BOSS_DEFS[i] || BOSS_DEFS[7];
        e.boss = { id: i, def: def, phase: -1, step: 0, said: {}, armored: !!def.armor, flying: false, form: def.mutate ? 'shell' : '' };
        e.bt = '_boss';
        e.def = { kind: 'boss', perception: 90, turnRate: def.turn || 2.5, attackRange: 4.6, interrupt: false };
        e.ai = {
            id: EN.seq++, state: 'CHASE', mode: null, t0: EN.clock, nextAtk: EN.clock + 700,
            yaw: 0, fx: 0, fz: -1, los: true, losT: 0, side: 1, sideT: 0, flank: 1,
            hurt: false, aimDmg: 0, vuln: false, dead: false, done: false, shots: 0, locked: false,
            mats: [], armedAt: 0
        };
        const mats = [];
        e.mesh.traverse((o) => {
            if (!o.material || !o.material.color || !o.material.emissive) return;
            if (o.material.isMeshLambertMaterial) {
                o.material.color.lerp(new THREE.Color(def.color), 0.5);
                mats.push(o.material);
            }
        });
        e.ai.mats = mats.slice(0, 6);
        const crown = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.12, 6, 18), new THREE.MeshBasicMaterial({ color: def.color }));
        crown.rotation.x = Math.PI / 2; crown.position.y = 2.4; e.mesh.add(crown);
        const name = document.getElementById('boss-name');
        if (name) name.innerText = def.name;
        if (!EN.quiet) toast('☠️ ' + def.name + ' — ' + def.blurb);
    };

    function recover(e, ms) {
        const A = e.ai;
        A.mode = 'recover'; A.t0 = EN.clock; A.recDur = ms; A.vuln = true; A.locked = false; A.did = false; A.shots = 0;
    }

    EN.bossChase = function (e, dist) {
        const pp = playerObj.position;
        if (dist > 3.4) EN.approach(e, pp.x, pp.z, dist, e.boss && e.boss.flying ? 0.85 : 1);
        else EN.turn(e, pp.x, pp.z);
        if (e.boss && e.boss.flying && e.ai.mode !== 'dive' && e.ai.mode !== 'recover') e.mesh.position.y = (e.yb || 0) + 4.3;
    };

    EN.bossAct = function (e, dist, now) {
        const A = e.ai, boss = e.boss, def = boss.def, pp = playerObj.position, p = e.mesh.position, el = now - A.t0;
        const gy = e.yb || 0;
        if (A.mode === 'melee') {
            EN.turn(e, pp.x, pp.z);
            if (dist > 5.2 && el < 350) { EN.bossChase(e, dist); return; }
            if (el < 520) { EN.flash(e, Math.floor(el / 80) % 2 === 0, 0xff2222); return; }
            if (!A.did) {
                A.did = true; EN.flash(e, false, 0);
                if (dist < 5.4 && clearLine(p.x, p.z, pp.x, pp.z, 0.45)) hurtPlayer(B.baseDamage * (def.melee || 2.3), true);
            }
            if (el >= 880) recover(e, 380);
            return;
        }
        if (A.mode === 'charge') {
            if (el < 640) { EN.turn(e, pp.x, pp.z); EN.flash(e, Math.floor(el / 70) % 2 === 0, 0xff4400); return; }
            if (!A.locked) {
                A.locked = true; EN.flash(e, false, 0);
                const l = Math.hypot(pp.x - p.x, pp.z - p.z) || 1;
                A.dx = (pp.x - p.x) / l; A.dz = (pp.z - p.z) / l;
            }
            EN.step(e, A.dx, A.dz, 3.3);
            if (!A.did && Math.hypot(pp.x - p.x, pp.z - p.z) < 4.3 && clearLine(p.x, p.z, pp.x, pp.z, 0.4)) {
                A.did = true;
                hurtPlayer(B.baseDamage * (def.melee || 2.3) * 1.15, true);
                if (boss.form === 'blast') {
                    EN.mark(p.x, gy, p.z, 4.2, 220, 0xfb923c, 'slam');
                    const slam = EN.zones[EN.zones.length - 1];
                    if (slam) slam.dmg = B.baseDamage * 1.4;
                }
            }
            if (el >= 640 + 460) recover(e, 520);
            return;
        }
        if (A.mode === 'burst') {
            if (boss.flying) p.y = gy + 4.3;
            if (el < 620) {
                EN.turn(e, pp.x, pp.z);
                EN.flash(e, Math.floor(el / 70) % 2 === 0, 0xfbbf24);
                if (el > 420 && !A.locked) { A.locked = true; A.lx = pp.x; A.ly = pp.y; A.lz = pp.z; }
                return;
            }
            const n = 3 + boss.phase;
            while (A.shots < n && el >= 620 + A.shots * 170) {
                EN.fireAt(e, A.lx, A.ly, A.lz, {
                    mat: XG().alienMat, damage: B.baseDamage * 1.15,
                    yaw: (A.shots - (n - 1) / 2) * 0.14, speed: 0.32
                });
                A.shots++;
            }
            if (A.shots >= n && el >= 620 + n * 170 + 80) recover(e, 780);
            return;
        }
        if (A.mode === 'summon') {
            if (!A.did) { A.did = true; EN.summon(e, def.summon || 'zombie', boss.phase >= 2 ? 2 : 1); EN.beepAt(e, 260, 0.1, 'square', 0.1); }
            if (el > 500) recover(e, 400);
            return;
        }
        if (A.mode === 'acid') {
            if (el < 560) { EN.turn(e, pp.x, pp.z); EN.flash(e, Math.floor(el / 60) % 2 === 0, 0x65a30d); if (!A.locked) { A.locked = true; A.lx = pp.x; A.lz = pp.z; EN.mark(pp.x, gy, pp.z, 3.2, 560, 0xbef264, 'mark'); } return; }
            if (!A.did) {
                A.did = true;
                EN.fireAt(e, A.lx, pp.y, A.lz, {
                    mat: XG().acidMat, speed: 0.26, life: 100, damage: B.baseDamage * 0.8,
                    onDie: (ep) => {
                        if (EN.zones.filter((z) => z.kind === 'acid').length >= B.maxAcid) return;
                        EN.mark(ep.mesh.position.x, gy, ep.mesh.position.z, 4.2, 4200, 0x65a30d, 'acid');
                    }
                });
            }
            if (el > 800) recover(e, 600);
            return;
        }
        if (A.mode === 'zone') {
            if (el < 640) {
                EN.flash(e, Math.floor(el / 80) % 2 === 0, 0x7c3aed);
                if (!A.locked) { A.locked = true; A.lx = pp.x; A.lz = pp.z; EN.mark(A.lx, gy, A.lz, 5.2, 640, 0xddd6fe, 'mark'); }
                return;
            }
            if (!A.did) {
                A.did = true;
                if (EN.zones.filter((z) => z.kind === 'time').length < B.maxTime) EN.mark(A.lx, gy, A.lz, 5.2, 4000, 0x7c3aed, 'time');
            }
            if (el > 860) recover(e, 700);
            return;
        }
        if (A.mode === 'curve') {
            if (el < 520) { EN.turn(e, pp.x, pp.z); EN.flash(e, true, 0xd946ef); if (!A.locked) { A.locked = true; A.lx = pp.x; A.ly = pp.y; A.lz = pp.z; } return; }
            if (!A.did) {
                A.did = true; EN.flash(e, false, 0);
                EN.fireAt(e, A.lx, A.ly, A.lz, { mat: XG().alienMat, damage: B.baseDamage * 1.25, curve: 2.6, speed: 0.3, life: 150 });
                EN.fireAt(e, A.lx, A.ly, A.lz, { mat: XG().alienMat, damage: B.baseDamage * 1.25, curve: -2.6, speed: 0.3, life: 150 });
            }
            if (el > 900) recover(e, 640);
            return;
        }
        if (A.mode === 'portal') {
            if (!A.locked) {
                const spot = EN.pickPoint(pp.x, pp.z, 7, 14, 5) || { x: p.x + 6, z: p.z };
                A.lx = spot.x; A.lz = spot.z; A.locked = true;
                EN.mark(spot.x, gy, spot.z, 2, 800, 0xe9d5ff, 'mark');
                EN.beepAt(e, 280, 0.12, 'sawtooth', 0.1);
            }
            EN.flash(e, true, 0xc026d3);
            if (el >= 800) {
                if (!blocked(A.lx, A.lz, 1.2, e.fl | 0)) { p.x = A.lx; p.z = A.lz; }
                EN.flash(e, false, 0);
                recover(e, 560);
            }
            return;
        }
        if (A.mode === 'burrow') {
            if (!A.locked) {
                const spot = EN.pickPoint(pp.x, pp.z, 2.2, 5.5, 2.4) || { x: pp.x + 3, z: pp.z };
                A.lx = spot.x; A.lz = spot.z; A.locked = true;
                EN.mark(A.lx, gy, A.lz, 2.6, 900, 0xf59e0b, 'mark');
            }
            e.burrowed = el < 900; e.hr = e.burrowed ? 0 : 3.2;
            p.y = e.burrowed ? gy - 4 : gy;
            if (e.burrowed) { p.x += (A.lx - p.x) * 0.08; p.z += (A.lz - p.z) * 0.08; }
            if (el >= 900 && !A.did) {
                A.did = true; e.burrowed = false; p.x = A.lx; p.z = A.lz; p.y = gy;
                if (typeof dirtBurst === 'function') dirtBurst(p.x, p.z, 12, 1.2, gy);
                if (Math.hypot(pp.x - p.x, pp.z - p.z) < 3.1) applyPlayerDamage(B.baseDamage * (def.melee || 2.2));
            }
            if (el >= 1300) recover(e, 620);
            return;
        }
        if (A.mode === 'dive') {
            if (el < 560) {
                p.y = gy + 4.5;
                if (!A.locked) { A.locked = true; A.lx = pp.x; A.lz = pp.z; A.x0 = p.x; A.z0 = p.z; EN.mark(A.lx, gy, A.lz, 2.8, 900, 0xfef08a, 'mark'); }
                EN.flash(e, Math.floor(el / 60) % 2 === 0, 0xfef08a);
                return;
            }
            const t = Math.min(1, (el - 560) / 380);
            p.x = A.x0 + (A.lx - A.x0) * t; p.z = A.z0 + (A.lz - A.z0) * t; p.y = gy + 4.5 * (1 - t);
            if (t >= 1 && !A.did) {
                A.did = true; p.y = gy;
                if (Math.hypot(pp.x - p.x, pp.z - p.z) < 3) applyPlayerDamage(B.baseDamage * (def.melee || 2.2));
                EN.beepAt(e, 130, 0.1, 'square', 0.12);
            }
            if (el >= 560 + 380 + 200) { boss.flying = false; recover(e, 1000); }
            return;
        }
        if (A.mode === 'grav') {
            if (el < 500) {
                if (!A.locked) { A.locked = true; A.lx = pp.x; A.lz = pp.z; EN.mark(A.lx, gy, A.lz, 5, 500, 0xe9d5ff, 'mark'); }
                return;
            }
            if (!A.did) { A.did = true; EN.mark(A.lx, gy, A.lz, 5, 3500, 0x7c3aed, 'grav'); }
            if (el > 760) recover(e, 500);
            return;
        }
        if (A.mode === 'totem') {
            if (!A.did) { A.did = true; EN.dropDevices(e, 'heal', 1); }
            if (el > 400) recover(e, 300);
            return;
        }
        if (A.mode === 'relay') {
            if (!A.did) { A.did = true; EN.dropDevices(e, 'relay', 1); }
            if (el > 400) recover(e, 300);
            return;
        }
        recover(e, 200);
    };

    EN.mutateBoss = function (e, now) {
        const boss = e.boss, A = e.ai;
        if (A.mode) return;
        if (!boss.nextMut) boss.nextMut = now + 2500;
        if (now < boss.nextMut) return;
        const seq = ['shell', 'blast', 'acid', 'open'];
        boss.mi = ((boss.mi || 0) + 1) % seq.length;
        const m = seq[boss.mi];
        boss.form = m;
        boss.armored = m === 'shell';
        A.vuln = m === 'open';
        boss.nextMut = now + (m === 'open' ? 2600 : 7200);
        const lines = {
            shell: '🛡️ CARAPAÇA — a frente segura. Costas e a próxima brecha doem.',
            blast: '💥 INVESTIDA EXPLOSIVA — ele trava a direção. Saia da linha.',
            acid: '🧪 ÁCIDO — a poça fica no chão. Não pise.',
            open: '✨ BRECHA — a casca abriu. Atire agora!'
        };
        if (!EN.quiet) toast(lines[m]);
        if (m === 'blast') { A.mode = 'charge'; A.t0 = now; A.locked = false; A.did = false; }
        else if (m === 'acid') { A.mode = 'acid'; A.t0 = now; A.locked = false; A.did = false; }
    };

    EN.bossTick = function (e, dist, now) {
        const A = e.ai, boss = e.boss, def = boss.def;
        if (!boss || A.dead) return;
        const ratio = e.maxHp > 0 ? e.hp / e.maxHp : 1;
        const phase = ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : 2;
        if (phase !== boss.phase) {
            boss.phase = phase;
            boss.step = 0;
            const ph = def.phases[phase];
            if (ph && !boss.said[phase]) {
                boss.said[phase] = 1;
                if (!EN.quiet && ph.line) toast(ph.line);
                if (ph.enter) ph.enter(e);
            }
            const name = document.getElementById('boss-name');
            if (name) name.innerText = def.name + (phase ? ' — FASE ' + (phase + 1) : '');
        }
        boss.flying = !!(def.fly || (def.flyFrom != null && phase >= def.flyFrom)) && A.mode !== 'dive' && A.mode !== 'recover';
        if (def.mutate) EN.mutateBoss(e, now);
        if (A.mode === 'recover') {
            EN.turn(e, playerObj.position.x, playerObj.position.z);
            e.mesh.position.y = e.yb || 0;
            if (now - A.t0 >= A.recDur) {
                A.mode = null; A.vuln = boss.form === 'open'; A.nextAtk = now + Math.max(280, 520 - phase * 80);
            }
            return;
        }
        if (A.mode) { EN.bossAct(e, dist, now); return; }
        if (now < A.nextAtk) { EN.bossChase(e, dist); return; }
        const acts = def.phases[boss.phase].acts;
        const name = acts[boss.step % acts.length];
        boss.step++;
        A.mode = name; A.t0 = now; A.sub = 0; A.did = false; A.shots = 0; A.locked = false;
    };

    EN.update = function (e) {
        const A = e.ai;
        if (!A || A.dead || e.hp <= 0) return;
        const d = e.def;
        if (!d) return;
        const now = EN.clock, p = e.mesh.position, pp = playerObj.position;
        const dx = pp.x - p.x, dz = pp.z - p.z, dist = Math.hypot(dx, dz) || 0.0001;
        if (A.yaw === null) {
            EN.turn(e, pp.x, pp.z, true);
            A.armedAt = now + B.spawnGraceMs;
            A.t0 = now;
        }
        if (e._fz != null) {
            A.t0 += EN.dt; A.nextAtk += EN.dt;
            if (A.armedAt) A.armedAt += EN.dt;
            return;
        }
        if (e.isBoss && e.boss) { EN.bossTick(e, dist, now); return; }
        if (A.state === 'IDLE') {
            if (dist <= (d.perception || 40) || A.hurt || now - A.t0 > B.idleTimeoutMs) EN.wake(e);
            if (A.state === 'IDLE') return;
        }
        if (A.state === 'ALERT') {
            EN.turn(e, pp.x, pp.z);
            if (now - A.t0 >= B.alertMs) { A.state = 'CHASE'; A.t0 = now; }
            return;
        }
        const k = d.kind;
        if (k === 'melee') EN.updMelee(e, dist, now);
        else if (k === 'gunner') EN.updGunner(e, dx, dz, dist, now);
        else if (k === 'explosive') EN.updExplosive(e, dist, now);
        else if (k === 'jumper') EN.updJumper(e, dist, now);
        else if (k === 'spitter') EN.updSpitter(e, dist, now);
        else if (k === 'medic') EN.updMedic(e, dist, now);
        else if (k === 'buff') EN.updForeman(e, dist, now);
        else if (k === 'burrow') EN.updBurrow(e, dist, now);
        else if (k === 'flyer') EN.updFlyer(e, dist, now);
        else if (k === 'temporal') EN.updTemporal(e, dist, now);
        else if (k === 'alien') EN.updAlien(e, dist, now);
        else if (k === 'alpha') EN.updAlpha(e, dist, now);
        else if (k === 'totem') EN.updTotem(e, dist, now);
    };

    EN.envTick = function () {
        const now = EN.clock, p = playerObj.position;
        for (let i = 0; i < enemyProjectiles.length; i++) {
            const ep = enemyProjectiles[i];
            if (!ep.curve) continue;
            ep.arcT = (ep.arcT || 0) + EN.dt / 1000;
            const yaw = Math.sin(ep.arcT * 4) * ep.curve * (EN.dt / 1000);
            const c = Math.cos(yaw), s = Math.sin(yaw);
            const x = ep.dir.x, z = ep.dir.z;
            ep.dir.x = x * c - z * s;
            ep.dir.z = x * s + z * c;
        }
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (e._greenUntil && now > e._greenUntil) { e._greenUntil = 0; if (e.ai) EN.flash(e, false, 0); }
        }
        let slow = 1;
        for (let i = EN.zones.length - 1; i >= 0; i--) {
            const z = EN.zones[i];
            const inside = Math.hypot(p.x - z.x, p.z - z.z) < z.R && Math.abs((p.y - PLAYER_HEIGHT) - z.y) < 4;
            if (z.kind === 'time' && inside) slow = Math.min(slow, B.timeSlow);
            if (z.kind === 'grav' && inside && !gameState.inHub) velocityY -= B.gravExtra * (EN.dt / 1000);
            if (z.kind === 'acid' && inside && now >= z.next && !gameState.inHub && gameState.isPlaying && !gameState.isDead) {
                z.next = now + B.acidTickMs;
                applyPlayerDamage(B.acidTick);
            }
            if (z.mesh) z.mesh.material.opacity = (z.kind === 'mark' ? 0.55 : 0.28) + 0.2 * Math.sin(now / 110);
            if (now >= z.until) {
                if (z.kind === 'slam' && inside && z.dmg && !gameState.inHub) applyPlayerDamage(z.dmg);
                scene.remove(z.mesh);
                z.mesh.visible = false;
                EN.pool.push(z.mesh);
                EN.zones.splice(i, 1);
            }
        }
        EN._slow = Math.max(B.timeMin, Math.min(1, slow));
    };
    EN.speedMul = function () { return EN._slow || 1; };

    const _tick = EN.tick;
    EN.tick = function () { _tick(); if (!gameState.inHub && gameState.isPlaying) EN.envTick(); else EN._slow = 1; };

    const _reset = EN.reset;
    EN.reset = function () {
        _reset();
        for (let i = EN.zones.length - 1; i >= 0; i--) {
            const z = EN.zones[i];
            if (z.mesh && typeof scene !== 'undefined' && scene) scene.remove(z.mesh);
            if (z.mesh) { z.mesh.visible = false; EN.pool.push(z.mesh); }
        }
        EN.zones.length = 0;
        EN._slow = 1;
    };

    const _spawn = spawnEnemy;
    spawnEnemy = function (type, isBoss, zone) {
        const n = enemies.length;
        _spawn(type, isBoss === undefined ? false : isBoss, zone);
        const e = enemies.length > n ? enemies[enemies.length - 1] : null;
        if (!e || e._hooked) return e;
        e._hooked = 1;
        if (e.isBoss) EN.attachBoss(e);
        else if (e.bt) {
            e.maxHp = Math.max(1, Math.round(e.maxHp * (B.hpScale || 1)));
            e.hp = e.maxHp;
            if (e.bt === 'totem') { e.maxHp = e.hp = 64 + 14 * (gameState.currentEpochIndex | 0); e.speed = 0; }
        }
        return e;
    };

    const _dmg = damageEnemy;
    damageEnemy = function (enemy, dmg, silent) {
        if (enemy && enemy.burrowed) return;
        return _dmg(enemy, dmg, silent);
    };

    const _lel = loadEpochLevel;
    loadEpochLevel = function (i) {
        const r = _lel.apply(this, arguments);
        const debut = Object.keys(ENEMY_DEFS).filter((k) => ENEMY_DEFS[k].intro === i && ENEMY_DEFS[k].tip && ENEMY_DEFS[k].intro < 90);
        if (debut.length) {
            setTimeout(() => {
                if (gameState.inHub || gameState.currentEpochIndex !== i || EN.quiet) return;
                toast('🆕 Nesta era: ' + debut.map((k) => ENEMY_DEFS[k].name).join(', '));
            }, 1700);
        }
        return r;
    };

    // ---------- bestiário, toque, sonda de controle ----------
    const modal = document.createElement('div');
    modal.id = 'bestiary-modal';
    modal.className = 'absolute inset-0 bg-black/90 z-30 hidden flex items-center justify-center p-4';
    modal.innerHTML = '<div class="retro-panel max-w-3xl w-full max-h-[88vh] overflow-y-auto p-5 rounded text-left"><h2 class="text-amber-400 text-2xl mb-2">BESTIÁRIO</h2><div id="bestiary-body"></div><button id="btn-close-bestiary" class="mt-4 py-2 px-6 bg-zinc-800 text-white font-bold rounded border border-gray-400">FECHAR (B)</button></div>';
    document.body.appendChild(modal);
    const bst = document.createElement('style');
    bst.textContent = '#bestiary-modal.hidden{display:none!important}#touch-ui{display:none;position:fixed;inset:0;z-index:26;pointer-events:none}#touch-ui .on{pointer-events:auto;touch-action:none}';
    document.head.appendChild(bst);
    document.getElementById('btn-close-bestiary').addEventListener('click', () => { if (activeModal === 'bestiary-modal') closeModal(); });

    function renderBestiary() {
        const order = ['zombie', 'runner', 'jumper', 'armored', 'gunner', 'explosive', 'spitter', 'medic', 'flyer', 'temporal', 'alien', 'burrower', 'alpha', 'heavy', 'foreman', 'anomaly'];
        document.getElementById('bestiary-body').innerHTML = order.map((k) => {
            const d = ENEMY_DEFS[k];
            if (!d) return '';
            const seen = EN.seen[k];
            return '<div class="border-b border-amber-900/50 py-2"><b class="' + (d.elite ? 'text-yellow-300' : 'text-amber-200') + '">' + (seen ? d.name : '???') + '</b>'
                + (d.elite ? ' <span class="text-xs text-yellow-500">ELITE</span>' : '')
                + '<div class="text-gray-300 text-sm">' + (seen ? d.tip : 'Ainda não encontrado. Era ' + (d.intro + 1) + '.') + '</div>'
                + (seen ? '<div class="text-xs text-gray-500">Vida ' + Math.round(d.hp * 100) + '% · Dano ' + Math.round(d.dmg * 100) + '% · Vel. ' + Math.round(d.spd * 100) + '% · Custo ' + d.cost + '</div>' : '')
                + '</div>';
        }).join('') + '<p class="text-xs text-gray-500 mt-3">Chefes: um por era, com fases em 66% e 33% de vida. Tecla B abre este livro.</p>';
    }
    document.addEventListener('keydown', (ev) => {
        if (ev.code !== 'KeyB' || !gameState.isPlaying || gameState.isPaused || gameState.isDead) return;
        if (activeModal === 'bestiary-modal') { closeModal(); return; }
        if (activeModal) return;
        renderBestiary();
        openModal('bestiary-modal');
    });
    const help = document.querySelector('#pause-screen .text-xs');
    if (help) {
        const line = document.createElement('p');
        line.innerHTML = '• <b class="text-white">B</b>: Bestiário (fraquezas e elites)';
        help.appendChild(line);
    }

    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900) {
        const ui = document.createElement('div');
        ui.id = 'touch-ui';
        ui.innerHTML = '<div id="touch-look" class="on" style="position:absolute;right:0;top:0;width:58%;height:72%"></div>'
            + '<div id="touch-stick" class="on" style="position:absolute;left:16px;bottom:108px;width:120px;height:120px;border:3px solid #fbbf24;border-radius:999px;background:rgba(0,0,0,.35)"></div>'
            + '<button id="touch-fire" class="on" style="position:absolute;right:24px;bottom:120px;width:84px;height:84px;border-radius:999px;background:#b91c1c;color:#fff;font-weight:700;border:3px solid #fecaca">ATIRO</button>'
            + '<button id="touch-jump" class="on" style="position:absolute;right:120px;bottom:128px;width:64px;height:64px;border-radius:12px;background:#92400e;color:#fff;font-weight:700;border:2px solid #fde68a">PULO</button>'
            + '<button id="touch-use" class="on" style="position:absolute;right:24px;bottom:214px;padding:8px 12px;background:#14532d;color:#fff;font-weight:700;border:2px solid #86efac">USAR</button>';
        document.body.appendChild(ui);
        const stick = document.getElementById('touch-stick');
        let sid = null, ox = 0, oy = 0;
        const clearMove = () => { moveForward = moveBackward = moveLeft = moveRight = false; sid = null; };
        stick.addEventListener('pointerdown', (e) => { sid = e.pointerId; ox = e.clientX; oy = e.clientY; stick.setPointerCapture(e.pointerId); });
        stick.addEventListener('pointermove', (e) => {
            if (e.pointerId !== sid) return;
            const dx = e.clientX - ox, dy = e.clientY - oy;
            moveForward = dy < -16; moveBackward = dy > 16; moveLeft = dx < -16; moveRight = dx > 16;
        });
        stick.addEventListener('pointerup', clearMove);
        stick.addEventListener('pointercancel', clearMove);
        const fire = document.getElementById('touch-fire');
        fire.addEventListener('pointerdown', (e) => { e.stopPropagation(); isShooting = true; });
        fire.addEventListener('pointerup', () => { isShooting = false; });
        fire.addEventListener('pointerleave', () => { isShooting = false; });
        const tapKey = (code, el) => {
            el.addEventListener('pointerdown', (e) => { e.stopPropagation(); document.dispatchEvent(new KeyboardEvent('keydown', { code: code, bubbles: true })); });
            el.addEventListener('pointerup', () => document.dispatchEvent(new KeyboardEvent('keyup', { code: code, bubbles: true })));
        };
        tapKey('Space', document.getElementById('touch-jump'));
        document.getElementById('touch-use').addEventListener('pointerdown', (e) => { e.stopPropagation(); document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', bubbles: true })); });
        const look = document.getElementById('touch-look');
        let lid = null, lx = 0, ly = 0;
        look.addEventListener('pointerdown', (e) => { if (e.target !== look) return; lid = e.pointerId; lx = e.clientX; ly = e.clientY; look.setPointerCapture(e.pointerId); });
        look.addEventListener('pointermove', (e) => {
            if (e.pointerId !== lid || !playerObj) return;
            const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
            yaw -= dx * 0.005; pitch -= dy * 0.005;
            pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pitch));
            playerObj.rotation.y = yaw; camera.rotation.x = pitch;
        });
        look.addEventListener('pointerup', () => { lid = null; });
        setInterval(() => {
            const on = gameState.isPlaying && !gameState.isPaused && !activeModal && !gameState.isUpgradeMenuOpen && !gameState.isDead;
            ui.style.display = on ? 'block' : 'none';
        }, 300);
    }

    window.__controlsTest = {
        getYaw: () => yaw,
        getSpeed: () => Math.hypot(velX, velZ),
        getPos: () => ({ x: playerObj.position.x, z: playerObj.position.z }),
        setKeys: (codes) => {
            const set = new Set(codes || []);
            moveForward = set.has('KeyW') || set.has('ArrowUp');
            moveBackward = set.has('KeyS') || set.has('ArrowDown');
            moveLeft = set.has('KeyA') || set.has('ArrowLeft');
            moveRight = set.has('KeyD') || set.has('ArrowRight');
        }
    };

    window.__enemySelfTest = function () {
        const fails = [];
        const check = (name, cond) => { if (!cond) fails.push(name); };
        const snap = {
            inHub: gameState.inHub, playing: gameState.isPlaying, paused: gameState.isPaused,
            hp: gameState.health, dead: gameState.isDead, kills: gameState.stats.kills,
            feathers: gameState.feathers, total: gameState.totalKills, kie: gameState.killsInEpoch,
            px: playerObj.position.x, pz: playerObj.position.z, quiet: EN.quiet
        };
        const made = [];
        const enemySnap = new Set(enemies);
        const itemSnap = items.length;
        EN.quiet = true;
        try {
            const need = ['zombie', 'runner', 'jumper', 'armored', 'gunner', 'explosive', 'spitter', 'medic', 'burrower', 'flyer', 'temporal', 'alien', 'alpha', 'heavy', 'foreman', 'anomaly'];
            need.forEach((k) => check('def ' + k, !!ENEMY_DEFS[k] && ENEMY_DEFS[k].kind));
            check('12 chefes', BOSS_DEFS.length === 12 && BOSS_DEFS.every((b) => b.phases && b.phases.length === 3 && b.phases.every((p) => p.acts && p.acts.length)));
            const w0 = EN.weights(0, 0);
            check('era1 sem especialista', w0.jumper === 0 && w0.gunner === 0 && w0.spitter === 0 && (w0.zombie > 0 || w0.runner > 0));
            const w1 = EN.weights(1, 1);
            check('era2 saltadora', w1.jumper > 0 && w1.armored > 0 && w1.spitter === 0);
            const wA = EN.weights(2, 1);
            check('elite alfa na fase 3', wA.alpha > 0 && wA.heavy === 0);
            check('escavadora só na fase 8', EN.weights(6, 2).burrower === 0 && EN.weights(7, 2).burrower > 0);
            check('anomalia na fase 7', EN.weights(5, 2).anomaly === 0 && EN.weights(6, 2).anomaly > 0);
            const spot = EN.pickPoint(playerObj.position.x, playerObj.position.z, 3, 6, 2.4);
            check('ponto de emboscada válido', !!spot && Math.hypot(spot.x - playerObj.position.x, spot.z - playerObj.position.z) >= 2.4 && !blocked(spot.x, spot.z, 1, 0));

            gameState.inHub = false; gameState.isPlaying = true; gameState.isPaused = false; gameState.isDead = false; gameState.health = 100;
            EN.mark(playerObj.position.x, 0, playerObj.position.z, 5, 5000, 0x7c3aed, 'time');
            EN.envTick();
            check('zona temporal desacelera', EN.speedMul() <= B.timeSlow + 0.001 && EN.speedMul() >= B.timeMin);
            EN.mark(playerObj.position.x, 0, playerObj.position.z, 5, 5000, 0x7c3aed, 'time');
            EN.envTick();
            check('lentidão não zera nem acumula', EN.speedMul() >= B.timeMin - 0.001 && EN.speedMul() <= B.timeSlow + 0.001);
            EN.zones.length = 0;
            EN.envTick();
            check('velocidade volta', Math.abs(EN.speedMul() - 1) < 0.001);

            const dir0 = new THREE.Vector3(1, 0, 0);
            enemyProjectiles.push({ mesh: { position: new THREE.Vector3() }, dir: dir0, curve: 2.5, life: 50, damage: 0, _dead: true });
            const before = dir0.clone();
            for (let i = 0; i < 20; i++) { EN.dt = 50; EN.envTick(); }
            const playerDir = new THREE.Vector3(0, 0, 1);
            check('projétil curvo muda de rumo', Math.abs(dir0.angleTo(before)) > 0.05);
            check('projétil curvo não gruda no jogador', Math.abs(dir0.dot(playerDir)) < 0.98);
            enemyProjectiles.pop();

            function hatch(type) {
                EN.forceType = type;
                spawnEnemy('ancient', false, 2);
                EN.forceType = null;
                const e = enemies[enemies.length - 1];
                made.push(e);
                e.rs = 1; e.mesh.position.y = 0; e.yb = 0;
                if (e.ai) { e.ai.armedAt = 0; e.ai.yaw = 0; e.ai.state = 'CHASE'; e.ai.t0 = EN.clock; }
                return e;
            }
            const ex = hatch('explosive');
            playerObj.position.set(ex.mesh.position.x + 20, PLAYER_HEIGHT, ex.mesh.position.z);
            EN.clock += 100; EN.update(ex);
            check('explosiva longe não arma', ex.ai.state !== 'ATTACK');
            playerObj.position.set(ex.mesh.position.x + 2, PLAYER_HEIGHT, ex.mesh.position.z);
            const hpBefore = gameState.health;
            EN.update(ex);
            check('explosiva arma o pavio', ex.ai.state === 'ATTACK');
            EN.clock += 250; EN.update(ex);
            check('pavio não estoura na hora', gameState.health === hpBefore && ex.hp > 0);
            EN.clock += 1200; EN.update(ex); EN.flush();
            check('explosiva detona depois do aviso', ex.ai.dead || ex.hp <= 0);

            const zed = hatch('zombie');
            zed.hp = zed.maxHp * 0.4;
            const med = hatch('medic');
            med.mesh.position.set(zed.mesh.position.x + 2, 0, zed.mesh.position.z);
            med.ai.heals = {};
            playerObj.position.set(med.mesh.position.x + 30, PLAYER_HEIGHT, med.mesh.position.z);
            const beforeHp = zed.hp;
            for (let i = 0; i < 8; i++) { EN.clock += 200; EN.update(med); }
            check('médica cura', zed.hp > beforeHp + 0.5);
            const healedOnce = zed.hp;
            EN.clock += 100; EN.update(med);
            check('médica não cura todo frame', zed.hp <= healedOnce + 0.01);
            med.ai.nextAtk = 0; med.ai.state = 'CHASE';
            for (let i = 0; i < 6; i++) { EN.clock += 400; EN.update(med); }
            med.ai.nextAtk = 0; med.ai.state = 'CHASE'; zed.hp = zed.maxHp * 0.5;
            for (let i = 0; i < 8; i++) { EN.clock += 500; EN.update(med); }
            check('médica para no limite', (med.ai.heals[zed.ai.id] || 0) <= 2 && (med.ai.heals[zed.ai.id] || 0) >= 1);

            EN.forceType = null;
            spawnEnemy('cosmic', true, 3);
            const boss = enemies[enemies.length - 1];
            made.push(boss);
            boss.rs = 1;
            check('chefe tem controlador', !!(boss.boss && boss.boss.def && boss.boss.def.phases.length === 3));
            for (let i = 0; i < 12; i++) { EN.clock += 300; EN.update(boss); }
            check('chefe age sem travar', boss.hp > 0 && boss.ai && (boss.ai.mode !== undefined));
            boss.hp = boss.maxHp * 0.5;
            EN.update(boss);
            check('chefe muda de fase', boss.boss.phase === 1);
            boss.hp = boss.maxHp * 0.2;
            EN.update(boss);
            check('chefe chega na fase 3 uma vez', boss.boss.phase === 2 && boss.boss.said[2] === 1);
            EN.update(boss);
            check('fase não repete o anúncio', boss.boss.said[2] === 1);
        } catch (err) {
            fails.push('exception ' + (err && err.message ? err.message : err));
        } finally {
            EN.quiet = snap.quiet;
            EN.forceType = null;
            for (let i = enemies.length - 1; i >= 0; i--) {
                if (!enemySnap.has(enemies[i])) {
                    if (enemies[i].mesh) scene.remove(enemies[i].mesh);
                    enemies.splice(i, 1);
                }
            }
            while (items.length > itemSnap) {
                const it = items.pop();
                if (it && it.mesh) scene.remove(it.mesh);
            }
            for (let i = EN.zones.length - 1; i >= 0; i--) {
                scene.remove(EN.zones[i].mesh);
                EN.pool.push(EN.zones[i].mesh);
            }
            EN.zones.length = 0;
            EN._slow = 1;
            gameState.inHub = snap.inHub;
            gameState.isPlaying = snap.playing;
            gameState.isPaused = snap.paused;
            gameState.health = snap.hp;
            gameState.isDead = snap.dead;
            gameState.stats.kills = snap.kills;
            gameState.feathers = snap.feathers;
            gameState.totalKills = snap.total;
            gameState.killsInEpoch = snap.kie;
            playerObj.position.x = snap.px;
            playerObj.position.z = snap.pz;
            const msg = document.getElementById('game-message-screen');
            if (msg) msg.classList.add('hidden');
            const bhud = document.getElementById('boss-hud');
            if (bhud) bhud.classList.add('hidden');
            gameState.bossEntity = null;
        }
        return { ok: fails.length === 0, fails: fails };
    };

    window.__enemiesReady = true;
    if (document.readyState === 'complete' && window.bootGame) window.bootGame();
})();
