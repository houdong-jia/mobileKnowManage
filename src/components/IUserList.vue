<template>
    <div idm-ctrl="idm_module" :id="moduleObject.id" :idm-ctrl-id="moduleObject.id" class="IUserList_app">
        <div v-if="propData.showTitle" class="IUserList_app_title">{{ propData.title }}</div>
        <div class="IUserList_app_main scrollbar_style">
            <van-list v-if="data_list && data_list.length" :offset="propData.offset" :immediate-check="false" v-model="loading" :finished="finished" :loading-text="propData.loadingText" :finished-text="propData.finishedText" @load="onLoad" >
                <div v-for="(item,index) in data_list" :key="index" class="list flex_between">
                    <div class="list_left flex_start">
                        <div v-if="propData.contentLayout == '1' || propData.contentLayout == '2'" class="list_left_icon">
                            <div v-if="propData.contentLayout == '1'" class="img">
                                <img :src="getImageSrc(item)" alt="">
                            </div>
                            <div v-if="propData.contentLayout == '2'" class="line"></div>
                        </div>
                        <div class="list_left_main">
                            <div class="name">{{ item[propData.dataFieldName ? propData.dataFieldName : 'name'] }}</div>
                            <div class="extra flex_start">
                                <div v-for="(item1,index1) in propData.extraList" class="extra_list" :key="index1" :style="getExtraStyle(item1)">{{ getExtraText(item1,item) }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="propData.buttonList && propData.buttonList.length" class="list_right flex_end">
                        <div @click="clickButton(btn,item)" v-for="(btn,index) in getButtonList" :style="getButtonStyle(btn)" :key="index" class="button_list">{{ btn.text }}</div>
                    </div>
                </div>
            </van-list>
            <div v-else class="empty_block flex_column_center">
                <SvgIcon icon-class="empty"></SvgIcon>
                <div class="text">????????????</div>
            </div>
            
        </div>
    </div>
</template>
  
<script>
import { getUserListData } from '../mock/mockData'
import adaptationScreenMixin from '../mixins/adaptationScreen'
import SvgIcon from '../icons/SvgIcon.vue';

export default {
    name: 'IUserList',
    mixins: [adaptationScreenMixin],
    components: {
        SvgIcon
    },
    data() {
        return {
            moduleObject: {},
            propData: this.$root.propData.compositeAttr || {
                loadDataCreated: true,
                showTitle: true,
                title: "??????",
                contentLayout: 2,
                buttonList: [
                    {
                        text: '????????????'
                    }
                ],
                extraList: [
                    {
                        width: '50%',
                        dataField: '?????????@[type]'
                    },
                    {
                        width: '50%',
                        dataField: '?????????@[author]'
                    },
                    {
                        width: '50%',
                        dataField: '???????????????@[publishTime]'
                    }
                ]
            },
            data_list: [],
            page: 1,
            loading: false,
            finished: false,
            demand_params: {},
            conditionObject: {},
        }
    },
    props: {
    },
    watch: {
        
    },
    computed: {
        getButtonList() {
            var params = this.commonParam();

            let map = this.propData.buttonList.filter((item) => {
                if ( item.showHiddenFunction && item.showHiddenFunction[0] && item.showHiddenFunction[0].name && window[this.propData.showHiddenFunction[0].name] ) {
                    try {
                        let resValue = window[this.propData.showHiddenFunction[0].name].call(this,{
                            ...params,
                            ...this.propData.showHiddenFunction[0].param,
                            moduleObject:this.moduleObject,
                            _this: this,
                            item: item
                        });
                        if ( resValue ) {
                            return item
                        }
                    } catch (error) {
                        return item
                    }
                } else {
                    return item
                }
            })
            return map
        }
    },
    created() {
        this.moduleObject = this.$root.moduleObject;
        this.convertAttrToStyleObject();
        if ( this.propData.loadDataCreated ) {
            this.initData(1)
        }
    },
    mounted() {
        this.$nextTick(function (params) {

        });
    },
    destroyed() { },
    methods: {
        onLoad() {
            console.log('????????????-size',this.page);
            this.page = this.page + 1;
            if ( this.page == 1 ) {
                this.loading = false;
                return
            }
            this.initData()
        },
        getExtraStyle(item) {
            var styleObject = {};
            if ( item.width ) {
                styleObject["width"] = item.width;
            }
            if ( item.font ) {
                IDM.style.setFontStyle(styleObject,item.font)
                this.adaptiveFontSize(styleObject, item.font)
            }
            if ( item.box ) {
                IDM.style.setBoxStyle(styleObject,item.box)
            }
            return styleObject
        },
        getExtraText(item,data) {
            if ( item && item.dataField ) {
                return IDM.express.replace(item.dataField,data)
            } else {
                return ''
            }
        },
        getButtonStyle(item) {
            var styleObject = {};
            if ( item.bgColor && item.bgColor.hex8 ) {
                styleObject["background-color"] = item.bgColor.hex8;
            }
            if ( item.font ) {
                IDM.style.setFontStyle(styleObject,item.font)
                this.adaptiveFontSize(styleObject, item.font)
            }
            if ( item.box ) {
                IDM.style.setBoxStyle(styleObject,item.box)
            }
            return styleObject
        },
        getImageSrc(item) {
            if ( item[this.propData.dataFieldImageUrl ? this.propData.dataFieldImageUrl : 'imageUrl'] ) {
                return IDM.url.getWebPath(item[this.propData.dataFieldImageUrl ? this.propData.dataFieldImageUrl : 'imageUrl'])
            } else {
                return IDM.url.getModuleAssetsWebPath(require(`../assets/user.png`),this.moduleObject)
            }
        },
        clickButton(item,row) {
            if( this.moduleObject.env=="develop" ){
                return;
            }
            let that = this;
            let urlObject = window.IDM.url.queryObject(),
            pageId = window.IDM.broadcast&&window.IDM.broadcast.pageModule?window.IDM.broadcast.pageModule.id:"";
            var clickFunction = item.clickFunction;
            clickFunction&&clickFunction.forEach(item=>{
                window[item.name]&&window[item.name].call(this,{
                    urlData:urlObject,
                    pageId,
                    row,
                    customParam:item.param,
                    _this:this
                });
            })
        },
        makeParamsData(data) {
            let result = {};
            if ( this.propData.paramsMakeFunction && this.propData.paramsMakeFunction.length && window[this.propData.paramsMakeFunction[0].name] ) {
                result = window[this.propData.paramsMakeFunction[0].name].call(this, {
                                        ...data,
                                        ...this.propData.paramsMakeFunction[0].param,
                                        moduleObject: this.moduleObject,
                                    });
                console.log('?????????????????????',result)
                return result
            }
            return data
        },
        initData(is_init) {
            if ( is_init ) {
                this.page = 1;
                this.data_list = [];
            }
            this.finished = false;
            let that = this;
            var params = this.commonParam();
            //??????????????????????????????
            if ( this.propData.linkageParamList && this.propData.linkageParamList.length > 0 ) {
                this.propData.linkageParamList.forEach((lpitem) => {
                if (Object.keys(lpitem).length > 0) {
                    if (lpitem.msgKey && this.conditionObject[lpitem.msgKey]) {
                        if (lpitem.paramFun && lpitem.paramFun.length > 0) {
                            //?????????
                            try {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    window[lpitem.paramFun[0].name] &&
                                    window[lpitem.paramFun[0].name].call(this, {
                                    ...params,
                                    ...lpitem.paramFun[0].param,
                                    moduleObject: this.moduleObject,
                                    paramValue:this.conditionObject[lpitem.msgKey]
                                    });
                            } catch (error) {
                                params[lpitem.paramKey || lpitem.msgKey] =
                                    typeof this.conditionObject[lpitem.msgKey] == "object"
                                    ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                    : this.conditionObject[lpitem.msgKey];
                            }
                        } else {
                            params[lpitem.paramKey || lpitem.msgKey] = typeof this.conditionObject[lpitem.msgKey] == "object"
                                ? JSON.stringify(this.conditionObject[lpitem.msgKey])
                                : this.conditionObject[lpitem.msgKey];
                        }
                    }
                }
                });
            }
            params = this.makeParamsData(params)
            let newParam = { 
                ...params,
                [that.propData.sizeKey]: that.propData.size,
                [that.propData.pageKey]: that.page,
            };
            console.log('newParam',newParam)
            if ( this.propData.dataSource && this.propData.dataSource.length ) {
                IDM.datasource.request(this.propData.dataSource[0].id,{
                    moduleObject:this.moduleObject,
                    param:{
                        ...newParam
                    }
                },function(res){
                    if ( that.page == 1 ) {
                        that.data_list = res;
                    } else {
                        that.data_list.push(...res);
                    }
                    that.loading = false;
                    if ( res && res.length < that.propData.size ) {
                        that.finished = true;
                    }
                },function(error){
                    //????????????????????????????????????
                    console.log('error',error)
                })
            } else {
                that.data_list = getUserListData()
                that.loading = false;
                that.finished = true;
            }
        },
        /**
         * ?????????????????????????????????prop????????????
         */
        propDataWatchHandle(propData) {
            this.propData = propData.compositeAttr || {};
            this.convertAttrToStyleObject();
            this.initData(1)
        },
        convertThemeListAttrToStyleObject() {
            const themeList = this.propData.themeList;
            if ( (!themeList) || !themeList.length ) {
                return
            }
            const themeNamePrefix = IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix ? IDM.setting.applications.themeNamePrefix : "idm-theme-";
            for (var i = 0; i < themeList.length; i++) {
                var item = themeList[i];
                
                if(item.key!=IDM.theme.getCurrentThemeInfo()){
                    //?????????????????????????????????????????????????????????????????????????????????????????????
                    continue;
                }
                let borderObject = {
                    'border-color': item.mainColor ? item.mainColor.hex8 : "",
                }
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-select-selection:hover", borderObject );
                IDM.setStyleToPageHead( "." + themeNamePrefix + item.key + " #" + (this.moduleObject.packageid || "module_demo") + " .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active", borderObject );
            }
        },
        /** * ?????????????????????????????? */
        convertAttrToStyleObjectTitle() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthTitle":
                            styleObject['width'] = element;
                            break;
                        case "heightTitle":
                            styleObject['height'] = element;
                            break;
                        case "boxTitle":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "fontTitle":
                            IDM.style.setFontStyle(styleObject,element)
                            this.adaptiveFontSize(styleObject, element)
                            break;
                        
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_title', styleObject);
        },
        convertAttrToStyleObjectMain() {
            var styleObject = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthMain":
                            styleObject['width'] = element;
                            break;
                        case "heightMain":
                            styleObject['height'] = element;
                            break;
                        case "boxMain":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderMain":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "boxShadowMain":
                            styleObject["box-shadow"] = element;
                            break;
                        case "bgColorMain":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main', styleObject);
        },
        convertAttrToStyleObjectItem() {
            var styleObject = {};
            var styleObjectName = {};
            var styleObjectImg = {};
            var styleObjectLine = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "widthItem":
                            styleObject['width'] = element;
                            break;
                        case "heightItem":
                            styleObject['height'] = element;
                            break;
                        case "bgColorItem":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "boxShadowItem":
                            styleObject["box-shadow"] = element;
                            break;
                        case "boxItem":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "borderItem":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "fontItem":
                            IDM.style.setFontStyle(styleObjectName,element)
                            this.adaptiveFontSize(styleObjectName, element)
                            break;
                        case "widthImg":
                            styleObjectImg['width'] = this.getAdaptiveSize(element.inputVal,this.propData.adaptationRatio,1) + element.selectVal;
                            break;
                        case "heightImg":
                            styleObjectImg['height'] = this.getAdaptiveSize(element.inputVal,this.propData.adaptationRatio,1) + element.selectVal;
                            break;
                        case "boxImg":
                            IDM.style.setBoxStyle(styleObjectImg,element)
                            break;
                        case "widthLine":
                            styleObjectLine['width'] = element;
                            break;
                        case "heightLine":
                            styleObjectLine['height'] = element;
                            break;
                        case "boxLine":
                            IDM.style.setBoxStyle(styleObjectLine,element)
                            break;
                        case "bgColorLine":
                            if (element && element.hex8) {
                                styleObjectLine["background-color"] = element.hex8;
                            }
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .list', styleObject);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .list .name', styleObjectName);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .list .img', styleObjectImg);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .list .line', styleObjectLine);
        },
        convertAttrToStyleObjectEmpty() {
            var styleObjectFinished = {};
            var styleObjectLoading = {};
            var styleObjectEmptyText = {};
            var styleObjectEmptyIcon = {};
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "fontFinished":
                            IDM.style.setFontStyle(styleObjectFinished,element)
                            break;
                        case "fontLoading":
                            IDM.style.setFontStyle(styleObjectLoading,element)
                            break;
                        case "fontEmptyText":
                            IDM.style.setFontStyle(styleObjectEmptyText,element)
                            break;
                        case "fontEmptyIcon":
                            IDM.style.setFontStyle(styleObjectEmptyIcon,element)
                            break;
                        case "boxEmptyIcon":
                            IDM.style.setBoxStyle(styleObjectEmptyIcon,element)
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .van-list__finished-text', styleObjectFinished);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .van-loading__spinner', styleObjectLoading);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .van-loading__text', styleObjectLoading);

            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .empty_block .svg-icon', styleObjectEmptyIcon);
            window.IDM.setStyleToPageHead(this.moduleObject.id + ' .IUserList_app_main .empty_block .text', styleObjectEmptyText);
        },
        convertAttrToStyleObject() {
            this.convertAttrToStyleObjectItem()
            this.convertAttrToStyleObjectTitle()
            this.convertAttrToStyleObjectMain()
            this.convertAttrToStyleObjectEmpty()
            var styleObject = {};
            if (this.propData.bgSize && this.propData.bgSize == "custom") {
                styleObject["background-size"] = (this.propData.bgSizeWidth ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal : "auto") + " " + (this.propData.bgSizeHeight ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal : "auto")
            } else if (this.propData.bgSize) {
                styleObject["background-size"] = this.propData.bgSize;
            }
            if (this.propData.positionX && this.propData.positionX.inputVal) {
                styleObject["background-position-x"] = this.propData.positionX.inputVal + this.propData.positionX.selectVal;
            }
            if (this.propData.positionY && this.propData.positionY.inputVal) {
                styleObject["background-position-y"] = this.propData.positionY.inputVal + this.propData.positionY.selectVal;
            }
            for (const key in this.propData) {
                if (this.propData.hasOwnProperty.call(this.propData, key)) {
                    const element = this.propData[key];
                    if (!element && element !== false && element != 0) {
                        continue;
                    }
                    switch (key) {
                        case "width":
                        case "height":
                            styleObject[key] = element;
                            break;
                        case "bgColor":
                            if (element && element.hex8) {
                                styleObject["background-color"] = element.hex8;
                            }
                            break;
                        case "box":
                            IDM.style.setBoxStyle(styleObject,element)
                            break;
                        case "bgImgUrl":
                            styleObject["background-image"] = `url(${window.IDM.url.getWebPath(element)})`;
                            break;
                        case "positionX":
                            //??????????????????

                            break;
                        case "positionY":
                            //??????????????????

                            break;
                        case "bgRepeat":
                            //????????????
                            styleObject["background-repeat"] = element;
                            break;
                        case "bgAttachment":
                            //????????????
                            styleObject["background-attachment"] = element;
                            break;
                        case "border":
                            IDM.style.setBorderStyle(styleObject,element)
                            break;
                        case "font":
                            IDM.style.setFontStyle(styleObject,element)
                            this.adaptiveFontSize(styleObject, element)
                            break;
                        case "boxShadow":
                            styleObject["box-shadow"] = element;
                            break;
                    }
                }
            }
            window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
        },
        /**
         * ?????????url????????????
         * ???????????????url????????????
         */
        commonParam() {
            let urlObject = IDM.url.queryObject();
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule
                        ? window.IDM.broadcast.pageModule.id
                        : "",
                urlData: JSON.stringify(urlObject),
            };
            return params;
        },
        
        /** * ?????????????????????????????????????????? */
        getExpressData(dataName, dataFiled, resultData) {
            //???defaultValue??????dataFiled??????
            var _defaultVal = undefined;
            if (dataFiled) {
                var filedExp = dataFiled;
                filedExp =
                    dataName +
                    (filedExp.startsWiths("[") ? "" : ".") +
                    filedExp;
                var dataObject = { IDM: window.IDM };
                dataObject[dataName] = resultData;
                _defaultVal = window.IDM.express.replace.call(
                    this,
                    "@[" + filedExp + "]",
                    dataObject
                );
            }
            //????????????????????????????????????
            if (this.propData.customFunction && this.propData.customFunction.length > 0) {
                var params = this.commonParam();
                var resValue = "";
                try {
                    resValue = window[this.propData.customFunction[0].name] && window[this.propData.customFunction[0].name].call(this, {
                        ...params,
                        ...this.propData.customFunction[0].param,
                        moduleObject: this.moduleObject,
                        expressData: _defaultVal, interfaceData: resultData
                    });
                } catch (error) {
                }
                _defaultVal = resValue;
            }

            return _defaultVal;
        },
        /**
         * ????????????????????????????????????
         * @param {
         *  type:"???????????????????????????????????????????????????????????????????????????????????????????????????type???linkageResult?????????????????????????????????linkageDemand?????????????????????????????????linkageReload??????????????????????????????
         * ???linkageOpenDialog?????????????????????linkageCloseDialog?????????????????????linkageShowModule?????????????????????linkageHideModule?????????????????????linkageResetDefaultValue?????????????????????"
         *  message:{??????????????????????????????????????????}
         *  messageKey:"???????????????key?????????????????????????????????????????????????????????????????????????????????key?????????????????????"
         *  isAcross:?????????true?????????????????????????????????????????????????????????false
         * } object 
         */
        onReInitDataMsgKey(conditionObject,messageKey){
            this.conditionObject[messageKey] = conditionObject;
            this.initData(1)
        },
        receiveBroadcastMessage(object) {
            console.log("??????????????????", object)
            if( object.type && object.type=="linkageReload" ){
                this.initData(1);
            }
            if(object.type&&object.type=="linkageDemand"){
                if(object.messageKey){
                    this.onReInitDataMsgKey(object.message,object.messageKey);
                }
            }
        },
        /**
         * ????????????????????????????????????
         * @param {
         *  type:"?????????????????????????????????type???linkageResult?????????????????????????????????linkageDemand?????????????????????????????????linkageReload??????????????????????????????
         * ???linkageOpenDialog?????????????????????linkageCloseDialog?????????????????????linkageShowModule?????????????????????linkageHideModule?????????????????????linkageResetDefaultValue?????????????????????",
         *  message:{?????????????????????},
         *  rangeModule:"???????????????????????????????????????????????????????????????????????????????????????packageid?????????????????????????????????????????? this.$root.propData.compositeAttr["attrKey"]?????????attrKey?????????????????????bindKey???,?????????????????????['1','2']"",
         *  className:"???????????????????????????????????????????????????????????????????????????????????????"
         *  globalSend:?????????true????????????????????????????????????rangeModule?????????????????????className?????????????????????false
         * } object 
         */
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object);
        },
        /**
         * ????????????????????????????????????????????????
         * @param {
         *  type:"?????????????????????????????????pageCommonInterface????????????????????????????????????"
         *  key:"??????key?????????????????????????????????????????????????????????????????????????????????????????????"
         *  data:"????????????????????????????????? or ?????? or ??????"
         * }
         */
        setContextValue(object) {
            console.log("????????????????????????", object);
        }
    }
}
</script>
<style lang="scss" scoped>
.IUserList_app{
    padding: 10px 15px;
    overflow: auto;
    .IUserList_app_title{
        margin-bottom: 10px;
        font-size: 17px;
        color: #333333;
        font-weight: 500;
    }
    .IUserList_app_main{
        .list{
            padding: 15px 0;
            white-space: normal;
            outline: none;
            // border-bottom: 1px solid rgba(225,225,225,1);
            &:last-child{
                border-bottom: none;
            }
            .list_left{
                width: 100%;
                .img{
                    width: 45px;
                    height: 45px;
                    margin-right: 15px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .line{
                    width: 5px;
                    height: 14px;
                    margin-right: 7px;
                    background: #0954C6;
                }
                .list_left_main{
                    width: 100%;
                    .name{
                        font-family: PingFangSC-Medium;
                        font-size: 15px;
                        color: #333333;
                        font-weight: 500;
                    }
                    .extra{
                        flex-wrap: wrap;
                    }
                    .extra_list{
                        margin-top: 5px;
                        flex-wrap: wrap;
                        flex-shrink: 0;
                        white-space: nowrap;
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: #666666;
                        font-weight: 400;
                    }
                }
            }
            .list_right{
                .button_list{
                    padding: 6px 22px;
                    border-radius: 4px;
                    color: white;
                    font-size: 15px;
                    white-space: nowrap;
                    background: #0954C6;
                }
            }
        }
        .empty_block{
            height: 100%;
            text-align: center;
            .svg-icon{
                margin-bottom: 10px;
                font-size: 90px;
                color: #666666ff;
            }
            .text{
                font-size: 14px;
                color: #666666ff;
            }
        }
    }
}
</style>
<style lang="scss">
.scrollbar_style::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
.scrollbar_style::-webkit-scrollbar-thumb {
    background-color: #ccc;
}
.scrollbar_style::-webkit-scrollbar-thumb {
    min-height: 18px;
    border-radius: 4px;
}
.IUserList_app{
    .van-list{
        height: 100%;
    }
}
</style>
