<template>

<v-card color="grey lighten-4" tile>
    <v-card-title>
        Strona główna
    </v-card-title>
    <transition name="fade" mode="out-in">
        <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
            <b-spinner variant="dark" />
        </div>
        <v-card-text>
            <v-row>
                <v-col xs=12 sm=12 md="4">
                    <v-card height="380px" tile>
                        <v-card-title>
                            Kalendarz
                        </v-card-title>
                        <v-row justify="space-around">
                            <v-date-picker readonly no-title scrollable locale="pl" color="teal darken-1"></v-date-picker>
                        </v-row>
                        <v-card-title>

                        </v-card-title>
                    </v-card>
                </v-col>
                <v-col xs=12 sm=12 md="8">
                    <v-card class="statistic" light tile>
                        <v-card-title>
                            Statystyki
                        </v-card-title >
                        <v-card-text class="mb-5 " >
                        <v-layout wrap justify-center>

                            <v-flex xs12 sm12 md4 class="mb-2 mr-2" v-for="i in statistic" :key="i.name" tile>
                                <v-card class="title-proper-height" tile> 
                                    <v-list-item>
                                        <v-list-item-avatar color="grey">
                                            <v-icon class="teal darken-1 white--text" v-text="i.icon"></v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title class="headline">{{i.data}}</v-list-item-title>
                                            <v-list-item-subtitle>{{i.name}}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>

                                </v-card>
                            </v-flex>
                            
                        </v-layout>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col xs=12 sm=12 md="8" class="pa-2">
                    <v-card class="  text-center  text-xs-center" height="420px" tile>
                        <v-card-title>Ilość zamówień z ostatnich 7 dni</v-card-title>
                        <v-card-text>

                            <apexchart height="300px" type="line" :options="chartLine.chartOptions" :series="chartLine.series"></apexchart>
                        </v-card-text>

                    </v-card>

                </v-col>
                <v-col xs=12 sm=12 md="4" class="pa-2">
                    <v-card class="  text-left text-xs-left" height="420px">
                        <v-card-title>Historia zamówień w {{year}}</v-card-title>
                        <v-card-text>
                            <template>
                                <v-simple-table dense height="350px">
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">Miesiąc</th>
                                                <th class="text-left">Ilość</th>
                                                <th class="text-left">Zysk (PLN)</th>
                                                <th class="text-left">Zysk (EUR)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in profitData" :key="item.date">
                                                <td>{{ item.date }}</td>
                                                <td>{{item.quantity }}</td>
                                                <td>{{ item.profitPLN }}</td>
                                                <td>{{ item.profitEUR }}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </template>
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
            <v-row>
                <v-col xs=12 sm=12 md="6">

                    <v-card class=" text-center  text-xs-center" height="420" tile>
                        <v-card-title>Ilość zamówień </v-card-title>
                        <v-card-text>
                            <apexchart height="300px" type="donut" :options="chartPie.chartOptions" :series="chartPie.chartOptions.series"></apexchart>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col xs=12 sm=12 md="6">

                    <v-card class=" text-center  text-xs-center" height="420px">
                        <v-card-title>Ilość zamówień w {{year}}</v-card-title>

                        <v-card-text>
                            <apexchart type="bar" height="350" :options="chartBar.chartOptions" :series="chartBar.series"></apexchart>
                        </v-card-text>
                    </v-card>
                </v-col>

            </v-row>

        </v-card-text>

    </transition>
</v-card>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import axiosConfig from '../../axios-config'

