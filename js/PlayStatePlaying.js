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
        var cloudYDistance = 200, firstCloudY = 1200;

        var cloudY = this._topCloud ? this._topCloud.getPositionY() + cloudYDistance : firstCloudY;
        var cloudYPositions = [];
        for (var i = 0; i < 4; i++) {
            cloudYPositions.push(cloudY);
            cloudY += cloudYDistance;
        }

        this._topCloud = this._playScene._createClouds(cloudYPositions).slice(-1)[0];
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
        var copterYVelocity = cb.Config.COPTER_Y_VELOCITY;
        var scrollObjects = this._playScene._scrollLayer.getChildren();
        for (var i = 0; i < scrollObjects.length; i++) {
            var obj = scrollObjects[i];
            if (!obj.isVisible() || obj == this._playScene._player)
                continue;

            var p = obj.getPosition();
            // Instead of moving up the copter
            // We simulate the movement by moving down everything else
            // i.e. we have to minus the velocity of copter
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
        cc.audioEngine.playEffect(cb.resources.sound.hit_sfx_mp3);
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
            cc.audioEngine.playEffect(cb.resources.sound.score_sfx_mp3);
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