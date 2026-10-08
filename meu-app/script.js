        class SoundEngine {
            constructor() {
                this.ctx = null;
                this.masterVolume = 0.8;
            }

            init() {
                if (!this.ctx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                }
                if (this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
            }

            setMasterVolume(val) {
                this.masterVolume = parseFloat(val);
            }

            playShoot() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(350, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.09);
                gain.gain.setValueAtTime(0.2 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.09);
            }

            playJump() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(140, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.18);
                gain.gain.setValueAtTime(0.25 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.18);
            }

            playHit() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(220, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.25 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.08);
            }

            playChickenCluck() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                const now = this.ctx.currentTime;
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.setValueAtTime(740, now + 0.04);
                osc.frequency.setValueAtTime(300, now + 0.1);
                gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(now + 0.16);
            }

            playPickup() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.2 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.12);
            }

            playReload(phase) {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = this.ctx.currentTime;
                osc.type = 'square';
                osc.frequency.setValueAtTime(phase ? 520 : 180, t);
                osc.frequency.exponentialRampToValueAtTime(phase ? 260 : 90, t + 0.07);
                gain.gain.setValueAtTime(0.18 * this.masterVolume, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(t + 0.08);
            }

            playEmpty() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = this.ctx.currentTime;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(900, t);
                gain.gain.setValueAtTime(0.15 * this.masterVolume, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(t + 0.04);
            }

            playPlayerDamage() {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(130, this.ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.22);
                gain.gain.setValueAtTime(0.4 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.22);
            }

            playExplosion() {
                if (!this.ctx) return;
                const bufferSize = this.ctx.sampleRate * 0.35;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(600, this.ctx.currentTime);
                filter.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.35);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.5 * this.masterVolume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                noise.start();
                noise.stop(this.ctx.currentTime + 0.35);
            }
        }

        const audio = new SoundEngine();

        // DEFINIÇÃO COMPLETA DAS 5 DIMENSÕES TEMPORAIS
        const EPOCHS = [
            {
                id: 1, name: "1. Pré-História & Templo", subtitle: "Galinhas Infectadas Primitivas",
                wallColor: 0x8b5a2b, floorColor: 0x4a2e16, skyColor: 0x3d1706, fogColor: 0x2e0e03,
                chickenType: "ancient", bossType: "warrior_chicken", enemiesToKill: 14, secretLoot: null
            },
            {
                id: 2, name: "2. Coliseu Romano", subtitle: "Gladiadoras Mortas-Vivas",
                wallColor: 0xa1887f, floorColor: 0x5d4037, skyColor: 0x2a1a14, fogColor: 0x20140f,
                chickenType: "roman", bossType: "gladiator_boss", enemiesToKill: 17, secretLoot: 'sword'
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
                chickenType: "mummy", bossType: "pharaoh_boss", enemiesToKill: 28, secretLoot: 'alien'
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
                id: 9, name: "9. Museu Vulcânico", subtitle: "Ancestrais das Cinzas", extra: true, room: 'r1',
                wallColor: 0x7c2d12, floorColor: 0x292524, skyColor: 0x1c0a05, fogColor: 0x2a0f05,
                chickenType: "ancient", bossType: "warrior_chicken", enemiesToKill: 30, secretLoot: null
            },
            {
                id: 10, name: "10. Arranha-Céu Corporativo", subtitle: "Zumbis de Terno e Circuito", extra: true, room: 'r2',
                wallColor: 0x475569, floorColor: 0x1e293b, skyColor: 0x0b1020, fogColor: 0x0a0f1c,
                chickenType: "cyber", bossType: "cyber_boss", enemiesToKill: 34, secretLoot: null
            },
            {
                id: 11, name: "11. Prédio em Colapso", subtitle: "Moradores Amaldiçoados", extra: true, room: 'r3',
                wallColor: 0x365314, floorColor: 0x1a2e05, skyColor: 0x061208, fogColor: 0x0a1a0c,
                chickenType: "swamp", bossType: "swamp_boss", enemiesToKill: 38, secretLoot: null
            },
            {
                id: 12, name: "12. Biblioteca Atemporal", subtitle: "Guardiãs dos Livros do Tempo", extra: true, room: 'r4',
                wallColor: 0x581c87, floorColor: 0x1e1b4b, skyColor: 0x0a0420, fogColor: 0x12062e,
                chickenType: "cosmic", bossType: "supreme_chicken", enemiesToKill: 46, secretLoot: null
            }
        ];

        let gameState = {
            currentEpochIndex: 0,
            health: 100,
            shield: 50,
            ammoStore: {},
            maxAmmo: 200,
            feathers: 0,
            totalKills: 0,
            killsInEpoch: 0,
            startTime: 0,
            bossSpawned: false,
            bossEntity: null,
            isUpgradeMenuOpen: false,
            shopOpen: false,
            inHub: true,
            maxHealth: 100,
            unlocked: 1,
            completed: [false, false, false, false, false, false, false, false],
            currentWeapon: 'pistol',
            weapons: { pistol: true },
            hotbar: ['pistol', null, null, null],
            wLvl: { pistol: 1 },
            ships: {},
            shipsEquipped: [],
            heals: 0,
            difficulty: 1,
            checkpoint: null,
            playTime: 0,
            quests: {},
            stats: { kills: 0, feathers: 0, secrets: 0 },
            perm: { hp: 0, doubleJump: false, slide: false, airDash: false, chickenShift: false, nooks: [], speed: 0, dmg: 0, shipSlots: 3 },
            isPaused: false,
            isPlaying: false,
            isDead: false,
            isVictory: false,
            upgrades: {
                fireRateLvl: 1,
                damageLvl: 1,
                ammoLvl: 1,
                hasPlasma: false
            }
        };

        let scene, camera, renderer;
        let controlsEnabled = false;

        let playerObj;
        let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, isSprinting = false;
        let canJump = true;
        let isGrounded = true;
        let velocityY = 0;
        // --- B-HOP: momento horizontal preservado (estilo Quake/Source) ---
        let velX = 0, velZ = 0;       // velocidade horizontal (unidades/s)
        let jumpHeld = false;         // ESPAÇO segurado = auto-hop ao tocar o chão (sem atrito)
        const BHOP = {
            airAccel: 14,             // aceleração no ar (air-strafe)
            airCap: 2.6,              // limite de "wishspeed" no ar: quanto menor, mais precisa a curva p/ ganhar velocidade
            groundResponse: 16,       // quão rápido o chão ajusta sua velocidade (alto = movimento seco, como antes)
            maxMul: 2.3               // teto de velocidade horizontal = moveSpeed * maxMul
        };
        // --- HABILIDADES DE MOVIMENTO ---
        // Sprint + Pulo Duplo: base desde o início. Deslize: desbloqueado na missão do Mestre Cocoricó.
        const SLIDE = { dur: 0.8, cd: 0.5, minSpeed: 27, friction: 1.7, drop: 0.75, steer: 2.2, dmgMul: 0.5, active: false, t: 0, cdT: 0, k: 0, dx: 0, dz: 0, spd: 0 };
        function hasSlide() { return !!(gameState.perm.slide || gameState.perm.doubleJump); } // doubleJump = saves antigos que já tinham concluído a missão
        function underLow() {
            const p = playerObj.position;
            return colliders.some(c => c.low && c.box && p.x > c.minX - 0.7 && p.x < c.maxX + 0.7 && p.z > c.minZ - 0.7 && p.z < c.maxZ + 0.7);
        }
        function endSlide() { if (!SLIDE.active) return; SLIDE.active = false; SLIDE.cdT = SLIDE.cd; }
        function startSlide() {
            if (!hasSlide() || !gameState.isPlaying || gameState.isPaused || activeModal) return;
            if (SLIDE.active || SLIDE.cdT > 0 || !isGrounded) return;
            let dx = velX, dz = velZ;
            const h = Math.hypot(dx, dz);
            if (h < 2) { dx = -Math.sin(yaw); dz = -Math.cos(yaw); } else { dx /= h; dz /= h; }
            SLIDE.dx = dx; SLIDE.dz = dz;
            SLIDE.spd = Math.max(h * 1.1, SLIDE.minSpeed * (1 + gameState.perm.speed));
            SLIDE.t = 0; SLIDE.active = true;
            audio.playJump();
        }
        // Passagem baixa: parede com vão de ~1 unidade no chão. Só dá para atravessar deslizando.
        window.addLowPassage = function (x, z, w, d, y0) {
            y0 = y0 || 0;
            const m = new THREE.Mesh(new THREE.BoxGeometry(w, 6, d), new THREE.MeshBasicMaterial({ color: 0x3a2a22 }));
            m.position.set(x, y0 + 1.05 + 3, z); scene.add(m);
            const c = { box: true, low: true, minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 };
            colliders.push(c); return { mesh: m, c };
        };
        // AIR DASH: impulso rápido no ar (1 por salto; recarrega ao tocar o chão). Ignora gravidade e dá invulnerabilidade curta.
        const DASH = { dur: 0.18, cd: 0.25, speed: 40, exitMul: 0.65, active: false, avail: true, t: 0, cdT: 0, k: 0, dx: 0, dz: 0 };
        function hasAirDash() { return !!gameState.perm.airDash; }
        function startAirDash() {
            if (!hasAirDash() || !gameState.isPlaying || gameState.isPaused || activeModal) return;
            if (DASH.active || !DASH.avail || DASH.cdT > 0 || isGrounded) return;
            let dx = 0, dz = 0;
            const f = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
            const r = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
            if (moveForward) { dx += f.x; dz += f.z; }
            if (moveBackward) { dx -= f.x; dz -= f.z; }
            if (moveRight) { dx += r.x; dz += r.z; }
            if (moveLeft) { dx -= r.x; dz -= r.z; }
            const l = Math.hypot(dx, dz);
            if (l < 0.01) { dx = f.x; dz = f.z; } else { dx /= l; dz /= l; }
            DASH.dx = dx; DASH.dz = dz; DASH.t = 0; DASH.active = true; DASH.avail = false;
            velocityY = 0;
            audio.playJump();
        }
        function endAirDash() {
            if (!DASH.active) return;
            DASH.active = false; DASH.cdT = DASH.cd;
            velX = DASH.dx * DASH.speed * DASH.exitMul; velZ = DASH.dz * DASH.speed * DASH.exitMul;
        }
        // RECOIL JUMP (estilo rocket jump do Soldier, TF2): armas explosivas lançam o jogador com a própria explosão.
        // Mire no chão/parede perto dos pés e atire. Custa um pouco de vida, mas nunca mata.
        const RJ = { k: 0, vMax: 30, hMul: 1.15 };
        function recoilBlast(pos, R, F, selfDmg) {
            if (gameState.inHub || DASH.active) return;
            const p = playerObj.position;
            let dx = p.x - pos.x, dy = (p.y - 0.4) - pos.y, dz = p.z - pos.z;
            const d = Math.hypot(dx, dy, dz);
            if (d >= R) return;
            const k = 1 - d / R;
            if (d < 0.01) { dx = 0; dy = 1; dz = 0; } else { dx /= d; dy /= d; dz /= d; }
            if (SLIDE.active) endSlide();
            velocityY = Math.min(RJ.vMax, Math.max(velocityY, 0) + dy * F * k + 6 * k);
            velX += dx * F * k * RJ.hMul; velZ += dz * F * k * RJ.hMul;
            isGrounded = false; RJ.k = 1;
            if (selfDmg > 0 && !gameState.isDead && !gameState.isVictory) {
                gameState.health = Math.max(1, gameState.health - selfDmg * (0.4 + 0.6 * k));
                updateHUD();
            }
        }
        // CHICKEN SHIFT (F): alterna Presente/Passado. Objetos do cenário existem só em um dos tempos
        // (CS.objs), e os inimigos próximos ficam congelados por alguns segundos.
        const CS = { past: false, cdT: 0, objs: [], dur: 10000, until: 0, hud: null };
        function hasChickenShift() { return !!(gameState.perm.chickenShift || (gameState.quests && gameState.quests.q13 === 2)); }
        CS.apply = function () {
            CS.objs.forEach(o => {
                const on = (o.state === 'now') !== CS.past;
                o.mesh.visible = on;
                const i = colliders.indexOf(o.c);
                if (on && i < 0) colliders.push(o.c);
                if (!on && i >= 0) colliders.splice(i, 1);
            });
            nav.ver++;
            try { renderer.domElement.style.filter = CS.past ? 'sepia(.75) saturate(1.3) hue-rotate(-12deg)' : ''; } catch (e) {}
        };
        CS.setHud = function (txt) {
            if (!CS.hud) {
                const el = document.createElement('div');
                el.style.cssText = 'position:absolute;top:64px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none;font-size:22px;font-weight:bold;color:#e9d5ff;text-shadow:2px 2px 0 #000;background:rgba(76,29,149,.55);padding:2px 14px;border:2px solid #a78bfa;display:none';
                document.body.appendChild(el); CS.hud = el;
            }
            CS.hud.style.display = txt ? 'block' : 'none'; if (txt) CS.hud.textContent = txt;
        };
        CS.reset = function () { CS.past = false; CS.objs.length = 0; CS.cdT = 0; CS.until = 0; CS.setHud(''); try { renderer.domElement.style.filter = ''; } catch (e) {} };
        // tempo no passado: depois de CS.dur o jogador volta ao presente (o relógio pausa com o jogo)
        setInterval(() => {
            if (!CS.past) return;
            if (!gameState.isPlaying || gameState.inHub || gameState.isDead) { CS.reset(); return; }
            if (gameState.isPaused || activeModal) { CS.until += 100; return; }
            const left = CS.until - performance.now();
            if (left <= 0) {
                CS.past = false; CS.apply(); CS.cdT = performance.now() + 1600; CS.setHud('');
                audio.playExplosion(); toast('⌛ O tempo acabou — você voltou ao PRESENTE');
            } else CS.setHud('⏳ PASSADO ' + (left / 1000).toFixed(1) + 's');
        }, 100);
        function shiftTime() {
            if (!hasChickenShift() || !gameState.isPlaying || gameState.isPaused || activeModal || gameState.inHub) return;
            const now = performance.now(); if (now < CS.cdT) return; CS.cdT = now + 1600;
            CS.past = !CS.past; CS.apply();
            CS.until = performance.now() + CS.dur; CS.setHud(CS.past ? '⏳ PASSADO ' + (CS.dur / 1000).toFixed(1) + 's' : '');
            const p = playerObj.position; let n = 0;
            enemies.forEach(e => {
                if (e.isBoss || e._fz != null) return;
                if (Math.hypot(e.mesh.position.x - p.x, e.mesh.position.z - p.z) < 30) {
                    e._fz = e.speed; e.speed = 0; n++;
                    setTimeout(() => { if (e._fz != null) { e.speed = e._fz; e._fz = null; } }, 3000);
                }
            });
            audio.playExplosion();
            toast(CS.past ? '⏳ PASSADO (' + (CS.dur / 1000) + 's)' + (n ? ' — ' + n + ' inimigos congelados no tempo' : '') : '⌛ PRESENTE' + (n ? ' — ' + n + ' inimigos congelados no tempo' : ''));
        }
        let pitch = 0;
        let yaw = 0;
        let prevTime = performance.now();

        const PLAYER_HEIGHT = 1.6;

        let machineGunGroup;
        let muzzleFlashLight;
        let isShooting = false;
        let lastShootTime = 0;

        let enemies = [];
        let bullets = [];
        let enemyProjectiles = [];
        let particles = [];
        let items = [];
        let levelObstacles = [];

        function createMachineGunModel() {
            const gunGroup = new THREE.Group();

            const bodyGeo = new THREE.BoxGeometry(0.18, 0.22, 0.75);
            const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            gunGroup.add(body);

            const barrelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8);
            const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.8, roughness: 0.2 });
            const barrel = new THREE.Mesh(barrelGeo, barrelMat);
            barrel.rotation.x = Math.PI / 2;
            barrel.position.set(0, 0.05, -0.55);
            gunGroup.add(barrel);

            const magGeo = new THREE.BoxGeometry(0.12, 0.28, 0.18);
            const magMat = new THREE.MeshLambertMaterial({ color: 0x991b1b });
            const mag = new THREE.Mesh(magGeo, magMat);
            mag.position.set(0, -0.16, -0.1);
            gunGroup.add(mag);

            const sightGeo = new THREE.BoxGeometry(0.04, 0.06, 0.08);
            const sightMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
            const sight = new THREE.Mesh(sightGeo, sightMat);
            sight.position.set(0, 0.14, -0.3);
            gunGroup.add(sight);

            muzzleFlashLight = new THREE.PointLight(0xffb700, 0, 5);
            muzzleFlashLight.position.set(0, 0.05, -0.9);
            gunGroup.add(muzzleFlashLight);

            gunGroup.position.set(0.28, -0.24, -0.5);
            return gunGroup;
        }

        function createZombieChickenMesh(type = "ancient") {
            const chickenGroup = new THREE.Group();

            let bodyColor = 0x22c55e;
            let eyeColor = 0xef4444;
            let beakColor = 0xd97706;

            if (type === "roman") {
                bodyColor = 0xb45309;
                eyeColor = 0xfacc15;
            } else if (type === "knight") {
                bodyColor = 0x64748b;
                eyeColor = 0x38bdf8;
            } else if (type === "cyber") {
                bodyColor = 0x334155;
                eyeColor = 0x06b6d4;
            } else if (type === "cosmic") {
                bodyColor = 0x7e22ce;
                eyeColor = 0x10b981;
            }

            if (type === "mummy") { bodyColor = 0xd6c08a; eyeColor = 0x38bdf8; } else if (type === "swamp") { bodyColor = 0x4d7c0f; eyeColor = 0xfde047; } else if (type === "demon") { bodyColor = 0xdc2626; eyeColor = 0xfbbf24; }
            const bodyGeo = new THREE.BoxGeometry(0.85, 0.85, 1.1);
            const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.6;
            chickenGroup.add(body);

            const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
            const headMat = new THREE.MeshLambertMaterial({ color: bodyColor });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.set(0, 1.15, -0.38);
            chickenGroup.add(head);

            const beakGeo = new THREE.ConeGeometry(0.14, 0.32, 4);
            const beakMat = new THREE.MeshLambertMaterial({ color: beakColor });
            const beak = new THREE.Mesh(beakGeo, beakMat);
            beak.rotation.x = Math.PI / 2;
            beak.position.set(0, 1.1, -0.7);
            chickenGroup.add(beak);

            const combGeo = new THREE.BoxGeometry(0.12, 0.28, 0.45);
            const combMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c });
            const comb = new THREE.Mesh(combGeo, combMat);
            comb.position.set(0, 1.5, -0.38);
            chickenGroup.add(comb);

            const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
            const eyeMat = new THREE.MeshBasicMaterial({ color: eyeColor });
            const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
            leftEye.position.set(-0.22, 1.22, -0.62);
            chickenGroup.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
            rightEye.position.set(0.22, 1.22, -0.62);
            chickenGroup.add(rightEye);

            const wingGeo = new THREE.BoxGeometry(0.16, 0.45, 0.7);
            const wingMat = new THREE.MeshLambertMaterial({ color: bodyColor });
            const leftWing = new THREE.Mesh(wingGeo, wingMat);
            leftWing.position.set(-0.52, 0.65, 0);
            chickenGroup.add(leftWing);

            const rightWing = new THREE.Mesh(wingGeo, wingMat);
            rightWing.position.set(0.52, 0.65, 0);
            chickenGroup.add(rightWing);

            chickenGroup.scale.set(1.1, 1.1, 1.1);
            return chickenGroup;
        }

        function createBossMesh(bossType) {
            let bossGroup;
            if (bossType === "supreme_cosmic_lord") {
                bossGroup = createZombieChickenMesh("cosmic");
                bossGroup.scale.set(4.2, 4.2, 4.2);
                const auraGeo = new THREE.SphereGeometry(2.8, 16, 16);
                const auraMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.6 });
                const aura = new THREE.Mesh(auraGeo, auraMat);
                aura.position.y = 1;
                bossGroup.add(aura);
            } else if (bossType === "cyber_overlord") {
                bossGroup = createZombieChickenMesh("cyber");
                bossGroup.scale.set(3.4, 3.4, 3.4);
            } else if (bossType === "knight_lord") {
                bossGroup = createZombieChickenMesh("knight");
                bossGroup.scale.set(3.2, 3.2, 3.2);
            } else if (bossType === "gladiator_boss") {
                bossGroup = createZombieChickenMesh("roman");
                bossGroup.scale.set(3.0, 3.0, 3.0);
            } else {
                const bep = EPOCHS.find(e => e.bossType === bossType);
                bossGroup = createZombieChickenMesh(bep ? bep.chickenType : "ancient");
                const bsc = 2.8 + 0.12 * (bep ? EPOCHS.indexOf(bep) : 0);
                bossGroup.scale.set(bsc, bsc, bsc);
            }
            return bossGroup;
        }

        function initEngine() {
            const container = document.getElementById('canvas-container');

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            renderer = new THREE.WebGLRenderer({ antialias: false });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            playerObj = new THREE.Object3D();
            velX = 0; velZ = 0;
            playerObj.position.set(0, PLAYER_HEIGHT, 28);
            scene.add(playerObj);

            playerObj.add(camera);

            machineGunGroup = createMachineGunModel();
            camera.add(machineGunGroup);

            window.addEventListener('resize', onWindowResize);
            setupInputListeners();
            migrateLegacySave();
            try { const d = parseInt(LS.getItem(NEW_DIFF_KEY)); if (d >= 0 && d < DIFFS.length) gameState.difficulty = d; } catch (e) {}
            recalcStats();
            renderDiffButtons();
            renderRunSlots();
            equipWeapon(gameState.currentWeapon);
            loadHub();
            setInterval(() => { if (activeRun && gameState.isPlaying && !gameState.isPaused && !gameState.isDead) gameState.playTime++; }, 1000);
            setInterval(saveProgress, 30000);
            window.addEventListener('beforeunload', saveProgress);
        }

                const ARENA = 82;
        const SAVE_KEY = 'chickenDoomSave2';
        const HUB_COLORS = [0xf59e0b, 0xfacc15, 0xa78bfa, 0x22d3ee, 0xd97706, 0x65a30d, 0xef4444, 0xd946ef];
        let ZONE_Z = [[34, 76], [-6, 22], [-40, -18], [-76, -60]], ZONE_N = [0, 0, 0], BOSS_TRIGGER = -49;
        let hubPortals = [], hubStations = [], hubCrystal = null, colliders = [], gates = [], secretWalls = [];
        // navegação das galinhas (flow field em grade) + esquiva com pulo duplo
        const NAV_CELL = 2, NAV_N = (ARENA * 2) / NAV_CELL, NAV_LIMIT = ARENA - 2, NAV_INF = 32767;
        const nav = { ver: 0, grids: {}, frame: 0, seq: 0 };
        const DODGE_CLEAR = 2.6, DODGE_CLEAR_BOSS = 3.4; // altura mínima dos pés p/ escapar (pulo simples chega a ~2.2; duplo a ~4.4)
        let lastDodgeText = 0;
        // munição por arma: cada arma tem pente (mag) e reserva (res) próprios
        const AMMO_DROP_CHANCE = 0.25; // chance de uma galinha comum dropar munição
        const reload = { on: false, id: null, left: 0, total: 0 };
        let lastEmptyClick = 0;
        let usedDouble = false, activeModal = null, invSel = 0, currentQuest = null, toastT = 0;

        const DIFFS = [
            { n: 'FÁCIL', hp: 0.7, dmg: 0.6, spd: 0.85, fe: 0.8 },
            { n: 'NORMAL', hp: 1, dmg: 1, spd: 1, fe: 1 },
            { n: 'DIFÍCIL', hp: 1.5, dmg: 1.5, spd: 1.15, fe: 1.4 },
            { n: 'PESADELO', hp: 2.2, dmg: 2.2, spd: 1.3, fe: 2 }
        ];

        const WEAPONS = {
            pistol: { tipo: 'balistica', rar: 1, name: 'PISTOLA', icon: '🔫', interval: 320, mag: 12, res: 96, reload: 900, ac: 0xd4d4d8, dmg: 1.15, bul: 'pistol', c: 0x3f3f46, b: [0.9, 0.55, 0.9] },
            mg: { tipo: 'balistica', rar: 2, name: 'METRALHADORA', icon: '🪖', interval: 170, mag: 30, res: 240, reload: 1300, ac: 0xfacc15, dmg: 1, bul: 'mg', c: 0x1a1a1a, b: [1, 1, 1] },
            shotgun: { tipo: 'balistica', rar: 2, name: 'ESCOPETA', icon: '💥', interval: 650, mag: 6, res: 48, reload: 1900, ac: 0xfb923c, dmg: 0.7, n: 7, spread: 0.22, bul: 'shell', c: 0x7c4a1e, b: [2.2, 0.7, 2.2] },
            lance: { tipo: 'antiga', rar: 2, name: 'LANÇA DO GUERREIRO', icon: '🔱', interval: 700, mag: 6, res: 36, reload: 1400, ac: 0xd97706, dmg: 3.2, bul: 'spear', c: 0x92400e, b: [0.6, 2.6, 0.6], ammoName: 'LANÇAS' },
            alien: { tipo: 'alienigena', rar: 3, name: 'RIFLE ALIENÍGENA', icon: '🛸', interval: 300, mag: 14, res: 84, reload: 1500, ac: 0x4ade80, dmg: 1.9, bul: 'alien', c: 0x166534, b: [1.3, 1.3, 1.3], ammoName: 'CÉLULAS', secret: true },
            rocket: { tipo: 'balistica', rar: 3, name: 'LANÇA-FOGUETES', icon: '🚀', interval: 800, mag: 4, res: 32, reload: 1800, ac: 0xef4444, dmg: 2.2, bul: 'rocket', c: 0x7f1d1d, b: [1.6, 1.6, 1.6], ammoName: 'FOGUETES' },
            gren: { tipo: 'balistica', rar: 2, name: 'LANÇA-GRANADAS', icon: '💣', interval: 600, mag: 6, res: 36, reload: 1700, ac: 0x84cc16, dmg: 1.6, bul: 'grenade', c: 0x3f6212, b: [1.4, 1.1, 1.4], ammoName: 'GRANADAS' },
            cannon: { tipo: 'experimental', rar: 3, name: 'CANHÃO DE FRANGO', icon: '🐔', interval: 1100, mag: 3, res: 18, reload: 2200, ac: 0xfde047, dmg: 4, bul: 'chicken', c: 0xca8a04, b: [3, 1, 3], ammoName: 'FRANGOS' },
            sword: { tipo: 'temporal', rar: 4, name: 'ESPADA TEMPORAL', icon: '🗡️', interval: 260, mag: 40, res: 240, reload: 1200, ac: 0x818cf8, dmg: 1.1, n: 2, spread: 0.3, bul: 'slash', c: 0x4338ca, b: [0.5, 2.4, 0.5], ammoName: 'ENERGIA', secret: true },
            eye: { tipo: 'cosmica', rar: 5, name: 'OLHO CÓSMICO', icon: '👁️', interval: 900, mag: 4, res: 28, reload: 2000, ac: 0xe879f9, dmg: 6.5, bul: 'eye', c: 0x701a75, b: [3.2, 0.8, 3.2], ammoName: 'ENERGIA' }
        };

        // ===== CLASSIFICAÇÃO DAS ARMAS =====
        const TIPOS = {
            balistica:   { icon: '🔫', n: 'Balística',    d: 'Armas de fogo convencionais' },
            antiga:      { icon: '⚔️', n: 'Antiga',       d: 'Armas de outras eras' },
            alienigena:  { icon: '👽', n: 'Alienígena',   d: 'Tecnologia extraterrestre' },
            experimental:{ icon: '☢️', n: 'Experimental', d: 'Criadas por experimentos científicos' },
            temporal:    { icon: '🌀', n: 'Temporal',     d: 'Ligadas à viagem no tempo' },
            cosmica:     { icon: '👁️', n: 'Cósmica',      d: 'Poder de criaturas/dimensões cósmicas' }
        };
        const RARIDADES = [null,
            { r: 'I',   n: 'Sucata',      d: 'Improvisada e fraca',                      c: '#9ca3af' },
            { r: 'II',  n: 'Militar',     d: 'Convencional e confiável',                 c: '#4ade80' },
            { r: 'III', n: 'Avançada',    d: 'Tecnologia experimental ou muito poderosa', c: '#38bdf8' },
            { r: 'IV',  n: 'Anômala',     d: 'Quebra as regras normais do mundo',        c: '#c084fc' },
            { r: 'V',   n: 'Apocalíptica',d: 'Feita para destruir o universo',           c: '#f87171' }
        ];
        function wTag(id) {
            const w = WEAPONS[id], t = TIPOS[w.tipo], r = RARIDADES[w.rar];
            return `<span class="block text-xs font-bold leading-tight" style="color:${r.c}">${t.icon} ${t.n} · ${r.r} ${r.n}</span>`;
        }
        function wTagTxt(id) { const w = WEAPONS[id]; return TIPOS[w.tipo].icon + ' ' + RARIDADES[w.rar].r; }

        const SHOP = [
            { id: 'mg', type: 'weapon', icon: '🪖', name: 'Metralhadora', desc: 'Rajadas rápidas e confiáveis de projéteis convencionais.', cost: 50 },
            { id: 'shotgun', type: 'weapon', icon: '💥', name: 'Escopeta', desc: '7 projéteis em leque. Devastadora de perto.', cost: 80 },
            { id: 'lance', type: 'weapon', icon: '🔱', name: 'Lança do Guerreiro', desc: 'Lança de outra era, arremessada com força: atravessa vários inimigos.', cost: 120 },
            { id: 'cannon', type: 'weapon', icon: '🐔', name: 'Canhão de Frango', desc: 'Experimento científico que dispara frangos explosivos em área.', cost: 200 },
            { id: 'gren', type: 'weapon', icon: '💣', name: 'Lança-Granadas', desc: 'Granadas que quicam e explodem rápido. A explosão também te lança (Recoil Jump).', cost: 150 },
            { id: 'rocket', type: 'weapon', icon: '🚀', name: 'Lança-Foguetes', desc: 'Foguete explosivo em área. Atire no chão aos seus pés para dar um rocket jump (Recoil Jump).', cost: 220 },
            { id: 'eye', type: 'weapon', icon: '👁️', name: 'Olho Cósmico', desc: 'Olhar de uma criatura cósmica: raio perfurante de altíssimo dano.', cost: 300 },
            { id: 'vida', type: 'ship', icon: '❤️', name: 'Ship da Vida', desc: '+50 de vida máxima.', cost: 60 },
            { id: 'escudo', type: 'ship', icon: '🛡️', name: 'Ship Guardião', desc: '-25% de todo o dano recebido.', cost: 70 },
            { id: 'vento', type: 'ship', icon: '🌪️', name: 'Ship do Vento', desc: '+25% de velocidade de movimento.', cost: 50 },
            { id: 'ima', type: 'ship', icon: '🧲', name: 'Ship Ímã de Penas', desc: 'Atrai itens de longe e dá +50% de penas.', cost: 40 },
            { id: 'furia', type: 'ship', icon: '🔥', name: 'Ship da Fúria', desc: '+30% de dano em todas as armas.', cost: 90 },
            { id: 'vampiro', type: 'ship', icon: '🩸', name: 'Ship Vampírico', desc: 'Recupera 2 de vida a cada galinha abatida.', cost: 100 }
        ];

        const QUESTS = [
            { id: 'q1', npc: 'Vovó Penosa', x: -18, z: 18, color: 0xf5d0fe, title: 'Caçadora de Penas', desc: 'Abata 30 galinhas zumbis.', goal: 30, prog: () => gameState.stats.kills, reward: '+30 de vida máxima permanente', give: () => { gameState.perm.hp += 30; } },
            { id: 'q2', npc: 'Mestre Cocoricó', x: 18, z: 18, color: 0xfde68a, title: 'Domador de Chefes', desc: 'Derrote os chefes de 2 eras.', goal: 2, prog: () => gameState.completed.filter(Boolean).length, reward: 'DESLIZE permanente (tecla C)', give: () => { gameState.perm.slide = true; } },
            { id: 'q3', npc: 'Tio Ovo', x: -10, z: 26, color: 0xe5e7eb, title: 'Colecionador de Penas', desc: 'Colete 200 penas ao todo.', goal: 200, prog: () => gameState.stats.feathers, reward: '+15% de dano permanente', give: () => { gameState.perm.dmg += 0.15; } },
            { id: 'q4', npc: 'Exploradora Pipa', x: 10, z: 26, color: 0xbbf7d0, title: 'Caçadora de Segredos', desc: 'Abra 2 câmaras secretas.', goal: 2, prog: () => gameState.stats.secrets, reward: '+15% de velocidade permanente', give: () => { gameState.perm.speed += 0.15; } },
            { id: 'q5', npc: 'Aprendiz Pintinho', x: 0, z: 13, color: 0xfca5a5, title: 'Mestre da Bigorna', desc: 'Melhore uma arma até o nível 3 na bigorna.', goal: 3, prog: () => Math.max(...Object.values(gameState.wLvl)), reward: '+1 slot de Ship (build maior)', give: () => { gameState.perm.shipSlots++; } },
            { id: 'q6', npc: 'Piloto Asa-Veloz', x: 18, z: 26, color: 0x93c5fd, title: 'Voo Livre', desc: 'Derrote os chefes de 3 eras.', goal: 3, prog: () => gameState.completed.filter(Boolean).length, reward: 'AIR DASH permanente (tecla Q)', give: () => { gameState.perm.airDash = true; } },
        ];

        function hasShip(id) { return gameState.shipsEquipped.includes(id); }
        function recalcStats() {
            const g = gameState;
            g.maxHealth = 100 + g.perm.hp + (hasShip('vida') ? 50 : 0);
            g.health = Math.min(g.health, g.maxHealth);
        }
        function toast(msg) {
            const e = document.getElementById('toast');
            e.innerText = msg; e.classList.remove('hidden');
            clearTimeout(toastT);
            toastT = setTimeout(() => e.classList.add('hidden'), 3500);
        }

        // ===== SISTEMA DE RUNS (SAVES SEPARADOS) =====
        const SAVE_KEYS = ['unlocked', 'completed', 'feathers', 'upgrades', 'weapons', 'hotbar', 'wLvl', 'ships', 'shipsEquipped', 'heals', 'quests', 'perm', 'stats', 'maxAmmo', 'currentWeapon', 'difficulty', 'checkpoint', 'playTime'];
        const RUN_SLOTS = 3, RUN_KEY = n => 'chickenDoomRun' + n, LAST_RUN_KEY = 'chickenDoomLastRun', NEW_DIFF_KEY = 'chickenDoomNewDiff';
        const DEFAULT_SAVE = JSON.parse(JSON.stringify(SAVE_KEYS.reduce((o, k) => { o[k] = gameState[k]; return o; }, {})));
        const CP_NAMES = ['Início da fase', 'Área 2 (portão 1 aberto)', 'Área 3 (portão 2 aberto)', 'Arena do Chefe'];
        let activeRun = 0, runCreated = 0, delArm = 0, msgCheckpoint = false;

        function readRun(n) {
            try { const r = JSON.parse(LS.getItem(RUN_KEY(n))); return r && r.data ? r : null; } catch (e) { return null; }
        }
        function saveProgress() {
            if (!activeRun) return;
            try {
                const d = {};
                SAVE_KEYS.forEach(k => { d[k] = gameState[k]; });
                LS.setItem(RUN_KEY(activeRun), JSON.stringify({ v: 2, created: runCreated, updated: Date.now(), data: d }));
                LS.setItem(LAST_RUN_KEY, String(activeRun));
            } catch (e) {}
        }
        // save antigo (único) vira a RUN 1
        function migrateLegacySave() {
            try {
                const old = LS.getItem(SAVE_KEY);
                if (old && !readRun(1)) {
                    LS.setItem(RUN_KEY(1), JSON.stringify({ v: 2, created: Date.now(), updated: Date.now(), data: JSON.parse(old) }));
                    LS.removeItem(SAVE_KEY);
                }
            } catch (e) {}
        }
        // saves com as armas antigas: cada uma vira a sua sucessora (mantendo posse e nível)
        const WEAPON_MIGRATE = { rail: 'eye', flame: 'lance', egg: 'cannon', tesla: 'alien', minigun: 'sword' };
        function migrateWeaponSave() {
            const g = gameState;
            Object.keys(WEAPON_MIGRATE).forEach(o => {
                const n = WEAPON_MIGRATE[o];
                if (g.weapons[o]) g.weapons[n] = true;
                if (g.wLvl[o]) g.wLvl[n] = Math.max(g.wLvl[n] || 1, g.wLvl[o]);
                delete g.weapons[o]; delete g.wLvl[o];
                g.hotbar = g.hotbar.map(x => x === o ? n : x);
                if (g.currentWeapon === o) g.currentWeapon = n;
            });
            g.weapons.pistol = true; if (!g.wLvl.pistol) g.wLvl.pistol = 1;
            Object.keys(g.weapons).forEach(id => { if (!WEAPONS[id]) delete g.weapons[id]; });
            g.hotbar = g.hotbar.map(x => x && g.weapons[x] ? x : null);
            if (!g.hotbar.some(Boolean)) g.hotbar[0] = 'pistol';
            if (!g.weapons[g.currentWeapon]) g.currentWeapon = g.hotbar.find(Boolean);
        }
        // carrega (ou cria do zero) uma run e deixa o estado pronto para jogar
        function selectRun(n, fresh) {
            const diff = gameState.difficulty; // dificuldade escolhida na tela inicial (vale para runs novas)
            SAVE_KEYS.forEach(k => { gameState[k] = JSON.parse(JSON.stringify(DEFAULT_SAVE[k])); });
            gameState.ammoStore = {};
            const sv = fresh ? null : readRun(n);
            if (sv) {
                SAVE_KEYS.forEach(k => { if (sv.data[k] !== undefined) gameState[k] = sv.data[k]; });
                runCreated = sv.created || Date.now();
            } else { gameState.difficulty = diff; runCreated = Date.now(); }
            migrateWeaponSave();
            activeRun = n;
            gameState.health = 100;
            recalcStats();
            gameState.health = gameState.maxHealth;
            gameState.shield = 50;
            refillAllAmmo();
            equipWeapon(gameState.currentWeapon);
            renderDiffButtons();
        }
        function startRun(n, fresh) {
            audio.init();
            selectRun(n, fresh);
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('hud').classList.remove('hidden');
            document.getElementById('crosshair-container').classList.remove('hidden');
            gameState.isPlaying = true; gameState.isDead = false; gameState.isVictory = false;
            gameState.startTime = performance.now();
            const cp = gameState.checkpoint;
            if (!fresh && cp && EPOCHS[cp.epoch]) respawnAtCheckpoint(); else loadHub();
            saveProgress();
            requestPointerLock();
        }
        function delRun(n) {
            if (delArm === n) { try { LS.removeItem(RUN_KEY(n)); } catch (e) {} delArm = 0; renderRunSlots(); return; }
            delArm = n; renderRunSlots();
            setTimeout(() => { if (delArm === n) { delArm = 0; renderRunSlots(); } }, 3000);
        }
        function fmtTime(sec) {
            const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60);
            return h ? h + 'h' + String(m).padStart(2, '0') : m + 'min';
        }
        function renderRunSlots() {
            const el = document.getElementById('run-slots');
            if (!el) return;
            let last = 0; try { last = parseInt(LS.getItem(LAST_RUN_KEY)) || 0; } catch (e) {}
            let h = '';
            for (let n = 1; n <= RUN_SLOTS; n++) {
                const r = readRun(n);
                if (!r) {
                    h += `<div class="flex items-center justify-between gap-3 bg-black/60 p-3 rounded border border-zinc-700">
                        <div class="text-left"><p class="text-zinc-400 font-bold">RUN ${n} — vazia</p><p class="text-xs text-zinc-500">Dificuldade: ${DIFFS[gameState.difficulty].n}</p></div>
                        <button onclick="startRun(${n}, true)" class="py-2 px-4 bg-red-800 hover:bg-red-700 text-white font-bold rounded border-2 border-amber-400">NOVA RUN</button></div>`;
                } else {
                    const d = r.data, done = (d.completed || []).slice(0, 8).filter(Boolean).length, cp = d.checkpoint;
                    const where = cp && EPOCHS[cp.epoch]
                        ? `<p class="text-xs text-emerald-300">📍 Checkpoint: ${EPOCHS[cp.epoch].name} — ${CP_NAMES[cp.stage | 0] || CP_NAMES[0]}</p>`
                        : `<p class="text-xs text-sky-300">🏛️ No HUB Temporal</p>`;
                    h += `<div class="flex items-center justify-between gap-3 bg-black/60 p-3 rounded border ${n === last ? 'border-yellow-400' : 'border-amber-900'}">
                        <div class="text-left"><p class="text-amber-400 font-bold">RUN ${n} ${n === last ? '<span class="text-xs text-yellow-300">⭐ última</span>' : ''}</p>
                        <p class="text-xs text-gray-300">${DIFFS[d.difficulty != null ? d.difficulty : 1].n} · ⏳ ${done}/8 eras · 🪶 ${d.feathers || 0} · 🐔 ${(d.stats && d.stats.kills) || 0} · ⏱ ${fmtTime(d.playTime || 0)}</p>
                        ${where}
                        <p class="text-xs text-zinc-500">${new Date(r.updated).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p></div>
                        <div class="flex flex-col gap-1">
                        <button onclick="startRun(${n}, false)" class="py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded border-2 border-emerald-300">CONTINUAR</button>
                        <button onclick="delRun(${n})" class="py-1 px-4 ${delArm === n ? 'bg-red-600' : 'bg-zinc-800'} hover:bg-red-700 text-white text-xs rounded border border-zinc-600">${delArm === n ? 'CONFIRMAR?' : '🗑 Apagar'}</button></div></div>`;
                }
            }
            el.innerHTML = h;
        }

        // ===== CHECKPOINTS =====
        // stage 0 = início da fase · 1/2 = portões 1/2 abertos · 3 = portão do chefe aberto (arena)
        function setCheckpoint(stage) {
            if (gameState.inHub) return;
            gameState.checkpoint = { epoch: gameState.currentEpochIndex, stage };
            saveProgress();
        }
        function respawnAtCheckpoint() {
            const cp = gameState.checkpoint;
            if (!cp || !EPOCHS[cp.epoch]) { loadHub(); return; }
            gameState.currentEpochIndex = cp.epoch;
            loadEpochLevel(cp.epoch);
            const s = Math.min(cp.stage | 0, gates.length);
            if (s > 0) {
                enemies.forEach(e => scene.remove(e.mesh)); enemies = [];
                gates.forEach(g => {
                    if (g.k >= s) return;
                    g.closed = false; g.opening = false;
                    const ci = colliders.indexOf(g.col); if (ci >= 0) colliders.splice(ci, 1);
                    g.group.visible = false; g.group.position.y = -13;
                });
                nav.ver++;
                gameState.killsInEpoch = gates[s - 1].need;
                const ep = EPOCHS[cp.epoch];
                if (s < 3) for (let n = 0; n < ZONE_N[s]; n++) spawnEnemy(ep.chickenType, false, s);
                velX = 0; velZ = 0;
                playerObj.position.set(gates[s - 1].doorX, PLAYER_HEIGHT, gates[s - 1].z + 5);
            }
            gameState.health = gameState.maxHealth;
            gameState.shield = Math.max(gameState.shield, 50);
            refillAllAmmo();
            updateHUD();
            toast('📍 Checkpoint: ' + EPOCHS[cp.epoch].name + ' — ' + CP_NAMES[s]);
        }

        function setDifficulty(i) {
            gameState.difficulty = i; renderDiffButtons();
            if (activeRun) saveProgress(); else { try { LS.setItem(NEW_DIFF_KEY, String(i)); } catch (e) {} renderRunSlots(); }
        }
        function renderDiffButtons() {
            document.getElementById('diff-buttons').innerHTML = DIFFS.map((d, i) =>
                `<button onclick="setDifficulty(${i})" class="py-2 rounded border-2 font-bold text-sm md:text-base ${i === gameState.difficulty ? 'bg-red-700 border-yellow-300 text-white' : 'bg-zinc-900 border-amber-900 text-gray-300'}">${d.n}</button>`).join('');
            document.getElementById('btn-diff').innerText = 'DIFICULDADE: ' + DIFFS[gameState.difficulty].n;
        }

        function addObj(o) { scene.add(o); levelObstacles.push(o); return o; }

        function clearWorld() {
            [enemies, bullets, enemyProjectiles, particles, items].forEach(arr => arr.forEach(o => scene.remove(o.mesh)));
            levelObstacles.forEach(o => scene.remove(o));
            enemies = []; bullets = []; enemyProjectiles = []; particles = []; items = [];
            nav.ver++; levelObstacles = []; colliders = []; hubPortals = []; hubStations = []; gates = []; secretWalls = []; hubCrystal = null;
            document.getElementById('boss-hud').classList.add('hidden');
            document.getElementById('hub-hint').classList.add('hidden');
        }

        // ---- colisões ----
        function resolveColliders() {
            const p = playerObj.position;
            colliders.forEach(c => {
                if (c.low && SLIDE.active) return;
                if (c.box) {
                    const cx = Math.max(c.minX, Math.min(p.x, c.maxX)), cz = Math.max(c.minZ, Math.min(p.z, c.maxZ));
                    const dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
                    if (d < 0.6) {
                        if (d > 0.001) { p.x = cx + dx / d * 0.6; p.z = cz + dz / d * 0.6; }
                        else { p.z = c.maxZ + 0.6; }
                    }
                } else {
                    const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = c.r + 0.6;
                    if (d < m && d > 0.001) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; }
                }
            });
        }
        function blocked(x, z, r) {
            for (const c of colliders) {
                if (c.box) { if (x > c.minX - r && x < c.maxX + r && z > c.minZ - r && z < c.maxZ + r) return true; }
                else if (Math.hypot(x - c.x, z - c.z) < c.r + r * 0.6) return true;
            }
            return false;
        }
        function bulletBlocked(pos) {
            for (const c of colliders) {
                if (c.box) { if (pos.x > c.minX && pos.x < c.maxX && pos.z > c.minZ && pos.z < c.maxZ) return c; }
                else if (Math.hypot(pos.x - c.x, pos.z - c.z) < c.r) return c;
            }
            return null;
        }
        function moveEnemy(e, dx, dz) {
            const p = e.mesh.position, r = e.isBoss ? 2.2 : 0.8;
            const bx = blocked(p.x + dx, p.z, r, e.fl | 0), bz = blocked(p.x, p.z + dz, r, e.fl | 0);
            if (!bx) p.x += dx;
            if (!bz) p.z += dz;
            if (bx && bz) { const sg = (e.bobTimer > 5 ? 1 : -1) * 1.5; p.x += -dz * sg; p.z += dx * sg; }
        }

        // ---- navegação: as galinhas contornam paredes até o jogador ----
        const NAV_DI = [1, -1, 0, 0, 1, 1, -1, -1], NAV_DJ = [0, 0, 1, -1, 1, -1, 1, -1];
        function navCell(v) { return Math.max(0, Math.min(NAV_N - 1, Math.floor((v + ARENA) / NAV_CELL))); }
        function navCenter(i) { return -ARENA + (i + 0.5) * NAV_CELL; }
        function navGrid(cls) {
            const key = nav.ver + ':' + colliders.length; // portão/parede secreta removidos mudam o tamanho
            const kk = cls + (_bf | 0), old = nav.grids[kk];
            if (old && old.key === key) return old;
            const r = cls === 'L' ? 2.3 : 0.9;
            const free = new Uint8Array(NAV_N * NAV_N);
            for (let j = 0; j < NAV_N; j++) for (let i = 0; i < NAV_N; i++) {
                const x = navCenter(i), z = navCenter(j);
                free[j * NAV_N + i] = (Math.abs(x) < NAV_LIMIT && Math.abs(z) < NAV_LIMIT && !blocked(x, z, r)) ? 1 : 0;
            }
            return nav.grids[kk] = { key, free, dist: new Int16Array(NAV_N * NAV_N), queue: new Int32Array(NAV_N * NAV_N), ti: -1, tj: -1, ok: false };
        }
        function navField(cls, px, pz) {
            const g = navGrid(cls), N = NAV_N;
            const pi = navCell(px), pj = navCell(pz);
            if (g.ti === pi && g.tj === pj) return g;
            g.ti = pi; g.tj = pj; g.ok = false;
            // célula-alvo livre mais próxima do jogador (ele pode estar colado numa parede)
            let start = -1;
            for (let rad = 0; rad <= 4 && start < 0; rad++) {
                let bd = 1e9;
                for (let dj = -rad; dj <= rad; dj++) for (let di = -rad; di <= rad; di++) {
                    const i = pi + di, j = pj + dj;
                    if (i < 0 || j < 0 || i >= N || j >= N || !g.free[j * N + i]) continue;
                    const d = di * di + dj * dj;
                    if (d < bd) { bd = d; start = j * N + i; }
                }
            }
            if (start < 0) return g;
            const dist = g.dist, q = g.queue, free = g.free;
            dist.fill(NAV_INF);
            let qh = 0, qt = 0;
            q[qt++] = start; dist[start] = 0;
            while (qh < qt) {
                const c = q[qh++], ci = c % N, cj = (c / N) | 0, nd = dist[c] + 1;
                for (let k = 0; k < 8; k++) {
                    const ni = ci + NAV_DI[k], nj = cj + NAV_DJ[k];
                    if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
                    const n = nj * N + ni;
                    if (!free[n] || dist[n] !== NAV_INF) continue;
                    if (k >= 4 && (!free[cj * N + ni] || !free[nj * N + ci])) continue; // sem cortar quina
                    dist[n] = nd; q[qt++] = n;
                }
            }
            g.ok = true;
            return g;
        }
        function clearLine(x0, z0, x1, z1, r) {
            const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
            const n = Math.ceil(len / 1.0);
            for (let s = 1; s < n; s++) {
                const t = s / n;
                if (blocked(x0 + dx * t, z0 + dz * t, r)) return false;
            }
            return true;
        }
        // devolve um ponto intermediário (waypoint) ou null = caminho livre, ir direto ao jogador
        function computeNavTarget(e, px, pz) {
            const p = e.mesh.position, r = e.isBoss ? 2.2 : 0.8;
            if (clearLine(p.x, p.z, px, pz, r)) return null;
            const g = navField(e.isBoss ? 'L' : 'S', px, pz);
            if (!g.ok) return null;
            const N = NAV_N, dist = g.dist, free = g.free;
            let cur = navCell(p.z) * N + navCell(p.x);
            if (dist[cur] === NAV_INF) { // galinha dentro da margem de uma parede: pega o vizinho alcançável
                const ci = cur % N, cj = (cur / N) | 0; let bd = NAV_INF, bn = -1;
                for (let k = 0; k < 8; k++) {
                    const ni = ci + NAV_DI[k], nj = cj + NAV_DJ[k];
                    if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
                    const n = nj * N + ni;
                    if (dist[n] < bd) { bd = dist[n]; bn = n; }
                }
                if (bn < 0) return null;
                cur = bn;
            }
            let best = null, firstStep = null;
            for (let step = 0; step < 12 && dist[cur] > 0; step++) {
                const ci = cur % N, cj = (cur / N) | 0; let bd = dist[cur], bn = -1;
                for (let k = 0; k < 8; k++) {
                    const ni = ci + NAV_DI[k], nj = cj + NAV_DJ[k];
                    if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
                    const n = nj * N + ni;
                    if (dist[n] >= bd) continue;
                    if (k >= 4 && (!free[cj * N + ni] || !free[nj * N + ci])) continue;
                    bd = dist[n]; bn = n;
                }
                if (bn < 0) break;
                cur = bn;
                const wx = navCenter(cur % N), wz = navCenter((cur / N) | 0);
                if (!firstStep) firstStep = { x: wx, z: wz };
                if (clearLine(p.x, p.z, wx, wz, r)) best = { x: wx, z: wz };
                else if (best) break;
            }
            if (dist[cur] === 0 && !best && clearLine(p.x, p.z, px, pz, r)) return null;
            return best || firstStep;
        }
        var _bf = 0;
        function enemyNavTarget(e, px, pz) {
            const p = e.mesh.position;
            // reavalia a rota a cada poucos frames (escalonado) ou ao chegar no waypoint
            if (e.navId === undefined) e.navId = nav.seq++;
            const reached = e.navT && Math.hypot(e.navT.x - p.x, e.navT.z - p.z) < 0.7;
            if (e.navT === undefined || reached || (nav.frame + e.navId) % 6 === 0) { _bf = e.fl | 0; e.navT = computeNavTarget(e, px, pz); _bf = 0; }
            return e.navT;
        }
        function showDodgeText() {
            const now = performance.now();
            if (now - lastDodgeText < 350) return;
            lastDodgeText = now;
            const el = document.createElement('div');
            el.className = 'absolute left-1/2 top-1/2 text-2xl font-bold damage-number text-cyan-300';
            el.innerText = 'ESQUIVOU!';
            document.getElementById('damage-numbers-container').appendChild(el);
            setTimeout(() => el.remove(), 600);
        }

        // ---- util visual ----
        function makeLabel(l1, l2, col) {
            const c = document.createElement('canvas'); c.width = 512; c.height = 160;
            const x = c.getContext('2d');
            x.fillStyle = 'rgba(0,0,0,0.7)'; x.fillRect(0, 0, 512, 160);
            x.strokeStyle = col; x.lineWidth = 6; x.strokeRect(3, 3, 506, 154);
            x.textAlign = 'center';
            x.fillStyle = '#ffffff'; x.font = 'bold 30px monospace'; x.fillText(l1, 256, 64);
            x.fillStyle = col; x.font = 'bold 34px monospace'; x.fillText(l2, 256, 120);
            const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, fog: false }));
            spr.scale.set(8, 2.5, 1);
            return spr;
        }
        function relabel(parent, old, l1, l2, col) {
            const pos = old.position.clone();
            parent.remove(old);
            const n = makeLabel(l1, l2, col);
            n.position.copy(pos); parent.add(n);
            return n;
        }
        function createNpc(bodyHex, hatHex, sc) {
            const m = createZombieChickenMesh("ancient");
            m.traverse(o => {
                if (o.isMesh && o.material && o.material.color) {
                    const h = o.material.color.getHex();
                    if (h === 0x22c55e) o.material.color.setHex(bodyHex);
                    else if (h === 0xef4444) o.material.color.setHex(0x111111);
                }
            });
            const hm = new THREE.MeshLambertMaterial({ color: hatHex });
            const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.5, 10), hm);
            hat.position.set(0, 1.95, -0.38); m.add(hat);
            const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 12), hm);
            brim.position.set(0, 1.7, -0.38); m.add(brim);
            m.scale.set(sc, sc, sc);
            return m;
        }
        function questTag(q) {
            const st = gameState.quests[q.id] || 0, p = q.prog();
            if (st === 2) return ['✔ Concluída', '#4ade80'];
            if (p >= q.goal) return ['✅ Receber recompensa!', '#facc15'];
            if (st === 1) return ['⏳ ' + Math.min(p, q.goal) + '/' + q.goal, '#38bdf8'];
            return ['❗ Nova missão', '#fb923c'];
        }
        function relabelQuests() {
            hubStations.forEach(st => {
                if (st.type !== 'quest') return;
                const t = questTag(st.q);
                st.sprite = relabel(st.npc, st.sprite, st.q.npc, t[0], t[1]);
            });
        }

        // ===== HUB TEMPORAL =====
        function loadHub() {
            clearWorld();
            gameState.inHub = true;
            gameState.checkpoint = null;
            recalcStats();
            gameState.health = gameState.maxHealth;
            refillAllAmmo();
            gameState.shield = Math.max(gameState.shield, 50);

            scene.background = new THREE.Color(0x24566b);
            scene.fog = new THREE.FogExp2(0x24566b, 0.011);
            addObj(new THREE.AmbientLight(0xfff1d6, 0.75));
            const sun = new THREE.DirectionalLight(0xfff1d6, 0.8); sun.position.set(10, 60, 20); addObj(sun);

            const stone = new THREE.MeshLambertMaterial({ color: 0x8a7f6a });
            const dark = new THREE.MeshLambertMaterial({ color: 0x4f4636 });
            const wood = new THREE.MeshLambertMaterial({ color: 0x7c4a1e });
            const mk = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return addObj(m); };

            mk(new THREE.CylinderGeometry(32, 32, 1, 48), stone, 0, -0.5, 0);
            mk(new THREE.CylinderGeometry(33, 33, 14, 48, 1, true), new THREE.MeshLambertMaterial({ color: 0x6b5f4a, side: THREE.DoubleSide }), 0, 7, 0);
            mk(new THREE.CylinderGeometry(9, 9, 0.15, 32), dark, 0, 0.07, 0);
            mk(new THREE.CylinderGeometry(3, 3.4, 1, 16), dark, 0, 0.5, 0);
            hubCrystal = mk(new THREE.OctahedronGeometry(1.5), new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 1 }), 0, 3.6, 0);
            const cl = new THREE.PointLight(0x22d3ee, 1.3, 28); cl.position.set(0, 4, 0); addObj(cl);
            colliders.push({ x: 0, z: 0, r: 3.4 });

            for (let i = 0; i < 12; i++) {
                const a = i / 12 * Math.PI * 2, x = Math.sin(a) * 31, z = Math.cos(a) * 31;
                mk(new THREE.BoxGeometry(0.5, 3, 0.5), wood, x, 1.5, z);
                mk(new THREE.BoxGeometry(0.7, 0.7, 0.7), new THREE.MeshBasicMaterial({ color: 0xfb923c }), x, 3.3, z);
                if (i % 6 === 0) { const l = new THREE.PointLight(0xfb923c, 1, 24); l.position.set(x * 0.93, 3.6, z * 0.93); addObj(l); }
            }

            // Portais (8 fases)
            EPOCHS.forEach((ep, i) => {
                if (ep.extra) return;
                const a = (i - 3.5) * 0.4;
                const x = Math.sin(a) * 23, z = -Math.cos(a) * 23;
                const unlocked = i < gameState.unlocked, done = gameState.completed[i];
                const col = unlocked ? (done ? 0x22c55e : HUB_COLORS[i]) : 0x7f1d1d;
                const css = '#' + col.toString(16).padStart(6, '0');
                const g = new THREE.Group();
                g.position.set(x, 0, z); g.lookAt(0, 0, 0);
                const plate = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.2, 3), dark); plate.position.y = 0.1; g.add(plate);
                const torus = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.28, 10, 32), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: unlocked ? 0.9 : 0.25 }));
                torus.position.y = 3.4; g.add(torus);
                const disc = new THREE.Mesh(new THREE.CircleGeometry(1.95, 32), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: unlocked ? 0.6 : 0.35, side: THREE.DoubleSide }));
                disc.position.y = 3.4; g.add(disc);
                const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.07, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                ring.position.y = 3.4; ring.visible = unlocked; g.add(ring);
                const lbl = makeLabel(ep.name, !unlocked ? '🔒 BLOQUEADO' : (done ? '✔ COMPLETA' : '▶ ENTRAR'), css);
                lbl.position.y = 6.6; g.add(lbl);
                if (unlocked && i % 2 === 0) { const pl = new THREE.PointLight(col, 1.1, 16); pl.position.set(0, 3.4, 2); g.add(pl); }
                addObj(g);
                hubPortals.push({ i, x, z, disc, ring });
            });

            // Loja do Cacareco
            const placeBooth = (bx, bz, build) => {
                const booth = new THREE.Group();
                booth.position.set(bx, 0, bz); booth.lookAt(0, 0, 0);
                build(booth);
                addObj(booth);
                colliders.push({ x: bx, z: bz, r: 3.2 });
                const dl = Math.hypot(bx, bz);
                return { booth, dx: -bx / dl, dz: -bz / dl };
            };
            const part = (grp, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); grp.add(m); return m; };

            let shopLabel;
            const sb = placeBooth(-23, 8, b => {
                part(b, new THREE.BoxGeometry(6, 1.2, 1.6), wood, 0, 0.6, 1.2);
                part(b, new THREE.BoxGeometry(7.5, 0.3, 4.5), new THREE.MeshLambertMaterial({ color: 0xdc2626 }), 0, 3.6, 0.2);
                part(b, new THREE.BoxGeometry(0.3, 3.6, 0.3), wood, -3.4, 1.8, 2.2);
                part(b, new THREE.BoxGeometry(0.3, 3.6, 0.3), wood, 3.4, 1.8, 2.2);
                part(b, new THREE.BoxGeometry(1.2, 1.2, 1.2), wood, -2, 0.6, -1.8);
                shopLabel = makeLabel('🛒 LOJA DO CACARECO', 'Armas e Ships [E]', '#fbbf24');
                shopLabel.position.set(0, 5.4, 1); b.add(shopLabel);
            });
            const merchant = createNpc(0xfff7ed, 0x1f2937, 1.5);
            merchant.position.set(-23 - sb.dx * 0.9, 0, 8 - sb.dz * 0.9);
            addObj(merchant);
            hubStations.push({ type: 'shop', x: -23, z: 8, range: 8, label: 'Falar com o Cacareco (Loja)', npc: merchant });

            // Bigorna (bancada de armas)
            const ab = placeBooth(23, 8, b => {
                const metal = new THREE.MeshLambertMaterial({ color: 0x71717a });
                part(b, new THREE.BoxGeometry(2.4, 1.2, 1.6), new THREE.MeshLambertMaterial({ color: 0x3f3f46 }), 0, 0.6, 0);
                part(b, new THREE.BoxGeometry(3.4, 0.7, 1.4), metal, 0, 1.55, 0);
                const horn = part(b, new THREE.ConeGeometry(0.5, 1.2, 8), metal, 2.2, 1.55, 0); horn.rotation.z = -Math.PI / 2;
                part(b, new THREE.BoxGeometry(0.9, 0.2, 0.7), new THREE.MeshBasicMaterial({ color: 0xfb923c }), 0, 2, 0);
                const l = new THREE.PointLight(0xfb923c, 1, 12); l.position.set(0, 2.6, 0); b.add(l);
                const lb = makeLabel('🔨 BIGORNA', 'Melhore suas armas [E]', '#fb923c'); lb.position.set(0, 4.2, 0); b.add(lb);
            });
            hubStations.push({ type: 'anvil', x: 23, z: 8, range: 8, label: 'Usar a Bigorna' });

            // NPCs de missão
            QUESTS.forEach(q => {
                const npc = createNpc(q.color, 0x7e22ce, q.id === 'q5' ? 1.1 : 1.4);
                npc.position.set(q.x, 0, q.z);
                const t = questTag(q);
                const spr = makeLabel(q.npc, t[0], t[1]);
                spr.position.set(0, 3.2, 0); npc.add(spr);
                addObj(npc);
                colliders.push({ x: q.x, z: q.z, r: 1.2 });
                hubStations.push({ type: 'quest', x: q.x, z: q.z, range: 5, label: 'Falar com ' + q.npc, q, npc, sprite: spr });
            });

            playerObj.position.set(0, PLAYER_HEIGHT, 24);
            yaw = 0; pitch = 0; velocityY = 0; velX = 0; velZ = 0;
            playerObj.rotation.set(0, 0, 0); camera.rotation.set(0, 0, 0);
            updateHUD();
            saveProgress();
        }

        function nearestStation() {
            const p = playerObj.position;
            let best = null, bd = 1e9;
            hubStations.forEach(s => { const d = Math.hypot(p.x - s.x, p.z - s.z); if (d < s.range && d < bd) { best = s; bd = d; } });
            return best;
        }

        function updateHub() {
            const p = playerObj.position, t = performance.now() / 300;
            let hint = '';
            if (hubCrystal) { hubCrystal.rotation.y += 0.02; hubCrystal.position.y = 3.6 + Math.sin(t) * 0.25; }
            hubStations.forEach(s => {
                if (s.npc) { s.npc.position.y = Math.abs(Math.sin(t + s.x)) * 0.08; s.npc.lookAt(p.x, 0, p.z); s.npc.rotateY(Math.PI); }
            });
            for (const h of hubPortals) {
                h.ring.rotation.z += 0.04;
                h.disc.material.opacity = (h.i < gameState.unlocked ? 0.55 : 0.3) + Math.sin(t + h.i) * 0.12;
                const d = Math.hypot(p.x - h.x, p.z - h.z);
                if (d < 2.4) {
                    if (h.i < gameState.unlocked) { enterLevel(h.i); return; }
                    const n = Math.hypot(h.x, h.z);
                    p.x = h.x - h.x / n * 2.6; p.z = h.z - h.z / n * 2.6;
                    hint = '🔒 BLOQUEADO — derrote o chefe da fase anterior!';
                } else if (d < 7 && !hint) {
                    hint = h.i < gameState.unlocked ? 'Entre no portal: ' + EPOCHS[h.i].name : '🔒 ' + EPOCHS[h.i].name + ' — bloqueada';
                }
            }
            const st = nearestStation();
            if (st) hint = '[E] ' + st.label;
            const el = document.getElementById('hub-hint');
            el.innerText = hint;
            el.classList.toggle('hidden', !hint);
        }

        function interact() {
            if (!gameState.inHub) return;
            const st = nearestStation();
            if (!st) return;
            if (st.type === 'shop') { renderShop(); openModal('shop-modal'); }
            else if (st.type === 'anvil') { updateUpgradeUI(); openModal('upgrade-modal'); }
            else openNpc(st.q);
        }

        function enterLevel(i) {
            gameState.currentEpochIndex = i;
            refillAllAmmo();
            loadEpochLevel(i);
            setCheckpoint(0);
            audio.playPickup();
        }

        function completeLevel(i) {
            gameState.completed[i] = true;
            if (!EPOCHS[i].extra) gameState.unlocked = Math.max(gameState.unlocked, Math.min(i + 2, 8));
            const bonus = Math.round((25 + i * 10) * DIFFS[gameState.difficulty].fe);
            gameState.feathers += bonus; gameState.stats.feathers += bonus;
            gameState.checkpoint = null;
            updateHUD();
            saveProgress();
            return bonus;
        }

        // ===== FASES: mapa grande com zonas, portões, câmara secreta e itens de cura =====
        function mulberry(seed) {
            return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
        }
        function spawnZMin() {
            for (const g of gates) if (g.closed) return g.z + 4;
            return -76;
        }

        function makeChest() {
            const g = new THREE.Group();
            const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 1.1), new THREE.MeshLambertMaterial({ color: 0x92400e })); b.position.y = 0.5; g.add(b);
            const l = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.4, 1.2), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.8 })); l.position.y = 1.2; g.add(l);
            return g;
        }
        function makeHealMesh() {
            const g = new THREE.Group();
            const m = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8 });
            g.add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.3), m));
            g.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), m));
            const bg = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }));
            g.add(bg);
            return g;
        }

        function loadEpochLevel(index) {
            const epoch = EPOCHS[index];
            const rnd = mulberry(index * 7919 + 13);
            clearWorld();
            gameState.inHub = false;

            scene.background = new THREE.Color(epoch.skyColor);
            scene.fog = new THREE.FogExp2(epoch.fogColor, 0.015);
            addObj(new THREE.AmbientLight(0xffffff, 0.55));
            const sun = new THREE.DirectionalLight(0xffedd5, 0.85); sun.position.set(40, 80, 40); addObj(sun);

            const floor = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2 + 10, ARENA * 2 + 10), new THREE.MeshLambertMaterial({ color: epoch.floorColor }));
            floor.rotation.x = -Math.PI / 2;
            addObj(floor);

            const wallMat = new THREE.MeshLambertMaterial({ color: epoch.wallColor });
            const H = 12;
            const wb = (x, z, w, d, mat, opt) => {
                const m = new THREE.Mesh(new THREE.BoxGeometry(w, H, d), mat || wallMat);
                m.position.set(x, H / 2, z); addObj(m);
                const c = Object.assign({ box: true, minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 }, opt || {});
                colliders.push(c);
                return { m, c };
            };
            // paredes externas (visuais; o limite é feito pelo clamp)
            [
                { pos: [0, H / 2, -ARENA], size: [ARENA * 2 + 2, H, 2] }, { pos: [0, H / 2, ARENA], size: [ARENA * 2 + 2, H, 2] },
                { pos: [-ARENA, H / 2, 0], size: [2, H, ARENA * 2] }, { pos: [ARENA, H / 2, 0], size: [2, H, ARENA * 2] }
            ].forEach(cfg => { const w = new THREE.Mesh(new THREE.BoxGeometry(...cfg.size), wallMat); w.position.set(...cfg.pos); addObj(w); });

            // divisórias com portões: 2 áreas de combate + portão da arena do chefe
            const Z1 = 28, Z2 = -12, Z3 = -46;
            BOSS_TRIGGER = Z3 - 3;
            const zA = Math.ceil(epoch.enemiesToKill * 0.3), zB = Math.ceil(epoch.enemiesToKill * 0.35);
            ZONE_N = [zA, zB, epoch.enemiesToKill - zA - zB];
            const needs = [zA, zA + zB, epoch.enemiesToKill];
            [[Z1, rnd() < 0.5 ? -22 : 22], [Z2, 0], [Z3, 0]].forEach(([z, dx], k) => {
                if (k === 1) dx = (gates[0].doorX > 0 ? -22 : 22);
                const hw = k === 2 ? 8 : 6;
                const x0 = -ARENA + 1, x1 = ARENA - 1;
                wb((x0 + dx - hw) / 2, z, (dx - hw) - x0, 3);
                wb((dx + hw + x1) / 2, z, x1 - (dx + hw), 3);
                const name = k === 2 ? 'PORTÃO DO CHEFE' : 'PORTÃO ' + (k + 1);
                const mat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, emissive: 0xdc2626, emissiveIntensity: 0.6 });
                const grp = new THREE.Group(); grp.position.set(dx, 0, z);
                const gm = new THREE.Mesh(new THREE.BoxGeometry(hw * 2, 11, 2.4), mat); gm.position.y = 5.5; grp.add(gm);
                const spr = makeLabel(name, '🔒 0/' + ZONE_N[k], '#f87171'); spr.position.set(0, 8, 3); grp.add(spr);
                addObj(grp);
                const col = { box: true, minX: dx - hw, maxX: dx + hw, minZ: z - 1.5, maxZ: z + 1.5 };
                colliders.push(col);
                gates.push({ k, z, doorX: dx, need: needs[k], prev: k === 0 ? 0 : needs[k - 1], name, closed: true, opening: false, group: grp, mat, spr, col });
            });

            // paredes de cobertura
            const zr = [[Z1 + 10, ARENA - 12], [Z2 + 10, Z1 - 10], [Z3 + 13, Z2 - 10]];
            for (let k = 0; k < 15; k++) {
                const [zmin, zmax] = zr[k % 3];
                const x = -52 + rnd() * 104, z = zmin + rnd() * (zmax - zmin);
                if (k % 3 === 0 && Math.hypot(x, z - 60) < 16) continue;
                const len = 8 + rnd() * 8;
                if (rnd() < 0.5) wb(x, z, len, 3); else wb(x, z, 3, len);
            }
            // pilares
            for (let i = 0; i < 34; i++) {
                const a = i * 2.39996, r = 14 + ((i * 29) % 64);
                const x = Math.cos(a) * r, z = Math.sin(a) * r;
                if (Math.abs(x) > 54 || Math.abs(z) > ARENA - 8 || Math.hypot(x, z - 60) < 14 || Math.abs(z - Z1) < 9 || Math.abs(z - Z2) < 9 || z < Z3 + 8 || blocked(x, z, 4)) continue;
                const w = 3 + (i % 3) * 1.2;
                const p = new THREE.Mesh(new THREE.BoxGeometry(w, H, w), wallMat);
                p.position.set(x, H / 2, z); addObj(p);
                colliders.push({ x, z, r: w * 0.62 });
            }

            // ARENA DO CHEFE: área ampla e aberta, sem coberturas
            const af = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2, ARENA + Z3), new THREE.MeshLambertMaterial({ color: new THREE.Color(epoch.floorColor).offsetHSL(0, 0, 0.07) }));
            af.rotation.x = -Math.PI / 2; af.position.set(0, 0.03, (-ARENA + Z3) / 2); addObj(af);
            const arenaRing = new THREE.Mesh(new THREE.RingGeometry(12, 13.5, 48), new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
            arenaRing.rotation.x = -Math.PI / 2; arenaRing.position.set(0, 0.06, (-ARENA + Z3) / 2); addObj(arenaRing);
            const bl = new THREE.PointLight(0xff4422, 1.6, 70); bl.position.set(0, 8, (-ARENA + Z3) / 2); addObj(bl);
            [-70, 70].forEach(cx => [-54, -64, -74].forEach(cz => {
                const cm = new THREE.Mesh(new THREE.BoxGeometry(3, H, 3), wallMat); cm.position.set(cx, H / 2, cz); addObj(cm);
                colliders.push({ x: cx, z: cz, r: 1.9 });
            }));
            [-28, 28].forEach(hx => { const hm = makeHealMesh(); hm.position.set(hx, 0.9, -53); scene.add(hm); items.push({ mesh: hm, rotSpeed: 0.03, type: 'heal' }); });

            // câmara secreta
            const side = index % 2 ? 1 : -1, zc = [8, 55, -29][index % 3];
            wb(side * (ARENA - 9), zc - 8, 16, 3);
            wb(side * (ARENA - 9), zc + 8, 16, 3);
            wb(side * (ARENA - 17), zc - 5.5, 3, 5);
            wb(side * (ARENA - 17), zc + 5.5, 3, 5);
            const panelMat = new THREE.MeshLambertMaterial({ color: 0xcbb89a, emissive: 0x2a1500 });
            const pr = wb(side * (ARENA - 17), zc, 3, 6, panelMat);
            const sw = { mesh: pr.m, col: pr.c, hp: 4, x: side * (ARENA - 17), z: zc };
            pr.c.secret = sw; secretWalls.push(sw);
            const tl = new THREE.PointLight(0xffd27f, 1.3, 16); tl.position.set(side * (ARENA - 9), 4, zc); addObj(tl);
            const chest = makeChest(); chest.position.set(side * (ARENA - 8), 0, zc); scene.add(chest);
            items.push({ mesh: chest, rotSpeed: 0.02, type: 'loot', weapon: epoch.secretLoot });
            const hm0 = makeHealMesh(); hm0.position.set(side * (ARENA - 11), 0.9, zc + 4); scene.add(hm0);
            items.push({ mesh: hm0, rotSpeed: 0.03, type: 'heal' });

            // itens de cura espalhados
            for (let k = 0, tries = 0; k < 7 && tries < 80; tries++) {
                const [zmin, zmax] = zr[k % 3];
                const x = -60 + rnd() * 120, z = zmin + rnd() * (zmax - zmin);
                if (blocked(x, z, 2) || Math.hypot(x, z - 60) < 8) continue;
                const hm = makeHealMesh(); hm.position.set(x, 0.9, z); scene.add(hm);
                items.push({ mesh: hm, rotSpeed: 0.03, type: 'heal' });
                k++;
            }

            playerObj.position.set(0, PLAYER_HEIGHT, 60);
            yaw = 0; pitch = 0; velocityY = 0; velX = 0; velZ = 0;
            playerObj.rotation.set(0, 0, 0); camera.rotation.set(0, 0, 0);

            gameState.killsInEpoch = 0;
            gameState.bossSpawned = false;
            gameState.bossEntity = null;
            updateHUD();
            for (let i = 0; i < ZONE_N[0]; i++) spawnEnemy(epoch.chickenType, false, 0);
            toast('📍 ' + epoch.name + ' — elimine as ' + ZONE_N[0] + ' galinhas desta área para abrir o portão!');
        }

        function checkGates() {
            gates.forEach(g => {
                if (!g.closed) return;
                if (gameState.killsInEpoch >= g.need) {
                    g.closed = false; g.opening = true;
                    const i = colliders.indexOf(g.col); if (i >= 0) colliders.splice(i, 1);
                    g.mat.color.setHex(0x14532d); g.mat.emissive.setHex(0x22c55e);
                    audio.playExplosion();
                    setCheckpoint(g.k + 1);
                    if (g.k < 2) {
                        toast('🚪 PORTÃO ' + (g.k + 1) + ' ABERTO! ' + ZONE_N[g.k + 1] + ' galinhas na próxima área! 💾 Checkpoint salvo');
                        for (let n = 0; n < ZONE_N[g.k + 1]; n++) spawnEnemy(EPOCHS[gameState.currentEpochIndex].chickenType, false, g.k + 1);
                    } else {
                        toast('🚪 PORTÃO DO CHEFE ABERTO! Entre na arena para enfrentá-lo... 💾 Checkpoint salvo');
                    }
                } else {
                    g.spr = relabel(g.group, g.spr, g.name, '🔒 ' + Math.max(0, gameState.killsInEpoch - g.prev) + '/' + ZONE_N[g.k], '#f87171');
                }
            });
        }

        function hitSecret(sw) {
            if (sw.hp <= 0) return;
            sw.hp--;
            sw.mesh.material.emissive.setHex(0xff8800);
            setTimeout(() => { if (sw.hp > 0) sw.mesh.material.emissive.setHex(0x2a1500); }, 80);
            if (sw.hp <= 0) {
                scene.remove(sw.mesh);
                const i = colliders.indexOf(sw.col); if (i >= 0) colliders.splice(i, 1);
                createFeatherParticles(sw.mesh.position, 20);
                audio.playExplosion();
                gameState.stats.secrets++;
                saveProgress();
                toast('🧱 CÂMARA SECRETA ABERTA!');
            }
        }

        function updateLevel() {
            const p = playerObj.position;
            let hint = '';
            gates.forEach(g => {
                if (g.opening) { g.group.position.y -= 0.18; if (g.group.position.y < -12) { g.opening = false; g.group.visible = false; } }
                else if (g.closed && Math.hypot(p.x - g.doorX, p.z - g.z) < 16) hint = '🔒 ' + (g.k === 2 ? 'Portão do Chefe' : 'Portão ' + (g.k + 1)) + ': faltam ' + Math.max(0, g.need - gameState.killsInEpoch) + ' de ' + ZONE_N[g.k] + ' galinhas desta área';
            });
            if (!gameState.bossSpawned && gates.length === 3 && !gates[2].closed && p.z < BOSS_TRIGGER) {
                gameState.bossSpawned = true;
                spawnEnemy(EPOCHS[gameState.currentEpochIndex].chickenType, true, 3);
                toast('⚠️ O CHEFE DESPERTOU!');
            }
            secretWalls.forEach(s => { if (s.hp > 0 && Math.hypot(p.x - s.x, p.z - s.z) < 14) hint = '🧱 Parede rachada... atire nela!'; });
            const el = document.getElementById('hub-hint');
            el.innerText = hint;
            el.classList.toggle('hidden', !hint);
        }

        // ===== MUNIÇÃO POR ARMA =====
        function ammoCap(id) { return Math.round(WEAPONS[id].res * (1 + (gameState.upgrades.ammoLvl - 1) * 0.25)); }
        function ammoOf(id) {
            const st = gameState.ammoStore;
            if (!st[id]) st[id] = { mag: WEAPONS[id].mag, res: ammoCap(id) };
            return st[id];
        }
        function refillAllAmmo() {
            reload.on = false;
            gameState.ammoStore = {};
            Object.keys(WEAPONS).forEach(id => { if (gameState.weapons[id]) ammoOf(id); });
        }
        function updateAmmoHUD() {
            const el = document.getElementById('hud-ammo'), lb = document.getElementById('hud-ammo-label');
            if (!el || !lb) return;
            const st = ammoOf(gameState.currentWeapon), an = WEAPONS[gameState.currentWeapon].ammoName || 'MUNIÇÃO';
            if (reload.on) lb.innerText = 'RECARGA ' + Math.round(100 * (1 - reload.left / reload.total)) + '%';
            else lb.innerText = st.mag === 0 ? (st.res > 0 ? '[R] RECARREGAR' : 'SEM ' + an) : an;
            el.innerHTML = st.mag + '<span class="text-sm text-yellow-200"> / ' + st.res + '</span>';
            el.style.color = st.mag === 0 ? '#ef4444' : '';
        }
        function startReload() {
            if (gameState.inHub || reload.on || gameState.isDead || gameState.isPaused) return;
            const id = gameState.currentWeapon, st = ammoOf(id), w = WEAPONS[id];
            if (st.mag >= w.mag || st.res <= 0) return;
            reload.on = true; reload.id = id; reload.total = reload.left = w.reload;
            audio.playReload(0);
            updateAmmoHUD();
        }
        function updateReload(delta) {
            let ty = -0.24, rx = 0;
            if (reload.on) {
                reload.left -= delta * 1000;
                ty = -0.52; rx = -0.75; // arma abaixa e inclina durante a recarga
                if (reload.left <= 0) {
                    const st = ammoOf(reload.id), w = WEAPONS[reload.id];
                    const take = Math.min(w.mag - st.mag, st.res);
                    st.mag += take; st.res -= take;
                    reload.on = false;
                    audio.playReload(1);
                    updateHUD();
                } else updateAmmoHUD();
            }
            machineGunGroup.position.y = THREE.MathUtils.lerp(machineGunGroup.position.y, ty, 0.15);
            machineGunGroup.rotation.x = THREE.MathUtils.lerp(machineGunGroup.rotation.x, rx, 0.15);
        }
        function makeIconSprite(icon) {
            const c = document.createElement('canvas'); c.width = 128; c.height = 128;
            const x = c.getContext('2d'); x.textAlign = 'center'; x.textBaseline = 'middle';
            x.font = '84px sans-serif'; x.fillText(icon, 64, 70);
            const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, fog: false }));
            spr.scale.set(1.1, 1.1, 1);
            return spr;
        }
        function makeAmmoMesh(id) {
            const w = WEAPONS[id], g = new THREE.Group();
            g.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.4, roughness: 0.6 })));
            g.add(new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.14, 0.49), new THREE.MeshStandardMaterial({ color: w.ac, emissive: w.ac, emissiveIntensity: 0.9 })));
            const spr = makeIconSprite(w.icon); spr.position.y = 0.95; g.add(spr);
            return g;
        }
        // drop aleatório: tipo de munição sorteado entre as armas que o jogador possui
        function maybeDropAmmo(enemy) {
            if (gameState.inHub) return;
            const owned = Object.keys(WEAPONS).filter(id => gameState.weapons[id]);
            if (!owned.length) return;
            const n = enemy.isBoss ? 3 : (Math.random() < AMMO_DROP_CHANCE ? 1 : 0);
            for (let k = 0; k < n; k++) {
                const id = owned[Math.floor(Math.random() * owned.length)], w = WEAPONS[id];
                const amount = Math.max(1, Math.round(w.mag * (0.6 + Math.random() * 0.9)));
                const mesh = makeAmmoMesh(id), sp = enemy.isBoss ? 4 : 1.2;
                mesh.position.set(enemy.mesh.position.x + (Math.random() - 0.5) * sp, 0.6, enemy.mesh.position.z + (Math.random() - 0.5) * sp);
                scene.add(mesh);
                items.push({ mesh, rotSpeed: 0.04, type: 'ammo', weapon: id, amount });
            }
        }

        // ===== COMBATE =====
        function damageEnemy(enemy, dmg) {
            enemy.hp -= dmg;
            triggerHitmarker();
            spawnDamageNumber(dmg, dmg > 25);
            audio.playHit();
            createFeatherParticles(enemy.mesh.position, 4);
            if (enemy.isBoss) updateBossHPBar();
            if (enemy.hp > 0) return;
            const j = enemies.indexOf(enemy);
            if (j < 0) return;
            audio.playChickenCluck();
            spawnFeatherItem(enemy.mesh.position);
            maybeDropAmmo(enemy);
            scene.remove(enemy.mesh);
            enemies.splice(j, 1);
            gameState.killsInEpoch++;
            gameState.totalKills++;
            gameState.stats.kills++;
            if (hasShip('vampiro')) { gameState.health = Math.min(gameState.maxHealth, gameState.health + 2); updateHUD(); }
            checkGates();
            const epoch = EPOCHS[gameState.currentEpochIndex];
            if (enemy.isBoss) {
                audio.playExplosion();
                document.getElementById('boss-hud').classList.add('hidden');
                const bonus = completeLevel(gameState.currentEpochIndex);
                if (epoch.extra) showGameMessage("ERA EXTRA SUPERADA!", `O chefe da ${epoch.name} caiu! +${bonus} 🪶 de bônus. Volte à sala do HUB para entrar de novo ou escolher outro portal.`, "VOLTAR AO HUB");
                else if (gameState.currentEpochIndex === 7) showVictoryScreen();
                else showGameMessage("ERA SUPERADA!", `O chefe da ${epoch.name} foi derrotado! +${bonus} 🪶 de bônus. A próxima fase foi liberada no HUB.`, "VOLTAR AO HUB");
            }
        }
        function explode(b) {
            if (b.exploded) return;
            b.exploded = true;
            audio.playExplosion();
            createFeatherParticles(b.mesh.position, 14);
            recoilBlast(b.mesh.position, b.blastR, b.blastF, b.selfDmg);
            const R = b.radius;
            [...enemies].forEach(e => {
                const d = e.mesh.position.distanceTo(b.mesh.position);
                if (d < R) damageEnemy(e, b.damage * (1 - d / (R + 2)));
            });
        }

        function equipWeapon(id) {
            if (!gameState.weapons[id]) return;
            if (gameState.currentWeapon !== id) reload.on = false; // trocar de arma cancela a recarga
            gameState.currentWeapon = id;
            const w = WEAPONS[id], body = machineGunGroup.children[0], barrel = machineGunGroup.children[1];
            body.material.color.setHex(w.c);
            barrel.scale.set(w.b[0], w.b[1], w.b[2]);
            updateHUD();
        }
        function equipSlot(n) { const id = gameState.hotbar[n]; if (id) equipWeapon(id); }
        function giveWeapon(id) {
            gameState.weapons[id] = true;
            ammoOf(id); // arma nova já vem carregada
            if (!gameState.wLvl[id]) gameState.wLvl[id] = 1;
            const sl = gameState.hotbar.indexOf(null);
            if (sl >= 0) gameState.hotbar[sl] = id;
        }

        // ===== MODAIS =====
        function openModal(id) {
            if (activeModal || gameState.isPaused || gameState.isDead || gameState.isVictory || !gameState.isPlaying) return;
            activeModal = id;
            gameState.isUpgradeMenuOpen = true;
            document.exitPointerLock();
            document.getElementById(id).classList.remove('hidden');
        }
        function closeModal() {
            if (!activeModal) return;
            document.getElementById(activeModal).classList.add('hidden');
            activeModal = null;
            gameState.isUpgradeMenuOpen = false;
            requestPointerLock();
        }

        // ===== LOJA =====
        function renderShop() {
            document.getElementById('shop-feathers').innerText = gameState.feathers;
            document.getElementById('shop-items').innerHTML = SHOP.map(it => {
                const owned = (it.type === 'weapon' ? gameState.weapons : gameState.ships)[it.id];
                const can = gameState.feathers >= it.cost;
                return `<div class="bg-black/60 p-3 rounded-lg border border-amber-900/60 flex flex-col justify-between">
                    <div><h3 class="text-lg text-amber-400 font-bold">${it.icon} ${it.name}</h3>
                    ${it.type === 'weapon' ? wTag(it.id) : '<p class="text-xs text-cyan-400 uppercase">Ship</p>'}
                    <p class="text-sm text-gray-300 mt-1">${it.desc}</p></div>
                    <button onclick="buyShop('${it.id}')" ${owned || !can ? 'disabled' : ''} class="mt-3 py-2 px-4 bg-amber-800 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded border border-amber-400 transition">${owned ? '✔ ADQUIRIDO' : `Comprar (${it.cost} 🪶)`}</button></div>`;
            }).join('');
        }
        function buyShop(id) {
            const it = SHOP.find(x => x.id === id);
            if (!it) return;
            const isW = it.type === 'weapon';
            const bag = isW ? gameState.weapons : gameState.ships;
            if (bag[id] || gameState.feathers < it.cost) return;
            gameState.feathers -= it.cost;
            audio.playPickup();
            if (isW) { giveWeapon(id); equipWeapon(id); }
            else {
                bag[id] = true;
                if (gameState.shipsEquipped.length < gameState.perm.shipSlots) gameState.shipsEquipped.push(id);
                recalcStats();
            }
            updateHUD(); renderShop(); saveProgress();
        }

        // ===== BIGORNA =====
        const ANVIL_COST = [40, 80, 140, 220];
        function renderAnvil() {
            const el = document.getElementById('anvil-weapons');
            if (!el) return;
            el.innerHTML = Object.keys(WEAPONS).filter(id => gameState.weapons[id]).map(id => {
                const w = WEAPONS[id], lv = gameState.wLvl[id] || 1, max = lv >= 5, cost = ANVIL_COST[lv - 1];
                return `<div class="bg-black/60 p-3 rounded-lg border border-orange-900/60 flex flex-col justify-between">
                    <div><h3 class="text-lg text-orange-400 font-bold">${w.icon} ${w.name}</h3>${wTag(id)}
                    <p class="text-sm text-gray-300">Nível ${lv}/5 · Dano +${(lv - 1) * 25}%</p></div>
                    <button onclick="buyAnvil('${id}')" ${max || gameState.feathers < cost ? 'disabled' : ''} class="mt-3 py-2 px-4 bg-orange-800 hover:bg-orange-700 disabled:opacity-40 text-white font-bold rounded border border-orange-400">${max ? '★ NÍVEL MÁXIMO' : `Afiar (${cost} 🪶)`}</button></div>`;
            }).join('');
        }
        function buyAnvil(id) {
            const lv = gameState.wLvl[id] || 1;
            if (lv >= 5 || gameState.feathers < ANVIL_COST[lv - 1]) return;
            gameState.feathers -= ANVIL_COST[lv - 1];
            gameState.wLvl[id] = lv + 1;
            audio.playPickup();
            updateHUD(); updateUpgradeUI();
        }
        // ===== QUESTS / NPCs =====
        function openNpc(q) { currentQuest = q; renderNpc(); openModal('npc-modal'); }
        function renderNpc() {
            const q = currentQuest, st = gameState.quests[q.id] || 0, p = q.prog();
            let text, btn = null;
            if (st === 2) text = 'Obrigado, herói! Sua recompensa já é sua: <b class="text-emerald-300">' + q.reward + '</b>.';
            else if (p >= q.goal) { text = 'Você conseguiu! Recompensa: <b class="text-emerald-300">' + q.reward + '</b>'; btn = 'Receber recompensa'; }
            else if (st === 1) text = q.desc + '<br>Progresso: <b>' + Math.min(p, q.goal) + '/' + q.goal + '</b><br><span class="text-gray-400 text-base">Recompensa: ' + q.reward + '</span>';
            else { text = q.desc + '<br><span class="text-gray-400 text-base">Recompensa: ' + q.reward + '</span>'; btn = 'Aceitar missão'; }
            document.getElementById('npc-title').innerText = q.npc + ' — ' + q.title;
            document.getElementById('npc-text').innerHTML = text;
            const b = document.getElementById('npc-btn');
            b.classList.toggle('hidden', !btn);
            if (btn) b.innerText = btn;
        }
        function npcAction() {
            const q = currentQuest, st = gameState.quests[q.id] || 0;
            if (st !== 2 && q.prog() >= q.goal) {
                q.give(); gameState.quests[q.id] = 2;
                recalcStats(); gameState.health = gameState.maxHealth;
                audio.playPickup(); toast('🎁 Recompensa: ' + q.reward);
            } else if (st === 0) gameState.quests[q.id] = 1;
            saveProgress(); renderNpc(); relabelQuests(); updateHUD();
        }

        // ===== INVENTÁRIO / BUILD =====
        function invSlot(i) { invSel = i; renderInv(); }
        function invAssign(id) {
            const g = gameState, old = g.hotbar.indexOf(id);
            if (old >= 0 && old !== invSel) g.hotbar[old] = g.hotbar[invSel];
            g.hotbar[invSel] = id;
            equipWeapon(id); renderInv(); saveProgress();
        }
        function invShip(id) {
            const g = gameState, i = g.shipsEquipped.indexOf(id);
            if (i >= 0) g.shipsEquipped.splice(i, 1);
            else if (g.shipsEquipped.length < g.perm.shipSlots) g.shipsEquipped.push(id);
            else { toast('Slots de Ship cheios! Remova um primeiro.'); }
            recalcStats(); updateHUD(); renderInv(); saveProgress();
        }
        function useHeal() {
            const g = gameState;
            if (g.heals <= 0 || g.health >= g.maxHealth || g.isDead || g.inHub) return;
            g.heals--; g.health = Math.min(g.maxHealth, g.health + 40);
            audio.playPickup(); updateHUD(); toast('🍗 +40 de vida');
            if (activeModal === 'inv-modal') renderInv();
        }
        function renderInv() {
            const g = gameState;
            const sec = t => `<h3 class="text-amber-400 font-bold text-lg border-b border-amber-900 pb-1">${t}</h3>`;
            let h = sec('🔫 Barra de armas <span class="text-xs text-gray-400">(clique num slot e depois numa arma para montar o build)</span>');
            h += '<div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">' + g.hotbar.map((id, i) =>
                `<button onclick="invSlot(${i})" class="p-2 rounded border-2 text-sm ${i === invSel ? 'border-yellow-300 bg-yellow-900/30' : 'border-amber-900 bg-black/50'} text-white"><b>[${i + 1}]</b><br>${id ? WEAPONS[id].icon + ' ' + WEAPONS[id].name + '<br>' + wTag(id) + 'Lv ' + (g.wLvl[id] || 1) + '<br><span class="text-yellow-300">' + ammoOf(id).mag + ' / ' + ammoOf(id).res + '</span>' : '— vazio —'}</button>`).join('') + '</div>';
            h += '<div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">' + Object.keys(WEAPONS).map(id => g.weapons[id]
                ? `<button onclick="invAssign('${id}')" class="p-2 rounded border border-cyan-700 bg-black/50 text-sm text-cyan-200">${WEAPONS[id].icon} ${WEAPONS[id].name}${wTag(id)}</button>`
                : `<div class="p-2 rounded border border-zinc-800 text-sm text-zinc-600">🔒 ${WEAPONS[id].secret ? '??? (arma secreta)' : WEAPONS[id].name}</div>`).join('') + '</div>';
            h += sec(`🛰️ Ships equipados (${g.shipsEquipped.length}/${g.perm.shipSlots})`);
            const owned = SHOP.filter(it => it.type === 'ship' && g.ships[it.id]);
            h += '<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">' + (owned.length ? owned.map(it =>
                `<button onclick="invShip('${it.id}')" class="p-2 rounded border-2 text-left text-sm ${hasShip(it.id) ? 'border-emerald-400 bg-emerald-900/30' : 'border-zinc-700 bg-black/50'} text-white">${it.icon} <b>${it.name}</b> ${hasShip(it.id) ? '✔' : ''}<br><span class="text-gray-400">${it.desc}</span></button>`).join('') : '<p class="text-gray-500">Nenhum ship comprado ainda (Loja do Cacareco).</p>') + '</div>';
            h += sec('🎒 Itens') + `<p class="text-gray-200 mt-1">🍗 Item de cura: <b>${g.heals}/5</b> (tecla H: +40 de vida)</p>`;
            h += sec('⭐ Melhorias permanentes') + `<p class="text-gray-200 mt-1">❤️ +${g.perm.hp} vida · ⚡ +${Math.round(g.perm.speed * 100)}% velocidade · 💥 +${Math.round(g.perm.dmg * 100)}% dano · 🏃 Sprint · 🦘 Pulo duplo · 🛷 Deslize: ${hasSlide() ? 'SIM' : 'não'} · 💨 Air Dash: ${hasAirDash() ? 'SIM' : 'não'} · ⏳ Chicken Shift: ${hasChickenShift() ? 'SIM' : 'não'}</p>`;
            h += sec('📜 Missões') + QUESTS.map(q => { const st = g.quests[q.id] || 0; return `<p class="text-gray-300 text-sm mt-1">${st === 2 ? '✔' : st === 1 ? '⏳' : '❗'} <b>${q.title}</b> — ${Math.min(q.prog(), q.goal)}/${q.goal} (${q.reward})</p>`; }).join('');
            document.getElementById('inv-body').innerHTML = h;
        }
        // SPAWN DISTANTE DAS GALINHAS ZUMBIS (>25 UNIDADES DO PLAYER)
        function spawnEnemy(type, isBoss = false, zone = -1) {
            const epoch = EPOCHS[gameState.currentEpochIndex];
            let mesh;
            let hp = 35 + gameState.currentEpochIndex * 22;
            let speed = 0.08 + Math.random() * 0.03;

            if (isBoss) {
                mesh = createBossMesh(epoch.bossType);
                hp = 400 + gameState.currentEpochIndex * 250;
                speed = 0.065;
            } else {
                mesh = createZombieChickenMesh(type);
            }

            const D = DIFFS[gameState.difficulty]; hp = Math.round(hp * D.hp); speed *= D.spd;
            let spawnX, spawnZ, distToPlayer;
            let attempts = 0;
            do {
                if (zone >= 0) {
                    const zr = ZONE_Z[zone];
                    spawnX = zone === 3 ? -20 + Math.random() * 40 : -70 + Math.random() * 140;
                    spawnZ = zr[0] + Math.random() * (zr[1] - zr[0]);
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    const minDistance = isBoss ? 32 : 28;
                    const dist = minDistance + Math.random() * (50 - minDistance);
                    spawnX = Math.max(-76, Math.min(76, playerObj.position.x + Math.sin(angle) * dist));
                    spawnZ = Math.max(spawnZMin(), Math.min(76, playerObj.position.z + Math.cos(angle) * dist));
                }
                const dx = spawnX - playerObj.position.x;
                const dz = spawnZ - playerObj.position.z;
                distToPlayer = Math.sqrt(dx * dx + dz * dz);
                attempts++;
            } while ((distToPlayer < (zone >= 0 ? 14 : 25) || blocked(spawnX, spawnZ, 1.5)) && attempts < 60);

            mesh.position.set(spawnX, 0, spawnZ);
            scene.add(mesh);

            const enemyObj = {
                mesh: mesh,
                hp: hp,
                maxHp: hp,
                speed: speed,
                isBoss: isBoss,
                type: type,
                lastAttack: 0,
                lastRangedAttack: 0,
                bobTimer: Math.random() * 10
            };

            enemyObj.rs = 0; enemyObj.dur = isBoss ? 2000 : 1100; enemyObj.hh = isBoss ? 8 : 3.6; mesh.position.y = -enemyObj.hh;
            enemies.push(enemyObj);

            if (isBoss) {
                gameState.bossEntity = enemyObj;
                document.getElementById('boss-hud').classList.remove('hidden');
                document.getElementById('boss-name').innerText = `CHEFE: ${epoch.bossType.replace(/_/g, ' ').toUpperCase()}`;
                updateBossHPBar();
            }
        }

        function togglePause() {
            if (!gameState.isPlaying || gameState.isDead || gameState.isVictory || gameState.isUpgradeMenuOpen) return;

            gameState.isPaused = !gameState.isPaused;
            const pauseMenu = document.getElementById('pause-screen');

            if (gameState.isPaused) {
                document.exitPointerLock();
                pauseMenu.classList.remove('hidden');
                document.getElementById('btn-checkpoint').classList.toggle('hidden', !(gameState.checkpoint && !gameState.inHub));
                isShooting = false;
            } else {
                pauseMenu.classList.add('hidden');
                requestPointerLock();
            }
        }

        function setupInputListeners() {
            document.getElementById('btn-play-again').addEventListener('click', () => {
                gameState.isVictory = false;
                document.getElementById('victory-screen').classList.add('hidden');
                document.getElementById('hud').classList.remove('hidden');
                document.getElementById('crosshair-container').classList.remove('hidden');
                loadHub();
                gameState.isPlaying = true;
                requestPointerLock();
            });

            document.getElementById('btn-hub').addEventListener('click', () => {
                if (gameState.isPaused) togglePause();
                loadHub();
            });
            document.getElementById('btn-close-shop').addEventListener('click', closeModal);

            document.getElementById('btn-close-npc').addEventListener('click', closeModal);
            document.getElementById('btn-close-inv').addEventListener('click', closeModal);
            document.getElementById('npc-btn').addEventListener('click', npcAction);
            document.getElementById('btn-diff').addEventListener('click', () => setDifficulty((gameState.difficulty + 1) % DIFFS.length));

            document.getElementById('btn-resume').addEventListener('click', () => {
                togglePause();
            });

            document.getElementById('btn-restart').addEventListener('click', () => {
                saveProgress();
                location.reload();
            });
            document.getElementById('btn-checkpoint').addEventListener('click', () => {
                if (gameState.isPaused) togglePause();
                respawnAtCheckpoint();
            });

            document.getElementById('volume-slider').addEventListener('input', (e) => {
                audio.setMasterVolume(e.target.value);
            });

            document.addEventListener('keydown', (e) => {
                if (!gameState.isPlaying || gameState.isDead || gameState.isVictory) return;

                if (e.code === 'Escape' && gameState.isUpgradeMenuOpen) {
                    closeModal();
                    return;
                }
                if (e.code === 'Escape' || e.code === 'KeyP') {
                    togglePause();
                    return;
                }

                if (gameState.isPaused) return;

                switch (e.code) {
                    case 'KeyW': case 'ArrowUp': moveForward = true; break;
                    case 'KeyS': case 'ArrowDown': moveBackward = true; break;
                    case 'KeyA': case 'ArrowLeft': moveLeft = true; break;
                    case 'KeyD': case 'ArrowRight': moveRight = true; break;
                    case 'ShiftLeft': case 'ShiftRight': isSprinting = true; break;
                    case 'Space':
                        jumpHeld = true;
                        if (canJump && (isGrounded || !usedDouble) && !(SLIDE.active && underLow())) {
                            if (!isGrounded) usedDouble = true;
                            velocityY = 11.5;
                            isGrounded = false;
                            canJump = false;
                            audio.playJump();
                        }
                        break;
                    case 'KeyC': startSlide(); break;
                    case 'KeyQ': startAirDash(); break;
                    case 'KeyF': shiftTime(); break;
                    case 'KeyI':
                        if (activeModal === 'inv-modal') closeModal(); else if (!activeModal) { renderInv(); openModal('inv-modal'); }
                        break;
                    case 'KeyH': useHeal(); break;
                    case 'KeyR': startReload(); break;
                    case 'KeyE':
                        if (activeModal) closeModal(); else interact();
                        break;
                    case 'Digit1': equipSlot(0); break;
                    case 'Digit2': equipSlot(1); break;
                    case 'Digit3': equipSlot(2); break;
                    case 'Digit4': equipSlot(3); break;
                }
            });

            document.addEventListener('keyup', (e) => {
                switch (e.code) {
                    case 'KeyW': case 'ArrowUp': moveForward = false; break;
                    case 'KeyS': case 'ArrowDown': moveBackward = false; break;
                    case 'KeyA': case 'ArrowLeft': moveLeft = false; break;
                    case 'KeyD': case 'ArrowRight': moveRight = false; break;
                    case 'ShiftLeft': case 'ShiftRight': isSprinting = false; break;
                    case 'Space': canJump = true; jumpHeld = false; break;
                }
            });

            document.addEventListener('mousedown', (e) => {
                if (e.button === 0 && gameState.isPlaying && !gameState.isUpgradeMenuOpen && !gameState.isPaused && controlsEnabled) {
                    isShooting = true;
                }
            });

            document.addEventListener('mouseup', (e) => {
                if (e.button === 0) isShooting = false;
            });

            document.addEventListener('mousemove', (e) => {
                if (!controlsEnabled || gameState.isUpgradeMenuOpen || gameState.isPaused) return;

                const movementX = e.movementX || 0;
                const movementY = e.movementY || 0;

                yaw -= movementX * 0.0024;
                pitch -= movementY * 0.0024;

                pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, pitch));

                playerObj.rotation.y = yaw;
                camera.rotation.x = pitch;
            });

            document.addEventListener('pointerlockchange', () => {
                controlsEnabled = (document.pointerLockElement === document.body);
                // perdeu o mouse sem menu aberto (ESC no jogo, alt-tab...): abre o pause
                if (!document.pointerLockElement && wantsLock()) togglePause();
            });
            // se o navegador recusou travar o mouse (ESC não conta como gesto do usuário),
            // o próximo clique ou tecla trava o mouse e o jogo segue normalmente
            const relock = (e) => {
                if (e.type === 'keydown' && e.code === 'Escape') return;
                if (wantsLock() && document.pointerLockElement !== document.body) requestPointerLock();
            };
            document.addEventListener('mousedown', relock);
            document.addEventListener('keydown', relock);

            document.getElementById('btn-up-firerate').addEventListener('click', () => buyUpgrade('fireRate'));
            document.getElementById('btn-up-damage').addEventListener('click', () => buyUpgrade('damage'));
            document.getElementById('btn-up-ammo').addEventListener('click', () => buyUpgrade('ammo'));
            document.getElementById('btn-up-plasma').addEventListener('click', () => buyUpgrade('plasma'));
            document.getElementById('btn-close-upgrade').addEventListener('click', toggleUpgradeMenu);

            const closeMessage = toCp => {
                document.getElementById('game-message-screen').classList.add('hidden');
                msgCheckpoint = false;
                if (gameState.isDead) {
                    gameState.isDead = false;
                    gameState.health = gameState.maxHealth;
                    gameState.shield = 50;
                }
                if (toCp) respawnAtCheckpoint(); else loadHub();
                gameState.isPlaying = true;
                requestPointerLock();
            };
            document.getElementById('msg-btn').addEventListener('click', () => closeMessage(msgCheckpoint));
            document.getElementById('msg-btn2').addEventListener('click', () => closeMessage(false));
        }

        function wantsLock() {
            return gameState.isPlaying && !gameState.isPaused && !gameState.isDead && !gameState.isVictory &&
                !activeModal && !gameState.isUpgradeMenuOpen &&
                document.getElementById('game-message-screen').classList.contains('hidden');
        }

        function requestPointerLock() {
            try {
                const r = document.body.requestPointerLock();
                if (r && r.catch) r.catch(() => { if (wantsLock()) toast('🖱️ Clique na tela para travar o mouse'); });
            } catch (e) {}
        }

        function shootWeapon() {
            if (gameState.inHub) return;
            const id = gameState.currentWeapon, w = WEAPONS[id], now = performance.now();
            const fireInterval = w.interval / (1 + (gameState.upgrades.fireRateLvl - 1) * 0.4);
            if (reload.on || now - lastShootTime < fireInterval) return;
            const st = ammoOf(id);
            if (st.mag <= 0) {
                if (st.res > 0) startReload();
                else if (now - lastEmptyClick > 1200) {
                    lastEmptyClick = now; audio.playEmpty();
                    toast('❌ Sem munição de ' + w.name + ' — pegue drops ou troque de arma');
                }
                return;
            }

            lastShootTime = now;
            st.mag -= 1;
            updateHUD();
            audio.playShoot();

            muzzleFlashLight.intensity = 3.0;
            setTimeout(() => { muzzleFlashLight.intensity = 0; }, 40);
            machineGunGroup.position.z = -0.3;

            const dmg = 18 * w.dmg * (1 + (gameState.upgrades.damageLvl - 1) * 0.5) * (hasShip('furia') ? 1.3 : 1) * (1 + gameState.perm.dmg) * (1 + 0.25 * ((gameState.wLvl[id] || 1) - 1));
            if ((id === 'mg' || id === 'pistol') && gameState.upgrades.hasPlasma) { [-0.08, 0, 0.08].forEach(a => createBullet(a, dmg, 'plasma')); return; }
            const n = w.n || 1, sp = w.spread || 0;
            for (let i = 0; i < n; i++) createBullet((Math.random() - 0.5) * sp, dmg, w.bul, (Math.random() - 0.5) * sp * 0.5);
        }

        function createBullet(yawOff, damage, kind, pitchOff = 0) {
            const cfg = {
                mg: { geo: new THREE.CylinderGeometry(0.04, 0.04, 0.6, 4), color: 0xfacc15, speed: 2.0, life: 70, orient: true },
                plasma: { geo: new THREE.SphereGeometry(0.22, 8, 8), color: 0xc084fc, speed: 1.4, life: 70 },
                shell: { geo: new THREE.SphereGeometry(0.1, 6, 6), color: 0xfb923c, speed: 1.6, life: 30 },
                pistol: { geo: new THREE.CylinderGeometry(0.035, 0.035, 0.45, 4), color: 0xe5e7eb, speed: 2.2, life: 70, orient: true },
                spear: { geo: new THREE.CylinderGeometry(0.06, 0.06, 3.2, 6), color: 0xd97706, speed: 2.4, life: 55, orient: true, pierce: true },
                alien: { geo: new THREE.OctahedronGeometry(0.28), color: 0x4ade80, speed: 2.3, life: 60, pierce: true },
                chicken: { geo: new THREE.SphereGeometry(0.5, 10, 10), color: 0xfde047, speed: 1.0, life: 60, splash: true, radius: 7, blastR: 6.5, blastF: 27, selfDmg: 8 },
                rocket: { geo: new THREE.CylinderGeometry(0.12, 0.12, 0.9, 6), color: 0xef4444, speed: 1.3, life: 80, orient: true, splash: true, radius: 5.5, blastR: 5.5, blastF: 30, selfDmg: 10 },
                grenade: { geo: new THREE.SphereGeometry(0.22, 8, 8), color: 0x84cc16, speed: 0.8, life: 34, splash: true, grav: 0.012, bounce: true, radius: 5, blastR: 5, blastF: 25, selfDmg: 8 },
                slash: { geo: new THREE.BoxGeometry(2.4, 0.12, 0.35), color: 0x818cf8, speed: 1.5, life: 13, pierce: true, face: true },
                eye: { geo: new THREE.SphereGeometry(0.45, 10, 10), color: 0xe879f9, speed: 2.6, life: 65, pierce: true }
            }[kind];
            const mesh = new THREE.Mesh(cfg.geo, new THREE.MeshBasicMaterial({ color: cfg.color }));
            const dir = new THREE.Vector3();
            camera.getWorldDirection(dir);
            dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawOff);
            dir.y += pitchOff;
            dir.normalize();
            mesh.position.copy(playerObj.position);
            mesh.position.y += 0.1;
            if (cfg.orient) mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            if (cfg.face) mesh.rotation.y = Math.atan2(dir.x, dir.z);
            scene.add(mesh);
            bullets.push({ mesh, dir, speed: cfg.speed, life: cfg.life, damage, pierce: !!cfg.pierce, splash: !!cfg.splash, radius: cfg.radius || 7, blastR: cfg.blastR || 0, blastF: cfg.blastF || 0, selfDmg: cfg.selfDmg || 0, grav: cfg.grav || 0, bounce: !!cfg.bounce, hit: new Set() });
        }

        function fireBossProjectile(fromPos, targetPos) {
            const projGeo = new THREE.SphereGeometry(0.4, 8, 8);
            const projMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const projMesh = new THREE.Mesh(projGeo, projMat);

            projMesh.position.copy(fromPos);
            projMesh.position.y += 1.5;

            const dir = new THREE.Vector3().subVectors(targetPos, projMesh.position).normalize();

            scene.add(projMesh);

            enemyProjectiles.push({
                mesh: projMesh,
                dir: dir,
                speed: 0.55,
                life: 90,
                damage: 22
            });
        }

        function triggerHitmarker() {
            const hm = document.getElementById('hitmarker');
            hm.style.opacity = '1';
            setTimeout(() => { hm.style.opacity = '0'; }, 80);
        }

        function spawnDamageNumber(amount, isCrit = false) {
            const container = document.getElementById('damage-numbers-container');
            const el = document.createElement('div');
            el.className = `absolute left-1/2 top-1/2 text-2xl font-bold damage-number ${isCrit ? 'text-yellow-400 text-3xl' : 'text-red-500'}`;
            el.innerText = `-${Math.round(amount)}`;
            container.appendChild(el);
            setTimeout(() => el.remove(), 600);
        }

        // ===== ANIMAÇÃO DE SURGIMENTO: zumbis emergem da terra tremendo, com partículas de terra =====
        const DIRT_G = new THREE.BoxGeometry(1, 1, 1), DIRT_M = [0x5a3d22, 0x6b4a2b, 0x3f2a17].map(c => new THREE.MeshLambertMaterial({ color: c }));
        function dirtBurst(x, z, n, spread, y0 = 0) {
            for (let i = 0; i < n; i++) {
                const m = new THREE.Mesh(DIRT_G, DIRT_M[Math.floor(Math.random() * 3)]), sz = 0.1 + Math.random() * 0.18, a = Math.random() * Math.PI * 2, r = Math.random() * 0.5, sp = (0.05 + Math.random() * 0.12) * spread;
                m.scale.set(sz, sz, sz); m.position.set(x + Math.cos(a) * r, y0 + 0.1, z + Math.sin(a) * r); m.rotation.set(Math.random() * 3, Math.random() * 3, 0); scene.add(m);
                particles.push({ mesh: m, vel: new THREE.Vector3(Math.cos(a) * sp, 0.12 + Math.random() * 0.16, Math.sin(a) * sp), g: 0.012, y0, life: 45 + Math.random() * 20 });
            }
        }
        function riseEnemy(e) {
            const now = performance.now(), p = e.mesh.position;
            if (!e.st) {
                e.st = 1; e.t0 = now; e.bx = p.x; e.bz = p.z; e.lt = 0;
                e.mesh.lookAt(playerObj.position.x, p.y, playerObj.position.z); e.mesh.rotateY(Math.PI);
                const d = new THREE.Mesh(new THREE.CircleGeometry(e.isBoss ? 3.2 : 1.5, 14), new THREE.MeshBasicMaterial({ color: 0x2b1a0c, transparent: true, opacity: 0.85 }));
                d.rotation.x = -Math.PI / 2; d.position.set(e.bx, (e.yb || 0) + 0.05, e.bz); scene.add(d); particles.push({ mesh: d, vel: new THREE.Vector3(), life: 90 });
                dirtBurst(e.bx, e.bz, e.isBoss ? 26 : 12, 1.3, e.yb || 0);
            }
            const t = Math.min(1, (now - e.t0) / e.dur), k = t * t * (3 - 2 * t), amp = (e.isBoss ? 0.35 : 0.22) * (1 - t);
            p.x = e.bx + (Math.random() - 0.5) * amp * 2; p.z = e.bz + (Math.random() - 0.5) * amp * 2; p.y = (e.yb || 0) - e.hh * (1 - k);
            if (now - e.lt > 90) { e.lt = now; dirtBurst(e.bx, e.bz, e.isBoss ? 3 : 2, 0.5, e.yb || 0); }
            if (t >= 1) { p.x = e.bx; p.z = e.bz; p.y = e.yb || 0; e.rs = 1; dirtBurst(e.bx, e.bz, e.isBoss ? 14 : 6, 1, e.yb || 0); }
        }

        function createFeatherParticles(pos, count = 5) {
            for (let i = 0; i < count; i++) {
                const geo = new THREE.BoxGeometry(0.12, 0.22, 0.06);
                const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
                const feather = new THREE.Mesh(geo, mat);

                feather.position.copy(pos);
                feather.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

                scene.add(feather);

                particles.push({
                    mesh: feather,
                    vel: new THREE.Vector3((Math.random() - 0.5) * 0.2, Math.random() * 0.2 + 0.1, (Math.random() - 0.5) * 0.2),
                    life: 30
                });
            }
        }

        function spawnFeatherItem(pos) {
            const geo = new THREE.BoxGeometry(0.35, 0.55, 0.12);
            const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
            const itemMesh = new THREE.Mesh(geo, mat);
            itemMesh.position.copy(pos);
            itemMesh.position.y = 0.5;

            scene.add(itemMesh);
            items.push({ mesh: itemMesh, rotSpeed: 0.06 });
        }

        function toggleUpgradeMenu() { closeModal(); }

        function updateUpgradeUI() {
            saveProgress();
            renderAnvil();
            document.getElementById('upgrade-feathers-count').innerText = gameState.feathers;
            document.getElementById('lvl-firerate').innerText = gameState.upgrades.fireRateLvl;
            document.getElementById('lvl-damage').innerText = gameState.upgrades.damageLvl;
            document.getElementById('lvl-ammo').innerText = gameState.upgrades.ammoLvl;
            document.getElementById('lvl-plasma').innerText = gameState.upgrades.hasPlasma ? "ATIVADO ⚡" : "Inativo";

            const costFirerate = gameState.upgrades.fireRateLvl * 20;
            const costDamage = gameState.upgrades.damageLvl * 25;
            const costAmmo = gameState.upgrades.ammoLvl * 15;
            const costPlasma = 50;

            document.getElementById('cost-firerate').innerText = costFirerate;
            document.getElementById('cost-damage').innerText = costDamage;
            document.getElementById('cost-ammo').innerText = costAmmo;

            document.getElementById('btn-up-firerate').disabled = gameState.feathers < costFirerate;
            document.getElementById('btn-up-damage').disabled = gameState.feathers < costDamage;
            document.getElementById('btn-up-ammo').disabled = gameState.feathers < costAmmo;
            document.getElementById('btn-up-plasma').disabled = gameState.feathers < costPlasma || gameState.upgrades.hasPlasma;
        }

        function buyUpgrade(type) {
            audio.playPickup();

            if (type === 'fireRate') {
                const cost = gameState.upgrades.fireRateLvl * 20;
                if (gameState.feathers >= cost) {
                    gameState.feathers -= cost;
                    gameState.upgrades.fireRateLvl++;
                }
            } else if (type === 'damage') {
                const cost = gameState.upgrades.damageLvl * 25;
                if (gameState.feathers >= cost) {
                    gameState.feathers -= cost;
                    gameState.upgrades.damageLvl++;
                }
            } else if (type === 'ammo') {
                const cost = gameState.upgrades.ammoLvl * 15;
                if (gameState.feathers >= cost) {
                    gameState.feathers -= cost;
                    gameState.upgrades.ammoLvl++;
                    refillAllAmmo(); // novo teto de reserva + tudo reabastecido
                    gameState.shield = Math.min(100, gameState.shield + 50);
                }
            } else if (type === 'plasma') {
                if (gameState.feathers >= 50 && !gameState.upgrades.hasPlasma) {
                    gameState.feathers -= 50;
                    gameState.upgrades.hasPlasma = true;
                }
            }

            updateHUD();
            updateUpgradeUI();
        }

        function updateHUD() {
            document.getElementById('hud-health').innerText = Math.max(0, Math.floor(gameState.health));
            document.getElementById('hud-shield').innerText = Math.max(0, Math.floor(gameState.shield));
            updateAmmoHUD();
            document.getElementById('hud-feathers').innerText = gameState.feathers;
            document.getElementById('hud-epoch').innerText = gameState.inHub ? '🏛️ HUB TEMPORAL' : EPOCHS[gameState.currentEpochIndex].name;
            document.getElementById('hud-hint').innerText = `${WEAPONS[gameState.currentWeapon].icon} ${WEAPONS[gameState.currentWeapon].name} [${wTagTxt(gameState.currentWeapon)}] Lv${gameState.wLvl[gameState.currentWeapon] || 1} | [1-4] Armas | [R] Recarregar | [E] Interagir | [I] Inventário | [H] 🍗${gameState.heals}`;
        }

        function updateBossHPBar() {
            if (gameState.bossEntity) {
                const pct = Math.max(0, (gameState.bossEntity.hp / gameState.bossEntity.maxHp) * 100);
                document.getElementById('boss-hp-bar').style.width = `${pct}%`;
            }
        }

        function triggerDamageFlash() {
            const flash = document.getElementById('damage-flash');
            flash.style.opacity = '1';
            setTimeout(() => { flash.style.opacity = '0'; }, 120);
        }

        function applyPlayerDamage(amount) {
            if (gameState.inHub) return;
            if (hasShip('escudo')) amount *= 0.75;
            amount *= DIFFS[gameState.difficulty].dmg;
            if (DASH.active) return;
            if (SLIDE.active) amount *= SLIDE.dmgMul;
            if (gameState.isDead || gameState.isVictory) return;

            audio.playPlayerDamage();
            triggerDamageFlash();

            if (gameState.shield > 0) {
                const shieldAbsorb = Math.min(gameState.shield, amount * 0.7);
                gameState.shield -= shieldAbsorb;
                amount -= shieldAbsorb;
            }

            gameState.health -= amount;
            updateHUD();

            if (gameState.health <= 0) {
                gameState.isDead = true;
                if (gameState.checkpoint) showGameMessage("VOCÊ FOI DESTRUIDO!", "As galinhas zumbis dominaram o contínuo espaço-tempo.", "📍 RENASCER NO CHECKPOINT", "🏛️ VOLTAR AO HUB");
                else showGameMessage("VOCÊ FOI DESTRUIDO!", "As galinhas zumbis dominaram o contínuo espaço-tempo.", "RENASCER NO HUB");
            }
        }

        function showGameMessage(title, desc, btnText, altText) {
            document.exitPointerLock();
            gameState.isPlaying = false;
            msgCheckpoint = !!altText;
            const b2 = document.getElementById('msg-btn2');
            b2.innerText = altText || ''; b2.classList.toggle('hidden', !altText);

            document.getElementById('msg-title').innerText = title;
            document.getElementById('msg-desc').innerText = desc;
            document.getElementById('msg-btn').innerText = btnText;

            document.getElementById('game-message-screen').classList.remove('hidden');
        }

        function showVictoryScreen() {
            document.exitPointerLock();
            gameState.isPlaying = false;
            gameState.isVictory = true;

            const elapsedTimeMs = performance.now() - gameState.startTime;
            const secondsTotal = Math.floor(elapsedTimeMs / 1000);
            const mins = Math.floor(secondsTotal / 60).toString().padStart(2, '0');
            const secs = (secondsTotal % 60).toString().padStart(2, '0');

            const score = (gameState.totalKills * 150) + (gameState.feathers * 50) + Math.max(0, 10000 - secondsTotal * 10);

            document.getElementById('victory-kills').innerText = gameState.totalKills;
            document.getElementById('victory-time').innerText = `${mins}:${secs}`;
            document.getElementById('victory-feathers').innerText = gameState.feathers;
            document.getElementById('victory-score').innerText = score;

            document.getElementById('victory-screen').classList.remove('hidden');
            document.getElementById('hud').classList.add('hidden');
            document.getElementById('boss-hud').classList.add('hidden');
            document.getElementById('crosshair-container').classList.add('hidden');
        }

        function animate() {
            requestAnimationFrame(animate);

            const time = performance.now();
            const delta = Math.min((time - prevTime) / 1000, 0.1);
            prevTime = time;

            if (gameState.isPlaying && !gameState.isUpgradeMenuOpen && !gameState.isPaused) {

                // 1. MOVIMENTAÇÃO 360° DO JOGADOR
                const moveSpeed = (isSprinting ? 18.0 : 11.5) * (hasShip('vento') ? 1.25 : 1) * (1 + gameState.perm.speed);

                const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
                const rightDir = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

                const moveVector = new THREE.Vector3(0, 0, 0);

                if (moveForward) moveVector.add(forwardDir);
                if (moveBackward) moveVector.sub(forwardDir);
                if (moveRight) moveVector.add(rightDir);
                if (moveLeft) moveVector.sub(rightDir);

                // Direção desejada (wishdir) normalizada
                const wishDir = moveVector.clone();
                const hasWish = wishDir.lengthSq() > 0;
                if (hasWish) wishDir.normalize();

                // B-HOP: segurando ESPAÇO, pula de novo no instante em que toca o chão.
                // Como não passa nenhum frame no chão, o atrito não é aplicado e a velocidade se mantém.
                if (jumpHeld && isGrounded && !(SLIDE.active && underLow())) {
                    canJump = false;
                    velocityY = 11.5;
                    isGrounded = false;
                    audio.playJump();
                }

                // DESLIZE: impulso que decai com atrito; dá para curvar levemente. Termina ao acabar o tempo
                // (mas só se não estiver sob uma passagem baixa), ao pular ou ao cair.
                DASH.cdT = Math.max(0, DASH.cdT - delta);
                if (DASH.active) {
                    DASH.t += delta;
                    velX = DASH.dx * DASH.speed; velZ = DASH.dz * DASH.speed; velocityY = 0;
                    if (DASH.t >= DASH.dur) endAirDash();
                }
                SLIDE.cdT = Math.max(0, SLIDE.cdT - delta);
                if (SLIDE.active && !isGrounded) endSlide();
                if (SLIDE.active) {
                    SLIDE.t += delta;
                    if (hasWish) {
                        const a = Math.min(1, SLIDE.steer * delta);
                        SLIDE.dx += (wishDir.x - SLIDE.dx) * a; SLIDE.dz += (wishDir.z - SLIDE.dz) * a;
                        const dl = Math.hypot(SLIDE.dx, SLIDE.dz) || 1; SLIDE.dx /= dl; SLIDE.dz /= dl;
                    }
                    SLIDE.spd *= Math.exp(-SLIDE.friction * delta);
                    const low = underLow();
                    if (low) SLIDE.spd = Math.max(SLIDE.spd, 9);
                    velX = SLIDE.dx * SLIDE.spd; velZ = SLIDE.dz * SLIDE.spd;
                    if (!low && (SLIDE.t >= SLIDE.dur || SLIDE.spd < 5)) endSlide();
                }

                if (SLIDE.active || DASH.active) {
                    // velocidade já definida acima
                } else if (isGrounded) {
                    // No chão: move-se como antes (resposta rápida). Se estiver acima da velocidade normal
                    // (veio de um b-hop), o atrito faz o excesso decair rápido.
                    const k = 1 - Math.exp(-BHOP.groundResponse * delta);
                    const tx = hasWish ? wishDir.x * moveSpeed : 0, tz = hasWish ? wishDir.z * moveSpeed : 0;
                    velX += (tx - velX) * k;
                    velZ += (tz - velZ) * k;
                } else if (hasWish) {
                    // No ar: aceleração estilo Quake. Só ganha velocidade na direção desejada até o "cap";
                    // virar o mouse + A/D (air-strafe) faz a velocidade total crescer.
                    const cur = velX * wishDir.x + velZ * wishDir.z;
                    const add = Math.min(BHOP.airCap - cur, BHOP.airAccel * moveSpeed * delta);
                    if (add > 0) { velX += wishDir.x * add; velZ += wishDir.z * add; }
                }

                // Teto de velocidade horizontal
                const maxH = moveSpeed * BHOP.maxMul;
                const hSpd = Math.hypot(velX, velZ);
                if (!SLIDE.active && !DASH.active && hSpd > maxH) { velX *= maxH / hSpd; velZ *= maxH / hSpd; }

                SLIDE.k += ((SLIDE.active ? 1 : 0) - SLIDE.k) * Math.min(1, 12 * delta);
                camera.position.y = -SLIDE.drop * SLIDE.k;
                DASH.k += ((DASH.active ? 1 : 0) - DASH.k) * Math.min(1, 18 * delta);
                RJ.k = Math.max(0, RJ.k - 6 * delta);
                const _fov = 75 + 8 * SLIDE.k + 14 * DASH.k + 5 * RJ.k;
                if (Math.abs(camera.fov - _fov) > 0.05) { camera.fov = _fov; camera.updateProjectionMatrix(); }

                moveVector.set(velX * delta, 0, velZ * delta);
                const startX = playerObj.position.x, startZ = playerObj.position.z;

                // Gravidade (desligada enquanto desliza na parede — a queda já é controlada acima)
                if (!DASH.active) velocityY -= 30.0 * delta;
                playerObj.position.y += velocityY * delta;

                const _gy = PLAYER_HEIGHT + (typeof floorAt === 'function' ? floorAt() : 0);
                if (playerObj.position.y <= _gy) {
                    playerObj.position.y = _gy;
                    velocityY = 0;
                    isGrounded = true;
                    usedDouble = false;
                    DASH.avail = true;
                } else {
                    isGrounded = false;
                }

                const nextX = playerObj.position.x + moveVector.x;
                const nextZ = playerObj.position.z + moveVector.z;

                if (gameState.inHub) {
                    const hc = window.hubClamp(nextX, nextZ);
                    playerObj.position.x = hc[0];
                    playerObj.position.z = hc[1];
                } else {
                    const limit = ARENA - 4;
                    if (Math.abs(nextX) < limit) playerObj.position.x = nextX;
                    if (Math.abs(nextZ) < limit) playerObj.position.z = nextZ;
                }
                resolveColliders();
                // Bateu em parede/obstáculo? Remove a parte do momento que foi bloqueada.
                if (delta > 0) {
                    const ax = playerObj.position.x - startX, az = playerObj.position.z - startZ;
                    if (Math.abs(ax - moveVector.x) > 1e-4) velX = ax / delta;
                    if (Math.abs(az - moveVector.z) > 1e-4) velZ = az / delta;
                }
                updateReload(delta);

                machineGunGroup.position.z = THREE.MathUtils.lerp(machineGunGroup.position.z, -0.5, 0.12);

                if (isShooting) shootWeapon();

                if (gameState.inHub) updateHub(); else updateLevel();

                // 2. INIMIGOS E CHEFES COM ATAQUES DISTANTES
                nav.frame++;
                enemies.forEach(enemy => {
                    if (enemy.rs < 1) { riseEnemy(enemy); return; }
                    enemy.bobTimer += 0.1;
                    if (window.floorStep && floorStep(enemy)) return;
                    enemy.mesh.position.y = Math.sin(enemy.bobTimer) * 0.15 + (enemy.yb || 0);

                    const dirToPlayer = new THREE.Vector3().subVectors(playerObj.position, enemy.mesh.position);
                    dirToPlayer.y = 0;
                    const distToPlayer = dirToPlayer.length();

                    // rota: caminho livre = direto; com parede no meio = contorna via waypoints
                    const wp = enemyNavTarget(enemy, playerObj.position.x, playerObj.position.z);
                    const tx = wp ? wp.x : playerObj.position.x, tz = wp ? wp.z : playerObj.position.z;
                    enemy.mesh.lookAt(tx, enemy.mesh.position.y, tz);
                    enemy.mesh.rotateY(Math.PI);
                    const mvx = tx - enemy.mesh.position.x, mvz = tz - enemy.mesh.position.z, mvl = Math.hypot(mvx, mvz);
                    if (mvl > 0.001) moveEnemy(enemy, mvx / mvl * enemy.speed, mvz / mvl * enemy.speed);

                    // Chefe Cósmico do Nível 5 Lança Projéteis de Energia
                    if (enemy.isBoss && (enemy.type === "cosmic" || enemy.type === "demon" || enemy.type === "swamp")) {
                        const now = performance.now();
                        if (!enemy.lastRangedAttack || now - enemy.lastRangedAttack > 2200) {
                            enemy.lastRangedAttack = now;
                            fireBossProjectile(enemy.mesh.position, playerObj.position);
                        }
                    }

                    const attackDistance = enemy.isBoss ? 3.5 : 1.8;

                    if (distToPlayer <= attackDistance) {
                        const now = performance.now();
                        if (!enemy.lastAttack || now - enemy.lastAttack > 800) {
                            enemy.lastAttack = now;
                            // quem está bem alto (pulo duplo) escapa do golpe corpo a corpo
                            const feetY = playerObj.position.y - PLAYER_HEIGHT;
                            if (feetY > (enemy.isBoss ? DODGE_CLEAR_BOSS : DODGE_CLEAR)) showDodgeText();
                            else applyPlayerDamage(enemy.isBoss ? 30 : 12);
                        }
                    }
                });

                // 3. PROJÉTEIS INIMIGOS (Lançados pelos Chefes)
                for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                    const ep = enemyProjectiles[i];
                    ep.mesh.position.addScaledVector(ep.dir, ep.speed);
                    ep.life--;

                    if (ep.mesh.position.distanceTo(playerObj.position) < 1.6) {
                        applyPlayerDamage(ep.damage);
                        scene.remove(ep.mesh);
                        enemyProjectiles.splice(i, 1);
                        continue;
                    }

                    if (ep.life <= 0) {
                        scene.remove(ep.mesh);
                        enemyProjectiles.splice(i, 1);
                    }
                }

                // 4. TIROS DO JOGADOR
                for (let i = bullets.length - 1; i >= 0; i--) {
                    const b = bullets[i];
                    if (b.grav) b.dir.y -= b.grav;
                    b.mesh.position.addScaledVector(b.dir, b.speed);
                    b.life--;
                    let dead = b.life <= 0;
                    if (!dead) {
                        const wc = bulletBlocked(b.mesh.position);
                        if (wc) { if (wc.secret) hitSecret(wc.secret); dead = true; }
                        else if (b.splash) {
                            const fy = (typeof floorAt === 'function' ? floorAt() : 0) + 0.1;
                            if (b.mesh.position.y <= fy) {
                                b.mesh.position.y = fy;
                                if (b.bounce) { b.dir.y = Math.abs(b.dir.y) * 0.45; b.dir.x *= 0.7; b.dir.z *= 0.7; } // granada quica
                                else dead = true; // foguete/frango explode ao tocar o chão
                            }
                        }
                    }
                    if (!dead) {
                        for (let j = enemies.length - 1; j >= 0; j--) {
                            const enemy = enemies[j];
                            if (b.hit.has(enemy)) continue;
                            const hitRadius = enemy.isBoss ? 3.5 : 1.3;
                            if (b.mesh.position.distanceTo(enemy.mesh.position) < hitRadius) {
                                if (b.splash) { dead = true; break; }
                                damageEnemy(enemy, b.damage);
                                if (b.pierce) b.hit.add(enemy); else { dead = true; break; }
                            }
                        }
                    }
                    if (dead) {
                        if (b.splash) explode(b);
                        scene.remove(b.mesh);
                        bullets.splice(i, 1);
                    }
                }

                // 5. PARTÍCULAS
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.mesh.position.add(p.vel);
                    if (p.g) { p.vel.y -= p.g; if (p.mesh.position.y < (p.y0 || 0) + 0.06) { p.mesh.position.y = (p.y0 || 0) + 0.06; p.vel.set(p.vel.x * 0.5, 0, p.vel.z * 0.5); } }
                    p.life--;
                    if (p.life <= 0) {
                        scene.remove(p.mesh);
                        particles.splice(i, 1);
                    }
                }

                // 6. ITENS (PENAS, CURA, BAÚ SECRETO)
                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];
                    item.mesh.rotation.y += item.rotSpeed;
                    const d = playerObj.position.distanceTo(item.mesh.position);
                    let take = false;
                    if (item.type === 'heal') {
                        if (d < 2.4 && gameState.heals < 5) {
                            gameState.heals++; take = true; audio.playPickup();
                            toast('🍗 Item de cura coletado! Tecla H para usar');
                        }
                    } else if (item.type === 'ammo') {
                        item.mesh.position.y = 0.6 + Math.sin(performance.now() / 250 + i) * 0.12;
                        const ast = ammoOf(item.weapon), acap = ammoCap(item.weapon);
                        if (d < (hasShip('ima') ? 5.5 : 2.4) && ast.res < acap) {
                            const add = Math.min(item.amount, acap - ast.res);
                            ast.res += add; take = true; audio.playPickup();
                            toast(WEAPONS[item.weapon].icon + ' +' + add + ' munição: ' + WEAPONS[item.weapon].name);
                        }
                    } else if (item.type === 'loot') {
                        if (d < 3.2) {
                            take = true; audio.playPickup();
                            const fe = Math.round(80 * DIFFS[gameState.difficulty].fe);
                            gameState.feathers += fe; gameState.stats.feathers += fe;
                            if (item.weapon && !gameState.weapons[item.weapon]) {
                                giveWeapon(item.weapon); equipWeapon(item.weapon);
                                toast('⭐ ARMA SECRETA: ' + WEAPONS[item.weapon].name + '!');
                            } else toast('💰 Baú secreto: +' + fe + ' penas!');
                            saveProgress();
                        }
                    } else if (d < (hasShip('ima') ? 5.5 : 2.0)) {
                        take = true; audio.playPickup();
                        const fa = Math.round(8 * (hasShip('ima') ? 1.5 : 1) * DIFFS[gameState.difficulty].fe);
                        gameState.feathers += fa; gameState.stats.feathers += fa;
                    }
                    if (take) {
                        updateHUD();
                        scene.remove(item.mesh);
                        items.splice(i, 1);
                    }
                }
            }

            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

