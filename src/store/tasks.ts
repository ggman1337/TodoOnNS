import { reactive, computed } from "nativescript-vue";
import { ApplicationSettings } from "@nativescript/core";

export type TaskStatus = "active" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "tasks";

function saveToDisk(tasks: Task[]) {
  ApplicationSettings.setString(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromDisk(): Task[] {
  const raw = ApplicationSettings.getString(STORAGE_KEY, "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const tasksState = reactive({
  tasks: loadFromDisk() as Task[],
  filter: "active" as TaskStatus,
});

export const filteredTasks = computed(() =>
  tasksState.tasks.filter((t) => t.status === tasksState.filter),
);

export function setFilter(filter: TaskStatus) {
  tasksState.filter = filter;
}

export function addTask(input: { title: string; description: string }) {
  const now = Date.now();
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  tasksState.tasks.unshift(task);
  saveToDisk(tasksState.tasks);
}

export function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "description" | "status">>,
) {
  const t = tasksState.tasks.find((x) => x.id === id);
  if (!t) return;
  if (patch.title !== undefined) t.title = patch.title.trim();
  if (patch.description !== undefined) t.description = patch.description.trim();
  if (patch.status !== undefined) t.status = patch.status;
  t.updatedAt = Date.now();
  saveToDisk(tasksState.tasks);
}

export function deleteTask(id: string) {
  tasksState.tasks = tasksState.tasks.filter((t) => t.id !== id) as any;
  saveToDisk(tasksState.tasks as any);
}

export function toggleDone(id: string) {
  const t = tasksState.tasks.find((x) => x.id === id);
  if (!t) return;
  updateTask(id, { status: t.status === "active" ? "done" : "active" });
}
