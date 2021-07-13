const init = vue=>{

};

const watch_data = vue=>{
  fetchData(vue);
};

const fetchData = vue=>{
  vue.ddata = vue.data;
};

export default {
  init, watch_data,fetchData
}
