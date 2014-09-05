cb.Obstacle = cc.Node.extend({
    _platformSprites : null,
    _hammers : null,

    ctor:function() {
        this._super();

        this._createPlatformSprites();
        this._createHammers();
    },

    _createPlatformSprites:function() {
        this._platformSprites = [];
        var gapWidth = cb.Config.OBSTACLE_GAP_WIDTH;
        var platformXs = [ -gapWidth/2, gapWidth/2 ];
        for (var i = 0; i < platformXs.length; i++) {
            var platformSprite = cc.Sprite.create(cb.resources.platform);
            var platformPosition = cc.p(platformXs[i], 0);
            platformPosition.x += (i ? 1 : -1) * platformSprite.getContentSize().width/2;
            platformSprite.setPosition(platformPosition);
            this.addChild(platformSprite);
            this._platformSprites.push(platformSprite);
        }
    },

    _createHammers:function() {
        this._hammers = [];
        var platformEdgeToHammerPivotDistance = 26;

        for (var i = 0; i < this._platformSprites.length; i++) {

            var hammer = new cb.Hammer();
            var hammerX = this._platformSprites[i].getPosition().x;
            hammerX += (i ? -1 : 1) * this._platformSprites[i].getContentSize().width/2; // count toward edges
            hammerX += (i ? 1 : -1) * platformEdgeToHammerPivotDistance; // take into account the distance to pivot
            this.addChild(hammer);
            this._hammers.push(hammer);
            hammer.setPosition(cc.p(hammerX, 0));
        }
    },

    getMaxY:function() {
        return this.getPositionY() + this._platformSprites[0].getContentSize().height / 2;
    },

    getPolygonsForHitTest:function() {
        var polygons = [];
        $.each(this._hammers, function(index, hammer) {
            $.each(hammer.getPolygonsForHitTest(), function(id, polygon) {
                polygons.push(polygon.rotate(-hammer.getRotation(), cc.p(0, 0)).translate(hammer.getPosition()));
            })
        });
        $.each(this._platformSprites, function(index, platformSprite) {
            polygons.push(cb.Polygon.createFromCCRect(platformSprite.boundingBox()));
        });
        return polygons;
    }
});