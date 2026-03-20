export const AmenitiesStep = ({ form, update }: any) => {
  const items = [
    "hasLaundry",
    "hasWifi",
    "hasCarParking",
    "hasKidsPlayArea",
    "hasCctv",
    "hasGym",
    "isNewBuilding",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((key) => (
        <label
          key={key}
          className="flex items-center gap-2 border p-3 rounded-lg"
        >
          <input
            type="checkbox"
            checked={form[key]}
            onChange={(e) => update(key, e.target.checked)}
          />
          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
        </label>
      ))}
    </div>
  );
};
