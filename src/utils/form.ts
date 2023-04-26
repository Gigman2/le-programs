export const handleChange = (
    val: string | number | boolean | string[] | number[] | File | Record<string, string>,
    key: string,
    fields: any,
    setFields: React.Dispatch<React.SetStateAction<any>>
) => {
    const currentValues = { ...fields }
    currentValues[key] = val
    setFields(currentValues)
}

export const validate = (
    requiredKeys: string[],
    errors: Record<string, string | undefined>,
    fields: any,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>
) => {
    const pageErrors = { ...errors }
    let hasErrors = false
    requiredKeys.forEach(field => {
        if (fields[field] === '' || fields[field] === undefined) {
            pageErrors[field] = `${field} is required `
            hasErrors = true
        } else {
            pageErrors[field] = undefined
        }
    })
    setErrors(pageErrors)
    return hasErrors
}