<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" :title="propData.htmlTitle">
        <ICommonListContainer :moduleObject="moduleObject" :ref="'listContainerRef-' + moduleObject.id"
            :propData="propData" :pageData="pageData" :isFirst="isFirst" :isLoading="isLoading"
            @handleClickMore="handleClickMore">
            <template #list>
                <div v-for="(item, index) in pageData.value" :key="index" class=" box-line d-flex just-b"
                    @click="handleItemClick(item)">
                    <img v-if="propData.isShowLeftImage"
                        :src="getImageUrl(item)" alt=""
                        class="common-list-left-image" />
                    <div v-if="!propData.styleType || propData.styleType === 'styleOne'" class="flex-1 over-h">
                        <div class="d-flex common-list-title text-o-e">
                            {{ getDataField(propData.titleField, item) }}
                        </div>
                        <div class="d-flex common-list-style-one-time-box text-o-e">
                            <div class="d-flex align-c common-list-icon-container" v-if="propData.isShowTimeIcon">
                                <svg v-if="propData.timeIcon && propData.timeIcon.length" class="common-list-time-icon"
                                    aria-hidden="true">
                                    <use :xlink:href="`#${propData.timeIcon[0]}`"></use>
                                </svg>
                                <svg-icon v-else icon-class="shijian" className="common-list-time-icon"></svg-icon>
                            </div>
                            <span class="text-o-e"> {{ getDataField(propData.timeField, item) }}</span>
                        </div>
                        <div class="d-flex align-c common-list-style-one-location-box text-o-e">
                            <div class="d-flex align-c common-list-icon-container" v-if="propData.isShowLocationIcon">
                                <svg v-if="propData.locationIcon && propData.locationIcon.length"
                                    class="common-list-location-icon" aria-hidden="true">
                                    <use :xlink:href="`#${propData.locationIcon[0]}`"></use>
                                </svg>
                                <svg-icon v-else icon-class="location" className="common-list-location-icon"></svg-icon>
                            </div>
                            <span class="text-o-e"> {{ getDataField(propData.locationField, item) }}</span>
                        </div>
                        <div class="d-flex just-b align-c common-list-style-one-person-box text-o-e"
                            v-if="propData.isShowPersonLine">
                            <div class="d-flex align-c">
                                <div class="d-flex align-c common-list-icon-container" v-if="propData.isShowPersonIcon">
                                    <svg v-if="propData.personIcon && propData.personIcon.length"
                                        class="common-list-person-icon" aria-hidden="true">
                                        <use :xlink:href="`#${propData.personIcon[0]}`"></use>
                                    </svg>
                                    <svg-icon v-else icon-class="ren" className="common-list-person-icon"></svg-icon>
                                </div>
                                <span class="text-o-e"> {{ getDataField(propData.personField, item) }}人参与</span>
                            </div>
                            <div v-if="handleShowButton(item)" @click="handleClickButton"
                                class="common-list-person-button">
                                {{ propData.buttonText }}
                            </div>
                        </div>
                    </div>
                    <div v-if="propData.styleType === 'styleTwo'" class="d-flex flex-d-c just-a flex-1 ">
                        <div class="common-list-title text-o-e-2">
                            {{ getDataField(propData.titleField, item) }}
                        </div>
                        <div class="d-flex just-b align-c common-list-process-text text-o-e">
                            <span>观看至{{ getDataField(propData.processField, item) }}</span><span>{{
        getDataField(propData.timeField, item)
}}</span>
                        </div>
                    </div>
                    <div v-if="propData.styleType === 'customFunction'" class="d-flex flex-d-c just-b flex-1 iknowledgeSubjectList">
                        <div class="common-list-title text-o-e-2">
                            {{ getDataField(propData.titleField, item) }}
                        </div>
                        <div class="d-flex  align-c common-list-process-text"
                            v-html="customFunctionContent(item)">

                        </div>
                    </div>
                </div>
            </template>
        </ICommonListContainer>
    </div>
