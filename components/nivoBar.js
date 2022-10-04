import React, { useState, useCallback } from 'react';
import { ResponsiveBar } from '@nivo/bar';

const NivoBar = ({ data, colors, labelColors, backgroundColor, gridlines, options, axisLabelX, axisLabelY, axes, title, refreshTitleOffset, setRefreshTitleOffset}) => {
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
    <ResponsiveBar
        data={data.bar}
        theme={{
          background: backgroundColor
        }}
        keys={data.headers.slice(1)}
        indexBy={data.headers[0]}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', chartTitle]}
        padding={0.3}
        colors={colors}
        colorBy={'id'}
        isInteractive={false}
        groupMode={options && options.includes("stacked") ? 'stacked' : 'grouped'}
        axisBottom={axes && axes.includes("x") ? {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: axisLabelX,
            legendPosition: 'middle',
            legendOffset: 32
        } : null}
        axisLeft={axes && axes.includes("y") ? {
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: axisLabelY,
            legendPosition: 'middle',
            legendOffset: -40
          } : null
        }
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={labelColors.inner}
        enableGridY={gridlines && gridlines.includes("y") ? true : false}
        enableGridX={gridlines && gridlines.includes("x") ? true : false}
    />
  )
}

export default NivoBar;
