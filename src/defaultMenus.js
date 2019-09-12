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
        name: "icons",
        icon: 'icon',
        url:'/icon/index'
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
            },
            {
                name: "count-to",
                displayName:"count-to",
                url: "count-to"
            },
            {
                name: "drag-dialog",
                displayName:"drag-dialog",
                url: "drag-dialog"
            },
            {
                name: "drag-kanban",
                displayName:"drag-kanban",
                url: "drag-kanban"
            },
            {
                name: "drag-select",
                displayName:"drag-select",
                url: "drag-select"
            },
            {
                name: "dropzone",
                displayName:"dropzone",
                url: "dropzone"
            }
            ,
            {
                name: "split-pane",
                displayName:"split-pane",
                url: "split-pane"
            }
            ,
            {
                name: "sticky",
                displayName:"sticky",
                url: "sticky"
            }
            ,
            {
                name: "更换头像",
                displayName:"更换头像",
                url: "avatar-upload"
            }
        ]
    },
    {
        name: "Echarts",
        icon:'chart',
        url: '/charts',
        items: [
            {
                name: 'keyboard',
                url:'keyboard'
            },
            {
                name: 'LineChart',
                url:'line'
            }
            ,
            {
                name: 'MixChart',
                url:'mix-chart'
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