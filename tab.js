(function ( definition ) {
    "use strict";

    var moduleName = "Tab";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object") {
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }

})(function(root, $) {
    "use strict";

    var Module;

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    /**
     * judge exist function
     * @param  {any} x anything
     * @return {boolean}
     */
    function existy(x) {
        return x != null;
    }


    /**
     * judge true
     * @param  {any} x anything
     * @return {boolean}
     */
    function truthy(x) {
        return (x !== false) && existy(x);
    }


    // -------------------------------------------------------
    // module
    // -------------------------------------------------------

    /**
     * module factory
     * this module is dependent on jQuery
     * @prop {string} rootElement default root element class or id
     * @prop {array} instance
     * @namespace
     */
    function Factory(param) {

        var rootElement = ".js-tab";

        // param is option object
        var opt = existy(param) ? param : {};

        // set root element
        var $self = existy(opt.root) ? $(opt.root) : $(rootElement);

        // make instances and push array
        this.instance = $self.map(function(key, val) {
            return new Module(opt, val);
        });
    }


    /**
     * constructor
     * @type {Function}
     */
    Module = function(param, moduleRoot) {

        var self = this;

        // DOM element
        this.$root = $(moduleRoot);
        this.$item = null;
        this.$content = null;

        this.currentIndex = 0;

        this.hash = null;

        // option
        this.opt = {
            tab         : existy(param.tab) ? param.tab : ".js-tab__head",
            item        : existy(param.item) ? param.item : ".js-tab__item",
            body        : existy(param.body) ? param.body : ".js-tab__body",
            content     : existy(param.content) ? param.conetnt : ".js-tab__content",
            currentClass: existy(param.currentClass) ? param.cunnretClass : "is-current",
            animation   : truthy(param.animation) ? param.animation : true
        };

        this.setElement();
        this.setHash();
        this.setCurrent();

        this.changeTab();

        // set event
        this.$item.on("click", "a", function() {
            self.setCurrent(this);
            self.changeTab();
            return false;
        });
    };


    /**
     * cache jQuery object
     * @returns {boolean}
     */
    Module.prototype.setElement = function() {
        this.$item = this.$root.find(this.opt.item);
        this.$content = this.$root.find(this.opt.content);
        return this;
    };


    /**
     * set location hash
     */
    Module.prototype.setHash = function() {
        this.hash = window.location.hash.replace("#", "") || null;
        return this;
    };


    /**
     * cache current item
     * 引数が空だったらhashからカレントを指定する
     * @param {object} [ele] current item element
     *
     */
    Module.prototype.setCurrent = function(ele) {
        if (ele != null) {
            this.currentIndex = $(ele).parents(this.opt.item).index();
        } else {
            if (this.$root.find("#" + this.hash).index() !== -1) {
                this.currentIndex = this.$root.find("#" + this.hash).index();
            }
        }
        return this;
    };


    /**
     * make classes at be have item & body
     * @return {string} addedClass
     */
    Module.prototype.addedClass = function() {

        var addedClass = this.opt.currentClass;
        if (this.isCssAnime()) addedClass += " is-transition";

        return addedClass;
    };


    /**
     * change tab
     * @return {boolean} false
     */
    Module.prototype.changeTab = function() {

        var index = this.currentIndex;

        this.changeHash();

        // change tab head
        this.$item
            .removeClass(this.addedClass())
            .eq(index)
            .addClass(this.addedClass());


        // change tab content
        if (this.isJsAnime()) this.$content.hide();

        this.$content
            .removeClass(this.addedClass())
            .eq(index)
            .addClass(this.addedClass())

        if (this.isJsAnime()) this.$content.eq(index).fadeIn();

        return this;
    };


    Module.prototype.isJsAnime = function(){
        return !!this.opt.animation && this.opt.animation !== 'css';
    }


    Module.prototype.isCssAnime = function(){
        return this.opt.animation === 'css';
    }


    /**
     * change hash
     */
    Module.prototype.changeHash = function() {
        return false;
    };

    return Factory;
});
