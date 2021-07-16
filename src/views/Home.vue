<template>
  <div class="graph-box">
    <div class="graph-sidebar">
      <ul class="table-list">
        <li @mousedown="handleStartDrag" data-table="holiday">holiday</li>
        <li @mousedown="handleStartDrag" data-table="Calendar">Calendar</li>
        <li @mousedown="handleStartDrag" data-table="Document">Document</li>
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
      </ul>
      <!-- 画布容器 -->
      <div id="graph-container"></div>
    </div>
  </div>
</template>

<script>
import { Graph, Addon } from "@antv/x6";
import { GridLayout } from "@antv/layout";
import { config, NodeFactory } from "./graph-utils";
import '@antv/x6-vue-shape'

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
      const node = this.graph.createNode(
        NodeFactory.createTableNode({ tableName })
      );
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
        const cells = this.graph.paste({ offset: 32 });
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
        height: 400,
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
        console.log(data.cells, "cells");
        data.cells.forEach((item) => {
          if (item.shape !== "edge") {
            model.nodes.push({
              shape: item.shape,
              id: item.id,
              width: item.size.width,
              height: item.size.height,
              attrs: item.attrs,
              component: item.component,
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
    const data = {};
    this.graph = new Graph({
      container: document.getElementById("graph-container"),
      ...config,
    });
    const changePortsVisible = (visible) => {
      const ports = document.getElementById("graph-container").querySelectorAll(".x6-port-body");
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
    this.graph.on('node:added', (e) => {
      console.log(e, e.node.position())
    })
    
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
