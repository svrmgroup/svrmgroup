import { useEffect, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY, joinPhone, splitPhone } from "@/lib/countryCodes";

interface Props {
  value: string;
  onChange: (fullNumber: string) => void;
  /** Class applied to both the country select and the number input. */
  className?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  ariaLabel?: string;
}

/**
 * Country-code select + number input. Emits a single E.164-style string
 * (e.g. "+27821234567") so everything downstream (WhatsApp links, invoices,
 * admin console) can resolve the guest's country.
 */
const PhoneField = ({ value, onChange, className = "", placeholder = "Phone number", id, required, ariaLabel = "Phone number" }: Props) => {
  const initial = splitPhone(value);
  const [dial, setDial] = useState(initial.dial || DEFAULT_COUNTRY.dial);
  const [local, setLocal] = useState(initial.local);

  // Keep in sync when the parent resets the field (e.g. after submit).
  useEffect(() => {
    if (!value) { setLocal(""); return; }
    const s = splitPhone(value);
    if (joinPhone(s.dial, s.local) !== joinPhone(dial, local)) {
      setDial(s.dial); setLocal(s.local);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const push = (d: string, l: string) => {
    setDial(d); setLocal(l);
    onChange(joinPhone(d, l));
  };

  return (
    <div className="flex gap-2">
      <select
        aria-label="Country code"
        value={dial}
        onChange={(e) => push(e.target.value, local)}
        className={`${className} shrink-0 w-[7.5rem]`}
      >
        {COUNTRIES.map((c) => (
          <option key={c.iso} value={c.dial}>{`${c.flag} ${c.dial}`}</option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required={required}
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={local}
        maxLength={20}
        onChange={(e) => push(dial, e.target.value)}
        className={`${className} flex-1 min-w-0`}
      />
    </div>
  );
};

export default PhoneField;
