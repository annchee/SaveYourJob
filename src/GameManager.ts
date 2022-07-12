var keyBestScore = "keyBestScore";

export default class GameManager extends Laya.Script {
    
    /** @prop {name:gameInfo, tips:"gameinfo", type:Node, default:null}*/
    gameInfo: any;
    /** @prop {name:gameOverBg, tips:"gameoverbg", type:Node, default:null}*/
    gameOverBg: any;

    /** @prop {name:action, tips:"action", type:Node, default:null}*/
    action: any;

    /** @prop {name:startBtn, tips:"startbtn", type:Node, default:null}*/
    startBtn: any;
    /** @prop {name:replayBtn, tips:"replaybtn", type:Node, default:null}*/
    replayBtn: any;
    /** @prop {name:audioBtn, tips:"audiobtn", type:Node, default:null}*/
    audioBtn: any;

    /** @prop {name:rockBtn, tips:"rockbtn", type:Node, default:null}*/
    rockBtn: any;
    /** @prop {name:scissorBtn, tips:"scissorbtn", type:Node, default:null}*/
    scissorBtn: any;
    /** @prop {name:paperBtn, tips:"paperbtn", type:Node, default:null}*/
    paperBtn: any;

    /** @prop {name:player, tips:"player", type:Node, default:null}*/
    player: any;
    /** @prop {name:boss, tips:"boss", type:Node, default:null}*/
    boss: any;

    /** @prop {name:guessBlur, tips:"guessblur", type:Node, default:null}*/
    guessBlur: any;

    /** @prop {name:guessOutput, tips:"guessoutput", type:Node, default:null}*/
    guessOutput: any;
    /** @prop {name:playerOutput, tips:"playeroutput", type:Node, default:null}*/
    playerOutput: any;

    /** @prop {name:countDownValue, tips:"countdownvalue", type:Node, default:null}*/
    public countDownValue:  any;

    /** @prop {name:scoreText, tips:"scoretext", type:Node, default:null}*/
    public scoreText:  any;
    /** @prop {name:score, tips:"score", type:Node, default:null}*/
    public score:  any;
    /** @prop {name:bestScore, tips:"bestscore", type:Node, default:null}*/
    public bestScore:  any;
    /** @prop {name:currentScore, tips:"currentscore", type:Node, default:null}*/
    public currentScore:  any;

    /** @prop {name:letterPlus, tips:"letterplus", type:Node, default:null}*/
    letterPlus:  any;
    /** @prop {name:letterMinus, tips:"letterMinus", type:Node, default:null}*/
    letterMinus:  any;
    /** @prop {name:letterGood, tips:"lettergood", type:Node, default:null}*/
    letterGood:  any;

    private nCountDown: number;
    private numHp:number = 0;
    private numScore: number;
    private count: number = 0;
    private bossLose = 1;
    private bossStage: number = 1;
    private numAction: number;

    private soundChannel: Laya.SoundChannel;
    private audioStatus:boolean = true;
    private playTime:number = 0;
    private currentMusic: string = 'bg_intro';

    constructor() 
    { 
        super(); 

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

        this.scoreText = null;
        this.score = null;
        this.bestScore = null;
        this.currentScore = null;

        this.letterPlus = null;
        this.letterMinus = null;
        this.letterGood = null;

        Laya.SoundManager.setMusicVolume(0.5);
        this.playMusic(this.currentMusic);
    }

    onStart(): void
    {
        this.audioBtn.on(Laya.Event.MOUSE_UP, this, this.onAudio);
        this.startBtn.once(Laya.Event.CLICK, this, this.onHideInfo);
    }

    onHideInfo():void
    {
        this.playSound('press_but', 0.5);
        
        this.currentMusic = 'bg';
        this.playMusic(this.currentMusic);
        this.gameInfo.visible = false;

        this.guessOutput.visible = false;
        this.playerOutput.visible = false;

        this.scoreText.visible = false;
        this.score.visible = false;

        this.countDownValue.visible = false;

        this.rockBtn.visible = false;
        this.scissorBtn.visible = false;
        this.paperBtn.visible = false;

        this.numAction = 4;
        this.action.text = ""+ this.numAction;

        Laya.timer.loop(1000,this, this.onAction);
    }

