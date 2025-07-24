import { useEffect, useRef } from 'react';

function AddressInput({ onSelectAddress }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "mx" }, // Solo direcciones de México
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (onSelectAddress) {
        onSelectAddress(place);
      }
    });
  }, [onSelectAddress]);

  return (
    <input
      type="text"
      placeholder="Ingresa tu dirección"
      ref={inputRef}
      className="border rounded-lg p-2 w-full"
    />
  );
}

export default AddressInput;
