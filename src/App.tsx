import { useEffect, useRef, useState } from "react";
import videoList from "virtual:video-list";
import "./App.css";
import {
  DAY_START_HOUR,
  NIGHT_START_HOUR,
  ROTATION_INTERVAL_MS,
  MODE_CHECK_INTERVAL_MS,
  STATIC_IMAGES,
} from "./config";

type Mode = "day" | "night";
type View = "video" | "static" | "severance";

const base = import.meta.env.BASE_URL;
const withBase = (path: string) => base + path.replace(/^\//, "");
const SEVERANCE_VIDEO = "/videos/severance-web.mp4";
const SEVERANCE_POSTER = "/severance-poster.jpg";

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

function getInitialView(): View {
  const view = new URLSearchParams(window.location.search).get("view");
  return view === "static" || view === "severance" ? view : "video";
}

function App() {
  const [mode, setMode] = useState<Mode>(getMode);
  const [src, setSrc] = useState(() => pickRandom(videoList[getMode()]));
  const [view, setView] = useState<View>(getInitialView);
  const previousView = useRef<Exclude<View, "severance">>("video");
  const severanceVideo = useRef<HTMLVideoElement>(null);

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
    if (view !== "video") return;
    const id = setInterval(() => {
      setSrc((prev) => pickRandom(videoList[mode], prev));
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [mode, view]);

  useEffect(() => {
    if (view !== "severance") return;
    void severanceVideo.current?.play().catch(() => undefined);
  }, [view]);

  const changeView = (next: View) => {
    if (next === "video") {
      setSrc(pickRandom(videoList[mode]));
    }
    setView(next);
    const url = new URL(window.location.href);
    if (next === "video") {
      url.searchParams.delete("view");
    } else {
      url.searchParams.set("view", next);
    }
    window.history.replaceState(null, "", url);
  };

  const handleSwitch = () => {
    const next = view === "static" ? "video" : "static";
    previousView.current = next;
    changeView(next);
  };

  const handleSeveranceSwitch = () => {
    if (view === "severance") {
      changeView(previousView.current);
      return;
    }
    previousView.current = view;
    changeView("severance");
  };

  return (
    <>
      {view === "static" ? (
        <img
          key={mode}
          src={withBase(STATIC_IMAGES[mode])}
          alt=""
          className="media"
        />
      ) : view === "severance" ? (
        <video
          ref={severanceVideo}
          src={withBase(SEVERANCE_VIDEO)}
          poster={withBase(SEVERANCE_POSTER)}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={(event) => {
            void event.currentTarget.play().catch(() => undefined);
          }}
          className="media"
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
            className="media"
          />
        )
      )}
      <div className="controls">
        <button
          type="button"
          className="mode-button"
          onClick={handleSwitch}
          aria-pressed={view === "static"}
        >
          switch
        </button>
        <button
          type="button"
          className={`mode-button severance-button${view === "severance" ? " is-active" : ""}`}
          onClick={handleSeveranceSwitch}
          aria-pressed={view === "severance"}
        >
          severance
        </button>
      </div>
    </>
  );
}

export default App;
