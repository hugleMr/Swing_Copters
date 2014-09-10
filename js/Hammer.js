cb.Hammer = cc.Node.extend({
    _hammerSprite : null,
    _angularVelocity : null,

    ctor:function() {
        this._super();

        this._createHammerStringSprite();
        this._createHammerSprite();
        this.startRotatingWithMaxAngle(30);
    },

    _createHammerStringSprite:function() {
        var hammerStringSprite = cc.Sprite.create(cb.resources.images.hammer_string);
        this.addChild(hammerStringSprite);
        hammerStringSprite.setPosition(cc.p(0, -42));
    },

    _createHammerSprite:function() {
        this._hammerSprite = cc.Sprite.create(cb.resources.images.hammer);
        this.addChild(this._hammerSprite);
        this._hammerSprite.setPosition(cc.p(0, -90));
    },

    getPolygonsForHitTest:function() {
        return [ cb.Polygon.createFromCCRect(this._hammerSprite.boundingBox()) ];
    },

    startRotatingWithMaxAngle:function(angle) {
        this.setRotation(angle);
        this.scheduleUpdate();
    },

    update:function(dt) {
        this._super(dt);
        var angularAcceleration = 1;

        this.setRotation(this.getRotation() + this._angularVelocity * dt);
        this._angularVelocity += (this.getRotation() > 0 ? -1 : 1) * angularAcceleration;
    }
});