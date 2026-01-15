const mapPackagesToPlans = (offerings: any, plans: any) => {
  if (!offerings?.current?.packages) return [];

  const result = offerings.current.packages.map((pkg: any) => {
    const relatedPlan = plans.find((plan: any) => plan.id === pkg.identifier);
    return {
      id: pkg.identifier,
      title: pkg.product.title,
      price: pkg.product.price, // adjust for your currency
      originalPrice: relatedPlan?.originalPrice || "",
      recommended: relatedPlan?.recommended || false, // set logic if needed
      features: relatedPlan?.features || [],
      package: pkg, // include the original package for purchase reference
    };
  });

  return result;
};

export default mapPackagesToPlans;
