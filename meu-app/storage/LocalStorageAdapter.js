export class LocalStorageAdapter {
    #storageProvider;

    constructor(storageProvider = () => window.localStorage) {
        this.#storageProvider = storageProvider;
    }

    getItem(key) {
        try {
            return this.#storageProvider().getItem(key);
        } catch (error) {
            console.error("Não foi possível ler o armazenamento local.", error);
            return null;
        }
    }

    setItem(key, value) {
        try {
            this.#storageProvider().setItem(key, value);
        } catch (error) {
            console.error("Não foi possível gravar no armazenamento local.", error);
        }
    }

    removeItem(key) {
        try {
            this.#storageProvider().removeItem(key);
        } catch (error) {
            console.error("Não foi possível remover dados do armazenamento local.", error);
        }
    }
}
