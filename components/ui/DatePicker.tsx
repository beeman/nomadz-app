import React, { ReactNode, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
export interface DateRange {
  dates: [Date | null, Date | null]
  range: string
}

const ranges = [
  { value: 'exact', label: 'exact date' },
  { value: '±1', label: '± 1 day' },
  { value: '±2', label: '± 2 days' },
  { value: '±3', label: '± 3 days' },
  { value: '±7', label: '± 7 days' },
  { value: '±14', label: '± 14 days' },
] as const

interface DatePickerWithRangeProps {
  onChange: (range: DateRange) => void
  value: DateRange
  minDate?: Date
  className?: string
  buttonClassName?: string
  dropdownClassName?: string
  monthsShown?: number
  icon?: ReactNode
  zIndex?: number | null
}

const TWO_YEARS_FROM_NOW = new Date(new Date().setFullYear(new Date().getFullYear() + 2))

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  onChange,
  value,
  className,
  buttonClassName = '',
  dropdownClassName = 'max-lg:left-1/2 max-lg:-translate-x-1/2',
  monthsShown = 2,
  icon,
  zIndex,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState(value.range)

  const isValidDateRange = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return true

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays <= 30
  }

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if (!isValidDateRange(dates[0], dates[1])) {
      toastNotifications.info('Maximum stay duration is 30 days')
      return
    }

    onChange({ dates, range: tempRange })
  }

  const handleRangeChange = (newRange: string) => {
    setTempRange(newRange)
    onChange({ dates: value.dates, range: newRange })
  }

  const getButtonLabel = (date: Date | null) => {
    if (!date) return 'add date'
    return value.range === 'exact' ? date.toLocaleDateString() : `${date.toLocaleDateString()} ${value.range}`
  }

  const renderDayContents = (day: number) => {
    return <View className="react-datepicker__day-inner">{day}</View>
  }

  return (
    <View className={`relative flex justify-center items-center ${className || ''}`}>
      <CustomButton
        label="check in"
        value={getButtonLabel(value.dates[0])}
        onClick={() => setIsOpen(true)}
        className={`!pr-8 ${buttonClassName}`}
        hasBorder={false}
        icon={icon}
      />

      <View className="!w-[1px] !h-[38px] bg-[#4A4A4A]" />

      <CustomButton
        label="check out"
        value={getButtonLabel(value.dates[1])}
        onClick={() => setIsOpen(true)}
        className={`!pl-8 ${buttonClassName}`}
        icon={icon}
      />
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className={`left-1/2 -translate-x-1/2 ${dropdownClassName}`}
        zIndex={zIndex}
      >
        <View className="bg-[#1B1B1B] rounded-2xl p-6 gap-y-4">
          <ReactDatePicker
            selected={value.dates[0]}
            onChange={handleDateChange}
            startDate={value.dates[0]}
            endDate={value.dates[1]}
            maxDate={TWO_YEARS_FROM_NOW}
            inline
            monthsShown={monthsShown}
            selectsRange
            renderDayContents={renderDayContents}
            {...props}
          />

          <View className="h-[1px] bg-[#4E4E4E] !-mt-2"></View>

          <View className="flex gap-2 overflow-x-auto no-scrollbar max-lg:max-w-[236px] lg:max-w-[474px] lg:w-max">
            {ranges.map(({ value: rangeValue, label }) => (
              <Button
                key={rangeValue}
                onClick={() => handleRangeChange(rangeValue)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-full text-[10px] transition-colors
                  border border-[#2F2F2F]
                  ${tempRange === rangeValue ? 'text-[#EBEBEB] border-[#EBEBEB]' : 'text-[#999999]'}
                `}
              >
                {label}
              </Button>
            ))}
          </View>
        </View>
      </Dropdown>
    </View>
  )
}

export default DatePickerWithRange
