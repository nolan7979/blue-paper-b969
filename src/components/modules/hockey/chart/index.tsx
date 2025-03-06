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

const BkbTimeLineChart: React.FC<TimeLineChartProps> = React.memo(
  ({ labels = [], data = [], breakTime = '' }) => {
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
        borderColor: '#fff',
        borderWidth: 0,
        yMin: -30,
        yMax: 30,
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
            borderColor: '#272A31',
            borderWidth: 1,
            borderDash: [4, 4],
            yMin: incidentItem.isHome ? 0 : -30,
            yMax: incidentItem.isHome ? 30 : 0,
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
                  image.src = `/images/${incidentItem.incidentType}${incidentItem.incidentClass
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

          external: function (context: any) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (tooltipEl) {
              tooltipEl.style.zIndex = '9999'; // Set your desired z-index here
            }
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML =
                '<div class="chart-tooltip-container"></div>';
              document.body.appendChild(tooltipEl);
            }

            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            if (tooltipModel.body) {
              let innerHtml = '';

              if (context.tooltip.dataPoints.length <= 0) {
                return;
              }

              if (context.tooltip.dataPoints[0].raw.incidents.length > 0) {
                innerHtml += '<div class="chart-tooltip-content">';
                context.tooltip.dataPoints[0].raw.incidents.forEach(function (
                  item: Incident
                ) {
                  if (item.incidentType !== INCIDENT_TYPE.SUBSTITUTION) {
                    const content = renderIncidentTooltip(item);
                    innerHtml += `<div class="chart-tooltip-item">${content}</div>`;
                  }
                });
                innerHtml += '</div>';
              }
              const divRoot = tooltipEl.querySelector('div');
              if (divRoot) {
                divRoot.innerHTML = innerHtml;
              }
            }

            const position = context.chart.canvas.getBoundingClientRect();

            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.padding =
              tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
            tooltipEl.style.pointerEvents = 'none';
          },
        },
      },
      scales: {
        xAxisLine: {
          type: 'linear' as const,
          ticks: {
            stepSize: 10,
            includeBounds: false,
            callback: function (value: any) {
              return value === 40 ? 'FT' : `${value}'`;
            },
          },
          border: {
            display: false,
          },
          grid: {
            color: '#091557',
            lineWidth: function (context: any) {
              return context?.tick?.value > 40 ? 0 : 2;
            },
          },
          min: 0,
          max: fullTime > 40 ? fullTime : 40,
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
              return context.tick.value === 0 ? '#272A31' : '';
            },
            lineWidth: function (context: any) {
              return context.tick.value === 0 ? 1 : 0;
            },
          },
          min: -30,
          max: 30,
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
            data: [{ x: 0, y: data[0].y, incidents: [] }, ...data],
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

    const renderIncidentTooltip = (incident: Incident) => {
      const time = `<span class="time">${incident?.time}'</span>`;
      const playerName = (name?: string) =>
        name && `<span class="player-name">${name}'</span>`;
      switch (incident.incidentType) {
        case INCIDENT_TYPE.GOAL:
          return `<div class="chart-inner">
                    <span class="title">GOAL</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.CARD:
          return `<div class="chart-inner">
                    <span class="title">${incident.incidentClass} CARD</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.SUBSTITUTION:
          return `<div class="chart-inner">
                    <span class="title">SUBSTITUTION</span>
                    ${playerName(incident?.playerIn?.name)}
                    ${playerName(incident?.playerOut?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.VAR_DECISION:
          return `<div class="chart-inner">
                    <span class="title">VAR DECISION</span>
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.INJURY_TIME:
          return `<div class="chart-inner">
                    <span class="title">INJURY</span>
                    ${playerName(incident?.playerIn?.name)}
                    ${playerName(incident?.playerOut?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.INGAMEPENALTY:
          return `<div class="chart-inner">
                    <span class="title">PENALTY</span>
                    ${playerName(incident?.player?.name)}
                  </div>
                  ${time}`;
        case INCIDENT_TYPE.CORNER:
          return `<div class="chart-inner"><span class="title">CORNER</span></div>${time}`;
        default:
          break;
      }
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
      prevProps?.labels === nextProps.labels && prevProps?.data === nextProps.data
    );
  }
);

BkbTimeLineChart.displayName = 'BkbTimeLineChart';

export default BkbTimeLineChart;
