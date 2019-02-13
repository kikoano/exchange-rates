<script>
import { Line } from "vue-chartjs";
import moment from "moment";
export default {
  extends: Line,
  props: ["chartdata", "options", "values", "num"],
  watch: {
    values: {
      handler: function(newValue) {
        this.updateRender();
      },
      deep: true
    },
    chartdata: {
      handler: function(newValue) {
        this.updateRender();
      },
      deep: true
    },
    num: function(val) {
      this.updateRender();
    }
  },
  methods: {
    getHslaColor(val) {
      return "hsla(" + val * (255 / 31) + ",100%,50%,0.1)";
    },
    getValueColor(val) {
      let ctx = this.$refs.canvas.getContext("2d");
      let h = this.num == 1 ? 700 : 400;
      let gradient = ctx.createLinearGradient(0, 0, 0, h);
      let color = this.getHslaColor(val);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "#FFFFFF");
      return gradient;
    },
    updateRender() {
      let options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                beginAtZero: true,
              }
            }
          ]
        },
        elements: {
          line: {
            fill: true
          }
        },
        tooltips: {
          mode: "x-axis",
          displayColors: false,
          itemSort: function(a, b) {
            return b.datasetIndex - a.datasetIndex;
          }
        }
      };
      let checkValues = Object.assign(
        ...Object.entries(this.values)
          .filter(([k, v]) => v)
          .map(([k, v]) => ({ [k]: v }))
      );

      let data = [];
      for (let oz of Object.keys(checkValues)) {
        data.push({
          label: oz,
          pointBorderColor: "#999",
          pointBorderWidth: 1,
          backgroundColor: this.getValueColor(
            Object.keys(this.values).indexOf(oz)
          ),
          data: this.chartdata
            .filter(e => e["Oznaka"] == oz)
            .map(e => e["Sreden"])
            .flat()
        });
      }
      data.sort((a, b) => {
        let maxA = Math.max(...a.data);
        let maxB = Math.max(...b.data);
        return maxA - maxB;
      });
      let dates = new Set();
      //in future it should be one Oznaka map
      for (let er of this.chartdata) {
        dates.add(er["Datum"]);
      }

      this.renderChart(
        {
          labels: [...dates],
          datasets: data
        },
        options
      );
    }
  },
  mounted() {
    this.updateRender();
  }
};
</script>

<style>
</style>