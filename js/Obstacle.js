cb.Obstacle = cc.Node.extend({
    _platformSprites : null,
    _hammerSprites : null,

    ctor:function() {
        this._super();

        this._createPlatformSprites();
        this._createHammerSprites();
    },

    _createPlatformSprites:function() {
        this._platformSprites = [];
        var gapWidth = 222;
        var platformXs = [ -gapWidth/2, gapWidth/2 ];
        for (var i = 0; i < platformXs.length; i++) {
            var platformSprite = cc.Sprite.create(cb.resources.platform);
            var platformPosition = cc.p(platformXs[i], 0);
            platformPosition.x += (i ? 1 : -1) * platformSprite.getContentSize().width/2;
            platformSprite.setPosition(platformPosition);
            this.addChild(platformSprite);
            this._platformSprites.push(platformSprite);
        }
    },

    _createHammerSprites:function() {
        this._hammerSprites = [];
        var hammerY = -20;
        var platformEdgeToHammerPivotDistance = 26;

        for (var i = 0; i < this._platformSprites.length; i++) {
            var hammerSprite = cc.Sprite.create(cb.resources.hammer);
            var hammerX = this._platformSprites[i].getPosition().x;
            hammerX += (i ? -1 : 1) * this._platformSprites[i].getContentSize().width/2; // count toward edges
            hammerX += (i ? 1 : -1) * platformEdgeToHammerPivotDistance; // take into account the distance to pivot
            hammerSprite.setPosition(cc.p(hammerX, hammerY));
            this.addChild(hammerSprite);
            this._hammerSprites.push(hammerSprite);

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
    },

    getMaxY:function() {
        return this.getPositionY() + this._platformSprites[0].getContentSize().height / 2;
    }
});