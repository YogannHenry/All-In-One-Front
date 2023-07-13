import { NavLink } from 'react-router-dom';

import ToolMenu from './ToolMenu/ToolMenu';
import TodoListMenu from './TodoListMenu/TodoListMenu';
import WalletMenu from './WalletMenu/WalletMenu';
import CarToolMenu from './CarToolMenu/CarToolMenu';
import Footer from '../../Footer/Footer';

function DrawerButton() {
  const closeDrawer = () => {
    const drawerToggle = document.getElementById('my-drawer');
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  };

  return (
    <div className="dropdown">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content max-md:z-0">
        <label
          htmlFor="my-drawer"
          tabIndex={0}
          className="btn btn-ghost btn-circle drawer-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
      </div>
      <div className="drawer-side z-20 ">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 max-md:w-full h-full bg-base-200 text-base-content flex items-center justify-around">
          <ToolMenu />
          <NavLink to="/TodoList">
            <TodoListMenu />
          </NavLink>
          <WalletMenu />
          <CarToolMenu />
          <Footer />
        </div>
        <button onClick={closeDrawer} className="btn md:hidden top-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DrawerButton;
