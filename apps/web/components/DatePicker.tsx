"use client"

import * as React from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type DateRange } from "react-day-picker"

import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

function parseDateParam(value: string | null): Date | undefined {
  if (!value) {
    return undefined
  }

  const parsedDate = parseISO(value)
  return isValid(parsedDate) ? parsedDate : undefined
}

export function DatePickerWithRange() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const date = React.useMemo<DateRange | undefined>(() => {
    const from = parseDateParam(searchParams.get("from"))
    const to = parseDateParam(searchParams.get("to"))

    if (!from && !to) {
      return undefined
    }

    return { from, to }
  }, [searchParams])

  const setDate = (nextDate: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextDate?.from) {
      params.set("from", format(nextDate.from, "yyyy-MM-dd"))
    } else {
      params.delete("from")
    }

    if (nextDate?.to) {
      params.set("to", format(nextDate.to, "yyyy-MM-dd"))
    } else {
      params.delete("to")
    }

    params.delete("page")

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className="justify-start px-2.5 font-normal"
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={date?.from ?? new Date()}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-2 border-t p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setDate(undefined)}
            disabled={!date?.from && !date?.to}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