/* ===== CAMADA VISUAL QUAKE ===== */
const LS = { getItem: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, setItem: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }, removeItem: k => { try { localStorage.removeItem(k); } catch (e) {} } };
const Q = { torches: [], sky: [] };
const T = {};
(function () {
    const H = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
    const mk = (sz, fn, rep) => {
        const c = document.createElement('canvas'); c.width = c.height = sz; const x = c.getContext('2d'), id = x.createImageData(sz, sz);
        for (let j = 0; j < sz; j++) for (let i = 0; i < sz; i++) { const v = fn(i, j), k = (j * sz + i) * 4; id.data[k] = v[0]; id.data[k + 1] = v[1]; id.data[k + 2] = v[2]; id.data[k + 3] = v[3] === undefined ? 255 : v[3]; }
        x.putImageData(id, 0, 0);
        const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter; return t;
    };
    const g = v => [v, v * 0.97, v * 0.91];
    T.brick = mk(64, (i, j) => {
        const r = j >> 4, bx = (i + (r & 1) * 16) & 31, by = j & 15, id = (((i + (r & 1) * 16) >> 5) + r * 3);
        if (bx < 2 || by < 2) return g(62 + H(i, j) * 22);
        let v = 150 + H(id, 7) * 40 + (by < 4 ? 20 : 0) - (by > 12 ? 28 : 0) + (bx < 4 ? 12 : 0) - (bx > 28 ? 22 : 0) + (H(i, j) - .5) * 36 + (H(i >> 2, j >> 2) - .5) * 30;
        return g(v);
    });
    T.floor = mk(64, (i, j) => {
        const bx = i & 31, by = j & 31;
        if (bx < 1 || by < 1) return g(48);
        const v = 125 + H(i >> 3, j >> 3) * 45 + (bx < 3 || by < 3 ? 16 : 0) - (bx > 29 || by > 29 ? 24 : 0) + (H(i, j) - .5) * 30;
        return g(v);
    });
    T.skin = mk(32, (i, j) => g(120 + (H(i >> 1, j >> 1) - .5) * 80 + (H(i, j) - .5) * 30 - (H(i >> 2, j >> 3) > .8 ? 40 : 0)));
    T.metal = mk(32, (i, j) => g(105 + H(0, j) * 40 + (H(i, j) - .5) * 28));
    const fbm = (i, j, n, off) => { let s = 0, a = 1, t = 0; for (let o = 0; o < 4; o++) { const f = 4 << o, u = i / n * f, v = j / n * f, x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0, w = f, h = (X, Y) => H(((X % w) + w) % w + off, ((Y % w) + w) % w); const a0 = h(x0, y0) * (1 - fx) + h(x0 + 1, y0) * fx, a1 = h(x0, y0 + 1) * (1 - fx) + h(x0 + 1, y0 + 1) * fx; s += (a0 * (1 - fy) + a1 * fy) * a; t += a; a /= 2; } return s / t; };
    T.cloudA = mk(128, (i, j) => g(60 + fbm(i, j, 128, 0) * 190));
    T.cloudB = mk(128, (i, j) => { const n = fbm(i, j, 128, 50); return [235, 225, 215, Math.max(0, (n - .45) * 700)]; });
    T.flame = [0, 1, 2].map(f => {
        const c = document.createElement('canvas'); c.width = 16; c.height = 32; const x = c.getContext('2d');
        for (let y = 0; y < 32; y++) { const t = y / 31, half = (1 - t) * 6.5 * (0.75 + 0.5 * H(f, y)) + (y > 24 ? 0 : 0.5); for (let px = 0; px < 16; px++) { const d = Math.abs(px - 8 + Math.sin(y * .4 + f * 2) * 1.5); if (d < half && y > 2) { x.fillStyle = d < half * .35 ? '#ffe9a0' : d < half * .7 ? '#ffa020' : '#d03010'; x.fillRect(px, y, 1, 1); } } }
        const t = new THREE.CanvasTexture(c); t.magFilter = t.minFilter = THREE.NearestFilter; return t;
    });
})();

