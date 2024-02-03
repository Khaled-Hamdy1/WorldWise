import { Link, useNavigate } from "react-router-dom";
import { ICity } from "../types";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date: Date | string | null) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date || Date.now()));

export default function CityItem({ city }: { city: ICity }) {
  const { currentCity, cities, setCities } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const navigate = useNavigate();

  function deleteCity(id: number) {
    const newCities = cities.filter((c) => c.id !== id);
    setCities(newCities);
    navigate("/app/cities");
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity?.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            deleteCity(id);
          }}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}
