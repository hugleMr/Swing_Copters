var cb = {};

cb.resources = {};

cb.resources.background1 = "background1";
cb.resources.cloud1 = "cloud1";
cb.resources.buildings = "buildings";
cb.resources.ground = "ground";
cb.resources.platform = "platform";
cb.resources.hammer = "hammer";
cb.resources.swing_copters_title = "swing_copters_title";
cb.resources.play_button = "play_button";
cb.resources.play_button_selected = "play_button_selected";
cb.resources.rate_button = "rate_button";
cb.resources.rate_button_selected = "rate_button_selected";
cb.resources.leaderboard_button = "leaderboard_button";
cb.resources.leaderboard_button_selected = "leaderboard_button_selected";

(function() {
    for (var name in cb.resources)
        cb.resources[name] = "#" + cb.resources[name];
}());

cb.resources.atlas = "images/atlas.png";
cb.resources.atlas_plist = "images/atlas.plist";

window.onload = function(){
    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload([cb.resources.atlas_plist, cb.resources.atlas], function () {
            cc.spriteFrameCache.addSpriteFrames(cb.resources.atlas_plist, cb.resources.atlas);

            cc.director.runScene(cb.MainMenuScene.create());
        }, this);
    };
    cc.game.run("gameCanvas");
};