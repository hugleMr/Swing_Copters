cb.PlayScene = cb.GameScene.extend({
    _state : null,
    _player : null,
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
        this.addChild(this._player);
        this._player.setPosition(cc.p(this.getContentSize().width / 2, 234));
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
    _animationCount : null,

    onEnter:function() {
        this._animationCount = 0;
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
        this._tapToPlaySprite.runAction(cc.Sequence.create(animationActions));
    },

    _showAnimationDidEnd:function() {
        var expectedAnimation = 2;
        if (++this._animationCount == expectedAnimation)
            this._playScene.setTouchEnabled(true);
    },

    handleTouchBegan:function(touch, event) {
        this._playScene.setTouchEnabled(false);
        this._startPlaying();
    },

    _startPlaying:function() {
        this._animationCount = 0;
        var animationDuration = 0.4;
        this._animateHideGetReady(animationDuration);
        this._animateHideTapToPlay(animationDuration);

    },

    _animateHideGetReady:function(duration) {
        var animationActions = [];
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._getReadySprite.getPositionX(),
                                                              this._playScene.getContentSize().height + this._getReadySprite.getContentSize().height/2)));
        animationActions.push(cc.CallFunc.create(this._hideAnimationDidEnd, this));

        this._getReadySprite.runAction(cc.Sequence.create(animationActions));
    },

    _animateHideTapToPlay:function(duration) {
        var animationActions = [];
        animationActions.push(cc.MoveTo.create(duration, cc.p(this._playScene.getContentSize().width + this._tapToPlaySprite.getContentSize().width/2,
                                                              this._tapToPlaySprite.getPositionY())));
        animationActions.push(cc.CallFunc.create(this._hideAnimationDidEnd, this));

        this._tapToPlaySprite.runAction(cc.Sequence.create(animationActions));

    },

    _hideAnimationDidEnd:function() {
        var expectedAnimation = 2;
        if (++this._animationCount == expectedAnimation)
            this._playScene.setState(new cb.PlayScene.State.Playing(this._playScene));
    },

    onExit:function() {
        this._playScene.removeChild(this._getReadySprite);
        this._playScene.removeChild(this._tapToPlaySprite);
    }
});

cb.PlayScene.State.Playing = cb.PlayScene.State.extend({
    _scoreSprite : null,
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
        console.log(obstacleX);
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
        this._scoreSprite = new cb.ScoreSprite();
        this._playScene.addChild(this._scoreSprite);
        this._scoreSprite.setPosition(cc.p(this._playScene.getContentSize().width/2, 600));

        var animationDuration = 1;
        var delayTillPlayDuration = 0.5;
        var animationActions = [];
        animationActions.push(cc.FadeIn.create(animationDuration));
        animationActions.push(cc.DelayTime.create(delayTillPlayDuration));
        animationActions.push(cc.CallFunc.create(this._startPlaying, this));

        this._scoreSprite.setOpacity(0);
        this._scoreSprite.runAction(cc.Sequence.create(animationActions));
    },

    _startPlaying:function() {
        this._playScene._player.startAnimating();
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
        var gravity = 100;
        var scrollObjects = this._playScene._scrollLayer.getChildren();
        for (var i = 0; i < scrollObjects.length; i++) {
            var obj = scrollObjects[i];
            var p = obj.getPosition();
            p.y -= gravity * dt;
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
            this._incrementScore();
        }
    },

    _incrementScore:function() {
        this._scoreSprite.setScore(this._scoreSprite.getScore() + 1);
    },

    _removeOffscreenObjects:function() {
        var removeYThreshold = -100;
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