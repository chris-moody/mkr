describe("ln basics v"+mkr.constructs.ln.VERSION, function() {
  var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('ln', {
      points:[]
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new ln", function() {
      expect(a).toBeDefined();
    });
    it("every new ln has a polygon element", function() {
      expect(a.el.constructor.name).toEqual('SVGLineElement');
    });

    it("a read-only id", function() {
      expect(a.id).toEqual('ln-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('ln-0');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("read/write x, y and points", function() {
      expect(a.x1).toBeDefined();
      a.x1 = 10;
      expect(a.x1).toEqual('10');

      expect(a.y1).toBeDefined();
      a.y1 = 12;
      expect(a.y1).toEqual('12');

      expect(a.x2).toBeDefined();
      a.x2 = 85;
      expect(a.x2).toEqual('85');

      expect(a.y2).toBeDefined();
      a.y2 = 22;
      expect(a.y2).toEqual('22');
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

  /*describe("Instance methods...", function() {

  });  */
});
