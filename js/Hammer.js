cb.Hammer = cc.Node.extend({
    _hammerSprite : null,

    ctor:function() {
        this._super();

        this._createHammerStringSprite();
        this._createHammerSprite();
        this.startRotatingWithMaxAngle(30);
    },

    _createHammerStringSprite:function() {
        var hammerStringSprite = cc.Sprite.create(cb.resources.hammer_string);
        this.addChild(hammerStringSprite);
        hammerStringSprite.setPosition(cc.p(0, -42));
    },

    _createHammerSprite:function() {
        this._hammerSprite = cc.Sprite.create(cb.resources.hammer);
        this.addChild(this._hammerSprite);
        this._hammerSprite.setPosition(cc.p(0, -90));
    },

    getPolygonsForHitTest:function() {
        return [ cb.Polygon.createFromCCRect(this._hammerSprite.boundingBox()) ];
    },

    startRotatingWithMaxAngle:function(angle) {
        var rotateActions = [];
        var rotationDuration = 1, rotationDelay = 0.2;

        rotateActions.push(cc.RotateBy.create(rotationDuration, -angle * 2));
        rotateActions.push(cc.DelayTime.create(rotationDelay));
        rotateActions.push(cc.RotateBy.create(rotationDuration, angle * 2));
        rotateActions.push(cc.DelayTime.create(rotationDelay));

        this.setRotation(angle);
        this.runAction(cc.RepeatForever.create(cc.Sequence.create(rotateActions)));
    }
});