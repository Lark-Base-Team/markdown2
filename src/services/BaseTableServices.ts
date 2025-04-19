import {
    bitable,
    Selection,
    IFieldMeta,
    FieldType,
} from "@lark-base-open/js-sdk"
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

    async getRightColumns(selection: Selection) {
        // 获取当前视图的记录 ID 列表
        // const selection = await bitable.base.getSelection();
        if (!selection || !selection.fieldId || !selection.recordId || !selection.tableId || !selection.viewId) return null;
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        let fieldIds = await view.getVisibleFieldIdList()
        for (let i = 0; i < fieldIds.length; i++) {
            if (fieldIds[i] == selection.fieldId) {
                if (i < fieldIds.length - 1) {
                    return extend({}, selection, { fieldId: fieldIds[i + 1] });
                }
                if (i == fieldIds.length - 1) {
                    return extend({}, selection, { fieldId: fieldIds[0] });
                }
            }
        }
        return null;
    }
    async getLeftColumns(selection: Selection) {
        if (!selection || !selection.fieldId || !selection.recordId || !selection.tableId || !selection.viewId) return null;
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return null;
        const view = await table.getViewById(selection.viewId);
        let fieldIds = await view.getVisibleFieldIdList()
        for (let i = 0; i < fieldIds.length; i++) {
            if (fieldIds[i] == selection.fieldId) {
                if (i > 0) {
                    return extend({}, selection, { fieldId: fieldIds[i - 1] });
                }
                if (i == 0) {
                    return extend({}, selection, { fieldId: fieldIds[fieldIds.length - 1] });
                }
            }
        }
        return null;
    }

    /**
     * 获取当前选中单元格的行和列的索引
     * 下标从0开始
     * @param selection 
     * @returns 
     */
    async getRowColIndex(selection: Selection) {
        let noExist = [-1, -1]
        if (!selection || !selection.fieldId || !selection.recordId || !selection.tableId || !selection.viewId) return noExist;
        const table = await bitable.base.getTableById(selection.tableId);
        if (!table) return noExist;
        const view = await table.getViewById(selection.viewId);
        let fieldIds = await view.getVisibleFieldIdList();
        let colIndex = -1;
        let rowIndex = -1;
        for (let i = 0; i < fieldIds.length; i++) {
            if (fieldIds[i] == selection.fieldId) {
                colIndex = i;
                break;
            }
        }
        let records = await view.getVisibleRecordIdList()
        for (let i = 0; i < records.length; i++) {
            if (records[i] == selection.recordId) {
                rowIndex = i;
                break;
            }
        }
        return [rowIndex, colIndex];
    }

}

export const baseTableServices = new BaseTableServices()