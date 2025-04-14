import { WeiboApiService } from "./WeiboApiService";

export class AppContext {
    wb: WeiboApiService;
    constructor() {

    }
    setWeboApiService(wb: WeiboApiService) {
        this.wb = wb;
    }
    getWeboApiService() {
        return this.wb;
    }
}

export function setUpContext(){
    const appContext = new AppContext();
    appContext.setWeboApiService(new WeiboApiService());
    return appContext; 
}