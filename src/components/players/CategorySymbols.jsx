export default function CategorySymbols({ genders }) {
  return ['F', 'M']
    .filter((gender) => genders.has(gender))
    .map((gender) => (
      <span
        key={gender}
        aria-label={gender === 'F' ? 'Femmes' : 'Hommes'}
        style={{ color: gender === 'F' ? '#d14f9b' : '#2386c0', fontWeight: 700 }}
      >
        {gender === 'F' ? '♀' : '♂'}{' '}
      </span>
    ));
}
