/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Loading from "./Loading"
import GameManager from "./GameManager"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1066;
    static height:number=600;
    static scaleMode:string="showall";
    static screenMode:string="horizontal";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="Loading.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("Loading.ts",Loading);
        reg("GameManager.ts",GameManager);
    }
}
GameConfig.init();