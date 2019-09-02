<template>
  <div class="menu-wrapper">
    <template v-if="hasOnlyItem">
      <app-link v-if="onlyItem.fullPath" :to="onlyItem.fullPath">
        <el-menu-item :index="onlyItem.name" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyItem.icon" :title="onlyItem.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="menu.name" popper-append-to-body>
      <template slot="title">
        <item :icon="menu.icon" :title="menu.displayName || menu.name" />
      </template>

      <sidebar-item
        v-for="child in menu.items"
        :key="child.name"
        :is-nest="true"
        :menu="child"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>
<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixOSBug],
  props: {
    menu: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //this.onlyOneChild = null;
    return {};
  },
  computed: {
    onlyItem() {
      if (this.menu.items) {
        if (this.menu.items.length == 0) {
          return this.menu;
        }
        if (this.menu.items.length == 1) {
          return this.menu.items[0];
        }
        return null;
      }
      return this.menu;
    },
    hasOnlyItem() {
      return this.onlyItem != null;
    }
  }
};
</script>