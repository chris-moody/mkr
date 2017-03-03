var m, tl;

function activateClickouts() {
	mkr.on('#clickTag', 'click', clickout);
}

function clickout() {
	console.log('clickTag');
	Enabler.exit('clickTag', clickTag);
}

window.onload = function() {
	if (!Enabler.isInitialized()) {
		Enabler.addEventListener( studio.events.StudioEvent.INIT, setup);
	}
	else {
		setup();
	}
};

function setup() {
	mkr.addRule('svg', 'position:absolute;');
	//m = mkr.makeDC(300, 600, {preload:true, css:{backgroundColor:'#fff'/*cursor:'pointer'*/}});
	//m = new mkr({preload:true, css:{width:300, height:600, background:'#ff0000'}});

	//create a new mkr instance...
	var m1 = new mkr();

	//...with options. mkr uses GSAP's TweenLite behind the scenes
	//for property assignment Element properties passed to the 
	//contructor are applied to the instances container
	var m = new mkr({
		css:{width:300, height:600, background:'antiquewhite'}
	});

    //The .create method is for creating elements.
    //Just provide the element tag name and options
    m.create('div', {className:'box',
    	attr:{id:'redBox'},
    	css:{width:100, height:100, background:'red'}
    });

    m.create('div', {
    	attr:{id:'greenBox', class:'box'}, 
    	css:{x:0, y:200, width:100, height:100, background:'green'}
    });

    //.create returns a reference to the new element...
    var blue = m.create('div', {
    	attr:{id:'blueBox', class:'box'}, 
    	css:{x:100, y:100, width:100, height:100, background:'blue'}
    });

    //...which can be passed as the optional 3rd argument
    //of .create to have the new object added
    //to it instead of the instances container
    m.create('p', {
    	text:'Hello, world.', //requires GSAP TextPlugin to be effective
    	css:{textAlign:'center', color:'white'}
    }, blue);

    //.create's third argument can also be a css selector
    m.create('p', {
    	text:'Hello again!',
    	css:{y:50, textAlign:'center', color:'white'}
    }, '#blueBox');

    //event management with mkr is easy!
    //Define some event handlers
    function redHandler(e) {
    	console.log('red', this.id);
    }
    function greenHandler(e) {
    	console.log('green', this.id);
    }
    function blueHandler(e) {
    	console.log('blue', this.id);
    }
    function omniHandler(e) {
    	console.log('box', this.id);
    }

    //mkr's static mkr.on function is for adding persistent listeners
    mkr.on(blue, 'click', blueHandler);

    //mkr sets the listener context to the target object by default, this can be
    //overridden bye passing a fourth argument to .on or .once
    mkr.on('#greenBox', 'click', greenHandler, blue);

    //mkr.once adds a listener that removes itself after its first trigger
    mkr.once('#redBox', 'click', redHandler);
    mkr.once('#redBox', 'click', function() {
    	console.log('mkr.once works very well with anonymous callbacks!');
    });

    //get a reference any object with selectors
    var red = mkr.query('#redBox');
    var green = mkr.query('#greenBox');

    //Note that you can pass a css selector string or
    //array to the target argument of mkr's event functions
    //to attach/detach a listener to multiple objects
    mkr.on([blue, red, green], 'click', omniHandler);

    //mkr.off is for removing listeners.
    mkr.off(green, 'click', greenHandler);

    //oh wait, that didn't work! If  a listener context is overriden
    //it must be provided to .off to successfuly remove it!
    mkr.off(green, 'click', greenHandler, blue);

    //Note that the below line of code
    //removes omniHandler from the red, green and blue boxes since they
    //each have the 'box' class
    mkr.off('.box', 'click', omniHandler);


    //dropping the listener arg removes all click listeners from targets
    mkr.off('.box', 'click');

    //dropping the listener AND type arguments removes
    //all listeners of any type from targets
    mkr.off('.box');

    //mkr.clearListeners removes any and all listeners managed by mkr
    mkr.clearListeners();

    //ANIMATION

    //every mkr is created with a TimelineMax instance. pass properties
    //to it by supplying a 'tmln' field of the construction options.
    var m2 = mkr.makeDC(300, 600, {
        tmln:{paused:true, repeat:2},
        css:{x:300, background:'#17baef'}
    });

    m2.create('img', {attr:{class:'beta', src:"beta-box.png"},   css:{alpha:0, x:75, y:10}});
    m2.create('img', {attr:{class:'beta', src:"beta-cloud.png"}, css:{alpha:0, x:75, y:110}});
    m2.create('img', {attr:{class:'beta', src:"beta-king.png"},  css:{alpha:0, x:75, y:260}});
    m2.create('img', {attr:{class:'beta', src:"beta-mail.png"},  css:{alpha:0, x:75, y:430}});
    m2.create('img', {attr:{class:'beta', src:"beta-pencil.png"}, css:{alpha:0, x:105, y:200}});

    isi = m2.create('div', {css:{y:400, width:m2.width, height:200, overflowY:'scroll', background:'white'}, text:mkr.query('.content-src').innerHTML});
    mkr.scroll(isi);

    m2.tmln.staggerTo('.beta', .5, {alpha:1, yoyo:true, repeat:1}, .5);
    m2.tmln.play();

    //preloading preloader 

	//m.load(loadComplete);
}

function loadComplete() {
	activateClickouts();
	TweenLite.delayedCall(1, frame1);
}

function frame1() {
	//tl.play();
}