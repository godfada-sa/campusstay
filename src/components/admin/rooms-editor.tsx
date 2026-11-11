"use client";

import { useState } from "react";

export type RoomInput = {
  name: string;
  capacity: number;
  price_per_semester: number;
  utility_fee: number;
  available_beds: number;
  description: string;
};

const blank: RoomInput = {
  name: "",
  capacity: 2,
  price_per_semester: 0,
  utility_fee: 0,
  available_beds: 0,
  description: "",
};

export function RoomsEditor({ initial }: { initial: RoomInput[] }) {
  const [rooms, setRooms] = useState<RoomInput[]>(initial);

  function update(index: number, patch: Partial<RoomInput>) {
    setRooms((current) =>
      current.map((room, i) => (i === index ? { ...room, ...patch } : room)),
    );
  }

  return (
    <div>
      <input type="hidden" name="rooms" value={JSON.stringify(rooms)} />

      {rooms.length === 0 ? (
        <p className="border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
          No room types yet. Add the rooms a student can ask about.
        </p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room, index) => (
            <div key={index} className="border border-line bg-paper/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase">
                  Room {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setRooms((current) => current.filter((_, i) => i !== index))
                  }
                  className="text-xs text-[#8c3416] underline underline-offset-2"
                >
                  Remove
                </button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="label">Room name</label>
                  <input
                    value={room.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                    placeholder="Single room"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Sleeps</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={room.capacity}
                    onChange={(event) =>
                      update(index, { capacity: Number(event.target.value) })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Rent / semester (GH₵)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={room.price_per_semester}
                    onChange={(event) =>
                      update(index, {
                        price_per_semester: Number(event.target.value),
                      })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Utility fee (GH₵)</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={room.utility_fee}
                    onChange={(event) =>
                      update(index, { utility_fee: Number(event.target.value) })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Beds free</label>
                  <input
                    type="number"
                    min={0}
                    value={room.available_beds}
                    onChange={(event) =>
                      update(index, { available_beds: Number(event.target.value) })
                    }
                    className="input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Room note</label>
                  <input
                    value={room.description}
                    onChange={(event) =>
                      update(index, { description: event.target.value })
                    }
                    placeholder="Two beds, shared bathroom"
                    className="input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setRooms((current) => [...current, { ...blank }])}
        className="btn btn-outline mt-4"
      >
        Add room type
      </button>
    </div>
  );
}
