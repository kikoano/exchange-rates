<template>
  <div v-bind:class="{myCollapse : collapse}">
    <date-picker :format="format" class="myDate" v-model="time1" :lang="lang" :not-after="notAfter"></date-picker>
    <date-picker :format="format" class="myDate" v-model="time2" :lang="lang" :not-after="notAfter"></date-picker>
    <button type="button" class="btn btn-primary myDate" @click="download">Превземи</button>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import moment from "moment";
export default {
  props:{
    collapse:Boolean
  },
  components: { DatePicker},
  data() {
    return {
      time1: this.$root.$children[0].downloadFrom,
      time2: this.$root.$children[0].downloadTo,
      notAfter: moment(),
      format:"DD.MM.YYYY",
      lang: {
        days: ["Нед", "Пон", "Вто", "Сре", "Чет", "Пет", "Саб"],
        months: [
          "Јан",
          "Феб",
          "Мар",
          "Апр",
          "Мај",
          "Јун",
          "Јул",
          "Авг",
          "Сеп",
          "Окт",
          "Ное",
          "Дек"
        ],
        placeholder: {
          date: "Избери дата"
        }
      }
    };
  },
  methods: {
    download() {
      this.$root.$children[0].loadData(
        moment(this.time1),
        moment(this.time2)
      );
    },
  }
};
</script>

<style>
.myDate {
  margin: 10px 10px 10px 10px;
}
.myCollapse{
  background-color:#36363B;
  margin-top: 10px;
}
.myDropdown {
  display: inline-block;
}
</style>