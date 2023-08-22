import { GrayscalePlugin } from "./plugins/grayscalePlugin";
import { PoseDetectionPlugin } from "./plugins/poseDetectionPlugin";
import {
  selectIsLocalVideoPluginPresent,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import React, { useEffect } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from "@mediapipe/tasks-vision"; // Update the correct import path
import {RendererCanvas2d} from "./plugins/rendererCanvas2d";

import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import * as tf from '@tensorflow/tfjs-core';
tfjsWasm.setWasmPaths(
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
      tfjsWasm.version_wasm}/dist/`);

import * as posedetection from '@tensorflow-models/pose-detection';
import * as mpPose from '@mediapipe/pose';

export const STATE = {
  camera: {targetFPS: 60, sizeOption: '640 X 480'},
  backend: '',
  flags: {},
  modelConfig: {}
};

export const grayScalePlugin = new PoseDetectionPlugin();
export function PluginButton({ plugin, name }) {
  const initMediapipe = async() => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    // const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    //   baseOptions: {
    //     modelAssetPath: `http://localhost:3000/model/pose_landmarker_lite.task`,
    //     delegate: "CPU",
    //     enableSmoothing: true,
    //   },
    //   runningMode: "IMAGE",
    //   numPoses: 1,
    //   enableSmoothing: true,
    // });

    const poseLandmarker = posedetection.createDetector("BlazePose", {
      runtime: 'mediapipe',
      modelType: 'lite',
      solutionPath:
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`
    });

    plugin.setPoseLandmarker(poseLandmarker);
  }

  useEffect(() => {
    initMediapipe();
  }, [])

  const isPluginAdded = useHMSStore(
    selectIsLocalVideoPluginPresent(plugin.getName())
  );
  const hmsActions = useHMSActions();

  const togglePluginState = async () => {
    if (!isPluginAdded) {
      await hmsActions.addPluginToVideoTrack(plugin);
    } else {
      await hmsActions.removePluginFromVideoTrack(plugin);
    }
  };

  return (
    <button id="grayscale-btn" className="btn" onClick={togglePluginState}>
      {`${isPluginAdded ? "Remove" : "Add"} ${name}`}
    </button>
  );
}
