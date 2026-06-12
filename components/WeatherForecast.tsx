"use client";

import { useCallback, useEffect, useState } from "react";
import {
  detectLocation,
  fetchForecast,
  refineLocation,
  saveLocation,
  type WeatherDay,
  type WeatherHour,
  type WeatherLocation,
} from "@/lib/weather";

type WeatherState =
  | { status: "loading" }
  | { status: "ready"; location: WeatherLocation; days: WeatherDay[] }
  | { status: "error" };

function RainPill({ text }: { text: string }) {
  return (
    <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-medium text-[#F5DCDC]">
      {text}
    </span>
  );
}

function HourlyRain({ hours }: { hours: WeatherHour[] }) {
  const now = Date.now();
  const visibleHours = hours.filter(
    (hour) => new Date(hour.time).getTime() >= now - 60 * 60 * 1000,
  );
  const timeline = visibleHours.length > 0 ? visibleHours : hours;

  return (
    <div className="scroll-chips mt-1 flex gap-1 overflow-x-auto pb-0.5">
      {timeline.map((hour) => (
          <div
            key={hour.time}
            className="min-w-[4.5rem] shrink-0 rounded-[8px] bg-[#F5EFED] px-2 py-1.5 text-center"
            title={`${hour.description}, ${hour.probability}% rain, ${hour.precipitation.toFixed(1)}mm`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A5555]">
              {hour.label}
            </p>
            <p className="text-base leading-none">{hour.emoji}</p>
            <p className="mt-0.5 text-[11px] font-medium text-[#3D1515]">
              {hour.probability}%
            </p>
            <p className="text-[10px] font-semibold text-[#A07070]">
              {hour.precipitation.toFixed(1)}mm
            </p>
          </div>
      ))}
    </div>
  );
}

function DayCard({ day }: { day: WeatherDay }) {
  return (
    <div className="rounded-[8px] bg-[#F5EFED] px-2 py-1 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#7A4444]">
        {day.label}
      </p>
      <div className="flex items-center justify-center gap-1 leading-none">
        <span className="text-xl">{day.emoji}</span>
        <p className="leading-tight">
          <span className="text-sm font-medium text-[#3D1515]">{day.high}°</span>
          <span className="text-sm text-[#8A5555]"> / {day.low}°</span>
        </p>
      </div>
      <p className="truncate text-[10px] font-semibold text-[#7A4444]">
        {day.description}
      </p>
    </div>
  );
}

function WeatherShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[12px] bg-[#5C2626] p-2 sm:p-2.5">{children}</div>
  );
}

export default function WeatherForecast() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  const [showTomorrowHours, setShowTomorrowHours] = useState(false);

  const loadWeather = useCallback(async (location: WeatherLocation) => {
    const days = await fetchForecast(location);
    saveLocation(location);
    setState({ status: "ready", location, days });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const location = await detectLocation();
        if (cancelled) return;
        await loadWeather(location);

        const precise = await refineLocation();
        if (cancelled || !precise) return;

        const moved =
          Math.abs(precise.latitude - location.latitude) > 0.05 ||
          Math.abs(precise.longitude - location.longitude) > 0.05;

        if (moved) {
          await loadWeather(precise);
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [loadWeather]);

  if (state.status === "loading") {
    return (
      <WeatherShell>
        <p className="py-1 text-center text-xs font-semibold text-[#F5DCDC]/70">
          Checking the skies…
        </p>
      </WeatherShell>
    );
  }

  if (state.status === "error") {
    return (
      <WeatherShell>
        <p className="py-1 text-center text-xs font-semibold text-[#F5DCDC]/70">
          Weather is taking a little nap
        </p>
      </WeatherShell>
    );
  }

  return (
    <WeatherShell>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-[#F5DCDC]">🌤️ Weather</p>
        <p className="min-w-0 truncate text-[10px] font-semibold text-[#C4A0A0]">
          {state.location.name}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {state.days.map((day) => (
          <DayCard key={day.date} day={day} />
        ))}
      </div>

      <div className="mt-1.5 space-y-1">
        {state.days.map((day, index) => (
          <div key={`${day.date}-hourly`} className="px-0.5 py-0.5">
            {index === 0 ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#F5DCDC]">
                    Today rain by hour
                  </p>
                  <RainPill text={day.rainSummary} />
                </div>
                <HourlyRain hours={day.hours} />
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowTomorrowHours((show) => !show)}
                  className="flex w-full items-center justify-between gap-2 text-left"
                  aria-expanded={showTomorrowHours}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#F5DCDC]">
                    Tomorrow rain by hour
                  </span>
                  <span className="flex items-center gap-1">
                    {!showTomorrowHours && <RainPill text={day.rainSummary} />}
                    {showTomorrowHours && (
                      <span className="text-[10px] font-semibold text-[#F5DCDC]">
                        Hide
                      </span>
                    )}
                  </span>
                </button>
                {showTomorrowHours && (
                  <>
                    <div className="mt-0.5 flex justify-end">
                      <RainPill text={day.rainSummary} />
                    </div>
                    <HourlyRain hours={day.hours} />
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </WeatherShell>
  );
}
