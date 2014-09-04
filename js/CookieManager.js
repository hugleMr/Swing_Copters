cb.CookieManager = cc.Class.extend({
    // from http://www.w3schools.com/js/js_cookies.asp
    saveCookie:function(cname, cvalue) {
        document.cookie = cname + "=" + cvalue;
    },

    // from http://www.w3schools.com/js/js_cookies.asp
    getCookie:function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
        }
        return "";
    }
});

cb.CookieManager.sharedManager = (function() {
    var sharedManager = null;

    return function() {
        if (!sharedManager)
            sharedManager = new cb.CookieManager();
        return sharedManager;
    }
}());