// materiais sem brilho especular, como no Quake
THREE.MeshStandardMaterial = function (p) { p = Object.assign({}, p); delete p.metalness; delete p.roughness; return new THREE.MeshLambertMaterial(p); };

// texturiza paredes/pisos automaticamente
function texturize(o) {
    const m = o.material, g = o.geometry;
    if (!m || !g || !m.isMeshLambertMaterial || m.map || m.transparent || g.userData.q) return;
    const t = g.type; if (t !== 'BoxGeometry' && t !== 'PlaneGeometry' && t !== 'CylinderGeometry') return;
    g.userData.q = 1; const uv = g.attributes.uv, p = g.parameters;
    if (t === 'BoxGeometry') { const d = [[p.depth, p.height], [p.depth, p.height], [p.width, p.depth], [p.width, p.depth], [p.width, p.height], [p.width, p.height]]; for (let i = 0; i < 24; i++) { const f = i >> 2; uv.setXY(i, uv.getX(i) * d[f][0] / 4, uv.getY(i) * d[f][1] / 4); } }
    else if (t === 'PlaneGeometry') { for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * p.width / 6, uv.getY(i) * p.height / 6); }
    else { const R = Math.max(p.radiusTop, p.radiusBottom), sc = (p.radialSegments + 1) * (p.heightSegments + 1); for (let i = 0; i < uv.count; i++) { if (i < sc) uv.setXY(i, uv.getX(i) * 2 * Math.PI * R / 6, uv.getY(i) * p.height / 6); else uv.setXY(i, uv.getX(i) * R / 3, uv.getY(i) * R / 3); } }
    uv.needsUpdate = true;
    if (!m.userData.q) { m.userData.q = 1; m.map = t === 'BoxGeometry' ? T.brick : T.floor; const h = {}; m.color.getHSL(h); m.color.setHSL(h.h, h.s * 0.7, Math.min(0.95, 0.5 + h.l * 0.9)); m.needsUpdate = true; }
}
const _addObj = addObj;
addObj = function (o) { if (o.isMesh) texturize(o); return _addObj(o); };

