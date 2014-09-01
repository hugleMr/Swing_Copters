cb.Player = cc.Node.extend({
    _playerSprite : null,
    _copterSprite : null,

    ctor:function() {
        this._super();

        this._createPlayerSprite();
        this._createCopterSprite();
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
        var spriteAnimationAction = cb.Animation.createSpriteAnimationActionWithPrefix(cb.resources.player_copter, 0.15, true);
        this._copterSprite.runAction(spriteAnimationAction);
    }
});