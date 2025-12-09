import { render, screen } from '@testing-library/react';
import ExampleComponent from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ExampleComponent title="Test Title" description="Test Description" />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });
});