// inimigos com "skin" texturizada
const _cz = createZombieChickenMesh;
createZombieChickenMesh = function (t) {
    const g = _cz(t);
    g.traverse(o => { if (o.isMesh && o.material.isMeshLambertMaterial && !o.material.emissive.getHex()) { o.material.map = T.skin; o.material.color.offsetHSL(0, -0.2, 0.18); o.material.emissive.setHex(0x1a1208); o.material.needsUpdate = true; } });
    return g;
};
// arma em primeira pessoa
const _cm = createMachineGunModel;
createMachineGunModel = function () { const g = _cm();[0, 1, 2].forEach(i => { const m = g.children[i].material; m.map = T.metal; m.needsUpdate = true; }); return g; };

// céu em duas camadas rolando (como o céu do Quake)
function addSky(r, tex, tint, v, alpha) {
    const t = tex.clone(); t.needsUpdate = true; t.repeat.set(3, 1.5); t.wrapS = t.wrapT = THREE.RepeatWrapping;
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshBasicMaterial({ map: t, color: tint, side: THREE.BackSide, transparent: alpha, depthWrite: false, fog: false }));
    m.renderOrder = alpha ? -1 : -2; scene.add(m); levelObstacles.push(m); Q.sky.push({ mesh: m, tex: t, v });
}
function addTorch(x, y, z) {
    const g = new THREE.Group(); g.position.set(x, y, z);
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.3), new THREE.MeshLambertMaterial({ color: 0x8a5a2a, map: T.metal })));
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame[0], transparent: true, fog: false })); sp.scale.set(1.3, 2.6, 1); sp.position.y = 1.6; g.add(sp);
    const L = new THREE.PointLight(0xff9a40, 1.4, 26); L.position.set(0, 1.8, 1); g.add(L);
    scene.add(g); levelObstacles.push(g); Q.torches.push({ sp, L });
}
function quakeify(sky, fog, lvl) {
    scene.traverse(o => { if (o.isAmbientLight) o.intensity = lvl ? 0.5 : 0.6; if (o.isDirectionalLight) o.intensity = 0.3; });
    const fc = new THREE.Color(fog).lerp(new THREE.Color(0x1a120a), 0.45);
    scene.fog = new THREE.FogExp2(fc, lvl ? 0.02 : 0.014); scene.background = fc.clone();
    const h = {}; new THREE.Color(sky).getHSL(h); const tint = new THREE.Color().setHSL(h.h, Math.min(0.45, h.s), 0.5);
    addSky(470, T.cloudA, tint, 0.00012, false); addSky(460, T.cloudB, tint.clone().multiplyScalar(1.4), 0.00035, true);
}
const _lel = loadEpochLevel;
loadEpochLevel = function (i) {
    Q.torches = []; Q.sky = []; _lel(i); quakeify(EPOCHS[i].skyColor, EPOCHS[i].fogColor, true);
    gates.forEach(g => [-1, 1].forEach(s => addTorch(g.doorX + s * (g.k === 2 ? 11 : 9), 4.6, g.z + 1.9)));
};
const _lh = loadHub;
loadHub = function () { Q.torches = []; Q.sky = []; _lh(); quakeify(0x6b5a48, 0x1f1a14, false); };

