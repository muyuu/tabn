(function(definition){
    "use strict";

    var moduleName = "uiTab";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object") {
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }
})(function(root, $){
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    /**
     * trim string "."
     * @param  {string} string text
     * @return {string}        cutted "." string
     */
    function trimDot(string){ return string.replace(".", ""); }

    /**
     * judge undefined
     * @param  {any} obj anything
     * @return {boolean}
     */
    function isUndefined(obj){ return obj === void 0; }


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
    function factory(param){

        var rootElement = ".js-tab";
        var opt = !isUndefined(param) ? param : {};

        var $self;
        if ( opt.root ) {
            if(opt.root instanceof jQuery) {
                $self = param.root;
            } else {
                $self = $(param.root);
            }
        } else {
            $self = $(rootElement);
        }

        return $self.map(function(key, val){
            return new Module(opt, val);
        });
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        // option
        this.opt = {
            tab         : !isUndefined(opt.tab) ? opt.tab : ".js-tab__head",
            item        : !isUndefined(opt.item) ? opt.item : ".js-tab__item",
            body        : !isUndefined(opt.body) ? opt.body : ".js-tab__body",
            content     : !isUndefined(opt.content) ? opt.conetnt : ".js-tab__content",
            currentClass: !isUndefined(opt.currentClass) ? opt.cunnretClass : "is-current",
            animation   : !isUndefined(opt.animation) ? opt.animation : true,

            onLoad      : !isUndefined(opt.onLoad) ? opt.onLoad : null
        };

        // elements
        this.$root = $(moduleRoot);
        this.$item = this.$root.find(this.opt.item);
        this.$content = this.$root.find(this.opt.content);

        // state
        this.currentIndex = 0;
        this.loadFlg = false;
        this.hash = null;

        this.init();
    }


    Module.prototype.init = function() {
        this.setHash();
        this.setCurrent();
        this.changeTab();
        this.setHeadEvent();
        return this;
    };

    Module.prototype.setHeadEvent = function() {
        var self = this;
        this.$item.on("click", "a", function() {
            self.setCurrent(this);
            self.changeTab();
            return false;
        });
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
        var self = this;

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
            .addClass(this.addedClass());

        if (this.isJsAnime()) {
            this.$content.eq(index).fadeIn(function(){
                self.loaded();
            });
        } else {
            self.loaded();
        }

        return this;
    };


    Module.prototype.isJsAnime = function(){
        return !!this.opt.animation && this.opt.animation !== 'css';
    };


    Module.prototype.isCssAnime = function(){
        return this.opt.animation === 'css';
    };


    Module.prototype.loaded = function(){
        if ( !this.loadFlg && typeof this.opt.onLoad === 'function' ) this.opt.onLoad();
        this.loadFlg = true;
    };


    /**
     * change hash
     */
    Module.prototype.changeHash = function() {
        return false;
    };

    return factory;
});
