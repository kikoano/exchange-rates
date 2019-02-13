<template>
  <div style="display:inline-block">
    <div class="myDropdown myChooser" v-if="dateMode == 2">
      <b-dropdown id="ddown1" :text="selectedOption.name" class="m-md-2">
        <b-dropdown-item
          v-for="option in options"
          v-bind:key="option.val"
          @click="optionClick(option)"
        >{{option.name}}</b-dropdown-item>
      </b-dropdown>
    </div>
    <date-picker
      v-if="dateMode == null"
      style="width:120px"
      v-model="date"
      :lang="lang"
      :format="format"
      :not-after="dateTo"
      :not-before="dateFrom"
    ></date-picker>
    <date-picker
      v-else
      style="width:200px"
      v-model="dates"
      range
      :lang="lang"
      :format="format"
      :not-after="dateTo"
      :not-before="dateFrom"
    ></date-picker>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import moment from "moment";
export default {
  components: { DatePicker },
  props: {
    dateMode: String,
    dateFrom: Object,
    dateTo: Object,
    showFromToDate: {
      type: Function,
      default: () => 1
    },
    showFromDate: {
      type: Function,
      default: () => 1
    },
    showFromPeriod: {
      type: Function,
      default: () => 1
    }
  },
  data() {
    return {
      options: [
        { name: "Дневно", val: 0 },
        { name: "Месечно", val: 1 },
        { name: "Квартално", val: 3 },
        { name: "Полугодишно", val: 6 },
        { name: "Годишно", val: 12 }
      ],
      selectedOption: {
         name: "Дневно", val: 0 
      },
      format: "DD.MM.YYYY",
      dates: [this.dateFrom, this.dateTo],
      date: this.dateFrom,
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
    updateDate() {
      if (this.dateMode == null) this.$emit("showFromDate", this.date);
      else this.$emit("showFromToDate", this.dates[0], this.dates[1]);
      if (this.selectedOption.val != 0)
        this.$emit(
          "showFromPeriod",
          this.dates[0],
          this.dates[1],
          this.selectedOption.val
        );
    },
    optionClick: function(option) {
      this.selectedOption.name = option.name;
      this.selectedOption.val = option.val;
    }
  },
  watch: {
    dateFrom: {
      handler(val) {
        this.dates = [val, this.dateTo];
        this.date = val;
        this.selectedOption=options[0];
        //this.updateDate();
      },
      deep: true
    },
    dateTo: {
      handler(val) {
        this.dates = [this.dateFrom, val];
        this.selectedOption=options[0];
        //this.updateDate();
      },
      deep: true
    }
  },
  updated() {
    this.updateDate();
  }
};
</script>
<style>
.btnDateRange {
  margin-left: 10px;
}
.myChooser{
  margin-left: -15px;
}
</style>