// render em baixa resolução (pixels grandes, 240p)
function applyLowRes() {
    const h = Math.min(240, innerHeight), w = Math.round(innerWidth * h / innerHeight);
    renderer.setPixelRatio(1); renderer.setSize(w, h, false);
    const s = renderer.domElement.style; s.width = '100%'; s.height = '100%';
}
const _ie = initEngine;
// animações em passos de 10 fps (como os modelos do Quake); câmera e movimento continuam suaves
function patchRender() {
    const R = renderer.render.bind(renderer); let step = -1;
    renderer.render = function (sc, cam) {
        const ns = (performance.now() / 100) | 0, fresh = ns !== step; step = ns;
        const L = [];
        enemies.forEach(e => { if (e.mesh) L.push([e.mesh.position, 'y']); });
        items.forEach(it => { L.push([it.mesh.rotation, 'y'], [it.mesh.position, 'y']); });
        L.push([machineGunGroup.position, 'y'], [machineGunGroup.rotation, 'x']);
        if (hubCrystal) L.push([hubCrystal.rotation, 'y'], [hubCrystal.position, 'y']);
        hubStations.forEach(st => { if (st.npc) L.push([st.npc.position, 'y']); });
        const real = L.map(([o, k]) => { const q = o.__q || (o.__q = {}); if (fresh || q[k] === undefined) q[k] = o[k]; const r = o[k]; o[k] = q[k]; return r; });
        R(sc, cam);
        L.forEach(([o, k], i) => { o[k] = real[i]; });
    };
}
initEngine = function () { _ie(); applyLowRes(); patchRender(); window.addEventListener('resize', applyLowRes); };

// CSS: HUD de barra de status do Quake, sem scanlines
const st = document.createElement('style');
st.textContent = `.scanlines,.vignette{display:none}
#canvas-container canvas{image-rendering:pixelated;image-rendering:crisp-edges;filter:saturate(.8) contrast(1.15) sepia(.16) brightness(1.05)}
.retro-panel{background:repeating-linear-gradient(90deg,#3b2a1a 0 3px,#33241a 3px 6px);border:0!important;border-top:4px solid #7d5a35!important;border-radius:0!important;box-shadow:inset 0 3px 0 #8a6640,inset 0 -3px 0 #1a100a!important}
#hud{padding:0!important}#hud>div{max-width:100%!important;width:100%}
#hud span{font-family:'Press Start 2P',monospace}
#hud div.font-bold{color:#d9902f!important;text-shadow:2px 2px 0 #000;font-size:1.5rem!important}
#hud .text-xs{color:#a8742c!important;font-size:9px!important}`;
document.head.appendChild(st);

// rosto do Ranger na barra de status
(function () {
    const gr = document.querySelector('#hud > div'); gr.className = gr.className.replace('md:grid-cols-5', 'md:grid-cols-6');
    const w = document.createElement('div'); w.className = 'flex items-center justify-center border-r border-amber-900/60';
    const c = document.createElement('canvas'); c.width = c.height = 16; c.style.cssText = 'width:64px;height:64px;image-rendering:pixelated;border:2px solid #1a100a'; w.appendChild(c); gr.insertBefore(w, gr.children[2]);
    const x = c.getContext('2d'), P = (col, a, b, ww, hh) => { x.fillStyle = col; x.fillRect(a, b, ww, hh); };
    let last = -1;
    function face(lv) {
        x.clearRect(0, 0, 16, 16); P('#2a1a0e', 3, 1, 10, 3); P('#a07850', 3, 3, 10, 11); P('#7a5a38', 3, 12, 10, 2);
        P('#e8e0d0', 4, 6, 3, 2); P('#e8e0d0', 9, 6, 3, 2); P('#111', lv > 1 ? 4 : 5, 6, 1, 2); P('#111', lv > 1 ? 9 : 10, 6, 1, 2);
        P('#2a1a0e', 4, 5, 3, 1); P('#2a1a0e', 9, 5, 3, 1); P('#5a2a1a', 6, lv < 2 ? 11 : 10, 4, lv < 2 ? 1 : 3);
        if (lv >= 1) P('#a01010', 4, 3, 1, 3); if (lv >= 2) { P('#a01010', 11, 7, 1, 5); P('#a01010', 7, 8, 1, 2); } if (lv >= 3) { P('#a01010', 3, 6, 10, 1); P('#a01010', 5, 12, 2, 2); }
    }
    setInterval(() => { const r = gameState.health / (gameState.maxHealth || 100), lv = r > .75 ? 0 : r > .5 ? 1 : r > .25 ? 2 : 3; if (lv !== last) { last = lv; face(lv); } }, 200);
})();

// loop de animação do cenário: céu, chamas e luz de tocha tremulando
(function loop() {
    requestAnimationFrame(loop); const now = performance.now();
    Q.sky.forEach(s => { if (typeof playerObj !== 'undefined' && playerObj) s.mesh.position.copy(playerObj.position); s.tex.offset.x += s.v; });
    Q.torches.forEach((t, i) => { { const z = Math.sin((now / 100 | 0) * 12.9898 + i * 78.233) * 43758.5453; t.L.intensity = 0.85 + 0.7 * (z - Math.floor(z)); } t.sp.material.map = T.flame[((now / 110 | 0) + i) % 3]; });
})();


/* ===== MAPAS 2.0: andares, elevador, chaves, puzzles, arenas, segredos e atalhos ===== */
(function () {
const T = 3, H = 12, UP = 6, STEP = 1.3;
const KC = { yellow: 0xfacc15, blue: 0x38bdf8, red: 0xef4444 }, KN = { yellow: 'AMARELA', blue: 'AZUL', red: 'VERMELHA' };
const LORE = ['Diário: "As galinhas comeram o mamute. Todo ele."', 'Grafite: "Ave, César! Ave... ave... cocoricó."', 'Memorando: "Proibido ovos no fosso. De novo."', 'Log: "ERRO 404: galinha não encontrada. ERRO 500: galinha ENCONTRADA."', 'Hieróglifo: um ovo, um sol, e um faraó muito irritado.', 'Nota: "O lodo canta de madrugada. Ninguém sabe por quê."', 'Placa: "Bem-vindo ao Inferno. Tire os sapatos. E as penas."', 'Terminal: "O Núcleo do Tempo é, na verdade, um ovo gigante."'];
const DN = ['🔴', '🔵', '🟡', '🟢'], DCOL = ['#ef4444', '#3b82f6', '#facc15', '#22c55e'];
let L = null, M = 1, WALL, EP, BARM, DECKM;
const things = [], doors = [], rooms = [], surf = [], pk = [];
const add = o => { scene.add(o); levelObstacles.push(o); return o; };
const mat = (c, e) => new THREE.MeshLambertMaterial(e === undefined ? { color: c } : { color: c, emissive: e });
const mr = (a, b) => M > 0 ? [a, b] : [-b, -a];
const B = (x, y0, z, w, h, d, m, tex) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y0 + h / 2, z); return tex ? addObj(o) : add(o); };
const col = (x, z, w, d, o) => { const c = Object.assign({ box: true, minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 }, o || {}); colliders.push(c); return c; };
const Wl = (x, z, w, d, o, m) => ({ mesh: B(x, (o && o.y0) || 0, z, w, (o && o.h) || H, d, m || WALL, 1), c: col(x, z, w, d, o) });
let _fg = 0;
const feet = () => playerObj.position.y - PLAYER_HEIGHT, plv = () => Math.round(_fg / UP);   // andar = altura do chão sob os pés / UP
window.floorStep = function (e) {
    const p = e.mesh.position;
    if (e.cl) { const c = e.cl; c.t = Math.min(1, c.t + 0.025); p.x = c.x0 + (c.x1 - c.x0) * c.t; p.z = c.z0 + (c.z1 - c.z0) * c.t; e.yb = c.y0 + (c.y1 - c.y0) * c.t; p.y = e.yb + Math.sin(e.bobTimer) * 0.1; if (c.t >= 1) { e.fl = c.fl; e.cl = null; e.navT = undefined; } return true; }
    const ef = e.fl | 0, pf = plv();
    if (ef === pf || !L || !L.links || !L.links.length) return false;
    const k = L.links.find(q => q.a === ef && q.b === ef + Math.sign(pf - ef));
    if (!k) return true;
    const dx = k.x - p.x, dz = k.z - p.z, d = Math.hypot(dx, dz);
    if (d < 1.6) { e.cl = { t: 0, x0: p.x, z0: p.z, x1: k.x2, z1: k.z2, y0: ef * UP, y1: k.b * UP, fl: k.b }; return true; }
    moveEnemy(e, dx / d * e.speed, dz / d * e.speed);
    e.mesh.lookAt(k.x, p.y, k.z); e.mesh.rotateY(Math.PI); p.y = (e.yb || 0) + Math.sin(e.bobTimer) * 0.15; return true;
};
const near = (x, z) => Math.hypot(playerObj.position.x - x, playerObj.position.z - z);
const X = x => x * M;

// ---- superfícies caminháveis (decks, escadas, elevador) ----
window.floorAt = function () {
    if (!surf.length) { _fg = 0; return 0; }
    const p = playerObj.position, f = p.y - PLAYER_HEIGHT + STEP; let g = 0;
    for (const s of surf) {
        if (p.x < s.x0 || p.x > s.x1 || p.z < s.z0 || p.z > s.z1) continue;
        let h = s.h;
        if (s.lift) h = s.lift.h;
        else if (s.n) { const t = s.ax === 'x' ? (p.x - s.x0) / (s.x1 - s.x0) : (p.z - s.z0) / (s.z1 - s.z0), u = s.sg > 0 ? t : 1 - t; h = (s.base || 0) + Math.min(s.n, Math.floor(u * s.n) + 1) * ((s.top || UP) - (s.base || 0)) / s.n; }
        if (h <= f && h > g) g = h;
    }
    _fg = g; return g;
};
// ---- colisões com níveis (térreo / andar) e grades que deixam ver e atirar através ----
const okP = c => !c.en && !(c.low && SLIDE.active) && !(c.dash && DASH.active) && (c.lv === undefined || c.lv === plv());
resolveColliders = function () {
    const p = playerObj.position;
    colliders.forEach(c => {
        if (!okP(c)) return;
        if (c.box) {
            const cx = Math.max(c.minX, Math.min(p.x, c.maxX)), cz = Math.max(c.minZ, Math.min(p.z, c.maxZ));
            const dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
            if (d < 0.6) { if (d > 0.001) { p.x = cx + dx / d * 0.6; p.z = cz + dz / d * 0.6; } else p.z = c.maxZ + 0.6; }
        } else {
            const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = c.r + 0.6;
            if (d < m && d > 0.001) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; }
        }
    });
};
blocked = function (x, z, r, fl) {
    const f = fl === undefined ? (_bf | 0) : fl;
    for (const c of colliders) {
        if (c.lv !== undefined && c.lv !== f) continue;
        if (c.box) { if (x > c.minX - r && x < c.maxX + r && z > c.minZ - r && z < c.maxZ + r) return true; }
        else if (Math.hypot(x - c.x, z - c.z) < c.r + r * 0.6) return true;
    }
    return false;
};
bulletBlocked = function (pos) {
    for (const c of colliders) {
        if (c.see || c.en || (c.lv !== undefined && (pos.y < c.lv * UP - 3 || (c.lv < (window.TOPFL || 1) && pos.y > c.lv * UP + 4)))) continue;
        if (c.box) { if (pos.x > c.minX && pos.x < c.maxX && pos.z > c.minZ && pos.z < c.maxZ) return c; }
        else if (Math.hypot(pos.x - c.x, pos.z - c.z) < c.r) return c;
    }
    return null;
};
const _cw = clearWorld;
clearWorld = function () { _cw(); L = null; things.length = doors.length = rooms.length = surf.length = pk.length = 0; const k = document.getElementById('keys-hud'); if (k) k.innerHTML = ''; };
const _int = interact;

// ---- paredes com vãos: portas, grades, painéis secretos ----
function seg(ax, f, a, b, gaps) {
    gaps = (gaps || []).map(g => g.slice());
    if (M < 0) { if (ax === 'x') { [a, b] = [-b, -a]; gaps.forEach(g => g[0] = -g[0]); } else f = -f; }
    gaps.sort((p, q) => p[0] - q[0]); let cur = a;
    const pc = (s, e) => { if (e - s < 0.2) return; const c = (s + e) / 2, l = e - s; ax === 'x' ? Wl(c, f, l, T) : Wl(f, c, T, l); };
    gaps.forEach(g => { pc(cur, g[0] - g[1] / 2); cur = g[0] + g[1] / 2; gap(ax, f, g); });
    pc(cur, b);
}
function bars(ax, x, z, w, y0, h, lv) {
    const k = Math.round(w / 1.6);
    for (let i = 0; i <= k; i++) { const t = -w / 2 + i * w / k; ax === 'x' ? B(x + t, y0, z, .45, h, .45, BARM) : B(x, y0, z + t, .45, h, .45, BARM); }
    col(x, z, ax === 'x' ? w : T, ax === 'x' ? T : w, { see: true, lv });
}
function gap(ax, f, g) {
    const c = g[0], w = g[1], s = g[2], o = g[3] || {}, x = ax === 'x' ? c : f, z = ax === 'x' ? f : c;
    if (s === 'open') return;
    if (s === 'bars') return bars(ax, x, z, w, 0, H, undefined);
    if (s === 'crack') {
        const mesh = B(x, 0, z, ax === 'x' ? w : T, H, ax === 'x' ? T : w, mat(0xcbb89a, 0x2a1500), 1);
        const cc = col(x, z, ax === 'x' ? w : T, ax === 'x' ? T : w), sw = { mesh, col: cc, hp: 4, x, z };
        cc.secret = sw; secretWalls.push(sw);
        return things.push({ x, z, r: 12, txt: () => sw.hp > 0 ? '🧱 Parede rachada... atire nela!' : null });
    }
    mkDoor(ax, x, z, w, s, o);
}
const DC = { common: 0x8a5a2b, puzzle: 0x0891b2, combat: 0xb91c1c, power: 0x7c3aed, oneway: 0x4b5563, sw: 0xf59e0b };
const LBL = { common: ['PORTA', ''], key: ['TRANCADA', '🔑'], puzzle: ['SEGURANÇA', '🔐 código'], combat: ['⚔️ ARENA', 'combate'], power: ['REATOR', '⚡ sem energia'], oneway: ['ATALHO', '🔒 outro lado'], sw: ['COFRE', '🔘 0/3'] };
function mkDoor(ax, x, z, w, s, o) {
    const [t, kc] = s.split(':'), y0 = o.y0 || 0, hh = o.h || H - 1;
    const color = t === 'key' ? KC[kc] : t === 'secret' ? 0 : DC[t];
    const m = t === 'secret' ? mat(WALL.color.clone().offsetHSL(0, 0, .09)) : mat(color, color);
    if (t !== 'secret') m.emissive.multiplyScalar(.35);
    const g = new THREE.Group(); g.position.set(x, y0, z);
    const sl = new THREE.Mesh(new THREE.BoxGeometry(ax === 'x' ? w : T - .4, hh, ax === 'x' ? T - .4 : w), m); sl.position.y = hh / 2; g.add(sl);
    const d = { g, t, kc, o, x, z, w, open: false, ax, lv: o.lv };
    if (t !== 'secret' && t !== 'common') {
        const lb = LBL[t], l2 = t === 'key' ? '🔑 chave ' + KN[kc] : lb[1], cl = '#' + (t === 'key' ? KC[kc] : color).toString(16).padStart(6, '0');
        [-1, 1].forEach(sd => { const sp = makeLabel(lb[0], l2, cl); sp.position.set(ax === 'x' ? 0 : sd * 2.2, hh * .7, ax === 'x' ? sd * 2.2 : 0); g.add(sp); });
    }
    add(g);
    d.col = col(x, z, ax === 'x' ? w : T, ax === 'x' ? T : w, { lv: o.lv });
    doors.push(d); if (o.ref) L[o.ref] = d;
    if (t === 'combat') d.n = Math.max(3, Math.round(o.n * EP.enemiesToKill / 28));
    things.push({
        x, z, lv: o.lv, r: t === 'secret' ? 5 : w / 2 + 6,
        txt: () => {
            if (d.open) return null;
            const side = Math.abs(playerObj.position.x) < 26;
            return { key: () => L.keys[kc] ? '[E] Usar chave ' + KN[kc] : '🔒 Precisa da chave ' + KN[kc], puzzle: () => '[E] Terminal de segurança', combat: () => d.active ? '⚔️ Restam ' + alive(d) + ' galinhas' : '[E] Ativar ARENA (' + d.n + ' galinhas)',
                power: () => '⚡ Sem energia — geradores ' + L.gens + '/2', oneway: () => side ? '[E] Destrancar atalho' : '🔒 Só abre do outro lado', sw: () => '🔒 Cofre — interruptores ' + L.sw + '/3', secret: () => '[E] Painel suspeito...', common: () => null }[t]();
        },
        act: () => {
            if (t === 'key') L.keys[kc] ? openDoor(d, '🔓 Porta ' + KN[kc] + ' aberta!') : toast('🔒 Precisa da chave ' + KN[kc]);
            else if (t === 'puzzle') showPuzzle(d);
            else if (t === 'combat') startArena(d);
            else if (t === 'oneway') { if (Math.abs(playerObj.position.x) < 26) openDoor(d, '🚪 ATALHO aberto! Duas áreas agora estão ligadas.'); else toast('🔒 Só abre do outro lado'); }
            else if (t === 'secret') { openDoor(d, '🧩 PASSAGEM SECRETA ENCONTRADA!'); gameState.stats.secrets++; saveProgress(); }
        },
        auto: () => { if (!d.open && ((t === 'common' && near(x, z) < 9) || (t === 'power' && L.gens >= 2))) openDoor(d, t === 'power' ? '⚡ ENERGIA RESTAURADA — o reator foi liberado!' : null); }
    });
}
function openDoor(d, msg) {
    if (d.open) return; d.open = true; d.anim = 1;
    const i = colliders.indexOf(d.col); if (i >= 0) colliders.splice(i, 1); nav.ver++;
    audio.playExplosion(); if (msg) toast(msg);
    if (d.o.ref === 'boss') setCheckpoint(3);
}
const alive = d => enemies.filter(e => e.arena === d).length;
function spawnIn(x0, x1, z0, z1, n, tag, fl) {
    fl = fl | 0;
    for (let i = 0; i < n; i++) {
        let x, z, k = 0;
        do { x = x0 + Math.random() * (x1 - x0); z = z0 + Math.random() * (z1 - z0); k++; } while ((blocked(x, z, 1.5, fl) || near(x, z) < 10) && k < 40);
        spawnEnemy(EP.chickenType, false, -1);
        const e = enemies[enemies.length - 1]; e.fl = fl; e.yb = fl * UP; e.mesh.position.set(x, e.yb - e.hh, z); if (tag) e.arena = tag;
    }
}
function startArena(d) {
    if (d.active) return; d.active = true;
    const a = d.o.ar, [x0, x1] = mr(a[0], a[1]);
    spawnIn(x0, x1, a[2], a[3], d.n, d); toast('⚔️ ARENA! Elimine as ' + d.n + ' galinhas para abrir a porta!');
}
checkGates = function () {
    if (!L) return;
    doors.forEach(d => { if (d.active && !d.open && alive(d) === 0) { d.active = false; openDoor(d, '✅ ARENA LIMPA! Porta de combate aberta.'); } });
};

// ---- puzzle de segurança: sequência de 3 cores (a pista está em um terminal da fase) ----
const mo = document.createElement('div');
mo.id = 'pz-modal'; mo.className = 'absolute inset-0 bg-black/90 z-30 hidden flex items-center justify-center p-4';
mo.innerHTML = '<div class="retro-panel p-6 text-center rounded"><div class="text-2xl text-cyan-300 mb-2">🔐 TERMINAL DE SEGURANÇA</div><div id="pz-msg" class="text-xl text-yellow-300 mb-3"></div><div id="pz-btns" class="flex gap-3 justify-center mb-3"></div><div class="text-sm text-gray-400">[E] sair</div></div>';
document.body.appendChild(mo);
function showPuzzle(d) {
    let inp = [];
    const msg = () => document.getElementById('pz-msg').innerText = (L.known ? 'Código: ' + L.seq.map(i => DN[i]).join(' ') + '\n' : 'Digite 3 cores. Procure um terminal de dados na fase!\n') + 'Entrada: ' + inp.map(i => DN[i]).join(' ');
    const bx = document.getElementById('pz-btns'); bx.innerHTML = '';
    DCOL.forEach((c, i) => {
        const b = document.createElement('button'); b.style.cssText = 'width:64px;height:64px;border:3px solid #fff;background:' + c; b.onclick = () => {
            inp.push(i); audio.playPickup();
            if (inp.length === 3) {
                if (inp.every((v, k) => v === L.seq[k])) { closeModal(); openDoor(d, '🔓 ACESSO CONCEDIDO!'); }
                else { inp = []; applyPlayerDamage(6); audio.playHit(); }
            }
            msg();
        }; bx.appendChild(b);
    });
    msg(); openModal('pz-modal');
}

