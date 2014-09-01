cb.Animation = {};
cb.Animation.createSpriteAnimationActionWithPrefix = function(prefix, delay, repeatForever) {
    prefix = prefix.substr(1); // remove # at the beginning

    var spriteAnimation = cc.Animation.create();
    spriteAnimation.setDelayPerUnit(delay);
    var i = 1;
    while (true) {
        var spriteFrameName = prefix + "_" + ("0" + i).slice(-2) /* conver to 2 digits */;
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        if (!spriteFrame)
            break;

        spriteAnimation.addSpriteFrame(spriteFrame);
        i++;
    }

    var animationAction = cc.Animate.create(spriteAnimation);
    if (repeatForever)
        animationAction = cc.RepeatForever.create(animationAction);

    return animationAction;
};

cb.Animation.createSpriteAnimationActionWithFrameNames = function(frameNames, delay, repeatForever) {
    var spriteAnimation = cc.Animation.create();
    spriteAnimation.setDelayPerUnit(delay);
    for (var i = 0; i < frameNames.length; i++) {
        var spriteFrameName = frameNames[i].substr(1); // remove # at the beginning
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        spriteAnimation.addSpriteFrame(spriteFrame);
    }

    var animationAction = cc.Animate.create(spriteAnimation);
    if (repeatForever)
        animationAction = cc.RepeatForever.create(animationAction);

    return animationAction;
};