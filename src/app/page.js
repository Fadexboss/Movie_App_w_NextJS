"use client"; // Add this line at the top of the file

import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import styles from './Home.module.css'


const Home = () => {
  const Papa = require('papaparse');

  const [films, setFilms] = useState([]);
  const [currentFilmIndex, setCurrentFilmIndex] = useState(0);
  const [guess, setGuess] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [shownHints, setShownHints] = useState([]);
  const [isGuessCorrect, setIsGuessCorrect] = useState(false);
  const [timer, setTimer] = useState(120);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const [continueClickCount, setContinueClickCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const imdb_top = 50;
  const how_many_tour = 2;
  const api_key = "dece67f8";

  useEffect(() => {
    let isMounted = true;

    async function fetchMovies() {
      if (!isMounted) return;

      try {
        const response = await fetch("/IMDB_top_10_movies.csv");
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: async (result) => {
            if (!isMounted) return;

            const rankedMovies = result.data.filter((row) => {
              const rank = parseInt(row.Rank, 10);
              return rank >= 1 && rank <= imdb_top;
            });

            if (rankedMovies.length === 0) {
              console.error("Geçerli film bulunamadı!");
              return;
            }

            const randomIndex = Math.floor(Math.random() * rankedMovies.length);
            const randomMovie = rankedMovies[randomIndex];
            console.log("Rastgele Seçilen Film (CSV'den):", randomMovie.Title);

            const movieResponse = await fetch(
              `https://www.omdbapi.com/?t=${randomMovie.Title}&apikey=${api_key}`
            );
            const movieData = await movieResponse.json();
            if (movieData.Response === "False") {
              console.error("Film bulunamadı:", randomMovie.Title);
              return;
            }

            const movie = {
              title: movieData.Title.trim().toLowerCase() || "bilinmeyen",
              hint: [
                `Aktörler: ${movieData.Actors || "bilinmeyen"}`,
                `Tür: ${movieData.Genre || "bilinmeyen"}`,
                `Yapım Yılı: ${movieData.Year || "bilinmeyen"}`,
                `Yönetmen: ${movieData.Director || "bilinmeyen"}`,
                `IMDB Puanı: ${movieData.imdbRating || "bilinmeyen"}`,
              ],
              poster: movieData.Poster || "",
            };

            setFilms([movie]);
            setGuess(
              movie.title.split(" ").map((word) => Array(word.length).fill(""))
            );
          },
        });
      } catch (error) {
        console.error("Filmler yüklenirken hata oluştu: ", error);
      }
    }

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleGuessSubmit();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timer]);

  const handleInputChange = (wordIndex, letterIndex, value) => {
    if (value.length > 1) return;

    const newGuess = [...guess];
    newGuess[wordIndex][letterIndex] = value.toLowerCase();
    setGuess(newGuess);

    if (value && letterIndex < guess[wordIndex].length - 1) {
      inputRefs.current[wordIndex][letterIndex + 1]?.focus();
    } else if (
      value &&
      wordIndex < guess.length - 1 &&
      letterIndex === guess[wordIndex].length - 1
    ) {
      inputRefs.current[wordIndex + 1]?.[0]?.focus();
    }
  };

  const handleKeyDown = (wordIndex, letterIndex, event) => {
    if (event.key === "Backspace") {
      const newGuess = [...guess];
      newGuess[wordIndex][letterIndex] = "";
      setGuess(newGuess);

      if (letterIndex > 0) {
        inputRefs.current[wordIndex][letterIndex - 1]?.focus();
      } else if (wordIndex > 0) {
        inputRefs.current[wordIndex - 1]?.[guess[wordIndex - 1].length - 1]?.focus();
      }
    }
  };

  const handlePaste = (wordIndex, letterIndex, event) => {
    const pastedText = event.clipboardData.getData("Text").toLowerCase();
    const newGuess = [...guess];

    let currentWordIndex = wordIndex;
    let currentLetterIndex = letterIndex;

    for (let i = 0; i < pastedText.length; i++) {
      if (currentLetterIndex >= newGuess[currentWordIndex].length) {
        currentWordIndex++;
        currentLetterIndex = 0;

        if (currentWordIndex >= newGuess.length) {
          break;
        }
      }

      newGuess[currentWordIndex][currentLetterIndex] = pastedText[i];
      currentLetterIndex++;
    }

    setGuess(newGuess);
    event.preventDefault();
  };

  const addHint = () => {
    const remainingHints = films[currentFilmIndex]?.hint.filter(
      (hint, index) => !shownHints.includes(index)
    );
    if (remainingHints?.length > 0) {
      setScore((prev) => prev - 10);
      setShownHints((prev) => [
        ...prev,
        films[currentFilmIndex].hint.indexOf(remainingHints[0]),
      ]);
    }
  };

  const handleGuessSubmit = () => {
    const currentGuess = guess.map((word) => word.join("")).join(" ").toLowerCase();
    const correctAnswer = films[currentFilmIndex]?.title;

    if (currentGuess === correctAnswer) {
      setMessage("Correct!");
      setScore((prev) => prev + timer + 60);
      setIsGuessCorrect(true);
    } else {
      setMessage("Yanlış Cevap! Tekrar Deneyin.");
    }
  };

  const fetchNewFilm = async () => {
    setTimer(120);
    setIsGuessCorrect(false);
    try {
      const response = await fetch("/IMDB_top_10_movies.csv");
      const csvData = await response.text();

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const rankedMovies = result.data.filter((row) => {
            const rank = parseInt(row.Rank, 10);
            return rank >= 1 && rank <= imdb_top;
          });

          if (rankedMovies.length === 0) {
            console.error("Geçerli film bulunamadı!");
            return;
          }

          const randomIndex = Math.floor(Math.random() * rankedMovies.length);
          const randomMovie = rankedMovies[randomIndex];

          const movieResponse = await fetch(
            `https://www.omdbapi.com/?t=${randomMovie.Title}&apikey=${api_key}`
          );
          const movieData = await movieResponse.json();
          if (movieData.Response === "False") {
            console.error("Film bulunamadı:", randomMovie.Title);
            return;
          }

          const movie = {
            title: movieData.Title.trim().toLowerCase() || "bilinmeyen",
            hint: [
              `Tür: ${movieData.Genre || "bilinmeyen"}`,
              `Yapım yılı: ${movieData.Year || "bilinmeyen"}`,
              `Yönetmen: ${movieData.Director || "bilinmeyen"}`,
              `IMDB Puanı: ${movieData.imdbRating || "bilinmeyen"}`,
            ],
            poster: movieData.Poster || "",
          };

          setFilms([movie]);
          setGuess(
            movie.title.split(" ").map((word) => Array(word.length).fill(""))
          );
          setShownHints([]);
          setMessage("");
          setIsGuessCorrect(false);
          console.log("Yeni Film Seçildi: ", movie.title);
        },
      });
    } catch (error) {
      console.error("Yeni film yüklenirken hata oluştu: ", error);
    }
  };

  const handleContinueClick = () => {
    setContinueClickCount((prevCount) => prevCount + 1);
    if (continueClickCount + 1 === how_many_tour) {
      setShowPopup(true);
      setContinueClickCount(0);
    } else {
      fetchNewFilm();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Film Tahmin Oyunu</h1>

      <div className={styles.score}>Skor: {score}</div>
      <div className={styles.timer}>Kalan Zaman: {timer} Saniye</div>
      {films.length > 0 && (
        <div className={styles.guessGrid}>
          {guess.map((word, wordIndex) => (
            <div key={wordIndex} className={styles.word}>
              {word.map((letter, letterIndex) => (
                <input
                  key={letterIndex}
                  value={letter}
                  onChange={(e) =>
                    handleInputChange(wordIndex, letterIndex, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(wordIndex, letterIndex, e)}
                  onPaste={(e) => handlePaste(wordIndex, letterIndex, e)}
                  ref={(el) => {
                    if (!inputRefs.current[wordIndex]) {
                      inputRefs.current[wordIndex] = [];
                    }
                    inputRefs.current[wordIndex][letterIndex] = el;
                  }}
                  maxLength={1}
                  className={styles.letterInput}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {films.length > 0 && message === "Correct!" ? (
        <button className={styles.button} onClick={handleContinueClick}>Devam Et!</button>
      ) : (
        <button className={styles.button} onClick={handleGuessSubmit}>Tahmin Et!</button>
      )}

      <div className={styles.message}>{message}</div>
      <button className={styles.button} onClick={addHint}>İpucu Göster</button>

      <div className={styles.hintsTable}>
        {shownHints.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>İpucu</th>
              </tr>
            </thead>
            <tbody>
              {shownHints.map((hintIndex) => (
                <tr key={hintIndex}>
                  <td>{films[currentFilmIndex]?.hint[hintIndex]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isGuessCorrect && films[currentFilmIndex]?.poster && (
        <div className={styles.posterFrame}>
          <img
            src={films[currentFilmIndex].poster}
            alt="Film Poster"
            className={styles.posterImg}
            style={{
              width: "300px",
              height: "440px",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Oyun Bitti!</h2>
            <p>Skorun: {score}</p>
            <button className={styles.button} onClick={handleRefresh}>Yeni Oyun</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
