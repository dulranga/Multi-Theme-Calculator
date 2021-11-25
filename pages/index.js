import Head from "next/head";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "../components/number-button";
import { theme, THEMES } from "../constants/theme";
import styles from "../styles/Home.module.css";

const initialState = { real: "", display: "" };

export default function Home() {
  const [expression, setExpression] = useState(initialState);
  const [error, setError] = useState(null);
  const displayRef = useRef(null);
  const [themeID, setTheme] = useState(THEMES.dark);

  const toggleTheme = (e) => {
    const newTheme = e.target.dataset.type;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  const keyboardEvents = (e) => {
    switch (e.key) {
      case "Enter":
        submitInput();
        break;
      case "Delete":
        resetExpression();
        break;
      case "Backspace":
        delExpression();
        break;

      default:
        break;
    }
  };

  const addExpression = ({ label, real }) => {
    setExpression((prev) => ({
      display: prev.display.concat(label),
      real: prev.real.concat(real),
    }));
  };
  const resetExpression = () => {
    setExpression(initialState);
  };
  const delExpression = () => {
    setExpression((prev) => ({
      display: prev.display.slice(0, -1),
      real: prev.real.slice(0, -1),
    }));
  };
  const submitInput = () => {
    setExpression((prev) => {
      try {
        setError(null);
        const submit = String(eval(prev.real) || "");

        return {
          real: submit,
          display: submit.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        };
      } catch {
        setError("Invalid Expression");
        return prev;
      }
    });
  };
  const forceChange = (e) => {
    const value = e.target.value.replace(/\n/g, "");
    setExpression({
      real: value,
      display: value,
    });
  };

  const KEYS = [
    { label: "7", real: 7, onClick: addExpression },
    { label: "8", real: 8, onClick: addExpression },
    { label: "9", real: 9, onClick: addExpression },
    { label: "del", onClick: delExpression, classes: ["special", "reset"] },
    { label: "4", real: 4, onClick: addExpression },
    { label: "5", real: 5, onClick: addExpression },
    { label: "6", real: 6, onClick: addExpression },
    { label: "+", real: "+", onClick: addExpression, classes: ["special"] },
    { label: "1", real: 1, onClick: addExpression },
    { label: "2", real: 2, onClick: addExpression },
    { label: "3", real: 3, onClick: addExpression },
    { label: "-", real: "-", onClick: addExpression, classes: ["special"] },
    { label: ".", real: ".", onClick: addExpression },
    { label: "0", real: 0, onClick: addExpression },
    { label: "/", real: "/", onClick: addExpression, classes: ["special"] },
    { label: "x", real: "*", onClick: addExpression, classes: ["special"] },
    {
      label: "reset",
      onClick: resetExpression,
      classes: ["bottom-buttons", "reset"],
    },
    { label: "=", onClick: submitInput, classes: ["bottom-buttons", "submit"] },
  ];

  useLayoutEffect(() => {
    displayRef.current.style.height = "auto";
    displayRef.current.style.height = displayRef.current.scrollHeight + "px";
  }, [expression]);

  useEffect(() => {
    document.addEventListener("keydown", keyboardEvents);

    const defaultTheme = localStorage.getItem("theme");
    if (defaultTheme) setTheme(defaultTheme);
  }, []);

  return (
    <div style={theme[themeID]} className={styles.wrapper}>
      <Head>
        <title>Frontend Mentor | Calculator app</title>
      </Head>
      <main className={styles.container}>
        <header>
          <div className={styles.info}>calc</div>
          <div className={styles.theme}>
            <div className={styles.theme_title}>theme</div>
            <div className={styles.toggler}>
              {Object.keys(THEMES).map((theme, key) => (
                <input
                  key={key}
                  type="radio"
                  name="theme-toggle"
                  data-type={THEMES[theme]}
                  checked={themeID === THEMES[theme]}
                  onChange={toggleTheme}
                />
              ))}
            </div>
          </div>
        </header>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.display}>
          <textarea
            ref={displayRef}
            value={expression.display}
            rows={1}
            onChange={forceChange}
          />
        </div>
        <div className={styles.key_pad}>
          {KEYS.map((key, i) => (
            <Button {...key} key={i} />
          ))}
        </div>
      </main>
      <div className={styles.attribution}>
        Challenge by&nbsp;
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Frontend Mentor.
        </a>
        Coded by &nbsp;
        <a
          href="https://github.com/dulranga"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dulranga Dhawanitha
        </a>
      </div>
    </div>
  );
}
