"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Circle, Calendar, ExternalLink, Hash, Clock, TriangleAlert, RefreshCcw, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import DatePickerAIO from "@/components/ui/date-picker-aio";
import { getMenuShortcutDatePickerByType } from "@/hooks/useDatePicker";
import { useTasks } from "@/hooks/useTasksQuery";
import { AsanaTask } from "@/types/lib";
import { DatePickerAIOPropsValue, TypesActionDatePicker } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import dayjs from "dayjs";
import { Alert, AlertTitle } from "./ui/alert";

export function TaskList() {
  const getDefaultMenu = (completed: string) => {
    return completed === 'false' 
      ? getMenuShortcutDatePickerByType('thisYear').menu
      : getMenuShortcutDatePickerByType('thisMonth').menu;
  };

  const [completedFilter, setCompletedFilter] = useState<string>('false');
  const defaultMenu = getDefaultMenu(completedFilter);
  const [dateRangePicker, setDateRangePicker] = useState<DatePickerAIOPropsValue>({
    type: defaultMenu?.type,
    name: defaultMenu.name,
    date: [
      defaultMenu.options.defaultStartDate,
      defaultMenu.options.defaultEndDate,
    ],
  });

  const handleCompletedFilterChange = (value: string) => {
    setCompletedFilter(value);
    const newMenu = getDefaultMenu(value);
    setDateRangePicker({
      type: newMenu?.type,
      name: newMenu.name,
      date: [
        newMenu.options.defaultStartDate,
        newMenu.options.defaultEndDate,
      ],
    });
  };

  const { data, isLoading: loading, refetch, isFetching } = useTasks({
    completed: completedFilter,
    created_after: dateRangePicker.date?.[0] ? dayjs(dateRangePicker.date[0]).format('YYYY-MM-DD') : undefined,
    created_before: dateRangePicker.date?.[1] ? dayjs(dateRangePicker.date[1]).format('YYYY-MM-DD') : undefined,
  });

  const tasks = data?.tasks || [];
  const totalStoryPoint = data?.total_sp || 0;

  const handleRefresh = () => {
    refetch();
  };

  const getTaskUrl = (task: AsanaTask) => {
    const projectGid = task.projects && task.projects.length > 0 ? task.projects[0].gid : "0";
    return `https://app.asana.com/0/${projectGid}/${task.gid}`;
  };

  const getCustomFieldValue = (task: AsanaTask, fieldName: string) => {
    if (!task.custom_fields) return null;
    const field = task.custom_fields.find(f => f.name === fieldName);
    if (!field) return null;
    return field.display_value || field.number_value || field.text_value;
  };

  const TaskSkeleton = () => (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
      <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:items-center md:justify-between">
          <CardTitle className="flex flex-wrap items-baseline gap-2">
            <span className="whitespace-nowrap">
              Daftar Task{" "}
              {completedFilter === "true" ? "Selesai" : "Belum Selesai"} (
              {tasks.length})
            </span>
            <span className="text-base font-normal text-muted-foreground whitespace-nowrap">
              • {totalStoryPoint} SP
            </span>
          </CardTitle>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex flex-row gap-2 w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isFetching}
                className="h-9 w-9"
              >
                <RefreshCcw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
              <Select
                value={completedFilter}
                onValueChange={handleCompletedFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                    Belum Selesai
                  </SelectItem>
                  <SelectItem value="true">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Sudah Selesai
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DatePickerAIO
              align="end"
              value={dateRangePicker}
              onChange={(value: DatePickerAIOPropsValue) =>
                setDateRangePicker(value)
              }
              options={
                [
                  "today",
                  "yesterday",
                  "thisWeek",
                  "week1",
                  "week2",
                  "week3",
                  "week4",
                  "custom",
                ] as TypesActionDatePicker[]
              }
              className="w-full sm:w-auto justify-between"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <TaskSkeleton key={index} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Task tidak ditemukan</p>
            <p className="text-sm mt-1">
              Coba ubah filter atau periode tanggal
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Alert className="mb-6" variant="warning">
              <TriangleAlert />
              <AlertTitle>
                Maksimal task yang dapat ditampilkan adalah 100
              </AlertTitle>
            </Alert>
            {tasks.map((task) => (
              <a
                key={task.gid}
                href={getTaskUrl(task)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors group cursor-pointer"
              >
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium leading-tight group-hover:text-primary transition-colors">
                        {task.name}
                      </h4>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {task.created_by && (
                        <Badge variant="outline" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          {task.created_by.name}
                        </Badge>
                      )}
                      {task.due_on && (
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.due_on), "dd MMM yyyy", {
                            locale: id,
                          })}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {task.projects && task.projects.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.projects.map((project) => (
                        <Badge
                          key={project.gid}
                          variant="secondary"
                          className="text-xs"
                        >
                          {project.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getCustomFieldValue(task, "Story Point") && (
                      <Badge variant="outline" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        {getCustomFieldValue(task, "Story Point")} SP
                      </Badge>
                    )}
                    {getCustomFieldValue(task, "Estimate time") && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {getCustomFieldValue(task, "Estimate time")} min
                      </Badge>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
