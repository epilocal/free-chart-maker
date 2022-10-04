import React, { useState, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';

const NivoLine = ({ data, colors, labelColors, backgroundColor, gridlines, options, axisLabelX, axisLabelY, axes, title, refreshTitleOffset, setRefreshTitleOffset }) => {
  //center chart title https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const [titleOffset, setTitleOffset] = useState(0);
  const [titleOffsetSet, setTitleOffsetSet] = useState(false);
  const titleWidthRef = useCallback(node => {
    if (node !== null) {
      if (!titleOffsetSet || refreshTitleOffset) {
        setTitleOffset(-50 - (node.getBoundingClientRect().width / 2));
        setTitleOffsetSet(true);
        setRefreshTitleOffset(false);
      }
    }
  }, [titleOffsetSet, refreshTitleOffset, setRefreshTitleOffset]);

  const chartTitle = ({ width, height }) => {
    const style = {fontWeight: 'bold'}
    if (options.includes('title') && title) {
      return (
        <text
          ref={titleWidthRef}
          x={width / 2}
          y={-30}
          style={style}
          id="chart-title"
          transform={`translate(${titleOffset})`}>
            {title}
        </text>
      )
    }
    else {
      return null;
    }
  }

  return (
    <ResponsiveLine
           data={data.line[0].id ? data.line : [{id: data.headers[1], data: data.line}]}
           margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
           enablePointLabel={true}
           layers={['grid', 'markers', 'axes', 'areas', 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends', chartTitle]}
           theme={{
             background: backgroundColor,
              dots: {
                  text: {
                      fill: labelColors.outer,
                  },
              },
          }}
           yScale={{
               type: 'linear',
               min: 'auto',
               max: 'auto',
               stacked: options && options.includes("stacked") ? true : false,
               reverse: false
           }}
           axisBottom={axes && axes.includes("x") ? {
               orient: 'bottom',
               tickSize: 5,
               tickPadding: 5,
               tickRotation: 0,
               legend: axisLabelX,
               legendOffset: 36,
               legendPosition: 'middle'
           } : null}
           axisLeft={axes && axes.includes("y") ? {
               orient: 'left',
               tickSize: 5,
               tickPadding: 5,
               tickRotation: 0,
               legend: axisLabelY,
               legendOffset: -40,
               legendPosition: 'middle'
           } : null}
           colors={colors}
           enablePoints={true}
           pointLabelYOffset={-12}
           pointSize={10}
           isInteractive={false}
           enableGridY={gridlines && gridlines.includes("y") ? true : false}
           enableGridX={gridlines && gridlines.includes("x") ? true : false}
       />
  )
}

export default NivoLine;
