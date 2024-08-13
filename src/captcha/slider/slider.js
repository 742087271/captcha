import "../common/common.scss"
import "./slider.scss"
import {
    Dom,
    CommonCaptcha,
    closeTips,
    down,
    initConfig,
    showTips,
    destroyEvent
} from "../common/common.js"

/**
 * 滑动验证码
 */

const TYPE = "SLIDER"

function getTemplate(styleConfig) {
    return `
<div id="tianai-captcha" class="tianai-captcha-slider">
    <div class="slider-tip">
        <span id="tianai-captcha-slider-move-track-font">${styleConfig.tips || '请完成安全验证'}</span>
    </div>
    <div class="slider-line">
    </div>
    <div class="content">
        <div class="bg-img-div">
            <img id="tianai-captcha-slider-bg-img" src="" alt/>
            <canvas id="tianai-captcha-slider-bg-canvas"></canvas>
            <div id="tianai-captcha-slider-bg-div"></div>
        </div>
        <div class="slider-img-div" id="tianai-captcha-slider-img-div">
            <img id="tianai-captcha-slider-move-img" src="" alt/>
        </div>
        <div class="tianai-captcha-tips" id="tianai-captcha-tips"></div>
    </div>
    <div class="slider-move">
        <div class="slider-move-track">
            <div id="tianai-captcha-slider-move-track-mask"></div>
            <div class="slider-move-shadow"></div>
            <span>${styleConfig.moveTrackText || '向右拖动滑块填充拼图'}</span>
        </div>
        <div class="slider-move-btn" id="tianai-captcha-slider-move-btn">
        </div>
    </div>

</div>
`
}


class Slider extends CommonCaptcha{
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
        this.loadStyle();
        // 按钮绑定事件
        this.el.find("#tianai-captcha-slider-move-btn").mousedown(down);
        this.el.find("#tianai-captcha-slider-move-btn").touchstart( down);
        // 绑定全局
        window.currentCaptcha = this;
        // 载入验证码
        this.loadCaptchaForData(this, captchaData);
        this.endCallback = endCallback;
        if (loadSuccessCallback) {
            // 加载成功
            loadSuccessCallback(this);
        }
        return this;
    }
    showTips(msg, type,callback) {
        showTips(this.el, msg,type, callback)
    }
    closeTips(callback) {
        closeTips(this.el, callback)
    }

    destroy () {
        const existsCaptchaEl = this.boxEl.children("#tianai-captcha");
        if (existsCaptchaEl) {
            existsCaptchaEl.remove();
        }
        destroyEvent();
    }
    doMove() {
        const moveX = this.currentCaptchaData.moveX;
        this.el.find("#tianai-captcha-slider-move-btn").css("transform", "translate(" + moveX + "px, 0px)")
        this.el.find("#tianai-captcha-slider-img-div").css("transform", "translate(" + moveX + "px, 0px)")
        this.el.find("#tianai-captcha-slider-move-track-mask").css("width", moveX + "px")
    }
    loadStyle () {
        let sliderImg = "";
        let moveTrackMaskBorderColor = "#00f4ab";
        let moveBtnBgColor = "#C80F0F";
        const styleConfig = this.styleConfig;
        if (styleConfig) {
            sliderImg = styleConfig.btnUrl;
            moveBtnBgColor = styleConfig.moveBtnBgColor;
            moveTrackMaskBorderColor = styleConfig.moveTrackMaskBorderColor;
        }
        this.el.find(".slider-move .slider-move-btn").css("backgroundImage", "url(" + sliderImg + ")");
        this.el.find("#tianai-captcha-slider-move-track-mask").css("borderColor", moveTrackMaskBorderColor);
        this.el.find(".slider-move .slider-move-btn").css("backgroundColor", moveBtnBgColor);
    }
    loadCaptchaForData (that, data) {
        const bgImg = that.el.find("#tianai-captcha-slider-bg-img");
        const sliderImg = that.el.find("#tianai-captcha-slider-move-img");
        bgImg.attr("src", data.captcha.backgroundImage);
        sliderImg.attr("src", data.captcha.templateImage);
        bgImg.on("load",() => {
            that.currentCaptchaData = initConfig(bgImg.width(), bgImg.height(), sliderImg.width(), sliderImg.height(), 300 - 63 + 5);
            that.currentCaptchaData.currentCaptchaId = data.id;
        });
    }
}

export default Slider;