    onAction(): void
    {
        this.action.visible = true;
        
        this.action.scale(3,3);
        this.action.alpha = .2;
        Laya.Tween.to(this.action,{scaleX:1, scaleY:1,alpha:1}, 500, Laya.Ease.linearInOut);

        this.numAction --;

        if(this.numAction <= 0)
        {
            
            if(this.numAction == 0)
            {
                this.playSound('countdown_start',1);
                this.action.scale(1,1);
                this.action.text = "START";
            }
            else
            {
                Laya.timer.clear(this, this.onAction);
                this.action.visible = false;
                this.init();
            }
        }
        else
        {
            this.playSound('countdown_123',1);
            this.action.text = ""+ this.numAction;
        }
    }

    init(): void
    {
        this.player.interval = 800;

        this.boss.skin = "main/boss1.png";
        this.bossLose = 1;

        this.numHp = 0;

        this.numScore = 0;
        this.scoreText.visible = true;
        this.score.visible = true;
        this.score.value = "000";

        this.onDisableAllButton();

        Laya.timer.once(1000, this, this.onPlay);
    }

    onPlay(): void
    {
        this.guessBlur.visible = true;
        this.guessBlur.play(0,false);

        this.player.play(0,true);

        this.nCountDown = 3;
        this.countDownValue.value = "" + this.nCountDown;
        this.countDownValue.visible = false;

        Laya.timer.once(500, this, this.initRandomSymbol);
    }

    initRandomSymbol():void
    {
        this.guessBlur .visible = false;
        this.guessOutput.visible = true;

        var rand = Math.random()<.4 ? 1:Math.random()<.6 ?2:3;

        switch(rand)
        {
            case 1:
            {
                this.guessOutput.skin = "main/symbol_1.png";
                this.bossStage = 1;
                this.boss
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

        if(this.numScore <= 10)
        {
            this.nCountDown = 3;
            this.countDownValue.value = "3.00";
        }
        else
        {
            if(this.bossLose == 1)
            {
                this.nCountDown = 2.5;
                this.countDownValue.value = "2.50";  
            }
            else if(this.bossLose == 2)
            {
                this.nCountDown = 2;
                this.countDownValue.value = "2.00";  
            }
            else if(this.bossLose == 3)
            {
                this.nCountDown = 1.5;
                this.countDownValue.value = "1.50";  
            }
            else if(this.bossLose == 4)
            {
                this.nCountDown = 1;
                this.countDownValue.value = "1.00";  
            }
        }

        Laya.timer.once(500, this, this.onTimer);
    }

    onTimer(): void
    {
        var decreaseValue = .05;
        Laya.timer.loop(50, this, this.onCountDown, [decreaseValue]);
    }

    onRock():void
    {
        this.playSound('press_but', 0.5);

        Laya.timer.clear(this,this.onTimer);
        Laya.timer.clear(this, this.onCountDown);
        this.countDownValue.visible = false;

        this.onDisableAllButton();

        this.player.stop();
        this.playerOutput.visible = true;

        if(this.bossStage == 1 || this.bossStage == 2)
        {
            this.playSound("lose",1.0);
            
            this.bossLose ++;
            this.loseScore();
            
            this.numHp ++;
            this.updateHp();

            this.playerOutput.skin = "main/rock_wrong.png";

            Laya.Tween.to(this.letterPlus,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterPlus],true));
        }
        else if(this.bossStage == 3)
        {
            this.playSound("win",0.8);

            this.bossLose --;
            this.playerOutput.skin = "main/rock_correct.png";

            this.numScore ++;
            this.updateScore();

            if(this.bossLose <= 0)
            {
                this.bossLose = 1;
                this.loseScore();
            }
            else
            {
                this.loseScore();
            }

            this.numHp --;
            this.updateHp();

            this.onShowLetter();
        }

        this.onCheckCondition();
    }

