cb.GameScene = cc.Layer.extend({
    _backgroundLayer : null,
    _scrollLayer : null,

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
        var buildingsSprite = cc.Sprite.create(cb.resources.buildings);
        buildingsSprite.setPosition(cc.p(this.getContentSize().width / 2,
            buildingsSprite.getContentSize().height / 2));
        this._scrollLayer.addChild(buildingsSprite);

        var groundSprite = cc.Sprite.create(cb.resources.ground);
        groundSprite.setPosition(cc.p(this.getContentSize().width / 2,
            groundSprite.getContentSize().height / 2));
        this._scrollLayer.addChild(groundSprite);
    },

    _createClouds:function(cloudPositions) {
        for (var i = 0; i < cloudPositions.length; i++) {
            var cloudSprite = cc.Sprite.create(cb.resources.cloud1);
            cloudSprite.setPosition(cloudPositions[i]);
            this._scrollLayer.addChild(cloudSprite);
        }
    },

    // x is the x coordinate of the middle point of the 'gap'
    _createObstacles:function(x, y) {
        var gapWidth = 222;
        var platformPositions = [ cc.p(x - gapWidth/2, y), cc.p(x + gapWidth/2, y) ];
        for (var i = 0; i < platformPositions.length; i++) {
            var platformSprite = cc.Sprite.create(cb.resources.platform);
            var platformPosition = cc.p(platformPositions[i].x, platformPositions[i].y);
            platformPosition.x += (i ? 1 : -1) * platformSprite.getContentSize().width/2;
            platformSprite.setPosition(platformPosition);
            this.addChild(platformSprite);
        }

        var platformEdgeToHammerPivotDistance = 26;
        var hammerPositions = [ cc.p(platformPositions[0].x - platformEdgeToHammerPivotDistance, y - 20),
                                cc.p(platformPositions[1].x + platformEdgeToHammerPivotDistance, y - 20) ];
        for (var i = 0; i < hammerPositions.length; i++) {
            var hammerSprite = cc.Sprite.create(cb.resources.hammer);
            hammerSprite.setPosition(hammerPositions[i]);
            this.addChild(hammerSprite);

            // FIXME: fix this lame animation!!!
            var rotateActions = [];
            var rotationAngle = 30;
            var rotationDuration = 1, rotationDelay = 0.2;

            hammerSprite.setAnchorPoint(cc.p(0.5, 1));
            hammerSprite.setRotation(rotationAngle);

            rotateActions.push(cc.RotateBy.create(rotationDuration, -rotationAngle * 2));
            rotateActions.push(cc.DelayTime.create(rotationDelay));
            rotateActions.push(cc.RotateBy.create(rotationDuration, rotationAngle * 2));
            rotateActions.push(cc.DelayTime.create(rotationDelay));
            hammerSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(rotateActions)));
        }

    }
});