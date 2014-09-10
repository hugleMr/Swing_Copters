cb.MenuItemImage = cc.MenuItemImage.extend({
    selected:function() {
        this._super();
        cc.audioEngine.playEffect(cb.resources.sound.button_sfx_mp3);
    }
});

cb.MenuItemImage.create = function (normalImage, selectedImage, three, four, five) {
    return new cb.MenuItemImage(normalImage, selectedImage, three, four, five)
};