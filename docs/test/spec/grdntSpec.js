describe("grdnt basics v"+mkr.constructs.grdnt.VERSION, function() {
  //var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('grdnt', {
      stops:[ //defining color stops for our gradient is simple
        {offset:0, color:'#ff0000'},
        {offset:.5, color:'yellow'},
        {offset:1, color:'orange'}
      ]
    });
    a2 = m.construct('grdnt', {
      type:'radial'
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new grdnt", function() {
      expect(a).toBeDefined();
    });
    it("every new grdnt has either a linear or radial gradient element", function() {
      expect(a.el.constructor.name).toEqual('SVGLinearGradientElement');
      expect(a2.el.constructor.name).toEqual('SVGRadialGradientElement');
    });

    it("a read-only id, url, and stops", function() {
      expect(a.id).toEqual('grdnt-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('grdnt-0');

      expect(a.url).toEqual('url(#grdnt-0)');
      a.url = 'someNewUrl';
      expect(a.url).toEqual('url(#grdnt-0)');

      expect(a.stops.constructor.name).toEqual('NodeList');
      a.stops = 'someNewStops';
      expect(a.stops.constructor.name).toEqual('NodeList');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

  });

  describe("Instance methods...", function() {
    it("grdnt can add a stop", function() {
      a.addStop({color:'red', offset:.1})
      expect(a.stops.length).toEqual(4);
    });

    it("remove a stop", function() {
      a.removeStop(0)
      expect(a.stops.length).toEqual(3);
    });

    it("get a stop", function() {
      var stop = a.getStop(-1);
      expect(stop.getAttribute('stop-color')).toEqual('red');
      expect(stop.getAttribute('offset')).toEqual('0.1');
    });

    it("set a stop", function() {
      a.setStop({color:'blue', offset:.5}, -1)
      var stop = a.getStop(-1);
      expect(stop.getAttribute('stop-color')).toEqual('blue');
      expect(stop.getAttribute('offset')).toEqual('0.5');
    });

  });  
});
