/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 10:47:51
 * @LastEditTime: 2019-08-22 10:52:24
 * @LastEditors: Please set LastEditors
 */
export default {
  computed: {
    device() {
      return this.$store.state.app.device;
    }
  },
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS();
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu;
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave;
        $subMenu.handleMouseleave = e => {
          if (this.device === "mobile") {
            return;
          }
          handleMouseleave(e);
        };
      }
    }
  }
};
