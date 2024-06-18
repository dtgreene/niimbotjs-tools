import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

import { layoutState } from './state';

function handleBodyScroll(event) {
  layoutState.hasScroll = event.target.scrollTop > 0;
}

export const Layout = () => (
  <div className="h-screen flex">
    <div className="h-full w-[250px] bg-background border-r flex flex-col justify-center relative flex-shrink-0">
      <div className="absolute top-0 w-full p-4 text-center font-bold">
        NIIMBOTJS TOOLS
      </div>
      <NavLink
        to="/packet-explorer"
        className={({ isActive }) =>
          clsx('p-4 hover:opacity-75 transition-all', {
            'bg-accent': isActive,
          })
        }
      >
        Packet Explorer
      </NavLink>
      <NavLink
        to="/image-data-viewer"
        className={({ isActive }) =>
          clsx('p-4 hover:opacity-75 transition-all', {
            'bg-accent': isActive,
          })
        }
      >
        Image Data Viewer
      </NavLink>
      <NavLink
        to="/calibrate-label"
        className={({ isActive }) =>
          clsx('p-4 hover:opacity-75 transition-all', {
            'bg-accent': isActive,
          })
        }
      >
        Calibrate Label
      </NavLink>
    </div>
    <div
      className="flex-1 overflow-auto relative"
      onScroll={handleBodyScroll}
      id="scroll-anchor"
    >
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  </div>
);
