import Papa from 'papaparse';

let chartMapping = {
  line: {
    headers: ["x", "y"]
  },
  bar: {
    headers: ["id", "value"]
  },
  pie: {
    headers: ["id", "value"]
  }
}


export default function parseChartData(csvString) {
  let parsedChartData = {line: {}, bar: {}, pie: {}, headers: []}

  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      complete: async results => {
        parsedChartData.headers = results.meta.fields;
        //overwrite default chartMapping headers
        chartMapping.bar.headers = results.meta.fields;
        chartMapping.pie.headers = results.meta.fields;

        await Promise.all(Object.keys(chartMapping).map(async (key) => {
          Papa.parse(csvString, {
            header: true,
            complete: finalResults => {
              if (key === 'line') {
                let lineData = [];
                results.meta.fields.forEach((header, i) => {
                  //skip first header
                  if (i > 0) {
                    let lineObject = {id: header, data: []};
                    results.data.forEach((lineRow) => {
                      lineObject.data.push({x: lineRow[results.meta.fields[0]], y: lineRow[header]})
                    });
                    lineData.push(lineObject);
                  }
                });
                parsedChartData[key] = lineData;
              }
              else {
                parsedChartData[key] = finalResults.data;
              }
            },
            transformHeader:function(header, i) {
              if (results.meta.fields.length < 3) {
                return chartMapping[key].headers[i];
              }
              else { return header }
            }
          });
        }));
        resolve(parsedChartData);
      },
      error: err => {
        reject(err)
      }
    });
  })
}
