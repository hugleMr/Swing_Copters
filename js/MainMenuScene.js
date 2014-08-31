cb.MainMenuScene = cb.GameScene.extend({
    ctor:function() {
        this._super();

        this._initializeBackground();
        this._initializeGrounds();
        this._createClouds([ cc.p(300, 600), cc.p(150, 400) ]);
        this._createObstacles(this.getContentSize().width/2, 500);
        this._initializeAnimatedTitleSprite();
        this._initializeMenuButtons();
    },

    _initializeAnimatedTitleSprite:function() {
        cc.spriteFrameCache.addSpriteFrames("images/swing_copters_title.plist", "images/swing_copters_title.png");

        var spriteBatchNode = new cc.SpriteBatchNode("images/swing_copters_title.plist");
        this.addChild(spriteBatchNode);

        var animatedSprite = cc.Sprite.createWithSpriteFrameName("#swing_copters_title_01");
        spriteBatchNode.addChild(animatedSprite);
        animatedSprite.setPosition(cc.p(this.getContentSize().width / 2, 520));

        var spriteAnimation = cc.Animation.create();
        spriteAnimation.setDelayPerUnit(0.15);
        for (var i = 1; i <= 4; i++)
            spriteAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("swing_copters_title_0" + i));

        animatedSprite.runAction(cc.RepeatForever.create(cc.Animate.create(spriteAnimation)));

        var moveAnimationActions = [];
        var moveDistance = cc.p(0, -8), negativeMoveDistance = cc.p(-moveDistance.x, -moveDistance.y);
        var moveDuration = 0.5, moveDelay = 0.1;
        moveAnimationActions.push(cc.MoveBy.create(moveDuration, moveDistance));
        moveAnimationActions.push(cc.DelayTime.create(moveDelay));
        moveAnimationActions.push(cc.MoveBy.create(moveDuration, negativeMoveDistance));
        moveAnimationActions.push(cc.DelayTime.create(moveDelay));

        animatedSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(moveAnimationActions)));
    },

    _initializeMenuButtons:function() {
        var menu = new cc.Menu();
        this.addChild(menu);

        var playMenuItem = cc.MenuItemImage.create("images/play_button.png", "images/play_button_selected.png", 'play', this);
        playMenuItem.setPosition(cc.p(-95, -190));
        menu.addChild(playMenuItem);

        var rateMenuItem = cc.MenuItemImage.create("images/rate_button.png", "images/rate_button_selected.png", 'rate', this);
        rateMenuItem.setPosition(cc.p(0, -90));
        menu.addChild(rateMenuItem);

        var leaderboardMenuItem = cc.MenuItemImage.create("images/leaderboard_button.png", "images/leaderboard_button_selected.png", 'showLeaderboard', this);
        leaderboardMenuItem.setPosition(cc.p(95, -190));
        menu.addChild(leaderboardMenuItem);
    },

    play:function() {

    },

    rate:function() {

    },

    showLeaderboard:function() {

    }
});

cb.MainMenuScene.create = function() {
    var scene = new cc.Scene();
    scene.addChild(new cb.MainMenuScene());
    return scene;
}