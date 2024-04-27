// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useUrlPosition from "@/hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ICity } from "@/types";
import { useCities } from "@/contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const BaseUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const { lat, lng } = useUrlPosition();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false);
  const [geolocationError, setGeolocationError] = useState("");
  const [emoji, setEmoji] = useState("");
  const { cities, setCities, isLoading: isLoadedNewCity } = useCities();
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!cityName) return;

    const newCity: ICity = {
      cityName,
      country,
      date,
      notes,
      position: { lat: lat, lng: lng },
      emoji,
      id: +Date.now().toString(),
    };
    setCities([...cities, newCity]);
    navigate("/app/cities");
  }

  useEffect(() => {
    (async function fetchCityData() {
      if (!lat || !lng) return;
      try {
        setIsLoadingGeolocation(true);
        const response = await fetch(
          `${BaseUrl}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            "that doesn't seem to be a valid city,Click somewhere else on the map"
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setIsLoadingGeolocation(false);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err: unknown) {
        setIsLoadingGeolocation(false);
        if (err instanceof Error) {
          setGeolocationError(err.message);
        }
      }
    })();
  }, [lat, lng]);

  if (isLoadingGeolocation) return <Spinner />;
  if (!lat || !lng)
    return <Message message="Click on the map to select a city" />;
  if (geolocationError) return <Message message={geolocationError} />;

  return (
    <form
      className={`${styles.form} ${isLoadedNewCity ? styles.loading : ""}`}
      onSubmit={() => console.log(handleSubmit)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">
          When did you go to {cityName},{country}?
        </label>
        <DatePicker
          onChange={(date) => setDate(date || new Date())}
          selected={date}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleSubmit}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
