import { useEffect, useState } from 'react';
import { useFormContext } from 'globalState';

const useRecommendedBusArea = () => {
  const [{ selectedStops }] = useFormContext();
  const [recommendedAreas, setRecommendation] = useState<any>();

  useEffect(() => {
    const smallestAreas: any = [];
    let recommendedBusArea = ['West Midlands'];
    selectedStops.forEach((stop) => {
      let recommendation: any = 'West Midlands';
      if (
        stop.stopBusAreas.includes('Walsall') ||
        stop.stopBusAreas.includes('Sandwell and Dudley') ||
        stop.stopBusAreas.includes('Coventry')
      ) {
        recommendation = stop.stopBusAreas.filter(
          (area: any) => area !== 'West Midlands' && area !== 'Black Country'
        );
        if (recommendation.length === 1) {
          recommendation = recommendation.join();
        }
      } else if (stop.stopBusAreas.includes('Black Country')) {
        recommendation = 'Black Country';
      }
      smallestAreas.push(recommendation);
    });

    const uniqueAreas: string[] = [];
    smallestAreas.forEach((txt: string) => {
      if (!uniqueAreas.includes(txt)) {
        uniqueAreas.push(txt);
      }
    });

    if (smallestAreas.every((area: any) => typeof area === 'object')) {
      recommendedBusArea = ['Walsall', 'Sandwell and Dudley'];
    } else if (smallestAreas.some((area: any) => typeof area === 'object')) {
      const strings = smallestAreas.filter((area: any) => typeof area !== 'object');
      if (strings.includes('West Midlands') || strings.includes('Coventry')) {
        recommendedBusArea = ['West Midlands'];
      } else if (
        strings.includes('Black Country') ||
        (strings.includes('Walsall') && strings.includes('Sandwell and Dudley'))
      ) {
        recommendedBusArea = ['Black Country'];
      }
    } else if (uniqueAreas.length === 1) {
      if (smallestAreas.includes('Walsall')) {
        recommendedBusArea = ['Walsall'];
      } else if (smallestAreas.includes('Sandwell and Dudley')) {
        recommendedBusArea = ['Sandwell and Dudley'];
      } else if (smallestAreas.includes('Coventry')) {
        recommendedBusArea = ['Coventry'];
      } else if (smallestAreas.includes('Black Country')) {
        recommendedBusArea = ['Black Country'];
      }
    }
    setRecommendation(recommendedBusArea);
  }, [selectedStops]);

  return recommendedAreas;
};

export default useRecommendedBusArea;
