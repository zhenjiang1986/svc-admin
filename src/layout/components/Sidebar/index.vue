<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="menu in menus" :key="menu.name" :item="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["menus", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, fullPath } = route;

      if (meta && meta.activeMenu) {
        return meta.activeMenu;
      }

      let curMenu = this.$store.getters.menu.getByFullPath(fullPath);

      if (curMenu) {
        return curMenu.name;
      }

      return "";
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>