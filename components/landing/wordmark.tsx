type WordmarkProps = {
  className?: string;
};

/**
 * Inline copy of the wordmark so the lettering can follow the current text
 * colour. The nav uses the file directly because it always sits over dark
 * video; the footer sits on the page background and has to work in both themes.
 */
const Wordmark = ({ className }: WordmarkProps) => {
  return (
    <svg
      width={147}
      height={40}
      viewBox="0 0 147 40"
      fill="none"
      role="img"
      aria-label="Tessera"
      className={className}
    >
      <rect x="0" y="10" width="9" height="9" rx="1.2" fill="#2dd4bf" />
      <rect
        x="11"
        y="10"
        width="9"
        height="9"
        rx="1.2"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <rect
        x="0"
        y="21"
        width="9"
        height="9"
        rx="1.2"
        fill="currentColor"
        fillOpacity="0.35"
      />
      <rect x="11" y="21" width="9" height="9" rx="1.2" fill="#2dd4bf" />
      <text
        x="28"
        y="27"
        fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        TESSERA
      </text>
    </svg>
  );
};

export default Wordmark;
