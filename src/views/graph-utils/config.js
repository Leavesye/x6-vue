import { Shape } from "@antv/x6";

export const config = {
  width: "100%",
  height: "100%",
  grid: 1,
  clipboard: {
    enabled: true,
  },
  selecting: {
    enabled: true,
    multiple: true,
    rubberband: true,
    movable: true,
    showNodeSelectionBox: true,
  },
  keyboard: {
    enabled: true,
    global: true,
  },
  history: true,
  mousewheel: {
    enabled: true,
    modifiers: ["ctrl", "meta"],
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    highlight: true,
    connector: "rounded",
    connectionPoint: "boundary",
    router: {
      name: "er",
      args: {
        direction: "V",
      },
    },
    createEdge() {
      return new Shape.Edge({
        router: {
            name: 'er',
            args: {
                offset: 'center',
            },
        },
        attrs: {
          line: {
            stroke: "#1890ff",
            // strokeDasharray: 5,
            targetMarker: "classic",
            // style: {
            //   animation: "ant-line 30s infinite linear",
            // },
          },
        },
      });
    },
  },
};
