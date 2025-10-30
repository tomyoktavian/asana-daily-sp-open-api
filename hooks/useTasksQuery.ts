import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import { FetchTasksParams, TasksApiResponse, TasksWithStoryPoint, TotalStoryPointResponse } from "@/types/hooks";
import { calculateTotalStoryPoint } from "@/lib/story-point";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (params: FetchTasksParams) => [...taskKeys.lists(), params] as const,
  storyPoints: () => [...taskKeys.all, "storyPoints"] as const,
  storyPoint: (params: FetchTasksParams) => [...taskKeys.storyPoints(), params] as const,
};

const fetchTasks = async (params: FetchTasksParams): Promise<TasksWithStoryPoint> => {
  try {
    const { data } = await axiosInstance.get<TasksApiResponse>("/api/tasks", {
      params,
    });

    if (!data?.tasks || !Array.isArray(data.tasks)) {
      return {
        tasks: [],
        total_sp: 0,
      };
    }

    const sortedTasks = [...data.tasks];
    const totalStoryPoint = calculateTotalStoryPoint(sortedTasks);

    return {
      tasks: sortedTasks,
      total_sp: totalStoryPoint,
    };
  } catch (error) {
    console.error("[fetchTasks Error]", error);
    throw error;
  }
};

// ==================== Hooks ====================
export const useTasks = (
  params: FetchTasksParams,
  options?: Omit<
    UseQueryOptions<TasksWithStoryPoint, AxiosError, TasksWithStoryPoint, ReturnType<typeof taskKeys.list>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => fetchTasks(params),
    enabled: !!params.created_after && !!params.created_before,
    ...options,
  });
};

// ==================== Total Story Point ====================
const fetchTotalStoryPoint = async (params: FetchTasksParams): Promise<number> => {
  try {
    const { data } = await axiosInstance.get<TotalStoryPointResponse>("/api/total-story-point", {
      params,
    });

    if (data?.totalStoryPoint === undefined || data.totalStoryPoint === null) {
      return 0;
    }

    return data.totalStoryPoint;
  } catch (error) {
    console.error("[fetchTotalStoryPoint Error]", error);
    return 0;
  }
};

export const useTotalStoryPoint = (
  params: FetchTasksParams,
  options?: Omit<
    UseQueryOptions<number, AxiosError, number, ReturnType<typeof taskKeys.storyPoint>>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: taskKeys.storyPoint(params),
    queryFn: () => fetchTotalStoryPoint(params),
    enabled: !!params.created_after && !!params.created_before,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
};
