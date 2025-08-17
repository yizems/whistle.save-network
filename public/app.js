(function () {
  const { createApp, reactive } = window.PetiteVue;
  createApp({
    status: {
      disabled: true,
      errorTip: "",
    },
    data: {
      middlewareBaseDir: "",
    },
    submit() {
      this.status.disabled = true;
      const body = {
        middlewareBaseDir: (this.data.middlewareBaseDir || "").trim(),
      };
      fetch("cgi-bin/set-settings", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body),
      })
        .then(r => r.json())
        .then(response => {
          // this.status.disabled = false;
          console.log("response: ", response);
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
      fetch("cgi-bin/get-settings")
        .then(r => r.json())
        .then((data) => {
          this.data = data;
        });
    }
  }).mount("#app");
})();