import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearTpIconRegistry,
  getTpIcon,
  hasTpIcon,
  listTpIcons,
} from './icon-registry.js';
import { registerTpIconLibraryFromGlob } from './icon-vite.js';

describe('registerTpIconLibraryFromGlob', () => {
  beforeEach(() => {
    clearTpIconRegistry();
  });

  it('registers icons from raw svg modules', () => {
    registerTpIconLibraryFromGlob('mdi', {
      '/src/icons/mdi/account.svg': '<svg id="account"></svg>',
      '/src/icons/mdi/home.svg': '<svg id="home"></svg>',
    });

    expect(hasTpIcon('account', 'mdi')).toBe(true);
    expect(hasTpIcon('home', 'mdi')).toBe(true);
    expect(getTpIcon('account', 'mdi')).toBe('<svg id="account"></svg>');
  });

  it('supports stripPrefix and stripSuffix', () => {
    registerTpIconLibraryFromGlob(
      'tabler',
      {
        '/src/icons/tabler/arrow-left.svg': '<svg id="left"></svg>',
      },
      {
        stripPrefix: '/src/icons/tabler/',
        stripSuffix: '.svg',
      },
    );

    expect(hasTpIcon('arrow-left', 'tabler')).toBe(true);
  });

  it('supports custom fileNameToIconName', () => {
    registerTpIconLibraryFromGlob(
      'custom',
      {
        '/src/icons/custom/alert-circle.svg': '<svg id="alert"></svg>',
      },
      {
        fileNameToIconName(path) {
          const fileName = path.split('/').pop() ?? path;
          return fileName.replace(/\.svg$/i, '').replace(/-/g, '_');
        },
      },
    );

    expect(hasTpIcon('alert_circle', 'custom')).toBe(true);
  });

  it('lists registered icons', () => {
    registerTpIconLibraryFromGlob('mdi', {
      '/src/icons/mdi/account.svg': '<svg id="account"></svg>',
      '/src/icons/mdi/home.svg': '<svg id="home"></svg>',
    });

    expect(listTpIcons('mdi')).toEqual(['account', 'home']);
  });

  it('supports namePrefix option', () => {
    registerTpIconLibraryFromGlob(
      'flags',
      {
        '/src/icons/flags/cif-fr.svg': '<svg id="fr"></svg>',
        '/src/icons/flags/cif-de.svg': '<svg id="de"></svg>',
      },
      {
        stripPrefix: '/src/icons/flags/',
        stripSuffix: '.svg',
        namePrefix: 'cif-',
      },
    );

    expect(hasTpIcon('fr', 'flags')).toBe(true);
    expect(hasTpIcon('de', 'flags')).toBe(true);
  });

  it('supports namePrefix for languages', () => {
    registerTpIconLibraryFromGlob(
      'languages',
      {
        '/src/icons/languages/file_type_html.svg': '<svg id="html"></svg>',
      },
      {
        stripPrefix: '/src/icons/languages/',
        stripSuffix: '.svg',
        namePrefix: 'file_type_',
      },
    );

    expect(hasTpIcon('html', 'languages')).toBe(true);
  });

  it('supports normalize="none"', () => {
    registerTpIconLibraryFromGlob(
      'languages',
      {
        '/src/icons/languages/file_type_html.svg': '<svg id="html"></svg>',
      },
      {
        stripPrefix: '/src/icons/languages/',
        stripSuffix: '.svg',
        namePrefix: 'file_type_',
        normalize: 'none',
      },
    );

    expect(hasTpIcon('html', 'languages')).toBe(true);
  });

  it('supports normalize="kebab"', () => {
    registerTpIconLibraryFromGlob(
      'custom',
      {
        '/src/icons/custom/file_type_html.svg': '<svg id="html"></svg>',
        '/src/icons/custom/AlertCircle.svg': '<svg id="alert"></svg>',
      },
      {
        stripPrefix: '/src/icons/custom/',
        stripSuffix: '.svg',
        normalize: 'kebab',
      },
    );

    expect(hasTpIcon('file-type-html', 'custom')).toBe(true);
    expect(hasTpIcon('alert-circle', 'custom')).toBe(true);
  });

  it('supports normalize="camel"', () => {
    registerTpIconLibraryFromGlob(
      'custom',
      {
        '/src/icons/custom/file_type_html.svg': '<svg id="html"></svg>',
        '/src/icons/custom/alert-circle.svg': '<svg id="alert"></svg>',
      },
      {
        stripPrefix: '/src/icons/custom/',
        stripSuffix: '.svg',
        normalize: 'camel',
      },
    );

    expect(hasTpIcon('fileTypeHtml', 'custom')).toBe(true);
    expect(hasTpIcon('alertCircle', 'custom')).toBe(true);
  });

  it('does not apply normalize when fileNameToIconName is provided', () => {
    registerTpIconLibraryFromGlob(
      'custom',
      {
        '/src/icons/custom/file_type_html.svg': '<svg id="html"></svg>',
      },
      {
        normalize: 'camel',
        fileNameToIconName() {
          return 'my_html_icon';
        },
      },
    );

    expect(hasTpIcon('my_html_icon', 'custom')).toBe(true);
    expect(hasTpIcon('myHtmlIcon', 'custom')).toBe(false);
  });
});