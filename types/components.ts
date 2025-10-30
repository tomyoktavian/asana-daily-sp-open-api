import { Dayjs } from "dayjs";
import { TypesActionDatePicker } from "./hooks";

export type DatePickerAIOPropsValue = {
  type: TypesActionDatePicker | undefined;
  name: string | undefined;
  date: Array<string | null | undefined>;
};

export type ValueRangeDatePickerAIO = {
  startDate: Dayjs | null | undefined;
  endDate: Dayjs | null | undefined;
};

export interface DatePickerAIOProps {
  onChange?: (value: DatePickerAIOPropsValue) => void;
  value: DatePickerAIOPropsValue;
  className?: string;
  align?: "start" | "center" | "end";
  options?: TypesActionDatePicker[];
}
