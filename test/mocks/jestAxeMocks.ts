import {
  CatalogItemProps,
  CatalogsByQueryOutput,
  HspDescription,
  HspDigitized,
  HspObject,
  HspObjectByIdOutput,
  HspObjectsByQueryOutput,
} from 'src/contexts/discovery'

export const cmsMock = {
  page: {
    id: 123,
    title: { rendered: 'test' },
    content: {
      rendered: 'test wp content',
    },
  },
}
export const homeMock = {
  imageSets: [{ url: 'www.example.com', ident: 'exampleImg', info: 'infoImg' }],
}
export const mockProjects = {
  id: 'testProject',
  descriptionShort: 'short description',
  start: '5.5.10',
  end: '10.5.10',
  description: 'descirption',
  publications: '1. pub, 2.pub',
  links: 'www.example.com',
  contact: 'Max Mustermann',
  involved: 'Max',
  involvedInstitutions: 'Ubl',
  support: 'SBB',
  projectName: 'example project',
  projectTitle: 'title',
  thumbnail: 'thumbnail',
  thumbnailInfo: 'thumbnailInfo',
  image1: 'www.image1.de',
  image1Info: 'image1Info',
}

export const digitizedMock: HspDigitized = {
  'digitization-institution-display': 'Bayerische Staatsbibliothek',
  'digitization-settlement-display': 'München',
  'external-uri-display':
    'https://mdz-nbn-resolving.de/urn:nbn:de:bvb:12-bsb00064446-8',
  'group-id': 'HSP-9cb64681-390e-3009-9661-e6cd1a3217d8',
  'issuing-date-display': '2024-05-27T22:00:00.000+00:00',
  'manifest-uri-display':
    'https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00064446/manifest',
  'thumbnail-uri-display':
    'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00064446_00003/full/280,/0/default.jpg',
  'digitization-date-display': '1',
  'subtype-display': '1',
  type: 'hsp:digitized',
  id: '1',
}
const hspMockObject: HspObject = {
  'dimensions-display': ['16 × 12'],
  'group-id': 'HSP-80bc8441-48e3-33fa-abc3-ad30582fdeac',
  id: 'HSP-80bc8441-48e3-33fa-abc3-ad30582fdeac',
  'idno-display': 'Cgm 5250(7 a',
  'leaves-count-display': '4 Bl.',
  'material-display': ['Pergament'],
  'object-type-display': 'fragment',
  'orig-date-lang-display': ['13. Jh., 4. Viertel'],
  'orig-place-display': ['mitteldeutsches Sprachgebiet'],
  'persistent-url-display':
    'https://resolver.staatsbibliothek-berlin.de/HSP0004456100000000',
  'repository-display': 'Bayerische Staatsbibliothek',
  'settlement-display': 'München',
  'title-display': 'Psalter',
  type: 'hsp:object',
  'former-ms-identifier-display': ['ubl'],
  'settlement-authority-file-display': ['Norm-123'],
  'orig-place-authority-file-display': ['Norm-456'],
  'repository-authority-file-display': ['NORM-Repro'],
  'format-display': null,
  'has-notation-display': '',
  'illuminated-display': '',
  'language-display': [''],
  'status-display': '',
}
export const descriptionMock: HspDescription = {
  'author-display': ['Karin Schneider'],
  'catalog-id-display': 'HSP-bf97f246-95f2-3fac-860b-c44b4e97acc1',
  'catalog-iiif-manifest-range-url-display':
    'https://iiif.ub.uni-leipzig.de/0000034625/range/LOG_0085',
  'catalog-iiif-manifest-url-display':
    'https://iiif.ub.uni-leipzig.de/0000034625/manifest.json',
  'dimensions-display': ['21 × 15'],
  'format-display': ['quarto,octavo'],
  'group-id': 'HSP-9cb64681-390e-3009-9661-e6cd1a3217d8',
  'has-notation-display': 'yes',
  id: 'HSP-c824c1c2-e2f0-3535-92a0-5ea37c5224b9',
  'idno-display': 'Cgm 765',
  'language-display': ['de'],
  'leaves-count-display': '251 Bl.',
  'material-display': ['Papier'],
  'object-type-display': 'codex',
  'orig-date-lang-display': ['1441'],
  'orig-place-display': ['Bayern'],
  'persistent-url-display':
    'https://resolver.staatsbibliothek-berlin.de/HSP000587DD00000000',
  'publish-year-display': 1984,
  'repository-display': 'Bayerische Staatsbibliothek',
  'settlement-display': 'München',
  'status-display': 'existent',
  'title-display':
    'Heinrich von Langenstein: Erkanntnus der Sünd · Seuse: Büchlein der ewigen Weisheit · Exempel aus Vitas patrum',
  type: 'hsp:description_retro',
  'illuminated-display': '123',
}

