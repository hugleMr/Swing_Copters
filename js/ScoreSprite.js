cb.ScoreSprite = cc.Node.extend({
    _opacity : 255,
    _font : null,
    _alignment : null,
    _score : null,

    ctor:function(score, font, alignment) {
        this._super();

        this._font = font || cb.ScoreSprite.Font.Normal;
        this._alignment = alignment || cb.ScoreSprite.Alignment.Center;
        this.setScore(score || 0);
    },

    setScore:function(score) {
        if (this._score == score)
            return;
        this._score = score;

        this.removeAllChildren();

        var digitSprites = [];
        do {
            var digit = score % 10;
            score = Math.floor(score / 10);
            var digitSprite = this._font.createDigitSprite(digit);
            this.addChild(digitSprite);
            digitSprites.push(digitSprite);
        } while (score > 0);

        this._alignment.alignDigitSprites(digitSprites.reverse());
    },

    getScore:function() {
        return this._score;
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

cb.ScoreSprite.Font = cc.Class.extend({
    _fontSuffix : null,

    ctor:function(fontSuffix) {
        this._fontSuffix = fontSuffix;
    },

    createDigitSprite:function(digit) {
        var spriteFrameNames = [
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
        return cc.Sprite.create(spriteFrameNames[digit] + this._fontSuffix);
    }
});

cb.ScoreSprite.Font.Normal = new cb.ScoreSprite.Font("");

cb.ScoreSprite.Font.Small = new cb.ScoreSprite.Font("_small");

cb.ScoreSprite.Alignment = {};

cb.ScoreSprite.Alignment.Center = {
    alignDigitSprites:function(digitSprites) {
        var distanceBetweenDigitSprites = 4;
        var totalWidth = 0;
        $.each(digitSprites, function(index, digitSprite) {
            totalWidth += (index ? distanceBetweenDigitSprites : 0) + digitSprite.getContentSize().width;
        });

        var x = -totalWidth/2;
        $.each(digitSprites, function(index, digitSprite) {
            digitSprite.setPosition(cc.p(x + digitSprite.getContentSize().width / 2, 0));
            x += digitSprite.getContentSize().width + distanceBetweenDigitSprites;
        });
    }
};

cb.ScoreSprite.Alignment.RightAligned = {
    alignDigitSprites:function(digitSprites) {
        var distanceBetweenDigitSprites = 4;

        var x = 0;
        $.each(digitSprites.reverse(), function(index, digitSprite) {
            digitSprite.setPosition(cc.p(x - digitSprite.getContentSize().width / 2, 0));
            x -= digitSprite.getContentSize().width + distanceBetweenDigitSprites;
        });
    }
};
