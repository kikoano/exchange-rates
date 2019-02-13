<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col-md-3">
              <h4 v-if="$route.query.num == 1">Single графички приказ</h4>
              <h4 v-else-if="$route.query.num == 2">Double графички приказ</h4>
            </div>
            <div class="col-md-9">
              <div class="float-right">
                <analysis :values="values" :grapghData="data1"/>
                <date-range-picker
                  class="btnDateRange"
                  :dateMode="'2'"
                  :dateFrom="downloadFrom"
                  :dateTo="downloadTo"
                  @showFromToDate="showFromToDate"
                  @showFromPeriod="showFromPeriod"
                />
                <b-dropdown id="ddown1" text="Валути" class="m-md-2 myCard" variant="info">
                  <div class="d-flex flex-wrap bg-light collBack">
                    <div v-for="(value, key) in values" :key="key" class="p-2 border myItem">
                      {{key}}
                      <label class="switch">
                        <input
                          type="checkbox"
                          class="default"
                          v-model="values[key]"
                          :checked="value"
                        >
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </b-dropdown>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <line-graph
                v-bind:class="($route.query.num == 1 )?'singleTable' : 'doubleTable'"
                :chartdata="data1"
                :values="values"
                :num="$route.query.num"
                ref="canvas"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="$route.query.num == 2" class="row">
        <div class="col">
          <div class="row">
            <div class="col-md-12">
              <div class="float-right">
                <analysis :values="values2" :grapghData="data2"/>
                <date-range-picker
                  class="btnDateRange"
                  :dateMode="'2'"
                  :dateFrom="downloadFrom"
                  :dateTo="downloadTo"
                  @showFromToDate="showFromToDate2"
                  @showFromPeriod="showFromPeriod2"
                />
                <b-dropdown id="ddown2" text="Валути" class="m-md-2 myCard" variant="info">
                  <div class="d-flex flex-wrap bg-light collBack">
                    <div v-for="(value, key) in values2" :key="key" class="p-2 border myItem">
                      {{key}}
                      <label class="switch">
                        <input
                          type="checkbox"
                          class="default"
                          v-model="values2[key]"
                          :checked="value"
                        >
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </b-dropdown>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <line-graph
                class="doubleTable"
                :chartdata="data2"
                :values="values2"
                :num="$route.query.num"
                ref="canvas"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import LineGraph from "./LineGraph.vue";
import DateRangePicker from "./DateRangePicker.vue";
import Analysis from "./Analysis.vue";
export default {
  components: {
    DateRangePicker,
    LineGraph,
    Analysis
  },
  props: {
    exchangeRates: Array,
    downloadFrom: Object,
    downloadTo: Object
  },
  data() {
    return {
      data1: this.exchangeRates,
      data2: this.exchangeRates,
      values: {
        EUR: true,
        USD: false,
        GBP: false,
        CHF: false,
        SEK: false,
        NOK: false,
        JPY: false,
        DKK: false,
        CAD: false,
        AUD: false,
        BGN: false,
        CZK: false,
        HUF: false,
        PLN: false,
        RON: false,
        HRK: false,
        TRY: false,
        RUB: false,
        BRL: false,
        CNY: false,
        HKD: false,
        IDR: false,
        ILS: false,
        INR: false,
        KRW: false,
        MXN: false,
        MYR: false,
        NZD: false,
        PHP: false,
        SGD: false,
        THB: false,
        ZAR: false
      },
      values2: null
    };
  },
  mounted() {
    this.values2 = Object.assign({}, this.values);
  },
  watch: {
    values: {
      handler(val) {
        if (Object.values(val).filter(e => e).length == 0)
          this.values.EUR = true;
      },
      deep: true
    },
    values2: {
      handler(val) {
        if (Object.values(val).filter(e => e).length == 0)
          this.values2.EUR = true;
      },
      deep: true
    }
  },
  methods: {
    showFromToDate(from, to) {
      this.data1 = this.exchangeRates.filter(e =>
        moment(e["Datum"], "DD.MM.YYYY").isBetween(
          moment(from).subtract(1, "day"),
          to
        )
      );
    },
    showFromToDate2(from, to) {
      this.data2 = this.exchangeRates.filter(e =>
        moment(e["Datum"], "DD.MM.YYYY").isBetween(
          moment(from).subtract(1, "day"),
          to
        )
      );
    },
    showFromPeriod(from, to, period) {
      let diffrenceMonths = moment(to).diff(moment(from), "months", true);
      let months = [];
      for (let m = 0; m < diffrenceMonths; m += period) {
        months.push(
          moment()
            .subtract(m, "months")
            .startOf("day")
            .format("DD.MM.YYYY")
        );
      }
      this.data1 = this.exchangeRates.filter(e =>
        months.includes(moment(e["Datum"], "DD.MM.YYYY").format("DD.MM.YYYY"))
      );
    },
    showFromPeriod2(from, to, period) {
      let diffrenceMonths = moment(to).diff(moment(from), "months", true);
      let months = [];
      for (let m = 0; m < diffrenceMonths; m += period) {
        months.push(
          moment()
            .subtract(m, "months")
            .startOf("day")
            .format("DD.MM.YYYY")
        );
      }
      this.data2 = this.exchangeRates.filter(e =>
        months.includes(moment(e["Datum"], "DD.MM.YYYY").format("DD.MM.YYYY"))
      );
    }
  }
};
</script>
<style>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 25px;
  margin: 0px;
  bottom: -2px;
  left: 5px;
  float: right;
}

/* Hide default HTML checkbox */
.switch input {
  display: none;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 1.8px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input.default:checked + .slider {
  background-color: #444;
}
input.primary:checked + .slider {
  background-color: #2196f3;
}
input.success:checked + .slider {
  background-color: #8bc34a;
}
input.info:checked + .slider {
  background-color: #3de0f5;
}
input.warning:checked + .slider {
  background-color: #ffc107;
}
input.danger:checked + .slider {
  background-color: #f44336;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
  width: 70%;
  height: 70%;
}
.inlineBlock {
  display: inline-block;
}
.slider.round:before {
  border-radius: 50%;
}
.myItem {
  width: 105px;
  height: 32px;
  padding: 4px !important;
  font-size: 14px;
}
.myCard {
  width: 337px;
}
.collBack {
  padding: 0px 10px 0px 10px;
}
.singleTable {
  height: 700px;
}
.doubleTable {
  height: 400px;
}
</style>
