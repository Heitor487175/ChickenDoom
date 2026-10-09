import { SoundEngine } from "../audio/SoundEngine.js";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter.js";
import { CombatSystem } from "./combat/CombatSystem.js";
import { SaveManager } from "./progress/SaveManager.js";

export class GameRuntime {
    #audio = new SoundEngine();
    #storage = new LocalStorageAdapter();
    #combatSystem = null;
    #saveManager = null;
    #initializeEngine;
    #animate;

    constructor({ initializeEngine, animate }) {
        this.#initializeEngine = initializeEngine;
        this.#animate = animate;
    }

    get audio() {
        return this.#audio;
    }

    get storage() {
        return this.#storage;
    }

    initializeCombat(dependencies) {
        this.#combatSystem = new CombatSystem(dependencies);
    }

    initializeProgress(dependencies) {
        this.#saveManager = new SaveManager(dependencies);
    }

    get activeRun() {
        return this.#requireSaveManager().activeRun;
    }

    readRun(number) {
        return this.#requireSaveManager().readRun(number);
    }

    saveProgress() {
        this.#requireSaveManager().saveProgress();
    }

    migrateLegacySave() {
        this.#requireSaveManager().migrateLegacySave();
    }

    migrateWeaponSave() {
        this.#requireSaveManager().migrateWeaponSave();
    }

    selectRun(number, fresh) {
        this.#requireSaveManager().selectRun(number, fresh);
    }

    damageEnemy(enemy, damage) {
        if (!this.#combatSystem) {
            throw new Error("O sistema de combate ainda não foi inicializado.");
        }
        this.#combatSystem.damageEnemy(enemy, damage);
    }

    start() {
        this.#initializeEngine();
        this.#animate();
    }

    #requireSaveManager() {
        if (!this.#saveManager) {
            throw new Error("O sistema de progresso ainda não foi inicializado.");
        }
        return this.#saveManager;
    }
}
