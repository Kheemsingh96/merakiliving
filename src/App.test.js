import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Meraki Living application', () => {
  render(<App />);
  const logoElements = screen.getAllByAltText(/Meraki Living/i);
  expect(logoElements.length).toBeGreaterThan(0);
});
