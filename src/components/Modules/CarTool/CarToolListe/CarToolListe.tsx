import { useState, useEffect } from 'react';
import { RootState } from '../../../../store';
import { NavLink, redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CarsForm, { NewCarProps } from './Form/Form';
import { getAPI } from '../../../../utils/config';
import iconVoiture from '../../../../assets/icon-voiture.png';
import iconCamion from '../../../../assets/icon-camion.png';
import iconMoto from '../../../../assets/icon-moto.png';
import authConnexion from '../../../../hooks/authConnexion';

interface CarProps {
  id: number;
  name: string;
  km_per_month: string;
  type: 'Voiture' | 'Moto' | 'Camion';
  current_km: string;
}

function CarsList() {
  const { isUserLogged } = authConnexion();
  const [cars, setCars] = useState<CarProps[]>([]);
  const userId = useSelector((state: RootState) => state.user.userId);
  console.log('userID:', userId);

  const handleAddCar = async (newCar: NewCarProps) => {
    try {
      const carWithUserId = { ...newCar, userId };
      console.log('carWithUserId:', carWithUserId);
      const response = await getAPI().post(`/car`, carWithUserId);
      setCars([...cars, response.data]);
      getCars();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la voiture:", error);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    console.log(carId);
    try {
      await getAPI().delete(`/car/${carId}`);
      setCars(cars.filter((car) => car.id !== carId));
      getCars();
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture:', error);
    }
  };

  const getCars = async () => {
    try {
      const response = await getAPI().get(`/car`);
      setCars(response.data);
    } catch (error) {
      redirect('/error');
      console.error('Erreur lors de la récupération des véhicules:', error);
    }
  };

  useEffect(() => {
    getCars();
  }, [isUserLogged]);

  return (
    <div className="bg-base-200  min-h-screen h-full">
      <div className="pt-8">
        <h1 className="text-4xl mb-10 flex justify-center">CarTool</h1>
      </div>
      <div className="flex flex-wrap justify-center">
        {cars.map((car) => (
          <div
            className="card w-full sm:w-96 bg-base-100 shadow-xl my-4 mx-2"
            key={car.id}
          >
            <NavLink to={`/cars/${car.id}`}>
              <figure>
                {/* Condition d'affichage de l'icône en fonction du type de véhicule */}
                {car.type === 'Voiture' && (
                  <img
                    src={iconVoiture}
                    alt="Icon voiture"
                    className="w-56 h-56"
                  />
                )}
                {car.type === 'Camion' && (
                  <img
                    src={iconCamion}
                    alt="Icon camion"
                    className="w-56 h-56"
                  />
                )}
                {car.type === 'Moto' && (
                  <img src={iconMoto} alt="Icon moto" className="w-56 h-56" />
                )}
              </figure>
            </NavLink>
            <div className="card-body flex items-center">
              <div className="flex-grow" />
              <h2 className="card-title">{car.name}</h2>
              <button
                className="btn bg-[var(--color-primary-300)] hover:bg-[var(--color-primary-500)] text-white ml-2"
                onClick={() => handleDeleteCar(car.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <CarsForm onAddCar={handleAddCar} />
    </div>
  );
}
export default CarsList;
