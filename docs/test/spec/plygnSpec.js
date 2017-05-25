describe("plygn basics v"+mkr.constructs.plygn.VERSION, function() {
  var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('plygn', {
      points:[]
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new plygn", function() {
      expect(a).toBeDefined();
    });
    it("every new plygn has a polygon element", function() {
      expect(a.el.constructor.name).toEqual('SVGPolygonElement');
    });

    it("a read-only id", function() {
      expect(a.id).toEqual('plygn-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('plygn-0');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("read/write x, y and points", function() {
      expect(a.x).toBeDefined();
      a.x = 10;
      expect(a.x).toEqual(10);

      expect(a.y).toBeDefined();
      a.y = 12;
      expect(a.y).toEqual(12);

      expect(a.points).toBeDefined();
      a.points = [[5, 10], [10, 20], [0, 0]];
      expect(a.points.length).toEqual(3);
    });

    it("a read/write fill, stroke and strokeWidth", function() {
      expect(a.fill).toEqual(a.fill);
      a.fill = 'pink';
      expect(a.fill).toEqual('pink');

      expect(a.stroke).toEqual(a.stroke);
      a.stroke = 'green';
      expect(a.stroke).toEqual('green');

      expect(a.strokeWidth).toEqual(a.strokeWidth);
      a.strokeWidth = 13;
      expect(a.strokeWidth).toEqual('13');
    });

    it("a read/write dasharray, dashoffset and slice", function() {
      expect(a.dashoffset).toBeDefined();
      a.dasharray = '1';
      expect(a.dasharray).toEqual('1px');

      expect(a.dashoffset).toBeDefined();
      a.dashoffset = '0';
      expect(a.dashoffset).toEqual('0px');

      expect(a.slice).toBeDefined();
      a.slice = '50%';
      //expect(a.slice).toEqual('0 50.1%');
      a.slice = '100%';
    });

  });

  describe("Instance methods...", function() {
    it("plygn can add a point", function() {
      a.addPoint([0, 5])
      expect(a.points.length).toEqual(4);
    });

    it("remove a point", function() {
      a.removePoint(0)
      expect(a.points.length).toEqual(3);
    });

    it("get a point", function() {
      var point = a.getPoint(-1);
      expect(point[0]).toEqual(0);
      expect(point[1]).toEqual(5);
    });

    it("set a point", function() {
      var point = a.setPoint([10, 10]);
      expect(point[0]).toEqual(10);
      expect(point[1]).toEqual(10);
    });

  });  
});
