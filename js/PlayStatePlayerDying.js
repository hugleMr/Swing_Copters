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
        var estimatedFallingTime = groundDistance / Math.abs(cb.Config.GRAVITY);
        this._playScene._player.animateFalling(estimatedFallingTime);
    },

    handleUpdate:function(dt) {
        this._playScene._player.update(dt);
        this._updateObjectPositions(dt);
    },

    _updateObjectPositions:function(dt) {
        // Instead of moving the copter down
        // We simulate by moving up other objects
        // Thus we need to take the minus value of gravity
        var moveDistance = -cb.Config.GRAVITY * dt;
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