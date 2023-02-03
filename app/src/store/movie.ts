import { VuexModule, Module, Mutation } from "vuex-class-modules";
import IScene from "@/types/scene";
import IActor from "@/types/actor";
import IMovie from "@/types/movie";

@Module
class MovieModule extends VuexModule {
  current = null as IMovie | null;

  @Mutation
  setName(name: string) {
    if (this.current) this.current.name = name;
  }

  @Mutation
  setDescription(description: string) {
    if (this.current) this.current.description = description;
  }

  @Mutation
  setCurrent(current: IMovie | null) {
    this.current = current;
  }

  @Mutation
  setFavorite(bool: boolean) {
    if (this.current) this.current.favorite = bool;
  }

  @Mutation
  setRating(num: number) {
    if (this.current) this.current.rating = num;
  }

  @Mutation
  setBookmark(dateValue: number | null) {
    if (this.current) this.current.bookmark = dateValue;
  }

  @Mutation
  setFrontCover(cover: {
    _id: string;
    color: string;
    meta: { dimensions: { height: number; width: number } };
  }) {
    if (this.current) {
      this.current.frontCover = cover;
    }
  }

  @Mutation
  setBackCover(cover: { _id: string; meta: { dimensions: { height: number; width: number } } }) {
    if (this.current) {
      this.current.backCover = cover;
    }
  }

  @Mutation
  setSpineCover(cover: { _id: string; meta: { dimensions: { height: number; width: number } } }) {
    if (this.current) {
      this.current.spineCover = cover;
    }
  }

  @Mutation
  setActors(actors: IActor[]) {
    if (this.current) this.current.actors = actors;
  }

  @Mutation
  setScenes(scenes: IScene[]) {
    if (this.current) this.current.scenes = scenes;
  }

  @Mutation
  setDuration(dur: number) {
    if (this.current) this.current.duration = dur;
  }

  @Mutation
  setStudio(studio: any) {
    if (this.current) this.current.studio = studio;
  }

  @Mutation
  setSize(size: number) {
    if (this.current) this.current.size = size;
  }

  @Mutation
  setReleaseDate(val: number | null) {
    if (this.current) this.current.releaseDate = val;
  }

  @Mutation
  setLabels(labels: any) {
    if (this.current) this.current.labels = labels;
  }
}

import store from "./index";
export const movieModule = new MovieModule({ store, name: "movies" });
