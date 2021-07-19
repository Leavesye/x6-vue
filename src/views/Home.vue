<template>
  <div class="graph-box">
    <div class="graph-sidebar">
      <ul class="table-list">
        <li @mousedown="handleStartDrag" data-table="holiday">holiday</li>
        <li @mousedown="handleStartDrag" data-table="Calendar">Calendar</li>
        <li @mousedown="handleStartDrag" data-table="Document">Document</li>
        <li @mousedown="handleStartDrag" data-table="join">关联</li>
        <li @mousedown="handleStartDrag" data-table="change">转换输出</li>
      </ul>
    </div>
    <div class="graph-main">
      <ul class="tool-bar">
        <li @click="handleUndo">撤销</li>
        <li @click="handleRedo">重做</li>
        <li @click="handleFitGraph">适应画布</li>
        <li @click="handleZoomout">放大</li>
        <li @click="handleZoomin">缩小</li>
        <li @click="handleCopy">复制</li>
        <li @click="handlePaste">粘贴</li>
        <li @click="handleDelete">删除</li>
        <li @click="handleClear">清空</li>
        <li @click="handleAutoLayout">自动排布</li>
        <li @click="handleExportData">导出画布数据</li>
      </ul>
      <!-- 画布容器 -->
      <div id="graph-container"></div>
    </div>
  </div>
</template>

<script>
import { Graph, Addon } from "@antv/x6";
import { GridLayout } from "@antv/layout";
import "@antv/x6-vue-shape";
import { config, NodeFactory } from "./graph-utils";
import FieldList from "./graph-utils/field-list";

