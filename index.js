import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlinePieChart, AiOutlineDownload } from "react-icons/ai";
import { ImEmbed2 } from "react-icons/im";

import  useWindowDimensions from './utils/useWindowDimensions';
import getColorRange from './utils/getColorRange';
import parseChartData from './utils/parseChartData';

import Card from './components/card';
import NivoLine from './components/nivoLine';
import NivoBar from './components/nivoBar';
import NivoPie from './components/nivoPie';
import Accordion from './components/accordion';
import Popup from './components/popup';
import Button from './components/button';

import './styles.css';

const FreeCharts = ({children}) => {
  const { height, width } = useWindowDimensions();
  const [isMount, setIsMount] = useState(null);

  const defaultData = 'Date,Value\n1-1-22,5\n1-2-22,10\n1-3-22,15\n1-4-22,35\n1-5-22,60';
  const defaultColors = ['#004E64', '#4d8af0', '#25A18E', '#8F8073'];
  const defaultBackgroundColor = '#ffffff';
  const defaultLabelColors = {inner: '#ffffff', outer: '#12130F'};
  const defaultGridlines = ['y', 'x'];
  const defaultAxisLabels = ['y', 'x'];
  const defaultAxes = ['y', 'x'];
  const defaultChartOptions = ['stacked', 'title'];
  const defaultChartTitle = 'Chart Title';

  const [inputData, setInputData] = useState(defaultData);
  const [chartColors, setChartColors] = useState(defaultColors);
  const [chartColorRange, setChartColorRange] = useState(getColorRange(defaultColors));
  const [chartBackgroundColor, setChartBackgroundColor] = useState(defaultBackgroundColor);
  const [chartLabelColors, setChartLabelColors] = useState(defaultLabelColors);
  const [editingColor, setEditingColor] = useState(null);
  const [gridlines, setGridlines] = useState(defaultGridlines);
  const [axisLabels, setAxisLabels] = useState(defaultAxisLabels);
  const [axes, setAxes] = useState(defaultAxes);
  const [chartOptions, setChartOptions] = useState(defaultChartOptions);
  const [axisLabelY, setAxisLabelY] = useState('');
  const [axisLabelX, setAxisLabelX] = useState('');

  //chart title
  const [chartTitle, setChartTitle] = useState(defaultChartTitle);
  const [refreshTitleOffset, setRefreshTitleOffset] = useState(false);

  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [snippet, setSnippet] = useState('');
  const [showEmbedPopup, setShowEmbedPopup] = useState(null);

  const [showDownloadPopup, setShowDownloadPopup] = useState(null);
  const [pngHeight, setPngHeight] = useState('');
  const [pngWidth, setPngWidth] = useState('');



  useEffect(() => {
    if (!isMount) {
      setIsMount(true);
    }
    else if (!chartData) {
      parseChartData(inputData, chartType)
        .then((newChartData) => {
          setChartData(newChartData);
          if (!axisLabelX) {
            setAxisLabelX(newChartData.headers[0]);
          }
          if (!axisLabelY) {
            setAxisLabelY(newChartData.headers[1]);
          }
        })
    }
  }, [isMount, inputData, chartType, chartData, axisLabelX, axisLabelY])



  const generateChartPNG = async (data) => {
    async function postData(url) {
       const response = await fetch(url, {
         method: 'POST',
         mode: 'cors',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({data: data})
       });
       return response.json();
     }
    return await postData('/api/generateChartPNG/');
  }


  const handleChange = (event) => {
    setInputData(event.target.value);
  }

  const handleTextInputChange = (event, field) => {
    if (field === "y-axis") {
      setAxisLabelY(event.target.value);
    }
    else if (field === "x-axis") {
      setAxisLabelX(event.target.value);
    }
    else if (field === "title") {
      setChartTitle(event.target.value);
      setRefreshTitleOffset(true);
    }
  }

  const handleClickGetEmbed = () => {
    const chartContainer = document.getElementById('chart-container');
    const chartElement = chartContainer.firstChild.firstChild.firstChild.cloneNode(true);
    let chartWidth = chartElement.getAttribute("width");
    let chartHeight = chartElement.getAttribute("height");
    //make responsive
    chartElement.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    chartElement.removeAttribute("width");
    chartElement.removeAttribute("height");
    setSnippet(chartElement.outerHTML);
    setShowEmbedPopup(true);
  }

  const handleConfirmDownload = () => {
    const chartContainer = document.getElementById('chart-container');
    const chartElement = chartContainer.firstChild.firstChild.firstChild.cloneNode(true);
    let chartWidth = chartElement.getAttribute("width");
    let chartHeight = chartElement.getAttribute("height");
    chartElement.setAttribute("height", pngHeight);
    chartElement.setAttribute("width", pngWidth);
    chartElement.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
    const serializedSVG = new XMLSerializer().serializeToString(chartElement);
    if (typeof window !== `undefined`) {
      const base64Data = window.btoa(serializedSVG);
      generateChartPNG(base64Data)
        .then((png) => {
          if (png.success) {
            let src = "data:image/png;base64,";
            src += png.data;
            let a = document.createElement('a');
            a.href = src;
            a.download = "chart.png";
            a.click();
          }
        })
    }
  }

  const handleClickDownload = () => {
    const chartContainer = document.getElementById('chart-container');
    const chartElement = chartContainer.firstChild.firstChild.firstChild.cloneNode(true);
    let chartWidth = chartElement.getAttribute("width");
    let chartHeight = chartElement.getAttribute("height");
    setPngWidth(Math.floor(chartWidth));
    setPngHeight(Math.floor(chartHeight));
    setShowDownloadPopup(true)
  }

  const handleClickCopy = () => {
    let chartSnippet = document.getElementById('chart-snippet');
    chartSnippet.select();
    document.execCommand('copy');
  }

  const handleGenerate = () => {
    parseChartData(inputData)
      .then((newChartData) => {
        setChartData(newChartData);
      })
  }

  const handleResetData = () => {
    setInputData(defaultData);
    parseChartData(defaultData)
      .then((newChartData) => {
        setChartData(newChartData);
        if (!axisLabelX) {
          setAxisLabelX(newChartData.headers[0]);
        }
        if (!axisLabelY) {
          setAxisLabelY(newChartData.headers[1]);
        }
      })
  }

  const handleResetOptions = () => {
    setChartBackgroundColor(defaultBackgroundColor);
    setChartColors(defaultColors);
    setChartColorRange(getColorRange(defaultColors));
    setChartLabelColors(defaultLabelColors);
    setGridlines(defaultGridlines);
    setAxes(defaultAxes);
    setChartOptions(defaultChartOptions);
    setEditingColor(null);
    setAxisLabelX(chartData.headers[0]);
    setAxisLabelY(chartData.headers[1]);
    setChartTitle(defaultChartTitle);
    setRefreshTitleOffset(true);
  }

  const showColorPicker = (colorIndex, colorType) => {
    switch (colorType) {
      case 'background':
        setEditingColor({color: chartBackgroundColor, index: colorIndex, type: 'background'});
        break;
      case 'chart':
        setEditingColor({color: chartColors[colorIndex], index: colorIndex, type: 'chart'});
        break;
      case 'labels':
        setEditingColor({color: chartLabelColors[colorIndex], index: colorIndex, type: 'labels'});
        break;
      default:
        break;
    }
  }

  const handleColorChange = (color) => {
    let newColors;
    switch (editingColor.type) {
      case 'background':
        setChartBackgroundColor(color.hex);
        break;
      case 'chart':
        newColors = [...chartColors];
        newColors[editingColor.index] = color.hex;
        setChartColors(newColors);
        setChartColorRange(getColorRange(newColors));
        break;
      case 'labels':
        newColors = {...chartLabelColors};
        newColors[editingColor.index] = color.hex;
        setChartLabelColors(newColors);
        break;
      default:
        break;
    }
    setEditingColor({index: editingColor.index, color: color.hex, type: editingColor.type});
  }

  const handleGridlineChange = (axis) => {
    if (gridlines.includes(axis)) {
      setGridlines(gridlines.filter(gridline => gridline !== axis));
    }
    else {
      setGridlines([...gridlines, axis]);
    }
  }

  const handleAxesChange = (axis) => {
    if (axes.includes(axis)) {
      setAxes(axes.filter(a => a !== axis));
    }
    else {
      setAxes([...axes, axis]);
    }
  }

  const handleAxisLabelsChange = (axis) => {
    if (axisLabels.includes(axis)) {
      setAxisLabels(axisLabels.filter(label => label !== axis));
    }
    else {
      setAxisLabels([...axisLabels, axis]);
    }
  }

  const handleChartOptionsChange = (option) => {
    if (chartOptions.includes(option)) {
      setChartOptions(chartOptions.filter(opt => opt !== option));
    }
    else {
      setChartOptions([...chartOptions, option]);
    }
  }

  const chartTypeConfig =
    <div style={{width: '100%'}}>
      <button
        style={chartType === 'line' ? {backgroundColor: 'var(--color-primary)', color: '#ffffff'} : {backgroundColor: '#ffffff', color: 'var(--color-primary)'}}
        className='freeCharts-button-square'
        onClick={() => setChartType('line')}>
        <AiOutlineLineChart size={'2em'} />
      </button>
      <button
        style={chartType === 'bar' ? {backgroundColor: 'var(--color-primary)', color: '#ffffff'} : {backgroundColor: '#ffffff', color: 'var(--color-primary)'}}
        className='freeCharts-button-square'
        onClick={() => setChartType('bar')}>
        <AiOutlineBarChart size={'2em'} />
      </button>
      <button
        style={chartType === 'pie' ? {backgroundColor: 'var(--color-primary)', color: '#ffffff'} : {backgroundColor: '#ffffff', color: 'var(--color-primary)'}}
        className='freeCharts-button-square'
        onClick={() => setChartType('pie')}>
        <AiOutlinePieChart size={'2em'} />
      </button>
    </div>;

  const inputDataConfig =
    <div className="freeCharts-config-content">
        <label style={{fontWeight: '600'}} htmlFor="message">Enter CSV Data:</label>
        <textarea name="message" id="message" rows="8" onChange={(e) => handleChange(e)} value={inputData} />
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}>
          <button className='freeCharts-button-rectangle' style={{width: '60%', marginLeft: '0', padding: '.5rem'}} onClick={handleGenerate}>Update Chart</button>
          <button className='freeCharts-button-rectangle' style={{width: '40%', marginRight: '0', backgroundColor: '#ffffff', color: 'var(--color-primary)', borderColor: 'var(--color-primary)'}} onClick={handleResetData}>Reset</button>
        </div>
    </div>;

  const optionsConfig =
    <div className="freeCharts-config-content">
      <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Background Color:</p>
      <button
        style={{backgroundColor: chartBackgroundColor, height: '25px', width: '25px'}}
        className='freeCharts-button-square'
        onClick={() => showColorPicker(0, 'background')}>
      </button>
      <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Chart Colors:</p>
      <button
        style={{backgroundColor: chartColors[0], height: '25px', width: '25px'}}
        className='freeCharts-button-square'
        onClick={() => showColorPicker(0, 'chart')}>
      </button>
      {chartType === 'pie' &&
        <>
          <button
            style={{backgroundColor: chartColors[1], height: '25px', width: '25px'}}
            className='freeCharts-button-square'
            onClick={() => showColorPicker(1, 'chart')}>
          </button>
          <button
            style={{backgroundColor: chartColors[2], height: '25px', width: '25px'}}
            className='freeCharts-button-square'
            onClick={() => showColorPicker(2, 'chart')}>
          </button>
          <button
            style={{backgroundColor: chartColors[3], height: '25px', width: '25px'}}
            className='freeCharts-button-square'
            onClick={() => showColorPicker(3, 'chart')}>
          </button>
        </>
      }
      <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Label Colors:</p>
      {['pie', 'bar'].includes(chartType) &&
        <button
          style={{backgroundColor: chartLabelColors.inner, height: '25px', width: '25px'}}
          className='freeCharts-button-square'
          onClick={() => showColorPicker('inner', 'labels')}>
        </button>
      }
      {['pie', 'line'].includes(chartType) &&
        <button
          style={{backgroundColor: chartLabelColors.outer, height: '25px', width: '25px'}}
          className='freeCharts-button-square'
          onClick={() => showColorPicker('outer', 'labels')}>
        </button>
      }
      {editingColor &&
        <>
          <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'}} onKeyDown={() => setEditingColor(null)} onClick={() => setEditingColor(null)} />
          <ChromePicker color={editingColor.color} onChangeComplete={handleColorChange} />
        </>
      }
      {['line', 'bar'].includes(chartType) &&
        <div style={{marginBottom: '.25rem'}}>
          <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Show Axes:</p>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <label style={{marginLeft: '5px'}} htmlFor="toggle-axes-x">X:</label>
            <input style={{marginLeft: '5px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-axes-x" checked={axes.includes("x")} onChange={() => handleAxesChange("x")} />
            <label style={{marginLeft: '15px'}} htmlFor="toggle-axes-y">Y:</label>
            <input style={{marginLeft: '5px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-axes-y" checked={axes.includes("y")} onChange={() => handleAxesChange("y")} />
          </div>
        </div>
      }
      {['line', 'bar'].includes(chartType) && axes && axes.length > 0 &&
        <div style={{marginBottom: '.25rem'}}>
          <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Axis Labels:</p>
          {axes.includes("x") &&
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '.25rem'}}>
              <label style={{marginLeft: '5px', width: '15px'}} htmlFor="toggle-axis-label-x">X:</label>
              <input style={{marginLeft: '10px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-axis-label-x" checked={axisLabels.includes("x")} onChange={() => handleAxisLabelsChange("x")} />
              <input style={{marginLeft: '10px'}} type="text" name="axis-label-x" id="axis-label-x" disabled={!axisLabels.includes("x")} onChange={(e) => handleTextInputChange(e, "x-axis")} value={axisLabelX} />
            </div>
          }
          {axes.includes("y") &&
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '.25rem'}}>
              <label style={{marginLeft: '5px', width: '15px'}} htmlFor="toggle-axis-label-y">Y:</label>
              <input style={{marginLeft: '10px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-axis-label-y" checked={axisLabels.includes("y")} onChange={() => handleAxisLabelsChange("y")} />
              <input style={{marginLeft: '10px'}} type="text" name="axis-label-y" id="axis-label-y" disabled={!axisLabels.includes("y")} onChange={(e) => handleTextInputChange(e, "y-axis")} value={axisLabelY} />
            </div>
          }
        </div>
      }
      {['line', 'bar'].includes(chartType) &&
      <div style={{marginBottom: '.25rem'}}>
        <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Show Gridlines:</p>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <label style={{marginLeft: '5px'}} htmlFor="toggle-gridlines-x">X:</label>
          <input style={{marginLeft: '5px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-gridlines-x" checked={gridlines.includes("x")} onChange={() => handleGridlineChange("x")} />
          <label style={{marginLeft: '15px'}} htmlFor="toggle-gridlines-y">Y:</label>
          <input style={{marginLeft: '5px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-gridlines-y" checked={gridlines.includes("y")} onChange={() => handleGridlineChange("y")} />
        </div>
      </div>
      }
      <div style={{marginBottom: '.25rem'}}>
        <p style={{marginBottom: '.25rem', fontWeight: '600'}}>Chart Options:</p>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '.25rem'}}>
          <label style={{marginLeft: '5px', width: '35px'}} htmlFor="toggle-chart-title">Title:</label>
          <input style={{marginLeft: '10px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-chart-title" checked={chartOptions.includes("title")} onChange={() => handleChartOptionsChange("title")} />
          <input style={{marginLeft: '10px'}} type="text" name="chart-title" id="chart-title" disabled={!chartOptions.includes("title")} onChange={(e) => handleTextInputChange(e, "title")} value={chartTitle} />
        </div>
      </div>
      {['line', 'bar'].includes(chartType) && chartData?.headers && chartData.headers.length > 2 &&
        <div style={{display: 'flex', alignItems: 'center'}}>
          <input style={{marginLeft: '10px', cursor: 'pointer', accentColor: 'var(--color-primary)'}} type="checkbox" id="toggle-options-stacked" checked={chartOptions.includes("stacked")} onChange={() => handleChartOptionsChange("stacked")} />
          <label style={{marginLeft: '5px'}} htmlFor="toggle-options-stacked">Stacked</label>
        </div>
      }
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '30px'}}>
        <button className='freeCharts-button-rectangle' style={{maxWidth: '60%', minWidth: '150px', backgroundColor: '#ffffff', color: 'var(--color-primary)', borderColor: 'var(--color-primary)'}} onClick={handleResetOptions}>Reset</button>
      </div>

    </div>;


  return (
    <div className='freeCharts-container'>
      <Card className='freeCharts-config'>
        <Accordion
          accordionContent={[
            {title: 'Chart Type', content: chartTypeConfig},
            {title: 'Data', content: inputDataConfig},
            {title: 'Options', content: optionsConfig}
          ]}
          name={`freeCharts-config-options`}
          preExpandedID={`freeCharts-config-options-0`}
        />
      </Card>
      <Card className='freeCharts-preview'>
        {chartData && chartType && chartType === 'line' &&
          <div id="chart-container" style={width < 780 ? {height: '250px'} : {height: '500px'}}>
            <NivoLine
              data={chartData}
              colors={chartColorRange}
              labelColors={chartLabelColors}
              backgroundColor={chartBackgroundColor}
              gridlines={gridlines}
              options={chartOptions}
              axisLabelX={axisLabels.includes('x') ? axisLabelX : null}
              axisLabelY={axisLabels.includes('y') ? axisLabelY : null}
              axes={axes}
              title={chartTitle}
              refreshTitleOffset={refreshTitleOffset}
              setRefreshTitleOffset={setRefreshTitleOffset}
             />
          </div>
        }
        {chartData && chartType && chartType === 'bar' &&
          <div id="chart-container" style={width < 780 ? {height: '250px'} : {height: '500px'}}>
            <NivoBar
              data={chartData}
              colors={chartColorRange}
              labelColors={chartLabelColors}
              backgroundColor={chartBackgroundColor}
              gridlines={gridlines}
              options={chartOptions}
              axisLabelX={axisLabels.includes('x') ? axisLabelX : null}
              axisLabelY={axisLabels.includes('y') ? axisLabelY : null}
              axes={axes}
              title={chartTitle}
              chartWidth={width}
              refreshTitleOffset={refreshTitleOffset}
              setRefreshTitleOffset={setRefreshTitleOffset}
            />
          </div>
        }
        {chartData && chartType && chartType === 'pie' &&
          <div id="chart-container" style={width < 780 ? {height: '250px'} : {height: '500px'}}>
            <NivoPie
              data={chartData}
              colors={chartColorRange}
              labelColors={chartLabelColors}
              backgroundColor={chartBackgroundColor}
              options={chartOptions}
              title={chartTitle}
              refreshTitleOffset={refreshTitleOffset}
              setRefreshTitleOffset={setRefreshTitleOffset}
             />
          </div>
        }
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
          <button className="freeCharts-button-rectangle" onClick={handleClickGetEmbed}><ImEmbed2 size={'1em'} /><span style={{marginLeft: '5px'}}>Embed</span></button>
          <button className="freeCharts-button-rectangle" onClick={handleClickDownload}><AiOutlineDownload size={'1em'} /><span style={{marginLeft: '5px'}}>Download</span></button>
        </div>
      </Card>
      <Popup showPopup={showDownloadPopup} setShowPopup={setShowDownloadPopup}>
        <h1 style={{textAlign: 'center', paddingBottom: '2rem'}}>Download Image</h1>
          <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <label htmlFor="downloadHeight">Height:</label>
              <input style={{maxWidth: '75px', margin: '10px'}} type="text" name="downloadHeight" placeholder="Height" onChange={(e) => setPngHeight(e.target.value)} value={pngHeight} />
              <p style={{margin: '0'}}>px</p>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <label htmlFor="downloadWidth">Width:</label>
              <input style={{maxWidth: '75px', margin: '10px'}} type="text" name="downloadWidth" placeholder="Width" onChange={(e) => setPngWidth(e.target.value)} value={pngWidth} />
              <p style={{margin: '0'}}>px</p>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
            <Button customMargin="10px" size="lg" textSize="lg" onClick={handleConfirmDownload}>Download PNG</Button>
            <Button outline customMargin="10px" size="lg" textSize="lg" onClick={() => setShowDownloadPopup(false)}>Close</Button>
          </div>
      </Popup>
      <Popup showPopup={showEmbedPopup} setShowPopup={setShowEmbedPopup}>
        <h1 style={{textAlign: 'center', paddingBottom: '2rem'}}>Embed Code</h1>
        {
          snippet && snippet !== '' &&
            <>
              <div className="contact-container">
                <div style={{width: '100%'}}>
                    <textarea name="chart-snippet" id="chart-snippet" rows="6" value={snippet} readOnly />
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', paddingTop: '2rem'}}>
                <Button customMargin="10px" size="lg" textSize="lg" onClick={handleClickCopy}>Copy to Clipboard</Button>
                <Button outline customMargin="10px" size="lg" textSize="lg" onClick={() => setShowEmbedPopup(false)}>Close</Button>
              </div>
            </>
        }
      </Popup>
    </div>

  )
}

export default FreeCharts
