cb.PlayScene = cb.GameScene.extend({
    _state : null,
    _player : null,
    _scoreSprite : null,
    _touchListener : null,
    _touchEnabled : false,
    _backgroundId : null,

    ctor:function() {
        this._super();
        this._backgroundId = Math.floor(Math.random() * cb.resources.images.backgrounds.length);

        this._initializeBackground();
        this._initializeGrounds();
        this._createClouds([ 400, 600, 800, 1000 ]);
        this._createPlayer();
    },

    _initializeBackground:function() {
        this._super(this._backgroundId);
    },

    _createClouds:function(cloudYPositions) {
        return this._super(cloudYPositions, this._backgroundId);
    },

    _createPlayer:function() {
        this._player = new cb.Player();
        this._player.setZOrder(2);
        this._scrollLayer.addChild(this._player);
        this._player.setPosition(cc.p(this.getContentSize().width / 2, 234));
        this._scrollLayer.reorderChild(this._groundSprite, 2);
    },

    onEnterTransitionDidFinish:function() {
        this._super();
        this.setState(new cb.PlayScene.State.TapToPlay(this));
    },

    _createScoreSprite:function() {
        this._scoreSprite = new cb.ScoreSprite();
        this.addChild(this._scoreSprite);
        this._scoreSprite.setPosition(cc.p(this.getContentSize().width/2, 600));
    },

    _incrementScore:function() {
        this._scoreSprite.setScore(this._scoreSprite.getScore() + 1);
    },

    setState:function(state) {
        if (this._state)
            this._state.onExit();

        state.onEnter();
        this._state = state;
    },

    setTouchEnabled:function(enabled) {
        if (this._touchEnabled == enabled)
            return;
        this._touchEnabled = enabled;

        if (!this._touchListener)
            this._touchListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    if (target.handleTouchBegan)
                        target.handleTouchBegan(touch, event);
                }
            });

        if (this._touchEnabled)
            cc.eventManager.addListener(this._touchListener, this);
        else
            cc.eventManager.removeListener(this._touchListener);
    },

    handleTouchBegan:function(touch, event) {
        this._state.handleTouchBegan(touch, event);
    },

    update:function(dt) {
        this._super(dt);
        this._state.handleUpdate(dt);
    }
});

cb.PlayScene.create = function() {
    var scene = new cc.Scene();
    scene.addChild(new cb.PlayScene());
    return scene;

};