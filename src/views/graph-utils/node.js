import FieldList from "./field-list";

const tableData = {
    'holiday': ['idHoliday', 'idCalendar', 'Name', 'Description', 'Date', 'CreateAt', 'UpdatedAt', 'Enabled'],
    'Calendar': ['idCalendar', 'idCompany', 'Name', 'Description', 'ValidUntil', 'CreateAt', 'UpdatedAt', 'Enabled'],
    'Document': ['idDocument', 'Name', 'Description', 'ValidFrom', 'ValidUntil', 'DocumentContents', 'CreateAt', 'UpdatedAt', 'Enabled'],
}
// 创建表格节点
export function createTableNode(data) {
  return {
    shape: "vue-shape",
    attrs: {
        body: {
          stroke: "#000",
          strokeWidth: 2
        },
    },
    width: 150,
    height: 200,
    ports: {
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
    },
    component: {
      template: `<field-list :name="name" :list="list"></field-list>`,
      data() {
        return {
          list: tableData[data.tableName],
          name: data.tableName,
        };
      },
      components: {
        FieldList,
      },
    },
  };
}
