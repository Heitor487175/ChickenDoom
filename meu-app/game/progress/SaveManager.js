export class SaveManager {
    #storage;
    #state;
    #saveKey;
    #runKey;
    #lastRunKey;
    #saveKeys;
    #defaultSave;
    #weaponMigration;
    #weapons;
    #callbacks;
    #activeRun = 0;
    #runCreated = 0;

    constructor({ storage, state, saveKey, runKey, lastRunKey, saveKeys, defaultSave, weaponMigration, weapons, callbacks }) {
        this.#storage = storage;
        this.#state = state;
        this.#saveKey = saveKey;
        this.#runKey = runKey;
        this.#lastRunKey = lastRunKey;
        this.#saveKeys = saveKeys;
        this.#defaultSave = defaultSave;
        this.#weaponMigration = weaponMigration;
        this.#weapons = weapons;
        this.#callbacks = callbacks;
    }

    get activeRun() {
        return this.#activeRun;
    }

    readRun(number) {
        try {
            const run = JSON.parse(this.#storage.getItem(this.#runKey(number)));
            return run && run.data ? run : null;
        } catch {
            return null;
        }
    }

    saveProgress() {
        if (!this.#activeRun) return;
        try {
            const data = {};
            this.#saveKeys.forEach(key => { data[key] = this.#state[key]; });
            this.#storage.setItem(this.#runKey(this.#activeRun), JSON.stringify({
                v: 2,
                created: this.#runCreated,
                updated: Date.now(),
                data
            }));
            this.#storage.setItem(this.#lastRunKey, String(this.#activeRun));
        } catch (error) {
            console.error("Não foi possível salvar o progresso.", error);
        }
    }

    migrateLegacySave() {
        const oldSave = this.#storage.getItem(this.#saveKey);
        if (!oldSave || this.readRun(1)) return;

        try {
            this.#storage.setItem(this.#runKey(1), JSON.stringify({
                v: 2,
                created: Date.now(),
                updated: Date.now(),
                data: JSON.parse(oldSave)
            }));
            this.#storage.removeItem(this.#saveKey);
        } catch (error) {
            console.error("Não foi possível migrar o save antigo.", error);
        }
    }

    migrateWeaponSave() {
        const state = this.#state;
        Object.keys(this.#weaponMigration).forEach(oldId => {
            const newId = this.#weaponMigration[oldId];
            if (state.weapons[oldId]) state.weapons[newId] = true;
            if (state.wLvl[oldId]) state.wLvl[newId] = Math.max(state.wLvl[newId] || 1, state.wLvl[oldId]);
            delete state.weapons[oldId];
            delete state.wLvl[oldId];
            state.hotbar = state.hotbar.map(id => id === oldId ? newId : id);
            if (state.currentWeapon === oldId) state.currentWeapon = newId;
        });
        state.weapons.pistol = true;
        if (!state.wLvl.pistol) state.wLvl.pistol = 1;
        Object.keys(state.weapons).forEach(id => {
            if (!this.#weapons[id]) delete state.weapons[id];
        });
        state.hotbar = state.hotbar.map(id => id && state.weapons[id] ? id : null);
        if (!state.hotbar.some(Boolean)) state.hotbar[0] = "pistol";
        if (!state.weapons[state.currentWeapon]) state.currentWeapon = state.hotbar.find(Boolean);
    }

    selectRun(number, fresh) {
        const state = this.#state;
        const difficulty = state.difficulty;
        this.#saveKeys.forEach(key => {
            state[key] = JSON.parse(JSON.stringify(this.#defaultSave[key]));
        });
        state.ammoStore = {};
        const savedRun = fresh ? null : this.readRun(number);
        if (savedRun) {
            this.#saveKeys.forEach(key => {
                if (savedRun.data[key] !== undefined) state[key] = savedRun.data[key];
            });
            this.#runCreated = savedRun.created || Date.now();
        } else {
            state.difficulty = difficulty;
            this.#runCreated = Date.now();
        }
        this.migrateWeaponSave();
        this.#activeRun = number;
        state.health = 100;
        this.#callbacks.recalculateStats();
        state.health = state.maxHealth;
        state.shield = 50;
        this.#callbacks.refillAllAmmo();
        this.#callbacks.equipWeapon(state.currentWeapon);
        this.#callbacks.renderDifficultyButtons();
    }
}
