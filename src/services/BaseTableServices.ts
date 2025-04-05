import {
    bitable,
    Selection,
    IWidgetTable,
    IFieldMeta,
    FieldType,
    IWidgetField,
} from "@base-open/web-api";
import _ from "lodash";
export class BaseTableServices {


    async getNextRecord() {
        // 获取当前视图的记录 ID 列表
        const selection = await bitable.base.getSelection();
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        const records = await view.getVisibleRecordIdList();
        let index = 0;
        for (let i = 0; i <= records.length; i++) {
            if (_.includes(records[i], selection.recordId)) {
                if (i < records.length - 1) {
                    index = i + 1;
                }
                break;
            }
        }
        if (index < records.length - 1) {
            return _.extend({}, selection, { recordId: records[index] });
        }
        return null;
    }

    async getLastRecord() {
        // 获取当前视图的记录 ID 列表
        const selection = await bitable.base.getSelection();
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        const records = await view.getVisibleRecordIdList();
        let index = records.length - 1;
        for (let i = 0; i <= records.length; i++) {
            if (_.includes(records[i], selection.recordId)) {
                if (i > 0) {
                    index = i - 1;
                }
                break;
            }
        }
        if (index < records.length - 1 && index >= 0) {
            return _.extend({}, selection, { recordId: records[index] });
        }
        return null;
    }

    selectNextRecord() {
        this.getNextRecord().then((res) => {
            if (res) {
                // bitable.base.getTableById(res.tableId).then((table) => {
                //     table.set
                // });
            }
        }); 
    }
}