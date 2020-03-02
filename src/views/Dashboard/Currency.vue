<template>
<transition name="fade" mode="out-in">
    <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
        <b-spinner variant="dark" />
    </div>
   <v-card color="grey lighten-4" tile>
    <v-card-title>
        Kurs euro
    </v-card-title>
    <v-card-text>
            <v-alert v-if="currency.lenght !== 0" outlined color="teal darken-1" align="center" text tile>
                <v-icon>euro_symbol</v-icon> Aktualna cena sprzedaży :<b> {{actualCurrency.salesPrice}} </b>zł cena zakupu:<b> {{actualCurrency.buyPrice}} </b>zł na dzień : <b>{{actualCurrency.createDate}}</b>
                aktualizacja o godzinie <b>12:00</b>
            </v-alert>
            <v-data-table :headers="headers" :items="currency" :search="search" sort-by="createDate" sort-desc="true" class="elevation-1" tile>
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-text-field v-model="search" append-icon="search" label="Szukaj" single-line hide-details color="teal darken-1"></v-text-field>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:item.change="{ item }">
                    <v-icon v-if="changeCurrency(item) === 0" medium color="dark">
                        remove
                    </v-icon>
                    <v-icon v-else-if="changeCurrency(item) === 1" medium color="success">
                        arrow_upward
                    </v-icon>
                    <v-icon v-if="changeCurrency(item) === 2" medium color="red">
                        arrow_downward
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="teal darken-1" @click="getCurrency">Przeładuj</v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</transition>
</template>

<script>
import axiosConfig from '../../axios-config'
import {
    mapActions
} from 'vuex'
export default {
    data: () => ({
        actualCurrency: {
            createDate: '',
            salesPrice: '',
            buyPrice: ''
        },
        loading: true,
        search: '',
        headers: [{
                text: 'Nazwa',
                align: 'left',
                value: 'name',
                width:'25%'
            },
            {
                text: 'Symbol',
                value: 'symbol',
                width:'10%'
            },
            {
                text: 'Data',
                value: 'createDate',
                width:'15%'
            },
            {
                text: 'Sprzedaż(zł)',
                value: 'salesPrice',
                width:'15%'
            },
            {
                text: 'Zakup (zł)',
                value: 'buyPrice',
                width:'15%'
            },
            {
                text: 'Zmiana',
                value: 'change',
                sortable: false,
                width:'10%'
            },
        ],
        currency: [],
    }),
    created() {
        this.checkexpiration()
        this.getCurrency()
    },
    watch: {
        currency: function () {
            const lastCurrency = this.currency[this.currency.length - 1];
            this.actualCurrency.createDate = lastCurrency.createDate
            this.actualCurrency.salesPrice = lastCurrency.salesPrice
            this.actualCurrency.buyPrice = lastCurrency.buyPrice
        }
    },
    methods: {...mapActions({
            clearAlert: 'clear',
            checkexpiration:'checkExpiration'
        }),
        async getCurrency() {
            try {
                let {
                    data
                } = await axiosConfig.get('/currency')

                if (data !== null) {
                    this.currency = data;
                }
                this.loading = false;
            } catch (e) {
                alert(e)
            }
        },
        changeCurrency(item) {
            const index = this.currency.indexOf(item);
            if (index === 0) {
                return 0;
            } else {
                const oldValue = this.currency[index - 1].buyPrice
                if (oldValue < item.buyPrice) {
                    return 1;
                } else if (oldValue > item.buyPrice) {
                    return 2;
                } else {
                    return 0;
                }
            }
        }

    }
}
</script>

<style >
</style>
