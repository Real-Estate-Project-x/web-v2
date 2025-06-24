export const formatPrice = (price : number) : string => {
  const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
  });
  const NGN = formatter.format(price).split('.')[0];
 // setCookie('ogAmount',price?.toString());
  return NGN;
}