    onScissor():void
    {
        this.playSound('press_but', 0.5);

        Laya.timer.clear(this,this.onTimer);
        Laya.timer.clear(this, this.onCountDown);
        this.countDownValue.visible = false;

        this.onDisableAllButton();

        this.player.stop();
        this.playerOutput.visible = true;

        if(this.bossStage == 2 || this.bossStage == 3)
        {
            this.playSound("lose",1.0);
            
            this.bossLose ++;
            this.loseScore();

            this.numHp ++;
            this.updateHp();

            this.playerOutput.skin = "main/scissor_wrong.png";

            Laya.Tween.to(this.letterPlus,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterPlus],true));
        }
        else if(this.bossStage == 1)
        {
            this.playSound("win",0.8);

            this.bossLose --;
            this.playerOutput.skin = "main/scissor_correct.png";

            this.numScore ++;
            this.updateScore();

            if(this.bossLose <= 0)
            {
                this.bossLose = 1;
                this.loseScore();
            }
            else
            {
                this.loseScore();
            }

            this.numHp --;
            this.updateHp();

            this.onShowLetter();
        }

        this.onCheckCondition();
    }

    onPaper():void
    {
        this.playSound('press_but', 0.5);
        
        Laya.timer.clear(this,this.onTimer);
        Laya.timer.clear(this, this.onCountDown);
        this.countDownValue.visible = false;

        this.onDisableAllButton();

        this.player.stop();
        this.playerOutput.visible = true;

        if(this.bossStage == 1 || this.bossStage == 3)
        {
            this.playSound("lose",1.0);
            
            this.bossLose ++;
            this.loseScore();

            this.numHp ++;
            this.updateHp();

            this.playerOutput.skin = "main/paper_wrong.png";
            
            Laya.Tween.to(this.letterPlus,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterPlus],true));
        }
        else if(this.bossStage == 2)
        {
            this.playSound("win",0.8);

            this.bossLose --;
            this.playerOutput.skin = "main/paper_correct.png";

            this.numScore ++;
            this.updateScore();

            if(this.bossLose <= 0)
            {
                this.bossLose = 1;
                this.loseScore();
            }
            else
            {
                this.loseScore();
            }

            this.numHp --;
            this.updateHp();

            this.onShowLetter();
        }

        this.onCheckCondition();
    }

    onCheckCondition(): void
    {
        if(this.bossLose == 1 || this.bossLose == 2 || this.bossLose == 3 || this.bossLose == 4)
        {   
            Laya.timer.once(800, this, this.onHide);
            this.onPlay();
        }
        else if(this.bossLose == 5)
        {
            this.playSound("bg_lose",1.0);
            
            Laya.timer.clear(this,this.onTimer);
            Laya.timer.clear(this, this.onCountDown);
            this.onFreeze();
        }
    }

    updateScore(): void
    {
        this.count = Math.log(this.numScore) * Math.LOG10E + 1 | 0;

        if(this.count <= 3)
        {
            switch(this.count)
            {
                case 1: 
                {
                    this.score.value = "00"+this.numScore;
                    break;
                }
                case 2: 
                {
                    this.score.value = "0"+this.numScore;
                    break;
                }
                case 3: 
                {
                    this.score.value = ""+this.numScore;
                    break;
                }
                default:
                    break;
            }

            this.count = 0;

            if(this.numScore <= 0)
            {
                this.numScore = 0;
                this.score.value = "000";
            }
            else if(this.numScore >= 999)
            {
                this.numScore = 999;
                this.score.value = "999";
            }
        }
    }

    updateHp(): void
    {
        if(this.numHp <= 0)
        {
            this.numHp = 0;
        }
        else if(this.numHp >= 4)
        {
            this.numHp = 4;
        }
    }

    onShowLetter(): void
    {
        if(this.bossLose == 1)
        {
            Laya.Tween.to(this.letterGood,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterGood],true));
        }
        else
        {
            Laya.Tween.to(this.letterMinus,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterMinus],true));
        }
    }

    onHide(): void
    {
        this.playerOutput.visible = false;
    }

    onHideLetter(iLetter:Laya.Text): void
    {
        Laya.Tween.to(iLetter,{alpha:0},200,Laya.Ease.bounceIn,Laya.Handler.create(this,this.onHideLetterComplete,null,true));
    }

    onHideLetterComplete(): void
    {
        this.letterMinus.scale(0,0);
        this.letterMinus.pos(97,281);
        this.letterMinus.alpha = 1;

        this.letterPlus.scale(0,0);
        this.letterPlus.pos(97,281);
        this.letterPlus.alpha = 1;

        this.letterGood.scale(0,0);
        this.letterGood.pos(96,282);
        this.letterGood.alpha = 1;
    }

    onCountDown(iValue:number): void 
    {
        
        if(this.nCountDown >= 0)
        {
            this.countDownValue.value = this.nCountDown.toFixed(2);
            this.nCountDown -= iValue;
            this.nCountDown = parseFloat(this.nCountDown.toFixed(2));
        }
        else 
        {  
            Laya.timer.clear(this,this.onTimer);
            Laya.timer.clear(this, this.onCountDown);

            this.countDownValue.visible = false;

            this.onDisableAllButton();

            Laya.Tween.to(this.letterPlus,{y:182,scaleX:1,scaleY:1},500,Laya.Ease.backOut,Laya.Handler.create(this,this.onHideLetter,[this.letterPlus],true));

            this.bossLose ++;
            this.loseScore();
            this.onCheckCondition();
        }
    }

    onDisableAllButton(): void
    { 
        this.rockBtn.disabled = true;
        this.scissorBtn.disabled = true;
        this.paperBtn.disabled = true;

        this.rockBtn.visible = false;
        this.scissorBtn.visible = false;
        this.paperBtn.visible = false;
    }

    loseScore(): void
    {
        if(this.bossLose == 1)
        {
            this.player.interval = 800;
            this.boss.skin = "main/boss1.png";
        }

        if(this.bossLose == 2)
        {
            this.player.interval = 600;
            this.boss.skin = "main/boss2.png";
        }

        if(this.bossLose == 3)
        {
            this.player.interval = 300;
            this.boss.skin = "main/boss3.png";
        }

        if(this.bossLose == 4)
        {
            this.player.interval = 100;
            this.boss.skin = "main/boss4.png";
        }

        if(this.bossLose == 5)
        {
            this.boss.skin = "main/boss5.png";
        }
    }

    onFreeze(): void
    {
        this.player.stop();
        this.guessBlur.stop();
        this.guessBlur.visible = false;

        Laya.timer.once(2000, this, this.gameOver);
    }

    gameOver(): void
    {
        this.currentMusic = 'bg_game_over';
        this.playMusic(this.currentMusic);

        this.gameOverBg.visible = true;

        this.boss.skin = "main/boss1.png";

        this.currentScore.text = this.numScore;

        var tempBestScore = 0;
        if(window.localStorage[keyBestScore])
        {
            if(window.localStorage[keyBestScore] > this.numScore)
            {
                tempBestScore = window.localStorage[keyBestScore];
            }
            else
            {
                tempBestScore = this.numScore;
            }
        }
        else
        {
            tempBestScore = this.numScore;
        }

        window.localStorage[keyBestScore] = tempBestScore;
        this.bestScore.text = "" + tempBestScore;

        this.replayBtn.once(Laya.Event.MOUSE_UP, this, this.restartGame);
    }

    restartGame(): void 
    {
        this.gameOverBg.visible = false;  
        this.onHideInfo(); 
    }

    onAudio(): void
    {
        this.playSound('press_but', 0.5);

        if(this.audioStatus == true)
        {
            this.audioStatus = false;
            this.audioBtn.skin = "main/btn_audio_off.png";
            this.playTime = this.soundChannel.position;
            this.soundChannel.stop();
        }
        else if(this.audioStatus == false)
        {
            this.audioStatus = true;
            this.audioBtn.skin = "main/btn_audio_on.png";
            var soundUrl = "res/sound/"+this.currentMusic+".mp3";
            this.soundChannel = Laya.SoundManager.playMusic(soundUrl,0,null, this.playTime);
        }

        Laya.SoundManager.soundMuted = !this.audioStatus;
    }

    playMusic(soundName: string) : void
    {
        if(this.audioStatus)
        {
            this.soundChannel = Laya.SoundManager.playMusic("res/sound/"+soundName+".mp3", 0);
            Laya.SoundManager.useAudioMusic = false;
        }
    }

    playSound(soundName:string, soundVolume:number):void
    {
        Laya.SoundManager.setSoundVolume(soundVolume);
        Laya.SoundManager.playSound("res/sound/"+soundName+".mp3", 1);
    }
}