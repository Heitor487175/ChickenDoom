(function () {
    const bridge = {
        sdk: null,
        initStarted: false,
        loadingComplete: false,
        gameplayActive: false,
        reportedGameplay: null,
        audioHandler: null,

        setAudioHandler(handler) {
            this.audioHandler = handler;
        },

        setGameplayActive(active) {
            this.gameplayActive = active;
            this.syncGameplay();
        },

        markLoadingComplete() {
            this.loadingComplete = true;
            if (this.sdk) this.callGameMethod('loadingStop');
        },

        syncGameplay() {
            if (!this.sdk || this.reportedGameplay === this.gameplayActive) return;
            const method = this.gameplayActive ? 'gameplayStart' : 'gameplayStop';
            this.reportedGameplay = this.gameplayActive;
            this.callGameMethod(method);
        },

        callGameMethod(method) {
            try {
                const callback = this.sdk && this.sdk.game && this.sdk.game[method];
                if (typeof callback === 'function') callback.call(this.sdk.game);
            } catch (error) {
                console.warn(`CrazyGames ${method} failed`, error);
            }
        },

        async initialize() {
            if (this.initStarted || !window.CrazyGames || !window.CrazyGames.SDK) return;
            this.initStarted = true;
            const sdk = window.CrazyGames.SDK;
            try {
                await sdk.init();
                this.sdk = sdk;
                this.reportedGameplay = false;
                this.callGameMethod('loadingStart');
                if (this.loadingComplete) this.callGameMethod('loadingStop');
                this.syncGameplay();
            } catch (error) {
                console.warn('CrazyGames SDK unavailable; continuing without platform features.', error);
            }
        },

        requestMidgameAd(onComplete) {
            const finish = (() => {
                let completed = false;
                return () => {
                    if (completed) return;
                    completed = true;
                    if (this.audioHandler) this.audioHandler(false);
                    this.syncGameplay();
                    onComplete();
                };
            })();

            if (!this.sdk || !this.sdk.ad || typeof this.sdk.ad.requestAd !== 'function') {
                finish();
                return;
            }

            try {
                this.sdk.ad.requestAd('midgame', {
                    adStarted: () => {
                        this.callGameMethod('gameplayStop');
                        this.reportedGameplay = false;
                        if (this.audioHandler) this.audioHandler(true);
                    },
                    adFinished: finish,
                    adError: finish
                });
            } catch (error) {
                console.warn('CrazyGames midgame ad failed; resuming the game.', error);
                finish();
            }
        }
    };

    window.CrazyGamesBridge = bridge;

    const sdkScript = document.getElementById('crazygames-sdk');
    if (window.CrazyGames && window.CrazyGames.SDK) {
        bridge.initialize();
    } else if (sdkScript) {
        sdkScript.addEventListener('load', () => bridge.initialize(), { once: true });
    }
})();
