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
        this._copterSprite = cc.Sprite.create(cb.resources.player_copter + "_01");
        this.addChild(this._copterSprite);
        this._copterSprite.setPosition(cc.p(0, this._playerSprite.getContentSize().height/2 + 2 + this._copterSprite.getContentSize().height/2));
    },

    _setState:function(state) {
        if (this._state)
            this._state.onExit();
        this._state = state;
        this._state.onEnter();
    },

    animateFlying:function() {
        this._setState(new cb.Player.State.Flying(this));
    },

    animateFalling:function(animateDuration) {
        this._setState(new cb.Player.State.Falling(this, animateDuration));
    },

    animateDead:function() {
        this._setState(new cb.Player.State.Dead(this));
    },

    flipHorizontal:function() {
        this._playerSprite.setFlippedX(!this._playerSprite.isFlippedX());
        var acceleration = this.getAcceleration();
        acceleration.x *= -1;
        this.setAcceleration(acceleration);
    },

    update:function(dt) {
        this._super(dt);
        this._state.handleUpdate(dt);
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
        this._animatePlayerSprite();
        this._animateCopterSprite();

        this._player.setVelocity(cc.p(0, 0));
        this._player.setAcceleration(cc.p(20, 0));
    },

    _animatePlayerSprite:function() {
        var spriteFrameNames = [];
        for (var i = 0; i < 13; i++)
            spriteFrameNames.push(cb.resources.player1);
        spriteFrameNames.push(cb.resources.player1_blink);
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithFrameNames(spriteFrameNames, 0.15, true);
        this._player._playerSprite.runAction(spriteAnimationAction);
    },

    _animateCopterSprite:function() {
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithPrefix(cb.resources.player_copter, 0.1, true);
        this._player._copterSprite.runAction(spriteAnimationAction);
    },

    onExit:function() {
        this._player._playerSprite.stopAllActions();
        this._player._copterSprite.stopAllActions();

        this._player.setVelocity(cc.p(0, 0));
        this._player.setAcceleration(cc.p(0, 0));
    }
});

cb.Player.State.Falling = cb.Player.State.extend((function() {
    var copterWingX = 10;
    var playerCopterWingYDistance = 5;
    var copterWingRotateDuration = 0.5;
    var copterWingInitialVelocity = cc.p(250, 250);
    var copterWingGravity = cc.p(0, -10);

    cb.SimplePhysicsSprite = cc.Sprite.extend(cb.SimplePhysicsBodyImpl());

    return {
        _brokenCopterWingSprites : null,
        _animateDuration : null,

        ctor:function(player, animateDuration) {
            this._super(player);

            this._animateDuration = animateDuration;
        },

        onEnter:function() {
            this._animatePlayerSprite();
            this._animateCopterSprite();
        },

        _animatePlayerSprite:function() {
            this._player._playerSprite.setDisplayFrame(cc.spriteFrameCache.getSpriteFrame(cb.resources.player1_idle.substr(1)));

            var rotationAngleMultiplier = this._player._playerSprite.isFlippedX() ? -1 : 1;
            if (this._animateDuration <= 1) {
                this._player._playerSprite.runAction(cc.RotateBy.create(this._animateDuration, 180 * rotationAngleMultiplier));
            }
            else {
                var cycleCounts = Math.floor(this._animateDuration);
                var cycleDuration = this._animateDuration / (cycleCounts + 0.5); // half a cycle to rotated to upside down position
                var rotateActions = [];
                rotateActions.push(cc.RotateBy.create(cycleDuration / 2, 180 * rotationAngleMultiplier));
                for (var i = 0; i < cycleCounts; i++)
                    rotateActions.push(cc.RotateBy.create(cycleDuration, 360 * rotationAngleMultiplier));
                this._player._playerSprite.runAction(cc.Sequence.create(rotateActions));
            }
        },

        _animateCopterSprite:function() {
            this._player.removeChild(this._player._copterSprite);

            this._brokenCopterWingSprites = [];
            this._createLeftBrokenCopterWing();
            this._createRightBrokenCopterWing();
        },

        _createLeftBrokenCopterWing:function() {
            var copterLeftWing = new cb.SimplePhysicsSprite(cb.resources.broken_copter_left_wing);
            this._player.addChild(copterLeftWing);
            this._brokenCopterWingSprites.push(copterLeftWing);

            var playerSpriteMaxY = this._player._playerSprite.getPositionY() + this._player._playerSprite.getContentSize().height/2;
            copterLeftWing.setPosition(cc.p(-copterWingX, playerSpriteMaxY + playerCopterWingYDistance + copterLeftWing.getContentSize().height/2));

            copterLeftWing.runAction(cc.RepeatForever.create(cc.RotateBy.create(copterWingRotateDuration, -360)));
            copterLeftWing.setVelocity(cc.p(-copterWingInitialVelocity.x, copterWingInitialVelocity.y));
            copterLeftWing.setAcceleration(copterWingGravity);
        },

        _createRightBrokenCopterWing:function() {
            var copterRightWing = new cb.SimplePhysicsSprite(cb.resources.broken_copter_right_wing);
            this._player.addChild(copterRightWing);
            var playerSpriteMaxY = this._player._playerSprite.getPositionY() + this._player._playerSprite.getContentSize().height/2;
            copterRightWing.setPosition(cc.p(copterWingX, playerSpriteMaxY + playerCopterWingYDistance + copterRightWing.getContentSize().height/2));
            this._brokenCopterWingSprites.push(copterRightWing);

            copterRightWing.runAction(cc.RepeatForever.create(cc.RotateBy.create(copterWingRotateDuration, 360)));
            copterRightWing.setVelocity(cc.p(copterWingInitialVelocity.x, copterWingInitialVelocity.y));
            copterRightWing.setAcceleration(copterWingGravity);
        },

        handleUpdate:function(dt) {
            $.each(this._brokenCopterWingSprites, function(index, copterWingSprite) {
                copterWingSprite.update(dt);
            });
        },

        onExit:function() {
            var player = this._player;
            $.each(this._brokenCopterWingSprites, function(index, copterWingSprite) {
                player.removeChild(copterWingSprite);
            })
        }
    }
}()));

cb.Player.State.Dead = cb.Player.State.extend({

});
