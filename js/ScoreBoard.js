cb.ScoreBoard = cc.Node.extend({
    _scoreSprite : null,
    _highScoreSprite : null,

    ctor:function() {
        this._super();

        this._createBackgroundSprite();
        this._createScoreSprite();
        this._createHighScoreSprite();
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

    _createHighScoreSprite:function() {
        var highScore = cb.CookieManager.sharedManager().getCookie("highscore") || 0;
        this._highScoreSprite = new cb.ScoreSprite(highScore, cb.ScoreSprite.Font.Small, cb.ScoreSprite.Alignment.RightAligned);
        this.addChild(this._highScoreSprite);
        this._highScoreSprite.setPosition(cc.p(136, -42));
    },

    animateScore:function(score, callback, callbackTarget) {
        var updateInterval = 0.05;
        function animationUpdate() {
            if (this._scoreSprite.getScore() == score) {
                if (score > this._highScoreSprite.getScore()) {
                    this._updateHighScore(score);
                }
                callback.apply(callbackTarget);
            }
            else {
                this._scoreSprite.setScore(this._scoreSprite.getScore() + 1);
                this.runAction(cc.Sequence.create([ cc.DelayTime.create(updateInterval),
                                                    cc.CallFunc.create(animationUpdate, this) ]));
            }
        }
        animationUpdate.apply(this);
    },

    _updateHighScore:function(newHighScore) {
        cb.CookieManager.sharedManager().saveCookie("highscore", newHighScore);
        this._highScoreSprite.setScore(newHighScore);
        this._highlightNewHighScore();
    },

    _highlightNewHighScore:function() {
        var highlightNewSprite = cc.Sprite.create(cb.resources.new_high_score);
        this.addChild(highlightNewSprite);
        highlightNewSprite.setPosition(cc.p(57, -12))
    }
});