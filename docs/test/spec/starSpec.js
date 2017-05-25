describe("star basics v"+mkr.constructs.star.VERSION, function() {
  //var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('star', {
      radius:50, sides:5
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new str", function() {
      expect(a).toBeDefined();
    });
    it("every new star has a polygon element", function() {
      expect(a.el.constructor.name).toEqual('SVGPolygonElement');
    });

    it("a read-only id and coords array", function() {
      expect(a.id).toEqual('star-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('star-0');

      expect(a.coords.length).toEqual(10);
      a.coords = [];
      expect(a.coords.length).toEqual(10);
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("read/write x, y, points, r1 and r2", function() {
      expect(a.x).toBeDefined();
      a.x = 125;
      expect(a.x).toEqual(125);

      expect(a.y).toBeDefined();
      a.y = 125;
      expect(a.y).toEqual(125);

      expect(a.points).toBeDefined();
      a.points = 7;
      expect(a.points).toEqual(7);

      expect(a.r1).toBeDefined();
      a.r1 = 50;
      expect(a.r1).toEqual(50);

      expect(a.r2).toBeDefined();
      a.r2 = 75;
      expect(a.r2).toEqual(75);
    });

    it("a read/write fill, stroke and strokeWidth", function() {
      expect(a.fill).toEqual(a.fill);
      a.fill = 'pink';
      expect(a.fill).toEqual('pink');

      expect(a.stroke).toEqual(a.stroke);
      a.stroke = 'green';
      expect(a.stroke).toEqual('green');

      expect(a.strokeWidth).toEqual(a.strokeWidth);
      a.strokeWidth = 5;
      expect(a.strokeWidth).toEqual('5');
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
    it("star can get a point", function() {
      var point = a.getPoint(-1);
      expect(point.length).toEqual(2);
    });

  });  
});
