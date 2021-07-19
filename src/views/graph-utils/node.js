const portLayout = {
  items: [
    {
      id: "port1",
      group: "in",
    },
    {
      id: "port2",
      group: "out",
    },
  ],
  groups: {
    in: {
      position: "left",
      label: {
        position: "left",
      },
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
        },
      },
    },
    out: {
      position: "right",
      label: {
        position: "right",
      },
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#31d0c6",
          strokeWidth: 2,
          fill: "#fff",
        },
      },
    },
  },
};
// 创建表格节点
export function createTableNode(data) {
  return {
    shape: "vue-shape",
    data,
    attrs: {
      body: {
        stroke: "#000",
        strokeWidth: 2,
      },
    },
    width: 150,
    height: 200,
    ports: portLayout,
    component: "table-component",
  };
}
// 创建关联节点
export function createJoinNode(data) {
  return {
    width: 100,
    height: 40,
    data,
    label: "关联",
    ports: portLayout,
    attrs: {
      body: {
        fill: "#efdbff",
        stroke: "#9254de",
      },
    },
  };
}
// 创建输出节点
export function createOutputNode(data) {
  return {
    width: 100,
    height: 40,
    data,
    label: "转换输出",
    ports: portLayout,
    attrs: {
      body: {
        fill: "#efdbff",
        stroke: "#9254de",
      },
    },
  };
}
