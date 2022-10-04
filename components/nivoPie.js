import React, { useState, useCallback } from 'react';
import { ResponsivePie } from '@nivo/pie';

const NivoPie = ({ data, colors, labelColors, backgroundColor, options, title, refreshTitleOffset, setRefreshTitleOffset }) => {
  //center chart title https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  const [titleOffset, setTitleOffset] = useState(0);
  const [titleOffsetSet, setTitleOffsetSet] = useState(false);
  const titleWidthRef = useCallback(node => {
    if (node !== null) {
      if (!titleOffsetSet || refreshTitleOffset) {
        setTitleOffset(node.getBoundingClientRect().width / -2);
        setTitleOffsetSet(true);
        setRefreshTitleOffset(false);
      }
    }
  }, [titleOffsetSet, refreshTitleOffset, setRefreshTitleOffset]);

  const chartTitle = ({centerX}) => {
    const style = {fontWeight: 'bold'}
    if (options.includes('title') && title) {
      return (
        <text
          ref={titleWidthRef}
          x={centerX}
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
    <ResponsivePie
        data={data.pie}
        theme={{
          background: backgroundColor
        }}
        id={data.headers[0]}
        value={data.headers[1]}
        layers={['arcLinkLabels', 'arcs', 'arcLabels', 'legends', chartTitle]}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        colors={colors}
        arcLabelsTextColor={labelColors.inner}
        arcLinkLabelsTextColor={labelColors.outer}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        isInteractive={false}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
    />
  )
}

export default NivoPie;
