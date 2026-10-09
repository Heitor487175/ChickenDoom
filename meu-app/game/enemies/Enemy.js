class Enemy {
    #health;

    constructor({ mesh, hp, speed, type }) {
        if (new.target === Enemy) {
            throw new TypeError("Enemy é uma classe base abstrata.");
        }
        this.mesh = mesh;
        this.#health = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.type = type;
        this.lastAttack = 0;
        this.lastRangedAttack = 0;
        this.bobTimer = Math.random() * 10;
        this.rs = 0;
    }

    get hp() {
        return this.#health;
    }

    set hp(value) {
        this.#health = Math.max(0, Number(value) || 0);
    }

    takeDamage(amount) {
        this.hp -= amount;
        return this.#health === 0;
    }

    get isBoss() {
        return false;
    }

    getRiseDuration() {
        return 1100;
    }

    getHeight() {
        return 3.6;
    }

    getAmmoDropCount(chance) {
        return Math.random() < chance ? 1 : 0;
    }
}

export class ChickenEnemy extends Enemy {}

export class BossEnemy extends Enemy {
    get isBoss() {
        return true;
    }

    getRiseDuration() {
        return 2000;
    }

    getHeight() {
        return 8;
    }

    getAmmoDropCount() {
        return 3;
    }
}
