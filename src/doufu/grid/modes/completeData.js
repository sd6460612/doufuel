const init = vue=>{

};

const watch_data = vue=>{
  fetchData(vue);
  vue.dtotal = vue.data.length;
};

const fetchData = vue=>{
  const start = (vue.dpagenum - 1) * vue.dpagesize;
  const end = start + vue.dpagesize;
  const d = vue.data.slice(start, end);
  vue.ddata = d;
};

export default {
  init, watch_data,fetchData
}
