cb.Player = cc.Node.extend(cb.SimplePhysicsBodyImpl()).extend({
    _playerSprite : null,
    _copterSprite : null,
    _state : null,

    ctor:function() {
        this._super();

        this._createPlayerSprite();
        this._createCopterSprite();

        this._setState(new cb.Player.State.Idle(this));
    },

    _createPlayerSprite:function() {
        this._playerSprite = cc.Sprite.create(cb.resources.player1_idle);
        this.addChild(this._playerSprite);
    },

    _createCopterSprite:function() {
        var playerCopterDistance = 2;

        this._copterSprite = cc.Sprite.create(cb.resources.player_copter + "_01");
        this.addChild(this._copterSprite);
        this._copterSprite.setPosition(cc.p(0, this._playerSprite.getContentSize().height/2 + playerCopterDistance + this._copterSprite.getContentSize().height/2));
    },

    _setState:function(state) {
        if (this._state)
            this._state.onExit();
        this._state = state;
        this._state.onEnter();
    },

    startFlying:function() {
        this._setState(new cb.Player.State.Flying(this));
    },

    flipHorizontal:function() {
        this._playerSprite.setFlippedX(!this._playerSprite.isFlippedX());
        var acceleration = this.getAcceleration();
        acceleration.x *= -1;
        this.setAcceleration(acceleration);
    },

    update:function(dt) {
        this._super(dt);
//        this._state.handleUpdate(dt);
    },

    getContentSize:function() {
        var size = cc.p(0, 0);
        size.width = Math.max(this._playerSprite.getContentSize().width, this._copterSprite.getContentSize().width);
        var copterSpriteMaxY = this._copterSprite.getPosition().y + this._copterSprite.getContentSize().height/2;
        var playerSpriteMinY = this._playerSprite.getPosition().y - this._playerSprite.getContentSize().height/2;
        size.height = copterSpriteMaxY - playerSpriteMinY;
        return size;
    },

    getMinY:function() {
        return this.getPositionX() - this._playerSprite.getContentSize().height/2;
    },

    getPolygonsForHitTest:function() {
        var polygons = [];
        polygons.push(cb.Polygon.createFromCCRect(this._playerSprite.boundingBox()));
        polygons.push(cb.Polygon.createFromCCRect(this._copterSprite.boundingBox()));
        return polygons;
    }
});

cb.Player.State = cc.Class.extend({
    _player : null,

    ctor:function(player) {
        this._player = player;
    },

    onEnter:function() {

    },

    onExit:function() {

    },

    handleUpdate:function(dt) {

    }
});

cb.Player.State.Idle = cb.Player.State.extend({
});

cb.Player.State.Flying = cb.Player.State.extend({
    onEnter:function() {
        this._startAnimatePlayerSprite();
        this._startAnimateCopterSprite();

        this._player.setVelocity(cc.p(0, 0));
        this._player.setAcceleration(cc.p(10, 0));
    },

    _startAnimatePlayerSprite:function() {
        var spriteFrameNames = [];
        for (var i = 0; i < 13; i++)
            spriteFrameNames.push(cb.resources.player1);
        spriteFrameNames.push(cb.resources.player1_blink);
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithFrameNames(spriteFrameNames, 0.15, true);
        this._player._playerSprite.runAction(spriteAnimationAction);
    },

    _startAnimateCopterSprite:function() {
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithPrefix(cb.resources.player_copter, 0.1, true);
        this._player._copterSprite.runAction(spriteAnimationAction);
    },

    onExit:function() {
        this._player._playerSprite.stopAllActions();
        this._player._copterSprite.stopAllActions();

        this._player.setVelocity(cc.p(0, 0));
        this._player.setAcceleration(cc.p(0, 0));
    },

    handleUpdate:function(dt) {
        this._player._xVelocity += this._player._xAcceleration;
        var position = this._player.getPosition();
        position.x += this._player._xVelocity * dt;
        this._player.setPosition(position);
    }
});

cb.Player.State.Falling = cb.Player.State.extend({

});

cb.Player.State.Dead = cb.Player.State.extend({

});