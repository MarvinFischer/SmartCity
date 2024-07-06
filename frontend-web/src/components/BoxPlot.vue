<template>
    <div>    
      {{ stats }}
      <canvas ref="chartRef" width="400" height="400"></canvas>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, watch } from 'vue';
  import { Bar } from 'vue-chartjs';
  import { BoxPlotChart } from '@sgratzl/chartjs-chart-boxplot';
  import { ref, Ref } from 'vue';
  import { Chart, LinearScale, CategoryScale } from 'chart.js';
  import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { SensorInfo, SensorsStatistics } from 'src/utils/apiResponses';

  Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);
  
  

  export default defineComponent({
    name: 'BoxPlot',
    components: {
   
    },
    props: {
      data: {
        type: Object as PropType< SensorInfo[]>,
        required: true,
      },
      dataIndex: {
        type: Number,
        required: true,
      },
      stats: {
        type: Object as PropType<Map<string, SensorsStatistics>>,
        required: true,
      },
    },
    setup() {
      const canvas: Ref<HTMLCanvasElement | null> = ref(null);
        const chart = ref<Chart | null>(null);
      return {
        chart,
        canvas,
      };
    },
    mounted() {
      this.canvas = this.$refs.chartRef as HTMLCanvasElement;
      
      this.renderChart(this.generateData());
    },
    methods: {
      renderChart(data: any) {
        if(!this.canvas) {
          return;
        }
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
          this.chart = new Chart(ctx, {
            type: 'boxplot',
            data: data,
           
          });

        }
      },
      generateData() {

     

        const res = this.data.map(
          (sensorInfo) => {
            const id =  sensorInfo.instanceId
            const unit = sensorInfo.units[this.dataIndex];
            const label = sensorInfo.labels[this.dataIndex];
            const statics = this.stats.get(id);
            return {
              stats: statics,
              id,
              unit,
              label,
            };
          }
        )

        const data = res.map((sensor) => {          
          return {
            min: sensor.stats?.min[this.dataIndex],
            q1: sensor.stats?.q1[this.dataIndex],
            median: sensor.stats?.median[this.dataIndex],
            q3: sensor.stats?.q3[this.dataIndex],
            max: sensor.stats?.max[this.dataIndex],
          };
        });

        return {
        labels: res.map((sensor) => sensor.id + ' - ' + sensor.unit),      
        datasets: [
          {
            label: 'Dataset 1',
            borderWidth: 1,
            itemRadius: 2,
            itemStyle: 'circle',
            itemBackgroundColor: '#000',
            outlierBackgroundColor: '#000',
            data: data,
          },
        ],
      };
      },
    },
  });
  </script>
  
  <style scoped>
  </style>
  