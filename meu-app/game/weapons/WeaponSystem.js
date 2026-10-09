export class WeaponSystem {
    #state;
    #weapons;
    #reload;
    #audio;
    #effects;
    #lastShootTime = 0;
    #lastEmptyClick = 0;

    constructor({ state, weapons, reload, audio, effects }) {
        this.#state = state;
        this.#weapons = weapons;
        this.#reload = reload;
        this.#audio = audio;
        this.#effects = effects;
    }

    ammoCap(id) {
        const weapon = this.#weapons[id];
        if (!weapon) throw new RangeError(`Arma desconhecida: ${id}`);
        return Math.round(weapon.res * (1 + (this.#state.upgrades.ammoLvl - 1) * 0.25));
    }

    ammoOf(id) {
        if (!this.#weapons[id]) throw new RangeError(`Arma desconhecida: ${id}`);
        const store = this.#state.ammoStore;
        if (!store[id]) store[id] = { mag: this.#weapons[id].mag, res: this.ammoCap(id) };
        return store[id];
    }

    refillAllAmmo() {
        this.#reload.on = false;
        this.#state.ammoStore = {};
        Object.keys(this.#weapons).forEach(id => {
            if (this.#state.weapons[id]) this.ammoOf(id);
        });
    }

    updateAmmoHUD() {
        const ammoElement = document.getElementById("hud-ammo");
        const labelElement = document.getElementById("hud-ammo-label");
        if (!ammoElement || !labelElement) return;

        const weapon = this.#weapons[this.#state.currentWeapon];
        const ammo = this.ammoOf(this.#state.currentWeapon);
        const ammoName = weapon.ammoName || "MUNIÇÃO";
        if (this.#reload.on) {
            labelElement.innerText = "RECARGA " + Math.round(100 * (1 - this.#reload.left / this.#reload.total)) + "%";
        } else {
            labelElement.innerText = ammo.mag === 0
                ? (ammo.res > 0 ? "[R] RECARREGAR" : "SEM " + ammoName)
                : ammoName;
        }
        ammoElement.innerHTML = ammo.mag + '<span class="text-sm text-yellow-200"> / ' + ammo.res + "</span>";
        ammoElement.style.color = ammo.mag === 0 ? "#ef4444" : "";
    }

    startReload() {
        const state = this.#state;
        if (state.inHub || this.#reload.on || state.isDead || state.isPaused) return;

        const id = state.currentWeapon;
        const ammo = this.ammoOf(id);
        const weapon = this.#weapons[id];
        if (ammo.mag >= weapon.mag || ammo.res <= 0) return;

        this.#reload.on = true;
        this.#reload.id = id;
        this.#reload.total = this.#reload.left = weapon.reload;
        this.#audio.playReload(0);
        this.updateAmmoHUD();
    }

    updateReload(delta) {
        let y = -0.24;
        let rotation = 0;
        if (this.#reload.on) {
            this.#reload.left -= delta * 1000;
            y = -0.52;
            rotation = -0.75;
            if (this.#reload.left <= 0) {
                const ammo = this.ammoOf(this.#reload.id);
                const weapon = this.#weapons[this.#reload.id];
                const amount = Math.min(weapon.mag - ammo.mag, ammo.res);
                ammo.mag += amount;
                ammo.res -= amount;
                this.#reload.on = false;
                this.#audio.playReload(1);
                this.#effects.updateHUD();
            } else {
                this.updateAmmoHUD();
            }
        }
        this.#effects.setWeaponPose(y, rotation);
    }

    equipWeapon(id) {
        const state = this.#state;
        if (!state.weapons[id]) return;
        if (state.currentWeapon !== id) this.#reload.on = false;
        state.currentWeapon = id;
        this.#effects.applyWeaponAppearance(this.#weapons[id]);
        this.#effects.updateHUD();
    }

    equipSlot(index) {
        const id = this.#state.hotbar[index];
        if (id) this.equipWeapon(id);
    }

    giveWeapon(id) {
        const state = this.#state;
        state.weapons[id] = true;
        this.ammoOf(id);
        if (!state.wLvl[id]) state.wLvl[id] = 1;
        const slot = state.hotbar.indexOf(null);
        if (slot >= 0) state.hotbar[slot] = id;
    }

    shoot() {
        const state = this.#state;
        if (state.inHub) return;
        const id = state.currentWeapon;
        const weapon = this.#weapons[id];
        const now = performance.now();
        const interval = weapon.interval / (1 + (state.upgrades.fireRateLvl - 1) * 0.4);
        if (this.#reload.on || now - this.#lastShootTime < interval) return;

        const ammo = this.ammoOf(id);
        if (ammo.mag <= 0) {
            if (ammo.res > 0) {
                this.startReload();
            } else if (now - this.#lastEmptyClick > 1200) {
                this.#lastEmptyClick = now;
                this.#audio.playEmpty();
                this.#effects.toast("❌ Sem munição de " + weapon.name + " — pegue drops ou troque de arma");
            }
            return;
        }

        this.#lastShootTime = now;
        ammo.mag--;
        this.#effects.updateHUD();
        this.#audio.playShoot();
        this.#effects.playMuzzleFlash();

        const damage = 18 * weapon.dmg
            * (1 + (state.upgrades.damageLvl - 1) * 0.5)
            * (this.#effects.hasShip("furia") ? 1.3 : 1)
            * (1 + state.perm.dmg)
            * (1 + 0.25 * ((state.wLvl[id] || 1) - 1));

        if ((id === "mg" || id === "pistol") && state.upgrades.hasPlasma) {
            [-0.08, 0, 0.08].forEach(offset => this.#effects.createBullet(offset, damage, "plasma"));
            return;
        }
        const count = weapon.n || 1;
        const spread = weapon.spread || 0;
        for (let i = 0; i < count; i++) {
            this.#effects.createBullet(
                (Math.random() - 0.5) * spread,
                damage,
                weapon.bul,
                (Math.random() - 0.5) * spread * 0.5
            );
        }
    }
}
