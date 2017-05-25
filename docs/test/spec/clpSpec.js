describe("clp basics v"+mkr.constructs.clp.VERSION, function() {
  var m, a, svg, img0, img1;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    console.log(svg);
    a = m.construct('clp', {
      clips:[ 
        ['rect', {attr:{width:100, height:100, fill:'red', stroke:'yellow'}}],
        ['circle', {attr:{r:100, cx:m.width/2, cy:m.height/2, fill:'orange', stroke:'green'}}]      ]
    });

    img0 = m.create('image', {attr:{class:'img img-0', href:'../downloads/test/bg2.jpg', width:300, height:600}}, a.parent);
    img1 = m.create('image', {attr:{class:'img', href:'../downloads/test/beta-king.png', width:165, height:162}}, a.parent);
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new clp", function() {
      expect(a).toBeDefined();
    });
    it("every new clp has a clippath element", function() {
      expect(a.el.constructor.name).toEqual('SVGClipPathElement');
    });

    it("a read-only id, url, and clips", function() {
      expect(a.id).toEqual('clp-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('clp-0');

      expect(a.url).toEqual('url("#clp-0")');
      a.url = 'someNewUrl';
      expect(a.url).toEqual('url("#clp-0")');

      expect(a.clips.constructor.name).toEqual('NodeList');
      a.clips = 'someNewClips';
      expect(a.clips.constructor.name).toEqual('NodeList');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

  });

  describe("Instance methods...", function() {
    it("clp can create a clippath child", function() {
      a.create('polygon', {attr:{points:'50 25, 25 50, 0 25, 25 0', fill:'blue'}});
      expect(a.clips.length).toEqual(3);
    });

    it("add a construct-based clippath child", function() {
      a.construct('arc', {length:360, fill:'blue'});
      expect(a.clips.length).toEqual(4);
    });

    it("add an existing element as a clippath child", function() {
      var c = mkr.create('circle', {attr:{r:15, cx:m.width/2, cy:m.height/2, fill:'pink', stroke:'black'}})
      a.add(c)
      expect(a.clips.length).toEqual(5);
    });

    it("remove a clippath child", function() {
      a.remove(0)
      expect(a.clips.length).toEqual(4);
    });

    it("get a clippath child", function() {
      var clip = a.get(0);
      expect(clip.getAttribute('r')).toEqual('100');
    });

    it("set a clippath child", function() {
      a.set({attr:{fill:'magenta'}}, 0)
      var clip = a.get(0);
      expect(clip.getAttribute('fill')).toEqual('magenta');
    });

    it("create a new target", function() {
      var target = a.createTarget('image', {attr:{href:'../downloads/test/bg.jpg', width:300, height:600}}, 0);
      var style = window.getComputedStyle(target);
      
      expect(style.getPropertyValue('clip-path')).toEqual(a.url);
    });

    it("create a construct-based target", function() {
      var target = a.constructTarget('arc', {length:360, fill:'blue', radius:15});
      var style = window.getComputedStyle(target.el);
      
      expect(style.getPropertyValue('clip-path')).toEqual(a.url);
    });

    it("assign existing targets", function() {
      a.assign('.img', null, 0);

      var style = window.getComputedStyle(img0);
      expect(style.getPropertyValue('clip-path')).toEqual(a.url);

      style = window.getComputedStyle(img0);
      expect(style.getPropertyValue('clip-path')).toEqual(a.url);
    });

    it("unassign targets", function() {
      a.unassign('.img-0');
      
      var style = window.getComputedStyle(img0);
      console.log(style.getPropertyValue('clip-path'));
      expect(style.getPropertyValue('clip-path')).toEqual('none');
    });

  });  
});
