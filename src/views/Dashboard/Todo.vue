<template>
<transition name="fade" mode="out-in">
    <div key="1" v-if="loading" class="d-flex justify-content-center my-5">
        <b-spinner variant="dark" />
    </div>
    <v-card color="grey lighten-4" tile>
    <v-card-title>
        Zadania
    </v-card-title>
    <v-card-text>
            <v-row class="fill-height">

                <v-col>

                    <v-card class="mx-auto mb-4" outlined tile>
                        <h3 class="m-4">Do zrobienia: {{ remaining }}</h3>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item-group v-model="selected" multiple active-class="success--text">

                                <v-list-item v-for="(task, i) in tasksToDo" :key="i">

                                    <v-list-item-title>{{ task.text }}</v-list-item-title>
                                    <v-list-item-action class="mr-4">
                                        <v-list-item-action-text v-text="task.createdDate"></v-list-item-action-text>
                                    </v-list-item-action>
                                    <v-list-item-action>
                                        <v-btn icon color="green" @click="toggleCompleteTask(task)" >
                                            <v-icon>done</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-action>
                                        <v-btn icon color="red" @click="removeTask(task)">
                                            <v-icon>remove_circle_outline</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                                                         </v-list-item-group>
                        </v-list>

                        <v-col cols="12" sm="12" md="12">
                            <v-text-field color="teal darken-1" v-model="newTask" label="Zadanie" v-on:keyup.enter="addTask"></v-text-field>
                            <v-btn class="mr-2" color="teal darken-1" @click="addTask" dark tile>Dodaj</v-btn>
                            <v-btn color="warning" @click="completeAll" dark tile>Zakończ wszystkie</v-btn>
                        </v-col>
                    </v-card>
                    <div v-show="completions > 0">
                        <v-card class="mx-auto" outlined tile>
                            <h3 class="m-4">Zrobione: {{ completions }}</h3>
                            <v-divider ></v-divider>
                            <v-list-item-group v-model="selected" multiple active-class="warning--text">
                                <v-list-item v-for="(task, i) in tasksCompletions" :key="i">

                                    <v-list-item-title>{{ task.text }}</v-list-item-title>
                                    <v-list-item-action class="mr-4">
                                        <v-list-item-action-text v-text="task.createdDate"></v-list-item-action-text>
                                    </v-list-item-action>
                                    <v-list-item-action>
                                        <v-btn icon color="warning" @click="toggleToDoTask(task)">
                                            <v-icon>repeat</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list-item-group>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn color="error" @click="clearCompleted" dark tile>Wyczyść</v-btn>
                            </v-col>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</transition>
</template>

<script>
import axiosConfig from '../../axios-config'
import {
    mapGetters,
    mapActions
} from 'vuex'
export default {

    data: () => ({
        loading: true,
        tasks: [],
        newTask: ''
    }),
    created() {
        this.checkexpiration()
        this.loading = true;
        this.getTasks()
        this.loading = false;
    },
    methods: {
         ...mapActions({
            clearAlert: 'clear',
            checkexpiration:'checkExpiration'
        }),
        async getTasks() {

            try {
                let {
                    data
                } = await axiosConfig.get('/tasks/' + this.idUser)

                if (data !== null) {
                    this.tasks = data;
                }

            } catch (e) {
                alert(e)
            }
        },
        async addTask() {
            if (!this.newTask) {
                return;
            }

            try {
                await axiosConfig.post("/tasks", {
                    text: this.newTask,
                    email: true,
                    idUser: this.idUser
                });

                this.getTasks()

            } catch (e) {
                alert(e)

            }

            this.newTask = '';
        },
        async completeAll() {
            try {
                let {
                    data
                } = await axiosConfig.put('/tasks/completedAll/' + this.idUser)

                if (data !== null) {
                    this.getTasks()
                }
            } catch (e) {
                alert(e)

            }
        },
        async clearCompleted() {
            try {
                let {
                    data
                } = await axiosConfig.put('/tasks/clearAll/' + this.idUser)

                if (data !== null) {
                    this.getTasks()
                }
            } catch (e) {
                alert(e)

            }

        },
        async removeTask(task) {
            try {
                let {
                    data
                } = await axiosConfig.put('/tasks/delete/' + task.id)

                if (data !== null) {
                    this.getTasks()
                }
            } catch (e) {
                alert(e)
            }
        },
        async toggleCompleteTask(task) {
            try {
                let {
                    data
                } = await axiosConfig.put('/tasks/completed/' + task.id)

                if (data !== null) {
                    this.getTasks()
                }
            } catch (e) {
                alert(e)
            }
        },
        async toggleToDoTask(task) {
            try {
                let {
                    data
                } = await axiosConfig.put('/tasks/todo/' + task.id)

                if (data !== null) {
                    this.getTasks()
                }
            } catch (e) {
                alert(e)
            }
        },

    },
    computed: {
        ...mapGetters({
            idUser: 'idUser'
        }),
        tasksCompletions() {
            return this.tasks.filter(function (task) {
                return task.idStatus === 2;
            })
        },
        completions() {
            return this.tasksCompletions.length;
        },
        tasksToDo() {
            return this.tasks.filter(function (task) {
                return task.idStatus === 1;
            })
        },
        remaining() {
            return this.tasksToDo.length;
        }
    }
}
</script>

<style scoped>
.completed {
    text-decoration: line-through;
    color: grey;
}
</style>
