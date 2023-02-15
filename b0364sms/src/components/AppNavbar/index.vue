
<script>
//引入我们需要的数据
import menuList from "@/config/menuConfig.js";
import memoryUtils from "@/utils/memoryUtils";
export default {
  data() {
    return {
      menuNodes: "", //用于存储所有菜单项
    };
  },
  mounted() {
    this.menuNodes = this.getMenuNodes(menuList);
  },
  //render(){}函数 也是用来渲染的页面的，它和<template>标签渲染页面只能出现一个
  //render 函数内使用的是jsx语法，jsx语法中{}里面可以写js表达式
  render() {
    return (
      <div class="navbar">
        <el-menu
          router={true} //router属性是开启导航路由功能，默认是false
          default-active={this.$router.path} //设置默认选中的菜单， this.$router.path是当前的路由地址
          default-openeds={["/students"]} //默认打开某个子菜单项，值为数组
          class="el-menu-vertical-demo"
          background-color="#555"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          {this.menuNodes}
        </el-menu>
      </div>
    );
  },

  components: {},

  methods: {
    // 定义一个getMenuNodes方法，如果没有子选项，返回什么格式，如果有子选项返回什么格式
    getMenuNodes(menuList) {
      return menuList.map((item) => {
        if (this.hasAuth(item)) {
          if (!item.children) {
            return (
              <el-menu-item index={item.index}>
                <i class={item.icon}></i>
                <span slot="title">{item.title}</span>
              </el-menu-item>
            );
          } else {
            return (
              <el-submenu index={item.index}>
                <template slot="title">
                  <i class={item.icon}></i>
                  <span>{item.title}</span>
                </template>
                {this.getMenuNodes(item.children)}
              </el-submenu>
            );
          }
        }
      });
    },
    hasAuth(item) {
      const { index, isPublic } = item;
      const menus = memoryUtils.user.role.menus;
      const username = memoryUtils.user.username;
      if (username == "admin" || isPublic || menus.indexOf(index) != -1) {
        return true;
      } else if (item.children) {
        return !!item.children.find((child) => {
          menus.indexOf(child.index) != -1;
        });
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.el-menu-vetical-demo {
  border: 0px;
}

.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #555;
}
</style>