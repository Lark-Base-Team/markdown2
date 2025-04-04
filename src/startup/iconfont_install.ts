import { App } from "vue"
import { Starter } from "./starter"
import "../assets/iconfont/iconfont.css";
import "../assets/iconfont/iconfont.js";
export class iconfont_starter implements Starter {
    name: string = "iconfont_starter"
    start(app: App) {
        console.log("iconfont_starter")
    }
}
