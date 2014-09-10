cb.PlayScene.State.TapToPlay = cb.PlayScene.State.extend({
    _getReadySprite : null,
    _tapToPlaySprite : null,
    _unfinishedAnimation : null,

    onEnter:function() {
        this._unfinishedAnimation = 0;
        var animationDuration = 0.4;
        this._animateShowGetReady(animationDuration);
        this._animateShowTapToPlay(animationDuration);
    },

    _animateShowGetReady:function(duration) {
        this._getReadySprite = cc.Sprite.create(cb.resources.images.get_ready);
        this._playScene.addChild(this._getReadySprite);

        var animationActions = [];
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._playScene.getContentSize().width/2, 600)));
        animationActions.push(cc.CallFunc.create(this._showAnimationDidEnd, this));

        this._getReadySprite.setPosition(cc.p(this._playScene.getContentSize().width/2,
            this._playScene.getContentSize().height + this._getReadySprite.getContentSize().height/2));
        this._unfinishedAnimation++;
        this._getReadySprite.runAction(cc.Sequence.create(animationActions));
    },

    _animateShowTapToPlay:function(duration) {
        this._tapToPlaySprite = cc.Sprite.create(cb.resources.images.tap_to_play);
        this._playScene.addChild(this._tapToPlaySprite);

        var animationActions = [];
        var tapToPlayY = 410;
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._playScene.getContentSize().width / 2, tapToPlayY)));
        animationActions.push(cc.CallFunc.create(this._showAnimationDidEnd, this));

        this._tapToPlaySprite.setPosition(cc.p(-this._tapToPlaySprite.getContentSize().width/2, tapToPlayY));
        this._unfinishedAnimation++;
        this._tapToPlaySprite.runAction(cc.Sequence.create(animationActions));
    },

    _showAnimationDidEnd:function() {
        if (--this._unfinishedAnimation == 0)
            this._playScene.setTouchEnabled(true);
    },

    handleTouchBegan:function(touch, event) {
        this._playScene.setTouchEnabled(false);
        this._startPlaying();
    },

    _startPlaying:function() {
        this._unfinishedAnimation = 0;
        var animationDuration = 0.4;
        this._animateHideGetReady(animationDuration);
        this._animateHideTapToPlay(animationDuration);

    },

    _animateHideGetReady:function(duration) {
        var animationActions = [];
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._getReadySprite.getPositionX(),
            this._playScene.getContentSize().height + this._getReadySprite.getContentSize().height/2)));
        animationActions.push(cc.CallFunc.create(this._hideAnimationDidEnd, this));

        this._unfinishedAnimation++;
        this._getReadySprite.runAction(cc.Sequence.create(animationActions));
    },

    _animateHideTapToPlay:function(duration) {
        var animationActions = [];
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._playScene.getContentSize().width + this._tapToPlaySprite.getContentSize().width/2,
            this._tapToPlaySprite.getPositionY())));
        animationActions.push(cc.CallFunc.create(this._hideAnimationDidEnd, this));

        this._unfinishedAnimation++;
        this._tapToPlaySprite.runAction(cc.Sequence.create(animationActions));

    },

    _hideAnimationDidEnd:function() {
        if (--this._unfinishedAnimation == 0)
            this._playScene.setState(new cb.PlayScene.State.Playing(this._playScene));
    },

    onExit:function() {
        this._playScene.removeChild(this._getReadySprite);
        this._playScene.removeChild(this._tapToPlaySprite);
    }
});