cb.SparkleEffect = cc.Node.extend({
    ctor:function(size) {
        this._super();
        this.setContentSize(size);

        this._animateEffect();
    },

    _animateEffect:function() {
        var sparkleParticleFrameNames = [
            cb.resources.images.sparkle_particle_01,
            cb.resources.images.sparkle_particle_02,
            cb.resources.images.sparkle_particle_02,
            cb.resources.images.sparkle_particle_02,
            cb.resources.images.sparkle_particle_03,
            cb.resources.images.sparkle_particle_03,
            cb.resources.images.sparkle_particle_03,
            cb.resources.images.sparkle_particle_03,
            cb.resources.images.sparkle_particle_03,
            cb.resources.images.sparkle_particle_03
        ];

        var sparkleParticleFrameId = Math.floor(Math.random() * sparkleParticleFrameNames.length);
        var sparkleParticle = cc.Sprite.create(sparkleParticleFrameNames[sparkleParticleFrameId]);
        this.addChild(sparkleParticle);

        var sparkleActions = [];
        sparkleActions.push(cc.FadeIn.create(0.4));
        sparkleActions.push(cc.FadeOut.create(0.4));
        sparkleActions.push(cc.CallFunc.create(function() {
            this.removeChild(sparkleParticle);
            this._animateEffect();
        }, this));

        var size = this.getContentSize();
        sparkleParticle.setPosition(cc.p(Math.random() * size.width - size.width/2,
                                         Math.random() * size.height - size.height/2));
        sparkleParticle.setOpacity(0);
        sparkleParticle.runAction(cc.Sequence.create(sparkleActions));
    }
});