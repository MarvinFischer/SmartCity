<template>
  <q-page class="q-pa-md">
    <h4>Sensors</h4>
    <div v-if="isLoading">
      <q-spinner size="50px"></q-spinner>
    </div>
    <div v-else class="sensor-element-grid">     

    <template v-for="sensorType in sensorByTypes.keys()" :key="sensorType">
      
        <div class="item" v-for="(sensLabel, sensorValueIndex) in sensorByTypes.get(sensorType)![0].labels" 
        :key="sensorType+'-'+sensLabel" >
        <q-card>
        <q-card-section>
          <q-card-title>
           Type: {{ sensorType }}  ({{ sensorByTypes.get(sensorType)![0].units[sensorValueIndex] }})
          </q-card-title>
        </q-card-section>
          <q-card-section v-if="sensorsMap.get(sensorByTypes.get(sensorType)![0].instanceId) != null">      
            
            <BoxPlot 
            :data="sensorByTypes.get(sensorType)!" 
            :stats="getStats(sensorType)!"
            :data-index="sensorValueIndex"></BoxPlot>
          </q-card-section>         
          
        </q-card>

        <q-card class="q-my-sm"
        v-for="(si) in sensorByTypes.get(sensorType)" :key="si.instanceId"> 
        <q-card-section>
          <q-card-title>
           {{ si.instanceId }}
          </q-card-title>          
        </q-card-section>
          <div class="row">
            <div class="col">
              <q-card-section>
                <q-card-title>
                  {{ si.labels[sensorValueIndex] }}
                </q-card-title>
                <q-card-section>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          Min
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ sensorsMap.get(si.instanceId)!.min[sensorValueIndex].toFixed(2) }} {{getUnit(si.units[sensorValueIndex])}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          Q1
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ sensorsMap.get(si.instanceId)!.q1[sensorValueIndex].toFixed(2) }} {{getUnit(si.units[sensorValueIndex])}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          Median
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ sensorsMap.get(si.instanceId)!.median[sensorValueIndex].toFixed(2) }} {{getUnit(si.units[sensorValueIndex])}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          Q3
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ sensorsMap.get(si.instanceId)!.q3[sensorValueIndex].toFixed(2) }} {{getUnit(si.units[sensorValueIndex])}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          Max
                        </q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ sensorsMap.get(si.instanceId)!.max[sensorValueIndex].toFixed(2) }} {{getUnit(si.units[sensorValueIndex])}}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card-section>
            </div>
          </div>
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
  flex-direction: column;
  width: 100%;
  background-color: #f5f5f5;

  overflow: scroll;
  border: 1px solid #e0e0e0;
  height: 750px;

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
    this.isLoading = true;
    BackendApi.getSensors()
      .then((response) => {
        this.sensorInfos = response;
        this.sensorsMap.clear();
        this.sensorByTypes.clear();
       
        var counter = response.length;

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
            }).finally(() => {
              counter--;             
              if (counter === 0) {
                this.isLoading = false;
              }
            });
          
        });

      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getUnit(unit: string) {
      if (unit === 'celsius') {
        return '°C';
      }else if (unit === 'percent') {
        return '%';
      }
      return unit;
    },
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
    const isLoading = ref(true);
    return { sensorInfos, sensorsMap, sensorByTypes, isLoading };
  }
});
</script>
