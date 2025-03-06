'use client';

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import React, { useEffect, useMemo, useRef } from 'react';
import { Chart } from 'react-chartjs-2';

import { FOOTBALL_END_MATCH_STATUS } from '@/constant/common';
import { INCIDENT_TYPE } from '@/models/common';
import { Incident, TimeLineChartProps } from '@/models/interface';
import { useTheme } from 'next-themes';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  annotationPlugin
);

const formatName = (name: string | undefined) => {
  if (!name) {
    return '';
  }

  return name.length > 18 ? `${name.slice(0, 18).trim()}...` : name;
}

const formatTime = (time: number | undefined) => {
  if (!time) {
    return '';
  }

  return time > 9 ? `${time}'` : ` ${time}'`;
}

const drawAnnotation = (incident: Incident) => {
  if (!document) {
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const headerLabels = {
    [INCIDENT_TYPE.GOAL]: 'GOAL',
    [INCIDENT_TYPE.CARD]: `${incident.incidentClass} CARD`,
    [INCIDENT_TYPE.SUBSTITUTION]: 'SUBSTITUTION',
    [INCIDENT_TYPE.VAR_DECISION]: 'VAR DECISION',
    [INCIDENT_TYPE.INJURY_TIME]: 'INJURY',
    [INCIDENT_TYPE.INGAMEPENALTY]: 'PENALTY',
    [INCIDENT_TYPE.CORNER]: 'CORNER',
  };

  const hasOnePlayer = [
    INCIDENT_TYPE.GOAL,
    INCIDENT_TYPE.CARD,
    INCIDENT_TYPE.INGAMEPENALTY,
  ].includes(incident.incidentType);

  const hasTowPlayers = [
    INCIDENT_TYPE.SUBSTITUTION,
    INCIDENT_TYPE.INJURY_TIME,
  ].includes(incident.incidentType);

  if (ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    const height = hasTowPlayers ? 90 : 70;
    ctx.fillRect(0, 0, 200, height); // x, y, width, height

    // Add header
    const text = (headerLabels[incident.incidentType] || '').toUpperCase();
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fff';
    const yHeader = hasTowPlayers || hasOnePlayer ? 30 : 45;
    ctx.fillText(text, 10, yHeader); // x, y

    // Add player name
    if (hasOnePlayer) {
      ctx.font = '14px Arial';
      const playerName = formatName(incident?.player?.name);
      ctx.fillText(playerName, 10, 50);
    }

    // Add 2 player names
    if (hasTowPlayers) {
      ctx.font = '14px Arial';
      const playerNameIn = formatName(incident?.playerIn?.name);
      const playerNameOut = formatName(incident?.playerOut?.name);
      ctx.fillText(playerNameIn, 10, 50);
      ctx.fillText(playerNameOut, 10, 70);
    }

    // Add time
    ctx.font = '18px Arial';
    ctx.fillStyle = '#11a320';
    ctx.fillRect(150, 18, 40, 40); // Green box for time
    ctx.fillStyle = '#fff'; // White text color
    const time = formatTime(incident?.time);
    ctx.fillText(time, 160, 45); // x, y (centered inside green box)
  }
  return canvas;
};

const TimeLineChart: React.FC<TimeLineChartProps> = React.memo(
  ({ labels = [], data = [], breakTime = '' }) => {
    const { resolvedTheme } = useTheme();

    const chartRef = useRef<ChartJS>();
    const fullTime = useMemo(
      () =>
        labels.reduce((max: number, num: number) => (num > max ? num : max), 0),
      [labels]
    );

    const createLineAnnotation = () => {
      const lastData = data[data.length - 1];
      return {
        type: 'line',
        borderColor: '#48FF5A',
        borderWidth: 2,
        yMin: -140,
        yMax: 140,
        xMin: lastData.x,
        xMax: lastData.x,
      };
    };

    const createAnnotations = () => {
      const annotationList = {} as any;
      data.map((item, index) => {
        item?.incidents?.map((incidentItem, incidentIndex) => {
          annotationList[`annotation_${index}_${incidentIndex}`] = {
            type: 'line',
            borderColor: resolvedTheme != 'light' ? '#272A31' : '#bac7e1',
            borderWidth: 1,
            borderDash: [4, 4],
            yMin: incidentItem.isHome ? 0 : -140,
            yMax: incidentItem.isHome ? 140 : 0,
            xMin: incidentItem.time,
            xMax: incidentItem.time,
            label: {
              display: true,
              content: () => {
                const image = new Image(15, 15);
                //remove substitution to chart
                if (incidentItem.incidentType === 'substitution') {
                  return;
                }
                if (incidentItem.incidentType) {
                  image.src = `/images/${incidentItem.incidentType}${
                    incidentItem.incidentClass
                      ? `-${incidentItem.incidentClass}`
                      : ''
                  }.svg`;
                }
                return image;
              },
              padding: 0,
              backgroundColor: 'transparent',
              position: incidentItem.isHome ? 'end' : 'start',
            },
            enter: ({ element }: any) => {
              if (incidentItem.incidentType === 'substitution') {
                return false;
              }
              const canvas = drawAnnotation(incidentItem);

              element.label.options.content = canvas;
              element.elements = element.elements.map((el: any) => {
                el.options.z = 9999;
                element.x = el.x;
                element.y = el.y;
                el.width = 200;
                el.height = 100;
                el.x = el.x > 200 ? el.x - 120 : el.x;
                el.y = incidentItem.isHome ? el.y : el.y - 45;
                return el;
              });
              return true;
            },
            leave: ({ element }: any, event: any) => {
              if (incidentItem.incidentType === 'substitution') {
                return false;
              }
              const image = new Image(15, 15);
              if (incidentItem.incidentType) {
                image.src = `/images/${incidentItem.incidentType}${
                  incidentItem.incidentClass
                    ? `-${incidentItem.incidentClass}`
                    : ''
                }.svg`;
              }

              element.elements = element.elements.map((el: any) => {
                el.options.z = 0;
                el.width = 15;
                el.height = 15;
                el.x = element.x;
                el.y = element.y;
                return el;
              });
              element.label.options.content = image;
              return false;
            },
          };
        });
      });

      if (
        !FOOTBALL_END_MATCH_STATUS.includes(breakTime) &&
        breakTime !== 'HT'
      ) {
        annotationList['lineAnnotation'] = createLineAnnotation();
      }

      return annotationList;
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 1000,
      },
      layout: {
        padding: {
          top: 10,
          right: 7,
        },
      },
      plugins: {
        annotation: {
          annotations: createAnnotations(),
        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        xAxisLine: {
          type: 'linear' as const,
          ticks: {
            stepSize: 15,
            includeBounds: false,
            callback: function (value: any) {
              return value === 45
                ? 'HT'
                : value === 0 || value > 90
                ? ''
                : `${value}'`;
            },
          },
          border: {
            display: false,
          },
          grid: {
            color: resolvedTheme != 'light' ? '#091557' : '#f0f0f0',
            lineWidth: function (context: any) {
              return context?.tick?.value > 90 ? 0 : 2;
            },
          },
          min: 0,
          max: fullTime > 90 ? fullTime : 90,
        },
        yAxisLine: {
          type: 'linear' as const,
          offset: true,
          ticks: {
            display: false,
            beginAtZero: true,
          },
          border: {
            display: false,
          },
          grid: {
            color: function (context: any) {
              return context.tick.value === 0
                ? resolvedTheme != 'light'
                  ? '#272A31'
                  : '#d9d9db'
                : '';
            },
            lineWidth: function (context: any) {
              return context.tick.value === 0 ? 1 : 0;
            },
          },
          min: -140,
          max: 140,
        },
      },
    };

    const plugins = [
      {
        id: 'lineChartRender',
        afterDatasetsDraw: (chart: any) => {
          const { ctx } = chart;
          const yAxis = chart.scales['yAxisLine'];
          const yPos = yAxis.getPixelForValue(0);
          ctx.save();
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, '#2187E5');
          gradient.addColorStop(yPos / chart.height, '#2187E5');
          gradient.addColorStop(yPos / chart.height, '#F6B500');
          gradient.addColorStop(1, '#F6B500');
          chart.data.datasets[0].borderColor = gradient;
          chart.data.datasets[0].pointBackgroundColor = gradient;
          ctx.restore();
        },
      },
    ];

    const getChartData = () => {
      return {
        labels,
        datasets: [
          {
            xAxisID: 'xAxisLine',
            yAxisID: 'yAxisLine',
            data,
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
            hoverRadius: 6,
            hitRadius: 20,
            pointBorderColor: '#fff',
          },
        ],
      };
    };

    useEffect(() => {
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.update();
        }
      }, 100);
    }, []);

    return (
      <Chart
        ref={chartRef}
        type='line'
        data={getChartData()}
        options={options}
        plugins={plugins}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps?.labels === nextProps.labels &&
      prevProps?.data === nextProps.data
    );
  }
);

TimeLineChart.displayName = 'TimeLineChart';

export default TimeLineChart;
