import type {
  GutenbergBlock,
  WtnResolvedAuthor,
  WtnResolvedCategory,
  WtnResolvedEditorialPost,
  WtnResolvedImage,
} from '@/lib/gutenberg';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type TreeBlockOfKind<TKind extends GutenbergTreeBlock['kind']> = Extract<
  GutenbergTreeBlock,
  { kind: TKind }
>;

function blockBase<TKind extends GutenbergTreeBlock['kind']>(
  kind: TKind,
  name: string,
  typename: string,
  id: string,
): {
  kind: TKind;
  __typename: string;
  name: string;
  clientId: string;
  parentClientId: null;
  children: GutenbergTreeBlock[];
} {
  return {
    kind,
    __typename: typename,
    name,
    clientId: `gallery-${id}`,
    parentClientId: null,
    children: [],
  };
}

const landscapeImage: WtnResolvedImage = {
  databaseId: null,
  sourceUrl: '/window.svg',
  altText: 'Ilustração neutra para visualizar a área de mídia',
  width: 1200,
  height: 675,
};

const alternateImage: WtnResolvedImage = {
  databaseId: null,
  sourceUrl: '/next.svg',
  altText: 'Ilustração neutra alternativa para cards editoriais',
  width: 900,
  height: 506,
};

const avatarImage: WtnResolvedImage = {
  databaseId: null,
  sourceUrl: '/globe.svg',
  altText: '',
  width: 96,
  height: 96,
};

const politicsCategory: WtnResolvedCategory = {
  databaseId: 10,
  name: 'Política',
  uri: '/categoria/politica/',
};

const societyCategory: WtnResolvedCategory = {
  databaseId: 11,
  name: 'Sociedade',
  uri: '/categoria/sociedade/',
};

const noLinkCategory: WtnResolvedCategory = {
  databaseId: 12,
  name: 'Especial',
  uri: null,
};

const featuredPost: WtnResolvedEditorialPost = {
  databaseId: 101,
  uri: '/materias/destaque-editorial/',
  title: 'Congresso aprova novas medidas para ampliar a transparência pública',
  excerpt:
    'A proposta reorganiza mecanismos de acesso à informação e cria novas exigências de publicidade para órgãos federais.',
  publishedAt: '2026-09-08T13:10:00Z',
  readingTimeMinutes: 6,
  image: landscapeImage,
  category: politicsCategory,
};

const secondaryPost: WtnResolvedEditorialPost = {
  databaseId: 102,
  uri: '/materias/cidades-ampliam-programas-digitais/',
  title: 'Cidades ampliam programas digitais de atendimento à população',
  excerpt:
    'Prefeituras testam novos canais de atendimento e integração de serviços públicos.',
  publishedAt: '2026-09-08T11:30:00Z',
  readingTimeMinutes: 4,
  image: alternateImage,
  category: societyCategory,
};

const tertiaryPost: WtnResolvedEditorialPost = {
  databaseId: 103,
  uri: '/materias/pesquisa-mapeia-novos-habitos/',
  title: 'Pesquisa mapeia novos hábitos de consumo de notícias no país',
  excerpt: null,
  publishedAt: '2026-09-08T09:05:00Z',
  readingTimeMinutes: 3,
  image: null,
  category: noLinkCategory,
};

const featuredPostWithoutImage: WtnResolvedEditorialPost = {
  ...featuredPost,
  databaseId: 104,
  uri: '/materias/destaque-sem-imagem/',
  title: 'Destaque editorial sem imagem mantém toda a largura disponível',
  image: null,
};

const secondaryPostWithoutImage: WtnResolvedEditorialPost = {
  ...secondaryPost,
  databaseId: 105,
  uri: '/materias/card-secundario-sem-imagem/',
  title: 'Card secundário sem mídia preserva a hierarquia de conteúdo',
  image: null,
};

