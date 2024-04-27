import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ICity } from "@/types";

interface ICitiesContextData {
  cities: ICity[];
  setCities: (cities: ICity[]) => void;
  isLoading: boolean;
  getCityById: (id: string) => Promise<void>;
  currentCity: ICity | undefined;
}

const CitiesContext = createContext<ICitiesContextData>(
  {} as ICitiesContextData
);

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState<ICity | undefined>(undefined);

  useEffect(() => {
    (async function getCities() {
      try {
        setIsLoading(true);
        await fetch("../src/data/cities.json")
          .then((res) => res.json())
          .then((data) => {
            setCities(data.cities);
            setIsLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const getCityById = useCallback(
    async function getCityById(id: string) {
      try {
        setIsLoading(true);
        const city = cities.find((city) => city.id === +id);
        setCurrentCity(city);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    },
    [cities]
  );

  return (
    <CitiesContext.Provider
      value={{ cities, setCities, isLoading, getCityById, currentCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}
export { CitiesProvider, useCities };
