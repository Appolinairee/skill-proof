"use client"

import { useState } from "react"
import { format } from "date-fns"
import Button from "./button/Button"
import { Calendar } from "./Calendar"

export default function DateTimePicker() {
    const today = new Date()
    const [date, setDate] = useState<Date>(today)
    const [time, setTime] = useState<string | null>(null)

    const timeSlots = [
        { time: "09:00", available: false },
        { time: "09:30", available: false },
        { time: "10:00", available: true },
        { time: "10:30", available: true },
        { time: "11:00", available: true },
        { time: "11:30", available: true },
        { time: "12:00", available: false },
        { time: "12:30", available: true },
        { time: "13:00", available: true },
        { time: "13:30", available: true },
        { time: "14:00", available: true },
        { time: "14:30", available: false },
        { time: "15:00", available: false },
        { time: "15:30", available: true },
        { time: "16:00", available: true },
        { time: "16:30", available: true },
        { time: "17:00", available: true },
        { time: "17:30", available: true },
    ]

    return (
        <div>
            <div className="rounded-md border">
                <div className="flex max-sm:flex-col">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            if (newDate) {
                                setDate(newDate)
                                setTime(null)
                            }
                        }}
                        className="p-2 sm:pe-5"
                        disabled={[
                            { before: today },
                        ]}
                    />

                    <div className="relative w-full max-sm:h-48 sm:w-40">
                        <div className="absolute inset-0 py-4 max-sm:border-t sm:border-s overflow-y-auto h-full custom-scrollbar">
                            <div className="space-y-3 px-5">
                                <div className="flex h-5 items-center">
                                    <p className="text-sm font-medium">
                                        {format(date, "EEEE, d")}
                                    </p>
                                </div>
                                <div className="grid gap-1.5 max-sm:grid-cols-2">
                                    {timeSlots.map(({ time: timeSlot, available }) => (
                                        <Button
                                            key={timeSlot}
                                            className={time === timeSlot ? "primary-btn text-sm" : "border-btn text-sm"}
                                            onClick={() => setTime(timeSlot)}
                                            disabled={!available}
                                        >
                                            {timeSlot}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
