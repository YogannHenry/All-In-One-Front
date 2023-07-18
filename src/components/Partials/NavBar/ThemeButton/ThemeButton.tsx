import { ThemeContext } from '../../../../contexts/ThemeProvider';
import React, { useContext } from 'react';

function ThemeButton() {
  const { colorTheme, ChangeColorTheme } = useContext(ThemeContext);

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className={`btn bg-[var(--color-primary-300)] text-white rounded-bl-3xl rounded-tr-3xl hover:bg-[var(--color-primary-500)]`}
      >
        Couleur
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box  w-[240px] grid grid-cols-4 max-md:grid-cols-2 gap-4"
      >
        <li>
          <button
            className="btn bg-red-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-red')}
          ></button>
        </li>
        <li>
          <button
            className="btn bg-sky-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-sky')}
          ></button>
        </li>
        <li>
          <button
            className="btn bg-brique-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-brique')}
          ></button>
        </li>
        <li>
          <button
            className="btn bg-blueIntense-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-blueIntense')}
          ></button>
        </li>
        <li>
          <button
            className="btn bg-orangeIntense-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-orangeIntense')}
          ></button>
        </li>
        <li>
          <button
            className="btn bg-emeraldIntense-300 rounded-full"
            onClick={() => ChangeColorTheme('theme-emeraldIntense')}
          ></button>
        </li>
      </ul>
    </div>
  );
}

export default ThemeButton;
