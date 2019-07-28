import React from 'react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated();

const CategoriesSelect = ({ queryCategories, options, setQC }) => {
  const defaultValue = queryCategories.map(c => {
    const label = options.filter(option => c === option.value)[0].label
    return {value: c, label}
  })

  const handleChange = selectedOption => {
    const options = selectedOption ? selectedOption.map(o => o.value) : []
    setQC(options)
  };

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={defaultValue}
      isMulti
      options={options}
      onChange={handleChange}
    />
  );
}

export default CategoriesSelect
