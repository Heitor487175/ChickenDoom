import { Application, Container, Graphics, Text } from "pixi.js";

export class PixiHud {
    #application = new Application();
    #state = null;
    #elements = null;
    #hudElement = null;

    async initialize(container) {
        await this.#application.init({
            resizeTo: window,
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
            resolution: Math.min(window.devicePixelRatio || 1, 2),
            preference: "webgl"
        });

        const canvas = this.#application.canvas;
        canvas.className = "pixi-hud-canvas";
        canvas.setAttribute("aria-hidden", "true");
        container.appendChild(canvas);
        this.#hudElement = document.getElementById("hud");

        const stage = this.#application.stage;
        const top = this.#createPanel();
        const left = this.#createPanel();
        const right = this.#createPanel();
        stage.addChild(top.container, left.container, right.container);

        this.#elements = {
            top,
            left,
            right,
            healthBar: new Graphics(),
            shieldBar: new Graphics(),
            objectiveBar: new Graphics(),
            healthPulse: new Graphics()
        };

        left.container.addChild(this.#elements.healthPulse);
        left.container.addChild(this.#elements.healthBar);
        left.container.addChild(this.#elements.shieldBar);
        top.container.addChild(this.#elements.objectiveBar);

        this.#application.ticker.add(() => this.#updateVisibility());
        this.#application.ticker.add(() => this.#pulseLowHealth());
        window.addEventListener("resize", () => this.#render());
        this.#render();
    }

    update(state) {
        this.#state = state;
        this.#render();
    }

    #createPanel() {
        const container = new Container();
        const background = new Graphics();
        container.addChild(background);
        const labels = Array.from({ length: 6 }, () => {
            const text = new Text({
                text: "",
                style: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 14,
                    fill: 0xffffff
                }
            });
            container.addChild(text);
            return text;
        });
        return { container, background, labels };
    }

    #setPanel(graphics, x, y, width, height, accent) {
        graphics.clear();
        graphics
            .roundRect(x, y, width, height, 12)
            .fill({ color: 0x080d15, alpha: 0.86 })
            .roundRect(x, y, width, height, 12)
            .stroke({ color: accent, alpha: 0.78, width: 1.5 });
    }

    #setText(text, value, x, y, fontSize, color = 0xffffff, bold = false) {
        text.text = value;
        text.style.fontSize = fontSize;
        text.style.fill = color;
        text.style.fontWeight = bold ? "700" : "400";
        text.position.set(x, y);
    }

    #setBar(graphics, x, y, width, height, ratio, color) {
        graphics.clear();
        graphics.roundRect(x, y, width, height, height / 2).fill({ color: 0x27313e });
        const fillWidth = Math.max(0, (width - 2) * Math.min(1, Math.max(0, ratio)));
        if (fillWidth > 0) {
            graphics.roundRect(x + 1, y + 1, fillWidth, height - 2, (height - 2) / 2)
                .fill({ color });
        }
    }

    #render() {
        if (!this.#elements) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        const compact = width < 600;
        const margin = compact ? 12 : 22;
        const fontScale = compact ? Math.max(0.82, width / 440) : 1;
        const panelWidth = compact ? Math.min(220, (width - margin * 3) / 2) : 270;
        const panelHeight = compact ? 132 : 140;
        const topWidth = Math.min(width - margin * 2, 500);
        const topHeight = compact ? 104 : 112;
        const topX = (width - topWidth) / 2;
        const topY = margin;
        const bottomY = Math.max(topY + topHeight + 14, height - margin - panelHeight);
        const leftX = margin;
        const rightX = width - margin - panelWidth;
        const { top, left, right, healthBar, shieldBar, objectiveBar, healthPulse } = this.#elements;
        const data = this.#state;

        this.#setPanel(top.background, topX, topY, topWidth, topHeight, 0x38bdf8);
        this.#setPanel(left.background, leftX, bottomY, panelWidth, panelHeight, 0xef4444);
        this.#setPanel(right.background, rightX, bottomY, panelWidth, panelHeight, 0xa78bfa);

        const [topCaption, topObjective, topProgress, topCount, topEpoch] = top.labels;
        const [leftCaption, healthText, healthValue, shieldText, shieldValue] = left.labels;
        const [rightCaption, weaponText, weaponLevel, ammoLabel, ammoValue] = right.labels;
        const small = 10 * fontScale;
        const body = 13 * fontScale;
        const number = 17 * fontScale;

        this.#setText(topCaption, data?.epochLabel || "", topX + 14, topY + 10, small, 0x67e8f9, true);
        this.#setText(topEpoch, data?.phaseLabel || "", topX + topWidth - 14, topY + 10, small, 0xcbd5e1, true);
        topEpoch.anchor.set(1, 0);
        this.#setText(topObjective, data?.objective || "", topX + 14, topY + 32, body, 0xffffff, true);
        this.#setText(topProgress, data?.progressLabel || "", topX + 14, topY + 58, small, 0xcbd5e1);
        this.#setText(topCount, data?.progressCount || "", topX + topWidth - 14, topY + 58, small, 0xffffff, true);
        topCount.anchor.set(1, 0);
        this.#setBar(objectiveBar, topX + 14, topY + 79, topWidth - 28, 7, data?.progress ?? 0, 0x38bdf8);

        this.#setText(leftCaption, "SOBREVIVÊNCIA", leftX + 14, bottomY + 11, small, 0xfca5a5, true);
        this.#setText(healthText, "VIDA", leftX + 14, bottomY + 34, small, 0xfda4af, true);
        this.#setText(healthValue, `${data?.health ?? 0} / ${data?.maxHealth ?? 0}`, leftX + panelWidth - 14, bottomY + 31, body, 0xffffff, true);
        healthValue.anchor.set(1, 0);
        this.#setBar(healthBar, leftX + 14, bottomY + 51, panelWidth - 28, 6, data?.healthRatio ?? 0, 0xef4444);
        this.#setText(shieldText, "ESCUDO", leftX + 14, bottomY + 68, small, 0x67e8f9, true);
        this.#setText(shieldValue, `${data?.shield ?? 0}%`, leftX + panelWidth - 14, bottomY + 65, body, 0xffffff, true);
        shieldValue.anchor.set(1, 0);
        this.#setBar(shieldBar, leftX + 14, bottomY + 85, panelWidth - 28, 6, data?.shieldRatio ?? 0, 0x22d3ee);
        const temporal = left.labels[5];
        this.#setText(temporal, data?.temporalState || "PRESENTE", leftX + 14, bottomY + 105, small, 0xc4b5fd, true);

        this.#setText(rightCaption, "ARSENAL", rightX + 14, bottomY + 11, small, 0xc4b5fd, true);
        const weaponName = data?.weaponName || "";
        const maxWeaponLength = panelWidth < 190 ? 13 : 22;
        const visibleWeaponName = weaponName.length > maxWeaponLength
            ? `${weaponName.slice(0, maxWeaponLength - 1)}…`
            : weaponName;
        this.#setText(weaponText, visibleWeaponName, rightX + 14, bottomY + 34, body, 0xffffff, true);
        this.#setText(weaponLevel, `NV ${data?.weaponLevel ?? 1}`, rightX + panelWidth - 14, bottomY + 36, small, 0xcbd5e1, true);
        weaponLevel.anchor.set(1, 0);
        this.#setText(ammoLabel, data?.ammoLabel || "MUNIÇÃO", rightX + 14, bottomY + 60, small, 0xfde68a, true);
        this.#setText(ammoValue, `${data?.magazine ?? 0} / ${data?.reserve ?? 0}`, rightX + 14, bottomY + 77, number, 0xfef3c7, true);
        const arsenalHint = right.labels[5];
        const status = data?.upgradesAvailable ? "MELHORIAS DISPONÍVEIS" : `PENAS ${data?.feathers ?? 0}`;
        this.#setText(arsenalHint, status, rightX + 14, bottomY + 111, small, data?.upgradesAvailable ? 0xfbbf24 : 0xcbd5e1, true);

        healthPulse.clear();
        if ((data?.healthRatio ?? 1) <= 0.25) {
            healthPulse
                .roundRect(leftX + 10, bottomY + 27, panelWidth - 20, 36, 6)
                .stroke({ color: 0xef4444, alpha: 0.65, width: 1 });
        }

        this.#updateVisibility();
    }

    #updateVisibility() {
        if (this.#hudElement) {
            this.#application.canvas.style.display = this.#hudElement.classList.contains("hidden") ? "none" : "block";
        }
    }

    #pulseLowHealth() {
        if (!this.#elements) return;
        const isLow = (this.#state?.healthRatio ?? 1) <= 0.25;
        this.#elements.healthPulse.alpha = isLow ? 0.58 + Math.sin(performance.now() / 420) * 0.2 : 0;
    }
}
