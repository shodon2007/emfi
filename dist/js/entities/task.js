import { CustomDate } from "./date.js";
import { api } from "../api/index.js";

class Task {
    taskStatus = {
        noTasks: "NO_TASKS",
        today: "TODAY",
        nextDays: "NEXT_DAYS",
    }
    getTaskStatusHTML(taskStatus) {
        let taskColor = null;
        if (taskStatus === this.taskStatus.today) {
            taskColor = "GREEN";
        } else if (taskStatus === this.taskStatus.noTasks) {
            taskColor = "RED";
        } else if (taskStatus === this.taskStatus.nextDays) {
            taskColor = "YELLOW"
        } else {
            taskColor = "BLACK"
        }

        return `
            <svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
                <circle r="45" cx="50" cy="50" fill="${taskColor}" />
            </svg>
        `
    }
    async getNearestTask(tasks) {
        let nearestTask = null;
        if (tasks?._embedded?.tasks && Array.isArray(tasks._embedded.tasks)) {
            for (let task of tasks._embedded.tasks) {
                if (task.complete_till * 1000 >= Date.now()) {
                    nearestTask = new Date(task.complete_till * 1000);
                    break;
                }
            }
        }
        return nearestTask;
    }

    async getTaskStatus(lead) {
        const tasks = await api.getTasks(lead.id);
        const nearestTaskDate = await this.getNearestTask(tasks);

        if (nearestTaskDate === null) {
            return this.taskStatus.noTasks;
        }

        const nearestTaskDataYesterday = CustomDate.setYesterday(nearestTaskDate);
        const yesterdayNearestFormatted = CustomDate.getFormatDate(nearestTaskDataYesterday);
        const todayFormatted = CustomDate.getFormatDate(new Date());

        if (yesterdayNearestFormatted === todayFormatted) {
            return this.taskStatus.today;
        } else {
            return this.taskStatus.nextDays;
        }
    }
}
export default new Task();
