import { act, fireEvent, render, screen } from '@testing-library/react';

import { UiProvider, type UiTheme, type UiValue } from '@dloizides/ui-feedback';

import { InfoTip } from './InfoTip';

const theme: UiTheme = {
  colors: {
    background: '#ffffff',
    surface: '#eeeeee',
    surfaceElevated: '#ffffff',
    text: '#111111',
    textSecondary: '#666666',
    border: '#cccccc',
  },
  palette: { primary: { '500': '#005f73' }, secondary: { '500': '#94d2bd' }, accent: { '500': '#ee9b00' } },
  semantic: {
    error: { '500': '#ae2012' },
    success: { '500': '#0a9396' },
    warning: { '500': '#ca6702' },
    info: { '500': '#0077b6' },
  },
};

const t: UiValue['t'] = (key) => key;
const TIP_TEXT = 'Price changed after they registered.';

function renderTip(children?: React.ReactNode, testID: string | undefined = 'tip'): void {
  render(
    <UiProvider theme={theme} t={t}>
      <div data-testid="outside">outside</div>
      <InfoTip accessibilityHint="Shows the details" content={TIP_TEXT} label="Price details" testID={testID}>
        {children}
      </InfoTip>
    </UiProvider>,
  );
}

const trigger = (): HTMLElement => screen.getByTestId('tip-trigger');
const bubble = (): HTMLElement | null => screen.queryByTestId('tip-bubble');

describe('InfoTip', () => {
  it('with no interaction, shows no tip', () => {
    renderTip();

    const shown = bubble();

    expect(shown).toBeNull();
  });

  it('on a trigger press, shows the content as a tooltip', () => {
    renderTip();

    fireEvent.click(trigger());

    expect(bubble()).toHaveAttribute('role', 'tooltip');
    expect(screen.getByText(TIP_TEXT)).toBeInTheDocument();
  });

  it('on a second trigger press, hides the tip', () => {
    renderTip();
    fireEvent.click(trigger());

    fireEvent.click(trigger());

    expect(bubble()).toBeNull();
  });

  it('on focus then blur, shows then hides the tip', () => {
    renderTip();
    fireEvent.focus(trigger());
    const shownOnFocus = bubble();

    fireEvent.blur(trigger());

    expect(shownOnFocus).not.toBeNull();
    expect(bubble()).toBeNull();
  });

  it('on Escape while open, hides the tip', () => {
    renderTip();
    fireEvent.click(trigger());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(bubble()).toBeNull();
  });

  it('on another key while open, keeps the tip', () => {
    renderTip();
    fireEvent.click(trigger());

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    });

    expect(bubble()).not.toBeNull();
  });

  it('on a pointer press outside, hides the tip', () => {
    renderTip();
    fireEvent.click(trigger());

    fireEvent.pointerDown(screen.getByTestId('outside'));

    expect(bubble()).toBeNull();
  });

  it('on a pointer press inside the tip, keeps it open', () => {
    renderTip();
    fireEvent.click(trigger());

    fireEvent.pointerDown(screen.getByText(TIP_TEXT));

    expect(bubble()).not.toBeNull();
  });

  it('with children, uses them as the trigger named by the label', () => {
    renderTip(<span>Registered at 25.00</span>);

    const node = trigger();

    expect(node).toHaveTextContent('Registered at 25.00');
    expect(node).toHaveAttribute('aria-label', 'Price details');
  });

  it('with no testID, still opens on press', () => {
    renderTip(undefined, undefined);

    fireEvent.click(screen.getByLabelText('Price details'));

    expect(screen.getByText(TIP_TEXT)).toBeInTheDocument();
  });
});
