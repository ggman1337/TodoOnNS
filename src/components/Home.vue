<script lang="ts" setup>
import { computed, $navigateTo } from "nativescript-vue";
import TaskFormPage from "./TaskFormPage.vue";
import {
    filteredTasks,
    tasksState,
    setFilter,
    toggleDone,
} from "../store/tasks";

const selectedIndex = computed(() => (tasksState.filter === "active" ? 0 : 1));

function onFilterChange(args: any) {
    const idx = args?.object?.selectedIndex ?? 0;
    setFilter(idx === 0 ? "active" : "done");
}

function create() {
    $navigateTo(TaskFormPage, { props: { mode: "create" } });
}

function edit(id: string) {
    $navigateTo(TaskFormPage, { props: { mode: "edit", id } });
}

function toggle(id: string) {
    toggleDone(id);
}
</script>

<template>
    <Page>
        <ActionBar title="Задачи" />

        <GridLayout rows="auto, *">
            <SegmentedBar
                row="0"
                class="task-filter"
                selectedBackgroundColor="#5a1475d2"
                selectedTextColor="white"
                backgroundColor="#f2f2f2bb"
                :selectedIndex="selectedIndex"
                @selectedIndexChange="onFilterChange"
            >
                <SegmentedBarItem title="Текущие" />
                <SegmentedBarItem title="Выполненные" />
            </SegmentedBar>

            <GridLayout row="1" rows="*, auto">
                <Label
                    v-if="filteredTasks.length === 0"
                    text="Нет запланированных задач"
                    class="empty"
                    textWrap="true"
                    verticalAlignment="middle"
                    horizontalAlignment="center"
                    row="0"
                />

                <ListView v-else :items="filteredTasks" row="0">
                    <template #default="{ item }">
                        <GridLayout
                            columns="*, auto, auto"
                            rows="auto, auto"
                            class="item"
                        >
                            <Label
                                :text="item.title"
                                class="title"
                                col="0"
                                row="0"
                                textWrap="true"
                            />
                            <Button
                                text="Изменить"
                                col="1"
                                row="0"
                                class="btn"
                                @tap="edit(item.id)"
                            />
                            <Button
                                :text="
                                    item.status === 'active'
                                        ? 'Готово'
                                        : 'Переделать'
                                "
                                col="2"
                                row="0"
                                class="btn"
                                @tap="toggle(item.id)"
                            />
                            <Label
                                v-if="item.description"
                                :text="item.description"
                                col="0"
                                row="1"
                                colSpan="3"
                                class="desc"
                                textWrap="true"
                            />
                        </GridLayout>
                    </template>
                </ListView>

                <Button
                    row="1"
                    text="Добавить задачу"
                    class="add"
                    @tap="create"
                />
            </GridLayout>
        </GridLayout>
    </Page>
</template>
