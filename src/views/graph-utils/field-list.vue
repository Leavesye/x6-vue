<template>
  <section class="field-list">
    <h1>{{ name }}</h1>
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>
<script>
export default {
  data() {
      return {
          name: '',
          list: []
      }
  },
  inject: ["getNode"],
  mounted() {
    const tableData = {
      holiday: [
        "idHoliday",
        "idCalendar",
        "Name",
        "Description",
        "Date",
        "CreateAt",
        "UpdatedAt",
        "Enabled",
      ],
      Calendar: [
        "idCalendar",
        "idCompany",
        "Name",
        "Description",
        "ValidUntil",
        "CreateAt",
        "UpdatedAt",
        "Enabled",
      ],
      Document: [
        "idDocument",
        "Name",
        "Description",
        "ValidFrom",
        "ValidUntil",
        "DocumentContents",
        "CreateAt",
        "UpdatedAt",
        "Enabled",
      ],
    };
    console.log(this.getNode(), "node111");
    const node = this.getNode()
    this.name = node.data.tableName
    this.list = tableData[node.data.tableName]
  },
};
</script>
<style>
.field-list {
  width: 100%;
  height: 100%;
  background: #decfea;
}
.field-list h1 {
  font-size: 20px;
  height: 40px;
  line-height: 40px;
}
</style>
