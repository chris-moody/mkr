describe("drw basics v"+mkr.constructs.drw.VERSION, function() {
  //var m, a;

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
    a = m.construct('drw', {
      x:0, y:0,
      fill:'transparent', stroke:'grey', strokeWidth:10,
    });
  });

  describe("Instantiation", function() {
    it("create a new mkr", function() {
      expect(m.constructor.name).toEqual('mkr');
    });
    it("create a new drw", function() {
      expect(a).toBeDefined();
    });
    it("every new drw has a path element", function() {
      expect(a.el.constructor.name).toEqual('SVGPathElement');
    });

    it("a read-only id", function() {
      expect(a.id).toEqual('drw-0');
      a.id = 'someNewId';
      expect(a.id).toEqual('drw-0');
    });

    it("a read-only reference to its parent", function() {
      expect(a.parent).toBeDefined();
      a.parent = 'someNewId';
      expect(typeof a.parent == 'string').toEqual(false);
    });

    it("a read/write fill, stroke and strokeWidth", function() {
      expect(a.fill).toEqual(a.fill);
      a.fill = 'pink';
      expect(a.fill).toEqual('pink');

      expect(a.stroke).toEqual(a.stroke);
      a.stroke = 'green';
      expect(a.stroke).toEqual('green');

      expect(a.strokeWidth).toBeDefined();
      a.strokeWidth = 2;
      expect(a.strokeWidth).toEqual('2');
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
    it("drw can issue relative commands", function() {
      a.setRelative(true);
      expect(a.relative).toEqual(true);
    });

    it("drw can draw lines", function() {
      a.line(50, 50);
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

    it("vertical lines", function() {
      a.lineV(25);
      expect(a.find('v')[0].groups[0]).toEqual('v');
    });

    it("horizontal lines", function() {
      a.lineH(25);
      expect(a.find('h')[0].groups[0]).toEqual('h');
    });

    it("drw can issue absolute commands", function() {
      a.setRelative(false);
      expect(a.relative).toEqual(false);
    });

    it("drw can move", function() {
      a.move(m.width, 0);
      expect(a.find('M')[0].groups[0]).toEqual('M');
    });

    it("drw can close the path", function() {
      a.close();
      expect(a.find('Z')[0].groups[0]).toEqual('Z');
    });

    it("drw can clear the path", function() {
      a.clear();
      expect(a.d).toEqual('M'+a.x+','+a.y);
    });

    it("drw can make cubic bezier curves...", function() {
      a.curve(a.x, a.y+50, a.x+125, a.y+50, a.x+125, a.y);
      expect(a.find('C')[0].groups[0]).toEqual('C');
    });

    it("...and chain them together with the cubic shortcut", function() {
      a.curve2(a.x+250, a.y+50, a.x+250, a.y);
      expect(a.find('S')[0].groups[0]).toEqual('S');
    });

    it("drw can make quadratic bezier curves...", function() {
      a.move(0, 200).qdrtc(100, 250, 200, 200);
      expect(a.find('Q')[0].groups[0]).toEqual('Q');
    });

    it("...and chain them together with the quadratic shortcut", function() {
      a.qdrtc2(400, 250);
      expect(a.find('T')[0].groups[0]).toEqual('T');
    });

    it("drw can produce circular arcs", function() {
      a.arc(150, 150, 15, 80, 270).close();
      expect(a.find('A')[0].groups[0]).toEqual('A');
    });

    it("and elliptical arcs", function() {
      a.arc2(25, 150, 25, 10, 40, 180).close();
      expect(a.find('A')[0].groups[0]).toEqual('A');
    });

    it("drw can produce circles", function() {
      a.circle(100, 100, 30, 80, 180).close();
      expect(a.find('A')[0].groups[0]).toEqual('A');
    });

    it("and ellipses", function() {
      a.ellipse(50, 100, 35, 10, 80, 360).close();
      expect(a.find('A')[0].groups[0]).toEqual('A');
    });

    it("drw can produce polygons", function() {
      a.polygon(300, 0, 30, 6).close();
      expect(a.find('L')[0].groups[0]).toEqual('L');
    });

    it("and triangles", function() {
      a.triangle(300, 50, 30).close();
      expect(a.find('L')[0].groups[0]).toEqual('L');
    });

    it("and squares", function() {
      a.square(300, 100, 30).close();
      expect(a.find('L')[0].groups[0]).toEqual('L');
    });

    it("and stars", function() {
      a.star(300, 150, 30, 10).close();
      expect(a.find('L')[0].groups[0]).toEqual('L');
    });

    it("and rects", function() {
      a.rect(350, 0, 60, 30).close();
      expect(a.find('L')[0].groups[0]).toEqual('L');
    });


    it("drw can produce polygons, relatively", function() {
      a.relative = true;
      a.polygon(30, 80, 30, 6).close();
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

    it("and triangles", function() {
      a.triangle(0, 30, 30).close();
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

    it("and squares", function() {
      a.square(0, 30, 30, 45).close();
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

    it("and stars", function() {
      a.star(0, 30, 30, 45).close();
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

    it("and rects", function() {
      a.rect(0, 30, 60, 30).close();
      expect(a.find('l')[0].groups[0]).toEqual('l');
    });

  });
  /*describe("Static methods...", function() {
    it("drw can calculate drawing paths", function() {
      var path = mkr.constructs.drw.calculatePath(50, 50, 25, 0, 270, 0);
      expect(path).toEqual('M 25 50 A 25 25 0 1 0 50 25');
    });

  }); */ 
});
