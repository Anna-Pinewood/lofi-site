import { useState, useEffect } from "react";
import videoList from "virtual:video-list";
import {
  DAY_START_HOUR,
  NIGHT_START_HOUR,
  ROTATION_INTERVAL_MS,
  MODE_CHECK_INTERVAL_MS,
  STATIC_IMAGES,
} from "./config";

type Mode = "day" | "night";

const base = import.meta.env.BASE_URL;
const withBase = (path: string) => base + path.replace(/^\//, "");

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

const mediaStyle: React.CSSProperties = {
  display: "block",
  maxWidth: "900px",
  width: "100%",
  margin: "auto",
  borderRadius: "12px",
  pointerEvents: "none",
};

function App() {
  const [mode, setMode] = useState<Mode>(getMode);
  const [src, setSrc] = useState(() => pickRandom(videoList[getMode()]));
  const [isStatic, setIsStatic] = useState(
    () => new URLSearchParams(window.location.search).get("view") === "static"
  );

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
    if (isStatic) return;
    const id = setInterval(() => {
      setSrc((prev) => pickRandom(videoList[mode], prev));
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [mode, isStatic]);

  const handleSwitch = () => {
    const next = !isStatic;
    if (!next) {
      setSrc(pickRandom(videoList[mode]));
    }
    setIsStatic(next);
    const url = new URL(window.location.href);
    if (next) {
      url.searchParams.set("view", "static");
    } else {
      url.searchParams.delete("view");
    }
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      {isStatic ? (
        <img
          key={mode}
          src={withBase(STATIC_IMAGES[mode])}
          alt=""
          style={mediaStyle}
        />
      ) : (
        src && (
          <video
            key={src}
            src={withBase(src)}
            autoPlay
            loop
            muted
            playsInline
            style={mediaStyle}
          />
        )
      )}
      <button
        onClick={handleSwitch}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          padding: "8px 20px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        switch
      </button>
    </>
  );
}

export default App;
