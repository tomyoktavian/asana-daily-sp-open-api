import { calculateTotalStoryPoint } from "./story-point";
import { AsanaTask, AsanaUser } from "@/types/lib";

export class AsanaClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
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
      
      const url = `https://app.asana.com/api/1.0/workspaces/${params.workspaceGid}/tasks/search?${queryParams}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      allTasks = allTasks.concat(data.data);
      
      offset = data.next_page?.offset;
    } while (offset);

    return allTasks.filter((task) => task.num_subtasks === 0);
  }

  async getMe(): Promise<AsanaUser> {
    const response = await fetch('https://app.asana.com/api/1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data.data;
  }

  async getWorkspaces() {
    const response = await fetch('https://app.asana.com/api/1.0/workspaces', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workspaces');
    }

    const data = await response.json();
    return data.data;
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
