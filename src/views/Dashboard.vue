<template>

<v-app>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app dark>
       <div class="mt-5">
        <v-list-item >
            <v-list-item-avatar>
                <v-avatar color="teal darken-1" size="45">
                    <small v-if="avatar === null">AVATAR</small>
                    <v-img v-else :src="`http://localhost:8088/avatar/${avatar}.png`"></v-img>
                </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-subtitle v-text="nameSurname"></v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        </div>
        <v-list dense>
            <v-list-item-group active-class="active" color="teal darken-1">
                <template v-for="item in items">
                    <v-list-item :key="item.text" @click.native="$router.push(item.link)" link>
                        <v-list-item-action>
                            <v-icon color="teal darken-1">{{ item.icon }}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.text }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="dark" dark dense>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
            <span class="hidden-sm-and-down">Narrow - System</span>
        </v-toolbar-title>
        <v-spacer />

        <v-btn @click.stop="dialogLogout = true" icon color="grey lighten-1">
            <v-icon>exit_to_app</v-icon>
        </v-btn>

    </v-app-bar>
    <v-content class="m-2">
        <router-view />
    </v-content>

    <v-dialog v-model="dialogLogout" max-width="300">
        <v-card>
            <v-card-title class="headline">Wyloguj się</v-card-title>

            <v-card-text>
                Czy na pewno chcesz wylogować się??
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="teal darken-1" text @click="dialogLogout = false" tile>
                    Anuluj
                </v-btn>

                <v-btn color="teal darken-1" text @click="logout" tile>
                    Wyloguj
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-app>
</template>

<script>
import {
    mapGetters
} from 'vuex'

export default {

    methods: {
        logout() {
            this.dialogLogout = false;
            this.$store.dispatch('logout');

        }

    },
    data: () => ({
        dialogLogout: false,
        drawer: null,
        items: [

            {
                icon: 'dashboard',
                text: 'Strona główna',
                link: '/dashboard'
            },
            {
                icon: 'people',
                text: 'Użytkownicy',
                link: '/dashboard/users'
            },
            {
                icon: 'thumbs_up_down',
                text: 'Zamówienia',
                link: '/dashboard/orders'
            },
            {
                icon: 'list',
                text: 'Asortyment',
                link: '/dashboard/asortemnents'
            },
            {
                icon: 'accessibility_new',
                text: 'Klienci',
                link: '/dashboard/customers'
            },
            {
                icon: 'emoji_people',
                text: 'Dostawcy',
                link: '/dashboard/providers'
            },
            {
                icon: 'calendar_today',
                text: 'Zadania',
                link: '/dashboard/todo'
            },
            {
                icon: 'euro_symbol',
                text: 'Kurs euro',
                link: '/dashboard/currency'
            },

        ],
    }),
    computed: {
        ...mapGetters({
            avatar: 'avatar',
            nameSurname: 'nameSurname'
        })
    }

}
</script>