const authors: WtnResolvedAuthor[] = [
  {
    databaseId: 201,
    uri: '/autor/maria-silva/',
    displayName: 'Maria Silva',
    editorialRole: 'Editora de Política',
    publishedPostCount: 18,
    avatar: avatarImage,
  },
  {
    databaseId: 202,
    uri: '/autor/joao-costa/',
    displayName: 'João Costa',
    editorialRole: 'Repórter',
    publishedPostCount: 7,
    avatar: null,
  },
  {
    databaseId: 203,
    uri: '/autor/ana-lima/',
    displayName: 'Ana Lima',
    editorialRole: null,
    publishedPostCount: 1,
    avatar: avatarImage,
  },
];

export const coreFixtures = {
  groupSection: {
    ...blockBase('core/group', 'core/group', 'CoreGroup', 'group-section'),
    tagName: 'section',
  } satisfies TreeBlockOfKind<'core/group'>,

  groupFallback: {
    ...blockBase('core/group', 'core/group', 'CoreGroup', 'group-fallback'),
    tagName: 'custom-element',
  } satisfies TreeBlockOfKind<'core/group'>,

  columns: {
    ...blockBase('core/columns', 'core/columns', 'CoreColumns', 'columns'),
  } satisfies TreeBlockOfKind<'core/columns'>,

  columnWide: {
    ...blockBase('core/column', 'core/column', 'CoreColumn', 'column-wide'),
    width: '75%',
  } satisfies TreeBlockOfKind<'core/column'>,

  columnNarrow: {
    ...blockBase('core/column', 'core/column', 'CoreColumn', 'column-narrow'),
    width: '25%',
  } satisfies TreeBlockOfKind<'core/column'>,

  paragraph: {
    ...blockBase(
      'core/paragraph',
      'core/paragraph',
      'CoreParagraph',
      'paragraph',
    ),
    content:
      'Parágrafo com <strong>ênfase editorial</strong>, <em>itálico</em> e <a href="/">link inline</a>.',
  } satisfies TreeBlockOfKind<'core/paragraph'>,

  image: {
    ...blockBase('core/image', 'core/image', 'CoreImage', 'image'),
    databaseId: null,
    sourceUrl: '/window.svg',
    altText: 'Ilustração neutra do Core Image',
    width: '1200',
    height: '675',
    caption: 'Legenda com <strong>RichText</strong> preservado.',
    href: '/materias/destaque-editorial/',
    linkTarget: null,
    rel: null,
    title: 'Core Image da galeria',
  } satisfies TreeBlockOfKind<'core/image'>,

  quoteParagraph: {
    ...blockBase(
      'core/paragraph',
      'core/paragraph',
      'CoreParagraph',
      'quote-paragraph',
    ),
    content:
      '“A visualização ajuda a validar a estrutura antes de cristalizar o renderer.”',
  } satisfies TreeBlockOfKind<'core/paragraph'>,

  quoteLegacy: {
    ...blockBase('core/quote', 'core/quote', 'CoreQuote', 'quote-legacy'),
    value:
      '<p>“Conteúdo histórico preservado sem reconstruir blocos inexistentes.”</p>',
    citation: 'Arquivo editorial',
  } satisfies TreeBlockOfKind<'core/quote'>,

  listItemA: {
    ...blockBase('core/list-item', 'core/list-item', 'CoreListItem', 'list-a'),
    content: 'Primeiro item com <strong>RichText</strong>',
  } satisfies TreeBlockOfKind<'core/list-item'>,

  listItemB: {
    ...blockBase('core/list-item', 'core/list-item', 'CoreListItem', 'list-b'),
    content: 'Segundo item editorial',
  } satisfies TreeBlockOfKind<'core/list-item'>,

  nestedListItem: {
    ...blockBase(
      'core/list-item',
      'core/list-item',
      'CoreListItem',
      'nested-child',
    ),
    content: 'Item aninhado',
  } satisfies TreeBlockOfKind<'core/list-item'>,

  buttonAnchor: {
    ...blockBase('core/button', 'core/button', 'CoreButton', 'button-anchor'),
    text: 'Leia <strong>agora</strong>',
    url: '/materias/destaque-editorial/',
    linkTarget: null,
    rel: null,
    tagName: 'a',
    buttonType: 'button',
    title: null,
  } satisfies TreeBlockOfKind<'core/button'>,

  buttonElement: {
    ...blockBase('core/button', 'core/button', 'CoreButton', 'button-element'),
    text: 'Ação de exemplo',
    url: null,
    linkTarget: null,
    rel: null,
    tagName: 'button',
    buttonType: 'button',
    title: 'Botão sem comportamento client-side',
  } satisfies TreeBlockOfKind<'core/button'>,

  buttons: {
    ...blockBase('core/buttons', 'core/buttons', 'CoreButtons', 'buttons'),
  } satisfies TreeBlockOfKind<'core/buttons'>,

  separator: {
    ...blockBase(
      'core/separator',
      'core/separator',
      'CoreSeparator',
      'separator',
    ),
  } satisfies TreeBlockOfKind<'core/separator'>,
};