export default {

    data: () => ({
        year: new Date().getFullYear(),
        profitData: [],
        loadingChartDonut: true,
        loadingStatistic: true,
        loadingChartLine: true,
        loadingChartBar: true,
        loadingProfit: true,
        date: new Date().toLocaleDateString(),
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        statistic: [],
        chartBar: {
            series: [],
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    }
                },

                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                xaxis: {
                    categories: [],
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                },
                fill: {
                    opacity: 1
                }
            },
        },
        chartPie: {
            chartOptions: {
                labels: [],
                series: [],
                chart: {
                    type: 'donut',
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            }
        },
        chartLine: {
            series: [{
                name: "Zamówienia",
                data: []
            }],
            chartOptions: {
                chart: {
                    height: 300,
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: true

                },

                stroke: {
                    curve: 'straight'
                },

                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: [],
                }

            }
        }

    }),
    methods: {
        ...mapActions({
            clearAlert: 'clear',
            checkexpiration: 'checkExpiration'
        }),
        async getChartBar() {
            try {
                let {
                    data
                } = await axiosConfig.get('/charts/bar')

                this.setChartBar(data)
            } catch (e) {
                alert(e)
            }
            this.loadingChartBar = false

        },
        setChartBar(chartdata) {
            var a = 0
            var categories = []
            var series = []
            for (a; a < chartdata.length; a++) {
                var nameUser = chartdata[a].userName
                if (!series.some(a => a.name == nameUser)) {
                    var b = 0
                    var number = []
                    var name = nameUser
                    for (b; b < chartdata.length; b++) {
                        if (nameUser == chartdata[b].userName) {
                            number.push(chartdata[b].number)
                        }
                    }
                    series.push({
                        name: name,
                        data: number
                    })

                }

                var categorie = chartdata[a].monthYear.length == 6 ? '0' + chartdata[a].monthYear : chartdata[a].monthYear

                if (!categories.includes(categorie)) {
                    categories.push(categorie)
                }
            }
            this.chartBar.series = series
            this.chartBar.chartOptions = {
                xaxis: {
                    categories: categories
                }
            }

        },
        async getProfitPerMonths() {
            try {
                let {
                    data
                } = await axiosConfig.get('/charts/profit/' + this.idUser)
                this.setProfitData(data)
            } catch (e) {
                alert(e)
            }
            this.loadingProfit = false
        },
        setProfitData(data) {
            this.profitData = data
        },
        async getChartLine() {
            try {
                let {
                    data
                } = await axiosConfig.get('/charts/line/' + this.idUser)
                this.setChartLine(data)
            } catch (e) {
                alert(e)
            }
            this.loadingChartLine = false

        },
        async getStatistic() {
            try {
                let {
                    data
                } = await axiosConfig.get('/charts/statistic/' + this.idUser)
                this.statistic = data
            } catch (e) {
                alert(e)
            }
            this.loadingStatistic = false

        },
        async getChartDonut() {
            try {
                let {
                    data
                } = await axiosConfig.get('/charts/donut')
                this.setChartDonut(data)
            } catch (e) {
                alert(e)
            }
            this.loadingChartDonut = false

        },
        setChartDonut(data) {
            let i = 0;
            const categories = ['brak danych']
            const numberOrder = [100]
            for (i; i < data.length; i++) {
                categories[i] = data[i][0]
                numberOrder[i] = data[i][1]

            }
            this.chartPie.chartOptions = {
                series: numberOrder,
                labels: categories
            }
        },
        setChartLine(data) {
            const categories = []
            const numberOrder = []

            let i = 0;
            for (i; i < data.length; i++) {
                var date = data[i].date.slice(5, 10);
                var array = date.split("-")
                var newDate = [array[1], array[0]].join('-')

                categories[i] = newDate
                numberOrder[i] = data[i].numberOrders

            }
            this.chartLine.series[0].data = numberOrder
            this.chartLine.chartOptions = {
                xaxis: {
                    categories: categories
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            userName: 'userName',
            roles: 'roles',
            idUser: 'idUser',
            nameSurname: 'nameSurname'

        }),

        loading() {
            return this.loadingStatistic && this.loadingChartLine && this.loadingChartDonut && this.loadingChartBar && this.loadingProfit
        }
    },
    created() {
        this.checkexpiration()
        this.getChartLine();
        this.getChartDonut();
        this.getStatistic();
        this.getChartBar();
        this.getProfitPerMonths();

    }
};
</script>
<style>


@media(min-width: 960px){
     .statistic {
 height: 380px;
 }

}
</style>