export const mockHspObjectsByQuery: HspObjectsByQueryOutput = {
  metadata: {
    facets: {
      'desc-status-facet': {
        __MISSING__: 1,
        extern: 277,
      },
      'described-object-facet': {
        false: 0,
        true: 278,
      },
      'digitized-iiif-object-facet': {
        false: 218,
        true: 60,
      },
      'digitized-object-facet': {
        false: 202,
        true: 76,
      },
      'format-facet': {
        __MISSING__: 68,
        folio: 83,
        'larger than folio': 2,
        'long and narrow': 1,
        oblong: 1,
        octavo: 73,
        other: 0,
        quarto: 111,
        'smaller than octavo': 11,
        square: 0,
      },
      'has-notation-facet': {
        __MISSING__: 260,
        yes: 18,
      },
      'holding-institution-facet': {
        'Abtei Lichtenthal (Baden-Baden)': 0,
        Adelhausenstiftung: 0,
        'Archives nationales de Luxembourg': 0,
        __MISSING__: 278,
      },
      'illuminated-facet': {
        __MISSING__: 217,
        yes: 61,
      },
      'language-facet': {
        __MISSING__: 75,
        ar: 1,
      },
      'material-facet': {
        __MISSING__: 12,
        other: 1,
        paper: 183,
        papyrus: 0,
        parchment: 94,
      },
      'object-type-facet': {
        __MISSING__: 45,
        codex: 161,
        collection: 4,
      },
      'orig-date-type-facet': {
        __MISSING__: 7,
        dated: 77,
      },
      'orig-place-facet': {
        '(Passau': 0,
        Indersdorf: 0,
        'Indersdorf (Petersdorf, Aichach-Friedberg)': 0,

        Vechelde: 0,
        Venedig: 0,
        Venetien: 0,
        Veneto: 0,

        'Świny (Woiwodschaft Niederschlesien)': 0,
        Żagań: 0,
      },
      'repository-facet': {
        'Abtei Lichtenthal (Baden-Baden)': 0,
        'Übersee-Museum Bremen': 0,
      },
      'settlement-facet': {
        Aachen: 1,
        Amberg: 0,
        Zwickau: 1,
      },
      'status-facet': {
        __MISSING__: 140,
        destroyed: 0,
      },
      'type-facet': {
        'hsp:description': 104,
        'hsp:description_retro': 173,
        'hsp:object': 1,
      },
    },
    highlighting: {
      'HSP-0bbad0fc-89fd-3458-9868-b4022022a6e0': {
        'fulltext-search': [
          'Cod. bibl. 2° 90 MXML-31907119 Handschriftenportal Kulturobjektdokument-ID HSP-ad0b6421-4612-3610-9<em>abc</em>-9796d3217ee4 Polyglotte Bibelausgabe Papier • 18 Jh 2 308 Bl; neuere Foliierung 1-308 • 47,5 x 30',
        ],
        'idno-alternative-search': [
          'HSP-ad0b6421-4612-3610-9<em>abc</em>-9796d3217ee4',
        ],
      },
      'HSP-fc5131b3-3978-3abc-abc7-520910083331': {},
    },
    numFound: 278,
    rows: 10,
    start: 0,
    stats: {},
  },
  payload: [
    {
      hspDescriptions: [descriptionMock],
      hspDigitizeds: [],
      hspObject: hspMockObject,
    },
  ],
}

export const mockHspObjectsById: HspObjectByIdOutput = {
  payload: {
    hspDescriptions: [],
    hspDigitizeds: [],
    hspObject: hspMockObject,
  },
}

export const authFileMock = {
  preferredName: 'Leipzig',
  variantName: ['Leipzig', 'Lipzia'],
  typeName: 'Place',
  identifier: null,
  id: 'Norm-id',
  gndId: 'Gnd-d',
}

const catalogMock: CatalogItemProps = {
  id: 'HSP-01161aaa-0b6d-3345-9d8f-e4e481144d84',
  type: 'hsp:catalog',
  'author-display': ['Regina Hausmann'],
  'publisher-display': ['Otto Harrassowitz GmbH & Co. KG'],
  'publish-year-display': 1992,
  'title-display':
    'Die theologischen Handschriften der Hessischen Landesbibliothek Fulda bis zum Jahr 1600. Codices Bonifatiani 1-3. Aa 1-145a',
  'thumbnail-uri-display': 'www.thumbnail.uri',
  'manifest-uri-display': 'www.iiifmanifest.json',
}

export const catalogsMock: CatalogsByQueryOutput = {
  payload: [catalogMock],
  metadata: {
    numFound: 143,
    rows: 10,
    start: 0,
  },
}
