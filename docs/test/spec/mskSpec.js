describe("msk basics v"+mkr.constructs.msk.VERSION, function() {
  var m, a, svg, img0, img1;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    console.log(svg);
    a = m.construct('msk', {
      masks:[ 
        ['rect', {attr:{width:100, height:100, fill:'red', stroke:'yellow'}}],
        ['circle', {attr:{r:100, cx:m.width/2, cy:m.height/2, fill:'white', stroke:'white'}}]      ]
    });

    img0 = m.create('image', {attr:{class:'img img-0', href:'../downloads/test/bg2.jpg', width:300, height:600}}, a.parent);
    img1 = m.create('image', {attr:{class:'img', href:'../downloads/test/beta-king.png', width:165, height:162}}, a.parent);
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new msk", function() {
      expect(a).toBeDefined();
    });
    it("every new msk has a mask element", function() {
      expect(a.el.constructor.name).toEqual('SVGMaskElement');
    });

    it("a read-only id, url, and masks", function() {
      expect(a.id).toEqual('msk-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('msk-0');

      expect(a.url).toEqual('url("#msk-0")');
      a.url = 'someNewUrl';
      expect(a.url).toEqual('url("#msk-0")');

      expect(a.masks.constructor.name).toEqual('NodeList');
      a.masks = 'someNewMasks';
      expect(a.masks.constructor.name).toEqual('NodeList');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

  });

  describe("Instance methods...", function() {
    it("msk can create a mask child", function() {
      a.create('polygon', {attr:{points:'50 25, 25 50, 0 25, 25 0', fill:'blue'}});
      expect(a.masks.length).toEqual(3);
    });

    it("add a construct-based mask child", function() {
      a.construct('arc', {length:360, fill:'blue'});
      expect(a.masks.length).toEqual(4);
    });

    it("add an existing element as a mask child", function() {
      var c = mkr.create('circle', {attr:{r:15, cx:m.width/2, cy:m.height/2, fill:'pink', stroke:'black'}})
      a.add(c)
      expect(a.masks.length).toEqual(5);
    });

    it("remove a mask child", function() {
      a.remove(0)
      expect(a.masks.length).toEqual(4);
    });

    it("get a mask child", function() {
      var mask = a.get(0);
      expect(mask.getAttribute('r')).toEqual('100');
    });

    it("set a mask child", function() {
      a.set({attr:{fill:'orange'}}, 1)
      var mask = a.get(1);
      expect(mask.getAttribute('fill')).toEqual('orange');
    });

    it("create a new target", function() {
      var target = a.createTarget('image', {attr:{href:'../downloads/test/bg.jpg', width:300, height:600}}, 0);
      var style = window.getComputedStyle(target);
      
      expect(style.getPropertyValue('mask')).toEqual(a.url);
    });

    it("create a construct-based target", function() {
      var target = a.constructTarget('arc', {length:360, fill:'blue', radius:15});
      var style = window.getComputedStyle(target.el);
      
      expect(style.getPropertyValue('mask')).toEqual(a.url);
    });

    it("assign existing targets", function() {
      a.assign('.img', null, 0);

      var style = window.getComputedStyle(img0);
      expect(style.getPropertyValue('mask')).toEqual(a.url);

      style = window.getComputedStyle(img0);
      expect(style.getPropertyValue('mask')).toEqual(a.url);
    });

    it("unassign targets", function() {
      a.unassign('.img-0');
      
      var style = window.getComputedStyle(img0);
      console.log(style.getPropertyValue('mask'));
      expect(style.getPropertyValue('mask')).toEqual('none');
    });

  });  
});
