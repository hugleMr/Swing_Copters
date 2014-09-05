cb.Medal = cc.Node.extend({
    ctor:function(type) {
        this._super();
        this._createMedalSprite(type);
    },

    _createMedalSprite:function(type) {
        var medalSprite = cc.Sprite.create(cb.resources.medal_prefix + type.name);
        this.addChild(medalSprite);
    }
});