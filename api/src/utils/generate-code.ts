export function generateReferralCode(name: string): string {
  return (
    name.toUpperCase().replace(/\s+/g, "").slice(0, 4) +
    "-" +
    Math.random().toString(36).substring(2, 7).toUpperCase()
  );
}

export function generateCouponCode(name: string): string {
  return (
    "25-PERCENT-OFF" +
    "-" +
    name.toUpperCase().replace(/\s+/g, "").slice(0, 4) +
    "-" +
    Math.random().toString(36).substring(2, 7).toUpperCase()
  );
}
