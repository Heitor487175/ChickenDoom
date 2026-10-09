export class CombatSystem {
    constructor(dependencies) {
        this.state = dependencies.state;
        this.getEnemies = dependencies.getEnemies;
        this.getScene = dependencies.getScene;
        this.audio = dependencies.audio;
        this.effects = dependencies.effects;
    }

    damageEnemy(enemy, damage) {
        const enemies = this.getEnemies();
        enemy.takeDamage(damage);
        this.effects.triggerHitmarker();
        this.effects.spawnDamageNumber(damage, damage > 25);
        this.audio.playHit();
        this.effects.createFeatherParticles(enemy.mesh.position, 4);
        if (enemy.isBoss) this.effects.updateBossHPBar();
        if (enemy.hp > 0) return;

        const index = enemies.indexOf(enemy);
        if (index < 0) return;
        this.audio.playChickenCluck();
        this.effects.spawnFeatherItem(enemy.mesh.position);
        this.effects.maybeDropAmmo(enemy);
        this.getScene().remove(enemy.mesh);
        enemies.splice(index, 1);
        this.state.killsInEpoch++;
        this.state.totalKills++;
        this.state.stats.kills++;
        this.effects.syncHUD();
        if (this.effects.hasShip("vampiro")) {
            this.state.health = Math.min(this.state.maxHealth, this.state.health + 2);
            this.effects.updateHUD();
        }
        this.effects.checkGates();

        if (enemy.isBoss) {
            this.audio.playExplosion();
            this.effects.handleBossDefeated(enemy);
        }
    }
}
