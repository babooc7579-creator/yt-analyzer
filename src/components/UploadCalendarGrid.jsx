import { UPLOAD_CALENDAR_WEEKDAYS } from '../utils/uploadCalendar';

const STATUS_TONES = {
  active: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200',
  candidate: 'border-indigo-500/40 bg-indigo-500/15 text-indigo-200',
  done: 'border-slate-600 bg-slate-800 text-slate-300',
};

export default function UploadCalendarGrid({ days, onSelectDate, selectedDate }) {
  return (
    <div className="overflow-x-auto border border-slate-800">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
          {UPLOAD_CALENDAR_WEEKDAYS.map((weekday, index) => (
            <div key={weekday} className={`px-2 py-2 text-center text-[11px] font-extrabold ${index === 0 ? 'text-rose-300' : index === 6 ? 'text-cyan-300' : 'text-slate-500'}`}>{weekday}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const isSelected = selectedDate === day.dateKey;
            return (
              <button
                key={day.dateKey}
                type="button"
                onClick={() => onSelectDate(day.dateKey)}
                className={`min-h-28 border-b border-r border-slate-800 p-2 text-left align-top transition-colors ${isSelected ? 'bg-amber-400/10 ring-1 ring-inset ring-amber-300' : 'bg-slate-950/30 hover:bg-slate-800/60'} ${day.isCurrentMonth ? '' : 'opacity-40'}`}
                aria-label={`${day.dateKey}, 일정 ${day.items.length}개`}
              >
                <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-black ${day.isToday ? 'bg-amber-300 text-slate-950' : 'text-slate-300'}`}>{day.day}</span>
                <span className="mt-1 block space-y-1">
                  {day.items.slice(0, 3).map((item) => (
                    <span key={`${day.dateKey}-${item.videoId}`} className={`block truncate border px-1.5 py-1 text-[10px] font-bold ${STATUS_TONES[item.statusGroup] || STATUS_TONES.candidate}`} title={item.title}>{item.title}</span>
                  ))}
                  {day.items.length > 3 && <span className="block text-[10px] font-bold text-slate-500">+{day.items.length - 3}개 더</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
