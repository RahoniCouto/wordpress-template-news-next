import { AdSenseUnit } from '@/components/ads/AdSenseUnit';
import { CmsImage } from '@/components/media/CmsImage';
import type { GutenbergTreeBlock } from '@/lib/gutenberg-tree';

type AdSlotBlock = Extract<GutenbergTreeBlock, { kind: 'wtn-blocks/ad-slot' }>;

type AdSlotRendererProps = {
  block: AdSlotBlock;
};

export function AdSlotRenderer({ block }: AdSlotRendererProps) {
  const { resolved } = block;

  if (!resolved) {
    return null;
  }

  const creativeStyle = {
    maxInlineSize: `${resolved.width}px`,
    aspectRatio: `${resolved.width} / ${resolved.height}`,
  };

  if (resolved.type === 'manual') {
    if (!resolved.image) {
      return null;
    }

    const image = (
      <CmsImage
        src={resolved.image.sourceUrl}
        alt={resolved.image.altText}
        width={resolved.image.width}
        height={resolved.image.height}
      />
    );

    return (
      <div
        className="wtn-ad-slot"
        data-ad-type="manual"
        data-placement={resolved.placement}
        data-format={resolved.format}
      >
        <span className="wtn-ad-slot__label">Publicidade</span>
        <div className="wtn-ad-slot__creative" style={creativeStyle}>
          {resolved.url ? (
            <a
              className="wtn-ad-slot__link"
              href={resolved.url}
              rel="sponsored"
              aria-label={resolved.image.altText ? undefined : 'Publicidade'}
            >
              {image}
            </a>
          ) : (
            image
          )}
        </div>
      </div>
    );
  }

  if (resolved.type === 'adsense') {
    if (!resolved.adsenseClientId || !resolved.adSlotId) {
      return null;
    }

    return (
      <div
        className="wtn-ad-slot"
        data-ad-type="adsense"
        data-placement={resolved.placement}
        data-format={resolved.format}
      >
        <span className="wtn-ad-slot__label">Publicidade</span>
        <div className="wtn-ad-slot__creative" style={creativeStyle}>
          <AdSenseUnit
            clientId={resolved.adsenseClientId}
            slotId={resolved.adSlotId}
            format={resolved.placement}
          />
        </div>
      </div>
    );
  }

  return null;
}
