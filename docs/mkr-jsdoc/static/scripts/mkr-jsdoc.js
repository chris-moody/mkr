(function() {
    var e = 0;
    var t;
    var n = document.getElementById("source-code");
    if (n) {
        var i = config.linenums;
        if (i) {
            n = n.getElementsByTagName("ol")[0];
            t = Array.prototype.slice.apply(n.children);
            t = t.map(function(t) {
                e++;
                t.id = "line" + e
            })
        } else {
            n = n.getElementsByTagName("code")[0];
            t = n.innerHTML.split("\n");
            t = t.map(function(t) {
                e++;
                return '<span id="line' + e + '"></span>' + t
            });
            n.innerHTML = t.join("\n")
        }
    }
})();
$(function() {
    // fix -replace @see tags with links!
    var reg = /(\@see) ([A-z]?(\.)?[A-z](\w)*)+/g;
    var content = $('#wrap > .main').html().replace(reg, '<a href="#$2">See $2</a>');

    //remove leading dots from ids
    var reg2 = /(id\=\"\.)(\w?(\.)?(\w)*)+\"/g;
    content = content.replace(reg2, 'id="$2"');

    $('#wrap > .main').html(content);

    //remove leading dots from hrefs
    var reg3 = /(href\=\"[\w\.]*)(\#\.)(\w?(\.)?(\w)*)+\"/g;
    content = $('#wrap > .navigation').html().replace(reg3, '$1#$3"');
    $('#wrap > .navigation').html(content);
    
    // fix -end


    var classSelector = '.navigation > ul.list > li.item';
    $(classSelector).each(function() {
        var className = $(this).data('name');
        console.log(className);

        //look in .members for statics
        var staticMembers = [];
        $(this).find('ul.members > li > a').each(function() {
            var memberId = $(this).attr('href').split('#')[1];
            /*if(memberId.indexOf(0) === '.') {
                var newId = memberId.substr(1);
                document.getElementById(memberId).id = newId;
                $(this).attr('href', '#'+newId);
                memberId = newId;
            }*/
            var target = document.querySelectorAll('#'+memberId+' .type-signature.static');
            if(target.length > 0) {
                staticMembers.push($(this).parent());
            }
        });

        //look in .methods for statics
        var staticMethods = [];
        $(this).find('ul.methods > li > a').each(function() {
            var methodId = $(this).attr('href').split('#')[1];
            console.log(methodId);

            var target = document.querySelectorAll('#'+methodId+' .type-signature.static');
            if(target.length > 0) {
                staticMethods.push($(this).parent());
            }
        });

        if(staticMembers.length > 0) {
            $(this).children('ul.events').before('<ul class="staticMembers itemMembers"><span class="subtitle">Static Members</span></ul>');

            var parent = $(this).children('ul.staticMembers');
            staticMembers.forEach(function(el) {
                parent.append(el);
            });
        }

        if(staticMethods.length > 0) {
            $(this).children('ul.events').before('<ul class="staticMethods itemMembers"><span class="subtitle">Static Methods</span></ul>');

            var parent = $(this).children('ul.staticMethods');
            staticMethods.forEach(function(el) {
                parent.append(el);
            });
        }
    });

    $("#search").on("keyup", function(e) {
        var t = $(this).val();
        var n = $(".navigation");
        if (t && t.length>0) {
            var i = new RegExp(t, "i");
            n.find("li, .itemMembers").hide();
            n.find("li").each(function(e, t) {
                var n = $(t);
                if (n.data("name") && i.test(n.data("name"))) {
                    n.show();
                    n.closest(".itemMembers").show();
                    n.closest(".item").show()
                }
            })
        } else {
            n.find("li, .itemMembers").show()
        }
        n.find(".list").scrollTop(0)
    });

    $(".navigation").on("click", ".title", function(e) {
        $(this).parent().find(".itemMembers").toggle()
    });

    var e = $(".page-title").data("filename").replace(/\.[a-z]+$/, "");
    var t = $('.navigation .item[data-name*="' + e + '"]:eq(0)');
    if (t.length) {
        t.remove().prependTo(".navigation .list").show().find(".itemMembers").show()
    }
    var n = function() {
        var e = $(window).height();
        var t = $(".navigation");
        t.height(e).find(".list").height(e - 133)
    };
    $(window).on("resize", n);
    n();

    if (config.disqus) {
        $(window).on("load", function() {
            var e = config.disqus;
            var t = document.createElement("script");
            t.type = "text/javascript";
            t.async = true;
            t.src = "http://" + e + ".disqus.com/embed.js";
            (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(t);
            var n = document.createElement("script");
            n.async = true;
            n.type = "text/javascript";
            n.src = "http://" + e + ".disqus.com/count.js";
            document.getElementsByTagName("BODY")[0].appendChild(n)
        })
    }
});