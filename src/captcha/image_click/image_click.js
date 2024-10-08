import "./image_click.scss"
import {Dom, CommonCaptcha, move, initConfig, destroyEvent} from "../common/common.js"

/**
 * 滑动验证码
 */

const TYPE = "IMAGE_CLICK"

function getTemplate(styleConfig) {
    return `
<div id="tianai-captcha" class="tianai-captcha-slider tianai-captcha-word-click">
    <div class="click-tip">
        <span id="tianai-captcha-click-track-font" >请依次点击:</span>
        <img src="" id="tianai-captcha-tip-img" class="tip-img">
    </div>
    <div class="content">
        <div class="bg-img-div">
            <img id="tianai-captcha-slider-bg-img" src="" alt/>
            <canvas id="tianai-captcha-slider-bg-canvas"></canvas>
            <div id="bg-img-click-mask"></div>
        </div>
         <div class="tianai-captcha-tips" id="tianai-captcha-tips"></div>
    </div>
</div>
`;
}

class ImageClick extends CommonCaptcha {
    constructor(divId, styleConfig) {
        super();
        this.boxEl = Dom(divId);
        this.styleConfig = styleConfig;
        this.type = TYPE;
        this.currentCaptchaData = {}
    }

    init(captchaData, endCallback, loadSuccessCallback) {
        // 重载样式
        this.destroy();
        this.boxEl.append(getTemplate(this.styleConfig));
        this.el = this.boxEl.find("#tianai-captcha");
        // 绑定全局
        window.currentCaptcha = this;
        // 载入验证码
        this.loadCaptchaForData(this, captchaData);
        this.endCallback = endCallback;

        // 绑定事件
        this.el.find("#bg-img-click-mask").click((event) => {
            this.currentCaptchaData.clickCount++;
            const trackArr = this.currentCaptchaData.trackArr;
            const startTime = this.currentCaptchaData.startTime;
            if (this.currentCaptchaData.clickCount === 1) {
                // move 轨迹
                window.addEventListener("mousemove", move);
                this.currentCaptchaData.startX = event.offsetX;
                this.currentCaptchaData.startY = event.offsetY;
            }
            trackArr.push({
                x: Math.round(event.offsetX),
                y: Math.round(event.offsetY),
                type: "click",
                t: (new Date().getTime() - startTime.getTime())
            });
            const left = event.offsetX - 10;
            const top = event.offsetY - 10;
            this.el.find("#bg-img-click-mask").append("<span class='click-span' style='left:" + left + "px;top: " + top + "px'>" + this.currentCaptchaData.clickCount + "</span>")
            if (this.currentCaptchaData.clickCount === 4) {
                // 校验
                this.currentCaptchaData.stopTime = new Date();
                window.removeEventListener("mousemove", move);
                this.endCallback(this.currentCaptchaData, this);
            }
        });

        if (loadSuccessCallback) {
            // 加载成功
            loadSuccessCallback(this);
        }
        return this;
    }

    destroy() {
        const existsCaptchaEl = this.boxEl.children("#tianai-captcha");
        if (existsCaptchaEl) {
            existsCaptchaEl.remove();
        }
        destroyEvent();
    }

    loadCaptchaForData(that, data) {
        const bgImg = that.el.find("#tianai-captcha-slider-bg-img");
        const tipImg = that.el.find("#tianai-captcha-tip-img");
        bgImg.on("load", () => {
            that.currentCaptchaData = initConfig(bgImg.width(), bgImg.height(), tipImg.width(), tipImg.height());
            that.currentCaptchaData.currentCaptchaId = data.id;
        })
        bgImg.attr("src", data.captcha.backgroundImage);
        tipImg.attr("src", data.captcha.templateImage);
    }
}

export default ImageClick;
