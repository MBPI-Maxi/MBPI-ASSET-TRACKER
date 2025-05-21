export default async function formValidation(formData, schema) {
  try {
    await schema.validate(formData, { abortEarly: false });
    
    return {};
    
  } catch (error) {
    const newErrors = {};

    if (error.inner) {
      error.inner.forEach(err => {
        if (!newErrors[err.path]) {
          newErrors[err.path] = err.message;
        }
      });
    }

    return newErrors;
  }
}