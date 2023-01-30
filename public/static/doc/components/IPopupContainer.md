# 弹出层容器
这里用来描述组件的具体作用说明，描述内容建议简明扼要。
## 组件类名（className）
IPopupContainer
## 组件类ID（classId）
idm.component.mobileKnowManage.popupContainer
## 组件开发语言（comLangue）
vue
## 组件类型（comType）
common
## 所在代码包版本
mobileKnowManage@1.0.0
## 组件属性
### 唯一标识【ctrlId】

### 基本属性
#### 默认展开【isShow】
#### 弹出位置【showPosition】
#### 弹出层样式【boxwidth】
  1. 宽
  2. 高
#### 内层样式【ulbox】
  1. 内外边距 
  2. 标题
  3. 标题间距
  4. 目录间距
  5. 页签边距
  6. 页签边框
  7. 页签字体
  8. 选中页签边框
  9. 选中页签字体

#### 请求参数自定义函数【customFunc】
可以写函数处理请求参数，传给接口没有参数

#### 组件消息
 1. 可以接收消息 消息内容是文字会默认选中状态，消息key已写死：linkageDemand， 收到消息后 会弹出浮层 默认选中状态
 2. 点击页签后 会发送消息 消息key 可编辑， 发送消息后隐藏浮层


### 数据源 接口返回格式需要按照以下要求：

```js
    data: [
        {
            title: "专题目录1",
            list: '发文种类,收文种类,公司文化交流'
        },
        {
            title: "专题目录2",
            list: '知识文档1,知识文档2,知识文档3'
        }
    ]
```


