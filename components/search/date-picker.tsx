import { useAppThemeSpacing } from '@/components/use-app-theme-spacing'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

export interface DateRange {
  checkin: string | null
  checkout: string | null
  range: string
}

interface DatePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DatePickerComponent({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState(value.range)
  const [tempDates, setTempDates] = useState({
    startDate: value.checkin ? new Date(value.checkin) : null,
    endDate: value.checkout ? new Date(value.checkout) : null,
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const spacing = useAppThemeSpacing()

  const handleContinue = useCallback(() => {
    onChange({
      checkin: tempDates.startDate?.toISOString().split('T')[0] || null,
      checkout: tempDates.endDate?.toISOString().split('T')[0] || null,
      range: tempRange,
    })
    setIsOpen(false)
  }, [tempDates, tempRange, onChange])

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const nextMonth = new Date(prev)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      return nextMonth
    })
  }, [])

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth(prev => {
      const prevMonth = new Date(prev)
      prevMonth.setMonth(prevMonth.getMonth() - 1)
      return prevMonth
    })
  }, [])

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return 'add date'
    return tempRange === 'exact' 
      ? date.toLocaleDateString() 
      : `${date.toLocaleDateString()} ${tempRange}`
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const days = []
    const currentMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    // Add days from previous month to fill first week
    const firstDayOfWeek = currentMonthDate.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(currentMonthDate)
      prevDate.setDate(prevDate.getDate() - i - 1)
      days.push({ date: prevDate, isCurrentMonth: false, isDisabled: true })
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), i)
      days.push({ date, isCurrentMonth: true, isDisabled: date < today })
    }
    
    // Add days from next month to fill last week
    const lastDayOfWeek = lastDay.getDay()
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const nextDate = new Date(lastDay)
      nextDate.setDate(lastDay.getDate() + i)
      days.push({ date: nextDate, isCurrentMonth: false, isDisabled: true })
    }
    
    return days
  }

  const isDateInRange = (date: Date) => {
    if (!tempDates.startDate || !tempDates.endDate) return false
    return date >= tempDates.startDate && date <= tempDates.endDate
  }

  const isDateSelected = (date: Date) => {
    return date.getTime() === tempDates.startDate?.getTime() || 
           date.getTime() === tempDates.endDate?.getTime()
  }

  const handleDatePress = (date: Date) => {
    if (!tempDates.startDate || (tempDates.startDate && tempDates.endDate)) {
      // Start new selection
      setTempDates({ startDate: date, endDate: null })
    } else {
      // Complete selection
      if (date > tempDates.startDate!) {
        setTempDates({ startDate: tempDates.startDate, endDate: date })
      } else {
        setTempDates({ startDate: date, endDate: tempDates.startDate })
      }
    }
  }

  return (
    <View style={{ position: 'relative' }}>
      {/* Date Buttons */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={{
            flex: 1,
            backgroundColor: '#1B1B1B',
            borderRadius: 12,
            padding: spacing.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#292929',
          }}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: spacing.xs }}>
            check in
          </Text>
          <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
            {formatDateForDisplay(tempDates.startDate)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={{
            flex: 1,
            backgroundColor: '#1B1B1B',
            borderRadius: 12,
            padding: spacing.md,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#292929',
          }}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 14, marginTop: spacing.xs }}>
            check out
          </Text>
          <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
            {formatDateForDisplay(tempDates.endDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#000000' }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
            paddingBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: '#292929',
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
              Select Dates
            </Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View style={{ flex: 1, padding: spacing.lg }}>
            <View style={{
              backgroundColor: '#1B1B1B',
              borderRadius: 12,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: '#292929',
            }}>
              {/* Month Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}>
                <TouchableOpacity onPress={goToPrevMonth}>
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={goToNextMonth}>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Days of Week */}
              <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <View key={day} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: '#A0A0A0', fontSize: 12 }}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {generateCalendarDays().map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => !day.isDisabled && handleDatePress(day.date)}
                    style={{
                      width: '14.28%',
                      aspectRatio: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: day.isDisabled ? 0.3 : 1,
                    }}
                  >
                    <View style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: isDateSelected(day.date) 
                        ? '#FFFFFF' 
                        : isDateInRange(day.date) 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'transparent',
                    }}>
                      <Text style={{
                        color: isDateSelected(day.date) 
                          ? '#000000' 
                          : day.isCurrentMonth 
                            ? '#FFFFFF' 
                            : '#666666',
                        fontSize: 14,
                        fontWeight: isDateSelected(day.date) ? 'bold' : 'normal',
                      }}>
                        {day.date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={{ padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#292929' }}>
            <TouchableOpacity
              onPress={handleContinue}
              style={{
                backgroundColor: '#404040',
                borderRadius: 12,
                paddingVertical: spacing.md,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
} 