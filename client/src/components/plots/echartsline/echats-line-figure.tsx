import ReactECharts from 'echarts-for-react';

export const generateLargeDataset = (numPoints: number): [number, number][] => {
  const data: [number, number][] = [];
  const start = Date.now();
  for (let i = 0; i < numPoints; i++) {
    data.push([start + i * 60000, Math.sin(i / 1000) * 50 + Math.random() * 10]);
  }
  return data;
};

export const LargeLineChart = () => {
  const data = generateLargeDataset(50000); // 50,000 points

  const options = {
    title: {
      text: 'High-Performance Line Chart (50k points)',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#999' } },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#999' } },
      splitLine: { show: true },
    },
    series: [
      {
        name: 'Price',
        type: 'line',
        data,
        showSymbol: false,
        sampling: 'lttb', // or 'average', 'max', 'min'
        progressive: 2000,
        lineStyle: {
          width: 1,
        },
      },
    ],
    animation: false,
    backgroundColor: '#111',
  };

  return (
    <ReactECharts option={options} style={{ height: 400, width: '100%' }} />
  );
};

