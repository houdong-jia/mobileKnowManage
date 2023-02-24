export function getEntryData() {
    const _this = this
    return [
        {
            title: '关联知识xxx',
        },
        {
            title: '关联知识xxx',
        },
        {
            title: '关联知识xxx',
        },
        {
            title: '关联知识xxx',
        },
        {
            title: '关联知识xxx',
        },
        {
            title: '关联知识xxx',
        }
    ]
}
export function getUserListData() {
    const _this = this
    return [
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        },
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        },
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        },
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        },
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        },
        {
            name: '关联知识xxx',
            type: 'xxx',
            author: 'XXX',
            publishTime: '2022-01-01 19:30'
        }
    ]
}
export function getUserInfoData() {
    const _this = this
    return {
        name: '张三',
        title: '国画大师',
        integral: '500',
        department: '宣传部',
        careNum: 100,
        careLabelNum: 50,
        careKnowledgeNum: 8
    }
}
export function getTagInfoData() {
    return [
        {
            title: "专题目录1",
            list: '发文种类,收文种类,公司文化交流'
        },
        {
            title: "专题目录2",
            list: '知识文档1,知识文档2,知识文档3'
        }
    ]
}
export function getCommonListData() {
    const _this = this
    return {
        // 样式一 mock
        value1: [
            {
                jumpUrl: '',
                title: '第三次党员大会',
                location: '梦创双杨会议室',
                personNumber: 14,
                time: '2022-07-22 10:30-11:30',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner1.jpg'), _this.moduleObject)
            },
            {
                jumpUrl: '',
                title: '第三次党员大会',
                location: '梦创双杨会议室',
                personNumber: 14,
                time: '2022-07-22 10:30-11:30',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner2.jpg'), _this.moduleObject)
            },
            {
                jumpUrl: '',
                title: '第三次党员大会',
                location: '梦创双杨会议室',
                personNumber: 14,
                time: '2022-07-22 10:30-11:30',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner3.jpg'), _this.moduleObject)
            }
        ],
        // 样式二 mock
        value2: [
            {
                jumpUrl: '',
                title: '学习贯彻习主席“七一”重要讲话精神',
                process: '60%',
                time: '今天12:00',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner1.jpg'), _this.moduleObject)
            },
            {
                jumpUrl: '',
                title: '2021年中组部《党课开讲啦》第二讲 百年大党不忘初心，砥砺前行',
                process: '25%',
                time: '今天11:20',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner2.jpg'), _this.moduleObject)
            },
            {
                jumpUrl: '',
                title: '《党课开讲啦》节目第1期：当的光辉历程',
                process: '30%',
                time: '今天09:17',
                image: IDM.url.getModuleAssetsWebPath(require('../assets/banner3.jpg'), _this.moduleObject)
            }
        ],
        count: 3,
        moreUrl: ''
    }
}