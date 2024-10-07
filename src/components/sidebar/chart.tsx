import React, { useEffect } from "react";
// @ts-expect-error the
import Plotly from "plotly.js-dist";

export const Chart = () => {
  useEffect(() => {
    // Example data
    // @ts-expect-error the
    const time = [...Array(300).keys()];
    const angle = Array.from({ length: 300 }, () => Math.random() * 360);
    // Line plot for Angle vs Time
    const lineplotData = [
      {
        x: time,
        y: angle,
        type: "scatter",
        mode: "lines",
        line: { color: "black" },
      },
    ];

    const lineplotLayout = {
      title: "Angle over Time",
      xaxis: { title: "Time (sec)" },
      yaxis: { title: "Angle (degrees)" },
    };

    Plotly.newPlot("lineplot", lineplotData, lineplotLayout);
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div>
      <div id="lineplot" style={{ width: "345px", height: "300px" }}></div>
    </div>
  );
};
