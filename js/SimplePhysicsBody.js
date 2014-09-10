cb.SimplePhysicsBodyImpl = function() {
    return {
        _velocity : null,
        _acceleration : null,

        ctor:function() {
            this._super.apply(this, arguments);

            this._velocity = cc.p(0, 0);
            this._acceleration = cc.p(0, 0);
        },

        setVelocity:function(velocity) {
            this._velocity = cc.p(velocity);
        },

        getVelocity:function(velocity) {
            return cc.p(this._velocity);
        },

        setAcceleration:function(acceleration) {
            this._acceleration = cc.p(acceleration);
        },

        getAcceleration:function() {
            return cc.p(this._acceleration);
        },

        update:function(dt) {
            this._super();
            this._velocity = cc.p(this._velocity.x + this._acceleration.x, this._velocity.y + this._acceleration.y);
            var position = this.getPosition();
            position.x += this._velocity.x * dt;
            position.y += this._velocity.y * dt;
            this.setPosition(position);
        }
    }
};

cb.SimplePhysicsSprite = cc.Sprite.extend(cb.SimplePhysicsBodyImpl());