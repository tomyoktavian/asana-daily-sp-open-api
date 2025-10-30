import dayjs from 'dayjs'
import { OptionsDatePicker, TypesActionDatePicker, MenuDatePicker, UseDatePickerProps } from '@/types/hooks'

export const NamesActionDatePicker = {
  today: 'Hari ini',
  yesterday: 'Kemarin',
  thisWeek: 'Minggu ini',
  week1: 'Minggu ke-1',
  week2: 'Minggu ke-2',
  week3: 'Minggu ke-3',
  week4: 'Minggu ke-4',
  sevenDaysAgo: '7 hari yang lalu',
  thirtyDaysAgo: '30 hari yang lalu',
  thisMonth: 'Bulan ini',
  lastMonth: 'Bulan lalu',
  thisYear: 'Tahun ini',
  lastYear: 'Tahun lalu',
  all: 'Semua',
  custom: 'Kustom',
}

export const menusShortcutDatePicker: MenuDatePicker[] = [
  {
    name: NamesActionDatePicker.today,
    type: 'today',
    options: {
      defaultStartDate: dayjs().toString(),
      defaultEndDate: dayjs().toString(),
      minStartDate: dayjs().toString(),
      maxStartDate: dayjs().toString(),
      minEndDate: dayjs().toString(),
      maxEndDate: dayjs().toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.yesterday,
    type: 'yesterday',
    options: {
      defaultStartDate: dayjs().subtract(1, 'day').toString(),
      defaultEndDate: dayjs().subtract(1, 'day').toString(),
      minStartDate: dayjs().subtract(1, 'day').toString(),
      maxStartDate: dayjs().subtract(1, 'day').toString(),
      minEndDate: dayjs().subtract(1, 'day').toString(),
      maxEndDate: dayjs().subtract(1, 'day').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.thisWeek,
    type: 'thisWeek',
    options: {
      defaultStartDate: dayjs().startOf('week').toString(),
      defaultEndDate: dayjs().endOf('week').toString(),
      minStartDate: dayjs().startOf('week').toString(),
      maxStartDate: dayjs().endOf('week').toString(),
      minEndDate: dayjs().startOf('week').toString(),
      maxEndDate: dayjs().endOf('week').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.week1,
    type: 'week1',
    options: {
      defaultStartDate: dayjs().startOf('month').date(1).toString(),
      defaultEndDate: dayjs().startOf('month').date(7).toString(),
      minStartDate: dayjs().startOf('month').date(1).toString(),
      maxStartDate: dayjs().startOf('month').date(7).toString(),
      minEndDate: dayjs().startOf('month').date(1).toString(),
      maxEndDate: dayjs().startOf('month').date(7).toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.week2,
    type: 'week2',
    options: {
      defaultStartDate: dayjs().startOf('month').date(8).toString(),
      defaultEndDate: dayjs().startOf('month').date(14).toString(),
      minStartDate: dayjs().startOf('month').date(8).toString(),
      maxStartDate: dayjs().startOf('month').date(14).toString(),
      minEndDate: dayjs().startOf('month').date(8).toString(),
      maxEndDate: dayjs().startOf('month').date(14).toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.week3,
    type: 'week3',
    options: {
      defaultStartDate: dayjs().startOf('month').date(15).toString(),
      defaultEndDate: dayjs().startOf('month').date(21).toString(),
      minStartDate: dayjs().startOf('month').date(15).toString(),
      maxStartDate: dayjs().startOf('month').date(21).toString(),
      minEndDate: dayjs().startOf('month').date(15).toString(),
      maxEndDate: dayjs().startOf('month').date(21).toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.week4,
    type: 'week4',
    options: {
      defaultStartDate: dayjs().startOf('month').date(22).toString(),
      defaultEndDate: dayjs().endOf('month').toString(),
      minStartDate: dayjs().startOf('month').date(22).toString(),
      maxStartDate: dayjs().endOf('month').toString(),
      minEndDate: dayjs().startOf('month').date(22).toString(),
      maxEndDate: dayjs().endOf('month').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.sevenDaysAgo,
    type: 'sevenDaysAgo',
    options: {
      defaultStartDate: dayjs().subtract(7, 'day').toString(),
      defaultEndDate: dayjs().toString(),
      minStartDate: dayjs().subtract(7, 'day').toString(),
      maxStartDate: dayjs().subtract(7, 'day').toString(),
      minEndDate: dayjs().toString(),
      maxEndDate: dayjs().toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.thirtyDaysAgo,
    type: 'thirtyDaysAgo',
    options: {
      defaultStartDate: dayjs().subtract(30, 'day').toString(),
      defaultEndDate: dayjs().toString(),
      minStartDate: dayjs().subtract(30, 'day').toString(),
      maxStartDate: dayjs().subtract(30, 'day').toString(),
      minEndDate: dayjs().toString(),
      maxEndDate: dayjs().toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.thisMonth,
    type: 'thisMonth',
    options: {
      defaultStartDate: dayjs().startOf('month').toString(),
      defaultEndDate: dayjs().endOf('month').toString(),
      minStartDate: dayjs().startOf('month').toString(),
      maxStartDate: dayjs().endOf('month').toString(),
      minEndDate: dayjs().startOf('month').toString(),
      maxEndDate: dayjs().endOf('month').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.lastMonth,
    type: 'lastMonth',
    options: {
      defaultStartDate: dayjs()
        .subtract(1, 'month')
        .startOf('month')
        .toString(),
      defaultEndDate: dayjs().subtract(1, 'month').endOf('month').toString(),
      minStartDate: dayjs().subtract(1, 'month').startOf('month').toString(),
      maxStartDate: dayjs().subtract(1, 'month').endOf('month').toString(),
      minEndDate: dayjs().subtract(1, 'month').startOf('month').toString(),
      maxEndDate: dayjs().subtract(1, 'month').endOf('month').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.thisYear,
    type: 'thisYear',
    options: {
      defaultStartDate: dayjs().startOf('year').toString(),
      defaultEndDate: dayjs().endOf('year').toString(),
      minStartDate: dayjs().startOf('year').toString(),
      maxStartDate: dayjs().endOf('year').toString(),
      minEndDate: dayjs().startOf('year').toString(),
      maxEndDate: dayjs().endOf('year').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.lastYear,
    type: 'lastYear',
    options: {
      defaultStartDate: dayjs().subtract(1, 'year').startOf('year').toString(),
      defaultEndDate: dayjs().subtract(1, 'year').endOf('year').toString(),
      minStartDate: dayjs().subtract(1, 'year').startOf('year').toString(),
      maxStartDate: dayjs().subtract(1, 'year').endOf('year').toString(),
      minEndDate: dayjs().subtract(1, 'year').startOf('year').toString(),
      maxEndDate: dayjs().subtract(1, 'year').endOf('year').toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.all,
    type: 'all',
    options: {
      defaultStartDate: dayjs('2015-01-01').toString(),
      defaultEndDate: dayjs().toString(),
      maxStartDate: dayjs('2015-01-01').toString(),
      minStartDate: dayjs('2015-01-01').toString(),
      minEndDate: dayjs().toString(),
      maxEndDate: dayjs().toString(),
      readOnlyCalendar: true,
    },
  },
  {
    name: NamesActionDatePicker.custom,
    type: 'custom',
    options: {
      defaultStartDate: dayjs().toString(),
      defaultEndDate: dayjs().toString(),
      minStartDate: undefined,
      maxStartDate: dayjs().toString(),
      minEndDate: undefined,
      maxEndDate: dayjs().toString(),
      readOnlyCalendar: false,
    },
  },
]

export const getMenuShortcutDatePickerByType = (
  type: TypesActionDatePicker
) => {
  let getMenu: MenuDatePicker | undefined
  let getIndex: number | undefined
  menusShortcutDatePicker.forEach((menu, index) => {
    if (menu.type === type) {
      getMenu = menu
      getIndex = index
    }
  })
  return {
    index: getIndex as number,
    menu: getMenu as MenuDatePicker,
  }
}

const useDatePicker = (params?: UseDatePickerProps) => {
  // Fungsi untuk mengganti properti objek di dalam state 'menus'
  const customizeMenu = (
    type: TypesActionDatePicker,
    customName?: string,
    customOptions?: Partial<OptionsDatePicker>
  ) => {
    const menuIndex = menusShortcutDatePicker.findIndex(
      (menu) => menu.type === type
    )
    if (menuIndex !== -1) {
      menusShortcutDatePicker[menuIndex] = {
        ...menusShortcutDatePicker[menuIndex], // Salin objek asli
        options: {
          ...menusShortcutDatePicker[menuIndex].options,
          ...customOptions,
        }, // Gabungkan objek 'options' dengan objek kustom
        name: customName || menusShortcutDatePicker[menuIndex].name, // Ganti 'name' jika perlu atau biarkan tidak berubah
      }
    }
  }

  if (params?.customMenus) {
    params.customMenus.forEach(({ type, options, name }) => {
      customizeMenu(type, name, options)
    })
  }

  return {
    customizeMenu,
  }
}

export default useDatePicker
