cb.PlayScene.State.GameOver = cb.PlayScene.State.extend({
    _scoreBoard : null,

    onEnter:function() {
        this._playScene._player.animateDead();
        this._playScene._scoreSprite.setVisible(false);
        this._animateShowGameOver();
    },

    _animateShowGameOver:function() {
        var gameOverSprite = cc.Sprite.create(cb.resources.images.game_over);
        this._playScene.addChild(gameOverSprite);

        var animationActions = [];
        var position = this._playScene._scoreSprite.getPosition();
        animationActions.push(cc.MoveTo.create(0.2, position));
        position.y += 50;
        animationActions.push(cc.MoveTo.create(0.1, position));
        position.y -= 50;
        animationActions.push(cc.MoveTo.create(0.1, position));
        animationActions.push(cc.CallFunc.create(this._animateShowScoreBoard, this));

        gameOverSprite.setPosition(cc.p(this._playScene.getContentSize().width/2,
            this._playScene.getContentSize().height + gameOverSprite.getContentSize().height/2));
        gameOverSprite.runAction(cc.Sequence.create(animationActions));
    },

    _animateShowScoreBoard:function() {
        this._scoreBoard = new cb.ScoreBoard();
        this._playScene.addChild(this._scoreBoard);

        var animationActions = [];
        animationActions.push(cc.MoveTo.create(0.5, cc.p(this._playScene.getContentSize().width/2,
            this._playScene.getContentSize().height/2)));
        animationActions.push(cc.CallFunc.create(this._showScoreBoardAnimationDidEnd, this));

        this._scoreBoard.setPosition(cc.p(this._playScene.getContentSize().width/2, 300));
        this._scoreBoard.runAction(cc.Sequence.create(animationActions));
    },

    _showScoreBoardAnimationDidEnd:function() {
        this._showButtons();
        this._scoreBoard.animateScore(this._playScene._scoreSprite.getScore());
    },

    _showButtons:function() {
        var menu = new cc.Menu();
        this._playScene.addChild(menu);

        var replayMenuItem = cc.MenuItemImage.create(cb.resources.images.play_button, cb.resources.images.play_button_selected, 'replay', this);
        replayMenuItem.setPosition(cc.p(-95, -190));
        menu.addChild(replayMenuItem);

        var leaderboardMenuItem = cc.MenuItemImage.create(cb.resources.images.leaderboard_button, cb.resources.images.leaderboard_button_selected, 'showLeaderboard', this);
        leaderboardMenuItem.setPosition(cc.p(95, -190));
        menu.addChild(leaderboardMenuItem);

        var backMenuItem = cc.MenuItemImage.create(cb.resources.images.back_button, cb.resources.images.back_button_selected, 'back', this);
        backMenuItem.setPosition(cc.p(-this._playScene.getContentSize().width/2 + backMenuItem.getContentSize().width/2, 140));
        menu.addChild(backMenuItem);
    },

    replay:function() {
        cc.director.pushScene(cc.TransitionFade.create(1, cb.PlayScene.create()));
    },

    showLeaderboard:function() {

    },

    back:function() {
        cc.director.pushScene(cc.TransitionFade.create(1, cb.MainMenuScene.create()));
    }
});