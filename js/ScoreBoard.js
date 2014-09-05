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

    animateScore:function(score) {
        // Save the highscore first in case player cancels the animation prematurely
        var isNewHighScore = score > this._highScoreSprite.getScore();
        if (isNewHighScore)
            this._saveNewHighScore(score);

        var updateInterval = 0.05;
        function animationUpdate() {
            if (this._scoreSprite.getScore() == score) {
                if (isNewHighScore)
                    this._updateHighScore(score);

                var medalType = cb.Config.getMedalTypeForScore(score);
                if (medalType)
                    this._animateShowMedal(medalType);
            }
            else {
                this._scoreSprite.setScore(this._scoreSprite.getScore() + 1);
                this.runAction(cc.Sequence.create([ cc.DelayTime.create(updateInterval),
                                                    cc.CallFunc.create(animationUpdate, this) ]));
            }
        }
        animationUpdate.apply(this);
    },

    _saveNewHighScore:function(newHighScore) {
        cb.CookieManager.sharedManager().saveCookie("highscore", newHighScore);
    },

    _updateHighScore:function(newHighScore) {
        this._highScoreSprite.setScore(newHighScore);
        this._highlightNewHighScore();
    },

    _highlightNewHighScore:function() {
        var highlightNewSprite = cc.Sprite.create(cb.resources.new_high_score);
        this.addChild(highlightNewSprite);
        highlightNewSprite.setPosition(cc.p(57, -12))
    },

    _animateShowMedal:function(medalType) {
        var medal = new cb.Medal(medalType);
        this.addChild(medal);
        medal.setPosition(cc.p(-98, -12));

        var animationActions = [];
        animationActions.push(cc.ScaleTo.create(0.5, 1));

        medal.setScale(1.2);
        medal.runAction(cc.Sequence.create(animationActions));
    }
});