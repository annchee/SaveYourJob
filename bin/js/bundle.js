(function () {
    'use strict';

    var keyBestScore = "keyBestScore";
    class GameManager extends Laya.Script {
        constructor() {
            super();
            this.numHp = 0;
            this.count = 0;
            this.bossLose = 1;
            this.bossStage = 1;
            this.audioStatus = true;
            this.playTime = 0;
            this.currentMusic = 'bg_intro';
            this.gameInfo = null;
            this.startBtn = null;
            this.audioBtn = null;
            this.gameOverBg = null;
            this.replayBtn = null;
            this.action = null;
            this.rockBtn = null;
            this.scissorBtn = null;
            this.paperBtn = null;
            this.player = null;
            this.boss = null;
            this.guessBlur = null;
            this.guessOutput = null;
            this.playerOutput = null;
            this.countDownValue = null;
            this.angryBox = null;
            this.angryHpValue = null;
            this.scoreText = null;
            this.score = null;
            this.bestScore = null;
            this.currentScore = null;
            this.letterPlus = null;
            this.letterMinus = null;
            Laya.SoundManager.setMusicVolume(0.5);
            this.playMusic(this.currentMusic);
        }
        onAwake() {
            var resourceArray = [
                { url: "main/bg.png", type: Laya.Loader.IMAGE },
                { url: "res/atlas/symbol.atlas", type: Laya.Loader.ATLAS },
                { url: "main/end_bg.png", type: Laya.Loader.IMAGE },
                { url: "res/atlas/player.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/main.atlas", type: Laya.Loader.ATLAS },
                { url: "res/sound/bg.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/bg_intro.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/bg_game_over.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/bg_lose.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/countdown_123.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/countdown_start.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/press_but.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/win.mp3", type: Laya.Loader.SOUND },
                { url: "res/sound/lose.mp3", type: Laya.Loader.SOUND }
            ];
            Laya.loader.load(resourceArray, Laya.Handler.create(this, this.onLoad));
        }
        onLoad() {
            Laya.timer.once(1000, this, this.startGame);
        }
        startGame() {
            this.audioBtn.on(Laya.Event.MOUSE_UP, this, this.onAudio);
            this.startBtn.once(Laya.Event.CLICK, this, this.onHideInfo);
        }
        onHideInfo() {
            this.playSound('press_but', 0.5);
            this.currentMusic = 'bg';
            this.playMusic(this.currentMusic);
            this.gameInfo.visible = false;
            this.guessOutput.visible = false;
            this.playerOutput.visible = false;
            this.angryBox.visible = false;
            this.scoreText.visible = false;
            this.score.visible = false;
            this.countDownValue.visible = false;
            this.rockBtn.visible = false;
            this.scissorBtn.visible = false;
            this.paperBtn.visible = false;
            this.numAction = 4;
            this.action.text = "" + this.numAction;
            Laya.timer.loop(1000, this, this.onAction);
        }
        onAction() {
            this.action.visible = true;
            this.action.scale(3, 3);
            this.action.alpha = .2;
            Laya.Tween.to(this.action, { scaleX: 1, scaleY: 1, alpha: 1 }, 500, Laya.Ease.linearInOut);
            this.numAction--;
            if (this.numAction <= 0) {
                if (this.numAction == 0) {
                    this.playSound('countdown_start', 1);
                    this.action.scale(1, 1);
                    this.action.text = "START";
                }
                else {
                    Laya.timer.clear(this, this.onAction);
                    this.action.visible = false;
                    this.init();
                }
            }
            else {
                this.playSound('countdown_123', 1);
                this.action.text = "" + this.numAction;
            }
        }
        init() {
            this.player.interval = 800;
            this.boss.skin = "main/boss1.png";
            this.bossLose = 1;
            this.numHp = 0;
            this.angryBox.visible = true;
            this.angryHpValue.value = "" + this.numHp;
            this.numScore = 0;
            this.scoreText.visible = true;
            this.score.visible = true;
            this.score.value = "000";
            this.rockBtn.visible = false;
            this.scissorBtn.visible = false;
            this.paperBtn.visible = false;
            Laya.timer.once(1000, this, this.onPlay);
        }
        onPlay() {
            this.guessBlur.visible = true;
            this.guessBlur.play(0, false);
            this.player.play(0, true);
            this.nCountDown = 3;
            this.countDownValue.value = "" + this.nCountDown;
            this.countDownValue.visible = false;
            Laya.timer.once(500, this, this.initRandomSymbol);
        }
        initRandomSymbol() {
            this.guessBlur.visible = false;
            this.guessOutput.visible = true;
            var rand = Math.random() < .4 ? 1 : Math.random() < .6 ? 2 : 3;
            switch (rand) {
                case 1:
                    {
                        this.guessOutput.skin = "main/symbol_1.png";
                        this.bossStage = 1;
                        this.boss;
                        break;
                    }
                case 2:
                    {
                        this.guessOutput.skin = "main/symbol_2.png";
                        this.bossStage = 2;
                        break;
                    }
                case 3:
                    {
                        this.guessOutput.skin = "main/symbol_3.png";
                        this.bossStage = 3;
                        break;
                    }
            }
            this.rockBtn.disabled = false;
            this.scissorBtn.disabled = false;
            this.paperBtn.disabled = false;
            this.rockBtn.visible = true;
            this.scissorBtn.visible = true;
            this.paperBtn.visible = true;
            this.rockBtn.once(Laya.Event.MOUSE_UP, this, this.onRock);
            this.scissorBtn.once(Laya.Event.MOUSE_UP, this, this.onScissor);
            this.paperBtn.once(Laya.Event.MOUSE_UP, this, this.onPaper);
            this.countDownValue.visible = true;
            if (this.numScore <= 10) {
                this.nCountDown = 3;
                this.countDownValue.value = "3.00";
            }
            else {
                if (this.bossLose == 1) {
                    this.nCountDown = 2.5;
                    this.countDownValue.value = "2.50";
                }
                else if (this.bossLose == 2) {
                    this.nCountDown = 2.5;
                    this.countDownValue.value = "2.50";
                }
                else if (this.bossLose == 3) {
                    this.nCountDown = 2;
                    this.countDownValue.value = "2.00";
                }
                else if (this.bossLose == 4) {
                    this.nCountDown = 1.5;
                    this.countDownValue.value = "1.50";
                }
            }
            Laya.timer.once(500, this, this.onTimer);
        }
        onTimer() {
            var decreaseValue = .05;
            Laya.timer.loop(50, this, this.onCountDown, [decreaseValue]);
        }
        onRock() {
            this.playSound('press_but', 0.5);
            Laya.timer.clear(this, this.onTimer);
            Laya.timer.clear(this, this.onCountDown);
            this.countDownValue.visible = false;
            this.rockBtn.disabled = true;
            this.scissorBtn.disabled = true;
            this.paperBtn.disabled = true;
            this.player.stop();
            this.playerOutput.visible = true;
            if (this.bossStage == 1 || this.bossStage == 2) {
                this.playSound("lose", 1.0);
                this.bossLose++;
                this.loseScore();
                this.numHp++;
                this.updateHp();
                this.playerOutput.skin = "main/rock_wrong.png";
                Laya.Tween.to(this.letterPlus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterPlus, null, true));
            }
            else if (this.bossStage == 3) {
                this.playSound("win", 0.8);
                this.bossLose--;
                this.playerOutput.skin = "main/rock_correct.png";
                this.numScore++;
                this.updateScore();
                if (this.bossLose <= 0) {
                    this.bossLose = 1;
                    this.loseScore();
                }
                else {
                    this.loseScore();
                }
                this.numHp--;
                this.updateHp();
                Laya.Tween.to(this.letterMinus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterMinus, null, true));
            }
            this.onCheckCondition();
        }
        onScissor() {
            this.playSound('press_but', 0.5);
            Laya.timer.clear(this, this.onTimer);
            Laya.timer.clear(this, this.onCountDown);
            this.countDownValue.visible = false;
            this.rockBtn.disabled = true;
            this.scissorBtn.disabled = true;
            this.paperBtn.disabled = true;
            this.player.stop();
            this.playerOutput.visible = true;
            if (this.bossStage == 2 || this.bossStage == 3) {
                this.playSound("lose", 1.0);
                this.bossLose++;
                this.loseScore();
                this.numHp++;
                this.updateHp();
                this.playerOutput.skin = "main/scissor_wrong.png";
                Laya.Tween.to(this.letterPlus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterPlus, null, true));
            }
            else if (this.bossStage == 1) {
                this.playSound("win", 0.8);
                this.bossLose--;
                this.playerOutput.skin = "main/scissor_correct.png";
                this.numScore++;
                this.updateScore();
                if (this.bossLose <= 0) {
                    this.bossLose = 1;
                    this.loseScore();
                }
                else {
                    this.loseScore();
                }
                this.numHp--;
                this.updateHp();
                Laya.Tween.to(this.letterMinus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterMinus, null, true));
            }
            this.onCheckCondition();
        }
        onPaper() {
            this.playSound('press_but', 0.5);
            Laya.timer.clear(this, this.onTimer);
            Laya.timer.clear(this, this.onCountDown);
            this.countDownValue.visible = false;
            this.rockBtn.disabled = true;
            this.scissorBtn.disabled = true;
            this.paperBtn.disabled = true;
            this.player.stop();
            this.playerOutput.visible = true;
            if (this.bossStage == 1 || this.bossStage == 3) {
                this.playSound("lose", 1.0);
                this.bossLose++;
                this.loseScore();
                this.numHp++;
                this.updateHp();
                this.playerOutput.skin = "main/paper_wrong.png";
                Laya.Tween.to(this.letterPlus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterPlus, null, true));
            }
            else if (this.bossStage == 2) {
                this.playSound("win", 0.8);
                this.bossLose--;
                this.playerOutput.skin = "main/paper_correct.png";
                this.numScore++;
                this.updateScore();
                if (this.bossLose <= 0) {
                    this.bossLose = 1;
                    this.loseScore();
                }
                else {
                    this.loseScore();
                }
                this.numHp--;
                this.updateHp();
                Laya.Tween.to(this.letterMinus, { y: 182, scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.onHideLetterMinus, null, true));
            }
            this.onCheckCondition();
        }
        onCheckCondition() {
            if (this.bossLose == 1 || this.bossLose == 2 || this.bossLose == 3 || this.bossLose == 4) {
                Laya.timer.once(800, this, this.onHide);
                this.onPlay();
            }
            else if (this.bossLose == 5) {
                this.playSound("bg_lose", 1.0);
                Laya.timer.clear(this, this.onTimer);
                Laya.timer.clear(this, this.onCountDown);
                this.onFreeze();
            }
        }
        updateScore() {
            this.count = Math.log(this.numScore) * Math.LOG10E + 1 | 0;
            if (this.count <= 3) {
                switch (this.count) {
                    case 1:
                        {
                            this.score.value = "00" + this.numScore;
                            break;
                        }
                    case 2:
                        {
                            this.score.value = "0" + this.numScore;
                            break;
                        }
                    case 3:
                        {
                            this.score.value = "" + this.numScore;
                            break;
                        }
                    default:
                        break;
                }
                this.count = 0;
                if (this.numScore <= 0) {
                    this.numScore = 0;
                    this.score.value = "000";
                }
                else if (this.numScore >= 999) {
                    this.numScore = 999;
                    this.score.value = "999";
                }
            }
        }
        updateHp() {
            if (this.numHp <= 0) {
                this.numHp = 0;
            }
            else if (this.numHp >= 4) {
                this.numHp = 4;
            }
            this.angryHpValue.value = "" + this.numHp;
        }
        onHide() {
            this.playerOutput.visible = false;
        }
        onHideLetterPlus() {
            Laya.Tween.to(this.letterPlus, { alpha: 0 }, 200, Laya.Ease.bounceIn, Laya.Handler.create(this, this.onHideLetterComplete, null, true));
        }
        onHideLetterMinus() {
            Laya.Tween.to(this.letterMinus, { alpha: 0 }, 200, Laya.Ease.bounceIn, Laya.Handler.create(this, this.onHideLetterComplete, null, true));
        }
        onHideLetterComplete() {
            this.letterMinus.scale(0, 0);
            this.letterMinus.pos(97, 281);
            this.letterMinus.alpha = 1;
            this.letterPlus.scale(0, 0);
            this.letterPlus.pos(97, 281);
            this.letterPlus.alpha = 1;
        }
        onCountDown(iValue) {
            if (this.nCountDown >= 0) {
                this.countDownValue.value = this.nCountDown.toFixed(2);
                this.nCountDown -= iValue;
                this.nCountDown = parseFloat(this.nCountDown.toFixed(2));
            }
            else {
                Laya.timer.clear(this, this.onTimer);
                Laya.timer.clear(this, this.onCountDown);
                this.countDownValue.visible = false;
                this.bossLose++;
                this.loseScore();
                this.onCheckCondition();
            }
        }
        loseScore() {
            if (this.bossLose == 1) {
                this.player.interval = 800;
                this.boss.skin = "main/boss1.png";
            }
            if (this.bossLose == 2) {
                this.player.interval = 600;
                this.boss.skin = "main/boss2.png";
            }
            if (this.bossLose == 3) {
                this.player.interval = 300;
                this.boss.skin = "main/boss3.png";
            }
            if (this.bossLose == 4) {
                this.player.interval = 100;
                this.boss.skin = "main/boss4.png";
            }
            if (this.bossLose == 5) {
                this.boss.skin = "main/boss5.png";
            }
        }
        onFreeze() {
            this.player.stop();
            this.guessBlur.stop();
            this.guessBlur.visible = false;
            this.rockBtn.disabled = true;
            this.scissorBtn.disabled = true;
            this.paperBtn.disabled = true;
            Laya.timer.once(2000, this, this.gameOver);
        }
        gameOver() {
            this.currentMusic = 'bg_game_over';
            this.playMusic(this.currentMusic);
            this.gameOverBg.visible = true;
            this.boss.skin = "main/boss1.png";
            this.currentScore.text = this.numScore;
            var tempBestScore = 0;
            if (window.localStorage[keyBestScore]) {
                if (window.localStorage[keyBestScore] > this.numScore) {
                    tempBestScore = window.localStorage[keyBestScore];
                }
                else {
                    tempBestScore = this.numScore;
                }
            }
            else {
                tempBestScore = this.numScore;
            }
            window.localStorage[keyBestScore] = tempBestScore;
            this.bestScore.text = "" + tempBestScore;
            this.replayBtn.once(Laya.Event.MOUSE_UP, this, this.restartGame);
        }
        restartGame() {
            this.gameOverBg.visible = false;
            this.onHideInfo();
        }
        onAudio() {
            this.playSound('press_but', 0.5);
            if (this.audioStatus == true) {
                this.audioStatus = false;
                this.audioBtn.skin = "main/btn_audio_off.png";
                this.playTime = this.soundChannel.position;
                this.soundChannel.stop();
            }
            else if (this.audioStatus == false) {
                this.audioStatus = true;
                this.audioBtn.skin = "main/btn_audio_on.png";
                var soundUrl = "res/sound/" + this.currentMusic + ".mp3";
                this.soundChannel = Laya.SoundManager.playMusic(soundUrl, 0, null, this.playTime);
            }
            Laya.SoundManager.soundMuted = !this.audioStatus;
        }
        playMusic(soundName) {
            if (this.audioStatus) {
                this.soundChannel = Laya.SoundManager.playMusic("res/sound/" + soundName + ".mp3", 0);
                Laya.SoundManager.useAudioMusic = false;
            }
        }
        playSound(soundName, soundVolume) {
            Laya.SoundManager.setSoundVolume(soundVolume);
            Laya.SoundManager.playSound("res/sound/" + soundName + ".mp3", 1);
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("GameManager.ts", GameManager);
        }
    }
    GameConfig.width = 1066;
    GameConfig.height = 600;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
