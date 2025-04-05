import {
    bitable,
    Selection,
    IFieldMeta,
    FieldType,
} from "@lark-base-open/js-sdk"
// 需要先安装 lodash 及其类型声明文件
// npm install --save lodash
// npm install --save-dev @types/lodash
// 导入具体需要使用的 lodash 函数，避免导入整个库
import { includes, extend } from "lodash"
export class BaseTableServices {


    async getNextRecord(selection: Selection) {
        // 获取当前视图的记录 ID 列表
        // const selection = await bitable.base.getSelection();
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        const records = await view.getVisibleRecordIdList();
        let index = 0;
        for (let i = 0; i <= records.length; i++) {
            if (includes(records[i], selection.recordId)) {
                if (i < records.length - 1) {
                    index = i + 1;
                }
                break;
            }
        }
        if (index < records.length) {
            return extend({}, selection, { recordId: records[index] });
        }
        return null;
    }

    async getLastRecord(selection: Selection) {
        // 获取当前视图的记录 ID 列表
        // const selection = await bitable.base.getSelection();
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        const records = await view.getVisibleRecordIdList();
        let index = records.length - 1;
        for (let i = 0; i <= records.length; i++) {
            if (includes(records[i], selection.recordId)) {
                if (i > 0) {
                    index = i - 1;
                }
                break;
            }
        }
        if (index < records.length && index >= 0) {
            return extend({}, selection, { recordId: records[index] });
        }
        return null;
    }


}

export const baseTableServices = new BaseTableServices()