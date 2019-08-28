<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 10:04:09
 * @LastEditTime: 2019-08-22 10:08:21
 * @LastEditors: Please set LastEditors
 -->
<template>
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: "a",
          href: url,
          target: "_blank",
          rel: "noopener"
        };
      }
      return {
        is: "router-link",
        to: url
      };
    }
  }
};
</script>