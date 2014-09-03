(function() {
var playerCopterDistance = 2;

cb.Player = cc.Node.extend({
    _playerSprite : null,
    _copterSprite : null,
    _xVelocity : null,
    _xAcceleration : null,

    ctor:function() {
        this._super();

        this._createPlayerSprite();
        this._createCopterSprite();

        this._xVelocity = 0;
        this._xAcceleration = 10;
    },

    _createPlayerSprite:function() {
        this._playerSprite = cc.Sprite.create(cb.resources.player1_idle);
        this.addChild(this._playerSprite);
    },

    _createCopterSprite:function() {
        this._copterSprite = cc.Sprite.create(cb.resources.player_copter + "_01");
        this.addChild(this._copterSprite);
        this._copterSprite.setPosition(cc.p(0, this._playerSprite.getContentSize().height/2 + playerCopterDistance + this._copterSprite.getContentSize().height/2));
    },

    startAnimating:function() {
        this._startAnimatePlayerSprite();
        this._startAnimateCopterSprite();
    },

    _startAnimatePlayerSprite:function() {
        var spriteFrameNames = [];
        for (var i = 0; i < 13; i++)
            spriteFrameNames.push(cb.resources.player1);
        spriteFrameNames.push(cb.resources.player1_blink);
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithFrameNames(spriteFrameNames, 0.15, true);
        this._playerSprite.runAction(spriteAnimationAction);
    },

    _startAnimateCopterSprite:function() {
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithPrefix(cb.resources.player_copter, 0.1, true);
        this._copterSprite.runAction(spriteAnimationAction);
    },

    flipHorizontal:function() {
        this._playerSprite.setFlippedX(!this._playerSprite.isFlippedX());
        this._xAcceleration *= -1;
    },

    update:function(dt) {
        this._super(dt);

        this._xVelocity += this._xAcceleration;
        var position = this.getPosition();
        position.x += this._xVelocity * dt;
        this.setPosition(position);
    },

    getContentSize:function() {
        var size = cc.p(0, 0);
        size.width = Math.max(this._playerSprite.getContentSize().width, this._copterSprite.getContentSize().width);
        size.height = this._playerSprite.getContentSize().height + playerCopterDistance + this._copterSprite.getContentSize().width;
        return size;
    },

    getMinY:function() {
        return this.getPositionX() - this._playerSprite.getContentSize().height/2;
    },

    setRotation:function(rotation) {
        this._playerSprite.setRotation(rotation);
        this._copterSprite.setRotation(rotation);
    },

    getRotation:function() {
        return this._playerSprite.getRotation();
    },

    getPolygonsForHitTest:function() {
        var polygons = [];
        polygons.push(cb.Polygon.createFromCCRect(this._playerSprite.boundingBox()));
        polygons.push(cb.Polygon.createFromCCRect(this._copterSprite.boundingBox()));
        return polygons;
    }
});
}());