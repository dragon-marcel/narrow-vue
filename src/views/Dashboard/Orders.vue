<template>
<transition name="fade" mode="out-in">
    <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
        <b-spinner variant="dark" />
    </div>
    <v-card color="grey lighten-4" tile>
    <v-card-title>
        Zamówienia
    </v-card-title>
    <v-card-text>
            <v-alert border="right" dense v-if="alert.message" :type="alert.type" tile>{{alert.message}}</v-alert>

            <v-data-table :headers="headers" :items="orders" :search="search" sort-by="id" sort-desc='true' class="elevation-1" dense>
                <template v-slot:top>
                    <v-toolbar flat color="white" >
                        <v-flex md2 mr-6>
                            <v-text-field dense v-model="search" clearable="true" append-icon="search" label="Szukaj" color="teal darken-1"></v-text-field>
                        </v-flex>

                        <v-flex md2 mr-6 class="d-none d-sm-block">
                            <v-select :items="users" clearable="true" item-value="name" item-text="name" v-model="filtrUser" color="teal darken-1" dense label="Użytkownik"></v-select>
                        </v-flex>
                        <v-flex md2 mr-6 class="d-none d-md-block">
                            <v-menu dense ref="menu3" v-model="menu3" :close-on-content-click="false" :return-value.sync="raport.end" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field clearable="true" v-model="filtrDate.start" label="Data od" prepend-icon="event" readonly v-on="on" color="teal darken-1"></v-text-field>
                                </template>
                                <v-date-picker v-model="filtrDate.start" :max="filtrDate.end" no-title color="teal darken-1" scrollable locale="pl">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="teal darken-1" @click="menu3 = false" tile>Cancel</v-btn>
                                    <v-btn text color="teal darken-1" @click="$refs.menu3.save(filtrDate.start)" tile>OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex md2 mr-6 class="d-none d-md-block">
                            <v-menu  dense ref="menu4" v-model="menu4" :close-on-content-click="false" :return-value.sync="raport.end" transition="scale-transition" offset-y min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field clearable="true" v-model="filtrDate.end" label="Data do" prepend-icon="event" readonly v-on="on" color="teal darken-1"></v-text-field>
                                </template>
                                <v-date-picker v-model="filtrDate.end" :min="filtrDate.start" no-title  color="teal darken-1" crollable locale="pl">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="teal darken-1" @click="menu4 = false" tile>Cancel</v-btn>
                                    <v-btn text color="teal darken-1" @click="$refs.menu4.save(filtrDate.end)" tile>OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>

                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialogXLS" max-width="400px">
                            <template v-slot:activator="{ on }">
                                <v-btn class="d-none d-md-block mb-2 mr-2" color="light-blue darken-2" dark  v-on="on" tile>XLS</v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Generuj raport XLS</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="8" md="6">
                                                <v-menu  dense ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="raport.start" transition="scale-transition" offset-y min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field v-model="raport.start" label="Data do" prepend-icon="event" readonly v-on="on" color="teal darken-1"></v-text-field>
                                                    </template>
                                                    <v-date-picker dense v-model="raport.start" :max="raport.end" no-title scrollable  color="teal darken-1" locale="pl">
                                                        <v-spacer></v-spacer>
                                                        <v-btn text color="teal darken-1" @click="menu = false" tile>Cancel</v-btn>
                                                        <v-btn text color="teal darken-1" @click="$refs.menu.save(raport.start)" tile>OK</v-btn>
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-spacer></v-spacer>

                                            <v-col cols="12" sm="8" md="6">
                                                <v-menu  dense ref="menu2" v-model="menu2" :close-on-content-click="false" :return-value.sync="raport.end" transition="scale-transition" offset-y min-width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field v-model="raport.end" label="Data do" prepend-icon="event" readonly v-on="on" color="teal darken-1"></v-text-field>
                                                    </template>
                                                    <v-date-picker  dense v-model="raport.end" :min="raport.start" no-title scrollable  color="teal darken-1" locale="pl">
                                                        <v-spacer></v-spacer>
                                                        <v-btn text color="teal darken-1" @click="menu2 = false" tile>Cancel</v-btn>
                                                        <v-btn text color="teal darken-1" @click="$refs.menu2.save(raport.end)" tile>OK</v-btn>
                                                    </v-date-picker>
                                                </v-menu>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-row justify="center">
                                                <v-col class="d-flex" cols="12" sm="6" md="10">
                                                    <v-select dense clearable="true" v-model="raport.idUser" :items="users" item-value="id" item-text="name" label="Użytkownik" color="teal darken-1"></v-select>
                                                </v-col>
                                            </v-row>
                                        </v-row>

                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="teal darken-1" text @click="closeRaport" tile>Anuluj</v-btn>
                                    <v-btn color="teal darken-1" :loading="loadingXLS" :disabled="loadingXLS" text @click="generateXLS" tile>Generuj

                                        <template v-slot:loader>
                                            <span class="custom-loader">
                                                <v-icon light>cached</v-icon>
                                            </span>
                                        </template>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogErrorXLS" max-width="290">
                            <v-card>
                                <v-card-title class="headline">Raport XLS</v-card-title>

                                <v-card-text>
                                    <sweetalert-icon icon="warning" />
                                    Brak danych dla raportu w zakresie od {{raport.start}} do {{raport.end}}.
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="teal darken-1" text @click="dialogErrorXLS = false" tile>
                                        Zamknij
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <v-dialog v-model="dialogAdd" max-width="800px">
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
                                            <v-row v-show="editedIndex > -1">
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="order.number" :disabled="true" color="teal darken-1" label="Numer zamówienia" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="order.createDate" :disabled="true" color="teal darken-1" label="Data utworzenia" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="order.user.username" :disabled="true" color="teal darken-1" label="Użytkownik" dense></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-autocomplete :items="assortments" :rules="[rules.required]" item-value="id" item-text="name" color="teal darken-1" v-model="order.assortment.id" label="Asortyment" dense></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select :items="symbols" item-value="name" :rules="[rules.required]" item-text="name" color="teal darken-1" v-model="order.symbol" label="Waluta" dense></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.currency.salesPrice" :disabled="true" color="teal darken-1" label="Kurs EUR" dense></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-autocomplete :items="providers" item-value="id" :rules="[rules.required]" item-text="name" color="teal darken-1" v-model="order.provider.id" label="Dostawca" dense></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.quantityPurchase" :rules="[rules.required]" @keypress="onlyNumber" @change="valuePurchase" color="teal darken-1" label="Ilość" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.pricePurchase" :rules="[rules.required]" @keypress="onlyNumber" @change="valuePurchase" color="teal darken-1" label="Cena" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.valuePurchase" :rules="[rules.required]" @keypress="onlyNumber" @change="countProfit" color="teal darken-1" label="Wartość" dense></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-autocomplete :items="customers" item-value="id" :rules="[rules.required]" item-text="name" color="teal darken-1" v-model="order.customer.id" label="Klient" dense></v-autocomplete>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.quantitySell" :rules="[rules.required]" @keypress="onlyNumber" @change="valueSell" color="teal darken-1" label="Ilość" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.priceSell" :rules="[rules.required]" @keypress="onlyNumber" @change="valueSell" color="teal darken-1" label="Cena" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.valueSell" :rules="[rules.required]" @keypress="onlyNumber" @change="countProfit" color="teal darken-1" label="Wartość" dense></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="10">
                                                    <v-text-field v-model="order.comments" clearable="true" color="teal darken-1" label="Uwagi" dense></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-text-field v-model="order.profit" :readonly="true" color="teal darken-1" @change="countProfit" :label="'Zysk '+order.symbol" dense></v-text-field>
                                                </v-col>
                                            </v-row>

                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="teal darken-1" @click="close" tile>Anuluj</v-btn>
                                        <v-btn text color="teal darken-1" :loading="loadingDialog" :disabled="loadingDialog || !valid" @click="save" @keyup.enter="save" tile>Zapisz</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-form>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.valuePurchase="{ item }">
                    {{returnValuePurchase(item)}}
                </template>
                <template v-slot:item.valueSell="{ item }">
                    {{returnValueSell(item)}}
                </template>
                <template v-slot:item.profit="{ item }">
                    {{returnProfit(item)}}
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" :disabled="!allowed(item.user.id)" @click="editItem(item)" color="blue">
                        edit
                    </v-icon>
                    <v-icon small :disabled="!allowed(item.user.id)" @click="confirmDeleteOrder(item)" color="red">
                        delete
                    </v-icon>

                </template>
                <template v-slot:no-data>
                    <v-btn color="teal darken-1" @click="getOrders" tile>Przeładuj</v-btn>
                </template>
            </v-data-table>
            <v-dialog v-model="dialogDelete" max-width="300">
                <v-card>
                    <v-card-title class="headline">Usuń</v-card-title>

                    <v-card-text>
                        Czy na pewno chcesz anulować zamówienie o numerze: {{this.deleteItem.number}} ??
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn color="teal darken-1" text @click="closeDialogDelete" tile>
                            Anuluj
                        </v-btn>

                        <v-btn color="teal darken-1" text @click="deleteOrder" tile>
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
import SweetalertIcon from 'vue-sweetalert-icons';
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex'

