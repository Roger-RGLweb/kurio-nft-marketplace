
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import '@/index.css';
import { startMockWorker } from '@/mocks/browser';

const container = document.getElementById('root');

if (container === null) {
  throw new Error('Root container #root not found in index.html');
}

async function bootstrap() {
  await startMockWorker();

  const root = createRoot(container);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();