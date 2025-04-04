<template>
    <i ref="icon" :class="`iconfont ${props.type}`" :style="{
        width: `${props.size || props.width}px`,
        height: `${props.size || props.height}px`
    }">
    </i>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { IconFontType } from './IconFontType';
const props = defineProps({
    type: {
        type: String,
        default: ""
    },
    width: {
        type: Number,
        default: 18
    },
    height: {
        type: Number,
        default: 18
    },
    size: {
        type: Number,
        default: 0
    }
})

</script>
<style scoped lang="less">
// @import "./icon.less";</style>