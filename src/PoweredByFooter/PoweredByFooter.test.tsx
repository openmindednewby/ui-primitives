import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PoweredByFooter } from './PoweredByFooter';

describe('PoweredByFooter', () => {
  it('renders default attribution text and link', () => {
    render(<PoweredByFooter />);

    expect(screen.getByTestId('powered-by-footer')).toBeInTheDocument();
    const link = screen.getByTestId('powered-by-footer-link');
    expect(link).toHaveAttribute('href', 'https://dloizides.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('dloizides.com');
  });

  it('returns null when hide is true', () => {
    const { container } = render(<PoweredByFooter hide />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when complianceMode is kids', () => {
    const { container } = render(<PoweredByFooter complianceMode="kids" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders when complianceMode is standard', () => {
    render(<PoweredByFooter complianceMode="standard" />);
    expect(screen.getByTestId('powered-by-footer')).toBeInTheDocument();
  });

  it('respects custom href and host text', () => {
    render(
      <PoweredByFooter
        href="https://example.com"
        hostText="example.com"
        prefixText="crafted by"
      />
    );

    expect(screen.getByTestId('powered-by-footer')).toHaveTextContent(
      'crafted by example.com'
    );
    expect(screen.getByTestId('powered-by-footer-link')).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });

  it('applies custom opacity and fontSize', () => {
    render(<PoweredByFooter opacity={0.5} fontSize={14} />);

    const footer = screen.getByTestId('powered-by-footer');
    expect(footer).toHaveStyle({ opacity: '0.5', fontSize: '14px' });
  });

  it('applies a provided className', () => {
    render(<PoweredByFooter className="custom-class" />);
    expect(screen.getByTestId('powered-by-footer')).toHaveClass('custom-class');
  });

  it('uses a custom testID for both wrapper and link', () => {
    render(<PoweredByFooter testID="brand-attr" />);

    expect(screen.getByTestId('brand-attr')).toBeInTheDocument();
    expect(screen.getByTestId('brand-attr-link')).toBeInTheDocument();
  });

  it('exposes accessible label combining prefix and host', () => {
    render(<PoweredByFooter />);
    expect(screen.getByLabelText('built by dloizides.com')).toBeInTheDocument();
  });
});
