import { useState, useEffect } from "react";
import videoList from "virtual:video-list";
import {
  DAY_START_HOUR,
  NIGHT_START_HOUR,
  ROTATION_INTERVAL_MS,
  MODE_CHECK_INTERVAL_MS,
} from "./config";

type Mode = "day" | "night";

function getMode(): Mode {
  const h = new Date().getHours();
  return h >= DAY_START_HOUR && h < NIGHT_START_HOUR ? "day" : "night";
}

function pickRandom(list: string[], current?: string): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  let next: string;
  do {
    next = list[Math.floor(Math.random() * list.length)];
  } while (next === current);
  return next;
}

function App() {
  const [mode, setMode] = useState<Mode>(getMode);
  const base = import.meta.env.BASE_URL;
  const withBase = (path: string) => base + path.replace(/^\//, "");

  const [src, setSrc] = useState(() => pickRandom(videoList[getMode()]));

  // check for day/night transition
  useEffect(() => {
    const id = setInterval(() => {
      const current = getMode();
      setMode((prev) => {
        if (prev !== current) {
          setSrc((prevSrc) => pickRandom(videoList[current], prevSrc));
        }
        return current;
      });
    }, MODE_CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // rotate video within the same mode
  useEffect(() => {
    const id = setInterval(() => {
      setSrc((prev) => pickRandom(videoList[mode], prev));
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [mode]);

  if (!src) return null;

  return (
    <video
      key={src}
      src={withBase(src)}
      autoPlay
      loop
      muted
      playsInline
      style={{
        display: "block",
        maxWidth: "900px",
        width: "100%",
        margin: "auto",
        borderRadius: "12px",
        pointerEvents: "none",
      }}
    />
  );
}

export default App;
