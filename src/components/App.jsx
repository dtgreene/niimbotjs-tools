import {
  createHashRouter,
  Navigate,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';

import { ImageDataViewer } from './ImageDataViewer';
import { PacketExplorer } from './PacketExplorer/PacketExplorer';
import { CalibrateLabel } from './CalibrateLabel';
import { Layout } from './Layout/Layout';
import { Debug } from './Debug';
import { Button } from './ui/Button';
import { proxy, useSnapshot } from 'valtio';

const errorState = proxy({
  expanded: false,
});

const ErrorBoundary = () => {
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

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: '/packet-explorer',
            element: <PacketExplorer />,
          },
          {
            path: '/image-data-viewer',
            element: <ImageDataViewer />,
          },
          {
            path: '/calibrate-label',
            element: <CalibrateLabel />,
          },
          {
            path: '/debug',
            element: <Debug />,
          },
        ],
      },
      {
        path: '',
        element: <Navigate to="/packet-explorer" />,
      },
    ],
  },
];
const router = createHashRouter(routes, {
  basename: import.meta.env.VITE_ROUTER_BASENAME,
});

export const App = () => <RouterProvider router={router} />;
