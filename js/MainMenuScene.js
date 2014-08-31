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
        var animatedSprite = cc.Sprite.createWithSpriteFrameName(cb.resources.swing_copters_title + "_01");
        this.addChild(animatedSprite);
        animatedSprite.setPosition(cc.p(this.getContentSize().width / 2, 520));

        var spriteAnimation = cc.Animation.create();
        spriteAnimation.setDelayPerUnit(0.15);
        for (var i = 1; i <= 4; i++)
            spriteAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(cb.resources.swing_copters_title.substr(1) + "_0" + i));

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

        var playMenuItem = cc.MenuItemImage.create(cb.resources.play_button, cb.resources.play_button_selected, 'play', this);
        playMenuItem.setPosition(cc.p(-95, -190));
        menu.addChild(playMenuItem);

        var rateMenuItem = cc.MenuItemImage.create(cb.resources.rate_button, cb.resources.rate_button_selected, 'rate', this);
        rateMenuItem.setPosition(cc.p(0, -90));
        menu.addChild(rateMenuItem);

        var leaderboardMenuItem = cc.MenuItemImage.create(cb.resources.leaderboard_button, cb.resources.leaderboard_button_selected, 'showLeaderboard', this);
        leaderboardMenuItem.setPosition(cc.p(95, -190));
        menu.addChild(leaderboardMenuItem);
    },

    play:function() {
        cc.director.pushScene(cc.TransitionFade.create(1, cb.PlayScene.create()));
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