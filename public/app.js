(function () {
  const { createApp, reactive } = window.PetiteVue;
  createApp({
    status: {
      disabled: true,
      errorTip: "",
    },
    data: {
      middlewareBaseDir: "",
      iframeUrl: ""
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
    mounted() {
      const query = new URLSearchParams({
        keys: Object.keys(this.data).join(",")
      });
      fetch(`cgi-bin/get-settings?${query}`)
        .then(r => r.json())
        .then((data) => {
          this.data = data;
        });
    }
  }).mount("#app");
})();