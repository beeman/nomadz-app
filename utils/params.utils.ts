export const prepareRequestParams = (params: any, userProfile: any) => {
  const preparedParams = { ...params };

  // Add residency if available
  if (userProfile?.residency && !userProfile.residency.startsWith('unknown_residency_')) {
    preparedParams.residency = userProfile.residency.toLowerCase();
  }
  
  preparedParams.guests = (preparedParams.guests && Object.keys(preparedParams.guests).length) ? [preparedParams.guests] : [{ adults: 1 }];

  return preparedParams;
}; 