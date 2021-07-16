import { Graph, Shape, Path } from "@antv/x6";
Graph.registerConnector(
  "curve",
  (sourcePoint, targetPoint) => {
    const path = new Path();
    path.appendSegment(Path.createSegment("M", sourcePoint));
    path.appendSegment(
      Path.createSegment(
        "C",
        sourcePoint.x,
        sourcePoint.y + 180,
        targetPoint.x,
        targetPoint.y - 180,
        targetPoint.x,
        targetPoint.y
      )
    );
    return path.serialize();
  },
  true
);
export const config = {
  width: "100%",
  height: "100%",
  grid: true,
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
        // connector: { name: "curve" },
        router: {
            name: 'er',
            args: {
                offset: 'center',
            },
        },
        attrs: {
          line: {
            stroke: "#1890ff",
            strokeDasharray: 5,
            targetMarker: "classic",
            style: {
              animation: "ant-line 30s infinite linear",
            },
          },
        },
      });
    },
  },
};
