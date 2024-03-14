import React, { useReducer, useEffect, useMemo } from "react";
import styles from './Progress.module.css'

const configure = {
  viewPortWidth: 100,
  viewPortHeight: 100,
  circleStrokeWidth: 5,
};

const getViewBox = (width, height) => `0 0 ${width} ${height}`;
const getPercentage = (number) =>
  number > 100 ? 100 : number < 0 ? 0 : number;

const initialState = {
  circle: {
    cx: configure.viewPortWidth / 2,
    cy: configure.viewPortHeight / 2,
    r: configure.viewPortWidth / 2 - configure.circleStrokeWidth,
    strokeWidth: configure.circleStrokeWidth,
  },
  svg: {
    width: configure.viewPortWidth,
    height: configure.viewPortHeight,
    viewPortWidth: configure.viewPortWidth,
    viewPortHeight: configure.viewPortHeight,
  },
  strokeDasharray: "0 1000",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STROKE":
      return { ...state, strokeDasharray: action.payload };
    default:
      return state;
  }
};

const Progress = ({
  width,
  height,
  strokeColor,
  isTextShown,
  number,
  children,
}) => {
  const [{ circle, svg, strokeDasharray }, dispatch] = useReducer(
    reducer,
    initialState
  );

  console.log("render");
  const getStoke = useMemo(() => {
    const percentage = getPercentage(number);
    const perimeter = Math.PI * 2 * circle.r;
    const path = Math.floor((perimeter * percentage) / 100);
    const fPerimeter = Math.ceil(perimeter);
    return `${path} ${fPerimeter}`;
  }, [number, circle.r]);

  useEffect(() => {
    dispatch({ type: "SET_STROKE", payload: getStoke });
  }, [getStoke]);

  return (
    <div className={styles["my-progress-container"]}>
      <div>
        <svg
          className={styles["my-progress-bar"]}
          viewBox={getViewBox(svg.viewPortWidth, svg.viewPortHeight)}
          width={width || svg.width}
          height={height || svg.height}
        >
          <circle className={styles["circle-bg"]} {...circle}></circle>
          <circle
            className={styles["circle-path"]}
            {...circle}
            style={{
              strokeDasharray: strokeDasharray,
              stroke: strokeColor || "#5116d0",
            }}
          ></circle>
          {isTextShown && (
            <text className={styles["progress-text"]} x={circle.cx} y={circle.cy}>
              {getPercentage(number)} %
            </text>
          )}
        </svg>
      </div>
      <div className={styles["my-progress-content"]}>{children}</div>
    </div>
  );
};

export default Progress;
