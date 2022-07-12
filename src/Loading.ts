export default class Loading extends Laya.Script 
{
    /** @prop {name:progressBar, tips:"loadingprogress", type:Node, default:null}*/
    progressBar: any;

    private progressBarWidth:number;
    
    constructor() 
    { 
        super();
        this.progressBar = null; 
    }
    
    onStart(): void
    {
        this.progressBarWidth = this.progressBar.width;
        this.progressBar.width = 0;
        
        var resourceArray = [
            {url:"main/bg.png", type:Laya.Loader.IMAGE},
            {url:"res/atlas/symbol.atlas", type:Laya.Loader.ATLAS},
            {url:"main/end_bg.png", type:Laya.Loader.IMAGE},
            {url:"res/atlas/player.atlas", type:Laya.Loader.ATLAS},
            {url:"res/atlas/main.atlas", type:Laya.Loader.ATLAS},
            {url:"res/sound/bg.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/bg_intro.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/bg_game_over.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/bg_lose.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/countdown_123.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/countdown_start.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/press_but.mp3", type:Laya.Loader.SOUND},
            {url:"res/sound/win.mp3", type:Laya.Loader.SOUND},  
            {url:"res/sound/lose.mp3", type:Laya.Loader.SOUND}
        ];
       
        Laya.loader.load(resourceArray,Laya.Handler.create(this,this.onLoaded),
        Laya.Handler.create(this,this.onProgress,null,false));
        
    }

    onLoaded():void
    {
        this.progressBar.width = this.progressBarWidth;
    }

    onProgress(value: number): void
    {
        var percentProgressBar:number = this.progressBarWidth * value;
        this.progressBar.width = percentProgressBar;

        if(value == 1)
        {
            Laya.Scene.open('Main.scene', true, 0, Laya.Handler.create(this, ()=>{
                Laya.Scene.destroy("Loading.scene");
            }));
            return;
        }
    }
}