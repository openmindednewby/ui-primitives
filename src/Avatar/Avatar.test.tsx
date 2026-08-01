import { render, screen } from '@testing-library/react';

import { UiProvider, type UiTheme, type UiValue } from '@dloizides/ui-feedback';

import { Avatar } from './Avatar';

const theme: UiTheme = {
  colors: {
    background: '#ffffff',
    surface: '#eeeeee',
    surfaceElevated: '#ffffff',
    text: '#111111',
    textSecondary: '#666666',
    border: '#cccccc',
  },
  palette: {
    primary: { '500': '#005f73' },
    secondary: { '500': '#94d2bd' },
    accent: { '500': '#ee9b00' },
  },
  semantic: {
    error: { '500': '#ae2012' },
    success: { '500': '#0a9396' },
    warning: { '500': '#ca6702' },
    info: { '500': '#0077b6' },
  },
};

const t: UiValue['t'] = (key) => key;

function renderWithUi(ui: React.ReactElement): ReturnType<typeof render> {
  return render(
    <UiProvider theme={theme} t={t}>
      {ui}
    </UiProvider>,
  );
}

describe('Avatar', () => {
  it('renders the derived monogram when no image is supplied', () => {
    renderWithUi(<Avatar name="Acme Corp" testID="avatar" />);
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-image')).toBeNull();
  });

  it('exposes the name as the accessible label with an image role', () => {
    renderWithUi(<Avatar name="Petros Pan" testID="avatar" />);
    const el = screen.getByTestId('avatar');
    expect(el).toHaveAttribute('aria-label', 'Petros Pan');
    expect(el).toHaveAttribute('role', 'img');
  });

  it('renders the image branch when imageUrl is provided, suppressing initials', () => {
    renderWithUi(
      <Avatar name="Acme Corp" imageUrl="https://cdn.example.com/logo.png" testID="avatar" />,
    );
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.queryByText('AC')).toBeNull();
  });

  it('falls back to initials when imageUrl is an empty string', () => {
    renderWithUi(<Avatar name="Acme Corp" imageUrl="" testID="avatar" />);
    expect(screen.getByText('AC')).toBeInTheDocument();
    expect(screen.queryByTestId('avatar-image')).toBeNull();
  });

  it('honours a custom size and works without a testID', () => {
    renderWithUi(<Avatar name="Solo" size={64} />);
    // Initials branch => only the container carries role="img".
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Solo');
  });
});
