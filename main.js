var cb = {};

cb.resources = {};
cb.resources.images = {};
cb.resources.sound = {};

cb.resources.images.backgrounds = [ "bg_01", "bg_02", "bg_03" ];
cb.resources.images.clouds = [ "cloud_01", "cloud_02", "cloud_03" ];
cb.resources.images.buildings = "buildings";
cb.resources.images.ground = "ground";
cb.resources.images.platform = "platform";
cb.resources.images.hammer = "hammer";
cb.resources.images.hammer_string = "hammer_string";
cb.resources.images.swing_copters_title = "swing_copters_title";
cb.resources.images.play_button = "play_button";
cb.resources.images.play_button_selected = "play_button_selected";
cb.resources.images.rate_button = "rate_button";
cb.resources.images.rate_button_selected = "rate_button_selected";
cb.resources.images.leaderboard_button = "leaderboard_button";
cb.resources.images.leaderboard_button_selected = "leaderboard_button_selected";
cb.resources.images.player1 = "player1";
cb.resources.images.player1_blink = "player1_blink";
cb.resources.images.player1_idle = "player1_idle";
cb.resources.images.player_copter = "copter";
cb.resources.images.broken_copter_left_wing = "broken_copter_left_wing";
cb.resources.images.broken_copter_right_wing = "broken_copter_right_wing";
cb.resources.images.tap_to_play = "tap_to_play";
cb.resources.images.get_ready = "get_ready";
cb.resources.images.scores = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
cb.resources.images.game_over = "game_over";
cb.resources.images.score_board_bg = "score_board_bg";
cb.resources.images.back_button = "back_button";
cb.resources.images.back_button_selected = "back_button_selected";
cb.resources.images.new_high_score = "new_high_score";
cb.resources.images.medal_prefix = "medal_";
cb.resources.images.sparkle_particle_01 = "sparkle_particle_01";
cb.resources.images.sparkle_particle_02 = "sparkle_particle_02";
cb.resources.images.sparkle_particle_03 = "sparkle_particle_03";

(function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var images = cb.resources.images;
    for (var name in images)
        if (isArray(images[name])) {
            for (var i = 0; i < images[name].length; i++)
                images[name][i] = "#" + images[name][i];
        }
        else {
            images[name] = "#" + images[name];
        }
})();

cb.resources.images.score_small_suffix = "_small";
cb.resources.images.atlas = "images/atlas.png";
cb.resources.images.atlas_plist = "images/atlas.plist";

cb.resources.sound.button_sfx_mp3 = "coin_sfx.mp3";
cb.resources.sound.button_sfx_ogg = "coin_sfx.ogg";
cb.resources.sound.score_sfx_mp3 = "score_sfx.mp3";
cb.resources.sound.score_sfx_ogg = "score_sfx.ogg";
cb.resources.sound.flip_sfx_mp3 = "flip_sfx.mp3";
cb.resources.sound.flip_sfx_ogg = "flip_sfx.ogg";
cb.resources.sound.fan_sfx_mp3 = "fan_sfx.mp3";
cb.resources.sound.fan_sfx_ogg = "fan_sfx.ogg";
cb.resources.sound.hit_sfx_mp3 = "hit_sfx.mp3";
cb.resources.sound.hit_sfx_ogg = "hit_sfx.ogg";
cb.resources.sound.die_sfx_mp3 = "die_sfx.mp3";
cb.resources.sound.die_sfx_ogg = "die_sfx.ogg";
cb.resources.sound.scoreboard_score_sfx_mp3 = "coin_sfx.mp3";
cb.resources.sound.scoreboard_score_sfx_ogg = "coin_sfx.ogg";
cb.resources.sound.scoreboard_medal_sfx_mp3 = "score_sfx.mp3";
cb.resources.sound.scoreboard_medal_sfx_ogg = "score_sfx.ogg";

(function() {
    var sound = cb.resources.sound;

    var soundFolder = "sound/";
    for (var name in sound)
        sound[name] = soundFolder + sound[name];

    var allSound = [];
    for (var name in sound)
        allSound.push(sound[name]);
    sound.all = allSound;
})();

window.onload = function(){
    function createCanvas(id, width, height) {
        var gameCanvas = document.createElement("canvas");
        gameCanvas.id = id;
        gameCanvas.width = width;
        gameCanvas.height = height;
        document.body.appendChild(gameCanvas);
    }

    var gameWidth = 432, gameHeight = 768;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        var screenWidth, screenHeight;
        // FIXME: should not access private property
        if (cc.screen._supportsFullScreen) {
            screenWidth = screen.availWidth;
            screenHeight = screen.availHeight;
        }
        else {
            screenWidth = $(window).width();
            screenHeight = $(window).height();
        }
        var widthHeightRatio = screenWidth / screenHeight;
        gameWidth = widthHeightRatio * gameHeight;
    }

    createCanvas("gameCanvas", gameWidth, gameHeight);

    cc.game.onStart = function(){
        if (isMobile) {
            cc.view.adjustViewPort(true);
            cc.view.setDesignResolutionSize(gameWidth,gameHeight,cc.ResolutionPolicy.SHOW_ALL);
            cc.view.resizeWithBrowserSize(true);
            cc.director.setProjection(cc.Director.PROJECTION_2D);
        }

        //load resources
        cc.LoaderScene.preload([cb.resources.images.atlas_plist, cb.resources.images.atlas].concat(cb.resources.sound.all), function () {
            cc.spriteFrameCache.addSpriteFrames(cb.resources.images.atlas_plist, cb.resources.images.atlas);

            cc.director.runScene(cb.MainMenuScene.create());
        }, this);
    };
    cc.game.run("gameCanvas");
};