// ---- objetos do mapa ----
function hudKeys() {
    let e = document.getElementById('keys-hud');
    if (!e) { e = document.createElement('div'); e.id = 'keys-hud'; e.className = 'absolute top-3 left-3 z-20 text-3xl pointer-events-none'; e.style.textShadow = '2px 2px 0 #000'; document.body.appendChild(e); }
    e.innerHTML = L ? Object.keys(KC).map(c => '<span style="color:' + (L.keys[c] ? '#' + KC[c].toString(16).padStart(6, '0') : '#444') + '">◆</span>').join(' ') + '<span class="text-xl text-yellow-200"> ⚡' + L.gens + '/2 🔘' + L.sw + '/3</span>' : '';
}
function key(c, x, z, y) {
    const g = new THREE.Group(), m = mat(KC[c], KC[c]);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(.5, .16, 6, 10), m));
    const sh = new THREE.Mesh(new THREE.BoxGeometry(.2, 1.2, .2), m); sh.position.y = -.9; g.add(sh);
    g.add(new THREE.PointLight(KC[c], 1, 12)); g.position.set(x, y + 1.6, z); add(g);
    pk.push({ mesh: g, x, z, y, fn: () => { L.keys[c] = 1; hudKeys(); audio.playPickup(); toast('🔑 CHAVE ' + KN[c] + ' obtida!'); } });
}
function heal(x, z, y) { const h = makeHealMesh(); h.position.set(x, (y || 0) + .9, z); scene.add(h); items.push({ mesh: h, rotSpeed: .03, type: 'heal' }); }
function ammo(x, z, y) {
    const own = Object.keys(WEAPONS).filter(i => gameState.weapons[i]); if (!own.length) return;
    const id = own[Math.floor(Math.random() * own.length)], mesh = makeAmmoMesh(id); mesh.position.set(x, (y || 0) + .6, z); scene.add(mesh);
    items.push({ mesh, rotSpeed: .04, type: 'ammo', weapon: id, amount: Math.max(2, Math.round(WEAPONS[id].mag * 1.2)) });
}
function chest(x, z, w, y) { const c = makeChest(); c.position.set(x, y || 0, z); scene.add(c); items.push({ mesh: c, rotSpeed: .02, type: 'loot', weapon: w || null }); }
function pillarObj(x, z, y0, color, tall) { return B(x, y0, z, 1.4, tall, 1.4, mat(color, color), 0); }
function terminal(x, z, y, fn, label) {
    const b = B(x, y, z, 1.6, 2.2, 1, mat(0x1f2937)); B(x, y + 1.2, z, 1.2, .9, .3, mat(0x22d3ee, 0x0e7490));
    things.push({ x, z, lv: y > 3 ? Math.round(y / UP) : undefined, r: 4.5, txt: () => '[E] ' + label, act: fn });
}
function gen(x, z) {
    x *= M; const top = mat(0xdc2626, 0xdc2626), g = { on: false };
    B(x, 0, z, 3, 3, 3, mat(0x374151)); const t = B(x, 3, z, 2, 1.4, 2, top); const gl = new THREE.PointLight(0xff3333, 1.2, 16); gl.position.set(x, 5, z); add(gl);
    things.push({ x, z, r: 5, txt: () => g.on ? null : '[E] Ativar gerador', act: () => {
        if (g.on) return; g.on = true; L.gens++; top.color.setHex(0x22c55e); top.emissive.setHex(0x16a34a); hudKeys(); audio.playExplosion();
        toast('⚡ GERADOR ATIVADO (' + L.gens + '/2)' + (L.gens > 1 ? ' — o reator tem energia!' : ''));
        spawnIn(x - 18, x + 18, z - 14, z + 14, 3);
    } });
}
function sw(x, z, y) {
    x *= M; const s = { on: false }, top = mat(0xf59e0b, 0xb45309);
    B(x, y, z, 1.4, 1.6, 1, mat(0x374151)); B(x, y + 1.6, z, .7, .7, .7, top);
    things.push({ x, z, lv: y > 3 ? Math.round(y / UP) : undefined, r: 4, txt: () => s.on ? null : '[E] Puxar interruptor', act: () => {
        if (s.on) return; s.on = true; top.color.setHex(0x22c55e); top.emissive.setHex(0x15803d); L.sw++; hudKeys(); audio.playPickup();
        toast('🔘 Interruptor ' + L.sw + '/3' + (L.sw === 3 ? ' — o COFRE da galeria abriu!' : ''));
        if (L.sw === 3) openDoor(L.vault);
    } });
}
function deck(x0, x1, z0, z1, h = UP) {
    const [a, b] = mr(x0, x1), o = new THREE.Mesh(new THREE.BoxGeometry(b - a, .6, z1 - z0), DECKM);
    o.position.set((a + b) / 2, h - .3, (z0 + z1) / 2); addObj(o); surf.push({ x0: a, x1: b, z0, z1, h });
}
function stairs(x0, x1, z0, z1, ax, sg, n, base = 0, top = UP) {
    const [a, b] = mr(x0, x1); if (ax === 'x') sg *= M;
    const len = ax === 'x' ? b - a : z1 - z0, st = len / n;
    for (let k = 0; k < n; k++) {
        const h = base + ((sg > 0 ? k : n - 1 - k) + 1) * (top - base) / n, s0 = (ax === 'x' ? a : z0) + k * st;
        const o = new THREE.Mesh(new THREE.BoxGeometry(ax === 'x' ? st : b - a, h - base, ax === 'x' ? z1 - z0 : st), DECKM);
        o.position.set(ax === 'x' ? s0 + st / 2 : (a + b) / 2, base + (h - base) / 2, ax === 'x' ? (z0 + z1) / 2 : s0 + st / 2); addObj(o);
    }
    if (ax === 'x') { col((a + b) / 2, z0 - .5, b - a, 1, { lv: Math.round(base / UP) }); col((a + b) / 2, z1 + .5, b - a, 1, { lv: Math.round(base / UP) }); }
    else { col(a - .5, (z0 + z1) / 2, 1, z1 - z0, { lv: Math.round(base / UP) }); col(b + .5, (z0 + z1) / 2, 1, z1 - z0, { lv: Math.round(base / UP) }); }
    col((a + b) / 2, (z0 + z1) / 2, b - a, z1 - z0, { en: 1 });   // massa da escada: só bloqueia galinhas
    surf.push({ x0: a, x1: b, z0, z1, ax, sg, n, base, top });
}

// ===== CARREGADOR DE FASE =====
loadEpochLevel = function (index) {
    EP = EPOCHS[index]; const rnd = mulberry(index * 7919 + 13);
    clearWorld(); gameState.inHub = false; Q.torches = []; Q.sky = [];
    M = index % 2 ? -1 : 1;
    L = { keys: {}, gens: 0, sw: 0, known: false, seq: [0, 0, 0].map(() => Math.floor(rnd() * 4)), t0: performance.now() };
    scene.background = new THREE.Color(EP.skyColor); scene.fog = new THREE.FogExp2(EP.fogColor, 0.015);
    WALL = mat(EP.wallColor); BARM = mat(0x2b2b2b); DECKM = mat(new THREE.Color(EP.wallColor).offsetHSL(0, 0, -.08).getHex());
    addObj(new THREE.AmbientLight(0xffffff, 0.55)); const sun = new THREE.DirectionalLight(0xffedd5, 0.85); sun.position.set(40, 80, 40); addObj(sun);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2 + 10, ARENA * 2 + 10), mat(EP.floorColor)); fl.rotation.x = -Math.PI / 2; addObj(fl);
    [[0, -ARENA, ARENA * 2 + 2, 2], [0, ARENA, ARENA * 2 + 2, 2], [-ARENA, 0, 2, ARENA * 2], [ARENA, 0, 2, ARENA * 2]].forEach(([x, z, w, d]) => B(x, 0, z, w, H, d, WALL, 1));

    // paredes mestras: PRAÇA (z>40) | alas Alfa/Beta com ÁTRIO central (z 40..-10) | norte: alas + REATOR | arena do chefe (z<-46)
    seg('x', 40, -80, 80, [[-52, 10, 'common'], [0, 12, 'combat', { n: 7, ar: [-30, 30, 46, 74] }], [52, 10, 'key:yellow']]);
    seg('z', -28, -10, 40, [[30, 6, 'open']]);
    seg('z', 28, -10, 40, [[20, 8, 'puzzle'], [0, 6, 'bars']]);
    seg('x', -10, -80, 80, [[-52, 10, 'key:blue'], [-14, 6, 'bars'], [0, 10, 'power'], [14, 6, 'bars'], [52, 10, 'combat', { n: 6, ar: [34, 74, 2, 34] }]]);
    seg('z', -28, -46, -10, [[-28, 8, 'oneway']]); seg('z', 28, -46, -10, [[-28, 8, 'oneway']]);
    seg('x', -46, -80, 80, [[0, 14, 'key:red', { ref: 'boss' }]]);
    // salas secretas: A (tiro na parede rachada), B (painel, ala Beta), C (painel, praça)
    seg('z', -66, 6, 16, [[11, 8, 'crack']]); seg('x', 6, -78, -66); seg('x', 16, -78, -66);
    seg('z', 66, 24, 36, [[30, 6, 'secret']]); seg('x', 24, 66, 78); seg('x', 36, 66, 78);
    seg('x', 62, -78, -62, [[-70, 6, 'secret']]); seg('z', -62, 62, 78);

    // verticalidade: mezanino + escada (ala Alfa), ponte pelo arco, galeria no átrio, elevador
    stairs(-58, -46, 8, 24, 'z', 1, 12);
    deck(-76, -30, 24, 38); deck(-30, -17, 27, 33); deck(-25, -17, 4, 36); deck(-25, 25, -8, 4); deck(-4, 4, 4, 20);
    const [la, lb] = mr(-4, 4), lift = { h: 0, t: 0 }; L.lift = lift;
    L.lm = B((la + lb) / 2, 0, 24, 8, .5, 8, mat(0x9ca3af, 0x222222)); L.lm.position.y = -.2;
    surf.push({ x0: la, x1: lb, z0: 20, z1: 28, lift });
    things.push({ x: (la + lb) / 2, z: 24, r: 7, txt: () => '[E] Elevador ' + (lift.t ? '▼ descer' : '▲ subir'), act: () => { lift.t = lift.t ? 0 : UP; audio.playPickup(); } });
    // cofre da galeria (chave vermelha): grade permite VER a chave de baixo; abre com 3 interruptores
    mkDoor('x', X(20), -1, 10, 'sw', { y0: UP, h: 5, lv: 1, ref: 'vault' });
    bars('z', X(15), -4.5, 7, UP, 5, 1);
    key('red', X(20), -5, UP); gen(-60, -28); gen(60, -28);
    sw(-40, 10, 0); sw(-20, -4, UP); sw(60, 2, 0);

    // arena do chefe (aberta) e checkpoint
    const af = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2, ARENA - 46), mat(new THREE.Color(EP.floorColor).offsetHSL(0, 0, .07).getHex())); af.rotation.x = -Math.PI / 2; af.position.set(0, .03, -64); addObj(af);
    const ring = new THREE.Mesh(new THREE.RingGeometry(12, 13.5, 48), new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: .6, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, .06, -64); addObj(ring);
    const bl = new THREE.PointLight(0xff4422, 1.6, 70); bl.position.set(0, 8, -64); addObj(bl);
    [-70, 70].forEach(cx => [-54, -64, -74].forEach(cz => { B(cx, 0, cz, 3, H, 3, WALL, 1); colliders.push({ x: cx, z: cz, r: 1.9 }); }));
    // pilares/coberturas nas alas e no átrio (térreo)
    [[-40, 18], [-66, 0], [52, 28], [66, 10], [40, 0], [-14, 30], [14, 14], [14, 32], [-14, 14], [-52, -24], [-40, -34], [52, -24], [40, -34], [-14, -24], [14, -34]].forEach(([x, z]) => { x *= M; B(x, 0, z, 3.4, H, 3.4, WALL, 1); colliders.push({ x, z, r: 2.1, lv: 0 }); });

    // itens, chaves, terminais, segredos
    key('yellow', X(-70), 31, UP); key('blue', X(72), 2, 0);
    terminal(X(60), 8, 0, () => { L.known = true; toast('📟 CÓDIGO DO TERMINAL: ' + L.seq.map(i => DN[i]).join(' ') + ' — use na porta de segurança!'); }, 'Ler terminal de dados');
    terminal(0, 76, 0, () => toast('📜 ' + LORE[index]), 'Ler registro');
    terminal(X(-60), -40, 0, () => toast('📜 ' + LORE[(index + 3) % 8]), 'Ler registro');
    terminal(0, -41, 0, () => { setCheckpoint(3); toast('💾 CHECKPOINT salvo na sala do reator'); }, 'Salvar checkpoint');
    [[-30, 70], [30, 70], [X(-36), 26], [X(-14), 20], [X(60), 20], [X(-45), -30], [X(55), -30], [-12, -20], [12, -20], [-28, -53], [28, -53]].forEach(([x, z]) => heal(x, z));
    [[-10, 50], [10, 50], [-45, 20], [45, 20], [0, 34], [-60, -20], [60, -20], [-8, -18], [8, -18], [0, -24]].forEach(([x, z]) => { ammo(X(x) , z); ammo(X(x) + 2, z + 2); });
    chest(X(-73), 11, EP.secretLoot); ammo(X(-72), 8); ammo(X(-72), 14);                 // sala secreta A
    heal(X(71), 28); heal(X(71), 32); chest(X(75), 30); terminal(X(76), 26, 0, () => toast('📜 "Não existe ovo de Páscoa aqui. Nenhum." — Ass.: o Ovo'), 'Ler bilhete');
    const gold = new THREE.Group(), gm = mat(0xfacc15, 0xca8a04);                         // sala B: Galinha de Ouro
    [[0, 1.3, 0, 1.6], [0, 2.7, .6, .8]].forEach(([a, b, c, r]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), gm); s.position.set(a, b, c); gold.add(s); });
    const cm = new THREE.Mesh(new THREE.BoxGeometry(.3, .5, .6), mat(0xef4444, 0xb91c1c)); cm.position.set(0, 3.6, .6); gold.add(cm); gold.position.set(X(71), 0, 30); add(gold); let pet = false;
    things.push({ x: X(71), z: 30, r: 4, txt: () => pet ? null : '[E] Acariciar a Galinha de Ouro', act: () => { if (pet) return; pet = true; gameState.feathers += 150; gameState.stats.feathers += 150; updateHUD(); toast('🐔✨ A Galinha de Ouro botou 150 penas e disse "cocoricó" em latim.'); } });
    [[-74, 70], [-74, 74], [-68, 74]].forEach(([x, z]) => heal(X(x), z)); chest(X(-72), 66);   // sala C: frango frito
    terminal(X(-67), 68, 0, () => { gameState.shield = Math.min(100, gameState.shield + 50); updateHUD(); toast('🍗 SALA DO FRANGO FRITO: +50 de escudo. Canibalismo? Que nada, é só milho.'); }, 'Comer o frango frito (?)');
    [[-52, 40], [0, 40], [52, 40], [0, -10], [0, -46]].forEach(([x, z]) => [-1, 1].forEach(s => addTorch(x + s * 9, 4.6, z + (z > 0 ? 2 : -2))));

    // populações: despertam quando o jogador entra na sala
    const R = (x0, x1, z0, z1, n) => { const [a, b] = mr(x0, x1); rooms.push({ x0: a, x1: b, z0, z1, n: Math.max(2, Math.round(n * EP.enemiesToKill / 28)) }); };
    R(-78, -30, -8, 38, 6); R(30, 78, -8, 38, 7); R(-26, 26, -8, 38, 5); R(-78, -30, -44, -12, 6); R(-26, 26, -44, -12, 5);
    playerObj.position.set(0, PLAYER_HEIGHT, 62); yaw = 0; pitch = 0; velocityY = 0; velX = 0; velZ = 0; playerObj.rotation.set(0, 0, 0); camera.rotation.set(0, 0, 0);
    gameState.killsInEpoch = 0; gameState.bossSpawned = false; gameState.bossEntity = null;
    spawnIn(-30, 30, 46, 74, Math.max(2, Math.round(3 * EP.enemiesToKill / 28)));
    quakeify(EP.skyColor, EP.fogColor, true); hudKeys(); updateHUD();
    toast('📍 ' + EP.name + ' — explore! Chaves, geradores e segredos abrem o caminho até o chefe.');
};

// ---- loop da fase ----
function nearThing() {
    const lv = plv(); let best = null, bd = 1e9;
    things.forEach(t => { if (t.lv !== undefined && t.lv !== lv) return; const d = near(t.x, t.z); if (d < t.r && d < bd && t.txt && t.txt()) { best = t; bd = d; } });
    return best;
}
updateLevel = function () {
    if (!L) return;
    const p = playerObj.position, now = performance.now(), dt = Math.min((now - L.t0) / 1000, .1); L.t0 = now;
    rooms.forEach(r => { if (!r.done && (r.fl === undefined || r.fl === plv()) && p.x > r.x0 && p.x < r.x1 && p.z > r.z0 && p.z < r.z1) { r.done = 1; spawnIn(r.x0 + 4, r.x1 - 4, r.z0 + 4, r.z1 - 4, r.n, undefined, r.fl); } });
    doors.forEach(d => { if (d.anim) { d.g.position.y -= .22; if (d.g.position.y < -12) { d.anim = 0; d.g.visible = false; } } });
    const l = L.lift, dd = l.t - l.h; if (Math.abs(dd) > .01) { l.h += Math.sign(dd) * Math.min(Math.abs(dd), 5 * dt); L.lm.position.y = l.h - .2; }
    for (let i = pk.length - 1; i >= 0; i--) { const k = pk[i]; k.mesh.rotation.y += .04; if (near(k.x, k.z) < 2.8 && Math.abs(feet() - k.y) < 3) { scene.remove(k.mesh); pk.splice(i, 1); k.fn(); } }
    doors.forEach(d => { const th = things.find(t => t.x === d.x && t.z === d.z && t.auto); if (th) th.auto(); });
    secretWalls.forEach(s => { if (s.hp <= 0) s.done = 1; });
    const t = nearThing(), el = document.getElementById('hub-hint'), hint = t ? t.txt() : '';
    el.innerText = hint; el.classList.toggle('hidden', !hint);
    if (!gameState.bossSpawned && L.boss.open && p.z < -52) { gameState.bossSpawned = true; spawnEnemy(EP.chickenType, true, 3); toast('⚠️ O CHEFE DESPERTOU!'); }
};
interact = function () { if (gameState.inHub) return _int(); if (!L) return; const t = nearThing(); if (t && t.act) t.act(); };
respawnAtCheckpoint = function () {
    const cp = gameState.checkpoint;
    if (!cp || !EPOCHS[cp.epoch]) { loadHub(); return; }
    gameState.currentEpochIndex = cp.epoch; loadEpochLevel(cp.epoch);
    if ((cp.stage | 0) >= 3) {   // checkpoint do reator: tudo liberado até a porta do chefe
        L.gens = 2; Object.keys(KC).forEach(c => L.keys[c] = 1); L.sw = 3;
        doors.forEach(d => { if (d.o.ref !== 'boss' && d.t !== 'secret') openDoor(d); }); rooms.forEach(r => r.done = 1);
        enemies.forEach(e => scene.remove(e.mesh)); enemies = []; hudKeys();
        velX = 0; velZ = 0; playerObj.position.set(0, PLAYER_HEIGHT, -40);
    }
    gameState.health = gameState.maxHealth; gameState.shield = Math.max(gameState.shield, 50); refillAllAmmo(); updateHUD();
    toast('📍 Checkpoint: ' + EPOCHS[cp.epoch].name + ' — ' + (CP_NAMES[cp.stage | 0] || CP_NAMES[0]));
};
CP_NAMES[1] = CP_NAMES[2] = 'Reator (chefe à frente)';

/* ===== MAPAS 3.0: identidade própria por era (1 Exploração · 2 Arena · 3 Vertical) ===== */
const _std = loadEpochLevel, _stdU = updateLevel, GEN = [e1, e2, e3, e4, e5, e6, e7, e8];
loadEpochLevel = function (i) { window.TOPFL = 1; if (!GEN[i]) return _std(i); base(i); GEN[i](i); finish(i); };
updateLevel = function () { _stdU(); if (L && L.upd) L.upd(); };
const R = (x0, x1, z0, z1, n) => rooms.push({ x0, x1, z0, z1, n: Math.max(2, Math.round(n * EP.enemiesToKill / 28)) });
const tree = (x, z) => { B(x, 0, z, 3.4, H, 3.4, WALL, 1); colliders.push({ x, z, r: 2.1 }); };
function base(index) {
    EP = EPOCHS[index]; const rnd = mulberry(index * 7919 + 13); clearWorld(); gameState.inHub = false; Q.torches = []; Q.sky = []; M = 1;
    L = { keys: {}, gens: 0, sw: 0, known: false, seq: [0, 0, 0].map(() => Math.floor(rnd() * 4)), t0: performance.now(), lift: { h: 0, t: 0 }, lm: { position: { y: 0 } }, links: [] };
    scene.background = new THREE.Color(EP.skyColor); scene.fog = new THREE.FogExp2(EP.fogColor, 0.015);
    WALL = mat(EP.wallColor); BARM = mat(0x2b2b2b); DECKM = mat(new THREE.Color(EP.wallColor).offsetHSL(0, 0, -.08).getHex());
    addObj(new THREE.AmbientLight(0xffffff, 0.55)); const sun = new THREE.DirectionalLight(0xffedd5, 0.85); sun.position.set(40, 80, 40); addObj(sun);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2 + 10, ARENA * 2 + 10), mat(EP.floorColor)); fl.rotation.x = -Math.PI / 2; addObj(fl);
    [[0, -ARENA, ARENA * 2 + 2, 2], [0, ARENA, ARENA * 2 + 2, 2], [-ARENA, 0, 2, ARENA * 2], [ARENA, 0, 2, ARENA * 2]].forEach(([x, z, w, d]) => B(x, 0, z, w, H, d, WALL, 1));
    seg('x', -46, -80, 80, [[0, 14, 'key:red', { ref: 'boss' }]]);
    const ring = new THREE.Mesh(new THREE.RingGeometry(12, 13.5, 48), new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: .6, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(0, .06, -64); addObj(ring);
    const bl = new THREE.PointLight(0xff4422, 1.6, 70); bl.position.set(0, 8, -64); addObj(bl);
    terminal(0, -41, 0, () => { setCheckpoint(3); toast('💾 CHECKPOINT salvo'); }, 'Salvar checkpoint');
    [[-52, 40], [0, 40], [52, 40], [0, -10]].forEach(([x, z]) => [-1, 1].forEach(s => addTorch(x + s * 9, 4.6, z)));
}
function finish() {
    const st = L.start || [0, 0, 62]; playerObj.position.set(st[0], st[1] + PLAYER_HEIGHT, st[2]); yaw = 0; pitch = 0; velocityY = 0; velX = 0; velZ = 0; playerObj.rotation.set(0, 0, 0); camera.rotation.set(0, 0, 0);
    gameState.killsInEpoch = 0; gameState.bossSpawned = false; gameState.bossEntity = null;
    quakeify(EP.skyColor, EP.fogColor, true); hudKeys(); updateHUD();
}
// ===== ARMADILHAS (visual) =====
// Placa de espinhos: base de pedra com borda de alerta; os espinhos metálicos saem do chão quando ativa.
// Aviso: nos últimos ~0,65 s antes de ativar a borda pisca e os espinhos tremem; ativa: brilho vermelho.
const TRAP_GEO = new THREE.ConeGeometry(.2, 1.5, 6);
function mkTrap(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.4, .16, 5.4), new THREE.MeshLambertMaterial({ color: 0x2b2b30 })); base.position.y = .08; g.add(base);
    const hole = new THREE.Mesh(new THREE.BoxGeometry(4.4, .02, 4.4), new THREE.MeshBasicMaterial({ color: 0x08080a })); hole.position.y = .17; g.add(hole);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    [[0, -2.55, 5.4, .3], [0, 2.55, 5.4, .3], [-2.55, 0, .3, 4.8], [2.55, 0, .3, 4.8]].forEach(([a, b, w, d]) => { const r = new THREE.Mesh(new THREE.BoxGeometry(w, .08, d), rimMat); r.position.set(a, .19, b); g.add(r); });
    [[-2.55, -2.55], [2.55, -2.55], [-2.55, 2.55], [2.55, 2.55]].forEach(([a, b]) => { const p = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshLambertMaterial({ color: 0x3f3f46 })); p.position.set(a, .25, b); g.add(p); });
    const sm = new THREE.MeshLambertMaterial({ color: 0xc4c8d0, emissive: 0x000000 }), spikes = [];
    for (let i = -1.5; i <= 1.5; i += 1) for (let j = -1.5; j <= 1.5; j += 1) {
        const c = new THREE.Mesh(TRAP_GEO, sm); c.position.set(i * 1.05, .1, j * 1.05); c.scale.y = .001; c.visible = false; g.add(c); spikes.push(c);
    }
    const gl = new THREE.MeshBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    const glow = new THREE.Mesh(new THREE.CircleGeometry(3.7, 24), gl); glow.rotation.x = -Math.PI / 2; glow.position.y = .24; g.add(glow);
    add(g);
    return { x, z, g, spikes, sm, gl, rimMat, ext: -1 };
}
function trapFx(t, now, off) {
    const s = ((now / 1000) + off) % 3, on = s < 1.2;
    let e = 0, warn = 0;
    if (on) e = Math.min(1, s / .09) * (s > 1 ? Math.max(0, (1.2 - s) / .2) : 1);
    else if (s > 2.35) { warn = (s - 2.35) / .65; e = .12 * warn * (.5 + .5 * Math.sin(now / 30)); }
    if (Math.abs(e - t.ext) > .004) {
        t.ext = e;
        t.spikes.forEach(c => { c.visible = e > .02; c.scale.y = Math.max(e, .001); c.position.y = .1 + .75 * e; });
    }
    const blink = Math.sin(now / 55) > 0;
    t.rimMat.color.setHex(on ? 0xff3b1f : warn > 0 ? (blink ? 0xffffff : 0xff9a1f) : 0xfacc15);
    t.sm.emissive.setHex(on && e > .5 ? 0x7a1a10 : 0x000000);
    if (on) { t.gl.color.setHex(0xff2a1a); t.gl.opacity = .5 * Math.min(1, s / .09) * (s > 1 ? Math.max(0, (1.2 - s) / .2) : 1); }
    else if (warn > 0) { t.gl.color.setHex(0xffb020); t.gl.opacity = .1 + .3 * warn * (.5 + .5 * Math.sin(now / 60)); }
    else t.gl.opacity = 0;
    return on;
}
// Piso que desmorona (Era 7): borda de pedra, rachaduras ao pisar, brilho de lava quando cede.
function mkTile(x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z);
    const m = mat(0x57534e, 0);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(11, .1, 11), m); slab.position.y = .03; g.add(slab);
    const edge = new THREE.MeshLambertMaterial({ color: 0x3a3733 });
    [[0, -5.4, 11, .35], [0, 5.4, 11, .35], [-5.4, 0, .35, 11], [5.4, 0, .35, 11]].forEach(([a, b, w, d]) => { const e = new THREE.Mesh(new THREE.BoxGeometry(w, .14, d), edge); e.position.set(a, .07, b); g.add(e); });
    const cm = new THREE.MeshBasicMaterial({ color: 0x1a0500 }), cracks = new THREE.Group(); cracks.visible = false;
    [[-2, -1, 6, .18, .5], [1.5, 1.5, .18, 5, 0], [-1, 2.5, 4, .18, -.6], [2, -2.5, .18, 4, .3], [0, 0, 3, .18, .9]].forEach(([a, b, w, d, r]) => { const c = new THREE.Mesh(new THREE.BoxGeometry(w, .02, d), cm); c.position.set(a, .12, b); c.rotation.y = r; cracks.add(c); });
    g.add(cracks);
    const lg = new THREE.MeshBasicMaterial({ color: 0xff5a14, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), lg); glow.rotation.x = -Math.PI / 2; glow.position.y = .18; g.add(glow);
    add(g);
    return { x, z, m, s: 0, t: 0, g, cracks, lg };
}
function tileFx(k, now) {
    if (k.s === 0) return;
    if (k.s === 1) {
        k.cracks.visible = true; k.g.position.set(k.x + (Math.random() - .5) * .2, 0, k.z + (Math.random() - .5) * .2);
        k.lg.color.setHex(0xffb020); k.lg.opacity = .1 + .12 * (.5 + .5 * Math.sin(now / 45));
    } else {
        k.g.position.set(k.x, 0, k.z); k.cracks.visible = true;
        k.lg.color.setHex(0xff5a14); k.lg.opacity = .5 + .2 * Math.sin(now / 160 + k.x * .3 + k.z * .2);
    }
}
// ---- ERA 1 · EXPLORAÇÃO: chaves e portas; 3 relíquias; o templo emerge ----
function relic(x, z) {
    const g = new THREE.Mesh(new THREE.OctahedronGeometry(.9), mat(0x22d3ee, 0x0e7490)); g.position.set(x, 2.2, z); add(g);
    pk.push({ mesh: g, x, z, y: 0, fn: () => {
        L.rel = (L.rel || 0) + 1; audio.playPickup(); toast('🗿 RELÍQUIA ' + L.rel + '/3');
        if (L.rel === 3) { L.keys.red = 1; hudKeys(); toast('🌋 O VULCÃO ESTREMECE! O TEMPLO EMERGE — o portão do chefe se abriu!'); openDoor(L.boss); }
    } });
}
function e1() {
    seg('x', 20, -80, 80, [[-50, 10, 'key:yellow'], [50, 10, 'key:blue'], [0, 8, 'bars']]);   // praça | zonas
    seg('z', -14, -46, 20); seg('z', 14, -46, 20, [[-10, 8, 'crack']]);                        // zona Oeste | centro (segredo) | zona Leste
    key('yellow', -30, 50, 0); key('blue', -30, -30, 0);
    relic(-55, -20); relic(55, -20); relic(0, -28);
    [[-40, 40], [40, 40], [-20, 60], [20, 60], [-30, -10], [30, -30]].forEach(([x, z]) => tree(x, z));
    [[-60, 60], [60, 60], [-30, 0], [30, 0], [0, -10]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z + 2); });
    R(-78, -18, -44, 18, 3); R(18, 78, -44, 18, 3); spawnIn(-60, 60, 30, 70, 3);
    terminal(0, 70, 0, () => toast('📜 ' + LORE[0] + ' Três relíquias abrem o templo: duas atrás de portas, uma atrás de uma parede rachada.'), 'Ler registro');
    toast('📍 ' + EP.name + ' — EXPLORE: ache as chaves, abra as portas e recupere as 3 relíquias!');
}
// ---- ERA 2 · ARENA: 3 ondas + armadilhas; os portões abrem e a horda invade ----
function e2() {
    L.wave = 0; L.on = false; L.tt = 0; L.traps = [];
    [[-30, 10], [30, 10], [0, -20], [-45, -25], [45, -25]].forEach(([x, z]) => { L.traps.push(mkTrap(x, z)); });
    [[-20, 30], [20, 30], [-20, -10], [20, -10], [-60, 10], [60, 10]].forEach(([x, z]) => tree(x, z));
    [[-60, 50], [60, 50], [0, 30], [0, -30]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); });
    const spawnW = (n) => { const before = enemies.length; spawnIn(-70, 70, -40, 40, n, L); return enemies.length - before; };
    things.push({ x: 0, z: 50, r: 6,
        txt: () => L.wave >= 3 && !L.on ? '🏆 Arena vencida — siga ao norte, o portão do chefe está aberto' : L.on ? '⚔️ Onda ' + L.wave + '/3 — restam ' + alive(L) + ' galinhas' : '[E] Tocar o sino (onda ' + (L.wave + 1) + '/3)',
        act: () => {
            if (L.on || L.wave >= 3) return; L.on = true; L.wave++; L.k0 = gameState.killsInEpoch;
            const n = Math.max(3, Math.round([5, 8, 12][L.wave - 1] * EP.enemiesToKill / 28));
            let got = spawnW(n);
            if (L.wave === 3) { toast('🚪 OS PORTÕES SE ABRIRAM — A HORDA INVADE!'); audio.playExplosion(); const m = Math.max(2, Math.round(4 * EP.enemiesToKill / 28)); spawnIn(-70, 70, 30, 70, m, L); got += m; }
            L.need = got; toast('⚔️ ONDA ' + L.wave + '/3 — ' + got + ' galinhas!');
        } });
    B(0, 0, 50, 1.2, 2.6, 1.2, mat(0xfacc15, 0x854d0e));
    L.upd = () => {
        const now = performance.now();
        if (L.on && (alive(L) === 0 || gameState.killsInEpoch - L.k0 >= L.need)) {
            enemies.filter(e => e.arena === L).forEach(e => { scene.remove(e.mesh); enemies.splice(enemies.indexOf(e), 1); });
            L.on = false;
            if (L.wave < 3) { heal(0, 20); ammo(4, 20); ammo(-4, 20); toast('✅ Onda limpa! Recursos no centro. Toque o sino de novo.'); }
            else { L.keys.red = 1; hudKeys(); openDoor(L.boss, '🏆 ARENA VENCIDA! Portão do chefe aberto.'); }
        }
        L.traps.forEach((t, i) => {
            const on = trapFx(t, now, i * .7);
            if (on && near(t.x, t.z) < 3 && feet() < 1.5 && now - L.tt > 600) { L.tt = now; applyPlayerDamage(5); audio.playHit(); }
        });
    };
    toast('📍 ' + EP.name + ' — ARENA! Toque o sino e sobreviva a 3 ondas. Cuidado com as placas vermelhas!');
}
// ---- ERA 3 · VERTICAL: mezanino, código, elevador, chave no topo; a ponte desmorona ----
function e3() {
    seg('x', 14, -80, 80, [[0, 8, 'puzzle']]);
    stairs(-60, -48, 20, 36, 'z', 1, 12); deck(-60, -20, 36, 60);
    terminal(-40, 48, UP, () => { L.known = true; toast('📟 CÓDIGO: ' + L.seq.map(i => DN[i]).join(' ') + ' — use na porta de segurança!'); }, 'Ler terminal de dados');
    const lift = L.lift; L.lm = B(0, 0, -8, 8, .5, 8, mat(0x9ca3af, 0x222222)); L.lm.position.y = -.2;
    surf.push({ x0: -4, x1: 4, z0: -12, z1: -4, lift });
    things.push({ x: 0, z: -8, r: 7, txt: () => '[E] Elevador ' + (lift.t ? '▼ descer' : '▲ subir'), act: () => { lift.t = lift.t ? 0 : UP; audio.playPickup(); } });
    deck(-20, 20, -30, -12); const dm = levelObstacles[levelObstacles.length - 1], sf = surf[surf.length - 1];
    key('red', 0, -24, UP); const kp = pk[pk.length - 1], f0 = kp.fn;
    kp.fn = () => { f0(); toast('💥 A PONTE DESMORONA!'); audio.playExplosion(); scene.remove(dm); const i = surf.indexOf(sf); if (i >= 0) surf.splice(i, 1); };
    [[-30, 40], [30, 40], [30, 60], [-20, -30], [20, -40]].forEach(([x, z]) => tree(x, z));
    [[-50, 30], [50, 30], [-10, 30], [-30, -20], [30, -20]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); });
    R(-30, 30, -44, -16, 5); spawnIn(-50, 50, 28, 70, 3);
    toast('📍 ' + EP.name + ' — SUBA: ache o código no mezanino, abra a porta e alcance o topo!');
}

