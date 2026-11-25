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
import {
  calculateMetadata as calculateFootballMetadata,
  FALLBACK_FRAMES as FOOTBALL_FRAMES,
  FPS as FOOTBALL_FPS,
  HEIGHT as FOOTBALL_HEIGHT,
  TopFootballPlayers,
  WIDTH as FOOTBALL_WIDTH,
} from "./football-players/MainVideo";
import {
  calculateMetadata as calculateLuxuryCarsMetadata,
  FALLBACK_FRAMES as LUXURY_CARS_FRAMES,
  FPS as LUXURY_CARS_FPS,
  HEIGHT as LUXURY_CARS_HEIGHT,
  TopLuxuryCars,
  WIDTH as LUXURY_CARS_WIDTH,
} from "./luxury-cars/MainVideo";
import {
  calculateMetadata as calculateCricketMetadata,
  FALLBACK_FRAMES as CRICKET_FRAMES,
  FPS as CRICKET_FPS,
  HEIGHT as CRICKET_HEIGHT,
  TopCricketPlayers,
  WIDTH as CRICKET_WIDTH,
} from "./cricket-players/MainVideo";
import {
  calculateMetadata as calculateFastestHumansMetadata,
  FALLBACK_FRAMES as FASTEST_HUMANS_FRAMES,
  FPS as FASTEST_HUMANS_FPS,
  HEIGHT as FASTEST_HUMANS_HEIGHT,
  TopFastestHumans,
  WIDTH as FASTEST_HUMANS_WIDTH,
} from "./fastest-humans/MainVideo";
import {
  calculateMetadata as calculateLuxuryBikesMetadata,
  FALLBACK_FRAMES as LUXURY_BIKES_FRAMES,
  FPS as LUXURY_BIKES_FPS,
  HEIGHT as LUXURY_BIKES_HEIGHT,
  TopLuxuryBikes,
  WIDTH as LUXURY_BIKES_WIDTH,
} from "./luxury-bikes/MainVideo";
import {
  calculateMetadata as calculateWarplanesMetadata,
  FALLBACK_FRAMES as WARPLANES_FRAMES,
  FPS as WARPLANES_FPS,
  HEIGHT as WARPLANES_HEIGHT,
  TopWarplanes,
  WIDTH as WARPLANES_WIDTH,
} from "./warplanes/MainVideo";
import {
  calculateMetadata as calculateLargestCompaniesMetadata,
  FALLBACK_FRAMES as LARGEST_COMPANIES_FRAMES,
  FPS as LARGEST_COMPANIES_FPS,
  HEIGHT as LARGEST_COMPANIES_HEIGHT,
  TopLargestCompanies,
  WIDTH as LARGEST_COMPANIES_WIDTH,
} from "./largest-companies/MainVideo";
import {
  calculateMetadata as calculateLargestEconomiesMetadata,
  FALLBACK_FRAMES as LARGEST_ECONOMIES_FRAMES,
  FPS as LARGEST_ECONOMIES_FPS,
  HEIGHT as LARGEST_ECONOMIES_HEIGHT,
  TopLargestEconomies,
  WIDTH as LARGEST_ECONOMIES_WIDTH,
} from "./largest-economies/MainVideo";
import {
  BeautifulCapitals,
  calculateMetadata as calculateBeautifulCapitalsMetadata,
  FALLBACK_FRAMES as BEAUTIFUL_CAPITALS_FRAMES,
  FPS as BEAUTIFUL_CAPITALS_FPS,
  HEIGHT as BEAUTIFUL_CAPITALS_HEIGHT,
  WIDTH as BEAUTIFUL_CAPITALS_WIDTH,
} from "./beautiful-capitals/CapitalsVideo";
import {
  calculateMetadata as calculateEducatedCountriesMetadata,
  FALLBACK_FRAMES as EDUCATED_COUNTRIES_FRAMES,
  FPS as EDUCATED_COUNTRIES_FPS,
  HEIGHT as EDUCATED_COUNTRIES_HEIGHT,
  TopEducatedCountries,
  WIDTH as EDUCATED_COUNTRIES_WIDTH,
} from "./educated-countries/MainVideo";
import {
  calculateMetadata as calculateExpensiveThingsMetadata,
  FALLBACK_FRAMES as EXPENSIVE_THINGS_FRAMES,
  FPS as EXPENSIVE_THINGS_FPS,
  HEIGHT as EXPENSIVE_THINGS_HEIGHT,
  TopExpensiveThings,
  WIDTH as EXPENSIVE_THINGS_WIDTH,
} from "./expensive-things/MainVideo";
import {
  calculateMetadata as calculateBillionaireMansionsMetadata,
  FALLBACK_FRAMES as BILLIONAIRE_MANSIONS_FRAMES,
  FPS as BILLIONAIRE_MANSIONS_FPS,
  HEIGHT as BILLIONAIRE_MANSIONS_HEIGHT,
  TopBillionaireMansions,
  WIDTH as BILLIONAIRE_MANSIONS_WIDTH,
} from "./billionaire-mansions/MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TopEducatedCountries"
        component={TopEducatedCountries}
        durationInFrames={EDUCATED_COUNTRIES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={EDUCATED_COUNTRIES_FPS}
        width={EDUCATED_COUNTRIES_WIDTH}
        height={EDUCATED_COUNTRIES_HEIGHT}
        defaultProps={{ sceneFrames: EDUCATED_COUNTRIES_FRAMES }}
        calculateMetadata={calculateEducatedCountriesMetadata}
      />
      <Composition
        id="TopBeautifulCapitals"
        component={BeautifulCapitals}
        durationInFrames={BEAUTIFUL_CAPITALS_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={BEAUTIFUL_CAPITALS_FPS}
        width={BEAUTIFUL_CAPITALS_WIDTH}
        height={BEAUTIFUL_CAPITALS_HEIGHT}
        defaultProps={{ sceneFrames: BEAUTIFUL_CAPITALS_FRAMES }}
        calculateMetadata={calculateBeautifulCapitalsMetadata}
      />
      <Composition
        id="TopLargestEconomies"
        component={TopLargestEconomies}
        durationInFrames={LARGEST_ECONOMIES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={LARGEST_ECONOMIES_FPS}
        width={LARGEST_ECONOMIES_WIDTH}
        height={LARGEST_ECONOMIES_HEIGHT}
        defaultProps={{ sceneFrames: LARGEST_ECONOMIES_FRAMES }}
        calculateMetadata={calculateLargestEconomiesMetadata}
      />
      <Composition
        id="TopLargestCompanies"
        component={TopLargestCompanies}
        durationInFrames={LARGEST_COMPANIES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={LARGEST_COMPANIES_FPS}
        width={LARGEST_COMPANIES_WIDTH}
        height={LARGEST_COMPANIES_HEIGHT}
        defaultProps={{ sceneFrames: LARGEST_COMPANIES_FRAMES }}
        calculateMetadata={calculateLargestCompaniesMetadata}
      />
      <Composition
        id="TopWarplanes"
        component={TopWarplanes}
        durationInFrames={WARPLANES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={WARPLANES_FPS}
        width={WARPLANES_WIDTH}
        height={WARPLANES_HEIGHT}
        defaultProps={{ sceneFrames: WARPLANES_FRAMES }}
        calculateMetadata={calculateWarplanesMetadata}
      />
      <Composition
        id="TopCricketPlayers"
        component={TopCricketPlayers}
        durationInFrames={CRICKET_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={CRICKET_FPS}
        width={CRICKET_WIDTH}
        height={CRICKET_HEIGHT}
        defaultProps={{ sceneFrames: CRICKET_FRAMES }}
        calculateMetadata={calculateCricketMetadata}
      />
      <Composition
        id="TopFastestHumans"
        component={TopFastestHumans}
        durationInFrames={FASTEST_HUMANS_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={FASTEST_HUMANS_FPS}
        width={FASTEST_HUMANS_WIDTH}
        height={FASTEST_HUMANS_HEIGHT}
        defaultProps={{ sceneFrames: FASTEST_HUMANS_FRAMES }}
        calculateMetadata={calculateFastestHumansMetadata}
      />
      <Composition
        id="TopExpensiveThings"
        component={TopExpensiveThings}
        durationInFrames={EXPENSIVE_THINGS_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={EXPENSIVE_THINGS_FPS}
        width={EXPENSIVE_THINGS_WIDTH}
        height={EXPENSIVE_THINGS_HEIGHT}
        defaultProps={{ sceneFrames: EXPENSIVE_THINGS_FRAMES }}
        calculateMetadata={calculateExpensiveThingsMetadata}
      />
      <Composition
        id="TopBillionaireMansions"
        component={TopBillionaireMansions}
        durationInFrames={BILLIONAIRE_MANSIONS_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={BILLIONAIRE_MANSIONS_FPS}
        width={BILLIONAIRE_MANSIONS_WIDTH}
        height={BILLIONAIRE_MANSIONS_HEIGHT}
        defaultProps={{ sceneFrames: BILLIONAIRE_MANSIONS_FRAMES }}
        calculateMetadata={calculateBillionaireMansionsMetadata}
      />
      <Composition
        id="TopLuxuryBikes"
        component={TopLuxuryBikes}
        durationInFrames={LUXURY_BIKES_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={LUXURY_BIKES_FPS}
        width={LUXURY_BIKES_WIDTH}
        height={LUXURY_BIKES_HEIGHT}
        defaultProps={{ sceneFrames: LUXURY_BIKES_FRAMES }}
        calculateMetadata={calculateLuxuryBikesMetadata}
      />
      <Composition
        id="TopLuxuryCars"
        component={TopLuxuryCars}
        durationInFrames={LUXURY_CARS_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={LUXURY_CARS_FPS}
        width={LUXURY_CARS_WIDTH}
        height={LUXURY_CARS_HEIGHT}
        defaultProps={{ sceneFrames: LUXURY_CARS_FRAMES }}
        calculateMetadata={calculateLuxuryCarsMetadata}
      />
      <Composition
        id="TopFootballPlayers"
        component={TopFootballPlayers}
        durationInFrames={FOOTBALL_FRAMES.reduce(
          (sum, frames) => sum + frames,
          0,
        )}
        fps={FOOTBALL_FPS}
        width={FOOTBALL_WIDTH}
        height={FOOTBALL_HEIGHT}
        defaultProps={{ sceneFrames: FOOTBALL_FRAMES }}
        calculateMetadata={calculateFootballMetadata}
      />
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
