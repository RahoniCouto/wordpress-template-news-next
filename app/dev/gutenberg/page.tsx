import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GutenbergRenderer } from '@/components/gutenberg/GutenbergRenderer';
import {
  CoreButtonRenderer,
  CoreButtonsRenderer,
  CoreColumnRenderer,
  CoreColumnsRenderer,
  CoreGroupRenderer,
  CoreHeadingRenderer,
  CoreImageRenderer,
  CoreListItemRenderer,
  CoreListRenderer,
  CoreParagraphRenderer,
  CoreQuoteRenderer,
  CoreSeparatorRenderer,
} from '@/components/gutenberg/core-renderers';
import {
  EditorialHeading,
  getChildEditorialHeadingLevel,
} from '@/components/gutenberg/editorial-heading';
import { AdSlotRenderer } from '@/components/gutenberg/wtn/AdSlot';
import { BreakingNewsRenderer } from '@/components/gutenberg/wtn/BreakingNews';
import { EditorialHeroRenderer } from '@/components/gutenberg/wtn/EditorialHero';
import { FeaturedAuthorsRenderer } from '@/components/gutenberg/wtn/FeaturedAuthors';
import { LatestNewsRenderer } from '@/components/gutenberg/wtn/LatestNews';
import { NewsSectionRenderer } from '@/components/gutenberg/wtn/NewsSection';
import { flatListToTree } from '@/lib/gutenberg-tree';

import {
  coreFixtures,
  integratedFlatFixture,
  headingFixtures,
  modernListFixture,
  modernQuoteFixture,
  nestedListFixture,
  nestedParentListItemFixture,
  nullWtnFixtures,
  orderedLegacyListFixture,
  unknownCompatibilityFixture,
  wtnFixtures,
} from './fixtures';
import { PreviewCase } from './PreviewCase';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Gutenberg Component Gallery — Template News',
  description: 'QA visual dos renderers Gutenberg e WTN em desenvolvimento.',
  robots: {
    index: false,
    follow: false,
  },
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className={styles.sectionHeader}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

function NestedListPreview() {
  return (
    <CoreListRenderer block={nestedListFixture}>
      <CoreListItemRenderer block={coreFixtures.nestedListItem}>
        {null}
      </CoreListItemRenderer>
    </CoreListRenderer>
  );
}

export default function GutenbergComponentGalleryPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const integratedTree = flatListToTree(integratedFlatFixture);

  return (
    <main className={styles.gallery}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>WordPress Template News · V2 Headless</p>
          <h1>Gutenberg Component Gallery</h1>
          <p className={styles.lead}>
            QA visual dos renderers reais e do pipeline Gutenberg integrado.
            Esta superfície é exclusiva de desenvolvimento e não representa o
            design final da Home.
          </p>
        </div>

        <aside className={styles.statusCard}>
          <strong>Escopo visual atual</strong>
          <span>12 Core renderers</span>
          <span>6 WTN renderers</span>
          <span>Server Components por padrão</span>
          <span>AdSenseUnit como ilha Client isolada</span>
        </aside>
      </header>

      <nav className={styles.quickNav} aria-label="Seções da galeria">
        <a href="#headings">Headings</a>
        <a href="#core">Core</a>
        <a href="#wtn">WTN</a>
        <a href="#compatibility">Compatibilidade</a>
        <a href="#integrated">Composição integrada</a>
        <a href="#empty">Resolved null</a>
      </nav>

      <section className={styles.gallerySection} id="headings">
        <SectionHeading
          eyebrow="Semântica editorial"
          title="Editorial Heading h1–h6"
          description="O componente suporta toda a hierarquia HTML. A política global futura decide qual nível cada ocorrência recebe."
        />

        <div className={styles.headingScale}>
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <div className={styles.headingSample} key={level}>
              <code>h{level}</code>
              <EditorialHeading level={level}>
                Exemplo editorial nível {level}
              </EditorialHeading>
              <span>child → h{getChildEditorialHeadingLevel(level)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gallerySection} id="core">
        <SectionHeading
          eyebrow="Gutenberg Core"
          title="Renderers estruturais"
          description="Os previews usam os componentes reais, sem registry. O styling existe somente dentro desta rota para permitir inspeção visual do markup."
        />

        <div className={styles.previewGrid}>
          <PreviewCase
            eyebrow="core/group"
            title="Group · section"
            details={['tagName=section', 'children preservados']}
          >
            <CoreGroupRenderer block={coreFixtures.groupSection}>
              <CoreParagraphRenderer block={coreFixtures.paragraph} />
            </CoreGroupRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/group"
            title="Group · fallback seguro"
            details={['tagName=custom-element', 'output=<div>']}
          >
            <CoreGroupRenderer block={coreFixtures.groupFallback}>
              <CoreParagraphRenderer block={coreFixtures.paragraph} />
            </CoreGroupRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/columns"
            title="Columns · 75 / 25"
            details={['CoreColumn.width', 'flexBasis preservado']}
            wide
          >
            <div className={styles.coreColumnsDemo}>
              <CoreColumnsRenderer block={coreFixtures.columns}>
                <CoreColumnRenderer block={coreFixtures.columnWide}>
                  <CoreParagraphRenderer block={coreFixtures.paragraph} />
                </CoreColumnRenderer>
                <CoreColumnRenderer block={coreFixtures.columnNarrow}>
                  <CoreParagraphRenderer block={coreFixtures.paragraph} />
                </CoreColumnRenderer>
              </CoreColumnsRenderer>
            </div>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/paragraph + core/heading"
            title="RichText e níveis Core"
            details={['HTML inline preservado', 'Heading 1–6']}
            wide
          >
            <CoreParagraphRenderer block={coreFixtures.paragraph} />
            <div className={styles.coreHeadingList}>
              {headingFixtures.map((block) => (
                <CoreHeadingRenderer block={block} key={block.clientId} />
              ))}
            </div>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/image"
            title="Image · link + caption"
            details={['CmsImage', 'alt/title/caption', '1200×675']}
          >
            <CoreImageRenderer block={coreFixtures.image} />
          </PreviewCase>

          <PreviewCase
            eyebrow="core/quote"
            title="Quote · moderno"
            details={['children React', 'value não duplicado']}
          >
            <CoreQuoteRenderer block={modernQuoteFixture}>
              <CoreParagraphRenderer block={coreFixtures.quoteParagraph} />
            </CoreQuoteRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/quote"
            title="Quote · legado"
            details={['children=[]', 'fallback value + citation']}
          >
            <CoreQuoteRenderer block={coreFixtures.quoteLegacy}>
              {null}
            </CoreQuoteRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/list"
            title="List · moderna"
            details={['children core/list-item', 'values ignorado']}
          >
            <CoreListRenderer block={modernListFixture}>
              <CoreListItemRenderer block={coreFixtures.listItemA}>
                {null}
              </CoreListItemRenderer>
              <CoreListItemRenderer block={coreFixtures.listItemB}>
                {null}
              </CoreListItemRenderer>
            </CoreListRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/list"
            title="List · legado ordenado"
            details={['reversed', 'start=3', 'values fallback']}
          >
            <CoreListRenderer block={orderedLegacyListFixture}>
              {null}
            </CoreListRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/list-item"
            title="Nested list válida"
            details={['RichText + children', 'span somente quando necessário']}
            wide
          >
            <CoreListItemRenderer block={nestedParentListItemFixture}>
              <NestedListPreview />
            </CoreListItemRenderer>
          </PreviewCase>

          <PreviewCase
            eyebrow="core/buttons + core/button"
            title="Anchor e button"
            details={['tagName controla semântica', 'RichText preservado']}
          >
            <div className={styles.coreButtonsDemo}>
              <CoreButtonsRenderer block={coreFixtures.buttons}>
                <CoreButtonRenderer block={coreFixtures.buttonAnchor} />
                <CoreButtonRenderer block={coreFixtures.buttonElement} />
              </CoreButtonsRenderer>
            </div>
          </PreviewCase>

          <PreviewCase eyebrow="core/separator" title="Separator">
            <CoreSeparatorRenderer />
          </PreviewCase>
        </div>
      </section>

      <section className={styles.gallerySection} id="wtn">
        <SectionHeading
          eyebrow="WTN"
          title="Componentes editoriais"
          description="Fixtures locais tipadas exercitam as variantes visuais sem mover seleção, deduplicação ou overrides para o Next."
        />

        <div className={styles.previewGrid}>
          <PreviewCase
            eyebrow="Editorial Hero"
            title="Imagem à esquerda"
            details={['headingLevel=1', 'priorityIntent=true', 'desktop']}
            viewport="desktop"
            wide
          >
            <EditorialHeroRenderer
              block={wtnFixtures.heroLeft}
              headingLevel={1}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Editorial Hero"
            title="Imagem à direita"
            details={['headingLevel=2', 'mediaPosition=right']}
            viewport="tablet"
            wide
          >
            <EditorialHeroRenderer
              block={wtnFixtures.heroRight}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Editorial Hero"
            title="Sem imagem"
            details={['post.image=null', 'continua renderizável']}
            viewport="mobile"
          >
            <EditorialHeroRenderer
              block={wtnFixtures.heroNoImage}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Breaking News"
            title="Última hora"
            details={['label resolvido', 'tempo relativo', 'headingLevel=2']}
            wide
          >
            <BreakingNewsRenderer
              block={wtnFixtures.breaking}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="News Section"
            title="Com título + secondary null"
            details={['h2 seção → h3 cards', 'null omitido sem substituição']}
            viewport="desktop"
            wide
          >
            <NewsSectionRenderer
              block={wtnFixtures.newsSection}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="News Section"
            title="Sem título"
            details={['featured assume headingLevel', 'compact']}
            viewport="mobile"
            wide
          >
            <NewsSectionRenderer
              block={wtnFixtures.newsSectionNoTitle}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="News Section"
            title="Sem imagens"
            details={['featured + secondary sem mídia', 'data-has-media=false']}
            viewport="tablet"
            wide
          >
            <NewsSectionRenderer
              block={wtnFixtures.newsSectionNoImages}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Latest News"
            title="Horizontal"
            details={['categoria visível', 'null post omitido']}
            viewport="desktop"
            wide
          >
            <LatestNewsRenderer
              block={wtnFixtures.latestHorizontal}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Latest News"
            title="Vertical"
            details={['categoria não exibida nesse layout']}
            viewport="mobile"
          >
            <LatestNewsRenderer
              block={wtnFixtures.latestVertical}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Latest News"
            title="Horizontal sem imagens"
            details={[
              'data-has-media=false',
              'conteúdo ocupa a largura disponível',
            ]}
            viewport="tablet"
            wide
          >
            <LatestNewsRenderer
              block={wtnFixtures.latestHorizontalNoImages}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Featured Authors"
            title="Avatar + iniciais"
            details={[
              'avatar real do resolved',
              'fallback visual por iniciais',
            ]}
            wide
          >
            <FeaturedAuthorsRenderer
              block={wtnFixtures.authors}
              headingLevel={2}
            />
          </PreviewCase>

          <PreviewCase
            eyebrow="Ad Slot"
            title="Manual"
            details={['300×250', 'rel=sponsored', 'reserva de proporção']}
          >
            <AdSlotRenderer block={wtnFixtures.adManual} />
          </PreviewCase>

          <PreviewCase
            eyebrow="Ad Slot"
            title="AdSense"
            details={['Client island isolada', 'script global não carregado']}
          >
            <AdSlotRenderer block={wtnFixtures.adSense} />
          </PreviewCase>
        </div>
      </section>

      <section className={styles.gallerySection} id="compatibility">
        <SectionHeading
          eyebrow="Fallback controlado"
          title="Unknown via renderedHtml"
          description="Um bloco não suportado vira uma boundary opaca: o HTML do CMS é usado uma única vez e os children React daquela subtree não são percorridos novamente."
        />

        <div className={styles.previewGrid}>
          <PreviewCase
            eyebrow="Unknown · CoreTable"
            title="Compatibility boundary"
            details={[
              'renderedHtml centralizado',
              'children React ignorados',
              'sem WTN descendants',
            ]}
            viewport="tablet"
            wide
          >
            <GutenbergRenderer
              blocks={[unknownCompatibilityFixture]}
              mainHeadingAlreadyRendered
            />
          </PreviewCase>
        </div>
      </section>

      <section className={styles.gallerySection} id="integrated">
        <SectionHeading
          eyebrow="Pipeline integrado"
          title="Composição Gutenberg via registry"
          description="A fixture flat é reconstruída por flatListToTree() e renderizada pelo GutenbergRenderer. Os dois previews usam a mesma árvore e variam apenas o contexto de H1 externo."
        />

        <div className={styles.integratedGrid}>
          <PreviewCase
            eyebrow="GutenbergRenderer"
            title="Home · H1 ainda não renderizado"
            details={[
              'flatListToTree → registry → React',
              'mainHeadingAlreadyRendered=false',
              'primeiro heading editorial → h1',
            ]}
            viewport="desktop"
            wide
          >
            <div className={styles.integratedComposition}>
              <GutenbergRenderer
                blocks={integratedTree}
                mainHeadingAlreadyRendered={false}
              />
            </div>
          </PreviewCase>

          <PreviewCase
            eyebrow="GutenbergRenderer"
            title="Conteúdo · H1 externo já renderizado"
            details={[
              'mesma composição',
              'mainHeadingAlreadyRendered=true',
              'headings editoriais principais → h2',
            ]}
            viewport="desktop"
            wide
          >
            <div className={styles.integratedComposition}>
              <GutenbergRenderer
                blocks={integratedTree}
                mainHeadingAlreadyRendered
              />
            </div>
          </PreviewCase>
        </div>
      </section>

      <section className={styles.gallerySection} id="empty">
        <SectionHeading
          eyebrow="Contrato negativo"
          title="WTN com resolved = null"
          description="Cada renderer real é executado com resolved nulo. O espaço permanece vazio; a mensagem abaixo pertence apenas à gallery."
        />

        <div className={styles.emptyGrid}>
          <PreviewCase
            eyebrow="Editorial Hero"
            title="resolved=null"
            expectedEmpty
          >
            <EditorialHeroRenderer
              block={nullWtnFixtures.hero}
              headingLevel={2}
            />
          </PreviewCase>
          <PreviewCase
            eyebrow="Breaking News"
            title="resolved=null"
            expectedEmpty
          >
            <BreakingNewsRenderer
              block={nullWtnFixtures.breaking}
              headingLevel={2}
            />
          </PreviewCase>
          <PreviewCase
            eyebrow="News Section"
            title="resolved=null"
            expectedEmpty
          >
            <NewsSectionRenderer
              block={nullWtnFixtures.newsSection}
              headingLevel={2}
            />
          </PreviewCase>
          <PreviewCase
            eyebrow="Latest News"
            title="resolved=null"
            expectedEmpty
          >
            <LatestNewsRenderer
              block={nullWtnFixtures.latest}
              headingLevel={2}
            />
          </PreviewCase>
          <PreviewCase
            eyebrow="Featured Authors"
            title="resolved=null"
            expectedEmpty
          >
            <FeaturedAuthorsRenderer
              block={nullWtnFixtures.authors}
              headingLevel={2}
            />
          </PreviewCase>
          <PreviewCase eyebrow="Ad Slot" title="resolved=null" expectedEmpty>
            <AdSlotRenderer block={nullWtnFixtures.ad} />
          </PreviewCase>
        </div>
      </section>
    </main>
  );
}
