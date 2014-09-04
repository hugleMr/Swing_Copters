cb.ScoreBoard = cc.Node.extend({
    _scoreSprite : null,
    _highScoreSprite : null,

    ctor:function(highScore) {
        this._super();

        this._createBackgroundSprite();
        this._createScoreSprite();
        this._createHighScoreSprite(highScore || 0);
    },

    _createBackgroundSprite:function() {
        var backgroundSprite = cc.Sprite.create(cb.resources.score_board_bg);
        this.addChild(backgroundSprite);
    },

    _createScoreSprite:function() {
        this._scoreSprite = new cb.ScoreSprite(0, cb.ScoreSprite.Font.Small, cb.ScoreSprite.Alignment.RightAligned);
        this.addChild(this._scoreSprite);
        this._scoreSprite.setPosition(cc.p(136, 21));
    },

    _createHighScoreSprite:function(highScore) {
        this._highScoreSprite = new cb.ScoreSprite(highScore, cb.ScoreSprite.Font.Small, cb.ScoreSprite.Alignment.RightAligned);
        this.addChild(this._highScoreSprite);
        this._highScoreSprite.setPosition(cc.p(136, -42));
    },

    animateScore:function(score, callback, callbackTarget) {
        var updateInterval = 0.05;
        function animationUpdate() {
            if (this._scoreSprite.getScore() == score)
                callback.apply(callbackTarget);
            else {
                this._scoreSprite.setScore(this._scoreSprite.getScore() + 1);
                this.runAction(cc.Sequence.create([ cc.DelayTime.create(updateInterval),
                                                    cc.CallFunc.create(animationUpdate, this) ]));
            }
        }
        animationUpdate.apply(this);
    }
});