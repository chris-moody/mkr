####[Fancy ReadMe](https://chris-moody.github.io/mkr/)
####[Full Documentation](https://chris-moody.github.io/mkr/docs/mkr.html)
## What is mkr?

mkr(/ˈmākər/) was originally designed for the development of digital advertisements and other simple animation projects where laying out and styling content in traditional markup can have a huge impact on tight timelines.

### Time Saver

mkr streamlines the build process by eliminating the need to manage markup and styles in html and css.

### Pure JS

mkr works to facilitate the management and creation of html and svg content and styles with javascript.

### Strong signals

Under the hood, mkr's event model is powered by [js-signals](http://millermedeiros.github.io/js-signals/) to ensure that listeners stay in scope.

### Right on target

In addition to object instances, several of mkr's methods also accept arrays and css selector strings as the target parameter.

### Quick and simple

mkr's simple and intuitive API makes it easy to get up and running quickly.

### Leverage

mkr uses the [greensock animation platform](https://greensock.com) to apply properties, styles, and attributes.

## Features

*   DOM manipulation
*   Dynamically add and remove CSS rules
*   Supports SVG
*   Actively maintained

## Get Started

### Instantiation

    //start by creating a new mkr instance
    var m = new mkr();

    //...with options. mkr uses GSAP's TweenMax behind the scenes
    //for property assignment Element properties passed to the 
    //constructor are applied to the instances container
    var m = new mkr({
        css:{width:300, height:600, background:'antiquewhite'}
    });


### Adding Elements

    //The .create method is for creating elements.
    //Just provide the element tag name and options
    m.create('div', {
        attr:{id:'redBox', class:'box'},
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


### Event Management
                
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

    //oh wait, that didn't work! If  a listener context is overridden
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

### Animation

    //every mkr is created with a TimelineMax instance. pass properties
    //to it by supplying a 'tmln' field of the construction options.
    var m2 = new mkr({
        tmln:{paused:true, repeat:2},
        css:{x:300, width:300, height:600, background:'#17baef'}
    });

    m2.create('img', {attr:{class:'beta', src:"beta-box.png"},   css:{alpha:0, x:75, y:10}});
    m2.create('img', {attr:{class:'beta', src:"beta-cloud.png"}, css:{alpha:0, x:75, y:110}});
    m2.create('img', {attr:{class:'beta', src:"beta-king.png"},  css:{alpha:0, x:75, y:260}});
    m2.create('img', {attr:{class:'beta', src:"beta-mail.png"},  css:{alpha:0, x:75, y:430}});
    m2.create('img', {attr:{class:'beta', src:"beta-pencil.png"}, css:{alpha:0, x:105, y:200}});

    m2.tmln.staggerTo('.beta', .5, {alpha:1, yoyo:true, repeat:1}, .5);
    m2.tmln.play();

####[Fancy ReadMe](https://chris-moody.github.io/mkr/)
####[Full Documentation](https://chris-moody.github.io/mkr/docs/mkr.html)
####License
mkr is developed and maintained by Christopher C. Moody and is 100% FREE under the MIT License

copyright 2017-2018 Christopher C. Moody