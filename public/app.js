(function () {
  const {createApp, reactive} = window.PetiteVue;
  createApp({
    page: 'main',
    status: {
      disabled: true,
      errorTip: "",
    },
    savedList: [],
    data: {
      savedDir: "",
    },
    columns: [
      {name: '方法', path: 'method'},
      {name: '状态', path: 'result'},
      {name: 'URL', path: 'url'},
      {name: 'type', path: 'type'},
      // {name: '耗时', path: 'time'}
    ],
    selectedIdx: null, // 当前选中请求索引
    get selectedItem() { // 当前选中请求对象
      return this.selectedIdx != null ? this.savedList[this.selectedIdx] : null;
    },
    select(idx) { // 选中请求
      this.selectedIdx = idx;
    },
    go(page) {
      this.page = page;
    },
    submit() {
      this.status.disabled = true;
      const body = this.data;
      fetch("cgi-bin/set-settings", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body),
      })
        .then(r => r.json())
        .then(response => {
          this.status.disabled = false;
          if (response.code) {
            this.status.errorTip = response.msg;
          } else {
            this.status.errorTip = "设置成功";
          }
          setTimeout(() => {
            this.status.errorTip = "";
          }, 2000);
        })
    },
    getByPath(obj, path) {
      if (!obj || !path) return '';
      const parts = path.split('.');
      let val = obj;
      for (const p of parts) {
        if (val == null) return '';
        val = val[p];
      }
      // 兼容 method/result 取不到时尝试 req.method/res.statusCode
      if ((path === 'method' || path === 'result') && !val) {
        if (path === 'method' && obj.req && obj.req.method) return obj.req.method;
        if (path === 'result' && obj.res && obj.res.statusCode) return obj.res.statusCode;
      }
      return val == null ? '' : val;
    },
    getResponseBody(item) {
      return window.getBodyByContentType(item, true);
    },
    getRequestBody(item) {
      return window.getBodyByContentType(item, false);
    },
    getQueryParams(url) {
      if (!url) return '';
      try {
        const u = new URL(url, location.origin);
        if (!u.search) return '(无)';
        const params = {};
        u.searchParams.forEach((v, k) => {
          if (params[k]) {
            if (Array.isArray(params[k])) params[k].push(v);
            else params[k] = [params[k], v];
          } else {
            params[k] = v;
          }
        });
        return JSON.stringify(params, null, 2);
      } catch (e) {
        return '';
      }
    },
    mounted() {
      const query = new URLSearchParams({
        keys: Object.keys(this.data).join(",")
      });
      fetch(`cgi-bin/get-settings?${query}`)
        .then(r => r.json())
        .then((data) => {
          this.data = data;
        });
      this.refreshSavedList();
    },
    refreshSavedList() {
      fetch(`cgi-bin/get-network`)
        .then(r => r.json())
        .then((data) => {
          this.savedList = data
        });
    },
    closDetail() {
      this.select(null);
    },
  }).mount("#app");
})();
