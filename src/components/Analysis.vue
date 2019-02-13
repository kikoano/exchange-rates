<template>
  <b-dropdown text="Анализа" class="m-md-2 analiza" variant="success" @show="doAnalysis">
    <div class="d-flex flex-wrap bg-light collBack">
      <div v-for="d in analysedData" :key="d.average" class="p-2 border valAnl">
        <div class="bg-info text-white myVal">{{d.value}}</div>
        <div class="myValBody">
          Мин: {{d.dateMin}} {{d.min}}
          <br>
          Макс: {{d.dateMax}} {{d.max}}
          <br>
          Среден: {{d.average}}
        </div>
      </div>
    </div>
  </b-dropdown>
</template>
<script>
class AnalysedData {
  constructor(value, dateMin, dateMax, min, max, average) {
    this.value = value;
    this.dateMin = dateMin;
    this.dateMax = dateMax;
    this.min = min;
    this.max = max;
    this.average = average;
  }
}
export default {
  props: {
    values: Object,
    grapghData: Array
  },
  data() {
    return {
      analysedData: []
    };
  },
  methods: {
    doAnalysis() {
      this.analysedData = [];
      let usedValues = Object.entries(this.values)
        .filter(e => e[1])
        .map(e => e[0]);
      for (let v of usedValues) {
        let va = this.grapghData.filter(e => e["Oznaka"] == v);
        let sreden = va.map(e => Number(e["Sreden"])).flat();
        let min = Math.min(...sreden);
        let max = Math.max(...sreden);
        let average = (sreden.reduce((a, c) => a + c, 0) / sreden.length).toFixed(4);
        let dateMin = va.filter(e => e["Sreden"] == min)[0]["Datum"];
        let dateMax = va.filter(e => e["Sreden"] == max)[0]["Datum"];
        this.analysedData.push(
          new AnalysedData(v, dateMin, dateMax, min.toFixed(4), max.toFixed(4), average)
        );
      }
    }
  }
};
</script>
<style>
.analiza {
  width: 210px;
}
.valAnl {
  width: 190px;
}
.myVal {
  text-align: center;
}
.myValBody{
  padding: 5px;
  background-color: #EAEAEA;
  font-size: 14px;
}
</style>

