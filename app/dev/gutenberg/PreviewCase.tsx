import type { ReactNode } from 'react';

import styles from './page.module.scss';

type PreviewViewport = 'fluid' | 'mobile' | 'tablet' | 'desktop';

type PreviewCaseProps = {
  title: string;
  eyebrow: string;
  details?: readonly string[];
  viewport?: PreviewViewport;
  wide?: boolean;
  expectedEmpty?: boolean;
  children: ReactNode;
};

export function PreviewCase({
  title,
  eyebrow,
  details = [],
  viewport = 'fluid',
  wide = false,
  expectedEmpty = false,
  children,
}: PreviewCaseProps) {
  return (
    <article
      className={`${styles.previewCase} ${wide ? styles.previewCaseWide : ''}`}
    >
      <header className={styles.previewHeader}>
        <div>
          <p className={styles.previewEyebrow}>{eyebrow}</p>
          <h3 className={styles.previewTitle}>{title}</h3>
        </div>

        <span className={styles.viewportBadge}>{viewport}</span>
      </header>

      {details.length > 0 ? (
        <ul className={styles.previewDetails}>
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      <div className={styles.previewShell}>
        <div className={styles.previewCanvas} data-viewport={viewport}>
          {children}
          {expectedEmpty ? (
            <p className={styles.emptyHint}>
              Sem markup do renderer — comportamento esperado para este estado.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
