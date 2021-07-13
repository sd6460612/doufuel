const init = async vue=>{
  await fetchData(vue);
};
const watch_data = vue=>{

};

const fetchData = async vue=>{
  const p = Object.assign({}, vue.param,
    {page:vue.dpagenum, rows:vue.dpagesize, sidx:vue.dsidx, sord: vue.dsord}
    );
  const data = await vue.fetch(p);
  vue.dpagenum = data.pagenum;
  vue.dpagesize = data.pagesize;
  vue.dtotal = data.totalcount;
  vue.ddata = data.items;
};

export default {
  init, watch_data,fetchData
}
