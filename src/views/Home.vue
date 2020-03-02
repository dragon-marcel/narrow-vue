<template>
<v-app id="inspire">
    <v-content>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                   
                    <v-card class="elevation-12" tile>
                        <v-toolbar dark flat > <v-spacer />
                            <v-toolbar-title>Narrow - System</v-toolbar-title> <v-spacer />
                        </v-toolbar>
                        <v-card-text>
                        <v-alert border="right" dense v-if="alert.message" :type="alert.type" tile>{{alert.message}}</v-alert>     
                                               <v-form ref="login" v-model="valid">
                                <v-text-field @keyup.enter="submit" :rules="[rules.required]" v-model="username" label="Login" name="username" prepend-icon="person" color="teal darken-1" type="text" />
                                <v-text-field @keyup.enter="submit" v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required]" :type="show1 ? 'text' : 'password'" name="input-10-1" color="teal darken-1" label="Hasło" counter prepend-icon="lock" @click:append="show1 = !show1"  v-on:keyup.enter="login"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="teal darken-1" class="ma-2" :loading="loading" :disabled="loading || !valid" @click.native="login" tile>
                                Zaloguj się
                                <template v-slot:loader>
                                    <span class="custom-loader">
                                        <v-icon light>cached</v-icon>
                                    </span>
                                </template>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            loading: false,
            valid: false,
            rules: {
                required: value => !!value || 'Pole jest wymagane.',
                min: v => v.length >= 8 || 'Min 8 znaków.',
            },
            username: null,
            password: null,
            show1: false,

        }
    },
    methods: {
         clearAlert(){
                this.$store.dispatch('clear')
        },
        async login() {
            this.loading = true;
            this.valid = false;
            await this.$store.dispatch('login', {
                username: this.username,
                password: this.password
            });
            this.loading = false;
            this.valid = true;
            this.$router.push('/dashboard');

        }
    },
    created(){
        this.clearAlert();
    },
    computed: {
        ...mapState({
            alert: state=>state.alert
        })}
    
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
