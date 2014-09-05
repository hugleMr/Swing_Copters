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

    _initializeBackground:function(backgroundId) {
        var backgroundSprite = cc.Sprite.create(cb.resources.backgrounds[backgroundId || 0]);
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

    _createClouds:function(cloudYPositions, cloudId) {
        var cloudXDistanceToMidScreen = 70;
        var screenWidth = this.getContentSize().width;
        var cloudXPositions = [ screenWidth/2 - cloudXDistanceToMidScreen, screenWidth/2 + cloudXDistanceToMidScreen ];

        var cloudSprites = [];
        for (var i = 0; i < cloudYPositions.length; i++) {
            var cloudSprite = cc.Sprite.create(cb.resources.clouds[cloudId || 0]);
            cloudSprite.setZOrder(0);
            cloudSprite.setPosition(cc.p(cloudXPositions[i % 2], cloudYPositions[i]));
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
