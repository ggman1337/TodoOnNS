<script lang="ts" setup>
import { computed, ref, $navigateBack } from "nativescript-vue";
import { tasksState, addTask, updateTask, deleteTask } from "../store/tasks";
import { confirm } from "@nativescript/core";

type Props = { mode: "create" | "edit"; id?: string };
const props = defineProps<Props>();

const task = computed(() => tasksState.tasks.find((t) => t.id === props.id));

const title = ref(props.mode === "edit" && task.value ? task.value.title : "");
const description = ref(
    props.mode === "edit" && task.value ? task.value.description : "",
);

const canSave = computed(() => title.value.trim().length > 0);

function save() {
    if (!canSave.value) return;

    if (props.mode === "create") {
        addTask({ title: title.value, description: description.value });
    } else if (props.id) {
        updateTask(props.id, {
            title: title.value,
            description: description.value,
        });
    }
    $navigateBack();
}

async function remove() {
    if (!props.id) return;

    const ok = await confirm({
        title: "Удалить задачу?",
        message: "Это действие нельзя отменить.",
        okButtonText: "Удалить",
        cancelButtonText: "Отмена",
    });

    if (ok) {
        deleteTask(props.id);
        $navigateBack();
    }
}
</script>

<template>
    <Page>
        <ActionBar
            :title="mode === 'create' ? 'Новая задача' : 'Редактирование'"
        />

        <ScrollView>
            <StackLayout class="wrap">
                <TextField v-model="title" hint="Наименование" />
                <TextView v-model="description" hint="Описание" />

                <Button
                    text="Сохранить"
                    class="primary"
                    :isEnabled="canSave"
                    @tap="save"
                />

                <Button
                    v-if="mode === 'edit'"
                    text="Удалить"
                    class="danger"
                    @tap="remove"
                />
            </StackLayout>
        </ScrollView>
    </Page>
</template>
