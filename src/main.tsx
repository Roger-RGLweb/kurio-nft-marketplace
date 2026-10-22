
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import '@/index.css';
import { startMockWorker } from '@/mocks/browser';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root not found in index.html');
}

async function bootstrap() {
  await startMockWorker();

  const rootContainer = document.getElementById('root');

if (!rootContainer) {
  throw new Error('Root container #root not found in index.html');
}

const root = createRoot(rootContainer);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();