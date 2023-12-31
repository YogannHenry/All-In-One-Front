import { NavLink } from 'react-router-dom';
import DrawerButtonLeft from './DrawerButtonLeft/DrawerButtonLeft';
import DrawerButtonRight from './DrawerButtonRight/DrawerButtonRight';
import Logo from '../../../assets/TodoNavBar.png';
import ThemeButton from './ThemeButton/ThemeButton';
import { useAppSelector } from '../../../hooks/redux';

function NavBar() {
  const isLogged = useAppSelector((state) => state.user.logged);

  return (
    <div>
      {isLogged && (
        <div className="navbar bg-base-100 border">
          <div className="navbar-start">
            <DrawerButtonLeft />
            <NavLink to="/" className="w-11 ml-5">
              <img src={Logo} alt="Logo" className="object-scale-down" />
            </NavLink>
          </div>
          <div className="navbar-center max-md:hidden">
            <h1 className=" bg-gradient-to-tl from-slate-800 via-[var(--color-primary-500)] to-zinc-400 bg-clip-text text-transparent text-5xl">
              All-In-One
            </h1>
          </div>
          <div className="navbar-end">
            <DrawerButtonRight />
          </div>
        </div>
      )}

      {!isLogged && (
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <NavLink to="/" className="w-11 ml-5">
              <img src={Logo} alt="Logo" className="object-scale-down" />
            </NavLink>
          </div>
          <div className="navbar-center max-md:hidden">
            
          </div>
          <div className="navbar-end flex max-md:flex-col">
            <ThemeButton />
            <NavLink
              to="/login"
              className={`btn btn-ghost text-[var(--color-primary-300)]   hover:underline-offset-4 hover:bg-white`}
            >
              Se connecter
            </NavLink>
            <NavLink
              to="/signin"
              className={`btn text-white bg-[var(--color-primary-300)] max-lg:hidden hover:bg-[var(--color-primary-500)]`}
            >
              s'inscrire
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
