import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const menu = [
  { title: 'GitHub', url: 'https://github.com/' },
  { title: 'OCADU', url: 'https://ocadu.gd/' },
  { title: 'Portfolio', url: 'https://work.iamasq.ca' },
];

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => menu,
  });
});

test('hides the menu until the logo is clicked', async () => {
  render(<App />);

  const toggle = screen.getByRole('button', { name: 'Toggle menu' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('button', { name: 'GitHub' })).not.toBeInTheDocument();

  await userEvent.click(toggle);

  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).toHaveClass('is-open');
  expect(await screen.findByRole('button', { name: 'GitHub' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'OCADU' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Portfolio' })).toBeInTheDocument();
});

test('loads the first site and opens the clicked menu item in the iframe', async () => {
  render(<App />);

  expect(await screen.findByTitle('GitHub')).toHaveAttribute('src', 'https://github.com/');

  const toggle = screen.getByRole('button', { name: 'Toggle menu' });
  await userEvent.click(toggle);
  await userEvent.click(await screen.findByRole('button', { name: 'Portfolio' }));

  await waitFor(() => {
    expect(screen.getByTitle('Portfolio')).toHaveAttribute(
      'src',
      'https://work.iamasq.ca'
    );
  });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('button', { name: 'Portfolio' })).not.toBeInTheDocument();
});
