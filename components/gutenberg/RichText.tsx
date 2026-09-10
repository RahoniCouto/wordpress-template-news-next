type RichTextProps = {
  dangerouslySetInnerHTML: {
    __html: string;
  };
};

export function getRichTextProps(
  html: string | null | undefined,
): RichTextProps {
  return {
    dangerouslySetInnerHTML: {
      __html: html ?? '',
    },
  };
}
