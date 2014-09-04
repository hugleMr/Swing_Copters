cb.PlayScene = cb.GameScene.extend({
    _state : null,
    _player : null,
    _scoreSprite : null,
    _touchListener : null,
    _touchEnabled : false,

    ctor:function() {
        this._super();

        this._initializeBackground();
        this._initializeGrounds();
        this._createClouds([ cc.p(150, 400), cc.p(300, 600), cc.p(150, 800), cc.p(300, 1000) ]);
        this._createPlayer();

        this.setState(new cb.PlayScene.State.TapToPlay(this));
    },

    _createPlayer:function() {
        this._player = new cb.Player();
        this._player.setZOrder(2);
        this._scrollLayer.addChild(this._player);
        this._player.setPosition(cc.p(this.getContentSize().width / 2, 234));
        this._scrollLayer.reorderChild(this._groundSprite, 2);
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

cb.PlayScene.State = cc.Class.extend({
    _playScene : null,

    ctor:function(playScene) {
        this._playScene = playScene;
    },

    onEnter:function() {

    },

    onExit:function() {

    },

    handleTouchBegan:function(touch, event) {

    },

    handleUpdate:function(dt) {

    }
});

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
        this._getReadySprite = cc.Sprite.create(cb.resources.get_ready);
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
        this._tapToPlaySprite = cc.Sprite.create(cb.resources.tap_to_play);
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

cb.PlayScene.State.Playing = cb.PlayScene.State.extend({
    _topCloud : null,
    _unscoredObstacles : null,

    onEnter:function() {
        this._unscoredObstacles = [];

        this._generateNextClouds();
        this._generateNextObstacles();
        this._animateShowScore();
    },

    _generateNextClouds:function() {
        var cloudXs = [ 150, 300 ];
        var cloudYDistance = 200, firstCloudY = 1200;

        var cloudY = this._topCloud ? this._topCloud.getPositionY() + cloudYDistance : firstCloudY;
        var cloudPositions = [];
        for (var i = 0; i < 4; i++) {
            cloudPositions.push(cc.p(cloudXs[i % 2], cloudY));
            cloudY += cloudYDistance;
        }

        this._topCloud = this._playScene._createClouds(cloudPositions).slice(-1)[0];
    },

    _generateNextObstacles:function() {
        function randomIntBetween(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        var obstacleYDistance = 350, firstObstacleY = 1000;
        var obstacleMinX = 160, obstacleMaxX = this._playScene.getContentSize().width - obstacleMinX;

        var obstacleX = randomIntBetween(obstacleMinX, obstacleMaxX);
        var obstacleY = this._unscoredObstacles.length ? this._topObstacle().getPositionY() + obstacleYDistance : firstObstacleY;

        for (var i = 0; i < 2; i++) {
            var obstacle = this._playScene._createObstacle(cc.p(obstacleX, obstacleY));
            this._unscoredObstacles.push(obstacle);
            obstacleY += obstacleYDistance;
        }
    },

    _topObstacle:function() {
        return this._unscoredObstacles.slice(-1)[0];
    },

    _animateShowScore:function() {
        this._playScene._createScoreSprite();

        var animationDuration = 1;
        var delayTillPlayDuration = 0.5;
        var animationActions = [];
        animationActions.push(cc.FadeIn.create(animationDuration));
        animationActions.push(cc.DelayTime.create(delayTillPlayDuration));
        animationActions.push(cc.CallFunc.create(this._startPlaying, this));

        this._playScene._scoreSprite.setOpacity(0);
        this._playScene._scoreSprite.runAction(cc.Sequence.create(animationActions));
    },

    _startPlaying:function() {
        this._playScene._player.animateFlying();
        this._playScene.setTouchEnabled(true);
        this._playScene.scheduleUpdate();
    },

    handleTouchBegan:function(touch, event) {
        this._playScene._player.flipHorizontal();
    },

    handleUpdate:function(dt) {
        this._updateObjectPositions(dt);
        this._playScene._player.update(dt);

        if (this._checkPlayerDead()) {
            this._handlePlayerDead();
        }
        else {
            this._checkUpdateScore();
            this._removeOffscreenObjects();
            this._checkRespawn();
        }
    },

    _updateObjectPositions:function(dt) {
        var copterYVelocity = 100;
        var scrollObjects = this._playScene._scrollLayer.getChildren();
        for (var i = 0; i < scrollObjects.length; i++) {
            var obj = scrollObjects[i];
            if (!obj.isVisible() || obj == this._playScene._player)
                continue;

            var p = obj.getPosition();
            p.y -= copterYVelocity * dt;
            obj.setPosition(p);
        }
    },

    _checkPlayerDead:function() {
        return this._checkPlayerHitScreenEdge() || this._checkPlayerHitObstacle();
    },

    _checkPlayerHitScreenEdge:function() {
        var player = this._playScene._player;
        var playerX = player.getPositionX();
        var playerWidth = player.getContentSize().width;
        var playerMinX = playerX - playerWidth/2;
        var playerMaxX = playerX + playerWidth/2;
        return playerMinX <= 0 || playerMaxX >= this._playScene.getContentSize().width;
    },

    _handlePlayerDead:function() {
        this._playScene.unscheduleUpdate();
        this._playScene.setState(new cb.PlayScene.State.PlayerDying(this._playScene));
    },

    _checkPlayerHitObstacle:function() {
        return cb.Collision.checkObstaclePlayerCollide(this._unscoredObstacles[0], this._playScene._player);
    },

    _checkUpdateScore:function() {
        var player = this._playScene._player;
        var obstacle = this._unscoredObstacles[0];
        var shouldUpdateScore = player.getMinY() > obstacle.getMaxY();
        if (shouldUpdateScore) {
            this._unscoredObstacles.splice(0, 1);
            this._playScene._incrementScore();
        }
    },

    _removeOffscreenObjects:function() {
        var removeYThreshold = -10;
        var scrollObjects = this._playScene._scrollLayer.getChildren();
        var toBeRemovedObjects = [];
        for (var i = 0; i < scrollObjects.length; i++) {
            var obj = scrollObjects[i];
            if (obj.getPosition().y + obj.getContentSize().height/2 < removeYThreshold)
                toBeRemovedObjects.push(obj);
        }

        var self = this;
        $.each(toBeRemovedObjects, function(index, obj) {
            self._playScene._removeScrollObject(obj);
        });
    },

    _checkRespawn:function() {
        this._checkCloudsRespawn();
        this._checkObstaclesRespawn();
    },

    _checkCloudsRespawn:function() {
        var cloudRespawnYThreshold = 1000;
        if (this._topCloud.getPositionY() < cloudRespawnYThreshold)
            this._generateNextClouds();
    },

    _checkObstaclesRespawn:function() {
        var obstacleRespawnYThreshold = 1000;
        if (this._topObstacle().getPositionY() < obstacleRespawnYThreshold)
            this._generateNextObstacles();
    }
});

cb.PlayScene.State.PlayerDying = cb.PlayScene.State.extend({
    onEnter:function() {
        this._setUpFallingGround();
        this._updateObjectZOrders();
        this._animatePlayerFalling();
        this._playScene.scheduleUpdate();
    },

    onExit:function() {
        this._playScene.scheduleUpdate();
    },

    _setUpFallingGround:function() {
        if (!this._playScene._buildingsSprite.isVisible()) {
            this._playScene._buildingsSprite.setPosition(cc.p(this._playScene.getContentSize().width/2, -300));
            this._playScene._groundSprite.setPosition(cc.p(this._playScene.getContentSize().width/2,
                this._playScene._buildingsSprite.getPositionY() - this._playScene._buildingsSprite.getContentSize().height/2
                    + this._playScene._groundSprite.getContentSize().height/2));
        }

        this._playScene._buildingsSprite.setVisible(true);
        this._playScene._groundSprite.setVisible(true);
    },

    _updateObjectZOrders:function() {

    },

    _animatePlayerFalling:function() {
        var groundDestination = this._playScene._groundSprite.getContentSize().height / 2;
        var groundDistance = groundDestination - this._playScene._groundSprite.getPositionY();
        var estimatedFallingTime = groundDistance / 200;
        this._playScene._player.animateFalling(estimatedFallingTime);
    },

    handleUpdate:function(dt) {
        this._playScene._player.update(dt);
        this._updateObjectPositions(dt);
    },

    _updateObjectPositions:function(dt) {
        var gravity = -200;
        var moveDistance = -gravity * dt;
        var groundDestination = this._playScene._groundSprite.getContentSize().height / 2;
        var groundDistance = groundDestination - this._playScene._groundSprite.getPositionY();
        var finishMovement = false;
        if (groundDistance <= moveDistance) {
            moveDistance = groundDistance;
            finishMovement = true;
        }

        this._moveScrollObjectBy(moveDistance);
        if (finishMovement)
            this._gameOver();
    },

    _moveScrollObjectBy:function(deltaY) {
        var scrollObjects = this._playScene._scrollLayer.getChildren();
        for (var i = 0; i < scrollObjects.length; i++) {
            var obj = scrollObjects[i];
            if (!obj.isVisible() || obj == this._playScene._player)
                continue;

            var p = obj.getPosition();
            p.y += deltaY;
            obj.setPosition(p);
        }

    },

    _gameOver:function() {
        this._playScene.setState(new cb.PlayScene.State.GameOver(this._playScene));
    }
});

cb.PlayScene.State.GameOver = cb.PlayScene.State.extend({
    _scoreBoard : null,

    onEnter:function() {
        this._playScene._player.animateDead();
        this._playScene._scoreSprite.setVisible(false);
        this._animateShowGameOver();
    },

    _animateShowGameOver:function() {
        var gameOverSprite = cc.Sprite.create(cb.resources.game_over);
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
        animationActions.push(cc.CallFunc.create(this._animateCalculateScore, this));

        this._scoreBoard.setPosition(cc.p(this._playScene.getContentSize().width/2, 300));
        this._scoreBoard.runAction(cc.Sequence.create(animationActions));
    },

    _animateCalculateScore:function() {
        this._scoreBoard.animateScore(this._playScene._scoreSprite.getScore(), this._showButtons, this);
    },

    _showButtons:function() {
        var menu = new cc.Menu();
        this._playScene.addChild(menu);

        var replayMenuItem = cc.MenuItemImage.create(cb.resources.play_button, cb.resources.play_button_selected, 'replay', this);
        replayMenuItem.setPosition(cc.p(-95, -190));
        menu.addChild(replayMenuItem);

        var leaderboardMenuItem = cc.MenuItemImage.create(cb.resources.leaderboard_button, cb.resources.leaderboard_button_selected, 'showLeaderboard', this);
        leaderboardMenuItem.setPosition(cc.p(95, -190));
        menu.addChild(leaderboardMenuItem);

        var backMenuItem = cc.MenuItemImage.create(cb.resources.back_button, cb.resources.back_button_selected, 'back', this);
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