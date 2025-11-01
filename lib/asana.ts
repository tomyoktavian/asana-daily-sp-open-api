import { calculateTotalStoryPoint } from "./story-point";
import { AsanaTask, AsanaUser } from "@/types/lib";
import axios from "axios";

export class AsanaClient {
  private accessToken: string;
  private axiosInstance;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.axiosInstance = axios.create({
      baseURL: 'https://app.asana.com/api/1.0',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  private async _fetchTasksFromAPI(params: {
    workspaceGid: string;
    assigneeGid: string;
    createdAfter?: string;
    createdBefore?: string;
    completed?: boolean;
    optFields: string;
  }): Promise<AsanaTask[]> {
    let allTasks: AsanaTask[] = [];
    let offset: string | undefined;
    
    const dateFilterPrefix =
      `${params.completed}` === "true" ? "due_on" : "modified_on";
    const sortBy =
      `${params.completed}` === "true" ? "completed_at" : "modified_at";
    
    do {
      const queryParams = new URLSearchParams({
        "assignee.any": params.assigneeGid,
        is_subtask: "true",
        sort_by: sortBy,
        sort_ascending: "false",
        completed:
          params.completed !== undefined ? `${params.completed}` : "false",
        opt_fields: params.optFields,
        limit: "100",
        ...(params.createdAfter && {
          [`${dateFilterPrefix}.after`]: params.createdAfter,
        }),
        ...(params.createdBefore && {
          [`${dateFilterPrefix}.before`]: params.createdBefore,
        }),
        ...(offset && { offset }),
      });
      
      const response = await this.axiosInstance.get(
        `/workspaces/${params.workspaceGid}/tasks/search`,
        { params: Object.fromEntries(queryParams) }
      );

      allTasks = allTasks.concat(response.data.data);
      
      offset = response.data.next_page?.offset;
    } while (offset);

    return allTasks.filter((task) => task.num_subtasks === 0);
  }

  async getMe(): Promise<AsanaUser> {
    const response = await this.axiosInstance.get('/users/me');
    return response.data.data;
  }

  async getWorkspaces() {
    const response = await this.axiosInstance.get('/workspaces');
    return response.data.data;
  }

  async getTasks(params: {
    workspaceGid: string;
    assigneeGid: string;
    createdAfter?: string;
    createdBefore?: string;
    completed?: boolean;
  }): Promise<AsanaTask[]> {
    return this._fetchTasksFromAPI({
      ...params,
      optFields:
        "gid,name,completed,due_on,due_at,created_at,modified_at,completed_at,num_subtasks,assignee.name,projects.name,custom_fields.name,custom_fields.display_value,custom_fields.number_value,custom_fields.text_value,created_by.name",
    });
  }

  async getTotalStoryPoint(params: {
    workspaceGid: string;
    assigneeGid: string;
    createdAfter?: string;
    createdBefore?: string;
    completed?: boolean;
  }): Promise<number> {
    const tasks = await this._fetchTasksFromAPI({
      ...params,
      optFields: 'num_subtasks,custom_fields.name,custom_fields.number_value',
    });
    
    return calculateTotalStoryPoint(tasks);
  }
}
