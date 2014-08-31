cb.Player = cc.Node.extend({
    _playerSprite : null,
    _copterSprite : null,

    ctor:function() {
        this._super();

        this._createPlayerSprite();
        this._createCopterSprite();
    },

    _createPlayerSprite:function() {
        this._playerSprite = cc.Sprite.create(cb.resources.player1);
        this.addChild(this._playerSprite);
    },

    _createCopterSprite:function() {
        this._copterSprite = cc.Sprite.create(cb.resources.player_copter + "_01");
        this.addChild(this._copterSprite);
        this._copterSprite.setPosition(cc.p(0, this._playerSprite.getContentSize().height/2 + 2 + this._copterSprite.getContentSize().height/2));
    }
});