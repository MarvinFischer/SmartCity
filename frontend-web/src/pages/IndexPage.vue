<template>
  <q-page class="">
    <h4>Sensors</h4>
    <div class="sensor-element-grid">


    <div class="item" v-for="sensorInfo in sensorInfos" :key="sensorInfo.instanceId">
      <q-card>
        <q-card-section>
          <q-card-title>
            {{ sensorInfo.instanceId }}
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-title>
            {{ sensorInfo.typeId }}
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-title>
            {{ sensorInfo.labels }}
          </q-card-title>
        </q-card-section>
        <q-card-section>
          <q-card-title>
            {{ sensorInfo.units }}
          </q-card-title>
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

import { defineComponent } from 'vue';
import { BackendApi } from 'src/utils/backendApi';
import { ref, Ref } from 'vue';
import { SensorsInfo } from 'src/utils/apiResponses';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  mounted() {

    BackendApi.getSensors()
      .then((response) => {
        this.sensorInfos = response;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('IndexPage mounted');
  },
  setup () {
    const sensorInfos : Ref<SensorsInfo | null> = ref(null);     
    return { sensorInfos };
  }
});
</script>