// ---- ERA 4 · CYBERPUNK (híbrido): teletransporte + alteração do mapa; hackear 3 nós, a muralha cai ----
function pad(x, z, tx, tz, lab) {
    B(x, 0.02, z, 4, .1, 4, mat(0x22d3ee, 0x0e7490));
    things.push({ x, z, r: 3.5, txt: () => '[E] Teleportar ' + lab, act: () => { playerObj.position.set(tx, PLAYER_HEIGHT, tz); velX = 0; velZ = 0; audio.playPickup(); } });
}
function e4() {
    const W0 = Wl(0, 0, 156, T); L.nodes = 0;
    const node = (x, z, n) => { let on = false; terminal(x, z, 0, () => {
        if (on) return; on = true; L.nodes++; audio.playPickup(); toast('💻 NÓ ' + L.nodes + '/3 hackeado'); spawnIn(x - 20, x + 20, z - 14, z + 14, 3);
        if (L.nodes === 3) {
            scene.remove(W0.mesh); const i = colliders.indexOf(W0.c); if (i >= 0) colliders.splice(i, 1); nav.ver++;
            L.keys.red = 1; hudKeys(); audio.playExplosion(); toast('🏙️ OS PRÉDIOS SE RECONFIGURAM — a muralha caiu e o portão do chefe abriu!'); openDoor(L.boss);
        }
    }, 'Hackear nó ' + n); };
    node(-45, 45, 1); node(-45, -25, 2); node(45, -30, 3);
    pad(45, 45, 40, -15, '→ Distrito Norte'); pad(-30, -10, -30, 38, '→ Praça');
    [[-20, 55], [20, 55], [-60, 20], [60, 20], [-20, -20], [20, -20], [60, -10]].forEach(([x, z]) => tree(x, z));
    [[-60, 60], [60, 60], [0, 30], [-60, -30], [60, -40]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); });
    R(-78, 78, -44, -6, 6); spawnIn(-60, 60, 28, 70, 4);
    toast('📍 ' + EP.name + ' — ATIVE 3 NÓS: use os teletransportes para chegar ao Distrito Norte!');
}
// ---- ERA 5 · TUMBA (labirinto): puzzle de caminhos + armadilhas; pegar a máscara solta a múmia gigante ----
function e5() {
    const rnd = mulberry(5 * 7919 + 3), NX = 10, NZ = 7, CS = 12, X0 = -60, Z0 = -42, ps = new Set();
    const ky = (a, b, c, d) => a + ',' + b + '>' + c + ',' + d, pass = (a, b, c, d) => ps.has(ky(a, b, c, d)) || ps.has(ky(c, d, a, b)), seen = new Set(['5,6']), st = [[5, 6]];
    while (st.length) {
        const [i, j] = st[st.length - 1], nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [i + a, j + b]).filter(([a, b]) => a >= 0 && a < NX && b >= 0 && b < NZ && !seen.has(a + ',' + b));
        if (!nb.length) { st.pop(); continue; }
        const [a, b] = nb[Math.floor(rnd() * nb.length)]; ps.add(ky(i, j, a, b)); seen.add(a + ',' + b); st.push([a, b]);
    }
    for (let k = 0; k < 12; k++) { const i = 1 + Math.floor(rnd() * (NX - 1)), j = Math.floor(rnd() * NZ); ps.add(ky(i - 1, j, i, j)); }   // loops
    for (let j = 0; j <= NZ; j++) for (let i = 0; i < NX; i++) if (!(i === 5 && (j === 0 || j === NZ)) && (j === 0 || j === NZ || !pass(i, j - 1, i, j))) Wl(X0 + i * CS + CS / 2, Z0 + j * CS, CS + T, T);
    for (let i = 0; i <= NX; i++) for (let j = 0; j < NZ; j++) if (i === 0 || i === NX || !pass(i - 1, j, i, j)) Wl(X0 + i * CS, Z0 + j * CS + CS / 2, T, CS + T);
    const dist = { '5,6': 0 }, q = [[5, 6]]; let far = [5, 6];
    while (q.length) { const [i, j] = q.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const x = i + a, y = j + b; if (x >= 0 && x < NX && y >= 0 && y < NZ && dist[x + ',' + y] === undefined && pass(i, j, x, y)) { dist[x + ',' + y] = dist[i + ',' + j] + 1; q.push([x, y]); if (dist[x + ',' + y] > dist[far.join()]) far = [x, y]; } }); }
    const cc = (i, j) => [X0 + (i + .5) * CS, Z0 + (j + .5) * CS];
    const [mx, mz] = cc(far[0], far[1]), mk = new THREE.Mesh(new THREE.OctahedronGeometry(1), mat(0xfacc15, 0xca8a04)); mk.position.set(mx, 2.2, mz); add(mk);
    pk.push({ mesh: mk, x: mx, z: mz, y: 0, fn: () => {
        L.keys.red = 1; hudKeys(); audio.playExplosion(); toast('😱 A MÁSCARA! Uma MÚMIA GIGANTE desperta e vai te perseguir — fuja pela saída norte!');
        spawnIn(-6, 6, 30, 44, 1, L); const e = enemies[enemies.length - 1]; if (e) { e.mesh.scale.setScalar(2.4); e.hp *= 5; e.maxHp = e.hp; e.speed *= 1.9; }
    } });
    L.traps = []; for (let k = 0; k < 7; k++) { const [i, j] = [Math.floor(rnd() * NX), Math.floor(rnd() * NZ)], [x, z] = cc(i, j); if (dist[i + ',' + j] < 3 || (i === far[0] && j === far[1])) continue; L.traps.push(mkTrap(x, z)); }
    for (let k = 0; k < 5; k++) { const [x, z] = cc(Math.floor(rnd() * NX), Math.floor(rnd() * NZ)); heal(x + 3, z); if (k < 3) ammo(x - 3, z); }
    L.tt = 0; L.upd = () => { const now = performance.now(); L.traps.forEach((t, i) => { const on = trapFx(t, now, i * .8); if (on && near(t.x, t.z) < 3 && now - L.tt > 600) { L.tt = now; applyPlayerDamage(5); audio.playHit(); } }); };
    spawnIn(-40, 40, 46, 72, 3); R(-58, 58, -40, 40, 6);
    toast('📍 ' + EP.name + ' — LABIRINTO: entre pelo sul, ache a MÁSCARA no ponto mais fundo e saia pelo norte. Cuidado com as placas!');
}
// ---- ERA 6 · PÂNTANO (sobrevivência): a maré sobe, o caminho some; sobreviva na plataforma até a maré baixar ----
function e6() {
    L.t6 = performance.now(); L.fl = 0; L.tt = 0; L.nx = 0; L.sp = 0; L.fin = 0;
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2, ARENA * 2), new THREE.MeshBasicMaterial({ color: 0x2a6b4a, transparent: true, opacity: .55 })); wm.rotation.x = -Math.PI / 2; wm.position.y = -1; add(wm);
    deck(-30, 30, -24, 16); stairs(-6, 6, 16, 32, 'z', -1, 12);
    [[-20, 0], [20, 0], [0, -14]].forEach(([x, z]) => heal(x, z, UP)); chest(0, -8, null, UP);
    [[-50, 50], [50, 50], [-50, 0], [50, 0], [-30, 30], [30, 30]].forEach(([x, z]) => { tree(x, z); heal(x + 3, z + 3); });
    spawnIn(-60, 60, 28, 70, 3);
    L.upd = () => {
        const now = performance.now(), t = (now - L.t6) / 1000;
        if (t >= 30 && !L.fl) { L.fl = 1; audio.playExplosion(); toast('🌊 O PÂNTANO ALAGA! O caminho antigo sumiu — suba na plataforma e sobreviva!'); }
        if (L.fl && !L.fin) {
            wm.position.y = Math.min(.5, -1 + (t - 30) * .05);
            if (feet() < 1.5 && now - L.tt > 700) { L.tt = now; applyPlayerDamage(4); audio.playHit(); }
            if (now - L.sp > 7000) { L.sp = now; spawnIn(-70, 70, -40, 70, 2, L); }
            if (now - L.nx > 20000) { L.nx = now; toast('⏳ A maré baixa em ' + Math.max(0, Math.round(100 - t)) + 's'); }
            if (t >= 100) { L.fin = 1; wm.position.y = -1; L.keys.red = 1; hudKeys(); openDoor(L.boss, '🌅 A MARÉ BAIXOU! Portão do chefe aberto.'); }
        }
    };
    toast('📍 ' + EP.name + ' — SOBREVIVA: a maré sobe em 30s. Corra para a plataforma ao norte do pântano!');
}

// ---- ERA 7 · GALINHEIRO INFERNAL (corrida/fuga): lava sobe do sul, o chão desmorona, eventos dinâmicos ----
function e7() {
    const lm = new THREE.Mesh(new THREE.BoxGeometry(160, .3, 1), new THREE.MeshBasicMaterial({ color: 0xff4a1a })); lm.position.set(0, .1, 100); add(lm);
    L.front = 90; L.last = performance.now(); L.t7 = L.last; L.tt = 0; L.tt2 = 0; L.sp = 0; L.fin = 0; L.tiles = [];
    for (let i = -3; i <= 3; i++) for (let j = 0; j <= 4; j++) { const x = i * 12, z = 26 - j * 12; L.tiles.push(mkTile(x, z)); }
    [[-50, 45], [50, 45], [-30, 35], [30, 35], [-60, 0], [60, 0], [-50, -30], [50, -30], [0, -34]].forEach(([x, z]) => tree(x, z));
    [[-60, 55], [60, 55], [-45, 10], [45, 10], [0, -30], [-60, -20], [60, -20]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); });
    L.upd = () => {
        const now = performance.now(), dt = Math.min((now - L.last) / 1000, .1), t = (now - L.t7) / 1000, p = playerObj.position; L.last = now;
        if (!L.fin) {
            if (t > 8) L.front -= (1.5 + t * .008) * dt;
            lm.scale.z = Math.max(.1, 100 - L.front); lm.position.z = (L.front + 100) / 2;
            if (p.z > L.front && now - L.tt > 400) { L.tt = now; applyPlayerDamage(7); audio.playHit(); toast('🔥 A LAVA TE ALCANÇOU — CORRA PARA O NORTE!'); }
            L.tiles.forEach(k => {
                tileFx(k, now);
                if (k.s === 0 && feet() < 1.5 && Math.hypot(p.x - k.x, p.z - k.z) < 9) { k.s = 1; k.t = now; k.m.color.setHex(0xef4444); }
                else if (k.s === 1 && now - k.t > 1100) { k.s = 2; k.m.color.setHex(0xff4a1a); k.m.emissive.setHex(0xaa2200); }
                else if (k.s === 2 && feet() < 1.5 && Math.abs(p.x - k.x) < 5.5 && Math.abs(p.z - k.z) < 5.5 && now - L.tt2 > 500) { L.tt2 = now; applyPlayerDamage(8); audio.playHit(); }
            });
            if (now - L.sp > 6000 && p.z > -30) { L.sp = now; spawnIn(-60, 60, p.z - 45, p.z - 18, 2, L); }
            if (p.z < -38) { L.fin = 1; lm.visible = false; L.keys.red = 1; hudKeys(); openDoor(L.boss, '🚪 SAÍDA DE EMERGÊNCIA ABERTA! Você escapou da lava.'); }
        }
    };
    toast('📍 ' + EP.name + ' — FUJA! A lava sobe em 8s. Corra para o norte; o chão cede quando você pisa!');
}
// ---- ERA 8 · NÚCLEO CÓSMICO (boss + viagem no tempo): alterne Presente/Passado para alcançar os 2 cristais ----
function e8() {
    L.past = false; const A = [Wl(-42, 20, 72, T)], Bw = [Wl(42, 20, 72, T)]; Wl(0, 20, 12, T); seg('z', 0, -40, 18);
    const tog = () => {
        A.forEach(w => { w.mesh.visible = !L.past; const i = colliders.indexOf(w.c); if (!L.past && i < 0) colliders.push(w.c); if (L.past && i >= 0) colliders.splice(i, 1); });
        Bw.forEach(w => { w.mesh.visible = L.past; const i = colliders.indexOf(w.c); if (L.past && i < 0) colliders.push(w.c); if (!L.past && i >= 0) colliders.splice(i, 1); });
        const c = L.past ? 0x8b5a2b : EP.skyColor, f = L.past ? 0x6b4a2b : EP.fogColor; scene.background = new THREE.Color(c); scene.fog.color.set(f); nav.ver++;
    };
    tog(); B(0, 0, 50, 2, 3, 2, mat(0x818cf8, 0x4338ca));
    things.push({ x: 0, z: 50, r: 6, txt: () => '[E] Máquina do Tempo (' + (L.past ? 'voltar ao PRESENTE' : 'viajar ao PASSADO') + ')', act: () => { L.past = !L.past; tog(); audio.playExplosion(); toast(L.past ? '⏳ PASSADO: a passagem OESTE está aberta; a LESTE fechou.' : '⏳ PRESENTE: a passagem LESTE está aberta; a OESTE fechou.'); } });
    L.cr = 0;
    const crystal = (x, z) => { const g = new THREE.Mesh(new THREE.OctahedronGeometry(1), mat(0xe879f9, 0x86198f)); g.position.set(x, 2.2, z); add(g);
        pk.push({ mesh: g, x, z, y: 0, fn: () => { L.cr++; audio.playPickup(); toast('💎 CRISTAL DO TEMPO ' + L.cr + '/2');
            if (L.cr === 2) { L.keys.red = 1; hudKeys(); toast('⚡ A máquina do tempo está carregada — o portão do chefe se abriu!'); openDoor(L.boss); } } }); };
    crystal(45, -20); crystal(-45, -20);
    [[-30, 50], [30, 50], [-30, -10], [30, -10], [-60, 40], [60, 40]].forEach(([x, z]) => tree(x, z));
    [[-60, 55], [60, 55], [-45, 0], [45, 0]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); });
    R(6, 78, -44, 18, 5); R(-78, -6, -44, 18, 5); spawnIn(-60, 60, 28, 70, 4);
    toast('📍 ' + EP.name + ' — TEMPO: use a máquina para alternar Presente/Passado e pegar os 2 cristais!');
}

// ================= SALAS EXTRAS DO HUB (liberadas ao completar eras) =================
let curRoom = null, curShop = null, hubDoors = [];
const _P = (k, v) => () => { gameState.perm[k] += v; };
const _it = (id, icon, name, desc, cost, max, fn) => ({ id, icon, name, desc, cost, max, fn });
const _heal = c => _it('heal', '🍗', 'Frango Assado', '+1 item de cura (máx. 5, tecla H).', c, 0, () => { gameState.heals = Math.min(5, gameState.heals + 1); });
const _st = () => gameState.stats, _done = () => gameState.completed.slice(0, 8).filter(Boolean).length;
const HUB_ROOMS = [
    { id: 'r1', name: 'Salão dos Ancestrais', eras: [0, 1], b: -1.12, col: 0xd97706, floor: 0x5b4a32, wall: 0x7c5a2e,
      merchant: { name: 'Mercadora Ovilda', color: 0xfde68a, hat: 0x78350f, quote: '"Relíquias de outros tempos, fresquinhas!"', items: [_heal(15), _it('hp', '🏺', 'Tônico Ancestral', '+10 de vida máxima permanente.', 60, 3, _P('hp', 10)), _it('dmg', '🪨', 'Pedra de Afiar', '+5% de dano permanente.', 90, 3, _P('dmg', 0.05))] },
      quests: [
        { id: 'q6', npc: 'Veterano Gaspar', color: 0xfca5a5, title: 'Caçador de Ancestrais', desc: 'Abata 100 galinhas zumbis.', goal: 100, prog: () => _st().kills, reward: '+20 de vida máxima permanente', give: _P('hp', 20) },
        { id: 'q7', npc: 'Arqueóloga Penélope', color: 0xfde68a, title: 'Tesouro Ancestral', desc: 'Colete 500 penas ao todo.', goal: 500, prog: () => _st().feathers, reward: '+10% de dano permanente', give: _P('dmg', 0.1) }] },
    { id: 'r2', name: 'Armaria dos Cavaleiros', eras: [2, 3], b: -0.62, col: 0x38bdf8, floor: 0x374151, wall: 0x4b5563,
      merchant: { name: 'Sir Galo Mercante', color: 0xcbd5e1, hat: 0x1e3a8a, quote: '"Aço e circuitos, o melhor de dois mundos!"', items: [_heal(20), _it('dmg', '⚔️', 'Lâmina Reforçada', '+5% de dano permanente.', 120, 3, _P('dmg', 0.05)), _it('spd', '👢', 'Botas de Malha', '+5% de velocidade permanente.', 100, 3, _P('speed', 0.05))] },
      quests: [
        { id: 'q8', npc: 'Escudeiro Pio', color: 0xbfdbfe, title: 'Quebra-Escudos', desc: 'Abata 250 galinhas.', goal: 250, prog: () => _st().kills, reward: '+10% de velocidade permanente', give: _P('speed', 0.1) },
        { id: 'q9', npc: 'Hacker Byte', color: 0x93c5fd, title: 'Mestre dos Cofres', desc: 'Abra 5 câmaras secretas.', goal: 5, prog: () => _st().secrets, reward: '+20 de vida máxima permanente', give: _P('hp', 20) }] },
    { id: 'r3', name: 'Oásis Perdido', eras: [4, 5], b: 0.62, col: 0x65a30d, floor: 0x8a6a2a, wall: 0x6b7a3a,
      merchant: { name: 'Ra-Ovo, o Mercador', color: 0xfef08a, hat: 0x166534, quote: '"Do deserto ao pântano, eu vendo de tudo!"', items: [_heal(25), _it('hp', '🌿', 'Elixir do Pântano', '+10 de vida máxima permanente.', 100, 3, _P('hp', 10)), _it('spd', '🪽', 'Sandália Veloz', '+5% de velocidade permanente.', 130, 3, _P('speed', 0.05))] },
      quests: [
        { id: 'q10', npc: 'Beduíno Cocó', color: 0xfed7aa, title: 'Sede de Penas', desc: 'Colete 1200 penas ao todo.', goal: 1200, prog: () => _st().feathers, reward: '+15% de dano permanente', give: _P('dmg', 0.15) },
        { id: 'q11', npc: 'Xamã do Lodo', color: 0xbbf7d0, title: 'Limpa-Pântano', desc: 'Abata 500 galinhas.', goal: 500, prog: () => _st().kills, reward: '+25 de vida máxima permanente', give: _P('hp', 25) }] },
    { id: 'r4', name: 'Santuário Cósmico', eras: [6, 7], b: 1.12, col: 0xd946ef, floor: 0x1e1b4b, wall: 0x581c87,
      merchant: { name: 'Zéfiro do Vazio', color: 0xe9d5ff, hat: 0x3b0764, quote: '"O universo acaba... mas a promoção continua."', items: [_heal(30), _it('dmg', '🌌', 'Fragmento Temporal', '+8% de dano permanente.', 200, 3, _P('dmg', 0.08)), _it('hp', '💜', 'Essência Vital', '+20 de vida máxima permanente.', 180, 3, _P('hp', 20))] },
      quests: [
        { id: 'q12', npc: 'Viajante Tempus', color: 0xc4b5fd, title: 'Senhor do Tempo', desc: 'Derrote os chefes de 6 eras.', goal: 6, prog: _done, reward: '+10% de velocidade permanente', give: _P('speed', 0.1) },
        { id: 'q13', npc: 'Oráculo Ovo-Eterno', color: 0xf5d0fe, title: 'Fim dos Tempos', desc: 'Complete todas as 8 eras.', goal: 8, prog: _done, reward: '+30 de vida, +10% de dano e CHICKEN SHIFT (tecla F)', give: () => { gameState.perm.hp += 30; gameState.perm.dmg += 0.1; gameState.perm.chickenShift = true; } }] }
];
HUB_ROOMS.forEach(r => { r.shop = { id: r.id, npc: r.merchant.name, quote: r.merchant.quote, items: r.merchant.items }; QUESTS.push(...r.quests); });

window.hubClamp = function (nx, nz) {
    if (curRoom) return [Math.max(curRoom.cx - 14, Math.min(curRoom.cx + 14, nx)), Math.max(curRoom.cz - 14, Math.min(curRoom.cz + 14, nz))];
    const hr = Math.hypot(nx, nz), k = hr > 29 ? 29 / hr : 1; return [nx * k, nz * k];
};
function hubFade() {
    let f = document.getElementById('hub-fade');
    if (!f) { f = document.createElement('div'); f.id = 'hub-fade'; f.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:25'; document.body.appendChild(f); }
    f.style.transition = 'none'; f.style.opacity = 1;
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = 'opacity .45s'; f.style.opacity = 0; }));
}
function hubTp(x, z, ya) {
    playerObj.position.set(x, PLAYER_HEIGHT, z); yaw = ya; pitch = 0; velocityY = 0; velX = 0; velZ = 0;
    playerObj.rotation.set(0, ya, 0); camera.rotation.set(0, 0, 0); hubFade(); audio.playPickup();
}
function buildHubRooms() {
    hubDoors = []; curRoom = null;
    const mat = c => new THREE.MeshLambertMaterial({ color: c }), glow = c => new THREE.MeshBasicMaterial({ color: c });
    const bx = (w, h, d, m, x, y, z, g) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); g ? g.add(o) : addObj(o); return o; };
    const frame = (g, cs, col, ok) => {
        const sm = mat(0x4f4636);
        [-2, 2].forEach(s => bx(0.9, 5.6, 0.9, sm, s, 2.8, 0, g)); bx(5.2, 0.9, 1, sm, 0, 5.6, 0, g);
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 5), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: ok ? 0.55 : 0.35, side: THREE.DoubleSide }));
        pl.position.y = 2.5; g.add(pl); return pl;
    };
    const wood = mat(0x7c4a1e);
    HUB_ROOMS.forEach((r, i) => {
        const ok = r.eras.every(e => gameState.completed[e]), col = ok ? r.col : 0x7f1d1d, css = '#' + col.toString(16).padStart(6, '0');
        const dx = Math.sin(r.b) * 27.5, dz = Math.cos(r.b) * 27.5;
        const g = new THREE.Group(); g.position.set(dx, 0, dz); g.lookAt(0, 0, 0);
        const pl = frame(g, null, col, ok);
        const lb = makeLabel(r.name, ok ? '▶ ENTRAR' : '🔒 Eras ' + (r.eras[0] + 1) + ' e ' + (r.eras[1] + 1), css); lb.position.y = 8; g.add(lb);
        addObj(g); hubDoors.push({ r, x: dx, z: dz, ok, pl });
        if (!ok) return;
        // ---- interior da sala (longe do HUB, escondido pela parede e pela névoa) ----
        const cx = -150 + 100 * i, cz = 160, fl = mat(r.floor), wl = mat(r.wall); r.cx = cx; r.cz = cz;
        bx(30, 1, 30, fl, cx, -0.5, cz); bx(30, 1, 30, mat(0x1f1a14), cx, 9.5, cz);
        bx(30, 9, 1, wl, cx, 4.5, cz - 15); bx(30, 9, 1, wl, cx, 4.5, cz + 15); bx(1, 9, 30, wl, cx - 15, 4.5, cz); bx(1, 9, 30, wl, cx + 15, 4.5, cz);
        bx(10, 0.08, 20, new THREE.MeshLambertMaterial({ color: r.col, emissive: r.col, emissiveIntensity: 0.18 }), cx, 0.05, cz - 2);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { bx(1.6, 9, 1.6, wl, cx + a * 13.5, 4.5, cz + b * 13.5); bx(1.9, 0.5, 1.9, glow(r.col), cx + a * 13.5, 7.5, cz + b * 13.5); });
        const li = new THREE.PointLight(r.col, 1.4, 48); li.position.set(cx, 7, cz - 3); addObj(li);
        const ex = new THREE.Group(); ex.position.set(cx, 0, cz + 14.2); frame(ex, null, 0x22d3ee, true);
        const el = makeLabel('⬅ VOLTAR AO HUB', 'Saída', '#22d3ee'); el.position.y = 7.4; ex.add(el); addObj(ex);
        // mercador
        const m = r.merchant, stall = new THREE.Group(); stall.position.set(cx, 0, cz - 9);
        bx(7, 1.2, 1.6, wood, 0, 0.6, 0, stall); bx(8.4, 0.3, 4.5, mat(r.col), 0, 3.8, -0.8, stall);
        [-3.9, 3.9].forEach(s => bx(0.3, 3.8, 0.3, wood, s, 1.9, 1.2, stall));
        const sl = makeLabel('🛒 ' + m.name, 'Loja [E]', '#fbbf24'); sl.position.set(0, 5.8, 0); stall.add(sl); addObj(stall);
        colliders.push({ box: true, minX: cx - 3.5, maxX: cx + 3.5, minZ: cz - 9.8, maxZ: cz - 8.2 });
        const mn = createNpc(m.color, m.hat, 1.5); mn.position.set(cx, 0, cz - 11); addObj(mn);
        hubStations.push({ type: 'rshop', x: cx, z: cz - 9, range: 6, label: 'Falar com ' + m.name + ' (Loja)', npc: mn, room: r });
        // missões
        r.quests.forEach((q, j) => {
            const x = cx + (j ? 8 : -8), z = cz - 2, npc = createNpc(q.color, 0x7e22ce, 1.4); npc.position.set(x, 0, z);
            const t = questTag(q), spr = makeLabel(q.npc, t[0], t[1]); spr.position.set(0, 3.2, 0); npc.add(spr); addObj(npc);
            colliders.push({ x, z, r: 1.2 });
            hubStations.push({ type: 'quest', x, z, range: 5, label: 'Falar com ' + q.npc, q, npc, sprite: spr });
        });
        // portal da era extra desta sala
        const ei = EPOCHS.findIndex(e => e.room === r.id);
        if (ei >= 0) {
            const dn = gameState.completed[ei], pc = dn ? 0x22c55e : r.col, pcss = '#' + pc.toString(16).padStart(6, '0'), px = cx + 12.2, pz = cz + 4, pg = new THREE.Group();
            pg.position.set(px, 0, pz); pg.lookAt(cx, 0, pz);
            const plate = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.2, 3), mat(0x1f1a14)); plate.position.y = 0.1; pg.add(plate);
            const tor = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.28, 10, 32), new THREE.MeshStandardMaterial({ color: pc, emissive: pc, emissiveIntensity: 0.9 })); tor.position.y = 3.4; pg.add(tor);
            const disc = new THREE.Mesh(new THREE.CircleGeometry(1.95, 32), new THREE.MeshBasicMaterial({ color: pc, transparent: true, opacity: 0.6, side: THREE.DoubleSide })); disc.position.y = 3.4; pg.add(disc);
            const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.07, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); ring.position.y = 3.4; pg.add(ring);
            const plb = makeLabel(EPOCHS[ei].name, dn ? '✔ COMPLETA' : '▶ ENTRAR', pcss); plb.position.y = 6.6; pg.add(plb);
            const pl2 = new THREE.PointLight(pc, 1.2, 16); pl2.position.set(0, 3.4, 2); pg.add(pl2);
            addObj(pg); r.portal = { x: px, z: pz, i: ei, disc, ring };
        }
    });
}
const _lh2 = loadHub;
loadHub = function () { curRoom = null; curShop = null; _lh2(); buildHubRooms(); };

const _uh = updateHub;
updateHub = function () {
    _uh();
    if (!gameState.inHub) return;
    const p = playerObj.position; let hint = '';
    if (curRoom) {
        const d = Math.hypot(p.x - curRoom.cx, p.z - (curRoom.cz + 13.5));
        if (d < 1.8) {
            const dr = hubDoors.find(x => x.r === curRoom), n = 27.5; curRoom = null;
            hubTp(dr.x / n * 23.5, dr.z / n * 23.5, Math.atan2(dr.x, dr.z)); return;
        }
        if (d < 7) hint = '⬇ Saída: voltar ao HUB';
        const q = curRoom.portal;
        if (q) {
            q.ring.rotation.z += 0.04; q.disc.material.opacity = 0.55 + Math.sin(performance.now() / 300) * 0.12;
            const dq = Math.hypot(p.x - q.x, p.z - q.z);
            if (dq < 2.4) { curRoom = null; enterLevel(q.i); return; }
            if (dq < 7) hint = 'Entre no portal: ' + EPOCHS[q.i].name;
        }
    } else {
        for (const dr of hubDoors) {
            dr.pl.material.opacity = (dr.ok ? 0.5 : 0.3) + Math.sin(performance.now() / 300 + dr.x) * 0.1;
            const d = Math.hypot(p.x - dr.x, p.z - dr.z);
            if (d < 2) {
                if (dr.ok) { curRoom = dr.r; hubTp(dr.r.cx, dr.r.cz + 9.5, 0); toast('🚪 ' + dr.r.name); return; }
                const n = Math.hypot(dr.x, dr.z); p.x = dr.x / n * (n - 2.6); p.z = dr.z / n * (n - 2.6);
                hint = '🔒 Complete as eras ' + (dr.r.eras[0] + 1) + ' e ' + (dr.r.eras[1] + 1) + ' para liberar esta sala!';
            } else if (d < 7 && !hint) hint = dr.ok ? 'Entre na sala: ' + dr.r.name : '🔒 ' + dr.r.name + ' — complete as eras ' + (dr.r.eras[0] + 1) + ' e ' + (dr.r.eras[1] + 1);
        }
    }
    if (hint && !nearestStation()) { const el = document.getElementById('hub-hint'); el.innerText = hint; el.classList.remove('hidden'); }
};

const _int2 = interact;
interact = function () {
    if (gameState.inHub) {
        const st = nearestStation();
        if (st && st.type === 'rshop') { curShop = st.room.shop; renderShop(); openModal('shop-modal'); return; }
        if (st && st.type === 'shop') curShop = null;
    }
    return _int2();
};
const _rs = renderShop, _bs = buyShop, _SHOPQ = '"Cocoricó, viajante! Troque suas penas por poder!"';
renderShop = function () {
    const h = document.querySelector('#shop-modal h2'), q = h.nextElementSibling;
    h.innerText = curShop ? '🛒 ' + curShop.npc.toUpperCase() : '🐔 LOJA DO CACARECO'; q.innerText = curShop ? curShop.quote : _SHOPQ;
    if (!curShop) return _rs();
    const g = gameState;
    document.getElementById('shop-feathers').innerText = g.feathers;
    document.getElementById('shop-items').innerHTML = curShop.items.map(it => {
        const n = g.quests['b_' + curShop.id + '_' + it.id] || 0, full = (it.max && n >= it.max) || (it.id === 'heal' && g.heals >= 5);
        return `<div class="bg-black/60 p-3 rounded-lg border border-amber-900/60 flex flex-col justify-between"><div><h3 class="text-lg text-amber-400 font-bold">${it.icon} ${it.name}</h3><p class="text-sm text-gray-300 mt-1">${it.desc}${it.max ? ' (' + n + '/' + it.max + ')' : ''}</p></div><button onclick="buyShop('${it.id}')" ${full || g.feathers < it.cost ? 'disabled' : ''} class="mt-3 py-2 px-4 bg-amber-800 hover:bg-amber-700 disabled:opacity-40 text-white font-bold rounded border border-amber-400 transition">${full ? '✔ ESGOTADO' : 'Comprar (' + it.cost + ' 🪶)'}</button></div>`;
    }).join('');
};
buyShop = function (id) {
    if (!curShop) return _bs(id);
    const g = gameState, it = curShop.items.find(x => x.id === id); if (!it) return;
    const k = 'b_' + curShop.id + '_' + id, n = g.quests[k] || 0;
    if (g.feathers < it.cost || (it.max && n >= it.max) || (id === 'heal' && g.heals >= 5)) return;
    g.feathers -= it.cost; g.quests[k] = n + 1; it.fn(); recalcStats(); g.health = g.maxHealth;
    audio.playPickup(); updateHUD(); renderShop(); saveProgress();
};


