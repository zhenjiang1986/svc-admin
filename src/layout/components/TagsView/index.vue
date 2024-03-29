<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        ref="tag"
        v-for="tag in visitedViews"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{path: tag.path,query: tag.query,fullPath:tag.fullPath}"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @dbclick.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{tag.title}}
        <span
          v-if="!tag.affix"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!selectedTag.affix" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import path from "path";
import { isExternal } from "@/utils/validate";
import { Log } from "@/utils/log";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    menus() {
      return this.$store.state.menu.authMenus;
    }
  },
  watch: {
    $route() {
      this.addTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    isActive(tag) {
      return tag.path === this.$route.path;
    },
    filterAffixTags(menus) {
      let tags = [];

      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];

        if (menu.fullPath && isExternal(menu.fullPath)) {
          continue;
        }

        if (menu.customData && menu.customData.affix) {

          let result = this.$router.resolve(menu.fullPath);

          if (result.resolved.matched.length > 0) {
            var tag = this.convertRouteToTag(result.route, true);

            if (tag) {
              tags.push(tag);
            }
          } else {
            Log.error("该菜单不能被路由:" + path);
          }
        }

        if (menu.items && menu.items.length > 0) {
          //如果有子菜单
          var subTags = this.filterAffixTags(menu.items);
          subTags.forEach(s => {
            tags.push(s);
          });
        }
      }

      return tags;
    },

    initTags() {

      const affixTags = (this.affixTags = this.filterAffixTags(this.menus));

      affixTags.forEach(tag => {
        //包含noTag标签并且noTag为true时不添加tag
        this.$store.dispatch("tagsView/addVisitedView", tag);
      });
    },

    addTags() {
      var tag = this.convertRouteToTag(this.$route);

      if (tag) {
        this.$store.dispatch("tagsView/addView", tag);
      }
    },
    convertRouteToTag(route, affix = false) {
      if (route.meta && route.meta.noTag) {
        return;
      }
      //需要在tagsView添加的Route必须包含name
      if (!route.name) {
        return;
      }

      let title = "未命名标签";
      //菜单名称优先级高
      let curMenu = this.$store.getters["menu/getByFullPath"](route.fullPath);
      if (curMenu) {
        title = curMenu.title;
      } else {
        if (route.meta && route.meta.title) {
          title = route.meta.title;
        }
      }

      return {
        title,
        affix,
        path: route.path,
        fullPath: route.fullPath,
        name: route.name,
        query: route.query,
        meta: { ...route.meta }
      };
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;

      this.$nextTick(() => {
        tags.forEach(tag => {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);

            var viewTag = this.convertRouteToTag(this.$route);

            if (viewTag) {
              if (tag.to.fullPath !== viewTag.fullPath) {
                this.$store.dispatch("tagsView/updateVisitedView", viewTag);
              }
            }
          }
        });
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left;
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400px;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>