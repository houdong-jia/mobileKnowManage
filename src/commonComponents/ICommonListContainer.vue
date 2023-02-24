<template>
    <div
        :id="`${moduleObject.id}-common-list`"
        class="position-r before-table"
        :class="propData.isPaging ? '' : 'over-h'"
    >
        <!-- header -->
        <i-common-header
            v-if="propData.isShowTitle"
            @handleClickMore="$emit('handleClickMore')"
            :moduleObject="moduleObject"
            :propData="propData"
            :pageData="pageData"
        ></i-common-header>
        <!-- sub content container -->
        <div class="common-list-container over-h">
            <!-- list slot -->
            <slot name="list"></slot>
            <!-- empty placeholder -->
            <ICommonEmpty
                v-if="!isFirst && !isLoading && pageData.value.length === 0 && !propData.isPaging"
                :moduleObject="moduleObject"
                :propData="propData"
            ></ICommonEmpty>
            <!-- page loading -->
            <div class="d-flex just-c" v-if="isLoading">
                <van-loading size="24px" vertical>加载中...</van-loading>
            </div>
        </div>
    </div>
</template>
<script>
import ICommonHeader from '../commonComponents/ICommonHeader'
import adaptationScreen from '../mixins/adaptationScreen'
import ICommonEmpty from '../commonComponents/ICommonEmpty'
export default {
    name: 'ICommonListContainer',
    components: {
        ICommonHeader,
        ICommonEmpty
    },
    mixins: [adaptationScreen],
    props: {
        isFirst: {
            type: Boolean,
            default: true
        },
        isLoading: {
            type: Boolean,
            default: false
        },
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
    methods: {
        /**
         * 主题颜色
         */
        convertThemeListAttrToStyleObject() {
            var themeList = this.propData.themeList
            if (!themeList) {
                return
            }
            const themeNamePrefix =
                IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
                    ? IDM.setting.applications.themeNamePrefix
                    : 'idm-theme-'
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i]
                let iconColorObj = {
                    color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
                    fill: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                IDM.setStyleToPageHead(
                    IDM.style.generateClassName(
                        '.' + themeNamePrefix + item.key + (` #${this.moduleObject.id}-common-list` || 'module_demo'),
                        [' .common-header-left-icon', ' .common-header-right-icon', ' .common-header-right-text']
                    ),
                    iconColorObj
                )
            }
        },
        convertAttrToStyleObject() {
            const styleObject = {},
                titleFontStyleObj = {},
                titleIconObj = {},
                rightIconObj = {},
                subContainerObj = {},
                rightTitleFontStyleObj = {},
                titleStyleObj = {}
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key]
                    if (!element && element !== false && element != 0) {
                        continue
                    }
                    switch (key) {
                        // 外层容器样式
                        case 'width':
                        case 'height':
                            styleObject[key] = element
                            break
                        case 'boxShadow':
                            styleObject['box-shadow'] = element
                            break
                        case 'bgColor':
                            if (element && element.hex8) {
                                styleObject['background-color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        case 'box':
                            IDM.style.setBoxStyle(styleObject, element)
                            break
                        case 'border':
                            IDM.style.setBorderStyle(styleObject, element)
                            break

                        // 标题样式
                        case 'titleFontStyle':
                            IDM.style.setFontStyle(titleFontStyleObj, element)
                            this.adaptiveFontSize(titleFontStyleObj, element)
                            break
                        case 'titleIconFontColor':
                            if (element && element.hex8) {
                                titleIconObj['fill'] = IDM.hex8ToRgbaString(element.hex8) + ' !important'
                            }
                            break
                        case 'titleIconFontSize':
                            titleIconObj['width'] = this.getAdaptiveSize(element) + 'px'
                            titleIconObj['height'] = this.getAdaptiveSize(element) + 'px'
                            titleIconObj['font-size'] = this.getAdaptiveSize(element) + 'px'
                            break
                        case 'leftIconBox':
                            IDM.style.setBoxStyle(titleIconObj, element)
                            break
                        case 'rightTitleIconFontColor':
                            if (element && element.hex8) {
                                rightIconObj['fill'] = IDM.hex8ToRgbaString(element.hex8) + ' !important'
                            }
                            break
                        case 'rightTitleIconFontSize':
                            rightIconObj['width'] = this.getAdaptiveSize(element) + 'px'
                            rightIconObj['height'] = this.getAdaptiveSize(element) + 'px'
                            rightIconObj['font-size'] = this.getAdaptiveSize(element) + 'px'
                            break
                        case 'rightIconBox':
                            IDM.style.setBoxStyle(rightIconObj, element)
                            break
                        case 'rightTitleFontStyle':
                            IDM.style.setFontStyle(rightTitleFontStyleObj, element, true)
                            this.adaptiveFontSize(rightTitleFontStyleObj, element)
                            break
                        case 'titleBox':
                            IDM.style.setBoxStyle(titleStyleObj, element)
                            break

                        // 内层容器样式
                        case 'subBoxShadow':
                            subContainerObj['box-shadow'] = element
                            break
                        case 'subBgColor':
                            if (element && element.hex8) {
                                subContainerObj['background-color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        case 'subBox':
                            IDM.style.setBoxStyle(subContainerObj, element)
                            break
                        case 'subBorder':
                            IDM.style.setBorderStyle(subContainerObj, element)
                            break
                    }
                }
            }
            // 容器样式
            window.IDM.setStyleToPageHead(`${this.moduleObject.id}-common-list`, styleObject)
            // 标题样式，
            window.IDM.setStyleToPageHead(`${this.moduleObject.id}-common-header`, titleStyleObj)
            window.IDM.setStyleToPageHead(
                `${this.moduleObject.id}-common-header .common-header-left-title`,
                titleFontStyleObj
            )
            window.IDM.setStyleToPageHead(
                `${this.moduleObject.id}-common-header .common-header-left-icon`,
                titleIconObj
            )
            window.IDM.setStyleToPageHead(
                `${this.moduleObject.id}-common-header .common-header-right-icon`,
                rightIconObj
            )
            window.IDM.setStyleToPageHead(
                `${this.moduleObject.id}-common-header .common-header-right-text`,
                rightTitleFontStyleObj
            )

            // 内层容器样式
            window.IDM.setStyleToPageHead(`${this.moduleObject.id}-common-list .common-list-container`, subContainerObj)
        }
    }
}
</script>
