# dialog.js

弹窗插件

效果详见 [Demo](http://travisup.com/demo/plugins/dialog/demo)

### Usage

##### Dialog(options)

eg:
    
    var myDialog = Dialog({content: '我是弹窗'});

初始化的时候默认显示弹框，可以通过传入配置`autoShow`为`false`先不自行操作显示

### Options

插件提供可配置的选项：
    
* `content`: 弹框内容，支持html
* `id`: 自定义弹框id，没有将默认生成
* `wrapperClass`: 弹框附加`className`，方便自定义某些样式
* `title`: 弹框标题，默认`提示`
* `hideClose`: 是否隐藏关闭按钮，默认`false`
* `onClose`: 点击关闭的事件函数，如果没有配置，默认应用取消按钮的事件函数
* `onOk`: 点击确定按钮的事件函数，有函数时显示确定按钮，根据函数中返回值，如果不为`true`则关闭并删除该弹框
* `okValue`: 确定按钮的提示文案，默认`确定`，设置了确定按钮函数才生效
* `onCancel`: 点击取消按钮的事件函数，有函数时显示取消按钮，根据函数中返回值，如果不为`true`则关闭并删除该弹框
* `quickClose`: 点击蒙层关闭弹框，默认为`false`
* `onBoxClick`: 整个对话框的点击事件，可以设置事件函数，也可以设置字符串`ok`,`cancel`,`close`执行之前设定的事件，默认不执行事件
* `autoShow`: 初始化时自动显示，默认为`true`

如果传入的`options`为字符串或者数值，则默认为`content`

### Method

##### Dialog.multi

[全局]是否支持多个弹窗叠加（默认为`false`）

##### Dialog.list

[全局]保存了所有未被`remove`的弹窗引用

##### Dialog.clear()

[全局]清除所有弹框(`remove`)

##### myDialog.show()

显示弹框，在初始化的时候被调用，也可以跟`hide`配合多次使用

##### myDialog.hide()

隐藏弹框，该弹框还保留，只是不显示，可用`show`再次显示出来

##### myDialog.adapt()

适应居中，默认在屏幕变化的时候自动调用

##### myDialog.remove()

删除弹框

### Author

[Travis](http://travisup.com/)