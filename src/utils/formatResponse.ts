export const errorResponse = (data: unknown) => {
  return {
    error: true,
    data: data
  }
}