import Cherry from "cherry-markdown";
import { UserSettingsServices } from "./UserSettingsServices";

export class AppContext {
    userSettings: UserSettingsServices;
    currentEditor: Cherry;
    constructor() {

    }
    setUserSettingsService(userSettings: UserSettingsServices) {
        this.userSettings = userSettings;
    }
    getUserSettingsService() {
        return this.userSettings;
    }
    setCurrentEditor(editor: Cherry) {
        this.currentEditor = editor;
    }
    getCurrentEditor() {
        return this.currentEditor;
    }
}
