export const isBase64 = (str: string): boolean => {
  const base64Regex = /^data:image\/(jpeg|jpg|png);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(str);
};