import React from 'react';

const DEFAULT_TEXT = 'built by';
const DEFAULT_HOST = 'dloizides.com';
const DEFAULT_HREF = 'https://dloizides.com';
const DEFAULT_OPACITY = 0.65;
const DEFAULT_FONT_SIZE = 11;

export type PoweredByFooterComplianceMode = 'kids' | 'standard';

export interface PoweredByFooterProps {
  hide?: boolean;
  complianceMode?: PoweredByFooterComplianceMode;
  href?: string;
  hostText?: string;
  prefixText?: string;
  opacity?: number;
  fontSize?: number;
  testID?: string;
  className?: string;
}

const baseStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textAlign: 'center',
  padding: '8px 12px',
  pointerEvents: 'auto',
};

const linkStyle: React.CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
};

const PoweredByFooterComponent = (props: PoweredByFooterProps): React.ReactElement | null => {
  const {
    hide = false,
    complianceMode = 'standard',
    href = DEFAULT_HREF,
    hostText = DEFAULT_HOST,
    prefixText = DEFAULT_TEXT,
    opacity = DEFAULT_OPACITY,
    fontSize = DEFAULT_FONT_SIZE,
    testID = 'powered-by-footer',
    className,
  } = props;

  if (hide || complianceMode === 'kids') {
    return null;
  }

  const style: React.CSSProperties = {
    ...baseStyle,
    opacity,
    fontSize,
  };

  return (
    <div
      data-testid={testID}
      className={className}
      style={style}
      aria-label={`${prefixText} ${hostText}`}
    >
      <span>{prefixText} </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
        data-testid={`${testID}-link`}
      >
        {hostText}
      </a>
    </div>
  );
};

export const PoweredByFooter = React.memo(PoweredByFooterComponent);
PoweredByFooter.displayName = 'PoweredByFooter';
