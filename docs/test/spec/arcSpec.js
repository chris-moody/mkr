describe("arc basics v"+mkr.constructs.arc.VERSION, function() {
  //var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('arc', {
      start:0, length:300, rx:30, ry:40, sweepFlag:0,
      cx:m.width/2, cy:m.height/2, rotation:0,
      fill:'green', stroke:'grey', strokeWidth:10,
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new arc", function() {
      expect(a).toBeDefined();
    });
    it("every new arc has a path element", function() {
      expect(a.el.constructor.name).toEqual('SVGPathElement');
    });

    it("a read-only id", function() {
      expect(a.id).toEqual('arc-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('arc-0');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("a read/write start, length, cx, cy, rx, ry and rotation", function() {
      expect(a.start).toBeDefined();
      a.start = 10;
      expect(a.start).toEqual(10);

      expect(a.length).toBeDefined();
      a.length = 350;
      expect(a.length).toEqual(350);

      expect(a.cx).toBeDefined();
      a.cx = a.rx;
      expect(a.cx).toEqual(a.rx);

      expect(a.cy).toBeDefined();
      a.cy = a.ry;
      expect(a.cy).toEqual(a.ry);

      expect(a.rx).toBeDefined();
      a.rx = 75;
      expect(a.rx).toEqual(75);

      expect(a.ry).toBeDefined();
      a.ry = 35;
      expect(a.ry).toEqual(35);

      expect(a.rotation).toBeDefined();
      a.rotation = 30;
      expect(a.rotation).toEqual(30);
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

  describe("Static methods...", function() {
    it("arc can calculate drawing paths", function() {
      var path = mkr.constructs.arc.calculatePath(50, 50, 50, 25, 0, 270, 0);
      expect(path).toEqual('M 0 50 A 50 25 0 1 0 50 25');
    });

  });  
});
