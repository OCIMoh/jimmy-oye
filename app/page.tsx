import PosterWall from "@/components/PosterWall";
import SmoothScroll from "@/components/SmoothScroll";
import { SoundProvider } from "@/components/SoundSystem";
import CustomCursor from "@/components/CustomCursor";
import FilmGrain from "@/components/FilmGrain";

export default function HomePage() {
  return (
    <SoundProvider>
      <FilmGrain />
      <CustomCursor />
      <SmoothScroll>
        <PosterWall />
      </SmoothScroll>
    </SoundProvider>
  );
}
