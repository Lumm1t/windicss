import { FontSize } from "../../dist/types/interfaces";
import { Property, Style } from "../../src/utils/style";
import { Processor } from "../../src/lib";

const processor = new Processor();

describe("Plugin Method", () => {
  it("addUtilities", () => {
    const newUtilities = {
      '.skew-10deg': {
        transform: 'skewY(-10deg)',
      },
      '.skew-15deg': {
        transform: 'skewY(-15deg)',
      },
    }
    expect(processor.addUtilities(newUtilities).map(i=>i.build()).join('\n')).toBe('.skew-10deg {\n  transform: skewY(-10deg);\n}\n.skew-15deg {\n  transform: skewY(-15deg);\n}');
  })

  it("addComponents", () => {
    const buttons = {
      '.btn': {
        padding: '.5rem 1rem',
        borderRadius: '.25rem',
        fontWeight: '600',
      },
      '.btn-blue': {
        backgroundColor: '#3490dc',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2779bd'
        },
      },
      '.btn-red': {
        backgroundColor: '#e3342f',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#cc1f1a'
        },
      },
    }

    expect(processor.addComponents(buttons).map(i=>i.build()).join('\n')).toBe(".btn {\n  padding: .5rem 1rem;\n  border-radius: .25rem;\n  font-weight: 600;\n}\n.btn-blue {\n  background-color: #3490dc;\n  color: #fff;\n}\n.btn-blue:hover {\n  background-color: #2779bd;\n}\n.btn-red {\n  background-color: #e3342f;\n  color: #fff;\n}\n.btn-red:hover {\n  background-color: #cc1f1a;\n}");
  })

  it("addBase", () => {
    expect(processor.addBase({
      'h1': { fontSize: (processor.theme('fontSize.2xl') as FontSize)[0] ?? '1.5rem' },
      'h2': { fontSize: (processor.theme('fontSize.xl') as FontSize)[0] ?? '1.25rem' },
      'h3': { fontSize: (processor.theme('fontSize.lg') as FontSize)[0] ?? '1.125rem' },
    }).map(i=>i.build()).join('\n')).toBe('h1 {\n  font-size: 1.5rem;\n}\nh2 {\n  font-size: 1.25rem;\n}\nh3 {\n  font-size: 1.125rem;\n}');
  })

  it("addVariant pseudoClass", () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('disable', ({ pseudoClass }) => {
      return pseudoClass('disabled');
    });
    expect(Array.isArray(style) || style.extend(test).build()).toBe('.float-right:disabled {\n  float: right;\n}');
    expect(processor.interpret("disable:float-right").styleSheet.build()).toBe('.disable\\:float-right:disabled {\n  float: right;\n}')
  })

  it("addVariant modifySelectors", () => {
    const test = new Style('.float-right', new Property('float', 'right'));
    const style = processor.addVariant('disabled', ({ modifySelectors, separator }) => {
      return modifySelectors(({className}) => {
        return `.${processor.e(`disabled${separator}${className}`)}:disabled`;
      });
    });
    expect(Array.isArray(style) || style.extend(test).build()).toBe('.disabled\\:float-right:disabled {\n  float: right;\n}');
  })
})