/* ===== PRÉDIOS (eras extras 9–12): kit de interiores com andares, salas, corredores e portas ===== */
GEN[8] = eMuseu; GEN[9] = eArranha; GEN[10] = eColapso; GEN[11] = eBiblioteca;
while (LORE.length < 12) LORE.push(LORE[LORE.length - 8]);
const fw = (x, z, w, d, fl) => Wl(x, z, w, d, { lv: fl, y0: fl * UP, h: UP - .7 });
const link = (a, b, x, z, x2, z2) => { L.links.push({ a, b, x, z, x2, z2 }, { a: b, b: a, x: x2, z: z2, x2: x, z2: z }); };
const RF = (x0, x1, z0, z1, n, fl) => rooms.push({ x0, x1, z0, z1, fl, n: Math.max(2, Math.round(n * EP.enemiesToKill / 28)) });
const prop = (fl, x, z, w, d, h, c) => { B(x, fl * UP, z, w, h, d, mat(c)); col(x, z, w, d, { lv: fl }); };
const lamp = (fl, x, z) => B(x, fl * UP + UP - .9, z, 2.4, .25, 2.4, mat(0xfff1c2, 0xfff1c2));
const light = (fl, x, z, c) => { const l = new THREE.PointLight(c || 0xffe2b0, 1.1, 46); l.position.set(x, fl * UP + 4, z); addObj(l); };
const remW = w => { scene.remove(w.mesh); const i = colliders.indexOf(w.c); if (i >= 0) colliders.splice(i, 1); nav.ver++; };
// parede de um andar com vãos [centro, largura, tipo?, opções?]; tipo = 'common' (porta automática), 'key:cor', ...
function W(fl, ax, f, a, b, gaps) {
    gaps = (gaps || []).slice().sort((p, q) => p[0] - q[0]); let cur = a; const out = [];
    const piece = (u, v) => { if (v - u < .1) return; const c = (u + v) / 2, w = v - u; out.push(ax === 'x' ? fw(c, f, w, T, fl) : fw(f, c, T, w, fl)); };
    gaps.forEach(g => { piece(cur, g[0] - g[1] / 2); if (g[2]) mkDoor(ax, ax === 'x' ? g[0] : f, ax === 'x' ? f : g[0], g[1], g[2], Object.assign({ y0: fl * UP, h: UP - .7, lv: fl }, g[3] || {})); cur = g[0] + g[1] / 2; });
    piece(cur, b); return out;
}
// ala de quartos: parede interna em x = sx*ix, divisórias nas linhas zs, uma porta por quarto
function wing(fl, sx, ix, zs, doors) {
    const gaps = []; for (let i = 0; i < zs.length - 1; i++) { const c = (zs[i] + zs[i + 1]) / 2, d = doors && doors[i]; gaps.push(d ? [c, 6, d, { ref: 'w' + fl + sx + i }] : [c, 6, 'common']); }
    W(fl, 'z', sx * ix, zs[0], zs[zs.length - 1], gaps);
    zs.slice(1, -1).forEach(z => W(fl, 'x', z, sx > 0 ? ix : -76, sx > 0 ? 76 : -ix));
}
function shell(n) {
    for (let fl = 0; fl < n; fl++) { W(fl, 'x', 76, -76, 76); W(fl, 'z', -76, -46, 76); W(fl, 'z', 76, -46, 76); if (fl) W(fl, 'x', -46, -76, 76); }
    B(0, n * UP, 15, 156, .6, 124, DECKM);
}
// laje de um andar com buracos (escadas/elevador/átrio); zones divide em faixas de z (para desabar por partes)
function slab(fl, holes, zones) {
    const out = [];
    (zones || [[-46, 76]]).forEach(([za, zb], zi) => {
        let rs = [[-76, 76, za, zb]];
        holes.forEach(([a, b, c, d]) => { const nx = []; rs.forEach(([x0, x1, z0, z1]) => {
            if (b <= x0 || a >= x1 || d <= z0 || c >= z1) { nx.push([x0, x1, z0, z1]); return; }
            if (a > x0) nx.push([x0, a, z0, z1]); if (b < x1) nx.push([b, x1, z0, z1]);
            const m0 = Math.max(x0, a), m1 = Math.min(x1, b); if (c > z0) nx.push([m0, m1, z0, c]); if (d < z1) nx.push([m0, m1, d, z1]);
        }); rs = nx; });
        rs.forEach(([x0, x1, z0, z1]) => { deck(x0, x1, z0, z1, fl * UP); out.push({ fl, zi, x0, x1, z0, z1, mesh: levelObstacles[levelObstacles.length - 1], sf: surf[surf.length - 1] }); });
    });
    return out;
}
const drop = p => { scene.remove(p.mesh); const i = surf.indexOf(p.sf); if (i >= 0) surf.splice(i, 1); dirtBurst((p.x0 + p.x1) / 2, (p.z0 + p.z1) / 2, 14, 2, p.fl * UP); [...enemies].forEach(e => { const q = e.mesh.position; if ((e.fl | 0) === p.fl && q.x > p.x0 && q.x < p.x1 && q.z > p.z0 && q.z < p.z1) { e.fl = p.fl - 1; e.yb = e.fl * UP; q.y = e.yb; } });
    const q = playerObj.position; if (plv() === p.fl && q.x > p.x0 && q.x < p.x1 && q.z > p.z0 && q.z < p.z1) { applyPlayerDamage(12); audio.playHit(); toast('💥 O CHÃO CEDEU!'); } };
const stair = (fl, x0, x1, z0, z1, sg, ax) => stairs(x0, x1, z0, z1, ax || 'z', sg, 12, fl * UP, (fl + 1) * UP);

// ---- ERA 9 · MUSEU VULCÂNICO: átrio central, galerias; o magma sobe pelo prédio e 3 válvulas o fazem recuar ----
function eMuseu() {
    window.TOPFL = 2; L.lava = -1; L.valv = 0; L.t9 = L.tl = performance.now(); L.tt = 0; L.nx = 0;
    const lv = new THREE.Mesh(new THREE.BoxGeometry(164, .2, 164), new THREE.MeshBasicMaterial({ color: 0xff5a14, transparent: true, opacity: .88 })); lv.position.y = -1; add(lv);
    shell(3); slab(1, [[-22, 22, -4, 28], [-28, -20, 44, 62]]); slab(2, [[-22, 22, -4, 28], [20, 28, 44, 62]]);
    stair(0, -28, -20, 44, 62, -1); stair(1, 20, 28, 44, 62, -1); link(0, 1, -24, 60, -24, 42); link(1, 2, 24, 60, 24, 42);
    const zs = [-46, -18, 10, 40];
    wing(0, -1, 30, zs, { 1: 'key:yellow' }); wing(0, 1, 30, zs); [1, 2].forEach(f => { wing(f, -1, 30, zs); wing(f, 1, 30, zs); });
    key('yellow', 55, 26, 0);
    const valve = (x, z, y, n) => { let on = false; terminal(x, z, y, () => {
        if (on) return; on = true; L.valv++; L.lava = Math.max(-1, L.lava - 3.5); audio.playExplosion(); toast('🔧 VÁLVULA ' + L.valv + '/3 — o magma recuou!');
        if (L.valv === 3) { L.lava = -1; L.keys.red = 1; hudKeys(); toast('🌋 AS VÁLVULAS ABRIRAM — o magma escoou e o portão do chefe se abriu!'); openDoor(L.boss); }
    }, 'Girar válvula ' + n); };
    valve(-53, -4, 0, 1); valve(53, -4, UP, 2); valve(-53, -32, 2 * UP, 3);
    [[-60, -32], [60, 26], [-60, 26]].forEach(([x, z]) => prop(0, x, z, 4, 3, 1.4, 0x6b4a2b)); [[60, -32], [-60, 0]].forEach(([x, z]) => prop(1, x, z, 4, 3, 1.4, 0x6b4a2b));
    [0, 1, 2].forEach(f => { lamp(f, 0, 12); lamp(f, -50, -4); lamp(f, 50, -4); }); light(0, 0, 20); light(1, 0, 20); light(2, 0, 20);
    [[-60, 60], [60, 60], [0, 50]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); }); [[-50, 20], [50, 20]].forEach(([x, z]) => { heal(x, z, UP); ammo(x + 2, z, UP); }); heal(50, -30, 2 * UP); chest(-50, -20, null, 2 * UP);
    spawnIn(-60, 60, 44, 72, 4); RF(-24, 24, -44, -6, 5, 0); RF(30, 76, -18, 10, 5, 1); RF(-76, -30, -46, -18, 6, 2);
    L.upd = () => {
        const now = performance.now(), t = (now - L.t9) / 1000;
        if (L.valv < 3 && t > 15) L.lava += .12 * Math.min((now - L.tl) / 1000, .1);
        L.tl = now; lv.position.y = L.lava; lv.visible = L.lava > -.9;
        if (feet() < L.lava && now - L.tt > 500) { L.tt = now; applyPlayerDamage(6); audio.playHit(); toast('🔥 O MAGMA TE ALCANÇOU — SUBA!'); }
        if (L.valv < 3 && now - L.nx > 15000 && t > 15) { L.nx = now; toast('🌡️ Magma a ' + Math.max(0, L.lava).toFixed(1) + ' de altura — cada andar tem 6'); }
    };
    toast('📍 ' + EP.name + ' — gire as 3 válvulas (uma por andar). A chave amarela abre a galeria oeste. O magma sobe em 15s!');
}
// ---- ERA 10 · ARRANHA-CÉU CORPORATIVO: só o elevador sobe; 3 cartões; o 2º cartão causa apagão e horda ----
function eArranha() {
    window.TOPFL = 2; L.cards = 0; shell(3); const SH = [-8, 8, 12, 28]; slab(1, [SH]); slab(2, [SH]);
    const lift = L.lift; L.lm = B(0, 0, 20, 14, .5, 14, mat(0x9ca3af, 0x222222)); L.lm.position.y = -.2; surf.push({ x0: -7, x1: 7, z0: 13, z1: 27, lift });
    things.push({ x: 0, z: 20, r: 6, txt: () => '[E] Painel do elevador — ir ao andar ' + ((Math.round(lift.t / UP) + 1) % 3 + 1), act: () => { lift.t = (lift.t + UP) % (3 * UP); audio.playPickup(); } });
    [0, 1, 2].forEach(f => things.push({ x: 0, z: 32, r: 8, lv: f || undefined, txt: () => '[E] Chamar elevador (andar ' + (f + 1) + ')', act: () => { lift.t = f * UP; audio.playPickup(); } }));
    link(0, 1, 0, 31, 0, 20); link(1, 2, 0, 31, 0, 20);
    const zs = [-46, -14, 18, 50]; [0, 1, 2].forEach(f => { wing(f, -1, 30, zs); wing(f, 1, 30, zs); });
    [0, 1, 2].forEach(f => { for (const x of [-22, -14, 14, 22]) for (const z of [-36, -26, 40, 48]) prop(f, x, z, 3.2, 1.6, 1.1, 0x64748b); lamp(f, 0, -20); lamp(f, 0, 40); lamp(f, -50, 0); lamp(f, 50, 0); light(f, 0, 0, 0xcfe8ff); });
    const card = (x, z, y) => { const g = new THREE.Mesh(new THREE.BoxGeometry(1.4, .2, 1), mat(0x38bdf8, 0x0369a1)); g.position.set(x, y + 1.6, z); add(g);
        pk.push({ mesh: g, x, z, y, fn: () => { L.cards++; audio.playPickup(); toast('💳 CARTÃO DE ACESSO ' + L.cards + '/3');
            if (L.cards === 2) { scene.fog.density = .06; scene.background = new THREE.Color(0x000000); audio.playExplosion(); toast('⚡ APAGÃO! A energia caiu e a horda surgiu no escuro!'); spawnIn(-70, 70, -40, 70, Math.round(8 * EP.enemiesToKill / 28), undefined, plv()); }
            if (L.cards === 3) { L.keys.red = 1; hudKeys(); toast('🔓 Acesso total liberado — o portão do chefe se abriu!'); openDoor(L.boss); } } }); };
    card(53, -30, 0); card(-53, 2, UP); card(53, 34, 2 * UP);
    [[-60, 60], [60, 60]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); }); [[-50, 30], [50, -20]].forEach(([x, z]) => { heal(x, z, UP); ammo(x + 2, z, UP); }); heal(-50, -30, 2 * UP);
    spawnIn(-60, 60, 52, 72, 3); RF(-76, -30, 18, 50, 5, 0); RF(30, 76, -14, 18, 5, 1); RF(-76, -30, -46, -14, 6, 2);
    toast('📍 ' + EP.name + ' — só o ELEVADOR sobe! Pegue os 3 cartões de acesso (um por andar). Cuidado com a energia...');
}
// ---- ERA 11 · PRÉDIO EM COLAPSO (fuga): você começa no último andar e precisa DESCER antes que o chão desabe ----
function eColapso() {
    window.TOPFL = 2; L.start = [0, 2 * UP, 20]; L.tc = performance.now(); L.f1 = 0; L.fin = 0; shell(3);
    const apts = f => { const zs = [-46, -22, 2, 26, 50, 76], gs = zs.slice(0, -1).map((z, i) => [(z + zs[i + 1]) / 2, 5, 'common']);
        [-1, 1].forEach(sx => { W(f, 'z', sx * 8, -46, 76, gs); zs.slice(1, -1).forEach(z => W(f, 'x', z, sx > 0 ? 8 : -76, sx > 0 ? 76 : -8)); }); };
    [0, 1, 2].forEach(apts);
    const Z2 = [[-46, -26], [-26, -6], [-6, 14], [14, 34], [34, 76]], Z1 = [[34, 76], [14, 34], [-6, 14], [-26, -6], [-46, -26]];
    L.s2 = slab(2, [[-3, 3, 52, 70]], Z2); L.s1 = slab(1, [[-3, 3, -44, -26]], Z1);
    stair(1, -3, 3, 52, 70, -1); stair(0, -3, 3, -44, -26, 1);
    link(2, 1, 0, 50, 0, 72); link(1, 0, 0, -24, 0, -44);
    [-1, 1].forEach(sx => [0, 1, 2].forEach(f => [-34, -10, 14, 38, 63].forEach(z => { prop(f, sx * 30, z, 5, 2.4, .9, 0x7c5a3a); prop(f, sx * 60, z + 6, 2.4, 4, 1.6, 0x57534e); })));
    [0, 1, 2].forEach(f => [-30, 0, 30, 60].forEach(z => lamp(f, 0, z))); light(2, 0, 0); light(1, 0, 20); light(0, 0, 20);
    [[0, 40], [0, 0]].forEach(([x, z]) => heal(x, z, 2 * UP)); heal(0, 40, UP); ammo(2, 10, UP); heal(0, -10, 0);
    spawnIn(-7, 7, 28, 48, 3, undefined, 2); RF(-8, 8, 10, 40, 5, 1); RF(-8, 8, -40, -10, 5, 1); spawnIn(-7, 7, -40, 0, 3, undefined, 0);
    L.upd = () => {
        const now = performance.now(), t = (now - L.tc) / 1000, p = playerObj.position;
        L.s2.forEach(q => { if (!q.gone && t > 5 + (q.zi) * 2.5) { q.gone = 1; drop(q); } });
        if (!L.f1 && plv() === 1) { L.f1 = now; toast('🏚️ O ANDAR 2 DESABOU! Corra para o norte — o chão cede atrás de você!'); }
        if (L.f1) L.s1.forEach(q => { if (!q.gone && now - L.f1 > 1500 + q.zi * 3500) { q.gone = 1; drop(q); } });
        if (!L.fin && plv() === 0 && p.z < -40) { L.fin = 1; L.keys.red = 1; hudKeys(); openDoor(L.boss, '🚪 Você escapou do prédio! O portão do chefe abriu.'); }
    };
    toast('📍 ' + EP.name + ' — FUJA! Desça pela escada ao SUL, depois corra pelo corredor até a escada ao NORTE. O chão está desabando!');
}
// ---- ERA 12 · BIBLIOTECA ATEMPORAL: estantes em serpentina; o último livro faz as estantes sumirem e o chão ceder ----
function eBiblioteca() {
    window.TOPFL = 2; L.books = 0; L.rows = []; shell(3);
    const R5 = [[34, 66], [18, -66], [2, 66], [-14, -66], [-30, 66]];
    [0, 1, 2].forEach(f => R5.forEach(([z, gx]) => L.rows.push(...W(f, 'x', z, -76, 76, [[gx, 10]]))));
    L.sl1 = slab(1, [[-64, -46, -42, -32]], [[-46, -30], [-30, 76]]); L.sl2 = slab(2, [[46, 64, 62, 72]], [[-46, -30], [-30, 76]]);
    stair(0, -64, -46, -42, -32, 1, 'x'); stair(1, 46, 64, 62, 72, -1, 'x'); link(0, 1, -66, -37, -44, -37); link(1, 2, 66, 67, 44, 67);
    [0, 1, 2].forEach(f => { [-50, -25, 0, 25, 50].forEach(x => { lamp(f, x, 26); lamp(f, x, -6); lamp(f, x, 56); }); light(f, 0, 56, 0xd8b4fe); light(f, 0, 10, 0xd8b4fe); });
    const book = (x, z, y) => { const g = new THREE.Mesh(new THREE.BoxGeometry(1.2, .4, 1.6), mat(0xe879f9, 0x86198f)); g.position.set(x, y + 1.8, z); add(g);
        pk.push({ mesh: g, x, z, y, fn: () => { L.books++; audio.playPickup(); toast('📖 LIVRO ' + L.books + '/3');
            if (L.books === 3) {
                L.rows.forEach(remW); L.sl1.concat(L.sl2).filter(q => q.zi === 0).forEach(drop); scene.background = new THREE.Color(0x3b2a4a); scene.fog.color.set(0x3b2a4a); audio.playExplosion();
                spawnIn(-70, 70, -40, 70, Math.round(8 * EP.enemiesToKill / 28), undefined, 2); L.keys.red = 1; hudKeys(); openDoor(L.boss);
                toast('⏳ A BIBLIOTECA VIAJA NO TEMPO — as estantes viraram pó, o chão cede e o portão do chefe se abriu!');
            } } }); };
    book(40, -38, 0); book(-50, 66, UP); book(-50, -38, 2 * UP);
    [[-50, 60], [50, 60], [0, 50]].forEach(([x, z]) => { heal(x, z); ammo(x + 2, z); }); [[0, -38], [0, 66]].forEach(([x, z]) => { heal(x, z, UP); ammo(x + 2, z, UP); }); heal(0, 66, 2 * UP);
    spawnIn(-60, 60, 40, 72, 3); RF(-70, 70, 18, 34, 4, 0); RF(-70, 70, -14, 2, 4, 0); RF(-70, 70, -30, -14, 5, 1); RF(-70, 70, 2, 18, 5, 2);
    toast('📍 ' + EP.name + ' — siga as estantes em serpentina e recupere os 3 livros (um por andar). Ao pegar o último, a biblioteca muda.');
}

/* ===== MAPAS 4.0 — mapas construídos PARA as habilidades =====
   Nova habilidade -> novos espaços -> combate/exploração -> recompensa -> revisitação.
   Cada era ensina uma habilidade e esconde "segredos" que só abrem com habilidades futuras. */
const AB = {
    course: { ico: '🦘', col: 0xfde047, has: () => true },
    slide:  { ico: '🛷', col: 0xf59e0b, has: () => hasSlide() },
    dash:   { ico: '💨', col: 0x22d3ee, has: () => hasAirDash() },
    recoil: { ico: '🚀', col: 0xf97316, has: () => !!(gameState.weapons.rocket || gameState.weapons.gren || gameState.weapons.cannon) },
    time:   { ico: '⏳', col: 0xa78bfa, has: () => hasChickenShift() }
};
const ABN = { course: 'Sprint + Pulo Duplo', slide: 'Deslize', dash: 'Air Dash', recoil: 'Recoil Jump', time: 'Chicken Shift' };
const HINT = {
    course: ['🦘 Corra (Shift) e use o pulo duplo para cruzar as plataformas', '🦘 Corra (Shift) e use o pulo duplo para cruzar as plataformas'],
    slide:  ['🔒 Vão baixo demais para andar — precisa do DESLIZE (C)', '🛷 Corra e aperte C para deslizar sob o vão'],
    dash:   ['🔒 Campo de energia — precisa do AIR DASH', '💨 Pule e aperte Q no ar para atravessar o campo'],
    recoil: ['🔒 Plataforma alta — precisa de RECOIL JUMP (foguete/granada/canhão)', '🚀 Atire no chão aos seus pés (foguete/granada/canhão) para ser lançado ao alto'],
    time:   ['🔒 Parede do presente — precisa do CHICKEN SHIFT (F)', '⏳ Aperte F para voltar ao passado: a parede some']
};
const SIZE = { course: [46, 14], slide: [14, 14], dash: [14, 14], recoil: [14, 14], time: [14, 14] };
const PLAN = [
    ['course', 'slide', 'recoil'],                  // 1  ensina Sprint + Pulo Duplo
    ['slide', 'dash', 'recoil'],                    // 2  ensina Deslize
    ['dash', 'slide', 'recoil'],                    // 3  ensina Air Dash
    ['recoil', 'dash', 'time'],                     // 4  ensina Recoil Jump
    ['recoil', 'slide', 'dash'],                    // 5
    ['dash', 'recoil', 'slide'],                    // 6
    ['time', 'recoil', 'dash'],                     // 7  ensina Chicken Shift
    ['slide', 'dash', 'recoil', 'time']             // 8  todas as habilidades
];
const PLAN_EXTRA = ['slide', 'dash', 'time'];
const NK = { placed: [] };
const acc = c => { const m = mat(c, c); m.emissive.multiplyScalar(.45); return m; };
const ghost = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .38 });

function mkFrame(cx, cz, rot, LV) {
    const c = [1, 0, -1, 0][rot], s = [0, 1, 0, -1][rot], sw = rot % 2 === 1;
    const p = (lx, lz) => [cx + lx * c - lz * s, cz + lx * s + lz * c];
    const box = (lx, lz, w, d, y0, h, m, o) => {
        const [x, z] = p(lx, lz), ww = sw ? d : w, dd = sw ? w : d;
        const mesh = B(x, y0, z, ww, h, dd, m);
        const cc = o === false ? null : col(x, z, ww, dd, Object.assign({}, LV, o || {}));
        return { mesh, c: cc, x, z };
    };
    const deck = (lx0, lx1, lz0, lz1, h, m) => {
        const a = p(lx0, lz0), b = p(lx1, lz1);
        const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), z0 = Math.min(a[1], b[1]), z1 = Math.max(a[1], b[1]);
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, .6, z1 - z0), m || DECKM);
        mesh.position.set((x0 + x1) / 2, h - .3, (z0 + z1) / 2); add(mesh);
        surf.push({ x0, x1, z0, z1, h }); return mesh;
    };
    return { cx, cz, rot, p, box, deck };
}
function noSpawn(f, hw, hd) { col(f.cx, f.cz, hw * 2, hd * 2, { en: 1 }); }
function hint(f, lx, lz, type, r) {
    const [x, z] = f.p(lx, lz);
    things.push({ x, z, r: r || 11, txt: () => HINT[type][AB[type].has() ? 1 : 0] });
}
function prize(f, lx, lz, y, id, type, ei) {
    const [x, z] = f.p(lx, lz), info = AB[type], done = gameState.perm.nooks.includes(id);
    if (done) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(.5), mat(0x555555, 0x111111)); m.position.set(x, y + 1.2, z); add(m); return; }
    const [cx2, cz2] = f.p(lx + 2.6, lz), [hx, hz] = f.p(lx - 2.6, lz), [ax, az] = f.p(lx, lz + 1.5);
    chest(cx2, cz2, null, y); heal(hx, hz, y); ammo(ax, az, y);
    const g = new THREE.Mesh(new THREE.OctahedronGeometry(.9), mat(info.col, info.col)); g.position.set(x, y + 1.8, z); add(g);
    const pl = new THREE.PointLight(info.col, 1.2, 14); pl.position.set(x, y + 3, z); add(pl);
    pk.push({ mesh: g, x, z, y, fn: () => {
        const gain = 50 + 20 * ei;
        gameState.feathers += gain; gameState.stats.feathers += gain; gameState.stats.secrets++;
        gameState.perm.nooks.push(id); audio.playPickup();
        toast(info.ico + ' SEGREDO DE ' + ABN[type].toUpperCase() + '! +' + gain + ' 🪶');
        saveProgress(); updateHUD();
    } });
}
// enclosure: 3 paredes (esq/dir/fundo); a frente é feita por cada tipo. interior ~10x10 (z de -5 a 5)
function walls3(f, hh, m) {
    f.box(-5.5, 0, 1, 12, 0, hh, m); f.box(5.5, 0, 1, 12, 0, hh, m); f.box(0, 5.5, 12, 1, 0, hh, m);
}
function stripe(f, lx, lz, w, d, c) { const [x, z] = f.p(lx, lz), sw = f.rot % 2 === 1; B(x, .03, z, sw ? d : w, .06, sw ? w : d, acc(c)); }

const BUILD = {
    // 1 · SPRINT + PULO DUPLO: três plataformas separadas por vãos que pedem corrida + pulo duplo
    course(f, id, ei) {
        const a = acc(AB.course.col), hs = [2.0, 4.0, 6.0], xs = [[-21, -15], [-3, 3], [15, 21]];
        xs.forEach(([x0, x1], k) => {
            f.deck(x0, x1, -3.5, 3.5, hs[k], DECKM);
            f.box((x0 + x1) / 2, 0, 1, 1, 0, hs[k] - .6, a, false);
            f.box(x0, -3.5, .6, .6, hs[k], .5, a, false); f.box(x1, 3.5, .6, .6, hs[k], .5, a, false);
        });
        stripe(f, -24, 0, 2.5, 8, AB.course.col);
        prize(f, 18, 0, hs[2], id, 'course', ei);
        hint(f, -24, 0, 'course', 9);
    },
    // 2 · DESLIZE: depósito com vão de ~1 unidade; só entra deslizando
    slide(f, id, ei) {
        walls3(f, 5, WALL);
        f.box(0, -5.5, 12, 1, 1.05, 3.95, acc(AB.slide.col), { low: true });
        f.box(0, -5.5, 12, 1, 0, .12, acc(AB.slide.col), false);
        stripe(f, 0, -8.5, 6, 3, AB.slide.col); stripe(f, 0, -6.2, 4, 1, AB.slide.col);
        prize(f, 0, 1.5, 0, id, 'slide', ei); hint(f, 0, -9.5, 'slide');
    },
    // 3 · AIR DASH: câmara protegida por campo de energia; só o impulso no ar atravessa
    dash(f, id, ei) {
        walls3(f, 5, WALL);
        f.box(0, -5.5, 12, 1.4, 0, 5, ghost(AB.dash.col), { dash: true, see: true });
        f.box(-5.5, -5.5, 1.2, 1.6, 0, 5.4, acc(AB.dash.col), false); f.box(5.5, -5.5, 1.2, 1.6, 0, 5.4, acc(AB.dash.col), false);
        stripe(f, 0, -8.5, 6, 3, AB.dash.col);
        prize(f, 0, 1.5, 0, id, 'dash', ei); hint(f, 0, -9.5, 'dash');
    },
    // 4 · RECOIL JUMP: mirante a ~7,5 de altura (impossível só com pulo duplo).
    recoil(f, id, ei) {
        const a = acc(AB.recoil.col), H = 7.5;
        f.deck(-5, 5, -5, 5, H, DECKM);
        [[-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]].forEach(([x, z]) => f.box(x, z, 1.4, 1.4, 0, H - .6, WALL));
        f.box(0, 5.2, 10, .5, H, 1.4, a, false); f.box(-5.2, 0, .5, 10, H, 1.4, a, false); f.box(5.2, 0, .5, 10, H, 1.4, a, false);
        stripe(f, 0, -9, 4, 4, AB.recoil.col); stripe(f, 0, -9, 1.4, 1.4, 0xffffff);
        prize(f, 0, 1, H, id, 'recoil', ei); hint(f, 0, -9.5, 'recoil', 13);
    },
    // 6 · CHICKEN SHIFT: a parede da frente só existe no Presente
    time(f, id, ei) {
        walls3(f, 5, WALL);
        const w = f.box(0, -5.5, 12, 1, 0, 5, acc(AB.time.col), {});
        CS.objs.push({ mesh: w.mesh, c: w.c, state: 'now' });
        const cl = new THREE.Mesh(new THREE.TorusGeometry(1.4, .18, 8, 24), mat(0xffffff, 0xc4b5fd)); const [x, z] = f.p(0, -5.5); cl.position.set(x, 2.6, z); add(cl);
        stripe(f, 0, -8.5, 6, 3, AB.time.col);
        prize(f, 0, 1.5, 0, id, 'time', ei); hint(f, 0, -9.5, 'time');
    }
};

function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rectFree(cx, cz, hw, hd, mg, zr, avoid) {
    for (let x = cx - hw - mg; x <= cx + hw + mg + .01; x += 3) for (let z = cz - hd - mg; z <= cz + hd + mg + .01; z += 3) {
        if (Math.abs(x) > 76 || z < zr[0] || z > zr[1]) return false;
        if (avoid && avoid.some(a => z > a[0] && z < a[1])) return false;
        if (blocked(x, z, 1.2, 0)) return false;
    }
    const inR = (px, pz) => Math.abs(px - cx) < hw + mg && Math.abs(pz - cz) < hd + mg;
    if (pk.some(k => inR(k.x, k.z)) || things.some(t => inR(t.x, t.z)) || items.some(it => inR(it.mesh.position.x, it.mesh.position.z))) return false;
    if (NK.placed.some(r => Math.abs(r.x - cx) < r.hw + hw + 4 && Math.abs(r.z - cz) < r.hd + hd + 4)) return false;
    const st = L.start || [0, 0, 62];
    return Math.hypot(cx - st[0], cz - st[2]) >= 22 + Math.max(hw, hd);
}
function findSpot(type, rnd, zr, avoid) {
    const [w, d] = SIZE[type], cands = [];
    for (let x = -70; x <= 70; x += 5) for (let z = zr[0]; z <= zr[1]; z += 5) cands.push([x, z]);
    for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cands[i], cands[j]] = [cands[j], cands[i]]; }
    const rots = type === 'course' ? [0, 1] : [0, 1, 2, 3];
    for (const mg of [3, 1.5]) for (const [cx, cz] of cands) for (const rot of rots) {
        const hw = rot % 2 ? d / 2 : w / 2, hd = rot % 2 ? w / 2 : d / 2;
        if (rectFree(cx, cz, hw, hd, mg, zr, avoid)) return { cx, cz, rot, hw, hd };
    }
    return null;
}
function buildNooks(i) {
    NK.placed = [];
    gameState.perm.nooks = gameState.perm.nooks || [];
    const plan = EPOCHS[i].extra ? PLAN_EXTRA : (PLAN[i] || []);
    const rnd = rng(i * 4099 + 77), LV = EPOCHS[i].extra ? { lv: 0 } : {};
    const zr = i === 6 ? [-36, 22] : [-36, 72], avoid = i === 7 ? [[8, 32]] : null;
    const made = [];
    plan.forEach((type, k) => {
        const sp = findSpot(type, rnd, zr, avoid);
        if (!sp) return;
        const f = mkFrame(sp.cx, sp.cz, sp.rot, LV), id = i + ':' + type + ':' + k;
        NK.placed.push({ x: sp.cx, z: sp.cz, hw: sp.hw, hd: sp.hd });
        BUILD[type](f, id, i); noSpawn(f, sp.hw, sp.hd);
        made.push({ type, id });
    });
    nav.ver++; L.nooks = made;
    if (made.length) setTimeout(() => {
        if (gameState.inHub || !L || L.nooks !== made || gameState.currentEpochIndex !== i) return;
        const got = made.filter(m => gameState.perm.nooks.includes(m.id)).length;
        toast('🧭 Segredos desta era: ' + got + '/' + made.length + ' — ' + made.map(m => AB[m.type].ico + (AB[m.type].has() ? '' : '🔒')).join(' '));
    }, 4500);
}
const _lv4 = loadEpochLevel;
loadEpochLevel = function (i) { CS.reset(); _lv4(i); try { buildNooks(i); } catch (e) { console.error('nooks', e); } };
const _hub4 = loadHub;
loadHub = function () { CS.reset(); return _hub4.apply(this, arguments); };

})();

Object.assign(window, {
    buyAnvil,
    buyShop,
    delRun,
    invAssign,
    invShip,
    invSlot,
    setDifficulty,
    startRun
});

window.addEventListener('load', () => {
    initEngine();
    animate();
});
