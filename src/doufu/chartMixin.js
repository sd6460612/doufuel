import * as echarts from 'echarts/index';

export default {
  data() {
    return {
      chart: null,
      domReady: false,
      option: {},
      data: [],
      tempdata: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(this.$el);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });
      this.chart.on("finished", ()=>{
        this.$emit("finished", this);
      });
      this.domReady = true;
    });
  },
  watch: {
    domReady: {
      deep: true,
      immediate: true,
      handler(v) {
        if (this.domReady && this.tempdata) {
          this.draw();
        }
      }
    },
    tempdata: {
      deep: true,
      immediate: true,
      handler() {
        if (this.domReady && this.tempdata) {
          this.draw();
        }
      }
    }
  },
  methods: {
    build: function (data) {
      this.tempdata = data;
      // if (!this.chart) {
      //   this.$nextTick(() => {
      //     this.chart = echarts.init(this.$el);
      //     window.addEventListener("resize", () => {
      //       this.chart.resize();
      //     });
      //     this.chart.on("finished", ()=>{
      //       this.$emit("finished", this);
      //     });
      //     this.domReady = true;
      //   });
      // }
    },
    draw() {
      this.data = this.tempdata.filter(v=>true);
      const flag = this.mergeData();
      if (flag) {
        this.chart.setOption(this.option);
      }
    },
    mergeData() {
      //在具体图表中复写
    }
  }
}
