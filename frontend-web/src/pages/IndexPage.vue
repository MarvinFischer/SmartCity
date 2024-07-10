<template>
  <q-page class="q-pa-md">

    <h4>AI State</h4>
    <div>
      Current State: {{ aiState?.iterationState }}
    </div>

    <q-btn-toggle
      v-model="isTurnedOn"
      toggle-color="primary"
      @update:model-value="updateAiStatus"
      :options="[
        {label: 'On', value: true},
        {label: 'Off', value: false},
      ]"
    />

    <h4>Actuators</h4>

    <div class="sensor-element-grid">
      <div v-for="actuator in actuatorList" :key="actuator.id" class="item">
        <q-card>
          <q-card-section class="bg-primary text-white flex row">
            <q-card-title style="flex: 1;">
              <div>
                Type: {{ actuator.type }}
              </div>
              <div>
                ID: {{ actuator.id }}
              </div>              
            </q-card-title>   
            <div>
              <template v-if="actuator.type === 'fans'">
                <q-btn @click="toogleFanState(actuator)">{{ getFanState(actuator)?.state.turnedOn? 'ON':'OFF'  }}</q-btn>
              </template>
              <template v-else-if="actuator.type === 'windows'">
                <q-btn @click="toogleWindowState(actuator)">{{ getWindowState(actuator)?.state.open? 'OPEN':'CLOSED'  }}</q-btn>
              </template>
              
            </div>
          </q-card-section>
          <q-card-section>
            <template v-if="actuator.type === 'fans'">
              <div class="text-bold">State</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Turned On
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.state.turnedOn }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="text-bold">Turn On</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Temperature
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.meta.turnOn.minTemp.value }}°C (
                        {{ sensorsMap.get(getFanState(actuator)?.meta.turnOn.minTemp.sensors[0]!)?.avg[0].toFixed(1)}}°C 
                        )   
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Humidity
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.meta.turnOn.minHumidity.value }}% (
                        {{ sensorsMap.get(getFanState(actuator)?.meta.turnOn.minHumidity.sensors[0]!)?.avg[0].toFixed(1)}}°% 
                        )      
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Only on Days
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.meta.turnOn.onlyOnDays.join(', ') }} 
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="text-bold">Turn Off</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Temperature
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.meta.turnOff.maxTemp.value }}°C (
                        {{ sensorsMap.get(getFanState(actuator)?.meta.turnOff.maxTemp.sensors[0]!)?.avg[0].toFixed(1)}}°C 
                        )                       
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Humidity
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getFanState(actuator)?.meta.turnOff.maxHumidity.value }}% (
                        {{ sensorsMap.get(getFanState(actuator)?.meta.turnOff.maxHumidity.sensors[0]!)?.avg[0].toFixed(1)}}°% 
                        )
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
            <template v-else-if="actuator.type === 'windows'">
              <div class="text-bold">State</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Open
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.state.open }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="text-bold">Open</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Temperature
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.open.minTemp.value }}°C (
                        {{ sensorsMap.get(getWindowState(actuator)?.meta.open.minTemp.sensors[0]!)?.avg[0].toFixed(1)}}°C 
                        )
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Humidity
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.open.minHumidity.value }}% (
                        {{ sensorsMap.get(getWindowState(actuator)?.meta.open.minHumidity.sensors[0]!)?.avg[0].toFixed(1)}}%
                      )
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Only on Days
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.open.onlyOnDays.join(', ') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Check Outside Temp
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.open.checkOutsideTemp.value }}, with a threshold of {{ getWindowState(actuator)?.meta.open.checkOutsideTemp.delta }}°C (
                        {{ sensorsMap.get(getWindowState(actuator)?.meta.open.checkOutsideTemp.sensors[0]!)?.avg[0].toFixed(1)}}°C
                      )
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <div class="text-bold">Close</div>
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Temperature
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.close.maxTemp.value }}°C (
                        {{ sensorsMap.get(getWindowState(actuator)?.meta.close.maxTemp.sensors[0]!)?.avg[0].toFixed(1)}}°C 
                      )
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      Humidity
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ getWindowState(actuator)?.meta.close.maxHumidity.value }}% (
                        {{ sensorsMap.get(getWindowState(actuator)?.meta.close.maxHumidity.sensors[0]!)?.avg[0].toFixed(1)}}%
                      )
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
        
          </q-card-section>
        </q-card>
      </div>
    </div>
    

  </q-page>
</template>

<style lang="scss">
.sensor-element-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  grid-gap: 20px;
}
.item {
  display: flex;
  width: 100%;
  

  .q-card{
    width: 100%;  
  }
}
</style>

<script lang="ts">

