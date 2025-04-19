import { ref, onMounted, computed, nextTick } from "vue";
import {
    bitable,
    Selection,
    ITable,
    IFieldMeta,
    FieldType,
    IField,
} from "@lark-base-open/js-sdk";
import { baseTableServices } from "./BaseTableServices";
import { List } from "lodash";
import _ from "lodash";
import { el } from "element-plus/es/locale";
export class BaseTableBridgeService {
    selectValue = ref({
        baseId: "",
        tableId: "",
        viewId: "",
        fieldId: "",
        recordId: "",
    });
    currentCellValue = ref("");
    /**
     * 
     * @returns 当前选中单元格的值
     */
    getCurrentCellValue() {
        return this.currentCellValue;
    }
    /**
     * 
     * @returns 当前选中单元格的值
     */
    getSelectValue() {
        return this.selectValue;
    }

    selectChange(select: any) {
        var self = this;
        if (!select || !select.fieldId || !select.recordId || !select.tableId) return;
        this.selectValue.value = select;
        bitable.base.getTableById(select.tableId).then((table: ITable) => {
            table.getFieldMetaById(select.fieldId).then((m: IFieldMeta) => {
                // console.log(m);
                if (m.type == FieldType.Text) {
                    // console.log("选中的的是文本字段", m);
                    table.getFieldById(select.fieldId).then((field: IField) => {
                        field.getCellString(select.recordId).then((v: string) => {
                            self.onSelectNewCell(v, select);
                        });
                    });
                } else {
                    baseTableServices.getRowColIndex(select).then((res: any) => {
                        console.log("选中的的是非文本字段", res);
                        self.onSelectNewCell(`当前单元格【第${res[0] + 1}行,第${res[1] + 1}列】为非文本单元格，请选择文本列进行编辑`, select);
                    })
                }
            });
        });
    };
    selectChangeListenter: Function[] = [];
    onSelectChange(cb: Function) {
        this.selectChangeListenter.push(cb);
    }
    /**
   * 选中单元格文本值变化时的回调函数
   * @param v 单元格文本值
   * @param select 
   * @returns 
   */
    onSelectNewCell(v: string, select: Selection) {
        _.each(this.selectChangeListenter, (cb) => {
            cb(v, select);
        });
    }
    async initListener() {
        var self = this;
        try {
            bitable.base.onSelectionChange((e) => {
                // console.log("选中单元格变化", e.data);
                self.selectChange(e.data);
            });
        } catch (error) {
            console.error("初始化监听时出错:", error);
        }
    }

    /**
     * 切到下一行
     */
    selectNextLineRecord() {
        baseTableServices.getNextRecord(this.selectValue.value).then((res) => {
            if (res) {
                this.selectChange(res);
            }
        });
    }
    /**
     * 切到上一行
     */
    selectLastLineRecord() {
        baseTableServices.getLastRecord(this.selectValue.value).then((res) => {
            if (res) {
                this.selectChange(res);
            }
        });
    }

    selectRightColumn() {
        baseTableServices.getRightColumns(this.selectValue.value).then((res: any) => {
            if (res) {
                this.selectChange(res);
            }
        });
    }
    selectLeftColumn() {
        baseTableServices.getLeftColumns(this.selectValue.value).then((res: any) => {
            if (res) {
                this.selectChange(res);
            }
        });
    }

    async saveToCurrentSelect(v: any) {
        console.log("保存到当前选中单元格", v);
        if (!this.selectValue.value.fieldId || !this.selectValue.value.recordId || !this.selectValue.value.tableId) {
            // console.error("没有选中单元格", this.selectValue.value);
            return Promise.reject("没有选中单元格");
        }
        // let index = await baseTableServices.getRowColIndex(this.selectValue.value);
        // if (index[0] == -1 || index[1] == -1) {
        //     console.error("没有选中单元格", this.selectValue.value);
        //     return Promise.reject("没有选中单元格");
        // }
        const table = await bitable.base.getTableById(this.selectValue.value.tableId);
        return new Promise((resolve, reject) => {
            table.setCellValue(
                this.selectValue.value.fieldId,
                this.selectValue.value.recordId,
                v
            ).then((res) => {
                resolve(true);
            }).catch((err) => {
                console.error("保存到当前选中单元格出错", err);
                reject(err);
            });
        });
        //    let r =  await table.setCellValue(
        //         this.selectValue.value.fieldId,
        //         this.selectValue.value.recordId,
        //         v
        //     );
        //     console.log("保存到当前选中单元格返回值", r);
        //     return Promise.resolve(true);
    }
}