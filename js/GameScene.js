cb.GameScene = cc.Layer.extend({
    _backgroundLayer : null,
    _scrollLayer : null,
    _buildingsSprite : null,
    _groundSprite : null,

    ctor:function() {
        this._super();

        this._backgroundLayer = new cc.Layer();
        this.addChild(this._backgroundLayer);
        this._scrollLayer = new cc.Layer();
        this.addChild(this._scrollLayer);
    },

    _initializeBackground:function() {
        var backgroundSprite = cc.Sprite.create(cb.resources.background1);
        backgroundSprite.setPosition(cc.p(this.getContentSize().width / 2,
            this.getContentSize().height / 2));
        this._backgroundLayer.addChild(backgroundSprite);
    },

    _initializeGrounds:function() {
        this._buildingsSprite = cc.Sprite.create(cb.resources.buildings);
        this._buildingsSprite.setPosition(cc.p(this.getContentSize().width / 2,
            this._buildingsSprite.getContentSize().height / 2));
        this._scrollLayer.addChild(this._buildingsSprite);

        this._groundSprite = cc.Sprite.create(cb.resources.ground);
        this._groundSprite.setPosition(cc.p(this.getContentSize().width / 2,
            this._groundSprite.getContentSize().height / 2));
        this._scrollLayer.addChild(this._groundSprite);
    },

    _createClouds:function(cloudPositions) {
        var cloudSprites = [];
        for (var i = 0; i < cloudPositions.length; i++) {
            var cloudSprite = cc.Sprite.create(cb.resources.cloud1);
            cloudSprite.setZOrder(0);
            cloudSprite.setPosition(cloudPositions[i]);
            this._scrollLayer.addChild(cloudSprite);
            cloudSprites.push(cloudSprite);
        }
        return cloudSprites;
    },

    _createObstacle:function(position) {
        var obstacle = new cb.Obstacle();
        obstacle.setZOrder(1);
        obstacle.setPosition(position);
        this._scrollLayer.addChild(obstacle);
        return obstacle;
    },

    _removeScrollObject:function(object) {
        if (object == this._buildingsSprite || object == this._groundSprite)
            object.setVisible(false);
        else
            this._scrollLayer.removeChild(object);
    }
});

cb.GameScene.ScrollObjectTag = { Cloud : 100, Obstacle : 101 };