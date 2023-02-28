// import { getDatasInterfaceUrl } from '@/api/config'
export default {
    data() {
        return {
            finished: false,
            currentPage: 1,
            isLoading: false, // page is loading
            isFirst: true, // page is first load
            chooseTabParams: {}
        }
    },
    methods: {
        textFilter(text, dataObj) {
            if (!text) return ''
            text = text.replace(/\r/gi, '').replace(/\n/gi, '<br/>')
            text = text.replace(/@\[.*\]/gi, (str) => {
                if (str.length < 4) return str
                return IDM.express.replace(str, dataObj, true)
            })
            return text
        },
        /**
         * 获取自定义字段值
         * @param {*} field 自定义字段
         * @param {*} dataObject 数据对象
         * @returns 对应字段的值
         */
        getDataField(field, dataObject) {
            if (!dataObject || !field) return ''
            return IDM.express.replace(`@[${field}]`, dataObject, true)
        },
        /**
         * 点击，列表单项事件
         * @param {*} item 列表单项数据
         * @returns
         */
        handleItemClick(item) {
            if (this.moduleObject.env === 'develop') {
                return
            }
            let url = null
            const pageId = this.getDataField(this.propData.subPageField, item)
            switch (this.propData.itemJumpStyle) {
                case '_link':
                    url = this.getDataField(this.propData.jumpUrlField, item)
                    if (url) {
                        window.location.href = IDM.url.getWebPath(url)
                    }
                    if (item.pageId) {
                        IDM.router.push(this.moduleObject.pageid, item.pageId, this.propData.isItemKeep, item, '', '')
                    }
                    break
                case '_child':
                    if (this.propData.itemPageList && this.propData.itemPageList.length > 0) {
                        IDM.router.push(
                            this.moduleObject.pageid,
                            this.propData.itemPageList[0].id,
                            this.propData.isItemKeep,
                            item,
                            '',
                            ''
                        )
                    } else {
                        IDM.message.warning('请选择要跳转的子页面')
                    }
                    break
                case '_interface_child':
                    if (pageId) {
                        IDM.router.push(this.moduleObject.pageid, pageId, this.propData.isItemKeep, item, '', '')
                    } else {
                        IDM.message.warning('接口没有返回子页面id')
                    }
                    break
                case '_custom_link':
                    url = this.textFilter(this.propData.customItemLink, item)
                    if (!url) return
                    window.location.href = IDM.url.getWebPath(url)
                    break
                case '_custom_func':
                    if (this.propData.jumpItemCustomFunc && this.propData.jumpItemCustomFunc.length > 0) {
                        const funcName = this.propData.jumpItemCustomFunc[0].name
                        window[funcName] && window[funcName].call(this)
                    }
            }
        },
        /**
         * 点击更多事件
         */
        handleClickMore() {
            if (this.moduleObject.env === 'develop') {
                return
            }
            let url = null
            switch (this.propData.jumpStyle) {
                case '_link':
                    url = this.getDataField(this.propData.moreUrlField, this.pageData)
                    if (!url) return
                    url = IDM.url.getWebPath(url)
                    window.location.href = IDM.url.getWebPath(url)
                    break
                case '_child':
                    if (this.propData.morePageList && this.propData.morePageList.length > 0) {
                        IDM.router.push(
                            this.moduleObject.pageid,
                            this.propData.morePageList[0].id,
                            this.propData.isItemKeep,
                            this,
                            '',
                            ''
                        )
                    } else {
                        IDM.message.warning('请选择要跳转的子页面')
                    }
                    break
                case '_custom_link':
                    url = this.textFilter(this.propData.customMoreLink, this.pageData)
                    if (!url) return
                    window.location.href = IDM.url.getWebPath(url)
                    break
                case '_custom_func':
                    if (this.propData.jumpMoreCustomFunc && this.propData.jumpMoreCustomFunc.length > 0) {
                        const funcName = this.propData.jumpCustomFunc[0].name
                        window[funcName] && window[funcName].call(this)
                    }
            }
        },
        /**
         * 通用的url参数对象
         * 所有地址的url参数转换
         */
        commonParam() {
            let urlObject = IDM.url.queryObject()
            var params = {
                pageId:
                    window.IDM.broadcast && window.IDM.broadcast.pageModule ? window.IDM.broadcast.pageModule.id : '',
                urlData: JSON.stringify(urlObject),
                ...urlObject
            }
            return params
        },
        //加载更多
        onLoadMore() {
            this.currentPage++
            this.initData()
        },
        // 栏目
        getCustomSourceData(cb) {
            this.isLoading = true
            this.propData.customInterfaceUrl &&
                window.IDM.http
                    .get(this.propData.customInterfaceUrl, {
                        columnId:
                            this.propData.selectColumn && this.propData.selectColumn.id
                                ? this.propData.selectColumn.id
                                : this.commonParam().columnId,
                        start: this.currentPage,
                        limit: this.propData.limit
                    })
                    .then((res) => {
                        if (res.status == 200 && res.data.code == 200) {
                            this.pageData[this.propData.moreUrlField] = res.data.data[this.propData.moreUrlField]

                            if (this.propData.isPaging) {
                                this.pageData.value = [...this.pageData.value, ...res.data.data.rows]
                                if (res.data.data.value.length === 0) {
                                    this.finished = true
                                }
                            } else {
                                this.pageData.value = res.data.data.rows
                                this.finished = true
                            }
                            // 处理接口数据
                            if (cb) {
                                cb(this.pageData)
                            }
                        } else {
                            this.finished = true
                            IDM.message.error(res.data.message)
                        }
                    })
                    .catch((e) => {
                        this.finished = true
                    })
                    .finally(() => {
                        this.isFirst = false
                        this.isLoading = false
                    })
        },
        /**
         * 函数获取数据
         */
         functionGetData() {
            if(this.propData?.customFunction?.length > 0) {
                const func = this.propData.paramsFunc[0]
                this.pageData = window?.[func.name]?.call(this, {
                    routerParams: IDM.router.getParam(this.moduleObject.routerId),
                    ...this.chooseTabParams,
                    limit: this.propData.limit,
                    start: this.currentPage,
                    ...func.param,
                }) || {}
            }
        },
        /**
        /**
         * 获取数据源数据
         */
        getDataSourceData() {
            this.isLoading = true
            let params = {}
            if(this.propData.paramsFunc && this.propData.paramsFunc.length > 0) {
                const funcName = this.propData.paramsFunc[0].name
                params = window[funcName].call(this, {
                    routerParams: IDM.router.getParam(this.moduleObject.routerId)
                }) || {}
            }
            IDM.datasource.request(this.propData?.dataSource?.[0]?.id, {
                moduleObject: this.moduleObject,
                param: {
                    ...params,
                    ...this.chooseTabParams,
                    limit: this.propData.limit,
                    start: this.currentPage
                }
            }, (res) => {
                if (res.code == 200) {
                    this.pageData.count = res.data.count
                    this.pageData[this.propData.moreUrlField] = res.data[this.propData.moreUrlField]

                    if (this.propData.isPaging) {
                        this.pageData.value = [...this.pageData.value, ...res.data.value]
                        if (res.data.value.length === 0) {
                            this.finished = true
                        }
                    } else {
                        this.pageData.value = res.data.value
                        this.finished = true
                    }
                } else {
                    this.finished = true
                    IDM.message.error(res.message)
                }
            }, (err) => {
                this.finished = true
            }, () => {
                this.isFirst = false
                this.isLoading = false
            })
            // window.IDM.http
            //     .post(
            //         getDatasInterfaceUrl,
            //         {
            //             ...params,
            //             ...this.chooseTabParams,
            //             id: this.propData.dataSource && this.propData.dataSource.value,
            //             limit: this.propData.limit,
            //             start: this.currentPage
            //         },
            //         {
            //             headers: {
            //                 'Content-Type': 'application/json;charset=UTF-8'
            //             }
            //         }
            //     )
            //     .then((res) => {
            //         //res.data
            //         if (res.status == 200 && res.data.code == 200) {
            //             this.pageData.count = res.data.data.count
            //             this.pageData[this.propData.moreUrlField] = res.data.data[this.propData.moreUrlField]

            //             if (this.propData.isPaging) {
            //                 this.pageData.value = [...this.pageData.value, ...res.data.data.value]
            //                 if (res.data.data.value.length === 0) {
            //                     this.finished = true
            //                 }
            //             } else {
            //                 this.pageData.value = res.data.data.value
            //                 this.finished = true
            //             }
            //         } else {
            //             this.finished = true
            //             IDM.message.error(res.data.message)
            //         }
            //     })
            //     .catch((e) => {
            //         this.finished = true
            //     })
            //     .finally(() => {
            //         this.isFirst = false
            //         this.isLoading = false
            //     })
        },
        /**
         * 通用的获取表达式匹配后的结果
         */
        getExpressData(dataName, dataFiled, resultData) {
            //给defaultValue设置dataFiled的值
            var _defaultVal = undefined
            if (dataFiled) {
                var filedExp = dataFiled
                filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp
                var dataObject = { IDM: window.IDM }
                dataObject[dataName] = resultData
                _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject)
            }

            return _defaultVal
        },
        // 发送消息
        sendBroadcastMessage(object) {
            window.IDM.broadcast && window.IDM.broadcast.send(object)
        },
        // 列表组件统一接受消息
        receiveBroadcastMessage(messageObject) {
            switch (messageObject.type) {
                case 'websocket':
                    if (this.propData.messageRefreshKey && messageObject.message) {
                        const messageData =
                            (typeof messageObject.message === 'string' && JSON.parse(messageObject.message)) ||
                            messageObject.message
                        const arr = Array.isArray(this.propData.messageRefreshKey)
                            ? this.propData.messageRefreshKey
                            : [this.propData.messageRefreshKey]
                        if (messageData.badgeType && arr.includes(messageData.badgeType)) {
                            this.initData()
                        }
                    }
                    break
                case 'linkageReload':
                    this.initData()
                    break
                case 'pageResize':
                    this.pageWidth = messageObject.message.width
                    this.convertAttrToStyleObject()
                    break
                case 'chooseTab':
                    this.chooseTabParams = messageObject.message || {}
                    this.pageData = {
                        value: [],
                        count: 0,
                        moreUrl: ''
                    }
                    this.initData()
                    break
                case 'linkageResult':
                    // 接受到数组
                    if(Array.isArray(messageObject.message)){
                        this.pageData.value = messageObject.message
                    }
                    // 接受到含更多连接，角标，数组
                    if(Array.isArray(messageObject?.message?.value)){
                        this.pageData = messageObject.message
                    }
                    break
            }
            console.log('组件收到消息', messageObject)
        }
    }
}
