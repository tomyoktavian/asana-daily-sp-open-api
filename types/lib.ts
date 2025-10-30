export interface AsanaTask {
  gid: string;
  name: string;
  completed: boolean;
  due_on?: string;
  due_at?: string;
  created_at: string;
  modified_at: string;
  num_subtasks: number;
  assignee?: {
    gid: string;
    name: string;
  };
  projects?: Array<{
    gid: string;
    name: string;
  }>;
  custom_fields?: Array<{
    gid: string;
    name: string;
    display_value?: string;
    number_value?: number;
    text_value?: string;
  }>;
  created_by?: {
    gid: string;
    name: string;
  };
}

export interface AsanaUser {
  gid: string;
  name: string;
  email: string;
}
