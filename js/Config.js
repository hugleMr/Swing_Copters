cb.MedalType = {
    Bronze : { name : "bronze", score : 20 },
    Silver : { name : "silver", score : 40 },
    Gold : { name : "gold", score : 60 },
    Platinum : { name : "platinum", score : 80 }
};

cb.Config = {
    GRAVITY : -400,
    COPTER_Y_VELOCITY : 200,
    COPTER_X_ACCELERATION : 20,
    OBSTACLE_GAP_WIDTH : 222,
};

cb.Config.getMedalTypeForScore = function(score) {
    var medalType = null;
    for (var prop in cb.MedalType)
        if (score >= cb.MedalType[prop].score)
            medalType = cb.MedalType[prop];
    return medalType;
};