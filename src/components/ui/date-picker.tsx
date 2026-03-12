"use client"

/**
 * DatePicker — a simple date picker built on a native <input type="date">
 * wrapped in a styled Popover.
 */
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"

/** Format a Date as "dd/MM/yyyy" (pt-BR) */
function formatBR(date: Date): string {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** Format a Date as "yyyy-MM-dd" for input[type="date"] */
function toInputValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

interface DatePickerProps {
    value?: Date | null;
    onChange?: (date: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Selecionar data",
    disabled = false,
    minDate,
    maxDate,
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const formatted = value instanceof Date && !isNaN(value.getTime())
        ? formatBR(value)
        : null;

    const inputValue = value instanceof Date && !isNaN(value.getTime())
        ? toInputValue(value)
        : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (!raw) { onChange?.(null); return; }
        // Parse as local date (avoid UTC offset shifting)
        const [y, m, d] = raw.split('-').map(Number);
        const parsed = new Date(y, m - 1, d);
        if (!isNaN(parsed.getTime())) {
            onChange?.(parsed);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {formatted ?? placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
                <input
                    type="date"
                    value={inputValue}
                    onChange={handleChange}
                    min={minDate ? toInputValue(minDate) : undefined}
                    max={maxDate ? toInputValue(maxDate) : undefined}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {value && (
                    <button
                        onClick={() => { onChange?.(null); setOpen(false); }}
                        className="mt-2 w-full text-xs text-slate-400 hover:text-red-500 text-center transition-colors"
                    >
                        Limpar
                    </button>
                )}
            </PopoverContent>
        </Popover>
    );
}