import { defineComponent } from 'vue';
import { BackendApi } from 'src/utils/backendApi';
import { ref, Ref } from 'vue';
import { ActuatorListItem, ActuatorStateResponse, FanMeta, FanState, WindowState, WindowMeta, SensorsStatistics, AiStateResponse } from 'src/utils/apiResponses';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  mounted() {
    this.refreshData();
    // refresh data every 1 second
    this.intervalInstance = setInterval(() => {
      this.refreshData();
    }, 1000);
  },
  beforeUnmount() {
    if (this.intervalInstance) {
      clearInterval(this.intervalInstance);
    }
  },
  methods: {
    toogleFanState(actuator: ActuatorListItem) {
      const fanState = this.getFanState(actuator)?.state.turnedOn;
      const newState = {
        turnedOn: !fanState        
      }
      
        BackendApi.setActuatorState(actuator.type, actuator.id, newState);
      
    },
    toogleWindowState(actuator: ActuatorListItem) {
      const windowState = this.getWindowState(actuator);
      const newState = {
        open: !windowState?.state.open
      }
        BackendApi.setActuatorState(actuator.type, actuator.id, newState);
     
    },
    refreshData(){
      BackendApi.getAiStatus().then((response) => {
      this.isTurnedOn = response.state === 'enabled';
      this.aiState = response;
    });
    BackendApi.getActuators().then((response) => {
      this.actuatorList = response.actuators;
      this.actuatorList.forEach((actuator) => {
        BackendApi.getActuator(actuator.type, actuator.id).then((accResponse) => {
          this.actuatorState.set(actuator.id,accResponse);
          // load senosr statistics
          if (actuator.type === 'fans') {
            this.loadFanStateSensors(actuator);
          } else if (actuator.type === 'windows') {
            this.loadWindowStateSensors(actuator);
          }
        });
      });
    });
    },
    getState(actuator: ActuatorListItem) {
      return this.actuatorState.get(actuator.id);
    },
    loadFanStateSensors(actuator: ActuatorListItem){
      const temp1 = this.getFanState(actuator)?.meta.turnOn.minTemp.sensors;
      const humidity1 = this.getFanState(actuator)?.meta.turnOn.minHumidity.sensors;
      const temp2 = this.getFanState(actuator)?.meta.turnOff.maxTemp.sensors;
      const humidity2 = this.getFanState(actuator)?.meta.turnOff.maxHumidity.sensors;

      if(!temp1 || !humidity1 || !temp2 || !humidity2) {
        return;
      }
      // merge all sensors into a array with unique values
      const sensors = Array.from(new Set([...temp1, ...humidity1, ...temp2, ...humidity2]));
      sensors.forEach((sensor) => {
        BackendApi.getSensorStatistics(sensor).then((response) => {
          this.sensorsMap.set(sensor, response);
        });
      });
    },
    loadWindowStateSensors(actuator: ActuatorListItem){
      const temp1 = this.getWindowState(actuator)?.meta.open.minTemp.sensors;
      const humidity1 = this.getWindowState(actuator)?.meta.open.minHumidity.sensors;
      const temp2 = this.getWindowState(actuator)?.meta.close.maxTemp.sensors;
      const humidity2 = this.getWindowState(actuator)?.meta.close.maxHumidity.sensors;
      const temp3 = this.getWindowState(actuator)?.meta.open.checkOutsideTemp.sensors;


      if(!temp1 || !humidity1 || !temp2 || !humidity2 || !temp3) {
        return;
      }
      // merge all sensors into a array with unique values
      const sensors = Array.from(new Set([...temp1, ...humidity1, ...temp2, ...humidity2, ...temp3]));
      sensors.forEach((sensor) => {
        BackendApi.getSensorStatistics(sensor).then((response) => {
          this.sensorsMap.set(sensor, response);
        });
      });
    },
    getFanState(actuator: ActuatorListItem) {
      const v = this.getState(actuator);
      if (v) {
        return v as ActuatorStateResponse<FanMeta, FanState>;
      }
      return null;
    },
    getWindowState(actuator: ActuatorListItem) {
      const v = this.getState(actuator);
      if (v) {
        return v as ActuatorStateResponse<WindowMeta, WindowState>;
      }
      return null;
    },
    updateAiStatus(value: boolean) {
      if(value){
        BackendApi.turnOnAi();
        if (this.aiState && this.aiState.state != null){
          this.aiState.state = 'enabled';
        }
      } else {
        BackendApi.turnOffAi();
        if (this.aiState && this.aiState.state != null){
          this.aiState.state = 'disabled';
        }
      }
      
    }
  },
  setup () {
    const actuatorList : Ref<ActuatorListItem[]> = ref([]);     
    const actuatorState: Ref<Map<string, ActuatorStateResponse<any, any>>> = ref(new Map());
    const sensorsMap = ref(new Map<string, SensorsStatistics>());
    const isTurnedOn = ref(false);
    const intervalInstance : Ref<NodeJS.Timeout|null> = ref(null);
    const aiState: Ref<AiStateResponse|null> = ref(null);
    return { actuatorList, actuatorState, sensorsMap, isTurnedOn, aiState, intervalInstance};
  }
});
</script>
