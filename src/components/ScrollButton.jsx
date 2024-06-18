import { ArrowUp } from 'lucide-react';
import { useSnapshot } from 'valtio';
import clsx from 'clsx';

import { appState } from './App/state';

function handleScrollClick() {
  document
    .getElementById('scroll-anchor')
    .scrollTo({ top: 0, behavior: 'smooth' });
}

export const ScrollButton = () => {
  const snap = useSnapshot(appState);

  return (
    <div className="fixed bottom-8 right-8 z-10">
      <button
        className={clsx(
          'bg-accent border rounded-full p-2 transition-opacity',
          {
            'hover:opacity-75': snap.hasScroll,
            'opacity-0 pointer-events-none': !snap.hasScroll,
          }
        )}
        onClick={handleScrollClick}
      >
        <ArrowUp width="24px" height="24px" />
      </button>
    </div>
  );
};
