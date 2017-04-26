describe("mkr elements", function() {
  var m;// = new mkr({css:{width:300, height:300}});

  beforeAll(function() {
    m = new mkr({css:{width:300, height:300, x:300, position:'relative'}});
  });

  describe('Supports creation of standard HTML elements', function() {
    it("create an anchor tag", function() {
      expect(m.create('a').constructor.name).toEqual('HTMLAnchorElement');
    });
    it("create a div", function() {
      expect(m.create('div').constructor.name).toEqual('HTMLDivElement');
    });
    it("create a heading", function() {
      expect(m.create('h1').constructor.name).toEqual('HTMLHeadingElement');
    });
    it("create an hr", function() {
      expect(m.create('hr').constructor.name).toEqual('HTMLHRElement');
    });
    it("create a list item", function() {
      expect(m.create('li').constructor.name).toEqual('HTMLLIElement');
    });
    it("create an ordered list", function() {
      expect(m.create('ol').constructor.name).toEqual('HTMLOListElement');
    });
    it("create a p", function() {
      expect(m.create('p').constructor.name).toEqual('HTMLParagraphElement');
    });
    it("create a pre", function() {
      expect(m.create('pre').constructor.name).toEqual('HTMLPreElement');
    });
    it("create a span", function() {
      expect(m.create('span').constructor.name).toEqual('HTMLSpanElement');
    });
    it("create an unordered list", function() {
      expect(m.create('ul').constructor.name).toEqual('HTMLUListElement');
    });
    
  });

  describe('Supports creation of demarcating elements', function() {
    it("create a del", function() {
      expect(m.create('del').constructor.name).toEqual('HTMLModElement');
    });
    it("create a ins", function() {
      expect(m.create('ins').constructor.name).toEqual('HTMLModElement');
    });
  });

  describe('Supports creation of content sectioning elements', function() {
    it("create an address", function() {
      expect(m.create('address').constructor.name).toEqual('HTMLElement');
    });
    it("create an article", function() {
      expect(m.create('article').constructor.name).toEqual('HTMLElement');
    });
    it("create an aside", function() {
      expect(m.create('aside').constructor.name).toEqual('HTMLElement');
    });
    it("create a footer", function() {
      expect(m.create('footer').constructor.name).toEqual('HTMLElement');
    });
    it("create a header", function() {
      expect(m.create('header').constructor.name).toEqual('HTMLElement');
    });
    it("create a hgroup", function() {
      expect(m.create('hgroup').constructor.name).toEqual('HTMLElement');
    });
    it("create a nav", function() {
      expect(m.create('nav').constructor.name).toEqual('HTMLElement');
    });
    it("create a section", function() {
      expect(m.create('section').constructor.name).toEqual('HTMLElement');
    });
  });

  describe('Supports creation of form elements', function() {
    it("create a button", function() {
      expect(m.create('button').constructor.name).toEqual('HTMLButtonElement');
    });
    it("create a datalist", function() {
      expect(m.create('datalist').constructor.name).toEqual('HTMLDataListElement');
    });
    it("create a fieldset", function() {
      expect(m.create('fieldset').constructor.name).toEqual('HTMLFieldSetElement');
    });
    it("create a form", function() {
      expect(m.create('form').constructor.name).toEqual('HTMLFormElement');
    });
    it("create an input", function() {
      expect(m.create('input').constructor.name).toEqual('HTMLInputElement');
    });
    it("create an label", function() {
      expect(m.create('label').constructor.name).toEqual('HTMLLabelElement');
    });
    it("create an legend", function() {
      expect(m.create('legend').constructor.name).toEqual('HTMLLegendElement');
    });
    it("create an meter", function() {
      expect(m.create('meter').constructor.name).toEqual('HTMLMeterElement');
    });
    it("create an optgroup", function() {
      expect(m.create('optgroup').constructor.name).toEqual('HTMLOptGroupElement');
    });
    it("create an option", function() {
      expect(m.create('option').constructor.name).toEqual('HTMLOptionElement');
    });
    it("create an output", function() {
      expect(m.create('output').constructor.name).toEqual('HTMLOutputElement');
    });
    it("create an progress", function() {
      expect(m.create('progress').constructor.name).toEqual('HTMLProgressElement');
    });
    it("create an select", function() {
      expect(m.create('select').constructor.name).toEqual('HTMLSelectElement');
    });

    it("create a textarea", function() {
      expect(m.create('textarea').constructor.name).toEqual('HTMLTextAreaElement');
    });
  });
  
  describe('Supports creation of table elements', function() {
    it("create a caption", function() {
      expect(m.create('caption').constructor.name).toEqual('HTMLTableCaptionElement');
    });
    it("create a col", function() {
      expect(m.create('col').constructor.name).toEqual('HTMLTableColElement');
    });
    it("create a colgroup", function() {
      expect(m.create('colgroup').constructor.name).toEqual('HTMLTableColElement');
    });
    it("create a table", function() {
      expect(m.create('table').constructor.name).toEqual('HTMLTableElement');
    });
    it("create an tbody", function() {
      expect(m.create('tbody').constructor.name).toEqual('HTMLTableSectionElement');
    });
    it("create an td", function() {
      expect(m.create('td').constructor.name).toEqual('HTMLTableCellElement');
    });
    it("create an tfoot", function() {
      expect(m.create('tfoot').constructor.name).toEqual('HTMLTableSectionElement');
    });
    it("create an th", function() {
      expect(m.create('th').constructor.name).toEqual('HTMLTableCellElement');
    });
    it("create an thead", function() {
      expect(m.create('thead').constructor.name).toEqual('HTMLTableSectionElement');
    });
    it("create an tr", function() {
      expect(m.create('tr').constructor.name).toEqual('HTMLTableRowElement');
    });
  });

  describe('Supports creation of metadata and scripting elements', function() {
    it("create a title", function() {
      expect(m.create('title').constructor.name).toEqual('HTMLTitleElement');
    });
    it("create a base", function() {
      expect(m.create('base').constructor.name).toEqual('HTMLBaseElement');
    });
    it("create a meta", function() {
      expect(m.create('meta').constructor.name).toEqual('HTMLMetaElement');
    });
    it("create a script", function() {
      expect(m.create('script').constructor.name).toEqual('HTMLScriptElement');
    });
    it("create a noscript", function() {
      expect(m.create('noscript').constructor.name).toEqual('HTMLElement');
    });
    it("create a link", function() {
      expect(m.create('link').constructor.name).toEqual('HTMLLinkElement');
    });
    it("create a style", function() {
      expect(m.create('style').constructor.name).toEqual('HTMLStyleElement');
    });
  });

  describe('Supports creation of SVG elements', function() {
    it("create an svg", function() {
      expect(m.create('svg').constructor.name).toEqual('SVGSVGElement');
    });
  });

  describe('Supports creation of canvas elements', function() {
    it("create a canvas", function() {
      expect(m.create('canvas').constructor.name).toEqual('HTMLCanvasElement');
    });
  });

  describe('Supports creation of HTML media elements', function() {
    it("create an area", function() {
      expect(m.create('area').constructor.name).toEqual('HTMLAreaElement');
    });

    it("create an audio tag", function() {
      expect(m.create('audio').constructor.name).toEqual('HTMLAudioElement');
    });

    it("create an img", function() {
      expect(m.create('img').constructor.name).toEqual('HTMLImageElement');
    });

    it("create an map", function() {
      expect(m.create('map').constructor.name).toEqual('HTMLMapElement');
    });
    it("create an track", function() {
      expect(m.create('track').constructor.name).toEqual('HTMLTrackElement');
    });

    it("create a video", function() {
      expect(m.create('video').constructor.name).toEqual('HTMLVideoElement');
    });
  });

  describe('Supports creation of interactive HTML elements', function() {
    it("create a details", function() {
      expect(m.create('details').constructor.name).toEqual('HTMLDetailsElement');
    });

    it("create a dialog", function() {
      expect(m.create('dialog').constructor.name).toEqual('HTMLDialogElement');
    });

    it("create a menu", function() {
      expect(m.create('menu').constructor.name).toEqual('HTMLMenuElement');
    });

    /*it("create a menuitem", function() {
      expect(m.create('menuitem').constructor.name).toEqual('HTMLMenuItemElement');
    });*/
    it("create a summary", function() {
      expect(m.create('summary').constructor.name).toEqual('HTMLElement');
    });
  });

  describe('Supports creation of web components', function() {
    it("create a slot", function() {
      expect(m.create('slot').constructor.name).toEqual('HTMLSlotElement');
    });
    it("create a template", function() {
      expect(m.create('template').constructor.name).toEqual('HTMLTemplateElement');
    });
  });

});
