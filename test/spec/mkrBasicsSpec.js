describe("mkr basics v"+mkr.VERSION, function() {
  var m;// = new mkr({css:{width:300, height:300}});

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300}});
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("every new mkr has a container element", function() {
      expect(m.container.constructor.name).toEqual('HTMLDivElement');
    });

    it("a readable width and height", function() {
      expect(m.width).toEqual(300);
      expect(m.height).toEqual(300);
    });

    it("and a TimelineMax instance", function() {
      expect(m.tmln).toBeDefined();
      expect(m.tmln.reverse).toBeDefined();
    });
  });

  describe("DOM manipulation", function() {
    it("mkr instances can create elements with preset css properties and attributes", function() {
      m.create('div', {
          attr:{id:'redBox', class:'box'},
          css:{width:100, height:100, background:'red'}
      });

      m.create('div', {
          attr:{id:'greenBox', class:'box'}, 
          css:{x:0, y:200, width:100, height:100, background:'green'}
      });

      expect(m.container.querySelectorAll('.box').length).toEqual(2);
    });

    it("use mkr.query and mkr.queryAll to query the DOM", function() {
      expect(mkr.query('.box').constructor.name).toEqual('HTMLDivElement');
      expect(mkr.queryAll('.box').length).toEqual(2);
    });

    it(".create can nest new elements in existing one via the flexible selector/element parent argument", function() {
      //.create returns a reference to the new element...
      var blue = m.create('div', {
          attr:{id:'blueBox', class:'box'}, 
          css:{x:100, y:100, width:100, height:100, background:'blue'}
      });

      m.create('p', {
        text:'Hello, world.', //requires GSAP TextPlugin to be effective
        css:{textAlign:'center', color:'white'}
      }, blue);

      //.create's third argument can also be a css selector
      m.create('p', {
        text:'Hello again!',
        css:{y:50, textAlign:'center', color:'white'}
      }, '#greenBox');

      expect(mkr.query('#blueBox p')).toBeDefined();
      expect(mkr.query('#greenBox p')).toBeDefined();
    });

    it("use mkr.add to insert existing elements into the DOM", function() {
      mkr.add(mkr.query('#blueBox p'), '#redBox');
      var red = mkr.query('#redBox');
      mkr.add(mkr.query('#greenBox p'), red);

      expect(mkr.queryAll('#redBox p').length).toEqual(2);
    });

    it("use mkr.remove to remove existing elements from the DOM", function() {
      mkr.remove('#redBox p');

      expect(mkr.queryAll('#redBox p').length).toEqual(0);

      var red = mkr.query('#redBox');
      var blue = mkr.query('#blueBox');
      var green = mkr.query('#greenBox');

      mkr.remove([red, blue, green]);

      expect(mkr.queryAll('.box').length).toEqual(0);
    });

  });  
  
  describe("Event management: mkr.on, mkr.once, and mkr.off", function() {
    var lastClicked = '';
    var clicks = 0, red, blue, green;
    
    var redHandler = function(e) {
      lastClicked = this.id;
      clicks++;
      console.log('red', this.id, clicks);
    };
    var greenHandler = function(e) {
      lastClicked = this.id;
      clicks++;
      console.log('green', this.id, clicks);
    };
    var blueHandler = function(e) {
      lastClicked = this.id;
      clicks++;
       console.log('blue', this.id, clicks);
    };
    var omniHandler = function(e) {
      lastClicked = 'omni-'+this.id;
      clicks++;
      console.log('box', this.id, clicks);
    };

    beforeAll(function() {
      red = m.create('div', {className:'box',
        attr:{id:'redBox'},
        css:{width:100, height:100, background:'red'}
      });
      green = m.create('div', {
        attr:{id:'greenBox', class:'box'}, 
        css:{x:0, y:200, width:100, height:100, background:'green'}
      });
      blue = m.create('div', {
        attr:{id:'blueBox', class:'box'}, 
        css:{x:100, y:100, width:100, height:100, background:'blue'}
      });
    });

    it("mkr.on adds listeners and mkr.off removes them", function() {
      mkr.on(blue, 'click', blueHandler);
      blue.dispatchEvent(new Event('click'));
      expect(lastClicked).toEqual('blueBox');
      blue.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(3);

      mkr.off(blue, 'click', blueHandler);
      blue.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(3);
    });
       

    it("mkr.on and mkr.off can be passed a custom context", function() {
      mkr.on('#greenBox', 'click', greenHandler, blue);
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(4);
      expect(lastClicked).toEqual('blueBox');

       mkr.off('#greenBox', 'click', greenHandler, blue);
       expect(clicks).toEqual(4);
    });

    it("add and remove listeners to groups of elements with selectors or arrays", function() {
      mkr.on('.box', 'click', omniHandler);
      red.dispatchEvent(new Event('click'));
      expect(lastClicked).toEqual('omni-redBox');
      blue.dispatchEvent(new Event('click'));
      expect(lastClicked).toEqual('omni-blueBox');
      green.dispatchEvent(new Event('click'));
      expect(lastClicked).toEqual('omni-greenBox');
      expect(clicks).toEqual(7);

      mkr.off([red, blue, green], 'click', omniHandler);

      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(7);

      mkr.on([red, blue, green], 'click', omniHandler);

      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(10);

      mkr.off('.box', 'click', omniHandler);

      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(10);

    });
    
    it("use mkr.off to remove all listeners of a given type from a target", function() {
      mkr.once(red, 'click', redHandler);
      mkr.off(red, 'click');
      red.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(10);
    });

    it("use mkr.off to remove all listeners from a target", function() {
      mkr.once('.box', 'click', omniHandler);
      mkr.off('.box');
      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(10);
    });

    it("mkr.once adds a listener that removes itself after its first trigger", function() {
      mkr.once(red, 'click', redHandler);
      red.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(11);
      red.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(11);
    });

    it("mkr.once works very well with anonymous callbacks!", function() {
      mkr.once(red, 'click', function() {
        console.log('mkr.once works very well with anonymous callbacks!');
        clicks++;
      });
      red.dispatchEvent(new Event('click'));
      red.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(12);
    });

    it("mkr.clearListeners removes all listeners managed by mkr", function() {
      mkr.on('.box', 'click', omniHandler);
      
      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(15);

      mkr.clearListeners();

      red.dispatchEvent(new Event('click'));
      blue.dispatchEvent(new Event('click'));
      green.dispatchEvent(new Event('click'));
      expect(clicks).toEqual(15);
    });
  });
});
