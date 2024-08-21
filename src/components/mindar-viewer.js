/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef } from "react";
import "aframe";
import "aframe-extras";
import "mind-ar/dist/mindar-image-aframe.prod.js";

export default () => {
  const sceneRef = useRef(null);
  const soundEntityRef = useRef(null);
  const audioStarted = useRef(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;

    if (sceneEl) {
      sceneEl.addEventListener("loaded", () => {
        const arSystem =
          sceneEl.systems && sceneEl.systems["mindar-image-system"];
        if (arSystem) {
          arSystem.start();
        }
      });
    }

    const myImageGroup = sceneEl.querySelector("[mindar-image-target]");
    const audio = soundEntityRef.current;

    const startAudio = () => {
      if (audio && !audioStarted.current) {
        audio.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
        audioStarted.current = true;
      }
    };

    const toggleAudio = () => {
      if (audio) {
        if (!audioStarted.current) {
          audio.play().catch((error) => {
            console.error("Failed to play audio:", error);
          });
          audioStarted.current = true;
        } else {
          audio.pause();
          audioStarted.current = false;
        }
      }
    };

    myImageGroup.addEventListener("targetFound", () => {
      if (myImageGroup) {
        myImageGroup.setAttribute("visible", "true");
        startAudio();
      }
    });

    myImageGroup.addEventListener("targetLost", () => {
      if (myImageGroup) {
        myImageGroup.setAttribute("visible", "false");
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          audioStarted.current = false;
        }
      }
    });

    document.addEventListener("click", toggleAudio);

    return () => {
      if (sceneEl && sceneEl.systems) {
        const arSystem = sceneEl.systems["mindar-image-system"];
        if (arSystem) {
          arSystem.stop();
        }
      }
      document.removeEventListener("click", toggleAudio);
    };
  }, []);

  return (
    <>
      <a-scene
        ref={sceneRef}
        mindar-image="imageTargetSrc: ./targets/wine_2.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no;"
        color-space="sRGB"
        embedded
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false">
        <a-assets>
          <img id="card" src="./targets/wine_2.jpg" />
          <a-asset-item
            id="avatarModel"
            src="./models/playingPiano.glb"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0">
          <a-entity
            look-controls
            gltf-model="./models/playingPiano.glb"
            position="0.2 -0.8 0.3"
            animation-mixer="loop: repeat"></a-entity>
          <audio
            id="background-music"
            ref={soundEntityRef}
            src="./sounds/piano.mp3"
            loop></audio>
        </a-entity>
      </a-scene>
    </>
  );
};
