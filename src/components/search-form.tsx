import { GENDER_OPTIONS, UCC_AREAS } from "@/lib/constants";

type Props = {
  area?: string;
  max?: string;
  gender?: string;
  q?: string;
  compact?: boolean;
};

export function SearchForm({ area, max, gender, q, compact = false }: Props) {
  return (
    <form
      action="/hostels"
      method="get"
      className={
        compact
          ? "grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
      }
    >
      <div>
        <label className="label" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Hostel name or landmark"
          className="input"
        />
      </div>

      <div>
        <label className="label" htmlFor="area">
          Area
        </label>
        <select id="area" name="area" defaultValue={area ?? ""} className="select">
          <option value="">All areas</option>
          {UCC_AREAS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="max">
          Budget
        </label>
        <select id="max" name="max" defaultValue={max ?? ""} className="select">
          <option value="">Any rent</option>
          <option value="3000">Up to GH₵ 3,000</option>
          <option value="4000">Up to GH₵ 4,000</option>
          <option value="5000">Up to GH₵ 5,000</option>
          <option value="6000">Up to GH₵ 6,000</option>
          <option value="7000">Up to GH₵ 7,000</option>
        </select>
      </div>

      <div>
        <label className="label" htmlFor="gender">
          Sharing
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue={gender ?? ""}
          className="select"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={compact ? "flex items-end" : "flex items-end sm:col-span-2 lg:col-span-1"}>
        <button type="submit" className="btn btn-primary w-full lg:w-auto">
          Show hostels
        </button>
      </div>
    </form>
  );
}
