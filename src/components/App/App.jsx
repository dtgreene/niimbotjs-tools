import { proxy, useSnapshot } from 'valtio';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';

import { ImageDataViewer } from '../ImageDataViewer';
import { PacketExplorer } from '../PacketExplorer/PacketExplorer';
import { CalibrateLabel } from '../CalibrateLabel';
import { Debug } from '../Debug';
import { Button } from '../ui/Button';
import { appState } from './state';

const errorState = proxy({
  expanded: false,
});

const ErrorFallback = () => {
  const snap = useSnapshot(errorState);
  const error = useRouteError();
  const errorInfo = {
    message: '',
    stack: [],
  };

  if (error instanceof Error) {
    errorInfo.message = error.message;
    errorInfo.stack = error.stack?.split('\n') ?? [];
    errorInfo.stack = errorInfo.stack.filter(Boolean).slice(0, 10);
  }

  const handleStackClick = () => {
    errorState.expanded = !errorState.expanded;
  };

  return (
    <div className="border bg-accent rounded-md p-4">
      <div className="mb-4 text-4xl">OOF</div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div>Caught an error...</div>
          <div>{errorInfo.message}</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Clear state
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      </div>
      <Button variant="link" onClick={handleStackClick}>
        View stack
      </Button>
      {errorInfo.stack.length > 0 && snap.expanded && (
        <div className="border rounded py-2 mt-2 text-sm">
          {errorInfo.stack.map((value) => (
            <div key={value} className="ml-2">
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function handleBodyScroll(event) {
  appState.hasScroll = event.target.scrollTop > 0;
}

export const App = () => {
  const snap = useSnapshot(appState);

  return (
    <div className="h-screen flex">
      <div className="h-full w-[250px] bg-background border-r flex flex-col justify-center relative flex-shrink-0">
        <div className="absolute top-0 w-full p-4 text-center font-bold">
          NIIMBOTJS TOOLS
        </div>
        <div
          onClick={() => {
            appState.activeIndex = 0;
          }}
          className={clsx(
            'p-4 cursor-pointer hover:opacity-75 transition-all',
            {
              'bg-accent': snap.activeIndex === 0,
            }
          )}
        >
          Packet Explorer
        </div>
        <div
          onClick={() => {
            appState.activeIndex = 1;
          }}
          className={clsx(
            'p-4 cursor-pointer hover:opacity-75 transition-all',
            {
              'bg-accent': snap.activeIndex === 1,
            }
          )}
        >
          Image Data Viewer
        </div>
        <div
          onClick={() => {
            appState.activeIndex = 2;
          }}
          className={clsx(
            'p-4 cursor-pointer hover:opacity-75 transition-all',
            {
              'bg-accent': snap.activeIndex === 2,
            }
          )}
        >
          Calibrate Label
        </div>
      </div>
      <div
        className="flex-1 overflow-auto relative"
        onScroll={handleBodyScroll}
        id="scroll-anchor"
      >
        <div className="p-8">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {snap.activeIndex === 0 && <PacketExplorer />}
            {snap.activeIndex === 1 && <ImageDataViewer />}
            {snap.activeIndex === 2 && <CalibrateLabel />}
            {snap.activeIndex === 3 && <Debug />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
