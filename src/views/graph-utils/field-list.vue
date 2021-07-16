<template>
    <section class="field-list">
        <h1>{{name}}</h1>
        <ul>
            <li v-for="item in list" :key="item">{{item}}</li>
        </ul>
    </section>
</template>
<script>
export default {
    props: [ 'name', 'list']
}
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