export const unknownCompatibilityFixture = {
  ...blockBase(
    'unknown',
    'core/table',
    'CoreTable',
    'unknown-compatibility-table',
  ),
  renderedHtml: `
    <p><strong>Boundary HTML:</strong> este conteúdo foi renderizado pelo CMS como compatibilidade.</p>
    <table>
      <thead><tr><th>Coluna A</th><th>Coluna B</th></tr></thead>
      <tbody><tr><td>Valor 1</td><td>Valor 2</td></tr></tbody>
    </table>
  `,
  children: [
    {
      ...coreFixtures.paragraph,
      clientId: 'gallery-unknown-compatibility-child',
      parentClientId: 'gallery-unknown-compatibility-table',
      content:
        'ESTE CHILD REACT NÃO DEVE APARECER: a boundary renderedHtml é opaca.',
    },
  ],
} satisfies TreeBlockOfKind<'unknown'>;

export const headingFixtures = [1, 2, 3, 4, 5, 6].map((level) => ({
  ...blockBase(
    'core/heading',
    'core/heading',
    'CoreHeading',
    `heading-${level}`,
  ),
  content: `Heading Core nível ${level}`,
  level: level as 1 | 2 | 3 | 4 | 5 | 6,
})) satisfies Array<TreeBlockOfKind<'core/heading'>>;

export const modernListFixture = {
  ...blockBase('core/list', 'core/list', 'CoreList', 'list-modern'),
  ordered: false,
  reversed: null,
  start: null,
  values: '<li>Fallback que não deve aparecer</li>',
  children: [coreFixtures.listItemA, coreFixtures.listItemB],
} satisfies TreeBlockOfKind<'core/list'>;

export const orderedLegacyListFixture = {
  ...blockBase('core/list', 'core/list', 'CoreList', 'list-legacy'),
  ordered: true,
  reversed: true,
  start: 3,
  values: '<li>Terceiro</li><li>Segundo</li><li>Primeiro</li>',
} satisfies TreeBlockOfKind<'core/list'>;

export const nestedListFixture = {
  ...blockBase('core/list', 'core/list', 'CoreList', 'nested-list'),
  ordered: false,
  reversed: null,
  start: null,
  values: '',
  children: [coreFixtures.nestedListItem],
} satisfies TreeBlockOfKind<'core/list'>;

export const nestedParentListItemFixture = {
  ...blockBase(
    'core/list-item',
    'core/list-item',
    'CoreListItem',
    'nested-parent',
  ),
  content: 'Item pai com <strong>sublista</strong>',
  children: [nestedListFixture],
} satisfies TreeBlockOfKind<'core/list-item'>;

export const modernQuoteFixture = {
  ...blockBase('core/quote', 'core/quote', 'CoreQuote', 'quote-modern'),
  value: '<p>Fallback que não deve aparecer</p>',
  citation: 'Equipe de Produto',
  children: [coreFixtures.quoteParagraph],
} satisfies TreeBlockOfKind<'core/quote'>;

