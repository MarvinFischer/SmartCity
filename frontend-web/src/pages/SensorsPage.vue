<template>
  <q-page class="q-pa-md">
    <h4>Sensors</h4>
    <div class="sensor-element-grid">

    <template v-for="sensorType in sensorByTypes.keys()" :key="sensorType">
      
        <div class="item" v-for="(sensLabel, sensorValueIndex) in sensorByTypes.get(sensorType)![0].labels" 
        :key="sensorType+'-'+sensLabel" >
        <q-card>
        <q-card-section>
          <q-card-title>
           Type: {{ sensorType }} 
          </q-card-title>
        </q-card-section>
          <q-card-section>
            <q-card-title>
              {{ sensLabel }} ({{ sensorByTypes.get(sensorType)![0].units[sensorValueIndex] }})
            </q-card-title>
          </q-card-section>
          <q-card-section v-if="sensorsMap.get(sensorByTypes.get(sensorType)![0].instanceId) != null">      
            
            <BoxPlot 
            :data="sensorByTypes.get(sensorType)!" 
            :stats="getStats(sensorType)!"
            :data-index="sensorValueIndex"></BoxPlot>
          </q-card-section>
          
        </q-card>
        </div>    

    </template>
  </div>
  </q-page>
</template>

<style lang="scss">
.sensor-element-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-gap: 20px;
  justify-content: center;
  align-items: center;
}
.item {
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;

  .q-card{
    width: 100%;  
  }
}
</style>

<script lang="ts">

import { defineComponent, reactive } from 'vue';
import { BackendApi } from 'src/utils/backendApi';
import { ref, Ref } from 'vue';
import { SensorInfo, SensorsInfo, SensorsStatistics } from 'src/utils/apiResponses';
import BoxPlot from 'src/components/BoxPlot.vue';
 
export default defineComponent({
  name: 'SensosPage',
  components: { BoxPlot },
  mounted() {

    BackendApi.getSensors()
      .then((response) => {
        this.sensorInfos = response;
        this.sensorsMap.clear();
        this.sensorByTypes.clear();
       

        response.forEach((sensorInfo) => {

          if (this.sensorByTypes.has(sensorInfo.typeId)) {
           
            this.sensorByTypes.get(sensorInfo.typeId)?.push(sensorInfo);
          } else {
            this.sensorByTypes.set(sensorInfo.typeId, [sensorInfo]);
          }

          BackendApi.getSensorStatistics(sensorInfo.instanceId)
            .then((statsResponse : SensorsStatistics) => {
              this.sensorsMap.set(sensorInfo.instanceId, statsResponse);
            })
            .catch((error) => {
              console.log(error);
            });
          
        });

      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getStats(type: string) {
      if(!this.sensorByTypes.has(type)) {
        return null;
      }
      const ids = this.sensorByTypes.get(type)?.map((sensorInfo) => sensorInfo.instanceId);
      const map = new Map<string, SensorsStatistics>();
      this.sensorsMap.forEach((value, key) => {
        if (ids?.includes(key)) {
          map.set(key, value);
        }
      });
      return map;
    }
  },
  setup () {
    const sensorInfos : Ref<SensorsInfo | null> = ref(null);     
    const sensorsMap = ref(new Map<string, SensorsStatistics>());
    const sensorByTypes = ref(new Map<string, SensorInfo[]>());
    return { sensorInfos, sensorsMap, sensorByTypes };
  }
});
</script>
