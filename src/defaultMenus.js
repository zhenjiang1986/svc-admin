 const defaultMenus = [
    {
      name: "Dashboard",
      displayName: "Dashboard",
      icon: "",
      url: "/dashboard",
      customData: {
        guard: {
          roles: [],
          permissions: [],
          mode: "allOf"
        },
        affix : true
      }
    },
    {
        name: "错误页面",
        icon:'404',
        url: '/error',
        items: [
            {
                name: '401',
                url:'401'
            },
            {
                name: '404',
                url:'404'
            }
        ]

    }
,
    {
        name: "小组件",
        icon:"component",
        url:"/components",
        items:[
            {
                name: "回到顶部",
                displayName:"回到顶部",
                url: "back-to-top"
            }
        ]
    },
    {
      name: "External url",
      icon: "",
      url: "https://www.hao123.com"
    }
  ];

  export default defaultMenus