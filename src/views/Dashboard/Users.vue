<template>
<transition name="fade" mode="out-in">

    <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
        <b-spinner variant="dark" />
    </div>

    <v-card color="grey lighten-4" tile>
        <v-card-title>
            Użytkownicy
        </v-card-title>
        <v-card-text>
            <v-alert border="right" dense v-if="alert.message" :type="alert.type" tile>{{alert.message}}</v-alert>

            <v-data-table :headers="headers" :items="users" :search="search" sort-by="username" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-text-field v-model="search" append-icon="search" label="Szukaj" single-line hide-details color="teal darken-1"></v-text-field>
                        <v-spacer></v-spacer>
                        <div v-show="isAdmin">
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

                                                <v-col cols="12" sm="6" md="12">
                                                    <v-dialog v-model="dialogAvatar" scrollable max-width="600px">
                                                        <template v-slot:activator="{ on }">
                                                            <v-row justify="center" align="center">

                                                                <v-btn icon v-on="on">
                                                                    <v-avatar color="teal darken-1" size="100">
                                                                        <small v-if="user.avatar === null">AVATAR</small>
                                                                        <v-img v-else :src="`http://localhost:8088/avatar/${user.avatar}.png`"></v-img>
                                                                    </v-avatar>
                                                                </v-btn>
                                                            </v-row>

                                                        </template>
                                                        <v-card>
                                                            <v-card-title>Wybierz avatar</v-card-title>
                                                            <v-divider></v-divider>
                                                            <v-card-text style="height: 500px;">

                                                                <v-row>

                                                                    <v-col v-for="n in 20" :key="n" class="d-flex child-flex" cols=3>
                                                                        <v-card flat tile class="d-flex">
                                                                            <v-list-item @click="setAvatar(n)">
                                                                                <v-avatar color="teal darken-1" size="100">
                                                                                    <v-img :src="`http://localhost:8088/avatar/${n}.png`" :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`" aspect-ratio="1" class="grey lighten-2">
                                                                                        <template v-slot:placeholder>
                                                                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                                                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                                                                            </v-row>
                                                                                        </template>
                                                                                    </v-img>
                                                                                </v-avatar>
                                                                            </v-list-item>
                                                                        </v-card>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card-text>
                                                            <v-divider></v-divider>
                                                            <v-card-actions>
                                                                <v-btn color="teal darken-1" text @click="dialogAvatar = false">Zamknij</v-btn>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-dialog>

                                                </v-col>
                                                <v-row>
                                                    <v-col cols="12" sm="12" md="8">
                                                        <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="user.username" label="Login" dense></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="4">
                                                        <v-select color="teal darken-1" item-value="id" :rules="[rules.required]" item-text="name" :items="roles" :disabled="!isAdmin" dense v-model="user.role" label="Uprawnienia"></v-select>
                                                    </v-col>
                                                </v-row>
                                                <v-row>

                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="user.name" label="Imię" dense></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="user.surname" label="Nazwisko" dense></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field color="teal darken-1" :rules="[rules.required,rules.email]" v-model="user.email" label="E-mail" dense></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field color="teal darken-1" :rules="[rules.required]" v-model="user.telephon" label="Telefon" dense></v-text-field>
                                                    </v-col>
                                                </v-row>

                                                <v-row>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-text-field v-if="editedIndex === -1" color="teal darken-1" :rules="[rules.required,rules.min]" v-model="user.password" label="Hasło" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPass = !showPass" :type="showPass ? 'text' : 'password'" dense></v-text-field>
                                                        <v-checkbox dense input-value="true" v-model="newPass" v-if="editedIndex !== -1 " color="teal darken-1" label="Zmień hasło" value></v-checkbox>
                                                        <v-text-field v-if="editedIndex !== -1 && newPass" color="teal darken-1" :rules="[rules.required,rules.min]" v-model="user.newPassword" label="Nowe hasło" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPass = !showPass" :type="showPass ? 'text' : 'password'" dense></v-text-field>

                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="6">
                                                        <v-switch v-if="editedIndex !== -1 && isAdmin" color="teal darken-1" dense v-model="user.active" :label="user.active ? 'konto aktywne':'konto zablokowane'"></v-switch>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="teal darken-1" text @click="close">Cancel</v-btn>
                                            <v-btn color="teal darken-1" :loading="loadingSave" :disabled="loadingSave || !valid" text @click="save" @keyup.enter="save">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-form>
                            </v-dialog>
                        </div>
                        <v-dialog v-model="dialogError" max-width="290">
                            <v-card>
                                <v-card-title class="headline">Błąd</v-card-title>

                                <v-card-text>
                                    <sweetalert-icon icon="error" />
                                    Użytkownik o loginie "{{user.username}}" jest już zajęty. Proszę wybrać inny login.
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="teal darken-1" text @click="dialogError = false">
                                        Zamknij
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.avatar="{ item }">
                    <v-avatar color="teal darken-1" size="40">
                        <small v-if="item.avatar === null"></small>
                        <v-img v-else :src="`http://localhost:8088/avatar/${item.avatar}.png`"></v-img>
                    </v-avatar>

                </template>
                <template v-slot:item.role="{ item }">
                    {{getRole(item)}}
                </template>
                <template v-slot:item.active="{ item }">
                    <div v-if="item.active == true">
                        <v-icon color="success">
                            check_box
                        </v-icon>
                    </div>
                    <div v-if="item.active == false">
                        <v-icon color="red">
                            indeterminate_check_box
                        </v-icon>
                    </div>
                </template>
                <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)" :disabled="!allowed(item.id)" color="blue">
                        edit
                    </v-icon>
                    <v-icon small @click.stop="confirmDelete(item)" :disabled="!allowed(item.id)" color="red">
                        delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="teal darken-1" @click="getUsers">Przeładuj</v-btn>
                </template>
            </v-data-table>
        </v-card-text>
        <v-dialog v-model="dialogDelete" max-width="300">
            <v-card>
                <v-card-title class="headline">Usuń</v-card-title>

                <v-card-text>
                    Czy na pewno chcesz usunąć użytkownika o loginie: {{this.deleteItem.name}} ??
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="teal darken-1" text @click="closeDialogDelete()">
                        Anuluj
                    </v-btn>

                    <v-btn color="teal darken-1" text @click="deleteUser()">
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
    mapGetters
} from 'vuex'
export default {
    data: () => ({
        newPass: false,
        dialogError: false,
        loadingSave: false,
        avatars: [{
                src: 'https://i.picsum.photos/id/15/500/300.jpg'
            },
            {
                src: 'https://i.picsum.photos/id/15/500/300.jpg'
            },
            {
                src: 'https://i.picsum.photos/id/15/500/300.jpg'
            },
            {
                src: 'https://i.picsum.photos/id/15/500/300.jpg'
            },
            {
                src: 'https://i.picsum.photos/id/15/500/300.jpg'
            }
        ],

        dialogAvatar: false,
        rules: {
            required: value => !!value || 'Pole jest wymagane.',
            min: v => v.length >= 8 || 'Min 8 znaków.',
            email: v => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(v) || 'Wpisz poprawny adresy.'
            }
        },
        valid: false,
        loading: true,
        dialogDelete: false,
        search: '',
        dialog: false,
        showPass: false,
        headers: [{
                text: 'Login',
                align: 'left',
                sortable: true,
                value: 'username',
            },
            {
                text: 'Imię',
                value: 'name'
            },
            {
                text: 'Nazwisko',
                value: 'surname'
            },

            {
                text: 'E-mail',
                value: 'email'
            },
            {
                text: 'Telefon',
                value: 'telephon'
            },
            {
                text: 'Avatar',
                value: 'avatar',
                sortable: false

            },
            {
                text: 'Uprawnienia',
                value: 'role',
                sortable: false

            },
            {
                text: 'Aktywny',
                value: 'active',
                sortable: false

            },

            {
                text: 'Akcje',
                value: 'action',
                sortable: false
            },
        ],
        users: [],
        editedIndex: -1,
        roles: [],
        user: {
            username: "",
            id: null,
            name: "",
            surname: "",
            email: "",
            telephon: "",
            password: "",
            activ: true,
            avatar: null,
            role: ''

        },
        deleteItem: {
            id: null,
            name: ''
        }

    }),
    computed: {

        ...mapState({
            alert: state => state.alert,

        }),
        ...mapGetters({
            avatar: 'avatar',
            idUser: 'idUser',
            isAdmin: 'isAdmin'
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'Dodaj użytkownika' : 'Edytuj użytkwnika'
        }

    },
    watch: {
        dialog(val) {
            val || this.close()
        }
    },
    created() {
        this.getUsers()
        this.getRoles()
        this.clearAlert()

    },
    methods: {
        async getRoles() {
            try {
                let {
                    data
                } = await axiosConfig.get('/users/roles')
                this.roles = data
            } catch (e) {
                alert(e)
            }
        },
        allowed(id) {

            return (id == this.idUser || this.isAdmin)
        },
        confirmDelete(item) {
            this.deleteItem.id = item.id
            this.deleteItem.name = item.username
            this.dialogDelete = true
        },
        getRole(item) {
            return item.roles[0].name
        },
        getRoleByid(id) {

            return {
                id: id,
                name: ''
            }
        },
        setAvatar(id) {
            this.dialogAvatar = false
            this.user.avatar = id
        },
        clearAlert() {

            this.$store.dispatch('clear')
        },
        async getUsers() {
            try {
                let {
                    data
                } = await axiosConfig.get('/users')

                if (data !== null) {
                    this.users = data;
                }
                this.loading = false;
            } catch (e) {
                alert(e)
            }

        },
        async editItem(item) {
            this.editedIndex = this.users.indexOf(item)
            try {
                let {
                    data
                } = await axiosConfig.get('/users/' + item.id)
                this.user = data
                this.user.password = ''
                this.user.newPassword = ''
                this.user.role = data.roles[0].id
            } catch (e) {
                alert(e)
            }
            this.dialog = true
        },
        async deleteUser() {
            try {
                await axiosConfig.delete('/users/delete/' + this.deleteItem.id)
                this.getUsers()
                const message = 'Użytkownik o nazwie ' + this.deleteItem.name + ' został usunięty.'
                this.$store.dispatch('success', message)
                if (this.idUser == this.deleteItem.id) {
                    this.$store.dispatch('logout');
                }
            } catch (e) {
                const message = 'Użytkownik o nazwie ' + this.deleteItem.name + ' nie został usunięty.'
                this.$store.dispatch('error', message)
            }
            this.closeDialogDelete()

        },
        closeDialogDelete() {
            this.deleteItem.id = null
            this.deleteItem.name = ''
            this.dialogDelete = false
        },
        close() {
            this.$refs.form.reset();
            this.resetUser();
            this.dialog = false
            this.editedIndex = -1
        },
        resetUser() {
            this.user = {
                username: "",
                id: null,
                name: "",
                surname: "",
                email: "",
                telephon: "",
                password: "",
                avatar: null

            }
        },
        async save() {
            if (this.editedIndex > -1) {
                this.loadingSave = true

                try {
                    if (this.newPass && this.user.newPassword != '') {
                        this.user.password = this.user.newPassword
                    }
                    let role = this.getRoleByid(this.user.role)
                    this.user.roles = [role]
                    await axiosConfig.patch("/users", this.user);
                    const message = 'Użytkownik o nazwie ' + this.user.username + ' został edytowany.'
                    this.getUsers()
                    this.$store.dispatch('success', message)
                    this.close()

                } catch (e) {
                    if (e.response.data.pole === "username") {
                        this.dialogError = true
                    } else {
                        const message = 'Użytkownik o nazwie ' + this.user.username + ' nie został edytowany.'
                        this.$store.dispatch('error', message)
                        this.close()
                    }
                }
                this.loadingSave = false

            } else {
                try {

                    let role = this.getRoleByid(this.user.role)
                    this.user.roles = [role]
                    await axiosConfig.post("/users", this.user);
                    this.getUsers()
                    const message = 'Użytkownik o nazwie ' + this.user.name + ' został dodany.'
                    this.$store.dispatch('success', message)
                    this.close();

                } catch (e) {

                    if (e.response.data.pole === "username") {
                        this.dialogError = true
                    } else {
                        const message = 'Użytkownik o nazwie ' + this.user.name + ' nie został dodany.'
                        this.$store.dispatch('error', message)
                        this.close();
                    }

                }
            }
            this.$store.dispatch('setAvatar', this.user.avatar)

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
