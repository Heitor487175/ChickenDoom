export class MapManager {
    #epochs;
    #buildBase;
    #finishMap;
    #fallback;
    #beforeBuild;
    #builders = new Map();

    constructor({ epochs, buildBase, finishMap, fallback, beforeBuild = () => {} }) {
        this.#epochs = epochs;
        this.#buildBase = buildBase;
        this.#finishMap = finishMap;
        this.#fallback = fallback;
        this.#beforeBuild = beforeBuild;
    }

    register(epochIndex, builder) {
        if (!Number.isInteger(epochIndex) || !this.#epochs[epochIndex]) {
            throw new RangeError(`Índice de mapa inválido: ${epochIndex}`);
        }
        if (typeof builder !== "function") {
            throw new TypeError("O construtor do mapa precisa ser uma função.");
        }
        this.#builders.set(epochIndex, builder);
    }

    build(epochIndex) {
        this.#beforeBuild(epochIndex);
        const builder = this.#builders.get(epochIndex);
        if (!builder) {
            return this.#fallback(epochIndex);
        }

        this.#buildBase(epochIndex);
        builder(epochIndex);
        this.#finishMap(epochIndex);
    }
}
