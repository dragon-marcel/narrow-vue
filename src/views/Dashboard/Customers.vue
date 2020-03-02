<template>
<transition name="fade" mode="out-in">

    <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
        <b-spinner variant="dark" />
    </div>

    <v-card color="grey lighten-4" tile>
    <v-card-title>
        Klienci
    </v-card-title>
    <v-card-text>
            <v-alert border="right" dense v-if="alert.message" :type="alert.type" tile>{{alert.message}}</v-alert>
            <v-data-table :headers="headers" :items="customers" :search="search" sort-by="name" class="elevation-1">
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
                                                    <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="customer.name" label="Nazwa"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field color="teal darken-1" :rules="[rules.required,rules.email]" v-model="customer.email" label="E-mail"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="customer.nrTel" label="Nr telefonu"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="customer.town" label="Miejscowość"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="customer.country" label="Kraj"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="teal darken-1" text @click="close" tile>Anuluj</v-btn>
                                        <v-btn color="teal darken-1" :disabled="!valid || loadingDialog" :loading="loadingDialog" text @keyup.enter="save" @click="save" tile>Zapisz</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-dialog>
                        <v-dialog v-model="dialogError" max-width="290">
                            <v-card>
                                <v-card-title class="headline">Błąd</v-card-title>

                                <v-card-text>
                                    <sweetalert-icon icon="error" />
                                    Klient o takiej nazwie "{{customer.name}}" już istniej.
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
                    <v-btn color="teal darken-1" @click="getCustomers" tile>Przeładuj</v-btn>
                </template>
            </v-data-table>
        </v-card-text>
        <v-dialog v-model="dialogDelete" max-width="300">
            <v-card>
                <v-card-title class="headline">Usuń</v-card-title>
                <v-card-text>
                    Czy na pewno chcesz usunąć klienta o nazwie: {{this.deleteItem.name}} ??
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="teal darken-1" text @click="closeDeleteCustomer">
                        Anuluj
                    </v-btn>

                    <v-btn color="teal darken-1" text @click="deleteCustomer">
                        Usuń
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        loadingDialog: false,
        dialogError: false,
        rules: {
            required: value => !!value || 'Pole jest wymagane.',
            min: v => v.length >= 8 || 'Min 8 znaków.',
            email: v => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(v) || 'Błędny e-mail.'
            }
        },
        deleteItem: {
            id: null,
            name: ''
        },
        valid: false,
        loading: true,
        dialogDelete: false,
        search: '',
        dialog: false,
        headers: [{
                text: 'Nazwa',
                align: 'left',
                sortable: true,
                value: 'name',
                width: '30%'
            },
            {
                text: 'E-mail',
                value: 'email',
                width: '15%'

            },
            {
                text: 'Nr Tel',
                value: 'nrTel',
                width: '15%'

            },
            {
                text: 'Miejscowość',
                value: 'town',
                width: '15%'

            },
            {
                text: 'Kraj',
                value: 'country',
                width: '15%'

            },
            {
                text: 'Akcje',
                value: 'action',
                sortable: false,
                width: '10%'

            },
        ],
        customers: [],
        editedIndex: -1,
        customer: {
            name: "",
            id: null,
            email: "",
            nrTel: "",
            town: "",
            country: "",
            action: ""
        },

    }),
    computed: {

        ...mapState({
            alert: state => state.alert
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'Dodaj klienta' : 'Edytuj klienta'
        },
    },
    watch: {
        watch: {
            $route(to, from) {
                alert("dasda")

                if (to || from)
                    alert("dasda")
            }
        },
        dialog(val) {
            val || this.close()
        }
    },
    created() {
        this.checkexpiration()
        this.getCustomers()
        this.clearAlert()
    },
    methods: {
        ...mapActions({
            clearAlert: 'clear',
            checkexpiration: 'checkExpiration'

        }),
        async getCustomers() {
            try {
                let {
                    data
                } = await axiosConfig.get('/customers')

                if (data !== null) {
                    this.customers = data;
                }
                this.loading = false;
            } catch (e) {
                alert(e)
            }
        },
        async editItem(item) {
            this.editedIndex = this.customers.indexOf(item)
            try {
                let {
                    data
                } = await axiosConfig.get('/customers/' + item.id)
                this.customer = data
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
        async deleteCustomer() {
            try {
                await axiosConfig.delete('/customers/' + this.deleteItem.id)
                this.getCustomers()
                const message = 'Klient o nazwie ' + this.deleteItem.name + ' został usunięty.'
                this.$store.dispatch('success', message)
            } catch (e) {
                const message = 'Klient o nazwie ' + this.deleteItem.name + ' nie został usunięty.'
                this.$store.dispatch('error', message)
            }
            this.closeDeleteCustomer()
        },
        closeDeleteCustomer() {
            this.deleteItem.id = null
            this.deleteItem.name = ''
            this.dialogDelete = false
        },
        close() {
            this.$refs.form.reset()
            this.dialog = false
            this.resetCustomer()
        },
        resetCustomer() {
            this.customer.id = null,
                this.customer.name = "",
                this.customer.email = "",
                this.customer.nrTel = "",
                this.customer.town = "",
                this.customer.country = ""
        },
        async save() {
            this.loadingDialog = true
            if (this.editedIndex > -1) {
                try {
                    await axiosConfig.patch("/customers", this.customer);
                    const message = 'Klient o nazwie ' + this.customer.name + ' został edytowany.'
                    this.getCustomers()
                    this.$store.dispatch('success', message)
                    this.close()
                } catch (e) {
                    if (e.response.data.pole === "name") {
                        this.dialogError = true
                    } else {
                        const message = 'Klient o nazwie ' + this.customer.name + ' nie został edytowany.'
                        this.$store.dispatch('error', message)
                        this.close()
                    }
                }
            } else {
                try {
                    await axiosConfig.patch("/customers", this.customer);
                    this.getCustomers()
                    const message = 'Klient o nazwie ' + this.customer.name + ' został dodany.'
                    this.$store.dispatch('success', message)
                    this.close()
                } catch (e) {
                    if (e.response.data.pole === "name") {
                        this.dialogError = true
                    } else {
                        const message = 'Klient o nazwie ' + this.customer.name + ' nie został dodany.'
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