export const wtnFixtures = {
  heroLeft: {
    ...blockBase(
      'wtn-blocks/editorial-hero',
      'wtn-blocks/editorial-hero',
      'WtnBlocksEditorialHero',
      'hero-left',
    ),
    resolved: {
      mediaPosition: 'left',
      prioritizeImage: true,
      post: featuredPost,
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/editorial-hero'>,

  heroRight: {
    ...blockBase(
      'wtn-blocks/editorial-hero',
      'wtn-blocks/editorial-hero',
      'WtnBlocksEditorialHero',
      'hero-right',
    ),
    resolved: {
      mediaPosition: 'right',
      prioritizeImage: false,
      post: featuredPost,
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/editorial-hero'>,

  heroNoImage: {
    ...blockBase(
      'wtn-blocks/editorial-hero',
      'wtn-blocks/editorial-hero',
      'WtnBlocksEditorialHero',
      'hero-no-image',
    ),
    resolved: {
      mediaPosition: 'left',
      prioritizeImage: false,
      post: { ...featuredPost, image: null },
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/editorial-hero'>,

  breaking: {
    ...blockBase(
      'wtn-blocks/breaking-news',
      'wtn-blocks/breaking-news',
      'WtnBlocksBreakingNews',
      'breaking',
    ),
    resolved: {
      label: 'Última hora',
      post: secondaryPost,
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/breaking-news'>,

  newsSection: {
    ...blockBase(
      'wtn-blocks/news-section',
      'wtn-blocks/news-section',
      'WtnBlocksNewsSection',
      'news-section',
    ),
    resolved: {
      layoutVariant: 'default',
      prioritizeImage: true,
      title: 'Política',
      viewAllLabel: 'Ver mais de Política',
      viewAllUrl: '/categoria/politica/',
      featuredPost,
      secondaryPosts: [secondaryPost, null, tertiaryPost],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/news-section'>,

  newsSectionNoTitle: {
    ...blockBase(
      'wtn-blocks/news-section',
      'wtn-blocks/news-section',
      'WtnBlocksNewsSection',
      'news-section-no-title',
    ),
    resolved: {
      layoutVariant: 'compact',
      prioritizeImage: false,
      title: null,
      viewAllLabel: null,
      viewAllUrl: null,
      featuredPost: secondaryPost,
      secondaryPosts: [tertiaryPost],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/news-section'>,

  newsSectionNoImages: {
    ...blockBase(
      'wtn-blocks/news-section',
      'wtn-blocks/news-section',
      'WtnBlocksNewsSection',
      'news-section-no-images',
    ),
    resolved: {
      layoutVariant: 'default',
      prioritizeImage: false,
      title: 'Sem mídia',
      viewAllLabel: null,
      viewAllUrl: null,
      featuredPost: featuredPostWithoutImage,
      secondaryPosts: [secondaryPostWithoutImage, tertiaryPost],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/news-section'>,

  latestHorizontal: {
    ...blockBase(
      'wtn-blocks/latest-news',
      'wtn-blocks/latest-news',
      'WtnBlocksLatestNews',
      'latest-horizontal',
    ),
    resolved: {
      layoutVariant: 'horizontal',
      title: 'Últimas notícias',
      viewAllUrl: '/noticias/',
      posts: [featuredPost, secondaryPost, null, tertiaryPost],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/latest-news'>,

  latestVertical: {
    ...blockBase(
      'wtn-blocks/latest-news',
      'wtn-blocks/latest-news',
      'WtnBlocksLatestNews',
      'latest-vertical',
    ),
    resolved: {
      layoutVariant: 'vertical',
      title: 'Mais recentes',
      viewAllUrl: null,
      posts: [secondaryPost, tertiaryPost],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/latest-news'>,

  latestHorizontalNoImages: {
    ...blockBase(
      'wtn-blocks/latest-news',
      'wtn-blocks/latest-news',
      'WtnBlocksLatestNews',
      'latest-horizontal-no-images',
    ),
    resolved: {
      layoutVariant: 'horizontal',
      title: 'Últimas sem mídia',
      viewAllUrl: null,
      posts: [featuredPostWithoutImage, secondaryPostWithoutImage],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/latest-news'>,

  authors: {
    ...blockBase(
      'wtn-blocks/featured-authors',
      'wtn-blocks/featured-authors',
      'WtnBlocksFeaturedAuthors',
      'authors',
    ),
    resolved: {
      title: 'Autores em destaque',
      viewAllUrl: '/autores/',
      authors: [authors[0], authors[1], null, authors[2]],
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/featured-authors'>,

  adManual: {
    ...blockBase(
      'wtn-blocks/ad-slot',
      'wtn-blocks/ad-slot',
      'WtnBlocksAdSlot',
      'ad-manual',
    ),
    resolved: {
      type: 'manual',
      placement: 'inline',
      format: 'rectangle',
      width: 300,
      height: 250,
      image: {
        ...alternateImage,
        altText: 'Publicidade de demonstração',
        width: 300,
        height: 250,
      },
      url: '/publicidade/',
      adsenseClientId: null,
      adSlotId: null,
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/ad-slot'>,

  adSense: {
    ...blockBase(
      'wtn-blocks/ad-slot',
      'wtn-blocks/ad-slot',
      'WtnBlocksAdSlot',
      'ad-adsense',
    ),
    resolved: {
      type: 'adsense',
      placement: 'sidebar',
      format: 'rectangle',
      width: 300,
      height: 250,
      image: null,
      url: null,
      adsenseClientId: 'ca-pub-0000000000000000',
      adSlotId: '0000000000',
    },
  } satisfies TreeBlockOfKind<'wtn-blocks/ad-slot'>,
};

export const nullWtnFixtures = {
  hero: {
    ...wtnFixtures.heroLeft,
    clientId: 'gallery-null-hero',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/editorial-hero'>,
  breaking: {
    ...wtnFixtures.breaking,
    clientId: 'gallery-null-breaking',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/breaking-news'>,
  newsSection: {
    ...wtnFixtures.newsSection,
    clientId: 'gallery-null-section',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/news-section'>,
  latest: {
    ...wtnFixtures.latestHorizontal,
    clientId: 'gallery-null-latest',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/latest-news'>,
  authors: {
    ...wtnFixtures.authors,
    clientId: 'gallery-null-authors',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/featured-authors'>,
  ad: {
    ...wtnFixtures.adManual,
    clientId: 'gallery-null-ad',
    resolved: null,
  } satisfies TreeBlockOfKind<'wtn-blocks/ad-slot'>,
};

function flatFixtureBlock<TBlock extends GutenbergTreeBlock>(
  block: TBlock,
  clientId: string,
  parentClientId: string | null,
): Omit<TBlock, 'children'> {
  const { children, ...flatBlock } = block;
  void children;

  return {
    ...flatBlock,
    clientId,
    parentClientId,
  };
}

const integratedColumnsId = 'gallery-integrated-columns';
const integratedWideColumnId = 'gallery-integrated-column-wide';
const integratedNarrowColumnId = 'gallery-integrated-column-narrow';

export const integratedFlatFixture = [
  flatFixtureBlock(wtnFixtures.heroLeft, 'gallery-integrated-hero', null),
  flatFixtureBlock(wtnFixtures.breaking, 'gallery-integrated-breaking', null),
  flatFixtureBlock(
    wtnFixtures.newsSection,
    'gallery-integrated-news-section-root',
    null,
  ),
  flatFixtureBlock(coreFixtures.columns, integratedColumnsId, null),
  flatFixtureBlock(
    coreFixtures.columnWide,
    integratedWideColumnId,
    integratedColumnsId,
  ),
  flatFixtureBlock(
    wtnFixtures.heroRight,
    'gallery-integrated-hero-column',
    integratedWideColumnId,
  ),
  flatFixtureBlock(
    wtnFixtures.newsSectionNoTitle,
    'gallery-integrated-news-section-column',
    integratedWideColumnId,
  ),
  flatFixtureBlock(
    wtnFixtures.latestHorizontal,
    'gallery-integrated-latest-wide',
    integratedWideColumnId,
  ),
  flatFixtureBlock(
    coreFixtures.columnNarrow,
    integratedNarrowColumnId,
    integratedColumnsId,
  ),
  flatFixtureBlock(
    wtnFixtures.latestVertical,
    'gallery-integrated-latest-narrow',
    integratedNarrowColumnId,
  ),
  flatFixtureBlock(
    wtnFixtures.adManual,
    'gallery-integrated-ad',
    integratedNarrowColumnId,
  ),
  flatFixtureBlock(wtnFixtures.authors, 'gallery-integrated-authors', null),
  flatFixtureBlock(
    coreFixtures.paragraph,
    'gallery-integrated-paragraph',
    null,
  ),
] satisfies GutenbergBlock[];
