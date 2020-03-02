<template>
<transition name="fade" mode="out-in">
    <v-card color="grey lighten-4" tile>
    <v-card-title>
        Asortyment
    </v-card-title>
    <v-card-text>
            <v-alert border="right" dense v-if="alert.message" :type="alert.type" tile>{{alert.message}}</v-alert>

            <v-data-table :headers="headers" :items="assortments" :search="search" sort-by="name" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat color="white">

                        <v-text-field v-model="search" append-icon="search" label="Szukaj" single-line hide-details color="teal darken-1"></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="teal darken-1" dark class="mb-2" v-on="on" tile>Dodaj</v-btn>
                            </template>
                            <v-form ref="form" v-model="valid">
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="12">
                                                    <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="assortment.name" label="Nazwa"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="teal darken-1" text @click="close" tile>Anuluj</v-btn>
                                        <v-btn color="teal darken-1" :disabled="!valid || loadingDialog" :loading="loadingDialog" text @click="save" tile>Zapisz</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-dialog>
                        <v-dialog v-model="dialogError" max-width="350">
                            <v-card>
                                <v-card-title class="headline">Błąd</v-card-title>

                                <v-card-text>
                                    <sweetalert-icon icon="error" />
                                    Asortyment o takiej nazwie "{{assortment.name}}" już istnieje.
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="teal darken-1" text @click="dialogError = false" tile>
                                        Zamknij
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)" color="blue">
                        edit
                    </v-icon>
                    <v-icon small @click="confirmDelete(item)" color="red">
                        delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="teal darken-1" @click="getAssortements" tile>Przeładuj</v-btn>
                </template>
            </v-data-table>
            <v-dialog v-model="dialogDelete" max-width="300">
                <v-card>
                    <v-card-title class="headline">Usuń</v-card-title>
                    <v-card-text>
                        Czy na pewno chcesz usunąć asortment o nazwie: {{this.deleteItem.name}} ??
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="teal darken-1" text @click="closeDialogDelete">
                            Anuluj
                        </v-btn>

                        <v-btn color="teal darken-1" text @click="deleteAssortment">
                            Usuń
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</transition>
</template>

<script>
import axiosConfig from '../../axios-config'
import {
    mapState,
    mapActions
} from 'vuex'

export default {
   
    data: () => ({
         dialogError: false,
        rules: {
            required: value => !!value || 'Pole jest wymagane.'
        },
        deleteItem: {
            id: null,
            name: ''
        },
        valid: false,
        search: '',
        dialogDelete: false,
        dialog: false,
        headers: [{
                text: 'Nazwa',
                align: 'left',
                sortable: true,
                value: 'name',
                width: '90%'
            },
            {
                text: 'Actions',
                value: 'action',
                width: '10%',
                sortable: false
            },
        ],
        assortments: [],
        editedIndex: -1,
        assortment: {
            id: null,
            name: ''
        }
    }),
    computed: {
        ...mapState({
            alert: state => state.alert
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'Dodaj' : 'Edytuj'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    created() {
       this.checkexpiration()
        this.getAssortements()
        this.clearAlert()
    },
    methods: {
        ...mapActions({
            clearAlert: 'clear',
            checkexpiration:'checkExpiration'
        }),
        async getAssortements() {
            try {
                let {
                    data
                } = await axiosConfig.get('/assortments')

                if (data !== null) {
                    this.assortments = data;
                }
                this.loading = false;
            } catch (e) {
                alert(e)
            }
        },
        async editItem(item) {
            this.editedIndex = this.assortments.indexOf(item)
            try {
                let {
                    data
                } = await axiosConfig.get('/assortments/' + item.id)
                this.assortment = data
            } catch (e) {
                alert(e)
            }

            this.dialog = true
        },
        confirmDelete(item) {
            this.deleteItem.id = item.id
            this.deleteItem.name = item.name
            this.dialogDelete = true
        },
        async deleteAssortment() {
            try {
                await axiosConfig.delete('/assortments/' + this.deleteItem.id)
                this.getAssortements()
                const message = 'Asortyment o nazwie ' + this.deleteItem.name + ' został usunięty.'
                this.$store.dispatch('success', message)
            } catch (e) {
                const message = 'Asortyment o nazwie ' + this.deleteItem.name + ' nie został usunięty.'
                this.$store.dispatch('error', message)
            }
            this.closeDialogDelete()

        },
        closeDialogDelete() {
            this.dialogDelete = false
            this.deleteItem.id = null
            this.deleteItem.name = ''
        },
        close() {
            this.$refs.form.reset()
            this.resetAssorment()
            this.editedIndex = -1
            this.dialog = false

        },
        resetAssorment() {
            this.assortment.id = null
            this.assortment.name = ''
        },
        async save() {
            this.loadingDialog = true
            if (this.editedIndex > -1) {
                try {
                    await axiosConfig.patch("/assortments", this.assortment);
                    const message = 'Asortyment o nazwie ' + this.assortment.name + ' został edytowany.'
                    this.getAssortements()
                    this.$store.dispatch('success', message)
                    this.close()
                } catch (e) {
                    if (e.response.data.pole === "name") {
                        this.dialogError = true
                    } else {
                        const message = 'Asortyment o nazwie ' + this.assortment.name + ' nie został edytowany.'
                        this.$store.dispatch('error', message)
                        this.close()
                    }
                }
            } else {
                try {
                    await axiosConfig.post("/assortments", this.assortment);
                    this.getAssortements()
                    const message = 'Asortyment o nazwie ' + this.assortments.name + ' został dodany.'
                    this.$store.dispatch('success', message)
                    this.close()
                } catch (e) {
                    if (e.response.data.pole === "name") {
                        this.dialogError = true
                    } else {
                        const message = 'Asortyment o nazwie ' + this.assortments.name + ' nie został dodany.'
                        this.$store.dispatch('error', message)
                        this.close()
                    }
                }
            }
            this.loadingDialog = false

        },
        clearAlert() {

            this.$store.dispatch('clear')
        },
    },
}
</script>

<style>
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}

@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-o-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
