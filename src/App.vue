<template>
  <div id="mainNav" :class="[{'collapsed' : collapsed}]">
    <div class="container-fluid">
      <div id="myMain">
        <div class="vld-parent">
          <loading
            :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="true"
            :loader="'spinner'"
          ></loading>
          <router-view
            v-if="exchangeRates !== null"
            :exchangeRates="exchangeRates"
            :downloadFrom="downloadFrom"
            :downloadTo="downloadTo"
          ></router-view>
          <hr style="margin: 10px 0px;border: 1px solid #e3e3e3;">
        </div>
      </div>
    </div>
    <sidebar-menu
      :menu="menu"
      :collapsed="collapsed"
      @collapse="onCollapse"
      :theme="selectedTheme"
    />
  </div>
</template>

<script>
import { getExchangeRate } from "@/nbrmApi.js";
import Loading from "vue-loading-overlay";
import moment from "moment";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "app",
  components: { Loading },
  created() {
    this.loadData(this.downloadFrom, this.downloadTo);
  },
  data() {
    return {
      exchangeRates: null,
      downloadFrom: moment().subtract(36, "months"),
      downloadTo: moment(),
      isLoading: false,
      menu: [
        {
          header: true,
          title: "Курсна листа"
        },
        {
          title: "Табеларни прегледи",
          icon: "fa fa-table",
          child: [
            {
              href: "/table/date",
              title: "За датум",
              icon: "fa fa-calendar-day"
            },
            {
              title: "За период",
              icon: "fa fa-calendar-alt",
              child: [
                {
                  href: "/table/period?mode=1",
                  title: "Контиуниран по датум",
                  icon: "fa fa-calendar-alt"
                },
                {
                  href: "/table/period?mode=2",
                  title: "По пресечно датуми",
                  icon: "fa fa-calendar-alt"
                }
              ]
            }
          ]
        },
        {
          title: "Графички приказ",
          icon: "fa fa-chart-area",
          child: [
            {
              href: "/graph?num=1",
              title: "Single",
              icon: "fa fa-chart-area"
            },
            {
              href: "/graph?num=2",
              title: "Double",
              icon: "fa fa-chart-area"
            }
          ]
        },
        {
          title: "Предземи курсна листа",
          icon: "fa fa-database",
          download: true
        }
      ],
      collapsed: false,
      themes: ["", "white-theme"],
      selectedTheme: "default-theme"
    };
  },
  methods: {
    onCollapse(val) {
      this.collapsed = val;
    },
    loadData(start, end) {
      this.downloadFrom = start;
      this.downloadTo = end;
      start = start.format("DD.MM.YYYY");
      end = end.format("DD.MM.YYYY");
      this.isLoading = true;
      getExchangeRate(start, end).then(xml => {
        let decode = require("unescape");
        xml = decode(xml);
        let parseString = require("xml2js").parseString;
        let temp;
        parseString(xml, function(err, result) {
          temp = result;
        });
        this.exchangeRates =
          temp["soap:Envelope"][
            "soap:Body"
          ][0].GetExchangeRateResponse[0].GetExchangeRateResult[0].dsKurs[0].KursZbir;
        for (let e of this.exchangeRates) {
          e["Datum"] = moment(new Date(e["Datum"])).format("DD.MM.YYYY");
          delete e["RBr"];
          delete e["DrzavaAng"];
          delete e["DrzavaAl"];
          delete e["NazivAng"];
          delete e["ValutaNaziv_AL"];
          delete e["Datum_f"];
        }
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600");

body,
html {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  background-color: #f2f4f7;
}

#mainNav {
  padding-left: 280px;
}
#mainNav.collapsed {
  padding-left: 50px;
}
#myMain {
  margin: 25px 20px 0px 20px;
}
</style>