</template>
<script>
import ICommonListContainer from '../commonComponents/ICommonListContainer'
import commonListMixin from '../mixins/commonList'
import adaptationScreenMixin from '../mixins/adaptationScreen'
import { getCommonListData } from '../mock/mockData'
export default {
    name: 'IknowledgeSubjectList',
    components: {
        ICommonListContainer
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {},
            pageData: { value: [], count: 0, moreUrl: '' }
        }
    },
    mixins: [adaptationScreenMixin, commonListMixin],
    created() {
        this.moduleObject = this.$root.moduleObject
        this.convertAttrToStyleObject()
        this.convertThemeListAttrToStyleObject()
    },
    methods: {
          getImageUrl(item) {
            if ( item[this.propData.imageField ? this.propData.imageField : 'imageUrl'] ) {
                return IDM.url.getWebPath(item[this.propData.imageField ? this.propData.imageField : 'imageUrl'])
            } else {
                return IDM.url.getModuleAssetsWebPath(require(`../assets/noImg.jpg`),this.moduleObject)
            }
        },
        // 自定义显示
        customFunctionContent(item) {
            let html = ''
            const func = this.propData?.customShowFunction?.[0]
            if (func) {
                html = window?.[func.name]?.call(this, Object.assign(item, func.param))
            }
            return html
        },
        // 按钮是否显示函数
        handleShowButton(item) {
            if (this.propData.isShowButtonFunction && this.propData.isShowButtonFunction.length > 0) {
                let resValue = ''
                try {
                    const funcName = this.propData.isShowButtonFunction[0].name
                    resValue =
                        window[funcName] &&
                        window[funcName].call(this, {
                            ...this.propData.isShowButtonFunction[0].param,
                            moduleObject: this.moduleObject,
                            ...item
                        })
                } catch (error) { }
                return resValue
            }
            return true
        },
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {}
            this.convertAttrToStyleObject()
            this.convertThemeListAttrToStyleObject()
        },
        // 样式
        convertAttrToStyleObject() {
            var boxLineStyleObj = {},
                lineTitleFontStyleObj = {},
                imageStyleObj = {},
                timeIconObj = {},
                timeLineObj = {},
                locationIconObj = {},
                locationLineObj = {},
                personIconObj = {},
                personLineObj = {},
                buttonStyleObj = {},
                processLineObj = {},
                lineTitleClampObj = {}
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key]
                    if (!element && element !== false && element != 0) {
                        continue
                    }
                    switch (key) {
                        // 单项box样式
                        case 'lineBox':
                            IDM.style.setBoxStyle(boxLineStyleObj, element)
                            break
                        case 'lineBorder':
                            IDM.style.setBorderStyle(boxLineStyleObj, element)
                            break
                        case 'lineBoxShadow':
                            boxLineStyleObj['box-shadow'] = element
                            break
                        case 'lineBgColor':
                            if (element.hex8) {
                                boxLineStyleObj['background-color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        // 标题样式
                        case 'lineTitleFontStyle':
                            IDM.style.setFontStyle(lineTitleFontStyleObj, element)
                            this.adaptiveFontSize(lineTitleFontStyleObj, element)
                            break
                        case 'lineTitleClamp':
                            lineTitleClampObj['-webkit-line-clamp'] = element
                            lineTitleClampObj['line-clamp'] = element
                            break
                        // 图片样式
                        case 'imageBox':
                            IDM.style.setBoxStyle(imageStyleObj, element)
                            break
                        case 'imageBorder':
                            IDM.style.setBorderStyle(imageStyleObj, element)
                            break
                        case 'imageWidth':
                            imageStyleObj['width'] = this.getAdaptiveSize(element, 1.5) + 'px'
                            break
                        case 'imageHeight':
                            imageStyleObj['height'] = this.getAdaptiveSize(element, 1.5) + 'px'
                            break

                        //时间行样式
                        case 'timeIconColor':
                            if (element && element.hex8) {
                                timeIconObj['fill'] = IDM.hex8ToRgbaString(element.hex8)
                                timeIconObj['color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        case 'timeIconSize':
                            timeIconObj['width'] = element + 'px'
                            timeIconObj['height'] = element + 'px'
                            timeIconObj['font-size'] = element + 'px'
                            break
                        case 'timeBox':
                            IDM.style.setBoxStyle(timeLineObj, element)
                            break
                        case 'timeFontStyle':
                            IDM.style.setFontStyle(timeLineObj, element)
                            this.adaptiveFontSize(timeLineObj, element)
                            break

                        //地点行样式
                        case 'locationIconColor':
                            if (element && element.hex8) {
                                locationIconObj['fill'] = IDM.hex8ToRgbaString(element.hex8)
                                locationIconObj['color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        case 'locationIconSize':
                            locationIconObj['width'] = element + 'px'
                            locationIconObj['height'] = element + 'px'
                            locationIconObj['font-size'] = element + 'px'
                            break
                        case 'locationBox':
                            IDM.style.setBoxStyle(locationLineObj, element)
                            break
                        case 'locationFontStyle':
                            IDM.style.setFontStyle(locationLineObj, element)
                            this.adaptiveFontSize(locationLineObj, element)
                            break

                        //人物行样式
                        case 'personIconColor':
                            if (element && element.hex8) {
                                personIconObj['fill'] = IDM.hex8ToRgbaString(element.hex8)
                                personIconObj['color'] = IDM.hex8ToRgbaString(element.hex8)
                            }
                            break
                        case 'personIconSize':
                            personIconObj['width'] = element + 'px'
                            personIconObj['height'] = element + 'px'
                            personIconObj['font-size'] = element + 'px'
                            break
                        case 'personBox':
                            IDM.style.setBoxStyle(personLineObj, element)
                            break
                        case 'personFontStyle':
                            IDM.style.setFontStyle(personLineObj, element)
                            this.adaptiveFontSize(personLineObj, element)
                            break
                        // 按钮样式
                        case 'buttonBox':
                            IDM.style.setBoxStyle(buttonStyleObj, element)
                            break
                        case 'buttonFont':
                            IDM.style.setFontStyle(buttonStyleObj, element)
                            this.adaptiveFontSize(buttonStyleObj, element)
                            break
                        case 'buttonBorder':
                            IDM.style.setBorderStyle(buttonStyleObj, element)
                            break
                        case 'buttonBgColor':
                            if (element && element.hex8) {
                                buttonStyleObj['background-color'] = IDM.hex8ToRgbaString(element.hex8) + ' !important'
                            }
                            break

                        // 样式二：进度行样式
                        case 'titleBottomFont':
                            IDM.style.setFontStyle(processLineObj, element)
                            this.adaptiveFontSize(processLineObj, element)
                            break
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .box-line', boxLineStyleObj)
            // 标题样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-title', lineTitleFontStyleObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-title.text-o-e-2', lineTitleClampObj)
            // 图片样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-left-image', imageStyleObj)
            // 时间行样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-time-icon', timeIconObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-style-one-time-box', timeLineObj)
            // 地点行样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-location-icon', locationIconObj)
            window.IDM.setStyleToPageHead(
                this.moduleObject.id + ' .common-list-style-one-location-box',
                locationLineObj
            )
            // 人物行样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-person-icon', personIconObj)
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-style-one-person-box', personLineObj)
            // 按钮样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-person-button', buttonStyleObj)
            //icon样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-icon-container', {
                'margin-right': '6px'
            })
            // 样式二：进度行样式
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .common-list-process-text', processLineObj)

            this.$nextTick(() => {
                this.$refs['listContainerRef-' + this.moduleObject.id].convertAttrToStyleObject()
            })

            this.initData()
        },
        // 主题颜色
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
                let bgColorObj = {
                    'background-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
                }
                IDM.setStyleToPageHead(
                    '.' +
                    themeNamePrefix +
                    item.key +
                    (` #${this.moduleObject.id}-common-list` || 'module_demo') +
                    ' .common-list-person-button',
                    bgColorObj
                )
            }
            // 通用样式
            this.$nextTick(() => {
                this.$refs['listContainerRef-' + this.moduleObject.id].convertThemeListAttrToStyleObject()
            })
        },
        reload() {
            //请求数据源
            this.initData()
        },

        /**
         * 自定义按钮点击函数
         * @param {} item 当前列表项数据
         */
        handleClickButton(item) {
            if (this.propData.customButtonFunction && this.propData.customButtonFunction.length > 0) {
                this.propData.customButtonFunction.forEach((func) => {
                    window[func.name] &&
                        window[func.name].call(this, {
                            ...func.param,
                            moduleObject: this.moduleObject,
                            ...item
                        })
                })
            }
        },

        initData() {
            if (this.moduleObject.env === 'develop') {
                const data = getCommonListData.call(this)
                if (this.propData.styleType === 'styleOne') {
                    data.value = data.value1
                } else {
                    data.value = data.value2
                }
                this.pageData = data
                return
            }
            this.isFirst = false
            this.getDataSourceData()
        },
        setContextValue(object) {
            console.log('统一接口设置的值', object)
            if (object.type != 'pageCommonInterface') {
                return
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.iknowledgeSubjectList{
    justify-content:center;
}
.box-line:last-child {
    border-bottom: 0 !important;
}
</style>