const { Dnd } = Addon;
export default {
  data() {
    return {
      canUndo: false,
      canRedo: false,
    };
  },
  methods: {
    handleStartDrag(e) {
      const target = e.currentTarget;
      const tableName = target.getAttribute("data-table");
      let node = null;
      if (tableName == "join") {
        node = this.graph.createNode(
          NodeFactory.createJoinNode({ tableName })
        );
      } else if (tableName == "change") {
        node = this.graph.createNode(
          NodeFactory.createOutputNode({ tableName })
        );
      } else {
        node = this.graph.createNode(
          NodeFactory.createTableNode({ tableName })
        );
      }
      this.dnd.start(node, e);
    },
    // 撤销
    handleUndo() {
      if (this.canUndo) {
        this.history.undo();
      }
    },
    // 重做
    handleRedo() {
      if (this.canRedo) {
        this.history.redo();
      }
    },
    // 适应画布
    handleFitGraph() {
      this.graph.centerContent();
    },
    // 放大
    handleZoomout() {
      this.graph.zoom(0.2);
    },
    // 缩小
    handleZoomin() {
      this.graph.zoom(-0.2);
    },
    // 复制
    handleCopy() {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.copy(cells);
      }
    },
    // 粘贴
    handlePaste() {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 20 });
        this.graph.cleanSelection();
        this.graph.select(cells);
      }
    },
    // 删除
    handleDelete() {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        cells.forEach((c) => {
          c.remove();
        });
        this.graph.cleanSelection();
      }
    },
    // 清空画布
    handleClear() {
      this.graph.clearCells();
    },
    // 自动排布
    handleAutoLayout() {
      const gridLayout = new GridLayout({
        type: "grid",
        width: 800,
        height: 800,
        center: [300, 200],
        rows: 4,
        cols: 4,
      });
      const model = {
        nodes: [],
        edges: [],
      };
      const data = this.graph.toJSON();
      if (data.cells && data.cells.length) {
        console.log(data, data.cells, "cells");
        data.cells.forEach((item) => {
          if (item.shape !== "edge") {
            model.nodes.push({
              shape: item.shape,
              id: item.id,
              width: item.size.width,
              height: item.size.height,
              attrs: item.attrs,
              component: item.component,
              data: item.data,
              ports: item.ports,
            });
          } else {
            let sourceId = item.source;
            let targetId = item.target;
            if (typeof item.source === "object") {
              sourceId = item.source.cell;
            }
            if (typeof item.target === "object") {
              targetId = item.target.cell;
            }
            model.edges.push({
              source: sourceId,
              target: targetId,
              attrs: item.attrs,
              router: item.router,
            });
          }
        });
        const layoutData = gridLayout.layout(model);
        if (layoutData && layoutData.nodes) {
          layoutData.nodes.forEach((item) => {
            const d = data.cells.find((d) => d.id === item.id);
            if (!d.position) {
              d.position = {};
            }
            d.position.x = item.x;
            d.position.y = item.y;
          });
        }
        console.log(layoutData, "fdfd");
        this.graph.fromJSON(layoutData);
      }
    },
    handleExportData() {
      console.log(JSON.stringify(this.graph.toJSON()), "json");
    },
    // 初始化设置操作历史
    initHistory() {
      this.history = this.graph.history;
      this.history.on("change", () => {
        this.canRedo = this.history.canRedo();
        this.canUndo = this.history.canUndo();
      });
    },
    // 初始化键盘操作
    initKeyboard() {
      this.graph.bindKey("ctrl+c", () => {
        this.handleCopy();
        return false;
      });
      this.graph.bindKey("ctrl+v", () => {
        this.handlePaste();
      });
      this.graph.bindKey("delete", () => {
        this.handleDelete();
      });
    },
    // 初始化拖拽控件
    initDnd() {
      this.dnd = new Dnd({
        target: this.graph,
        scaled: false,
        animation: true,
        validateNode() {
          // todo
        },
      });
    },
  },
  mounted() {
    let data = {};
    this.graph = new Graph({
      container: document.getElementById("graph-container"),
      ...config,
    });
    const changePortsVisible = (visible) => {
      const ports = document
        .getElementById("graph-container")
        .querySelectorAll(".x6-port-body");
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = visible ? "visible" : "hidden";
      }
    };

    this.graph.on("node:mouseenter", () => {
      // console.log(e)
      changePortsVisible(true);
    });

    this.graph.on("node:mouseleave", () => {
      changePortsVisible(false);
    });
    this.graph.on("node:added", (e) => {
      console.log(e, e.node.position());
    });
    Graph.registerVueComponent(
      "table-component",
      {
        template: `<field-list></field-list>`,
        components: { FieldList },
      },
      true
    );
    data = {"cells":[{"position":{"x":39,"y":18},"size":{"width":150,"height":200},"view":"vue-shape-view","attrs":{"body":{"stroke":"#000","strokeWidth":2}},"shape":"vue-shape","id":"1381d0ca-a628-4110-86f6-57013fcb7b1b","data":{"tableName":"holiday"},"component":"table-component","zIndex":1,"ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}}},{"position":{"x":34,"y":254},"size":{"width":150,"height":200},"view":"vue-shape-view","attrs":{"body":{"stroke":"#000","strokeWidth":2}},"shape":"vue-shape","id":"25b60e42-2f80-4108-b054-c79111da29c4","data":{"tableName":"Calendar"},"component":"table-component","zIndex":2,"ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}}},{"position":{"x":536,"y":254},"size":{"width":150,"height":200},"view":"vue-shape-view","attrs":{"body":{"stroke":"#000","strokeWidth":2}},"shape":"vue-shape","id":"db2f2a61-8af3-4479-b7f3-13697b0596e5","data":{"tableName":"Document"},"component":"table-component","zIndex":3,"ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}}},{"position":{"x":355,"y":334},"size":{"width":100,"height":40},"attrs":{"text":{"text":"关联"},"body":{"fill":"#efdbff","stroke":"#9254de"}},"shape":"rect","id":"1744cb7e-5529-4f57-9036-f78932065732","data":{"tableName":"join"},"zIndex":4,"ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}}},{"shape":"edge","attrs":{"line":{"stroke":"#1890ff"}},"id":"d3c60dd4-15b5-42eb-bac2-0681c27707d4","router":{"name":"er","args":{"offset":"center"}},"zIndex":12,"source":{"cell":"1381d0ca-a628-4110-86f6-57013fcb7b1b","port":"port2"},"target":{"cell":"1744cb7e-5529-4f57-9036-f78932065732","port":"port1"}},{"shape":"edge","attrs":{"line":{"stroke":"#1890ff"}},"id":"62f8cd26-d5cf-4125-b098-851ac9a9342a","router":{"name":"er","args":{"offset":"center"}},"zIndex":13,"source":{"cell":"25b60e42-2f80-4108-b054-c79111da29c4","port":"port2"},"target":{"cell":"1744cb7e-5529-4f57-9036-f78932065732","port":"port1"}},{"shape":"edge","attrs":{"line":{"stroke":"#1890ff"}},"id":"ec54fc84-de42-4966-9448-73c271f84eda","router":{"name":"er","args":{"offset":"center"}},"zIndex":14,"source":{"cell":"1744cb7e-5529-4f57-9036-f78932065732","port":"port2"},"target":{"cell":"db2f2a61-8af3-4479-b7f3-13697b0596e5","port":"port1"}},{"position":{"x":33,"y":490},"size":{"width":150,"height":200},"view":"vue-shape-view","attrs":{"body":{"stroke":"#000","strokeWidth":2}},"shape":"vue-shape","id":"8650208e-25b1-4a96-b24d-3b3f131ed742","data":{"tableName":"Document"},"component":"table-component","ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}},"zIndex":17},{"shape":"edge","attrs":{"line":{"stroke":"#1890ff"}},"id":"efceaf92-1e46-4e2e-a26f-c09b82c1a5df","router":{"name":"er","args":{"offset":"center"}},"source":{"cell":"8650208e-25b1-4a96-b24d-3b3f131ed742","port":"port2"},"target":{"cell":"1744cb7e-5529-4f57-9036-f78932065732","port":"port1"},"zIndex":18},{"position":{"x":788,"y":250},"size":{"width":150,"height":200},"view":"vue-shape-view","attrs":{"body":{"stroke":"#000","strokeWidth":2}},"shape":"vue-shape","id":"d01b923c-27ff-411e-90a7-c05b82d08450","data":{"tableName":"Document"},"component":"table-component","ports":{"items":[{"id":"port1","group":"in"},{"id":"port2","group":"out"}],"groups":{"in":{"position":"left","label":{"position":"left"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}},"out":{"position":"right","label":{"position":"right"},"attrs":{"circle":{"r":6,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff"}}}}},"zIndex":21},{"shape":"edge","attrs":{"line":{"stroke":"#1890ff"}},"id":"440085f3-b7aa-4aef-9331-2d48f0e02fa9","router":{"name":"er","args":{"offset":"center"}},"source":{"cell":"db2f2a61-8af3-4479-b7f3-13697b0596e5","port":"port2"},"target":{"cell":"d01b923c-27ff-411e-90a7-c05b82d08450","port":"port1"},"zIndex":22}]}
    this.graph.fromJSON(data);
    // 初始化操作历史
    this.initHistory();
    // 初始化快捷键
    this.initKeyboard();
    // 初始化拖拽
    this.initDnd();
  },
};
</script>
<style>
.graph-box {
  display: flex;
  height: 100%;
}
.graph-sidebar {
  width: 300px;
  height: 100%;
  background: #ccc;
}
.graph-main {
  flex: 1;
}
.tool-bar {
  display: flex;
  border-bottom: 1px solid #ccc;
}
.tool-bar li {
  margin-left: 15px;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}
#graph-container {
  height: 100%;
}
@keyframes ant-line {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>
