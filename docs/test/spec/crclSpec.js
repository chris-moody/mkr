describe("crcl basics v"+mkr.constructs.crcl.VERSION, function() {
  var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('crcl', {

    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new crcl", function() {
      expect(a).toBeDefined();
    });
    it("every new crcl has a circle element", function() {
      expect(a.el.constructor.name).toEqual('SVGCircleElement');
    });

    it("a read-only id", function() {
      expect(a.id).toEqual('crcl-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('crcl-0');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("read/write cx, cy and r", function() {
      expect(a.cx).toBeDefined();
      a.cx = 100;
      expect(a.cx).toEqual('100');

      expect(a.cy).toBeDefined();
      a.cy = 150;
      expect(a.cy).toEqual('150');

      expect(a.r).toBeDefined();
      a.r = 45;
      expect(a.r).toEqual('45');
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

  }); */ 
});
