import { AsanaTask } from "./lib";

export interface FetchTasksParams {
  completed?: string;
  created_after?: string;
  created_before?: string;
}

export interface TasksApiResponse {
  tasks: AsanaTask[];
}

export interface TasksWithStoryPoint {
  tasks: AsanaTask[];
  total_sp: number;
}

export interface TotalStoryPointResponse {
  totalStoryPoint: number;
}

export type OptionsDatePicker = {
  defaultStartDate: string | undefined | null;
  defaultEndDate: string | undefined | null;
  minStartDate: string | undefined | null;
  maxStartDate: string | undefined | null;
  minEndDate: string | undefined | null;
  maxEndDate: string | undefined | null;
  readOnlyCalendar: boolean | undefined;
};

export type TypesActionDatePicker =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "week1"
  | "week2"
  | "week3"
  | "week4"
  | "sevenDaysAgo"
  | "thirtyDaysAgo"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "all"
  | "custom";

export interface MenuDatePicker {
  name: string;
  type: TypesActionDatePicker;
  options: OptionsDatePicker;
}

export interface MenuDatePickerPartial {
  type: TypesActionDatePicker;
  name?: string;
  options: Partial<OptionsDatePicker>;
}

export interface UseDatePickerProps {
  customMenus?: MenuDatePickerPartial[];
}
