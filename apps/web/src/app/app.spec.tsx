import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have the domain in the page', () => {
    const queryClient = new QueryClient();
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(getByText(/LongUrl.RIP/gi)).toBeTruthy();
  });
});
