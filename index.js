// if(window.location.protocol=="https:"){
// 	window.location.href = "http://" + window.location.host
// }

var langJson = {
  cn: {
    tit: '寻找测试 (DST&NXN) 币？',
    p1: '填写您的钱包地址以获得200DST和200NXN，每钱包地址只能获取一次',
    p2: '我们会在每天的8点，12点，16点，进行测试DST和NXN的发放（迪拜时间）',
    placeholder: '请输入测试钱包地址',
    btn: '提交',
    message: '领取错误，请检查钱包地址后重试',
    p3: '请复制下面链接在浏览器打开',
    copy: '复制',
    copySuccess: '复制成功',
    copyFail: '复制失败'
  },
  en: {
    tit: 'Looking for Test (DST&NXN) Coins？',
    p1: 'Fill out your test wallet address to receive 200 DST & 200 NXN , a purse can only be used once',
    p2: 'We will test DST&NXN distribution daily at 8am,12am,4pm（Dubai Time）',
    placeholder: 'Test wallet address',
    btn: 'SUBMIT',
    message: 'Receive a mistake, please check the wallet address and try again',
    p3: 'Please copy the link below in the browser to open',
    copy: 'Copy',
    copySuccess: 'Copy successful',
    copyFail: 'Copy failed'
  }
}


var app = new Vue({
  el: '#app',
  data: {
    langType: 'cn',
    lang: langJson['cn'],
    address: '',
    MsgVisible: false,
    message: '',
    timer: null,
    loading: false,
    isHttps: window.location.protocol=="https:",
    url: "http://" + window.location.host
  },
  mounted () {
    var clipboard = new ClipboardJS('.btn');
    var that = this
  clipboard.on('success', function (e) {
    e.clearSelection();
    Toastify({
      text: that.lang['copySuccess'],
      duration: 2000,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "rgba(0,0,0,0.8)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
  });
  clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
  },
  methods: {
    submit () {
      if (this.loading) {
        return
      }
      var that = this
      var address = this.address.toLowerCase()
      if (!address) {
        this.showMsg(this.lang['placeholder'])
        return
      }
      var reg = /^[a-z0-9]{42}$/i
      if (!address.startsWith('dst') || !reg.test(address))  {
        this.showMsg(this.lang['message'])
        return
      }
      this.loading = true
      axios({
        url: '//ptn1.daodst.com:50322/wallet',
        method: 'post',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          address: address,
          lang: that.langType
        }
      })
      .then(function (response) {
        console.log(response)
        that.loading = false
        var data = response.data
        if (data && data.info) {
          that.showMsg(data.info)
        }
      })
      .catch(function (error) {
        console.log(error.response);
        var data = error.response.data
        if (data && data.info) {
          that.showMsg(data.info)
        } else {
          that.showMsg(that.lang['message'])
        }
        that.loading = false
      });
    },
    switchLang: function () {
      this.langType = this.langType === 'cn' ? 'en' : 'cn'
      this.lang = langJson[this.langType]
    },

    showMsg: function (msg) {
      var that = this
      if (this.timer) {
        this.MsgVisible = false
        clearTimeout(this.timer)
        this.timer = null
      }
      this.message = msg
      this.MsgVisible = true
      this.timer = setTimeout(function () {
        that.MsgVisible = false
      }, 3000)
    } 
  }
})
