import { Composition } from "remotion";
import { ShowcaseIntro } from "./ShowcaseIntro";
import { MufaqarIntro } from "./mufaqar/MufaqarIntro";
import { MufaqarVertical } from "./vertical/MufaqarVertical";
import { V_FPS, V_HEIGHT, V_TOTAL, V_WIDTH } from "./vertical/timeline";
import {
  calculateMetadata as calculateRichestMetadata,
  FPS as RICHEST_FPS,
  HEIGHT as RICHEST_HEIGHT,
  RichestCountries,
  WIDTH as RICHEST_WIDTH,
} from "./countries/RichestCountries";
import {
  calculateMetadata as calculateSteelMetadata,
  FPS as STEEL_FPS,
  HEIGHT as STEEL_HEIGHT,
  SteelProducers,
  WIDTH as STEEL_WIDTH,
} from "./steel/SteelProducers";
import {
  calculateMetadata as calculateBillionairesMetadata,
  FALLBACK_FRAMES as BILLIONAIRE_FRAMES,
  FPS as BILLIONAIRE_FPS,
  HEIGHT as BILLIONAIRE_HEIGHT,
  RichestPeople,
  WIDTH as BILLIONAIRE_WIDTH,
} from "./billionaires/MainVideo";
import {
  calculateMetadata as calculateCitiesMetadata,
  FALLBACK_FRAMES as CITY_FRAMES,
  FPS as CITY_FPS,
  HEIGHT as CITY_HEIGHT,
  MostExpensiveCities,
  WIDTH as CITY_WIDTH,
} from "./cities/MainVideo";
import {
  calculateMetadata as calculatePopulationMetadata,
  FALLBACK_FRAMES as POPULATION_FRAMES,
  FPS as POPULATION_FPS,
  HEIGHT as POPULATION_HEIGHT,
  MostPopulousCountries,
  WIDTH as POPULATION_WIDTH,
} from "./population/MainVideo";
import {
  calculateMetadata as calculateArmiesMetadata,
  FALLBACK_FRAMES as ARMY_FRAMES,
  FPS as ARMY_FPS,
  HEIGHT as ARMY_HEIGHT,
  MostDangerousArmies,
  WIDTH as ARMY_WIDTH,
} from "./armies/MainVideo";
import {
  calculateMetadata as calculateUniversityMetadata,
  FALLBACK_FRAMES as UNIVERSITY_FRAMES,
  FPS as UNIVERSITY_FPS,
  HEIGHT as UNIVERSITY_HEIGHT,
  TopUniversities,
  WIDTH as UNIVERSITY_WIDTH,
  WIDE_HEIGHT as UNIVERSITY_WIDE_HEIGHT,
  WIDE_WIDTH as UNIVERSITY_WIDE_WIDTH,
} from "./universities/MainVideo";
import {
  calculateMetadata as calculatePlacesMetadata,
  FALLBACK_FRAMES as PLACES_FRAMES,
  FPS as PLACES_FPS,
  HEIGHT as PLACES_HEIGHT,
  BeautifulPlaces,
  WIDTH as PLACES_WIDTH,
} from "./places/PlacesVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BeautifulPlaces"
        component={BeautifulPlaces}
        durationInFrames={PLACES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={PLACES_FPS}
        width={PLACES_WIDTH}
        height={PLACES_HEIGHT}
        defaultProps={{ sceneFrames: PLACES_FRAMES }}
        calculateMetadata={calculatePlacesMetadata}
      />
      <Composition
        id="MostDangerousArmies"
        component={MostDangerousArmies}
        durationInFrames={ARMY_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={ARMY_FPS}
        width={ARMY_WIDTH}
        height={ARMY_HEIGHT}
        defaultProps={{ sceneFrames: ARMY_FRAMES }}
        calculateMetadata={calculateArmiesMetadata}
      />
      <Composition
        id="TopUniversities"
        component={TopUniversities}
        durationInFrames={UNIVERSITY_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={UNIVERSITY_FPS}
        width={UNIVERSITY_WIDTH}
        height={UNIVERSITY_HEIGHT}
        defaultProps={{ sceneFrames: UNIVERSITY_FRAMES, format: "portrait" }}
        calculateMetadata={calculateUniversityMetadata}
      />
      <Composition
        id="TopUniversitiesTablet"
        component={TopUniversities}
        durationInFrames={UNIVERSITY_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={UNIVERSITY_FPS}
        width={UNIVERSITY_WIDE_WIDTH}
        height={UNIVERSITY_WIDE_HEIGHT}
        defaultProps={{ sceneFrames: UNIVERSITY_FRAMES, format: "landscape" }}
        calculateMetadata={calculateUniversityMetadata}
      />
      <Composition
        id="MostPopulousCountries"
        component={MostPopulousCountries}
        durationInFrames={POPULATION_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={POPULATION_FPS}
        width={POPULATION_WIDTH}
        height={POPULATION_HEIGHT}
        defaultProps={{ sceneFrames: POPULATION_FRAMES }}
        calculateMetadata={calculatePopulationMetadata}
      />
      <Composition
        id="MostExpensiveCities"
        component={MostExpensiveCities}
        durationInFrames={CITY_FRAMES.reduce((sum, frames) => sum + frames, 0)}
        fps={CITY_FPS}
        width={CITY_WIDTH}
        height={CITY_HEIGHT}
        defaultProps={{ sceneFrames: CITY_FRAMES }}
        calculateMetadata={calculateCitiesMetadata}
      />
      <Composition
        id="RichestPeople"
        component={RichestPeople}
        durationInFrames={1761}
        fps={BILLIONAIRE_FPS}
        width={BILLIONAIRE_WIDTH}
        height={BILLIONAIRE_HEIGHT}
        defaultProps={{ sceneFrames: BILLIONAIRE_FRAMES }}
        calculateMetadata={calculateBillionairesMetadata}
      />
      <Composition
        id="SteelProducers"
        component={SteelProducers}
        durationInFrames={1740}
        fps={STEEL_FPS}
        width={STEEL_WIDTH}
        height={STEEL_HEIGHT}
        defaultProps={{ sceneFrames: [295, 443, 294, 390, 318] }}
        calculateMetadata={calculateSteelMetadata}
      />
      <Composition
        id="RichestCountries"
        component={RichestCountries}
        durationInFrames={2280}
        fps={RICHEST_FPS}
        width={RICHEST_WIDTH}
        height={RICHEST_HEIGHT}
        defaultProps={{ sceneFrames: [356, 465, 535, 597, 327] }}
        calculateMetadata={calculateRichestMetadata}
      />
      <Composition
        id="MufaqarVertical"
        component={MufaqarVertical}
        durationInFrames={V_TOTAL}
        fps={V_FPS}
        width={V_WIDTH}
        height={V_HEIGHT}
        defaultProps={{}}
      />
      <Composition
        id="MufaqarIntro"
        component={MufaqarIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="ShowcaseIntro"
        component={ShowcaseIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
