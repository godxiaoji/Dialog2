/**
 * Dialog
 * @Author  Travis(LinYongji)
 * @Contact http://travisup.com/
 * @Version 2.0.0
 */
(function() {
    var dom = document.documentElement,
        body = document.body;

    // 检查是否存在class
    function hasClass(elem, className) {
        return elem.nodeType === 1 && (" " + elem.className + " ").indexOf(" " + className + " ") >= 0;
    }

    // 获取窗口高
    function getScrollHeight() {
        return Math.max(dom.scrollHeight, body.scrollHeight);
    }

    function getScrollTop() {
        return dom.scrollTop || body.scrollTop;
    }

    function getClientHeight() {
        return Math.min(dom.clientHeight, body.clientHeight);
    }

    function Dialog(config) {
        if (!Dialog.multi) {
            Dialog.clear();
        }
        var d = new Init(config);
        return Dialog.list[d.id] = d;
    }

    Dialog.guid = 0;
    Dialog.multi = false;
    Dialog.list = {};
    Dialog.clear = function() {
        for (var i in Dialog.list) {
            if (Dialog.list.hasOwnProperty(i)) {
                Dialog.list[i].remove();
            }
        }
    };
    Dialog.getDialog = function(config) {
        var d = document.createElement("div");

        d.id = config.id ? config.id : "J_Dialog" + (++Dialog.guid);
        d.className = 'dialog-wrapper ' + (config.wrapperClass || '');
        d.style.display = "none";
        d.innerHTML = [
            '<div class="dialog-box" style="opacity: 0">',
            '<div class="dialog-box-inner">',
            '<div class="dialog-hd"><a class="dialog-x ' + (config.hideClose ? 'dialog-hidden' : '') + '" href="javascript:void(0);">' + (config.closeValue || '×') + '</a><span>' + (config.title != null ? config.title : '提示') + '</span></div>',
            '<div class="dialog-bd">' + (config.content != null ? config.content : '内容') + '</div>',
            '<div class="dialog-ft">',
            '<a class="dialog-btn dialog-cancel ' + (config.onCancel ? '' : 'dialog-hidden') + '" href="' + (config.cancelUrl || 'javascript:void(0);') + '" ' + (config.cancelUrl ? 'target="_blank"' : '') + '>' + (config.cancelValue != null ? config.cancelValue : '取消') + '</a>',
            '<a class="dialog-btn dialog-ok ' + (config.onOk ? '' : 'dialog-hidden') + '" href="' + (config.okUrl || 'javascript:void(0);') + '" ' + (config.okUrl ? 'target="_blank"' : '') + '>' + (config.okValue != null ? config.okValue : '确定') + '</a></div>',
            '</div>',
            '</div>'
        ].join("");
        body.appendChild(d);
        return d;
    };

    function Init(config) {
        if (typeof config === "string" || typeof config === "number") {
            config = {
                content: config
            };
        } else {
            config = config || {};
        }

        var self = this,
            d = Dialog.getDialog(config);
        this.id = d.id;
        this.$wrapper = d;
        this.$box = d.querySelector(".dialog-box");

        // 关闭事件
        function closeEvent(e) {
            var noClose = false;
            if (typeof config.onClose === "function") {
                noClose = config.onClose();
            } else if (typeof config.onCancel === "function") {
                noClose = config.onCancel();
            }
            if (noClose !== true) {
                self.remove();
            }
            e.stopPropagation();
        };

        // 关闭事件
        function cancelEvent(e) {
            var noClose = false;
            if (typeof config.onCancel === "function") {
                noClose = config.onCancel();
            }
            if (noClose !== true) {
                self.remove();
            }
            e.stopPropagation();
        }

        function okEvent(e) {
            var noClose = false;
            if (typeof config.onOk === "function") {
                noClose = config.onOk();
            }
            if (noClose !== true) {
                self.remove();
            }
            e.stopPropagation();
        }

        var okElem = d.querySelector(".dialog-ok"),
            cancelElem = d.querySelector(".dialog-cancel"),
            closeElem = d.querySelector(".dialog-x"),
            boxElem = d.querySelector(".dialog-box-inner");

        // 绑定事件
        okElem.addEventListener("click", okEvent, false);

        cancelElem.addEventListener("click", cancelEvent, false);
        closeElem.addEventListener("click", closeEvent, false);
        if (config.quickClose) {
            d.addEventListener("click", closeEvent, false);
        }
        if (config.autoShow !== false) {
            this.show();
        }
        // 弹框主体点击事件
        if (config.onBoxClick) {
            var boxClickEvent = null;
            if (typeof config.onBoxClick === 'string') {
                if (config.onBoxClick === 'ok') {
                    boxClickEvent = okEvent;
                } else if (config.onBoxClick === 'cancel') {
                    boxClickEvent = cancelEvent;
                } else if (config.onBoxClick === 'close') {
                    boxClickEvent = closeEvent;
                }
            } else if (typeof config.onBoxClick === 'function') {
                boxClickEvent = function(e) {
                    if (config.onBoxClick() !== true) {
                        self.remove();
                    }
                    e.stopPropagation();
                }
            }

            if (boxClickEvent) {
                boxElem.addEventListener("click", boxClickEvent, false);
            }
        }
        return this;
    }

    Init.prototype = {
        hide: function() {
            this.$wrapper.style.opacity = 0;
            this.status = "hide";
            var i, showSign = false;
            for (i in Dialog.list) {
                if (Dialog.list[i].status === "show") {
                    showSign = true;
                }
            }
            //dom.style.overflow = showSign ? "hidden" : "";
            return this;
        },
        adapt: function() {
            this.$box.style.top = (getScrollTop() + Math.max((getClientHeight() - this.$box.offsetHeight) / 2, 0)) + "px";
            this.$wrapper.style.height = getScrollHeight() + "px";
        },
        show: function() {
            this.status = "show";
            //dom.style.overflow = "hidden";
            this.$wrapper.style.cssText = [
                "position: fixed",
                "top: 0",
                "left: 0",
                "width: 100%",
                "height: 0"
            ].join(";");
            this.$box.style.cssText = [
                "position: fixed",
                "top: 0",
                "left: 0",
                "width: 100%"
            ].join(";");
            this.adapt();
            this.$wrapper.classList.add('show');
            return this;
        },
        remove: function() {
            if (this.status === "show") {
                this.hide();
                this.$wrapper.parentNode.removeChild(this.$wrapper);
                delete Dialog.list[this.id];
            }
            return this;
        }
    };

    // 动态适应
    var resizeTimer;
    if (window.addEventListener) {
        window.addEventListener("resize", function(e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                for (var i in Dialog.list) {
                    if (Dialog.list.hasOwnProperty(i)) {
                        Dialog.list[i].adapt();
                    }
                }
            }, 100);
        }, false);
    }

    window.Dialog = Dialog;
})();