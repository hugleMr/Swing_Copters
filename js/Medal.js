cb.Medal = cc.Node.extend({
    _medalSprite : null,

    ctor:function(type) {
        this._super();
        this._createMedalSprite(type);
    },

    _createMedalSprite:function(type) {
        this._medalSprite = cc.Sprite.create(cb.resources.images.medal_prefix + type.name);
        this.addChild(this._medalSprite);
    },

    animateSparkle:function() {
        this.addChild(new cb.SparkleEffect(this._medalSprite.getContentSize()));
    }
});