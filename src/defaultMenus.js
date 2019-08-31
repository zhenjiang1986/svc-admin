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
      name: "Documentation",
      icon: "",
      url: "/documenttation"
    },
    {
      name: "Guild",
      icon: "",
      url: "/guild"
    },
    {
      name: "Permission",
      icon: "",
      url: "/permission",
      items: [
        {
          name: "Directive Permission",
          icon: "",
          url: "/permission/directive"
        }
      ]
    },
    {
      name: "Icons",
      icon: "",
      url: "/icons"
    },
    {
      name: "External url",
      icon: "",
      url: "https://www.hao123.com"
    }
  ];

  export default defaultMenus