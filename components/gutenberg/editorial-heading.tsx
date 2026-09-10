import type { ReactNode } from 'react';

export type EditorialHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type EditorialHeadingProps = {
  level: EditorialHeadingLevel;
  children: ReactNode;
  className?: string;
};

export function EditorialHeading({
  level,
  children,
  className,
}: EditorialHeadingProps) {
  switch (level) {
    case 1:
      return <h1 className={className}>{children}</h1>;
    case 2:
      return <h2 className={className}>{children}</h2>;
    case 3:
      return <h3 className={className}>{children}</h3>;
    case 4:
      return <h4 className={className}>{children}</h4>;
    case 5:
      return <h5 className={className}>{children}</h5>;
    case 6:
    default:
      return <h6 className={className}>{children}</h6>;
  }
}

export function getChildEditorialHeadingLevel(
  level: EditorialHeadingLevel,
): EditorialHeadingLevel {
  return level < 6 ? ((level + 1) as EditorialHeadingLevel) : 6;
}