export default {
    components: {
        SweetalertIcon
    },
    data: () => ({
        filtrDate: {
            start: '',
            end: ''
        },
        filtrUser: '',
        rules: {
            required: value => !!value || '',
        },
        dialogDelete: false,
        valid: false,
        assortments: [],
        providers: [],
        customers: [],
        loadingDialog: false,
        loadingDialogOrder: false,
        loadingXLS: false,
        dialogErrorXLS: false,
        raport: {
            idUser: null,
            start: new Date().toISOString().substr(0, 10),
            end: new Date().toISOString().substr(0, 10)
        },
        loading: true,
        users: [],
        menu: false,
        modal: false,
        menu2: false,
        menu4: false,
        menu3: false,
        search: '',
        dialogAdd: false,
        dialogXLS: false,

        orders: [],
        symbols: [{
                id: 1,
                name: 'EUR'
            }, {
                id: 2,
                name: 'PLN'
            }

        ],
        deleteItem: {
            id: null,
            number: ''
        },
        editedIndex: -1,
        order: {
            id: null,
            symbol: '',
            assortment: {
                id: 0
            },
            provider: {
                id: 0
            },
            customer: {
                id: 0
            },
            user: {
                username: ''
            },
            currency: {
                salesPrice: ''
            },
            quantityPurchase: '',
            pricePurchase: '',
            valuePurchase: '',
            quantitySell: '',
            priceSell: '',
            valueSell: '',
            profit: '',
            createDate: '',
            number: ''

        },
        defaultItem: {
            name: '',
            calories: 0,
            fat: 0,
            carbs: 0,
            protein: 0,
        },

    }),

    computed: {
        headers() {
            return [{
                    text: 'Numer',
                    align: 'left',
                    sortable: true,
                    value: 'number',
                },
                {
                    text: 'Data',
                    value: 'createDate',
                    filter: value => {
                        var date = new Date(value)
                        var start = undefined
                        var end = undefined

                        if (!this.filtrDate.start && !this.filtrDate.end) {
                            return true
                        } else if (!this.filtrDate.end && this.filtrDate.start) {
                            start = new Date(this.filtrDate.start)
                            return date >= start
                        } else if (this.filtrDate.end && !this.filtrDate.start) {
                            end = new Date(this.filtrDate.end)
                            return date <= end
                        } else {
                            start = new Date(this.filtrDate.start)
                            end = new Date(this.filtrDate.end)
                            return date >= start && date <= end
                        }
                    },
                },
                {
                    text: 'Użytkownik',
                    value: 'user.username',
                    filter: value => {
                        if (!this.filtrUser) return true
                        return value == this.filtrUser
                    },
                },
                {
                    text: 'Asortyment',
                    value: 'assortment.name'
                },
                {
                    text: 'Ilość',
                    value: 'quantityPurchase'
                },
                {
                    text: 'Waluta',
                    value: 'symbol'
                },
                {
                    text: 'Dostawca',
                    value: 'provider.name'
                },
                {
                    text: 'Klient',
                    value: 'customer.name'
                },
                {
                    text: 'Zakup',
                    value: 'valuePurchase'
                },
                {
                    text: 'Sprzedaż',
                    value: 'valueSell'
                },
                {
                    text: 'Zysk',
                    value: 'profit'
                },
                {
                    text: 'Akcje',
                    value: 'action'
                }
            ]
        },
        ...mapGetters({

            idUser: 'idUser',
            isAdmin: 'isAdmin'
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'Dodaj zamówienie' : 'Edytuj zamówienie'
        },
        ...mapState({
            alert: state => state.alert
        }),
    },
    watch: {
        dialogAdd(val) {
            val || this.close()
        }
    },
    created() {
        this.checkexpiration()
        this.getAssortments();
        this.getCustomers();
        this.getProviders()
        this.getOrders();
        this.clearAlert();
    },
    methods: {
        ...mapActions({
            clearAlert: 'clear',
            checkexpiration: 'checkExpiration'
        }),
        getDateFirstDayOfMonth() {
            var date = new Date();

            return date
        },
        allowed(id) {
            return (id == this.idUser || this.isAdmin)
        },
        returnProfit(item) {
            if (item.symbol == 'PLN') {
                return item.profitPLN
            } else {
                return item.profitEUR
            }
        },
        returnValuePurchase(item) {
            if (item.symbol == 'PLN') {
                return item.valuePurchasePLN
            } else {
                return item.valuePurchaseEUR
            }
        },
        returnValueSell(item) {
            if (item.symbol == 'PLN') {
                return item.valueSellPLN
            } else {
                return item.valueSellEUR
            }
        },
        countProfit() {
            this.order.profit = this.order.valueSell - this.order.valuePurchase
        },
        valueSell() {
            this.order.valueSell = this.order.quantitySell * this.order.priceSell
            this.countProfit()

        },
        valuePurchase() {
            this.order.valuePurchase = this.order.quantityPurchase * this.order.pricePurchase
            this.countProfit()

        },
        onlyNumber($event) {

            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            let value = $event.target.value
            let dot = false
            if (value.includes('.')) {
                dot = true
            }
            if ((keyCode < 48 || keyCode > 57) && (dot || keyCode !== 46)) {
                $event.preventDefault();
            }
        },

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
        async getAssortments() {
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

        async getProviders() {
            try {
                let {
                    data
                } = await axiosConfig.get('/providers')

                if (data !== null) {
                    this.providers = data;
                }
                this.loading = false;
            } catch (e) {
                alert(e)
            }
        },
        getUsersXLS() {
            for (var a = 0; a < this.orders.length; a++) {
                const order = this.orders[a];
                const user = {
                    name: order.user.username,
                    id: order.user.id
                }
                if (!this.users.some(u => u.name === user.name)) {
                    this.users.push(user)
                }
            }
        },
        async editItem(item) {
            this.editedIndex = this.orders.indexOf(item)
            var editOrder = undefined

            try {
                let {
                    data
                } = await axiosConfig.get('/orders/' + item.id)
                editOrder = data
            } catch (e) {
                alert(e)
            }
            if (editOrder.symbol == 'PLN') {
                editOrder.valueSell = item.valueSellPLN
                editOrder.profit = item.profitPLN
                editOrder.priceSell = item.priceSellPLN
                editOrder.valuePurchase = item.valuePurchasePLN
                editOrder.pricePurchase = item.pricePurchasePLN

            } else if (editOrder.symbol == 'EUR') {
                editOrder.valueSell = item.valueSellEUR
                editOrder.profit = item.profitEUR
                editOrder.priceSell = item.priceSellEUR
                editOrder.valuePurchase = item.valuePurchaseEUR
                editOrder.pricePurchase = item.pricePurchaseEUR
            }
            this.order = editOrder
            this.dialogAdd = true
            this.loadingDialogOrder = false

        },
        confirmDeleteOrder(item) {
            this.deleteItem.id = item.id
            this.deleteItem.number = item.number
            this.dialogDelete = true
        },
        async deleteOrder() {

            try {
                await axiosConfig.patch('/orders/delete/' + this.deleteItem.id)
                this.getOrders();
                const message = 'Zamówienie o numerze ' + this.deleteItem.number + ' zostało anulowane.'
                this.$store.dispatch('success', message)
            } catch (e) {
                const message = 'Błąd!!. Zamówienie o numerze ' + this.deleteItem.number + ' nie zostało anulowanie.'
                this.$store.dispatch('error', message)
            }
            this.closeDialogDelete()
        },
        closeDialogDelete() {
            this.deleteItem.number = ''
            this.deleteItem.id = null
            this.dialogDelete = false
        },
        close() {
            this.$refs.form.reset();
            this.resetOrder()
            this.editedIndex = -1
            this.dialogAdd = false

        },
        closeRaport() {
            this.dialogXLS = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        async generateXLS() {
            this.loadingXLS = true;

            try {
                var idUser = this.raport.idUser;
                if (idUser === null || idUser === undefined) {
                    idUser = 0;
                }
                let {
                    data
                } = await axiosConfig.get('/orders/raport?start=' + this.raport.start + '&end=' + this.raport.end + '&id=' + idUser, {
                    responseType: 'blob'
                })

                if (data !== null) {
                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'raport_' + this.raport.start + '_' + this.raport.end + '.xlsx');
                    document.body.appendChild(link);
                    link.click();
                    this.dialogXLS = false
                }

            } catch (error) {
                if (error.response.status === 500) {
                    this.dialogErrorXLS = true;
                }
            }
            this.loadingXLS = false;
        },
        async getOrders() {
            this.loading = true
            try {
                let {
                    data
                } = await axiosConfig.get('/orders')

                if (data !== null) {
                    this.orders = data;
                }
                this.getUsersXLS();
                this.loading = false;

            } catch (e) {
                alert(e)
            }
            this.loading = false
        },
        clearAlert() {

            this.$store.dispatch('clear')
        },
        resetOrder() {

            this.order = {
                id: null,
                symbol: '',
                assortment: {
                    id: ''
                },
                provider: {
                    id: ''
                },
                customer: {
                    id: ''
                },
                user: {
                    username: ''
                },
                currency: {
                    salesPrice: ''
                },
                quantityPurchase: '',
                pricePurchase: '',
                valuePurchase: '',
                quantitySell: '',
                priceSell: '',
                valueSell: '',
                profit: '',
                createDate: '',
                number: '',

            }
        },
        async save() {
            this.loadingDialog = true;
            const newOrder = this.order

            if (this.order.symbol == 'PLN') {
                newOrder.valueSellPLN = this.order.valueSell
                newOrder.profitPLN = this.order.profit
                newOrder.priceSellPLN = this.order.priceSell
                newOrder.valuePurchasePLN = this.order.valuePurchase
                newOrder.pricePurchasePLN = this.order.pricePurchase
                newOrder.user.id = this.idUser

            } else if (this.order.symbol == 'EUR') {
                newOrder.valueSellEUR = this.order.valueSell
                newOrder.profitEUR = this.order.profit
                newOrder.priceSellEUR = this.order.priceSell
                newOrder.valuePurchaseEUR = this.order.valuePurchase
                newOrder.pricePurchaseEUR = this.order.pricePurchase
                newOrder.user.id = this.idUser
            }
            if (this.editedIndex > -1) {
                try {

                    await axiosConfig.patch("/orders", newOrder);
                    const message = 'Zamówienie o numer ' + newOrder.number + ' zostało edytowane.'
                    this.getOrders()
                    this.$store.dispatch('success', message)

                } catch (e) {
                    const message = 'Zamówienie o numerze ' + newOrder.number + ' nie zostało edytowane.'
                    this.$store.dispatch('error', message)
                }
            } else {

                try {
                    let {
                        data
                    } = await axiosConfig.post("/orders", newOrder);
                    this.getOrders()
                    const message = 'Zamówienie o numerze: ' + data.number + ' zostało dodane.'
                    this.$store.dispatch('success', message)

                } catch (e) {
                    const message = 'Zamówienie nie zostało dodane.'
                    this.$store.dispatch('error', message)

                }
            }
            this.loadingDialog = false;
            this.close()
        }
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
