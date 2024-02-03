export interface ICity {
  cityName: string;
  country: string;
  date: string | Date;
  emoji: string;
  id: number;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
}

export interface ICitiesContext {
  cities: ICity[];
  isLoading: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}
