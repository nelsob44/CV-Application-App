<template>   
    <v-sheet
    :id="data.formName"
    tabindex="0"
    color="indigo lighten-4"
    width="100%"
    style="cursor:pointer;"
    height="200"
    class="pa-2"
    v-cloak
    @dragover.prevent
    @drop.prevent="addFile"
    >
    <v-row justify="center">
        <v-icon
        v-if="!drop" 
        color="indigo darken-2" 
        size="75"
        >mdi-cloud-upload-outline</v-icon>
        <v-card-title v-if="!drop">Drag and drop files here to upload them</v-card-title>
        <v-icon
        v-if="drop" 
        color="indigo darken-2" 
        size="75"
        >mdi-book-plus</v-icon>
        <v-card-title v-if="drop">{{filename}} has been attached successfully</v-card-title>
    </v-row>
    </v-sheet>
</template>

<script>
export default {
    name: 'FileDrop',
    props: ['data'],
    data () {
        return {
           drop: false,
           filename: ''
        }
    },
    methods: {
        addFile(e) {
            const droppedFiles = e.dataTransfer.files;
            this.drop = true;
            this.filename = droppedFiles[0].name;
            this.$emit('sendFiles', droppedFiles[0]);
        }
    }
}
</script>