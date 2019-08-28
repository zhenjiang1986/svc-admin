<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 10:11:15
 * @LastEditTime: 2019-08-22 10:21:37
 * @LastEditors: Please set LastEditors
 -->
<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  render(h, context) {
    const { icon, title } = context.props;

    const vnodes = [];

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>);
    }
    return vnodes;
  }
};
</script>