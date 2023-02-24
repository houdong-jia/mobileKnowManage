<template>
    <div :id="`${moduleObject.id}-common-header`" class="common-header d-flex just-b over-h">
        <div class="common-header-left flex-1 d-flex align-c">
            <div class="d-flex align-c" v-if="propData.isShowLeftIcon">
                <svg
                    v-if="propData.titleIcon && propData.titleIcon.length"
                    class="common-header-left-icon"
                    aria-hidden="true"
                >
                    <use :xlink:href="`#${propData.titleIcon[0]}`"></use>
                </svg>
                <svg-icon v-else icon-class="shu" className="common-header-left-icon"></svg-icon>
            </div>
            <div class="common-header-left-title flex-1">{{ propData.htmlTitle }}</div>
        </div>
        <div
            class="common-header-right d-flex align-c"
            @click="$emit('handleClickMore')"
            v-if="propData.titleRightContent"
        >
            <div class="common-header-right-text" v-if="isShowText">更多</div>
            <div class="common-header-right-text" v-if="isShowBadge">2</div>
            <div class="d-flex align-c" v-if="isShowIcon">
                <svg
                    v-if="propData.rightTitleIcon && propData.rightTitleIcon.length"
                    class="common-header-right-icon"
                    aria-hidden="true"
                >
                    <use :xlink:href="`#${propData.rightTitleIcon[0]}`"></use>
                </svg>
                <svg-icon v-else iconClass="arrowRight" className="common-header-right-icon"></svg-icon>
            </div>
        </div>
    </div>
</template>
<script>
import adaptationScreen from '../mixins/adaptationScreen'
export default {
    name: 'ICommonHeader',
    props: {
        moduleObject: {
            type: Object,
            required: true
        },
        propData: {
            type: Object,
            required: true
        },
        pageData: {
            type: Object,
            required: true
        }
    },
    mixins: [adaptationScreen],
    computed: {
        isShowText() {
            return ['text', 'textAndIcon'].includes(this.propData.titleRightContent)
        },
        isShowBadge() {
            return ['badge', 'badgeAndIcon'].includes(this.propData.titleRightContent)
        },
        isShowIcon() {
            return ['icon', 'textAndIcon', 'badgeAndIcon'].includes(this.propData.titleRightContent)
        }
    }
}
</script>
