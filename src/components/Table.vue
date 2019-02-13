<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <div class="col-md-3">
          <h4 v-if="$route.query.mode == null">Преглед за датум</h4>
          <h4 v-else-if="$route.query.mode == 1">Преглед контиуниран по датум</h4>
          <h4 v-else-if="$route.query.mode == 2">Преглед по пресечно датуми</h4>
        </div>
        <div class="col-md-9">
          <div class="float-right">
            <div v-if="$route.query.mode == 1" class="btn filter btnDateRange">
              <toggle-button :value="endOfMonth" @change="filterEndOfMonth" color="#007BFF"/>&nbsp;Последен ден од месец
            </div>
            <date-range-picker
              class="btnDateRange"
              :dateMode="$route.query.mode"
              :dateFrom="downloadFrom"
              :dateTo="downloadTo"
              @showFromToDate="showFromToDate"
              @showFromDate="showFromDate"
              @showFromPeriod="showFromPeriod"
            />
            <button
              type="button"
              class="btn btn-info btnDateRange"
              @click="downloadCSV"
            >Превземи CSV</button>
            <button
              type="button"
              class="btn btn-info btnDateRange"
              @click="downloadJSON"
            >Превземи JSON</button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div ref="table"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import Tabulator from "tabulator-tables";
import DateRangePicker from "./DateRangePicker.vue";
import "tabulator-tables/dist/css/tabulator_modern.min.css";
export default {
  components: {
    DateRangePicker
  },
  props: {
    exchangeRates: Array,
    downloadFrom: Object,
    downloadTo: Object
  },
  data() {
    return {
      tabulator: null,
      tableData: this.exchangeRates,
      endOfMonth: false
    };
  },
  watch: {
    //update table if data changes
    tableData: {
      handler: function(newData) {
        this.tabulator.replaceData(newData);
      },
      deep: true
    }
  },
  mounted() {
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.$refs.table, {
      data: this.tableData, //link data to table,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 20,
      langs: {
        mkd: {
          columns: {
            name: "Name" //replace the title of column name with the value "Name"
          },
          ajax: {
            loading: "Loading", //ajax loader text
            error: "Error" //ajax error text
          },
          groups: {
            //copy for the auto generated item count in group header
            item: "item", //the singular  for item
            items: "items" //the plural for items
          },
          pagination: {
            first: "Прв", //text for the first page button
            first_title: "First Page", //tooltip text for the first page button
            last: "Последен",
            last_title: "Last Page",
            prev: "Претходен",
            prev_title: "Prev Page",
            next: "Следен",
            next_title: "Next Page"
          },
          headerFilters: {
            default: "филтрирај колона...", //default header filter placeholder text
            columns: {
              name: "filter name..." //replace default header filter text for column name
            }
          }
        }
      },
      columns: [
        {
          title: "Датум",
          field: "Datum",
          headerFilter: "input",
          sorter: function(a, b, aRow, bRow, column, dir, sorterParams) {
            return moment(a, "DD.MM.YYYY") - moment(b, "DD.MM.YYYY");
          }
        },
        { title: "Валута", field: "Valuta", headerFilter: "input" },
        {
          title: "Ознака",
          field: "Oznaka",
          sorter: "string",
          headerFilter: "input"
        },
        {
          title: "Држава",
          field: "Drzava",
          sorter: "string",
          headerFilter: "input"
        },
        { title: "Номин", field: "Nomin", headerFilter: "input" },
        { title: "Среден", field: "Sreden", headerFilter: "input" },
        {
          title: "Валута Назив",
          field: "NazivMak",
          sorter: "string",
          headerFilter: "input"
        }
      ]
    });
    this.tabulator.setLocale("mkd");
  },
  methods: {
    showFromToDate(from, to) {
      this.tableData = this.exchangeRates.filter(e =>
        moment(e["Datum"], "DD.MM.YYYY").isBetween(
          moment(from).subtract(1, "day"),
          to
        )
      );
    },

    filterEndOfMonth() {
      this.endOfMonth = !this.endOfMonth;
      if (this.endOfMonth)
        this.tabulator.setFilter((data, filterParams) => {
          return moment(data.Datum, "DD.MM.YYYY")
            .endOf("day")
            .isSame(moment(data.Datum, "DD.MM.YYYY").endOf("month"));
        });
      else this.tabulator.clearFilter();
    },
    downloadCSV() {
      this.tabulator.download("csv", "data.csv");
    },
    downloadJSON() {
      this.tabulator.download("json", "data.json");
    },
    showFromDate(from) {
      this.endOfMonth = false;
      this.tabulator.clearFilter();
      this.tableData = this.exchangeRates.filter(e =>
        moment(e["Datum"], "DD.MM.YYYY").isSame(moment(from).startOf("day"))
      );
    },
    showFromPeriod(from, to, period) {
      this.endOfMonth = false;
      this.tabulator.clearFilter();
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
      this.tableData = this.exchangeRates.filter(e =>
        months.includes(moment(e["Datum"], "DD.MM.YYYY").format("DD.MM.YYYY"))
      );
    }
  }
};
</script>
<style>
.filter {
  display: inline-block;
  background-color: #f3f3f3;
}
.filter label {
  margin-bottom: 0.1rem;
}
.tb {
  margin-right: 5px;
}
.myMargin {
  margin: 0px 0px 3px 0px;
}
</style>

