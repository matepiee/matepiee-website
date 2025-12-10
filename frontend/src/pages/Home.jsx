import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const PlayIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const VolumeIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const MuteIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);

const Home = () => {
  const [isLive, setIsLive] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const playerRef = useRef(null);
  const embedContainerRef = useRef(null); // Ref a div-hez

  const STREAMER_NAME = "emiru";

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/twitch/status/${STREAMER_NAME}`,
        );
        const data = await res.json();
        setIsLive(data.isLive);
      } catch (err) {
        console.error("Error fetching stream status", err);
        setIsLive(false);
      } finally {
        setLoadingStatus(false);
      }
    };

    checkStatus();
  }, []);

  useEffect(() => {
    if (!isLive) return;

    let player = null;

    const initPlayer = () => {
      // Ha már létezik a div és a Twitch object, inicializálunk
      if (window.Twitch && window.Twitch.Player && embedContainerRef.current) {
        // Töröljük a tartalmát, ha esetleg maradt volna valami
        embedContainerRef.current.innerHTML = "";

        player = new window.Twitch.Player("twitch-embed", {
          channel: STREAMER_NAME,
          width: "100%",
          height: "100%",
          layout: "video",
          autoplay: true,
          muted: true, // Fontos: true-nak kell lennie az autoplay-hez
          controls: false,
          parent: ["localhost"],
        });

        playerRef.current = player;

        player.addEventListener(window.Twitch.Player.PLAY, () =>
          setIsPlaying(true),
        );
        player.addEventListener(window.Twitch.Player.PAUSE, () =>
          setIsPlaying(false),
        );
        player.addEventListener(window.Twitch.Player.READY, () => {
          player.setVolume(0.5);
        });
      }
    };

    // Ellenőrizzük, hogy be van-e már töltve a script globálisan
    if (!document.getElementById("twitch-embed-script")) {
      const script = document.createElement("script");
      script.id = "twitch-embed-script"; // ID, hogy ne töltsük be többször
      script.src = "https://embed.twitch.tv/embed/v1.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Kis késleltetés, hogy a DOM biztosan kész legyen (Visibility error ellen)
        setTimeout(initPlayer, 100);
      };
    } else {
      // Ha a script már ott van, csak indítjuk a playert kis késleltetéssel
      setTimeout(initPlayer, 100);
    }

    // Cleanup function: ha elnavigálsz, törölje a playert
    return () => {
      if (playerRef.current) {
        // A Twitch API nem ad destroy metódust a v1-ben könnyen,
        // de a ref-et nullázzuk
        playerRef.current = null;
      }
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = "";
      }
    };
  }, [isLive]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      playerRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
      if (newVol > 0 && isMuted) {
        playerRef.current.setMuted(false);
        setIsMuted(false);
      }
    }
  };

  if (loadingStatus) {
    return (
      <div className="text-white text-center mt-20">
        Loading stream status...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-purple-300">
        LIVE STREAM
      </h1>

      {isLive ? (
        <div className="relative group rounded-2xl overflow-hidden shadow-glow-purple border border-dark-purple-600 bg-black aspect-video w-full">
          {/* Itt a ref a div-hez, és fix méretek */}
          <div
            id="twitch-embed"
            ref={embedContainerRef}
            className="w-full h-full"
          ></div>

          <div className="absolute inset-0 z-10" onClick={togglePlay}></div>

          <div className="absolute bottom-0 left-0 right-0 bg-dark-purple-900/90 backdrop-blur-md p-4 flex items-center justify-between border-t border-dark-purple-500 transition-opacity duration-300 opacity-100 z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>

              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {isMuted || volume === 0 ? <MuteIcon /> : <VolumeIcon />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-dark-purple-400 rounded-lg appearance-none cursor-pointer accent-white hover:accent-dark-purple-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-200 text-xs font-bold tracking-wider">
                LIVE
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-video w-full rounded-2xl border border-dark-purple-600 bg-dark-purple-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-dark-purple-800 flex items-center justify-center mb-6 shadow-glow-purple">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            matepiee is currently Offline
          </h2>
          <p className="text-gray-400 max-w-md">
            I'll be back soon!{" "}
            <Link
              to="/register"
              className="font-medium text-dark-purple-300 hover:text-white transition-colors"
            >
              Register
            </Link>{" "}
            to get email notifications.
          </p>

          <a
            href={`https://twitch.tv/${STREAMER_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-all shadow-glow-purple hover:shadow-glow-purple-hover"
          >
            Go to Twitch Channel
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
