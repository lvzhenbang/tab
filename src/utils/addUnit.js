const addUnit = val => !Number.isNaN(val) ? `${val}px` : `${Number(val)}px`;

export default addUnit;
