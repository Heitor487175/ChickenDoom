import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";

const source = readFileSync(new URL("../public/crazygames.js", import.meta.url), "utf8");

function loadBridge(sdk) {
  const window = { CrazyGames: sdk ? { SDK: sdk } : undefined };
  const document = { getElementById: () => null };
  runInNewContext(source, { window, document, console });
  return window.CrazyGamesBridge;
}

test("continues immediately when the CrazyGames SDK is unavailable", () => {
  const bridge = loadBridge(null);
  let completed = 0;
  bridge.requestMidgameAd(() => completed++);
  assert.equal(completed, 1);
});

test("reports gameplay lifecycle after asynchronous SDK initialization", async () => {
  const calls = [];
  const sdk = {
    init: async () => calls.push("init"),
    game: {
      loadingStart: () => calls.push("loadingStart"),
      loadingStop: () => calls.push("loadingStop"),
      gameplayStart: () => calls.push("gameplayStart"),
      gameplayStop: () => calls.push("gameplayStop")
    }
  };
  const bridge = loadBridge(sdk);
  bridge.setGameplayActive(true);
  bridge.markLoadingComplete();
  await bridge.initialize();
  bridge.setGameplayActive(false);
  assert.deepEqual(calls, ["init", "loadingStart", "loadingStop", "gameplayStart", "gameplayStop"]);
});

test("mutes and stops gameplay during an ad, then restores both afterward", async () => {
  const calls = [];
  let adCallbacks;
  const sdk = {
    init: async () => {},
    game: {
      loadingStart: () => {},
      loadingStop: () => {},
      gameplayStart: () => calls.push("gameplayStart"),
      gameplayStop: () => calls.push("gameplayStop")
    },
    ad: {
      requestAd: (type, callbacks) => {
        calls.push(type);
        adCallbacks = callbacks;
      }
    }
  };
  const bridge = loadBridge(sdk);
  await bridge.initialize();
  bridge.setAudioHandler(muted => calls.push(muted ? "mute" : "unmute"));
  bridge.setGameplayActive(true);
  let completed = 0;
  bridge.requestMidgameAd(() => completed++);
  adCallbacks.adStarted();
  adCallbacks.adFinished();
  assert.deepEqual(calls, ["gameplayStart", "midgame", "gameplayStop", "mute", "unmute", "gameplayStart"]);
  assert.equal(completed, 1);
});