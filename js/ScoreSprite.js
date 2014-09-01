cb.ScoreSprite = cc.Node.extend({
    _opacity : 255,
    _score : 0,

    ctor:function(score) {
        this._super();

        this.setScore(score || 0);
    },

    setScore:function(score) {
        if (this._score == score)
            return;
        this._score = score;

        this.removeAllChildren();

        var distanceBetweenDigitSprites = 4;
        var totalWidth = 0;//sprites.length * sprites[0].getContentSize().width + (sprites.length - 1) * distanceBetweenDigitSprites;
        var sprites = [];
        do {
            var digit = score % 10;
            score = Math.floor(score / 10);

            var digitSprite = this._createDigitSprite(digit);
            sprites.push(digitSprite);
            totalWidth += (sprites.length > 1 ? distanceBetweenDigitSprites : 0) + digitSprite.getContentSize().width;
        } while (score > 0);

        var x = -totalWidth/2;
        for (var i = sprites.length - 1; i >=0; i--) {
            var digitSprite = sprites[i];
            this.addChild(digitSprite);
            digitSprite.setPosition(cc.p(x + digitSprite.getContentSize().width / 2, 0));
            x += digitSprite.getContentSize().width + distanceBetweenDigitSprites;
        }
    },

    getScore:function() {
        return this._score;
    },

    _createDigitSprite:function(n) {
        var sprites = [
            cb.resources.zero,
            cb.resources.one,
            cb.resources.two,
            cb.resources.three,
            cb.resources.four,
            cb.resources.five,
            cb.resources.six,
            cb.resources.seven,
            cb.resources.eight,
            cb.resources.nine
        ];
        return cc.Sprite.create(sprites[n]);
    },

    setOpacity:function(opacity) {
        if (this._opacity == opacity)
            return;
        this._opacity = opacity;
        $.each(this.getChildren(), function(index, child) {
            child.setOpacity(opacity);
        });
    },

    getOpacity:function() {
        return this._opacity;
    }
});