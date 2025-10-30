/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getMenuShortcutDatePickerByType,
  menusShortcutDatePicker,
} from "@/hooks/useDatePicker";
import { MenuDatePicker } from "@/types/hooks";
import { DatePickerAIOProps } from "@/types/components";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.extend(isBetween);

const DatePickerAIO = ({
  value,
  onChange,
  className,
  align = "center",
  options = [
    "today",
    "yesterday",
    "sevenDaysAgo",
    "thirtyDaysAgo",
    "thisMonth",
    "lastMonth",
    "thisYear",
    "all",
    "custom",
  ],
}: DatePickerAIOProps) => {
  const [startDate, setStartDate] = useState<Dayjs | null | undefined>(
    value ? dayjs(value?.date[0]) : undefined
  );
  const [endDate, setEndDate] = useState<Dayjs | null | undefined>(
    value ? dayjs(value?.date[1]) : undefined
  );
  const defaultMenu = value?.type
    ? getMenuShortcutDatePickerByType(value.type).menu
    : undefined;
  const [menuSelected, setMenuSelected] = useState<MenuDatePicker | undefined>(
    defaultMenu
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setStartDate(value ? dayjs(value?.date[0]) : undefined);
    setEndDate(value ? dayjs(value?.date[1]) : undefined);
    setMenuSelected(defaultMenu);
  }, [defaultMenu, value]);

  const onChangeMenuSelected = (type: string) => {
    const getMenuSelected = menusShortcutDatePicker.find(
      (val) => type === val.type
    );
    if (!getMenuSelected) return;
    setMenuSelected(getMenuSelected);
    setStartDate(dayjs(getMenuSelected.options.defaultStartDate));
    setEndDate(dayjs(getMenuSelected.options.defaultEndDate));
  };

  const onPrevRange = () => {
    if (!startDate || !endDate || menuSelected?.type === "all") return;

    const totalDays = endDate.diff(startDate, "day") + 1;
    const prevStartDate = startDate.clone().subtract(totalDays, "days");
    const prevEndDate = endDate.clone().subtract(totalDays, "days");

    setStartDate(prevStartDate);
    setEndDate(prevEndDate);

    onChange?.({
      type: menuSelected?.type,
      name: menuSelected?.name,
      date: [prevStartDate.format(), prevEndDate.format()],
    });
  };

  const onNextRange = () => {
    if (!startDate || !endDate || menuSelected?.type === "all") return;

    const totalDays = endDate.diff(startDate, "day") + 1;
    const nextStartDate = startDate.clone().add(totalDays, "days");
    const nextEndDate = endDate.clone().add(totalDays, "days");

    setStartDate(nextStartDate);
    setEndDate(nextEndDate);

    onChange?.({
      type: menuSelected?.type,
      name: menuSelected?.name,
      date: [nextStartDate.format(), nextEndDate.format()],
    });
  };

  const onApplyPicker = () => {
    if (startDate?.isAfter(endDate)) {
      setErrorMessage("Tanggal mulai harus sebelum tanggal akhir");
      return;
    }

    onChange?.({
      type: menuSelected?.type,
      name: menuSelected?.name,
      date: [startDate?.format(), endDate?.format()],
    });

    setOpen(false);
    setErrorMessage("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-full cursor-pointer select-none transition-all duration-100",
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 disabled:opacity-50 hover:bg-transparent"
          disabled={value?.type === "all"}
          onClick={onPrevRange}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center justify-center h-auto py-1 px-3 hover:bg-transparent">
            <p className="text-xs text-muted-foreground text-center line-clamp-1">
              {value?.type !== "all"
                ? `${dayjs(value?.date[0]).format("DD MMM YY")} - ${dayjs(
                    value?.date[1]
                  ).format("DD MMM YY")}`
                : "Semua"}
            </p>
          </Button>
        </PopoverTrigger>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 disabled:opacity-50 hover:bg-transparent"
          disabled={value?.type === "all"}
          onClick={onNextRange}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <PopoverContent
        align={align}
        className="w-auto p-0"
        sideOffset={5}
        collisionPadding={10}
      >
        <div className="flex flex-col max-w-[900px]">
          <div className="px-4 py-3 border-b">
            <h6 className="text-base font-semibold">Pilih Tanggal</h6>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="w-full sm:w-auto">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 min-w-[140px]">
                {menusShortcutDatePicker
                  .filter((menu) => options.includes(menu.type))
                  .map((menu, index) => (
                    <Button
                      key={index}
                      variant={menuSelected?.type === menu.type ? "default" : "outline"}
                      className="justify-start h-9 text-sm"
                      onClick={() => onChangeMenuSelected(menu.type)}
                    >
                      {menu.name}
                    </Button>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Calendar
                mode="range"
                selected={{
                  from: startDate?.toDate(),
                  to: endDate?.toDate(),
                }}
                onSelect={(range) => {
                  if (range?.from) setStartDate(dayjs(range.from));
                  if (range?.to) setEndDate(dayjs(range.to));
                }}
                numberOfMonths={2}
                disabled={menuSelected?.options.readOnlyCalendar}
                className="rounded-md"
              />

              {errorMessage && (
                <p className="text-sm text-destructive px-2">{errorMessage}</p>
              )}
            </div>
          </div>
          <div className="px-4 py-3 flex gap-2 border-t bg-muted/50">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Batalkan
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={onApplyPicker}
            >
              Terapkan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerAIO;
