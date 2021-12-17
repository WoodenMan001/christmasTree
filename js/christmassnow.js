// $Christmas Snow jQuery v1.1 jQuery Plugin
// Author: FantasticPlugins
// Website: www.fantasticplugins.com | Exclusive to: http://www.codecanyon.net
// *********************************************************************************************

(function($) {
    $.fn.christmassnow = function(options) {
        var settings = $.extend({
            snowflaketype: null,
            snowflakesize: null,
            snowflakedirection: null,
            snownumberofflakes: null,
            snowflakespeed: null,
            snowflakemovement: top,
            flakeheightandwidth: null
        }, options);
        this.each(function() {
            var windowHeight = jQuery(window).height();
            var drop = jQuery('.drop').detach();
            var snowTop = Math.floor(Math.random() * (windowHeight));
            snowTop = 0;
            var header = document.getElementsByTagName("head")[0];
            $(header).append('<style type="text/css">.drop{position: fixed;color:#fff;z-index:999999;}</style>');
            function create() {
                var content;

                // alert(imageSize);
                if (settings.snowflakesize === 1) {
                    var imageSize = Math.floor(Math.random() * 30);
                }
                else {
                    var imageSize = settings.flakeheightandwidth;
                }
                if (settings.snowflakesize === 1) {
                    if (imageSize > 15) {
                        var customsize = settings.snowflakespeed * 1000;
                    } else {
                        var customsize = settings.snowflakespeed * 1200;
                    }
                } else {
                    var customsize = settings.snowflakespeed * 1200;
                }
                if (settings.snowflakedirection === 3) {
                    var direction = "right";
                } else {
                    var direction = "left";
                }
                            content = '<img class="flakeimage" style="height:' + imageSize + 'px; width:' + imageSize + 'px;"src="images/snowflake' + 1 + '.png"/>'
                        var clone = drop
                                .clone()
                                .appendTo('body')
                                .css(direction, Math.random() * jQuery(window).width() - 20)
                                .css('top', snowTop)
                                .html(content)
                                .animate(
                                {top: jQuery(window).height() - 80},
                        {
                            duration: customsize,
                            complete: function() {
                                jQuery(this).fadeOut(200, function() {
                                    jQuery(this).remove();
                                });
                            },
                            step: function(fallingSpeed) {
                                var fallingSpeed = Math.floor(Math.random() * 5 + 1);
                                var movingDirection = Math.floor(Math.random() * 2);
                                var currentLeft = parseInt(jQuery(this).css('left'));
                                var currentRight = parseInt(jQuery(this).css('right'));

                                if (settings.snowflakedirection === 1) {
                                    if (movingDirection === 0) {
                                        jQuery(this).css('bottom', currentLeft + fallingSpeed);
                                    } else {
                                        // set the snow move to left
                                        jQuery(this).css('bottom', currentLeft + -(fallingSpeed));
                                    }
                                }
                                if (settings.snowflakedirection === 2) {
                                    if (movingDirection === 0) {
                                        jQuery(this).css('left', currentLeft + fallingSpeed);
                                    } else {
                                        // set the snow move to left
                                        jQuery(this).css('left', currentLeft + -(fallingSpeed));
                                    }

                                }
                                if (settings.snowflakedirection === 3) {
                                    if (movingDirection === 0) {
                                        console.log(currentRight);
                                        jQuery(this).css('right', currentRight);

                                    } else {
                                        // set the snow move to left
                                        jQuery(this).css('right', currentRight + -(fallingSpeed));
                                    }
                                }
                                if (settings.snowflakedirection === 4) {
                                    if (movingDirection === 0) {
                                        jQuery(this).css('left', currentLeft);
                                    } else {
                                        // set the snow move to left
                                        jQuery(this).css('left', currentLeft + -(fallingSpeed));
                                    }
                                }
                            }
                        });
            }
            function makeflake() {
                for (var j = 0; j < settings.snownumberofflakes; j++) {
                    setTimeout(create, Math.random() * 5000);
                }
            }
            setInterval(makeflake, 2000);
        });
    };
}(jQuery));