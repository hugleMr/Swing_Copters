var cb = {};

cb.resources = [
    "images/background1.png",
    "images/cloud1.png",
    "images/buildings.png",
    "images/ground.png",
    "images/platform.png",
    "images/hammer.png",
    "images/swing_copters_title.png",
    "images/swing_copters_title.plist",
    "images/play_button.png",
    "images/play_button_selected.png",
    "images/rate_button.png",
    "images/rate_button_selected.png",
    "images/leaderboard_button.png",
    "images/leaderboard_button_selected.png"
];

window.onload = function(){
    cc.game.onStart = function(){
        //load resources
        cc.LoaderScene.preload(cb.resources, function () {
            cc.director.runScene(cb.MainMenuScene.create());
        }, this);
    };
    cc.game.run("gameCanvas");
};