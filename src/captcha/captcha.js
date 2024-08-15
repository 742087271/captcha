import "./captcha.scss"
import Slider from "./slider/slider"
import Rotate from "./rotate/rotate";
import Concat from "./concat/concat";
import WordImageClick from "./word_image_click/word_image_click";
import {CaptchaConfig, wrapConfig, wrapStyle} from "./config/config";
import {clearAllPreventDefault} from "./common/common";
const template =
    `
    <div id="tianai-captcha-parent">
        <div id="tianai-captcha-bg-img"></div>
        <div id="tianai-captcha-box">
        <div id="tianai-captcha-loading" class="loading">
             <div class="tianai-captcha-loading-content">
                <div class="tianai-captcha-loading-content-col"></div>
                <div class="tianai-captcha-loading-content-col"></div>
                <div class="tianai-captcha-loading-content-col"></div>
                <div class="tianai-captcha-loading-content-col"></div>
            </div>
        </div>
        </div>
        <!-- 底部 -->
        <div class="slider-bottom">
            <img class="logo" id="tianai-captcha-logo" src="data:image/png;base64,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" id="tianai-captcha-logo"></img>
            <div class="close-btn" id="tianai-captcha-slider-close-btn"></div>
            <div class="refresh-btn" id="tianai-captcha-slider-refresh-btn"></div>
        </div>
    </div>
    `;
function createCaptchaByType(type, styleConfig) {
    switch (type) {
        case "SLIDER":
            return new Slider("#tianai-captcha-box", styleConfig);
        case "ROTATE":
            return new Rotate("#tianai-captcha-box", styleConfig);
        case "CONCAT":
            return new Concat("#tianai-captcha-box", styleConfig);
        case "WORD_IMAGE_CLICK":
            return new WordImageClick("#tianai-captcha-box", styleConfig);
        default:
            return null;
    }
}
class TianAiCaptcha {
    id = ''
    constructor(config, style) {
        this.config = wrapConfig(config);
        if (this.config.btnRefreshFun) {
            this.btnRefreshFun = this.config.btnRefreshFun;
        }
        if (this.config.btnCloseFun) {
            this.btnCloseFun = this.config.btnCloseFun;
        }
        this.style = wrapStyle(style);
        
    }

    init() {
        this.destroyWindow();
        this.config.domBindEl.append(template);
        this.domTemplate = this.config.domBindEl.find("#tianai-captcha-parent");
        clearAllPreventDefault(this.domTemplate);
        this.loadStyle();
        // 绑定按钮事件
        this.config.domBindEl.find("#tianai-captcha-slider-refresh-btn").click((el) => {
            this.btnRefreshFun(el, this);
        });
        this.config.domBindEl.find("#tianai-captcha-slider-close-btn").click((el) => {
            this.btnCloseFun(el, this);
        });
        // 加载验证码
        this.reloadCaptcha();
        return this;
    }
getId() {
    return this.id;
}
    btnRefreshFun(el, tac) {
        tac.reloadCaptcha();
    }
    btnCloseFun(el, tac) {
        tac.destroyWindow();
    }
    reloadCaptcha() {
        this.showLoading();
        this.destroyCaptcha(() => {
            this.createCaptcha();
        })
    }
    showLoading() {
        this.config.domBindEl.find("#tianai-captcha-loading").css("display", "block");
    }

    closeLoading() {
        this.config.domBindEl.find("#tianai-captcha-loading").css("display", "none");
    }

    loadStyle() {
        // 设置样式
        const bgUrl = this.style.bgUrl;
        const logoUrl = this.style.logoUrl;
        if (bgUrl) {
            // 背景图片
            this.config.domBindEl.find("#tianai-captcha-bg-img").css("background-image", "url(" + bgUrl + ")");
        }
        if (logoUrl && logoUrl !== "") {
            // logo
            this.config.domBindEl.find("#tianai-captcha-logo").attr("src", logoUrl);
        } else if (logoUrl === null){
            // 删除logo
            this.config.domBindEl.find("#tianai-captcha-logo").css("display", "none");
        }
    }

    destroyWindow() {
        window.currentCaptcha = undefined;
        if (this.domTemplate) {
            this.domTemplate.remove();
        }
    }

    openCaptcha() {
        setTimeout(() => {
            window.currentCaptcha.el.css("transform", "translateX(0)")
        }, 10)
    }

    createCaptcha() {
        this.config.requestCaptchaData().then(data => {
            this.closeLoading();
            this.id = data.id;
            const captcha = createCaptchaByType(data.captcha.type, this.style);
            if (captcha == null) {
                throw new Error("[TAC] 未知的验证码类型[" + data.captcha.type + "]");
            }
            captcha.init(data, (d, c) => {
                // 验证
                const currentCaptchaData = c.currentCaptchaData;
                const data = {
                    bgImageWidth: currentCaptchaData.bgImageWidth,
                    bgImageHeight: currentCaptchaData.bgImageHeight,
                    templateImageWidth: currentCaptchaData.sliderImageWidth,
                    templateImageHeight: currentCaptchaData.sliderImageHeight,
                    startTime: currentCaptchaData.startTime,
                    stopTime: currentCaptchaData.stopTime,
                    trackList: currentCaptchaData.trackArr
                };
                if (c.type === 'ROTATE_DEGREE' || c.type === 'ROTATE') {
                    data.bgImageWidth = c.currentCaptchaData.end;
                }
                // 清空
                const id = c.currentCaptchaData.currentCaptchaId;
                c.currentCaptchaData = undefined;
                // 调用验证接口
                this.config.validCaptcha(id, data, c, this)
            })
            this.openCaptcha()
        });
    }

    destroyCaptcha(callback) {
        if (window.currentCaptcha) {
            window.currentCaptcha.el.css("transform", "translateX(300px)")
            setTimeout(() => {
                window.currentCaptcha.destroy();
                if (callback) {
                    callback();
                }
            }, 500)
        } else {
            callback();
        }
    }


}

export {TianAiCaptcha, CaptchaConfig}
